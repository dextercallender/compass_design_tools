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

	this.motionCtrlPt1 = new p5.Vector(30, 30);
	this.motionCtrlPt2 = new p5.Vector(90, 90);
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

	renderMotionCurveModifier();

	renderGraphicCentered();

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
		if (config.fill === BLACK) { fill(0); }
		if (config.fill === WHITE) { fill(255); }
		stroke(0);
		strokeWeight(1);
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

function renderGraphicCentered() {
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

const MODIFIER_PANE_RIGHT = 200;
const MODIFIER_PANE_BOTTOM = 200;
const CURVE_MODIFIER_LENGTH = 150;
const CTRL_POINT_DIAMETER = 10;

function renderMotionCurveModifier() {
	push();
	translate(windowWidth - MODIFIER_PANE_RIGHT, windowHeight - MODIFIER_PANE_BOTTOM);

	stroke(0);
	strokeWeight(1);
	rect(windowWidth - MODIFIER_PANE_RIGHT, windowHeight - MODIFIER_PANE_BOTTOM, CURVE_MODIFIER_LENGTH, CURVE_MODIFIER_LENGTH);

	stroke(0);
	strokeWeight(1);
	ellipse(config.motionCtrlPt1.x, config.motionCtrlPt1.y, CTRL_POINT_DIAMETER, CTRL_POINT_DIAMETER);
	ellipse(config.motionCtrlPt2.x, config.motionCtrlPt2.y, CTRL_POINT_DIAMETER, CTRL_POINT_DIAMETER);

	stroke(0);
	strokeWeight(2);
	bezier(0, CURVE_MODIFIER_LENGTH, config.motionCtrlPt1.x, config.motionCtrlPt1.y, config.motionCtrlPt2.x, config.motionCtrlPt2.y, CURVE_MODIFIER_LENGTH, 0);

	pop();
}

let ctrlPtDragging = null;

function mousePressed() {

	adjustedMouseX = mouseX - (windowWidth - MODIFIER_PANE_RIGHT);
	adjustedMouseY = mouseY - (windowHeight - MODIFIER_PANE_BOTTOM);

	if (adjustedMouseX > config.motionCtrlPt1.x - (CTRL_POINT_DIAMETER/2)
		&& adjustedMouseX < config.motionCtrlPt1.x + (CTRL_POINT_DIAMETER/2)
		&& adjustedMouseY > config.motionCtrlPt1.y - (CTRL_POINT_DIAMETER/2)
		&& adjustedMouseY < config.motionCtrlPt1.x + (CTRL_POINT_DIAMETER/2) )
	{
		ctrlPtDragging = config.motionCtrlPt1;
		console.log('dragging point 1');

	} else if (adjustedMouseX > config.motionCtrlPt2.x - (CTRL_POINT_DIAMETER/2)
		&& adjustedMouseX < config.motionCtrlPt2.x + (CTRL_POINT_DIAMETER/2)
		&& adjustedMouseY > config.motionCtrlPt2.y - (CTRL_POINT_DIAMETER/2)
		&& adjustedMouseY < config.motionCtrlPt2.x + (CTRL_POINT_DIAMETER/2) )
	{
		ctrlPtDragging = config.motionCtrlPt2;
		console.log('dragging point 2');

	} else {
		ctrlPtDragging = null;
	}

}

function calculateSpeedFromCurve() {
	// https://p5js.org/reference/#/p5/bezierTangent
	// https://p5js.org/reference/#/p5/bezier

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
