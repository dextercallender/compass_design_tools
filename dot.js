// Features

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
  -
  -
*/

// TODO: Expose bezier motion curve

let cnv;

let dots = [];

const grid = 'GRID';
const circle = 'CIRCLE';
const triangle = 'TRIANGLE';
let layoutState = grid;

let Config = function() {
	this.layout = 'GRID';
	this.gridWidth = 2;		// Width = # of dots
	this.gridHeight = 2;
	this.gridSpacing = 40;
	this.circleRadius = 40;
	this.circleIncrements = 8;
	this.triangleEdgeLength = 3;
}
let config = new Config();

function setup() {
	createCanvas(400, 400);

	initializeGrid();

	var gui = new dat.GUI();
	gui.add(config, 'layout', [grid, circle, triangle] );
	gui.remember(config);
}

function draw() {
	cnv = createCanvas(windowWidth, windowHeight)
  cnv.parent('dot-tool-canvas');

	if (layoutState != config.layout) {
		switch(config.layout) {
			case grid:
				initializeGrid();
				break;
			case circle:
				initializeCircle();
				break;
			case triangle:
				intializeTriangle();
				break;
		}
		layoutState = config.layout
	}

	push();
	translate(windowWidth/2, windowHeight/2);
	for (let i = 0; i < dots.length; i++ ) {
		dots[i].render();
	}
	pop();
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
	console.log('Initialized triangle');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
