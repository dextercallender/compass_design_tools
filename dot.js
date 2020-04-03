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
let ctrlPtDragging = null;

const GRID = 'GRID';
const CIRCLE = 'CIRCLE';
const TRIANGLE = 'TRIANGLE';
const BLACK = 'BLACK';
const WHITE = 'WHITE';
const CTRLPT1 = 'CONTROL_POINT_1';
const CTRLPT2 = 'CONTROL_POINT_2';
const FRAME_RATE = 90;

let MotionProgress = function(keyframe, percentage) {
	this.keyframe = keyframe;
	this.percentTravelled = percentage;
}

let Config = function() {
	this.layout = GRID;
	this.gridWidth = 2;		// Width = # of dots
	this.gridHeight = 2;
	this.gridSpacing = 40;
	this.circleRadius = 40;
	this.circleIncrements = 8;
	this.triangleEdgeLength = 3;
	this.fill = BLACK;

	this.motionCtrlPt1 = new p5.Vector(150, 150);
	this.motionCtrlPt2 = new p5.Vector(0, 0);

	this.animationDuration = 1;
	this.motionProgress = new MotionProgress(0,0);
	this.animate = true;

}
let config = new Config();

function setup() {
	createCanvas(400, 400);

	frameRate(FRAME_RATE);

	initializeConfig();
	initializeAnimation();

	var gui = new dat.GUI( {autoplace: false, width: 300 });
	gui.add(config, 'fill', [BLACK, WHITE]);
	gui.add(config, 'layout', [GRID, CIRCLE, TRIANGLE] ).onChange(initializeConfig);
	gui.add(config, 'animate').onChange(initializeAnimation);
	gui.add(config, 'animationDuration', .5, 4);

	var f1 = gui.addFolder('Grid');
	f1.add(config, 'gridWidth', 1, 25).onChange(initializeConfig);
	f1.add(config, 'gridHeight', 1, 25).onChange(initializeConfig);
	f1.add(config, 'gridSpacing', 15, 200).onChange(initializeConfig);


	var f2 = gui.addFolder('Circle');
	f2.add(config, 'circleRadius', 10, 200).onChange(initializeConfig);
	f2.add(config, 'circleIncrements', 3, 20).onChange(initializeConfig);	// TODO : fix & limit based on radius

	var f3 = gui.addFolder('Triangle');

	gui.remember(config);
}

function draw() {
	cnv = createCanvas(windowWidth, windowHeight)
  cnv.parent('dot-tool-canvas');

	renderMotionCurveModifier();

	if (ctrlPtDragging) {
		setMotionCtrlPt()
	}

	motionCycle();

	renderGraphicCentered();
}

class Dot {
	constructor (position) {
		this.position = position;
		this.departurePosition = new p5.Vector(0, 0);
		this.size = 15;
		this.motionSequence = [];
		this.inMotion = false;
		this.motionSequenceIterator = 0;
	}

	enqueueMotion(x, y) {
		this.motionSequence.push(new p5.Vector(x, y));
	}

	enqueuePause() {
		this.motionSequence.push(new p5.Vector(0, 0));
	}

	startMotionSequence() {
		this.inMotion = true;
	}

	move() {
		let currentMotion = this.motionSequence[this.motionSequenceIterator];
		this.position.x = this.departurePosition.x + (currentMotion.x * config.motionProgress.percentTravelled);
		this.position.y = this.departurePosition.y + (currentMotion.y * config.motionProgress.percentTravelled);
	}

	render() {		// only function getting called every frame
		if (this.inMotion) {
			if (config.motionProgress.keyframe === 0) {
				console.log('next');
				this.motionSequenceIterator++;
				this.departurePosition.x = this.position.x;
				this.departurePosition.y = this.position.y;
			}
			this.move();
		}
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
	return
}

function initializeConfig() {
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

const MODIFIER_PANE_RIGHT = 190;
const MODIFIER_PANE_BOTTOM = 200;
const CURVE_MODIFIER_LENGTH = 150;
const CTRL_POINT_DIAMETER = 10;
const CURVE_ANCHOR1 = new p5.Vector(0, CURVE_MODIFIER_LENGTH);
const CURVE_ANCHOR2 = new p5.Vector(CURVE_MODIFIER_LENGTH, 0);
let MOTION_ITERATOR = 0;
let MAX_ITERATION = FRAME_RATE * config.animationDuration - 1;

function renderMotionCurveModifier() {
	push();
	translate(windowWidth - MODIFIER_PANE_RIGHT, windowHeight - MODIFIER_PANE_BOTTOM);

	stroke(0);
	strokeWeight(2);
	bezier(CURVE_ANCHOR1.x, CURVE_ANCHOR1.y, config.motionCtrlPt1.x, config.motionCtrlPt1.y, config.motionCtrlPt2.x, config.motionCtrlPt2.y, CURVE_ANCHOR2.x, CURVE_ANCHOR2.y);

	stroke(0);
	strokeWeight(1);
	ellipse(config.motionCtrlPt1.x, config.motionCtrlPt1.y, CTRL_POINT_DIAMETER, CTRL_POINT_DIAMETER);
	ellipse(config.motionCtrlPt2.x, config.motionCtrlPt2.y, CTRL_POINT_DIAMETER, CTRL_POINT_DIAMETER);
	pop();
}

function mousePressed() {
	adjustedMouseX = mouseX - (windowWidth - MODIFIER_PANE_RIGHT);
	adjustedMouseY = mouseY - (windowHeight - MODIFIER_PANE_BOTTOM);
	if (adjustedMouseX >= config.motionCtrlPt1.x - (CTRL_POINT_DIAMETER/2)
		&& adjustedMouseX <= config.motionCtrlPt1.x + (CTRL_POINT_DIAMETER/2)
		&& adjustedMouseY >= config.motionCtrlPt1.y - (CTRL_POINT_DIAMETER/2)
		&& adjustedMouseY <= config.motionCtrlPt1.y + (CTRL_POINT_DIAMETER/2) )
	{
		ctrlPtDragging = CTRLPT1;
	}
	else if (adjustedMouseX > config.motionCtrlPt2.x - (CTRL_POINT_DIAMETER/2)
		&& adjustedMouseX < config.motionCtrlPt2.x + (CTRL_POINT_DIAMETER/2)
		&& adjustedMouseY > config.motionCtrlPt2.y - (CTRL_POINT_DIAMETER/2)
		&& adjustedMouseY < config.motionCtrlPt2.y + (CTRL_POINT_DIAMETER/2) )
	{
		ctrlPtDragging = CTRLPT2;
	}
}

function mouseReleased() {
	ctrlPtDragging = null;
}

function setMotionCtrlPt() {
	adjustedMouseX = mouseX - (windowWidth - MODIFIER_PANE_RIGHT);
	adjustedMouseY = mouseY - (windowHeight - MODIFIER_PANE_BOTTOM);

	if (ctrlPtDragging === CTRLPT1) {
		config.motionCtrlPt1.x = constrain(adjustedMouseX, 0, CURVE_MODIFIER_LENGTH);
		config.motionCtrlPt1.y = constrain(adjustedMouseY, 0, CURVE_MODIFIER_LENGTH);
	}
	if (ctrlPtDragging === CTRLPT2) {
		config.motionCtrlPt2.x = constrain(adjustedMouseX, 0, CURVE_MODIFIER_LENGTH);
		config.motionCtrlPt2.y = constrain(adjustedMouseY, 0, CURVE_MODIFIER_LENGTH);
	}
}

function motionCycle() {
	MAX_ITERATION = FRAME_RATE * config.animationDuration - 1;

	push();
	translate(windowWidth - MODIFIER_PANE_RIGHT, windowHeight - MODIFIER_PANE_BOTTOM);

	x = bezierPoint(CURVE_ANCHOR1.x, config.motionCtrlPt1.x, config.motionCtrlPt2.x, CURVE_ANCHOR2.x, MOTION_ITERATOR / MAX_ITERATION);
	y = bezierPoint(CURVE_ANCHOR1.y, config.motionCtrlPt1.y, config.motionCtrlPt2.y, CURVE_ANCHOR2.y, MOTION_ITERATOR / MAX_ITERATION);
	ellipse(x, y, 10, 10);

	config.motionProgress.keyframe = MOTION_ITERATOR;
	config.motionProgress.percentTravelled = 1 - (y / CURVE_MODIFIER_LENGTH); // acounts for flipped y-axis in p5/processing
	pop();

	if (MOTION_ITERATOR <= MAX_ITERATION){
		MOTION_ITERATOR++;
	} else {
		MOTION_ITERATOR = 0;
	}
}

function initializeAnimation() {
	initializeConfig();

	if(config.animate) {
		switch(config.layout) {
			case GRID:
				for (let i = 0; i < dots.length; i++) {
					dots[i].enqueueMotion(config.gridSpacing, 0);
					dots[i].enqueueMotion(0, config.gridSpacing);
					dots[i].enqueueMotion(config.gridSpacing, 0);
				}
				for (let i = 0; i < dots.length; i++) {
					dots[i].startMotionSequence();
				}
				break;
			case CIRCLE:
				break;
			case TRIANGLE:
				break;
		}
	}

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
