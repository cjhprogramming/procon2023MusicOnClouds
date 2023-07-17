const { Player, stringToDataUrl } = TextAliveApp;

const player = new Player({
  app: { token: "nzkfptPONRk3KkdY" },
  mediaElement: document.querySelector("#media"),
  mediaBannerPosition: "bottom right"
});

//Query selectors
const overlay = document.querySelector("#overlay");
const textContainer = document.querySelector("#text");

const audience = document.querySelector("#audience");

const charac = document.querySelector('#character');
const characCtx = charac.getContext('2d');
const clickCircle = document.querySelector('#clickCircle');

const canvas = document.querySelector("#cloud");

const cloud1 = document.querySelector("#cloud1");
const cloud2 = document.querySelector("#cloud2");
const cloud3 = document.querySelector("#cloud3");

const manipulate = document.querySelector("#manipulate");
const fillCloud = document.querySelector("#fillCloud");
const settings = document.querySelector("#settings");
const rangeBars = document.querySelector("#rangeBars");
const trackRadius = document.querySelector("#trackRadius");
const trackBlur = document.querySelector("#trackBlur");
const trackSpeed = document.querySelector("#trackSpeed");
const replay = document.querySelector("#replay");
const autoDraw = document.querySelector("autoDraw");

const autoDrawing = document.querySelector("#autoDrawing");

const drawButtons = document.querySelector("#drawButtons");
const panel = document.querySelector("#panel");
const panelCtx = panel.getContext('2d');

const screenshotButton = document.querySelector("#screenshotButton");
const screenshotButtonCtx = screenshotButton.getContext('2d');

const nextSong = document.querySelector("#nextSong");
const previousSong = document.querySelector("#previousSong");
const slideList = document.querySelector("#slideList");
const slide = document.querySelector("#slide");

const lightSky = document.querySelector("#lightSky");

const startBg = document.querySelector("#startBg");
const startTriangle = startButton.querySelector("#startTriangle");

const tracking = document.querySelector("#tracking");

//Image sources
const openPanel = document.createElement('img');
openPanel.src = "images/openPanel.png";
const closePanel = document.createElement('img');
closePanel.src = "images/closePanel.png";
const screenshotMode = document.createElement('img');
screenshotMode.src = "images/screenshotMode.png";
const screenshotBack = document.createElement('img');
screenshotBack.src = "images/screenshotBack.png";

const directionName = ["right", "back", "left", "front"];
const statusName = ["Stand", "Walk", "Board"];
const statusOffsprings = [1, 5, 3];
const characSprites = new Array();
for(var i = 0; i<4; i++){
  characSprites[i] = new Array();
  for(var j = 0; j<3; j++){
    characSprites[i][j] = new Array();
    for(var k = 0; k<statusOffsprings[j]; k++){
      characSprites[i][j][k] = document.createElement('img');
      if (j==0){
        characSprites[i][j][k].src = "animation/"+directionName[i]+statusName[j]+".png";
      }
      else {
        characSprites[i][j][k].src = "animation/"+directionName[i]+statusName[j]+(k+1)+".png";
      }
    }
  }
}

//Variables
let b, c;
var mobile = false;
var canPlay = false;
var nowPlaying = false;
var lyricStat = 1;
var characStat = 0, characDirection = 3;
var willTrack = true;
var autoPlay = false;
var selectedRadius = trackRadius.value, selectedBlur = trackBlur.value, selectedSpeed = trackSpeed.value; 
var colorSeq = 0;
var radius = 80, angle = 0;

function isMobile() {
  var mobiles = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return mobiles;
}
mobile = isMobile();
if (!mobile){
  tracking.style.overflow = "hidden";
  tracking.style.display = "none";
  tracking.style.visibility = "hidden";
}

var xposit = canvas.offsetWidth/2-charac.offsetWidth/2;
var yposit = canvas.offsetHeight/2-charac.offsetHeight/2;
charac.style.transitionDuration = "0s";
charac.style.transform = "translate("+ xposit + "px," + yposit + "px)";


//Related to music play
player.addListener({
  onAppReady(app) {
    if (!app.songUrl) {
      document.querySelector("#media").className = "disabled";
    }
    overlay.className = "disabled";
  },

  onAppMediaChange() {
    resetChars();
  },

  onVideoReady(video) {
    c = null;
  },

  onTimerReady() {
    nowPlaying = false;
    overlay.className = "disabled";
  },

  onTimeUpdate(position) {
    let beat = player.findBeat(position);
    if (b !== beat) {
      b = beat;
    }

    if (!player.video.firstChar) {
      return;
    }

    if (c && c.startTime > position + 300) {
      resetChars();
    }

    let current = c || player.video.firstChar;
    while (current && current.startTime < position + 300) {
      if (c !== current) {
        newChar(current);
        c = current;
      }
      current = current.next;
    }
  }
});

//Delete a phrase
function delChar() {
  var nl = document.getElementsByClassName("newLyr");
  var todel = nl.length;
  setTimeout(() => {  
    for (var i = 0; i<todel; i++){
      nl[i].style.transform = "scale(0)";
    }
  }, b.duration*2);
}

const colors = [
  "rgb(255, 0, 225)",
  "rgb(255, 98, 0)",
  "rgb(255, 208, 0)",
  "rgb(0, 255, 26)",
  "rgb(0, 123, 255)",
  "rgb(60, 0, 255)",
  "rgb(208, 0, 255)"
];

//Add a new character
function newChar(current) {
  
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(current.text));
  
  const container = document.createElement("div");

  container.style.position = "absolute";
  container.className = "newLyr"
  container.style.color = colors[colorSeq];
  colorSeq = (colorSeq+1)%7;
  if (lyricStat == 1){
    container.style.left = Math.max(0, Math.min(canvas.offsetWidth-30, charac.getBoundingClientRect().left+charac.offsetWidth/2+div.offsetWidth/2+Math.cos(angle)*radius))+"px";
    container.style.top = Math.max(0, Math.min(canvas.offsetHeight*0.92, charac.getBoundingClientRect().top+charac.offsetHeight*3/5+div.offsetHeight/2+Math.sin(angle)*radius))+"px";
    angle = angle+(Math.PI/8);
    radius = radius+15;
  }
  if (lyricStat == 2){
    container.style.left = Math.max(0, Math.min(canvas.offsetWidth-30, charac.getBoundingClientRect().left+charac.offsetWidth/2-container.offsetWidth/2))+"px";
    container.style.top = Math.max(0, Math.min(canvas.offsetHeight*0.92, charac.getBoundingClientRect().top+charac.offsetHeight-30))+"px";
  }
  container.appendChild(div);
  textContainer.appendChild(container);

  if (current.parent.parent.lastChar === current){
    radius = 80;
    delChar();
  }
}

//Delete all characters created
function resetChars() {
  c = null;
  colorSeq = 0;
  radius = 80;
  angle = 0;
  while (textContainer.firstChild)
    textContainer.removeChild(textContainer.firstChild);
  passingCloud.replaceChildren();
}

//Display Audience
var horizontalAudience = Math.floor(canvas.offsetWidth/160)+2, verticalAudience = Math.floor(canvas.offsetHeight/140)+2;
for(var i = 0; i<horizontalAudience; i++){
  for(var j = 0; j<verticalAudience; j++){
    var audienceSet = document.createElement('var');
    
    var audiencePic = document.createElement('img');
    audiencePic.src = "images/audience"+ (Math.floor(Math.random()*6)%6+1) +".png";
    audiencePic.className = "audienceBody";
    audiencePic.style.left = (canvas.offsetWidth-horizontalAudience*160)/2 + i*160 + "px";
    audiencePic.style.top = (canvas.offsetHeight-verticalAudience*140)/2 + j*140 + "px";
    audienceSet.appendChild(audiencePic);
    
    var sweetOnion = Math.random();
    var audienceArm1 = document.createElement('img')
    var audienceArm2 = document.createElement('img');
    if (sweetOnion > 0.05){
      audienceArm1.src = "images/audienceArm.png";
      audienceArm2.src = "images/audienceArm.png";
    }
    else{
      audienceArm1.src = "images/audienceArmSpecial.png";
      audienceArm2.src = "images/audienceArmSpecial.png";
    }
    audienceArm1.className = "audienceArmMove";
    audienceArm2.className = "audienceArmMove";
    audienceArm1.style.left = (canvas.offsetWidth-horizontalAudience*160)/2 + i*160 + -10 + "px"
    audienceArm2.style.left = (canvas.offsetWidth-horizontalAudience*160)/2 + i*160 + 65 + "px"
    audienceArm1.style.top = (canvas.offsetHeight-verticalAudience*140)/2 + j*140 + 70 + "px";
    audienceArm2.style.top = (canvas.offsetHeight-verticalAudience*140)/2 + j*140 + 70 + "px";
    audienceSet.appendChild(audienceArm1);
    audienceSet.appendChild(audienceArm2);

    audience.appendChild(audienceSet);
  }
}

//Canvas Part functions
//Draw background cloud
function draw(){
  if (canvas.getContext){
    var ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "rgb(253, 253, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (var i = 0; i < 20; i++){
      ctx.beginPath();
      var inx = Math.floor(Math.random()*(canvas.offsetWidth + 300)), iny = Math.floor(Math.random()*(canvas.offsetHeight + 300));
      var nex = inx, ney = iny;
      ctx.moveTo(inx, iny);
      var ag = 2*Math.random()*Math.PI, rd = 200*Math.random()+100;
      for (var j = 0; j < 15; j++){
        ag += Math.random() * (Math.PI/2) + Math.PI/4;
        rd = 200*Math.random()+100
        nex = nex + (rd)*Math.cos(ag);
        ney = ney + (rd)*Math.sin(ag);
        ctx.lineTo(nex, ney);
      }
      ctx.lineTo(inx, iny);

      const gradiation = ctx.createLinearGradient(0, 0, 200, 0);
      gradiation.addColorStop(0, "rgb(220, 220, 224)");
      gradiation.addColorStop(1, "rgb(200, 200, 209)");
      
      ctx.filter = "blur(48px)";
      ctx.fillStyle = gradiation;
      ctx.closePath();
      ctx.fill();
    }
  }
}
draw();

//Draw track
function clearCircle(x, y, radius){
  if (canvas.getContext){
    var ctx = canvas.getContext("2d");
    ctx.filter = "blur(" + selectedBlur + "px)";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, false);
    ctx.globalCompositeOperation='destination-out';
    ctx.fill();
    ctx.globalCompositeOperation='source-over';
    ctx.closePath();
  }
  else{
    console.log("error");
  }
}

function clearPosition(){
  var rect = charac.getBoundingClientRect();
  var ratio1 = canvas.width/canvas.offsetWidth;
  var ratio2 = canvas.height/canvas.offsetHeight;
  clearCircle((rect.left+charac.offsetWidth/2)*ratio1, (rect.top+charac.offsetHeight)*ratio2, selectedRadius);
}

//Character moving when clicked
//Function for constant speed
function distant(x1, y1, x2, y2){
  return ((x1-x2)**2+(y1-y2)**2)**0.5;
}

//Function deciding character's direction
function setDirection(x1, y1, x2, y2) {
  var dx = x2-x1;
  var dy = -(y2-y1);
  if (dx == 0){
    if (dy>0){
      characDirection = 1;
    }
    else{
      characDirection = 3;
    }
  }
  else {
    var a = dy/dx;
    if (a>1){
      if (dx > 0){
        characDirection = 1;
      }
      else {
        characDirection = 3;
      }
    }
    else if (0<a && a<=1){
      if (dx > 0){
        characDirection = 0;
      }
      else {
        characDirection = 2;
      }
    }
    else if (-1<a && a<=0){
      if (dx > 0){
        characDirection = 0;
      }
      else {
        characDirection = 2;
      }
    }
    else {
      if (dx > 0){
        characDirection = 3;
      }
      else {
        characDirection = 1;
      }
    }
  }
  console.log((dx)+", "+(dy)+", "+(characDirection));
  characCtx.clearRect(0, 0, 2000, 2000);
  characCtx.drawImage(characSprites[characDirection][characStat][frame[characStat]], 0, 0, 2000, 2000);
}

var globalStopTracing = true;
var moveCount = 0;

//When left click/touch
canvas.addEventListener('click', function(e) {
  if (player.isPlaying && !autoPlay){
    moveCount += 1;
    var stopTracing = false;
    var currentMoveCount = moveCount;

    globalStopTracing = false;
    if (mobile && !willTrack){
      stopTracing = true;
      characStat = 2;
    }
    else {
      characStat = 1;
    }
    var xpos = e.clientX-charac.offsetWidth/2;
    var ypos = e.clientY-charac.offsetHeight;
    var rect = charac.getBoundingClientRect();
    var t_to_dest = distant(rect.left, rect.top, xpos, ypos)/selectedSpeed;
    setDirection(rect.left, rect.top, xpos, ypos);

    const circ = document.createElement("div");
    circ.className = "newCircle";
    circ.style.position = "absolute";
    circ.style.left = (e.clientX-(canvas.offsetHeight*0.025))+"px";
    circ.style.top = (e.clientY-(canvas.offsetHeight*0.025))+"px";
    clickCircle.appendChild(circ);

    charac.style.transitionDuration =  t_to_dest+ "s";
    var traceChar = setInterval(function() {
      if (!stopTracing&&!globalStopTracing){
        clearPosition();
      }
      else{
        clearInterval(traceChar);
      }
    }, 3)

    lyricStat = 2;

    charac.style.transform = "translate("+ xpos + "px," + ypos + "px)";
    setTimeout(() => {
      stopTracing = true;
      if (currentMoveCount == moveCount){
        lyricStat = 1;
        characStat = 0;
      }
    }, 1000*t_to_dest+10);
  }
  else if (player.isPlaying) {
    if (autoDrawing.className == "disabled") {
      autoDrawing.className = "";
      setTimeout(() => {
        autoDrawing.className = "disabled";
      }, 1000);
    }
  }
});

//When right click
canvas.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  globalStopTracing = true;
  if (player.isPlaying && !mobile && !autoPlay){
    moveCount += 1;
    characStat = 2;
    var currentMoveCount = moveCount;

    var xpos = e.clientX-charac.offsetWidth/2;
    var ypos = e.clientY-charac.offsetHeight;
    var rect = charac.getBoundingClientRect();
    var t_to_dest = distant(rect.left, rect.top, xpos, ypos)/selectedSpeed;
    setDirection(rect.left, rect.top, xpos, ypos);

    const circ = document.createElement("div");
    circ.className = "newCircle";
    circ.style.position = "absolute";
    circ.style.left = (e.clientX-(canvas.offsetHeight*0.025))+"px";
    circ.style.top = (e.clientY-(canvas.offsetHeight*0.025))+"px";
    clickCircle.appendChild(circ);
    
    charac.style.transitionDuration = t_to_dest + "s";
    lyricStat = 2;
    charac.style.transform = "translate("+ xpos + "px," + ypos + "px)";

    setTimeout(() => {
      if (currentMoveCount == moveCount){
        lyricStat = 1;
        characStat = 0;
      }
    }, 1000*t_to_dest+10);
  }
  else if (!mobile&&player.isPlaying) {
    if (autoDrawing.className == "disabled") {
      autoDrawing.className = "";
      setTimeout(() => {
        autoDrawing.className = "disabled";
      }, 1000);
    }
  }
});


//Various settings and buttons
//Reset
manipulate.className = "disabled";
screenshotButton.className = "disabled";

//Only for mobile-select if tracking is enabled
tracking.addEventListener('click', function(){
  if (willTrack) {
    willTrack = false;
    tracking.src = "images/disableTracking.png";
  }
  else {
    willTrack = true;
    tracking.src = "images/enableTracking.png";
  }
});

//Button for filling background cloud again
fillCloud.addEventListener('click', draw);
fillCloud.addEventListener('mousedown', function() {
  fillCloud.style.filter = "drop-shadow(0px 0px 0px #000)"
});
fillCloud.addEventListener('mouseup', function() {
  fillCloud.style.filter = "drop-shadow(1px 1px 1px #000)"
});

//Button for opening settings
var openSetting = false;
settings.addEventListener('click', function() {
  if (openSetting) {
    openSetting = false;
    rangeBars.style.opacity = "0";
    settings.style.transform = "rotate(0deg)";
    rangeBars.style.transform = "translate(0, 0)";
  }
  else {
    openSetting = true;
    rangeBars.style.opacity = "1";
    settings.style.transform = "rotate(180deg)";
    rangeBars.style.transform = "translate(-"+ (rangeBars.offsetWidth) + "px, 0)";
  }
})
//Ranges in setting
trackRadius.addEventListener("change", function() {
  selectedRadius = trackRadius.value;
});
trackBlur.addEventListener("change", function() {
  selectedBlur = trackBlur.value;
});
trackSpeed.addEventListener("change", function() {
  selectedSpeed = trackSpeed.value;
});


//Auto move
//Function for particles
function moveToDest(startX, startY, idx, maxi, toMove, k){
  if (idx >= maxi){
    lyricStat = 1;
    autoPlay = false;
    characStat = 0;
    return 0;
  }

  var stopTracing = toMove[idx][0];
  var tox = startX+toMove[idx][1]*k;
  var toy = startY+toMove[idx][2]*k;
  var rect = charac.getBoundingClientRect();
  var t_to_dest = distant(rect.left, rect.top, tox, toy)/selectedSpeed;
  charac.style.transitionDuration =  t_to_dest+ "s";
  setDirection(rect.left, rect.top, tox, toy);
  
  if (stopTracing) {
    characStat = 2;
  }
  else {
    characStat = 1;
  }

  var traceChar = setInterval(function() {
    if (!stopTracing){
      clearPosition();
    }
    else{
      clearInterval(traceChar);
    }
  }, 5)
  
  charac.style.transform = "translate("+ tox + "px," + toy + "px)";
  setTimeout(() => {
    stopTracing = true;
    console.log(tox, toy, idx);
    moveToDest(startX, startY, idx+1, maxi, toMove, k); 
  }, t_to_dest*1000+10);
}

//Function for sets
function moveToDestRelative(startX, startY, idx, maxi, toMove, k){
  if (idx >= maxi){
    lyricStat = 1;
    characStat = 0;
    autoPlay = false;
    return 0;
  }

  var stopTracing = toMove[idx][0];
  var tox = (startX+toMove[idx][1]*k)*canvas.offsetWidth/1536-charac.offsetWidth/2;
  var toy = (startY+toMove[idx][2]*k)*canvas.offsetHeight/746 - charac.offsetHeight*2/3;
  var rect = charac.getBoundingClientRect();
  var t_to_dest = distant(rect.left, rect.top, tox, toy)/selectedSpeed;
  charac.style.transitionDuration =  t_to_dest+ "s";
  setDirection(rect.left, rect.top, tox, toy);
  
  if (stopTracing) {
    characStat = 2;
  }
  else {
    characStat = 1;
  }

  var traceChar = setInterval(function() {
    if (!stopTracing){
      clearPosition();
    }
    else{
      clearInterval(traceChar);
    }
  }, 5)
  
  charac.style.transform = "translate("+ tox + "px," + toy + "px)";
  setTimeout(() => {
    stopTracing = true;
    console.log(tox, toy, idx);
    moveToDestRelative(startX, startY, idx+1, maxi, toMove, k); 
  }, t_to_dest*1000+10);
}

//Set-up arrays of particles/sets
const toMove01 = [ //type, x, y
  [false, 100, 0],
  [true, 22, -80],
  [false, 8, -66],
  [false, 8, -24],
  [false, 22, -10],
  [true, 28, -80],
  [false, 42, -66],
  [false, 42, -24],
  [false, 28, -10],
  [true, 61, -66],
  [false, 75, -80],
  [false, 75, -10],
  [true, 0, 0]
];
const k01 = 1.2;

const toMoveHeart = [
  [false, 15, -15],
  [false, 36, -21],
  [false, 51, 0],
  [false, 0, 51],
  [false, -51, 0],
  [false, -36, -15],
  [false, -15, -15],
  [false, 0, 0]
];
const kHeart = 1;

const toMoveSnow = [
  [false, 15, -26],
  [false, 5, -43],
  [true, 35, -26],
  [false, 15, -26],
  [false, 25, -43],
  [false, 0, 0],
  [false, -15, -26],
  [false, -5, -43],
  [true, -35, -26],
  [false, -15, -26],
  [false, -25, -43],
  [false, 0, 0],
  [false, -30, 0],
  [false, -40, -17],
  [true, -40, 17],
  [false, -30, 0],
  [false, -50, 0],
  [false, 0, 0],
  [false, -15, 26],
  [false, -5, 43],
  [true, -35, 26],
  [false, -15, 26],
  [false, -25, 43],
  [false, 0, 0],
  [false, 15, 26],
  [false, 5, 43],
  [true, 35, 26],
  [false, 15, 26],
  [false, 25, 43],
  [false, 0, 0],
  [false, 30, 0],
  [false, 40, -17],
  [true, 40, 17],
  [false, 30, 0],
  [false, 50, 0],
  [false, 0, 0]
];
const kSnow = 1.5;

const toMoveStar = [
  [false, 100, 0],
  [false, 19, 59],
  [false, 50, -36],
  [false, 81, 59],
  [false, 0, 0]
];
const kStar = 1;

const toMoveMusic1 = [
  [false, 11, -11],
  [false, 31, -11],
  [false, 31, -59],
  [false, 41, -59],
  [false, 41, -11],
  [false, 52, 0],
  [false, 41, 11],
  [false, 11, 11],
  [false, 0, 0]
];
const kMusic1 = 1.7;

const toMoveMusic2 = [
  [false, 11, -11],
  [false, 31, -11],
  [false, 31, -89],
  [false, 103, -100],
  [false, 103, -22],
  [false, 114, -11],
  [false, 103, 0],
  [false, 73, 0],
  [false, 62, -11],
  [false, 73, -22],
  [false, 93, -22],
  [false, 93, -71],
  [false, 41, -62],
  [false, 41, -11],
  [false, 52, 0],
  [false, 41, 11],
  [false, 11, 11],
  [false, 0, 0],
  [true, 41, -80],
  [false, 93, -89],
  [false, 93, -80],
  [false, 41, -71],
  [false, 41, -80],
  [true, 0, 0]
];
const kMusic2 = 1.2;

const toMoveSOnion = [
  [false, 42, -42],
  [false, 57, -74],
  [false, 66, -69],
  [false, 52, -45],
  [false, 80, -45],
  [false, 80, -35],
  [false, 49, -35],
  [false, 7, 7],
  [false, 0, 0],
  [false, 7, -7],
  [false, 14, 0],
  [true, 0, 0]
];
const kSOnion = 2;

const toMoveMikuJp = [
  [true, 307, 149],
  [false, 614, 298],
  [true, 307, 298],
  [false, 614, 447],
  [true, 307, 447],
  [false, 614, 596],
  [true, 844, 298],
  [false, 998, 149],
  [false, 1152, 298],
  [false, 844, 596],
  [true, 1152, 596]
];

const toMoveMikuEng = [
  [true, 61, 559],
  [false, 153, 186],
  [false, 245, 559],
  [false, 337, 186],
  [false, 430, 559],
  [true, 491, 186],
  [false, 737, 186],
  [true, 614, 186],
  [false, 614, 559],
  [false, 491, 559],
  [false, 737, 559],
  [true, 798, 186],
  [false, 798, 559],
  [true, 798, 373],
  [false, 1029, 186],
  [true, 798, 373],
  [false, 1029, 559],
  [true, 1090, 186],
  [false, 1090, 514],
  [false, 1244, 559],
  [false, 1397, 514],
  [false, 1397, 186],
  [true, 1244, 186]
];

const toMoveHero = [
  [true, 61, 186],
  [false, 61, 559],
  [false, 61, 373],
  [false, 368, 373],
  [false, 368, 186],
  [false, 368, 559],
  [true, 430, 186],
  [false, 430, 559],
  [false, 430, 186],
  [false, 737, 186],
  [true, 430, 373],
  [false, 737, 373],
  [true, 430, 559],
  [false, 737, 559],
  [true, 798, 186],
  [false, 1105, 208],
  [false, 1105, 320],
  [false, 798, 373],
  [false, 798, 559],
  [false, 798, 186],
  [false, 798, 373],
  [false, 1105, 559],
  [true, 1320, 186],
  [false, 1474, 231],
  [false, 1474, 514],
  [false, 1320, 559],
  [false, 1167, 514],
  [false, 1167, 231],
  [false, 1320, 186],
  [true, 768, 671]
];

const toMoveMirai = [
  [true, 61, 276],
  [false, 368, 276],
  [false, 261, 425],
  [false, 215, 395],
  [false, 307, 455],
  [true, 460, 238],
  [false, 491, 283],
  [true, 460, 350],
  [false, 491, 395],
  [true, 491, 507],
  [false, 737, 298],
  [true, 675, 253],
  [false, 675, 208],
  [true, 737, 253],
  [false, 737, 208],
  [true, 829, 231],
  [false, 1075, 343],
  [true, 829, 320],
  [false, 1075, 432],
  [true, 829, 410],
  [false, 1075, 522],
  [true, 1228, 268],
  [false, 1413, 268],
  [true, 1167, 335],
  [false, 1474, 335],
  [false, 1259, 522],
  [true, 768, 671]
];

const toMoveMiku = [
  [true, 550, 103],
  [false, 490, 191],
  [false, 584, 295],
  [false, 648, 221],
  [false, 550, 103],
  [true, 534, 241],
  [false, 352, 320],
  [false, 316, 746],
  [true, 534, 241],
  [false, 450, 386],
  [false, 490, 746],
  [true, 561, 610],
  [false, 522, 332],
  [false, 617, 195],
  [false, 850, 195],
  [false, 982, 332],
  [false, 958, 610],
  [false, 913, 415],
  [false, 834, 262],
  [false, 762, 363],
  [false, 690, 262],
  [false, 577, 406],
  [false, 561, 610],
  [false, 577, 406],
  [false, 611, 507],
  [false, 670, 565],
  [false, 758, 605],
  [false, 844, 565],
  [false, 885, 507],
  [false, 913, 415],
  [true, 670, 565],
  [false, 653, 668],
  [false, 490, 746],
  [true, 653, 668],
  [false, 666, 746],
  [true, 653, 668],
  [false, 769, 746],
  [false, 850, 672],
  [false, 848, 746],
  [true, 850, 672],
  [false, 844, 559],
  [true, 850, 672],
  [false, 1080, 746],
  [false, 1035, 405],
  [false, 965, 251],
  [false, 1170, 349],
  [false, 1230, 746],
  [true, 966, 103],
  [false, 873, 221],
  [false, 921, 295],
  [false, 1032, 191],
  [false, 966, 103],
  [true, 690, 374],
  [false, 690, 446],
  [true, 812, 374],
  [false, 812, 446],
  [true, 700, 495],
  [false, 749, 525],
  [false, 798, 495],
  [true, 762, 679]
];

//Buttons of autodrawing
document.querySelector("#a01").addEventListener("click", function() {
  if (player.isPlaying && !autoPlay){
    lyricStat = 2;
    autoPlay = true;
    rect = charac.getBoundingClientRect();
    moveToDest(rect.left, rect.top, 0, toMove01.length, toMove01, k01);
  }
});

document.querySelector("#heart").addEventListener("click", function() {
  if (player.isPlaying && !autoPlay){
    lyricStat = 2;
    autoPlay = true;
    rect = charac.getBoundingClientRect();
    moveToDest(rect.left, rect.top, 0, toMoveHeart.length, toMoveHeart, kHeart);
  }
});

document.querySelector("#snow").addEventListener("click", function() {
  if (player.isPlaying && !autoPlay){
    lyricStat = 2;
    autoPlay = true;
    rect = charac.getBoundingClientRect();
    moveToDest(rect.left, rect.top, 0, toMoveSnow.length, toMoveSnow, kSnow);
  }
});

document.querySelector("#star").addEventListener("click", function() {
  if (player.isPlaying && !autoPlay){
    lyricStat = 2;
    autoPlay = true;
    rect = charac.getBoundingClientRect();
    moveToDest(rect.left, rect.top, 0, toMoveStar.length, toMoveStar, kStar);
  }
});

document.querySelector("#music1").addEventListener("click", function() {
  if (player.isPlaying && !autoPlay){
    lyricStat = 2;
    autoPlay = true;
    rect = charac.getBoundingClientRect();
    moveToDest(rect.left, rect.top, 0, toMoveMusic1.length, toMoveMusic1, kMusic1);
  }
});

document.querySelector("#music2").addEventListener("click", function() {
  if (player.isPlaying && !autoPlay){
    lyricStat = 2;
    autoPlay = true;
    rect = charac.getBoundingClientRect();
    moveToDest(rect.left, rect.top, 0, toMoveMusic2.length, toMoveMusic2, kMusic2);
  }
});

document.querySelector("#SOnion").addEventListener("click", function() {
  if (player.isPlaying && !autoPlay){
    lyricStat = 2;
    autoPlay = true;
    rect = charac.getBoundingClientRect();
    moveToDest(rect.left, rect.top, 0, toMoveSOnion.length, toMoveSOnion, kSOnion);
  }
});

document.querySelector("#mikuJp").addEventListener("click", function() {
  if (player.isPlaying && !autoPlay){
    lyricStat = 2;
    autoPlay = true;
    moveToDestRelative(0, 0, 0, toMoveMikuJp.length, toMoveMikuJp, 1);
  }
});

document.querySelector("#mikuEng").addEventListener("click", function() {
  if (player.isPlaying && !autoPlay){
    lyricStat = 2;
    autoPlay = true;
    moveToDestRelative(0, 0, 0, toMoveMikuEng.length, toMoveMikuEng, 1);
  }
});

document.querySelector("#hero").addEventListener("click", function() {
  if (player.isPlaying && !autoPlay){
    lyricStat = 2;
    autoPlay = true;
    moveToDestRelative(0, 0, 0, toMoveHero.length, toMoveHero, 1);
  }
});

document.querySelector("#mirai").addEventListener("click", function() {
  if (player.isPlaying && !autoPlay){
    lyricStat = 2;
    autoPlay = true;
    moveToDestRelative(0, 0, 0, toMoveMirai.length, toMoveMirai, 1);
  }
});

document.querySelector("#mikuDraw").addEventListener("click", function() {
  if (player.isPlaying && !autoPlay){
    lyricStat = 2;
    autoPlay = true;
    moveToDestRelative(0, 0, 0, toMoveMiku.length, toMoveMiku, 1);
  }
});

//Panel containing autodraw buttons
openPanel.addEventListener('load', () => {
  panelCtx.drawImage(openPanel, 0, 0, 600, 300);
});
var panelOpen = false;
panel.addEventListener('click', function() {
  if (!panelOpen){
    panel.style.transform = "translate(0, 30vh)";
    drawButtons.style.transform = "translate(0, 30vh)";
    setTimeout(() => {
      panelOpen = true;
      panelCtx.drawImage(closePanel, 0, 0, 600, 300);
    }, 500);
  }
  else{
    panel.style.transform = "translate(0, 0)";
    drawButtons.style.transform = "translate(0, 0)";
    setTimeout(() => {
      panelOpen = false;
      panelCtx.drawImage(openPanel, 0, 0, 600, 300);
    }, 500);
  }
});


//Screenshot mode button
screenshotMode.addEventListener('load', () => {
  screenshotButtonCtx.drawImage(screenshotMode, 0, 0, 40, 40);
});
var screenshotAble = false;
screenshotButton.addEventListener('click', function(){
  if (screenshotAble) {
    manipulate.className = "";
    screenshotButtonCtx.clearRect(0, 0, 40, 40);
    screenshotButtonCtx.drawImage(screenshotMode, 0, 0, 40, 40);
    screenshotAble = false;
  }
  else {
    manipulate.className = "disabled";
    screenshotButtonCtx.clearRect(0, 0, 40, 40);
    screenshotButtonCtx.drawImage(screenshotBack, 0, 0, 40, 40);
    screenshotAble = true;
  }
});


//Import songs

//Selecting songs
//Slide showing 6 songs
slideIndex = 0
function updateSlide(){
  slideList.style.transform = "translate("+ (-slideIndex*100) + "vw, 0)";
}
nextSong.addEventListener("click", function() {
  slideIndex = (slideIndex+1)%6;
  updateSlide();
});
previousSong.addEventListener("click", function() {
  slideIndex = (slideIndex+5)%6;
  updateSlide();
});

//Arrays containing information of songs
const url = ["https://piapro.jp/t/ucgN/20230110005414", "https://piapro.jp/t/fnhJ/20230131212038", "https://piapro.jp/t/Vfrl/20230120182855", "https://piapro.jp/t/fyxI/20230203003935", "https://piapro.jp/t/Wk83/20230203141007", "https://piapro.jp/t/Ya0_/20230201235034"];
const beatid = [4267297, 4267300, 4267334, 4267373, 4267381, 4269734];
const chordid = [2405019, 2405033, 2405059, 2405138, 2405285, 2405723];
const repsegid = [2475577, 2475606, 2475645, 2475664, 2475676, 2475686];
const lyricid = [56092, 56131, 56095, 56096, 56812, 56098];
const lyricdiffid =[9636, 9638, 9637, 9639, 10668, 9643];

//Select the current song shown in the display
function selectSong() {
  player.createFromSongUrl(url[slideIndex], {
    video: {
      beatId: beatid[slideIndex],
      chordId: chordid[slideIndex],
      repetitiveSegmentId: repsegid[slideIndex],
      lyricId: lyricid[slideIndex],
      lyricDiffId: lyricdiffid[slideIndex]
    },
  });
}

//When music stop, show the replay button
function waitUntilStop() {
  if (nowPlaying) {
    var tryStop = setInterval(function() {
      if (!player.isPlaying){
        clearInterval(tryStop);
        replay.style.top = "71vh";
        replay.className = ""
      }
    }, 6000)
  }
}

//Show cloud when music starts
var cloudSequence = 0;
cloud1.style.width = Math.floor(Math.random()*1000)+"px";
cloud1.style.transform = "translate(-" + cloud1.offsetWidth +"px, 0)";
cloud2.style.width = Math.floor(Math.random()*1000)+"px";
cloud2.style.transform = "translate(-" + cloud2.offsetWidth +"px, 0)";
cloud3.style.width = Math.floor(Math.random()*1000)+"px";
cloud3.style.transform = "translate(-" + cloud3.offsetWidth +"px, 0)";

function generatePassingClouds(){
  if(nowPlaying) {
    if (cloudSequence == 0){
      cloud1.style.transitionDuration = "0s";
      cloud1.style.width = Math.floor(Math.random()*500 + 100)+"px";
      cloud1.style.transform = "translate(-" + cloud1.offsetWidth +"px, " + Math.floor(Math.random()*(canvas.offsetHeight-cloud1.offsetHeight/2)) + "px)";
      setTimeout(() => {
        cloud1.style.transitionDuration = "20s";
        cloud1.style.transform = "translate(" + (canvas.offsetWidth+cloud1.offsetWidth+100) + "px, " + cloud1.getBoundingClientRect().top + "px)";
      }, 100);
    }
    else if(cloudSequence == 1){
      cloud2.style.transitionDuration = "0s";
      cloud2.style.width = Math.floor(Math.random()*500 + 100)+"px";
      cloud2.style.transform = "translate(-" + cloud2.offsetWidth +"px," + Math.floor(Math.random()*(canvas.offsetHeight-cloud2.offsetHeight/2)) + "px)";
      setTimeout(() => {
        cloud2.style.transitionDuration = "20s";
        cloud2.style.transform = "translate(" + (canvas.offsetWidth+cloud2.offsetWidth+100) + "px, " + cloud2.getBoundingClientRect().top + "px)";
      }, 100);
    }
    else{
      cloud3.style.transitionDuration = "0s";
      cloud3.style.width = Math.floor(Math.random()*500 + 100)+"px";
      cloud3.style.transform = "translate(-" + cloud3.offsetWidth +"px," + Math.floor(Math.random()*(canvas.offsetHeight-cloud3.offsetHeight/2)) + "px)";
      setTimeout(() => {
        cloud3.style.transitionDuration = "20s";
        cloud3.style.transform = "translate(" + (canvas.offsetWidth+cloud3.offsetWidth+100) + "px, " + cloud3.getBoundingClientRect().top + "px)";
      }, 100);
    }
    cloudSequence = (cloudSequence+1)%3;
    var cloudGenerator = setInterval(function() {
      if(!player.isPlaying){
        clearInterval(cloudGenerator);
      }
      else if (Math.random() > 0.3){
        if (cloudSequence == 0){
          cloud1.style.transitionDuration = "0s";
          cloud1.style.width = Math.floor(Math.random()*500 + 100)+"px";
          cloud1.style.transform = "translate(-" + cloud1.offsetWidth +"px, " + Math.floor(Math.random()*(canvas.offsetHeight-cloud1.offsetHeight/2)) + "px)";
          setTimeout(() => {
            cloud1.style.transitionDuration = "20s";
            cloud1.style.transform = "translate(" + (canvas.offsetWidth+cloud1.offsetWidth+100) + "px, " + cloud1.getBoundingClientRect().top + "px)";
          }, 100);
        }
        else if(cloudSequence == 1){
          cloud2.style.transitionDuration = "0s";
          cloud2.style.width = Math.floor(Math.random()*500 + 100)+"px";
          cloud2.style.transform = "translate(-" + cloud2.offsetWidth +"px," + Math.floor(Math.random()*(canvas.offsetHeight-cloud2.offsetHeight/2)) + "px)";
          setTimeout(() => {
            cloud2.style.transitionDuration = "20s";
            cloud2.style.transform = "translate(" + (canvas.offsetWidth+cloud2.offsetWidth+100) + "px, " + cloud2.getBoundingClientRect().top + "px)";
          }, 100);
        }
        else{
          cloud3.style.transitionDuration = "0s";
          cloud3.style.width = Math.floor(Math.random()*500 + 100)+"px";
          cloud3.style.transform = "translate(-" + cloud3.offsetWidth +"px," + Math.floor(Math.random()*(canvas.offsetHeight-cloud3.offsetHeight/2)) + "px)";
          setTimeout(() => {
            cloud3.style.transitionDuration = "20s";
            cloud3.style.transform = "translate(" + (canvas.offsetWidth+cloud3.offsetWidth+100) + "px, " + cloud3.getBoundingClientRect().top + "px)";
          }, 100);
        }
        cloudSequence = (cloudSequence+1)%3;
      }
    }, 20000);
  }
}

//Character sprites
//Initialize
characSprites[3][0][0].addEventListener('load', function() {
  characCtx.clearRect(0, 0, 2000, 2000);
  characCtx.drawImage(characSprites[3][0][0], 0, 0, 2000, 2000);
});

//Change character sprites/animations
var frame = [0, 0, 0], frameAlter = [0, 1, 1];
function characAnimation() {
  var characMove = setInterval(() => {
    if (!nowPlaying) {
      clearInterval(characMove);
    }
    else {
      characCtx.clearRect(0, 0, 2000, 2000);
      characCtx.drawImage(characSprites[characDirection][characStat][frame[characStat]], 0, 0, 2000, 2000);
      if ((frame[characStat] == 0 && frameAlter[characStat] < 0) || (frame[characStat] == statusOffsprings[characStat]-1 && frameAlter[characStat] > 0)) {
        frameAlter[characStat] *= -1;
      }
      frame[characStat] += frameAlter[characStat];
    }
  }, 100);
}

//Light in sky
lightSky.style.rotate = (90-Math.atan(canvas.offsetHeight*3.2/500)*180/Math.PI) + "deg";
function generateLight() {
  lightSky.style.transitionDuration = "0s";
  lightSky.style.transform = "translate(" + (Math.floor(Math.random()*(canvas.offsetWidth-lightSky.offsetWidth))+lightSky.offsetWidth*2) + "px, -" + canvas.offsetHeight*1.2 + "px)";
  setTimeout(() => {
    lightSky.style.transitionDuration = "9.5s";
    lightSky.style.transform = "translate(" + (lightSky.getBoundingClientRect().left - 500) + "px, " + canvas.offsetHeight*3 + "px)";
  }, 100);
  var lightFromSky = setInterval(() => {
    if(!nowPlaying) {
      clearInterval(lightFromSky);
    }
    else {
      lightSky.style.transitionDuration = "0s";
      lightSky.style.transform = "translate(" + (Math.floor(Math.random()*(canvas.offsetWidth-lightSky.offsetWidth))+lightSky.offsetWidth*2) + "px, -" + canvas.offsetHeight*1.2 + "px)";
      setTimeout(() => {
        lightSky.style.transitionDuration = "9.5s";
        lightSky.style.transform = "translate(" + (lightSky.getBoundingClientRect().left - 500) + "px, " + canvas.offsetHeight*3 + "px)";
      }, 100);
    }
  }, 10000);
}

//Replay button->reset
replay.addEventListener("click", function() {
  resetChars();
  draw();

  replay.className = "disabled";
  charac.className = "disabled";
  manipulate.className = "disabled";
  screenshotButton.className = "disabled";
  slide.className = "";

  cloud1.style.width = Math.floor(Math.random()*1000)+"px";
  cloud1.style.transform = "translate(-" + cloud1.offsetWidth +"px, 0)";
  cloud2.style.width = Math.floor(Math.random()*1000)+"px";
  cloud2.style.transform = "translate(-" + cloud2.offsetWidth +"px, 0)";
  cloud3.style.width = Math.floor(Math.random()*1000)+"px";
  cloud3.style.transform = "translate(-" + cloud3.offsetWidth +"px, 0)";
});

//Start button
startBg.addEventListener("mousedown", function() {
  startTriangle.style.transform = "scale(0.5)";
});
startBg.addEventListener("mouseup", function() {
  startTriangle.style.transform = "scale(1)";
  overlay.className = "";
  slide.className = "disabled";
  charac.className = "able";

  autoPlay = false;

  selectSong();
  var tryPlay = setInterval(function() {
    if (player.isPlaying){
      nowPlaying = true;
      manipulate.className = ""
      screenshotButton.className = "";
      generatePassingClouds();
      waitUntilStop();
      characAnimation();
      generateLight();
      clearInterval(tryPlay);
    }
    else{
      if(!nowPlaying){
        player.requestPlay();
      }
    }
  }, 1000)
});


//How To Play
//Close
document.querySelector("#howToPlayExit").addEventListener('click', function() {
  document.querySelector("#information").className = "disabled";
});