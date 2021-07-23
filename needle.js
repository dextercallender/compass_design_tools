let needleCnv;
let needles = [];
let cursorDragging = false;
let exportBuffer;

const BLACK = 'BLACK';
const WHITE = 'WHITE';
const INTERACTIVE = 'INTERACTIVE';
const STATIC = 'STATIC';
const PATTERN = 'PATTERN';
const PATTERN1 = 'PATTERN1';
const PATTERN2 = 'PATTERN2';
const PATTERN3 = 'PATTERN3';
const PATTERN4 = 'PATTERN4';
const PATTERN5 = 'PATTERN5';
const PATTERN6 = 'PATTERN6';
const PATTERN7 = 'PATTERN7';
const PATTERN8 = 'PATTERN8';
const PATTERN9 = 'PATTERN9';
const PATTERN10 = 'PATTERN10';
const PATTERN11 = 'PATTERN11';
const PATTERN12 = 'PATTERN12';
const PATTERN13 = 'PATTERN13';
const PATTERN14 = 'PATTERN14';
const PATTERN15 = 'PATTERN15';
const PATTERN16 = 'PATTERN16';
const ANIMATED = 'ANIMATED';  // TODO
const FRAMERATE = 90;

let Config = function() {
	this.gridWidth = 5;		  // Width = # of needles
	this.gridHeight = 5;
	this.gridSpacing = 40;    // constrain relation between grid spacing and needle length
	this.needleLength = 20;
  this.mode = INTERACTIVE;
	this.fill = BLACK;
  this.needleWeight = 2;
  this.needleCap = p5.ROUND
  this.showAngle = false;
  this.showVector = false;  // TODO
  this.attraction = false;  // by distance
  this.repulsion = false;   // by distance
  this.force = 20;
  this.limit = 200;
  this.cursor = new p5.Vector(200, 200);
  this.patternOption = PATTERN1;
  this.patternModifier = 0.06;
  this.exportDimesions = new p5.Vector(800, 800);
  this.filename = 'Pattern_Export';
  this.filetype = 'png';
  this.hideCursor = false;
  // TODO: factor adjusted mouse vector into config
}
var config = new Config();

let cursorBlack;
let cursorWhite;
function preload() {
  cursorBlack = loadImage('assets/crosshair_black.png');
  cursorWhite = loadImage('assets/crosshair_white.png');
}

function setup() {
  needleCnv = createCanvas(windowWidth, windowHeight)
  needleCnv.parent('needle-tool-canvas');
  config.exportDimesions.set(windowWidth, windowHeight);
  exportBuffer = createGraphics(config.exportDimesions.x, config.exportDimesions.y);

  frameRate(FRAMERATE);

  initializeConfig();

  needleCnv.doubleClicked(setFocalPoint)
  needleCnv.mouseClicked(setInteractiveMode)
}

function draw() {
  strokeWeight(config.needleWeight);
  strokeCap(config.needleCap);

  clearScreen();

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

function clearScreen() {

  // TODO smooth transition between white and black background
  if (config.fill === BLACK) {
    background(255);
    stroke(0);
  }
  if (config.fill === WHITE) {
    background(0);
    stroke(255);
  }
}

function refreshGraphic() {
  strokeWeight(config.needleWeight)
  strokeCap(config.needleCap)
  initializeConfig()
  clearScreen()
  renderGraphicCentered()
}

function renderCursor() {
  if (config.fill === BLACK && !config.hideCursor) {
    image(cursorBlack, config.cursor.x, config.cursor.y, 25, 25);
  }
  if (config.fill === WHITE && !config.hideCursor) {
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
          rotationValue = map(x + (config.gridWidth/2), 0, config.gridWidth, 0, PI * ( (config.gridWidth + 1) / config.gridWidth));
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
    case PATTERN4:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = map(x, 0, config.gridWidth, 0, TWO_PI * ( (config.gridWidth + 1) / config.gridWidth));
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
    case PATTERN5:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = map(y, 0, config.gridHeight, 0, PI * ( (config.gridHeight + 1) / config.gridHeight));
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
    case PATTERN6:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = map(y, 0, config.gridHeight, 0, TWO_PI * ( (config.gridHeight + 1) / config.gridHeight));
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
    case PATTERN7:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = map(y + (config.gridHeight/2), 0, config.gridHeight, 0, PI * ( (config.gridHeight) / config.gridHeight));
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
    case PATTERN8:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = map(y, 0, config.gridHeight, 0, PI/2 * ( (config.gridHeight) / config.gridHeight));
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
    case PATTERN9:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = noise(config.patternModifier * x, config.patternModifier * y) * PI * (7/4);
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
    case PATTERN10:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = noise((config.patternModifier + .05) * x, config.patternModifier * y) * PI * (7/4);
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
    case PATTERN11:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = noise((config.patternModifier) * x, config.patternModifier + .07 * y) * TWO_PI * (7/4);
          needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);
        }
      }
      break;
    case PATTERN12:
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          rotationValue = noise((config.patternModifier + .09) * x, config.patternModifier + .07 * y) * PI;
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

let inpWidth;
let inpHeight;
let sel;
let button;

function handleInputExportWidth() { config.exportDimesions.x = this.value; }
function handleInputExportHeight() { config.exportDimesions.y = this.value; }
function handleSelectFiletype() { config.filetype = this.value; }
function handleInputFilename() { config.filename = this.value; }

function exportGraphic() {
  if (!validateInput()) {
    // TODO: indicate improper input
    return;
  }

  if (config.exportDimesions.x === windowWidth && config.exportDimesions.y === windowHeight) {
    save(needleCnv, config.filename + '.' + config.filetype);
  } else {

    // TODO: do the second answer
    // use export buffer
    // https://stackoverflow.com/questions/55211647/how-do-i-save-a-p5-js-canvas-as-a-very-large-png
    exportBuffer.renderGraphicCentered();
  }
}

function validateInput() {
  // TODO: check numbers and string formatting
  return true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  config.exportDimesions.set(windowWidth, windowHeight);
}

function mousePressed() {
  noLoop();
}

function mouseReleased() {
  loop();
}

function setFocalPoint() {
  if (config.mode == INTERACTIVE || config.mode == STATIC) {
    config.cursor = new p5.Vector(mouseX, mouseY)
    config.mode = STATIC
  }
}

function setInteractiveMode() {
  if (config.mode == INTERACTIVE || config.mode == STATIC) {
    config.mode = INTERACTIVE
  }
}

function hideCursor() {
  config.hideCursor = true;
}

function unhideCursor() {
  config.hideCursor = false;
}