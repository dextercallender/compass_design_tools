// Features

/*
  LAYOUT
  - Grid (Square)
  - Circle
  - Line
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

let colors;

let dots = [];

gridWidth = 2;		// in # of dots
gridHeight = 2;		// in # of dots
gridSpacing = 20;
circleIncrements = 6;
lineWidth = 4;
lineSpacing = 20;
// TODO triangle

function setup() {
	createCanvas(400, 400);

	colors = new Color();

	initializeGrid();

	console.log(dots);

	var gui = new dat.GUI();
	gui.add(colors, 'g', 0, 255);
}

function draw() {
	cnv = createCanvas(windowWidth, windowHeight)
  cnv.parent('dot-tool-canvas');

	for (let i = 0; i < dots.length; i++ ) {
		dots[i].render();
	}

	fill(colors.r, colors.g, colors.b);
	ellipse(20, 20, 20, 20);
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

function Color() {
  this.r = 255;
  this.g = 100;
  this.b = 255;
}

function initializeGrid() {
	dots = [];
	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
			dots.push(new Dot(new p5.Vector(x * gridSpacing, y * gridSpacing)));
		}
	}
}

function initializeCircle() {

}

function initializeLine() {

}

function intializeTriangle() {

}
