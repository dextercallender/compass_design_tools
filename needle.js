let needleCnv;
let needles = [];
let cursorDragging = false;

const BLACK = 'BLACK';
const WHITE = 'WHITE';
const INTERACTIVE = 'INTERACTIVE';
const STATIC = 'STATIC';
const PATTERN = 'PATTERN';
const ANIMATED = 'ANIMATED';  // TODO
const FRAMERATE = 90;

let Config = function() {
	this.gridWidth = 12;		// Width = # of dots
	this.gridHeight = 12;
	this.gridSpacing = 40; // constrain relation between grid spacing and needle length
	this.needleLength = 20;
  this.mode = INTERACTIVE;
	this.fill = BLACK;
  this.showAngle = false;
  this.showVector = false; // TODO
  this.attraction = false; // by distance
  this.repulsion = false; // by distance
  this.force = 20;
  this.cursor = new p5.Vector(200, 200);
  this.patternModifier = 0.03;
  this.exportWidth = 800;
  this.exportHeight = 800;
  this.filename = 'Pattern_Export,jpg';
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
  gui.add(config, 'mode', [INTERACTIVE, STATIC, PATTERN]).onChange();
  gui.add(config, 'fill', [BLACK, WHITE]);
  gui.add(config, 'gridWidth', 1, 25).onChange(initializeConfig);
	gui.add(config, 'gridHeight', 1, 25).onChange(initializeConfig);
  gui.add(config, 'gridSpacing', 15, 100).onChange(initializeConfig);
  gui.add(config, 'needleLength', 3, 50).onChange(initializeConfig);
  gui.add(config, 'showAngle', false);
  gui.add(config, 'patternModifier', .001, .1).onChange(initializeConfig);
  gui.add(config, 'attraction', false);
  gui.add(config, 'repulsion', false);
  gui.add(config, 'force', 5, 100);
  gui.remember(config);

  initializeExportPane();
}

function draw() {
  strokeWeight(2);

  if(cursorDragging) {
    config.cursor.set(mouseX, mouseY)
  }

  if(config.fill === BLACK) {
    background(255);
    stroke(0);
  }
  if(config.fill === WHITE) {
    background(0);
    stroke(255);
  }

  if(config.mode === STATIC) {
    renderCursor();
  }

  if(config.mode === PATTERN) {
    generatePattern();
  }

  if (config.attraction) {
    attraction();
  }
  if (config.repulsion) {
    repulsion();
  }

  renderGraphicCentered();
}

class Needle {
  constructor (position) {
    	this.position = position;
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
    translate(this.position.x, this.position.y);
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
  for (let y = 0; y < config.gridHeight; y++) {
    for (let x = 0; x < config.gridWidth; x++) {
      rotationValue = noise(config.patternModifier * x, config.patternModifier * y) * PI;
      needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);

    }
  }
}

function attraction() {
  let location;
  let adjustedMouseX;
  let adjustedMouseY
  let vector = new p5.Vector(0,0);
  let scaleVector = new p5.Vector(0,0);
  let attractionVector = new p5.Vector(0,0);

  for (let y = 0; y < config.gridHeight; y++) {
    for (let x = 0; x < config.gridWidth; x++) {
      location = needles[floor(config.gridWidth * y) + x].position
      adjustedMouseX = mouseX - windowWidth / 2 + (config.gridWidth * config.gridSpacing / 2);
      adjustedMouseY = mouseY - windowHeight / 2 + (config.gridHeight * config.gridSpacing / 2);
      distance = (adjustedMouseX - location.x, adjustedMouseY - location.y)

      vector.set(adjustedMouseX - location.x, adjustedMouseY - location.y);
      vector.normalize();

      scaleVector.set(abs(vector.x * config.force), abs(vector.y * config.force));
      attractionVector = new p5.Vector

    }
  }
}

function repulsion() {
  for (let y = 0; y < config.gridHeight; y++) {
    for (let x = 0; x < config.gridWidth; x++) {
      rotationValue = noise(config.patternModifier * x, config.patternModifier * y) * PI;
      needles[floor(config.gridWidth * y) + x].setRotation(rotationValue);

    }
  }
}

function initializeExportPane() {
  button = createButton('Export');
  button.position(windowWidth - 200, windowHeight - 200);
  button.mousePressed(exportGraphic);
}

function exportGraphic() {
  //resizeCanvas(config.exportWidth, config.exportHeight);
  save(needleCnv, config.filename);
  //resizeCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
