let topoCnv;
let points = [];
let intersectingPointsIndices = [];
let pointGroups = [];
let maxPointHeight;
let minPointHeight;
let planes = [];
let easycam;
p5.disableFriendlyErrors = true; // disables FES

const BLACK = 'BLACK';
const WHITE = 'WHITE';

let Config = function() {
	this.gridWidth = 170;		  // Width = # of dots
	this.gridHeight = 170;
  this.topoHeight = 200;
  this.noiseX = 0.011;
  this.noiseY = 0.012;
  this.planeSpacing = 10;
  this.varyPlaneSpeed = false;
  this.fill = BLACK;
	this.pause = false;
}
let config = new Config();

function setup() {
  topoCnv = createCanvas(windowWidth, windowHeight, WEBGL);
  topoCnv.parent('topo-tool-canvas');

  initializeConfig();

  var gui = new dat.GUI( {autoplace: false, width: 300 });

  gui.add(config, 'gridWidth', 50, 210).onChange(initializeConfig);
	gui.add(config, 'gridHeight', 50, 210).onChange(initializeConfig);
  gui.add(config, 'topoHeight',50, 250).onChange(initializeConfig);
  gui.add(config, 'noiseX',0.001, 0.02).onChange(initializeConfig);
  gui.add(config, 'noiseY',0.001, 0.02).onChange(initializeConfig);
  gui.add(config, 'fill', [BLACK, WHITE]);
	gui.add(config, 'pause', false);

  Dw.EasyCam.prototype.apply = function(n) {
   var o = this.cam;
   n = n || o.renderer,
     n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
 };
 easycam = createEasyCam({distance: 250});

}

function draw() {
  if (config.fill === BLACK) {
    background(255);
  }

  if (config.fill === WHITE) {
    background(0);
  }

	if (!config.pause) {
  	performIntersection();
		groupPointsPerPlane();
	}
  renderGraphicCentered();

	if (!config.pause) {
  	updatePlanes();
	}
}

class Point {
  constructor(position, display, displayColor) {
    this.position = position;
    this.display = display;
    this.displayColor = displayColor;
  }

  render() {
    if (this.display) {
      stroke(this.displayColor);
      point(this.position);
    }
  }
}

class Plane {
  constructor(z) {
    this.z = z;
  }

  update(zIncrement) {
    this.z += zIncrement;
  }
}

function initializeConfig() {
  points = [];
  maxPointHeight = -1;
  minPointHeight = config.topoHeight;
  for (let y = 0; y < config.gridHeight; y++) {
    for (let x = 0; x < config.gridWidth; x++) {
      z =  (noise(x * config.noiseX, y * config.noiseY) * config.topoHeight) - (config.topoHeight / 2);
      if (z < minPointHeight) { minPointHeight = z; }
      if (z > maxPointHeight) { maxPointHeight = z; }
      points.push( new Point(new p5.Vector(x, y, z), false, color(1,1,10)) );
    }
  }
  planes = [];
  for (z = minPointHeight; z < maxPointHeight; z += config.planeSpacing) {
    planes.push(new Plane(z));
  }
}

function performIntersection() {
	intersectingPointsIndices = [];	// group intersecting poitns by z-indices
  let intersecting;
  let j;
  for (let i = 0; i < points.length; i++) {
    intersecting = false;
    j = 0;
    while (j < planes.length && !intersecting) {

			// TODO: compare to the heightest precision
			// TODO: or some relatively high precision to smooth out the data
      if (round(points[i].position.z) === round(planes[j].z, 1)) {
        intersecting = true;
      }
      j++;
    }
    if (config.fill === BLACK) {
      fillColor = color(0,0,0);
    } else {
      fillColor = color(255,255,255);
    }
    if (intersecting) {
      points[i].display = true;
      points[i].displayColor = fillColor;
			intersectingPointsIndices.push(i);
    } else {
      points[i].display = false;

    }
  }
}

function groupPointsPerPlane() {

	/* group by z indices first */

	// also its not just distance threshold of 20, you must find the next closest point

	/*
		Distance matrix

		 p1 p2 p3 p4 p5 p6 p7
	p1 0  3	 2  6  8  1  7
 	p2  	0  5  7  2  4  9
	p3       0  5
	p4         0
	p5            0
	p6               0
	p7                 0

	only compute triange from matrix
	find point that starts closest to an edge where x = 0, y = 0, x = length, y = length
	use the matrix

	*/

	/* wrong algorithm */
	/* destructive of intersectingPointsIndices */
	pointGroups = [];
	let currentPt;
	let group;
	let remainingPointCount = intersectingPointsIndices.length;
	let i = 0;
	while (i < remainingPointCount) {
		currentPt = points[i];
		group = [currentPt];
		remainingPointCount = intersectingPointsIndices.length;
		let j = i + 1;
		while (j < remainingPointCount) {
			if ( dist(currentPt.position.x, currentPt.position.y, points[j].position.x, points[j].position.y) < 20 ) {
				group.push(points[j]);
				intersectingPointsIndices.splice(j, 1);
			}
			remainingPointCount = intersectingPointsIndices.length;
			j++;
		}
		// console.log(group.length);
		pointGroups.push(group);
		i++;
	}
}

function updatePlanes() {
  for (let i = 0; i < planes.length; i++) {
		planes[i].z += 1;
    if (planes[i].z > maxPointHeight) {
      planes[i].z = minPointHeight;
    }
  }
}

function renderGraphicCentered() {
  push();
  translate(-config.gridWidth / 2, -config.gridHeight / 2, 0);
  for (let i = 0; i < points.length; i++ ) { points[i].render(); }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
