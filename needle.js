let needleCnv;
let needles = [];
let cursorDragging = false;

const BLACK = 'BLACK';
const WHITE = 'WHITE';
const INTERACTIVE = 'INTERACTIVE';
const STATIC = 'STATIC';
const PATTERN = 'PATTERN';
const PATTERN1 = 'PATTERN1';
const PATTERN2 = 'PATTERN2';
const PATTERN3 = 'PATTERN3';
const PATTERN4 = 'PATTERN4';
const ANIMATED = 'ANIMATED';  // TODO
const FRAMERATE = 90;

let Config = function() {
	this.gridWidth = 12;		  // Width = # of dots
	this.gridHeight = 12;
	this.gridSpacing = 40;    // constrain relation between grid spacing and needle length
	this.needleLength = 20;
  this.mode = INTERACTIVE;
	this.fill = BLACK;
  this.showAngle = false;
  this.showVector = false;  // TODO
  this.attraction = false;  // by distance
  this.repulsion = false;   // by distance
  this.force = 20;
  this.limit = 200;
  this.cursor = new p5.Vector(200, 200);
  this.patternOption = PATTERN1;
  this.patternModifier = 0.03;
  this.exportWidth = 800;
  this.exportHeight = 800;
  this.filename = 'Pattern_Export,jpg';
  // TODO: factor adjusted mouse vector into config
}
let config = new Config();

let cursorBlack;
let cursorWhite;
function preload() {
  cursorBlack = loadImage('assets/crosshair_black.png');
  cursorWhite = loadImage('assets/crosshair_white.png');
}

function setup() {
  needleCnv = createCanvas(windowWidth, windowHeight)
  needleCnv.parent('needle-tool-canvas');

  frameRate(FRAMERATE);

  initializeConfig();

  var gui = new dat.GUI( {autoplace: false, width: 300 });

  gui.add(config, 'gridWidth', 1, 25).onChange(initializeConfig);
	gui.add(config, 'gridHeight', 1, 25).onChange(initializeConfig);
  gui.add(config, 'gridSpacing', 15, 100).onChange(initializeConfig);
  gui.add(config, 'needleLength', 3, 50).onChange(initializeConfig);
  gui.add(config, 'mode', [INTERACTIVE, STATIC, PATTERN]).onChange(initializeConfig);
  gui.add(config, 'fill', [BLACK, WHITE]);
  gui.add(config, 'showAngle', false);

  var f1 = gui.addFolder('Interactive');
  f1.add(config, 'attraction', false).onChange(initializeConfig);
  f1.add(config, 'repulsion', false).onChange(initializeConfig);
  f1.add(config, 'force', 5, 50);
  f1.add(config, 'limit', 10, 500);

  var f2 = gui.addFolder('Pattern');
  f2.add(config, 'patternOption', [PATTERN1, PATTERN2, PATTERN3, PATTERN4]).onChange(initializeConfig);
  f2.add(config, 'patternModifier', .001, .2).onChange(initializeConfig);

  gui.remember(config);

  initializeExportPane();
}

function draw() {
  strokeWeight(2);

  if (config.fill === BLACK) {
    background(255);
    stroke(0);
  }

  if (config.fill === WHITE) {
    background(0);
    stroke(255);
  }

  if (cursorDragging) { config.cursor.set(mouseX, mouseY); }

  if (config.mode === STATIC) { renderCursor(); }

  if (config.mode === PATTERN) { generatePattern(); }

  if (config.attraction) { attraction(); }

  if (config.repulsion) { repulsion(); }

  renderGraphicCentered();
}

class Needle {
  constructor (position) {
    	this.position = position;
      this.modifiedPosition = new p5.Vector(0, 0);
      this.rotationRadians = 0;
      this.rotationDegrees = 0;
  }

  update() {
    switch(config.mode) {
      case INTERACTIVE:
        let adjustedMouseX = mouseX - windowWidth / 2 + (config.gridWidth * config.gridSpacing / 2);
        let adjustedMouseY = mouseY - windowHeight / 2 + (config.gridHeight * config.gridSpacing / 2);
        this.rotationRadians = -1 * atan2(adjustedMouseX - this.position.x, adjustedMouseY - this.position.y);
        this.rotationDegrees = this.rotationRadians * (180 / PI) + 180;
        break;
      case STATIC:
        let adjustedCursorX = config.cursor.x - windowWidth / 2 + (config.gridWidth * config.gridSpacing / 2);
        let adjustedCursorY = config.cursor.y - windowHeight / 2 + (config.gridHeight * config.gridSpacing / 2);
        this.rotationRadians = -1 * atan2(adjustedCursorX - this.position.x, adjustedCursorY - this.position.y);
        break;
      case PATTERN:
        break;
      case ANIMATED:
        break;
    }
  }

  setRotation(radians) {
    this.rotationRadians = radians;
  }

  setPosition(x, y) {
    this.position.set(x, y);
  }

  render() {
    this.update();
    push();

    if (config.attraction || config.repulsion) {
      translate(this.modifiedPosition.x, this.modifiedPosition.y);
    } else {
      translate(this.position.x, this.position.y);
    }

    rotate(this.rotationRadians);
    line(0, -config.needleLength / 2, 0, config.needleLength / 2);
    if (config.showAngle) {
      push();
      rotate(PI/2);
      strokeWeight(1);
      textSize(12);
      textStyle(NORMAL);
      textFont('GTPressura')
      text(this.rotationDegrees.toFixed(2) + '\xB0', 5, -3);
      pop();
    }
    pop();
  }
}

function initializeConfig() {
  needles = [];
  for (let y = 0; y < config.gridHeight; y++) {
    for (let x = 0; x < config.gridWidth; x++) {
      needles.push(new Needle(new p5.Vector(x * config.gridSpacing, y * config.gridSpacing)));
    }
  }
}

function renderGraphicCentered() {
  push();
  translate(windowWidth/2 - ((config.gridWidth * config.gridSpacing) / 2) , windowHeight/2 - ((config.gridHeight * config.gridSpacing) / 2));
  for (let i = 0; i < needles.length; i++ ) { needles[i].render(); }
  pop();
}

function renderCursor() {
  if (config.fill === BLACK) {
    image(cursorBlack, config.cursor.x, config.cursor.y, 25, 25);
  }
  if (config.fill === WHITE) {
    image(cursorWhite, config.cursor.x, config.cursor.y, 25, 25);
  }
}

function mousePressed() {
  cursorDragging = true;
}

function mouseReleased() {
  cursorDragging = false;
}

function generatePattern() {
  let rotationValue;
  switch(config.patternOption) {
    case PATTERN1:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = map(x, 0, config.gridWidth, 0, PI/2 * ( (config.gridWidth + 1) / config.gridWidth));
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
    case PATTERN2:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = map(x, 0, config.gridWidth, 0, PI * ( (config.gridWidth + 1) / config.gridWidth));
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
    case PATTERN3:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = map(x, 0, config.gridWidth, 0, TWO_PI * ( (config.gridWidth + 1) / config.gridWidth));
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
    case PATTERN4:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = noise(config.patternModifier * x, config.patternModifier * y) * PI;
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
  }
}

function attraction() {
  let index;
  let location;
  let adjustedMouseX;
  let adjustedMouseY
  let vector = new p5.Vector(0,0);
  let scaleVector = new p5.Vector(0,0);
  let attractionVector = new p5.Vector(0,0);

  // Attraction by distance (needs to be tuned)
  for (let y = 0; y < config.gridHeight; y++) {
    for (let x = 0; x < config.gridWidth; x++) {
      index = floor(config.gridWidth * y) + x;
      location = needles[index].position;
      adjustedMouseX = mouseX - windowWidth / 2 + (config.gridWidth * config.gridSpacing / 2);
      adjustedMouseY = mouseY - windowHeight / 2 + (config.gridHeight * config.gridSpacing / 2);
      distance = (adjustedMouseX - location.x, adjustedMouseY - location.y);
      vector.set(adjustedMouseX - location.x, adjustedMouseY - location.y);
      vector.normalize();
      scaleVector.set(abs(vector.x * config.force), abs(vector.y * config.force));
      attractionVector.set(map(distance, 0, config.limit, scaleVector.x, 0), map(distance, 0, config.limit, scaleVector.y, 0));
      if (distance < config.limit) {
        needles[index].modifiedPosition.set(needles[index].position.x + attractionVector.x, needles[index].position.y + attractionVector.y);
      }
    }
  }
}

function repulsion() {
  let index;
  let location;
  let adjustedMouseX;
  let adjustedMouseY
  let vector = new p5.Vector(0,0);
  let scaleVector = new p5.Vector(0,0);
  let attractionVector = new p5.Vector(0,0);

  // Repulsion on full grid (broken)
  for (let y = 0; y < config.gridHeight; y++) {
    for (let x = 0; x < config.gridWidth; x++) {
      index = floor(config.gridWidth * y) + x;
      location = needles[index].position;
      adjustedMouseX = mouseX - windowWidth / 2 + (config.gridWidth * config.gridSpacing / 2);
      adjustedMouseY = mouseY - windowHeight / 2 + (config.gridHeight * config.gridSpacing / 2);
      vector.set(adjustedMouseX - location.x, adjustedMouseY - location.y);
      scaleVector.set(abs(vector.x * config.force), abs(vector.y * config.force));
      needles[index].modifiedPosition.set(needles[index].position.x + scaleVector.x, needles[index].position.y + scaleVector.y);
    }
  }
}

function initializeExportPane() {
  button = createButton('Export');
  button.position(windowWidth - 200, windowHeight - 200);
  button.mousePressed(exportGraphic);

  // TODO: svg or png options
  // TODO: size options
}

function exportGraphic() {
  //resizeCanvas(config.exportWidth, config.exportHeight);
  save(needleCnv, config.filename);
  //resizeCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  noLoop();
}

function mouseReleased() {
  loop();
}
