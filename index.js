// cv abusé a chaque reload il disparait
const sectors = [
  { color: '#E33E1C', label: '    CV        ' },
  { color: '#E54666', label: 'ENTRETIEN  ' },
  { color: '#9559CA', label: 'PITCH ' },
  { color: '#5273E0', label: 'IMMERSION ' },
  { color: '#46A758', label: 'PROSPECTION ' },
  { color: '#F76308', label: 'RESEAU ' },
];

const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const spinEl = document.querySelector('#spin');
const ctx = document.querySelector('#wheel').getContext('2d');
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;

const friction = 0.98; // 0.995=soft, 0.99=mid, 0.98=hard //0.991
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians
let OldSector1 = 10; // 10 pour etre sur un nombre different du nombre de secteur
let OldSector2 = 10; //
let testclick = 0;
let dif = 0;
let hide=1;

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

function content(divSelector, value) {
  document.querySelector(divSelector).innerHTML = value;
}
function Setborder(divSelector, value) {

  document.querySelector(divSelector).style.border=value;
}
function Setbgcolor(divSelector, value) 
{
  document.querySelector(divSelector).style.backgroundColor = value;
}

function HideShowElement () 
{
	if (!hide) {
   		document.getElementById('wheel').style.visibility= "visible";
		document.getElementById('spin').style.visibility= "visible";
		hide=1;
	} else {
   		document.getElementById('wheel').style.visibility= "hidden";
		document.getElementById('spin').style.visibility= "hidden";
		hide=0;
	}

}





function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();
  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();
  // BORDER
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.stroke();
  // TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFF';
  ctx.font = '700 18px sans-serif';
  ctx.fillText(sector.label, rad - 10, 10);
  //
  ctx.restore();
}

function rotate() {
  //alert(ang);
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  spinEl.textContent = !angVel ? 'LIVE' : sector.label;
  spinEl.style.background = sector.color;
}

function frame() {
  if (!angVel) return;
  angVel *= friction; // Decrement velocity by friction

  if (angVel < 0.002) {
    const sector = sectors[getIndex()];
    const indexSector = getIndex();
    if (OldSector1 == indexSector || OldSector2 == indexSector) {
      angVel = 0.003;
      //alert('on triche');
      //content('#DisplayDetails','On triche');
    } else {
      angVel = 0; // Bring to stop

      if (OldSector1 == 10) OldSector1 = indexSector;
      else OldSector2 = indexSector;

      //content('#DisplayDetails','');

      //content('#DisplayChoose', document.querySelector('#DisplayChoose').innerHTML + ' ' + sector.label   );
      const namedisplaychose = '#DisplayChoose' + testclick;

      content(namedisplaychose, sector.label);
      Setbgcolor(namedisplaychose, sector.color);
//      Setborder(namedisplaychose, "3px solid; ");
	document.querySelector(namedisplaychose).style.border="2px solid ";
    }

    //alert(ang);
  } else if (angVel < 0.006) {
    const sector = sectors[getIndex()];
    const indexSector = getIndex();
    if (OldSector1 == indexSector || OldSector2 == indexSector) {
      angVel = 0.006;
      //alert('on triche');
      //content('#DisplayDetails','On triche');
    }
  }

  ang += angVel; // Update angle
  ang %= TAU; // Normalize angle
  rotate();
}
function convtopositive(a) {
  if (a < 0) {
    // Multiply number with -1
    // to make it positive
    a = a * -1;
  }
  return a;
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

function reset() {
  testclick = 0;
  OldSector1 = 10;
  OldSector2 = 10;
  //content('#DisplayChoose', '');

  for (let i = 1; i <= 3; i++) {
    const dnametmp = '#DisplayChoose' + i;
    //alert(dnametmp);
    content(dnametmp, '');
    Setbgcolor(dnametmp, '#85bcff');
    document.querySelector(dnametmp).style.border="0px solid ";
  }
}

function init() {
  sectors.forEach(drawSector);
  rotate(); // Initial rotation
  engine(); // Start engine
  spinEl.addEventListener('click', () => {
    if (!angVel) {
      //ang = 0;
      //rotate();
      angVel = rand(0.25, 0.45);

      //alert('testclick'+testclick );
      if (testclick > 2) {
        reset();
      }
      testclick = testclick + 1;
    }
  });
}

init();
