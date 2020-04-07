let needleCnv;
let needles = [];

const BLACK = 'BLACK';
const WHITE = 'WHITE';
const INTERACTIVE = 'INTERACTIVE';
const STATIC = 'STATIC';
const PATTERN = 'PATTERN';
const ANIMATED = 'ANIMATED';
const FRAMERATE = 90;

let Config = function() {
	this.gridWidth = 4;		// Width = # of dots
	this.gridHeight = 4;
	this.gridSpacing = 40; // constrain relation between grid spacing and needle length
	this.needleLength = 20;
  this.mode = INTERACTIVE;
	this.fill = BLACK;
  this.showAngle = false;
  this.attraction = false; // by distance
  this.repulsion = false; // by distance
  this.cursor = new p5.Vector(0, 0);
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
  gui.add(config, 'mode', [INTERACTIVE, STATIC, PATTERN, ANIMATED]).onChange();
  gui.add(config, 'fill', [BLACK, WHITE]);
  gui.add(config, 'gridWidth', 1, 25).onChange(initializeConfig);
	gui.add(config, 'gridHeight', 1, 25).onChange(initializeConfig);
  gui.add(config, 'gridSpacing', 15, 100).onChange(initializeConfig);
  gui.add(config, 'needleLength', 3, 50).onChange(initializeConfig);
  gui.add(config, 'showAngle', false);
  gui.add(config, 'attraction', false);
  gui.add(config, 'repulsion', false);
  gui.remember(config);

  initializeExportPane();
}

function draw() {
  strokeWeight(2);

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
        let adjustedMouseX = mouseX - windowWidth/2 + (config.gridWidth * config.gridSpacing / 2);
        let adjustedMouseY = mouseY - windowHeight/2 + (config.gridHeight * config.gridSpacing / 2);
        this.rotationRadians = -1 * atan2(adjustedMouseX - this.position.x, adjustedMouseY - this.position.y);
        this.rotationDegrees = this.rotationRadians * (180 / PI);
        break;
      case STATIC:
        //cursor
        break;
      case PATTERN:
        break;
      case ANIMATED:
        break;
    }
  }

  render() {
    this.update();
    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotationRadians);
    line(0, -config.needleLength / 2, 0, config.needleLength / 2);
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
