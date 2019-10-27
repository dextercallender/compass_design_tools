let cnv;
let gui;
let compassRegular;
let compassItalic;

// be careful with these global variable names

function preload() {
  compassRegular = loadFont('fonts/CompassSans-Regular.ttf')
  compassItalic = loadFont('fonts/CompassSans-Italic.ttf')
}

function setup() {
  cnv = createCanvas(windowWidth - 300, windowHeight - 200)
  cnv.parent('needle-tool-canvas');
  background(0,0,0);

  gui = createGui();
  gui.setFont(compassRegular);
  gui.setTextSize(12);
  gui.setRounding(5);
  gui.setStrokeWeight(1);
  gui.setTrackWidth(1);

  let buttonStyle = {
    //fillBg: color("#D00000")
  }

  let sliderStyle = {
    //fillBg: color("#D00000"),
    trackWidth: 0.1
  }

  buttonColorInvert = createButton("Invert Color", 50, 50, 100, 20);
  sliderCanvasWidth = createSlider("Canvas Width", 100, 100, 300, 32, 100, 300)

  buttonColorInvert.setStyle(buttonStyle);
  sliderCanvasWidth.setStyle(sliderStyle);
}

function draw() {
  drawGui();
  ellipse(0,0,50,50);

  if (buttonColorInvert.isPressed) {
   // Print a message when Button is pressed.
   print(buttonColorInvert.label + " pressed.")
 }

  if (sliderCanvasWidth.isChanged) {
     print(sliderCanvasWidth.label + " = " + s.val)
  }
}

function windowResized() {
  resizeCanvas(windowWidth - 300, windowHeight - 200);
  background(0,0,0);
}

function reDraw(){
  // redraw a new canvas at export size
  // redraw the art at resolution
  // export canvas

}
