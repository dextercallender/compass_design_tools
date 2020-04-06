let topoCnv;

// be careful with these global variable names

function setup() {
  topoCnv = createCanvas(windowWidth, windowHeight)

  topoCnv.parent('needle-tool-canvas');
  background(0,0,0);

}

function draw() {
  ellipse(0,0,50,50);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
