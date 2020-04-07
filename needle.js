let needleCnv;
let needles = [];

const BLACK = 'BLACK';
const WHITE = 'WHITE';
const INTERACTIVE = 'INTERACTIVE';
const STATIC = 'STATIC';
const PATTERN = 'PATTERN';
const ANIMATED = 'ANIMATED';

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
}
let config = new Config();

function setup() {
  needleCnv = createCanvas(windowWidth, windowHeight)
  needleCnv.parent('needle-tool-canvas');

  initializeConfig();

  var gui = new dat.GUI( {autoplace: false, width: 300 });
  gui.add(config, 'fill', [BLACK, WHITE]);
  gui.add(config, 'gridWidth', 1, 25).onChange(initializeConfig);
	gui.add(config, 'gridHeight', 1, 25).onChange(initializeConfig);
  gui.add(config, 'gridSpacing', 15, 200).onChange(initializeConfig);
  gui.add(config, 'needleLength', 3, 50).onChange(initializeConfig);
  gui.add(config, 'mode', [INTERACTIVE, STATIC, PATTERN, ANIMATED]).onChange();
  gui.add(config, 'showAngle', false);
  gui.add(config, 'attraction', false);
  gui.add(config, 'repulsion', false);

  gui.remember(config);
}

function draw() {
  background(255, 255, 255);

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
        this.rotationRadians = atan2(mouseX - position.x, mouseY - position.y);
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
    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotationRadians);
    stroke(0);
    strokeWeight(2);
    line(0, -config.needleLength / 2, 0, config.needleLength / 2);
    pop();
  }
}

function initializeConfig() {
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
