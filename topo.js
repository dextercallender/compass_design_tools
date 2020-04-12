let topoCnv;
let points = [];
let maxPointHeight;
let minPointHeight;
let planes = [];
let easycam;
p5.disableFriendlyErrors = true; // disables FES

const BLACK = 'BLACK';
const WHITE = 'WHITE';

let Config = function() {
	this.gridWidth = 150;		  // Width = # of dots
	this.gridHeight = 150;
  this.topoHeight = 200;
  this.noiseX = 0.01;
  this.noiseY = 0.009;
  this.planeSpacing = 10;
  this.varyPlaneSpeed = false;
  this.fill = BLACK;
}
let config = new Config();

function setup() {
  topoCnv = createCanvas(windowWidth, windowHeight, WEBGL);
  topoCnv.parent('topo-tool-canvas');

  initializeConfig();

  var gui = new dat.GUI( {autoplace: false, width: 300 });

  gui.add(config, 'gridWidth', 50, 200).onChange(initializeConfig);
	gui.add(config, 'gridHeight', 50, 200).onChange(initializeConfig);
  gui.add(config, 'topoHeight',50, 250).onChange(initializeConfig);
  gui.add(config, 'noiseX',0.001, 0.02).onChange(initializeConfig);
  gui.add(config, 'noiseY',0.001, 0.02).onChange(initializeConfig);
  gui.add(config, 'fill', [BLACK, WHITE]);

  Dw.EasyCam.prototype.apply = function(n) {
   var o = this.cam;
   n = n || o.renderer,
     n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
 };
 easycam = createEasyCam({distance: 225});

}

function draw() {
  if (config.fill === BLACK) {
    background(255);
  }

  if (config.fill === WHITE) {
    background(0);
  }

  performIntersection();

  renderGraphicCentered();

  updatePlanes();
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
  let intersecting;
  let j;
  for (let i = 0; i < points.length; i++) {
    intersecting = false;
    j = 0;
    while (j < planes.length && !intersecting) {
      if (round(points[i].position.z) === round(planes[j].z)) {
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
      points[i].displayColor = fillColor
    } else {
      points[i].display = false;

    }
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
