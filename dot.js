// Desired Feature Set

/*
  LAYOUT
  - Grid (Square)
  - Circle
  - Triangle
  - Pentagon. Hexagon, etc.
*/

/*
  STATIC
  - hide and reveal every nth
  - fill or outline
  - hide and reveal smart nth values
  - overlay 1 layout with hide and reveal onto another
*/

/*
  DYNAMIC
  - rotate right,
  - rotate one, hide under another
  - see other animation patterns in animation style guide
*/

// TODO: Expose bezier motion curve

let cnv;

let dots = [];

const GRID = 'GRID';
const CIRCLE = 'CIRCLE';
const TRIANGLE = 'TRIANGLE';
const BLACK = 'BLACK';
const WHITE = 'WHITE';

let Config = function() {
	this.layout = GRID;
	this.gridWidth = 2;		// Width = # of dots
	this.gridHeight = 2;
	this.gridSpacing = 40;
	this.circleRadius = 40;
	this.circleIncrements = 8;
	this.triangleEdgeLength = 3;
	this.fill = BLACK;
}
let config = new Config();

function setup() {
	createCanvas(400, 400);

	initializeGrid();

	var gui = new dat.GUI();
	gui.add(config, 'fill', [BLACK, WHITE]);
	gui.add(config, 'layout', [GRID, CIRCLE, TRIANGLE] ).onChange(reinitializeConfig);
	var f1 = gui.addFolder('Grid');
	f1.add(config, 'gridWidth', 1, 25).onChange(reinitializeConfig);
	f1.add(config, 'gridHeight', 1, 25).onChange(reinitializeConfig);
	f1.add(config, 'gridSpacing', 15, 200).onChange(reinitializeConfig);
	var f2 = gui.addFolder('Circle');
	f2.add(config, 'circleRadius', 10, 200).onChange(reinitializeConfig);
	f2.add(config, 'circleIncrements', 3, 20).onChange(reinitializeConfig);	// TODO : fix & limit based on radius
	var f3 = gui.addFolder('Triangle');

	gui.remember(config);
}

function draw() {
	cnv = createCanvas(windowWidth, windowHeight)
  cnv.parent('dot-tool-canvas');

	if (config.fill === BLACK) { fill(0); }

	renderCentered();
}

class Dot {
	constructor(position) {
		this.position = position;
		this.size = 15;
		this.moveIncrement = 0;
		this.moveRange = 24;
	}

	move(newPosition) {
		// uses motion curve moveRange times and renders each step
	}

	motionCurve () {
		// motion curve
	}

	motionBlur () {
		// configurable motion blur
	}

	render() {
		ellipse(this.position.x, this.position.y, this.size, this.size);
	}
}

function initializeGrid() {
	dots = [];
	for (let y = 0; y < config.gridHeight; y++) {
		for (let x = 0; x < config.gridWidth; x++) {
			dots.push(new Dot(new p5.Vector(x * config.gridSpacing, y * config.gridSpacing)));
		}
	}
}

function initializeCircle() {
	dots = [];
	for (let i = 0; i < 2*TWO_PI; i += TWO_PI/config.circleIncrements) {
		dots.push(new Dot(new p5.Vector(cos(i) * config.circleRadius, sin(i) * config.circleRadius)));
	}
}

function intializeTriangle() {
	console.log('Should initialize triangle');
}

function reinitializeConfig() {
	switch(config.layout) {
		case GRID:
			initializeGrid();
			break;
		case CIRCLE:
			initializeCircle();
			break;
		case TRIANGLE:
			intializeTriangle();
			break;
	}
}

function renderCentered() {
	switch(config.layout) {
		case GRID:
			pixelWidth = (config.gridWidth - 1) * config.gridSpacing;
			pixelHeight = (config.gridHeight - 1) * config.gridSpacing;
			push();
			translate(windowWidth/2 - pixelWidth/2, windowHeight/2 - pixelHeight/2);
			for (let i = 0; i < dots.length; i++ ) { dots[i].render(); }
			pop();
			break;
		case CIRCLE:
			push();
			translate(windowWidth/2, windowHeight/2);
			for (let i = 0; i < dots.length; i++ ) { dots[i].render(); }
			pop();
			break;
		case TRIANGLE:

			break;
	}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
