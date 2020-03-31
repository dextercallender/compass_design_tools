let cnv;

let colors;

function setup() {
	createCanvas(400, 400);

	colors = new Color();
	var gui = new dat.GUI();
	gui.add(colors, 'g', 0, 255);
}

function draw() {
	cnv = createCanvas(windowWidth, windowHeight)
  cnv.parent('dot-tool-canvas');
	fill(colors.r, colors.g, colors.b);
	ellipse(20, 20, 20, 20);

}

function Color() {
  this.r = 255;
  this.g = 100;
  this.b = 255;
}
