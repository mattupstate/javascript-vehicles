/**
 * Sample steered vehicle application.
 */
var App = Class.extend({
  init: function(dCanvas,sCanvas) {
    this.dCanvas = dCanvas; // The canvas to draw to
    this.sCanvas = sCanvas; // The source canvas to pull colors from
    this.dContext = dCanvas.getContext('2d'); // drawing canvas context	
    this.sContext = sCanvas.getContext('2d'); // source canvas context
    this.mv = new Vector2D(0,0); // Conducting vector for all vehicles to follow
    this.vehicles = []; // Array to hold all the vehicles to be created
    this.newWayPoint(); // Set's a new way point for the conductor
    this.painting = false; // Flag to denote if the app is drawing on the canvas or not
    this.lineWidthMod = 1; // Line width modifier
  },
  /**
   * Updates the position of all the vehicles and draws lines between their
   * last position and their current position using a color samples from the 
   * source cavas.
   */
  update: function() {
    var width = this.dContext.lineWidth + this.lineWidthMod;
    this.dContext.lineWidth = width; 
    // loop through all vehicles
    for(var i = 0; i < this.vehicles.length; i++) {
      var v = this.vehicles[i]; // vehicle
      var lastP = v.position; // last position
      
      v.arrive(this.mv) // steer vehicle towards conductor using 'arrive' style
      v.update(); // update the vehicle's position 
      var dX = Math.min(this.sCanvas.width-5, Math.max(5,parseInt(v.position.x)));
      var dY = Math.min(this.sCanvas.height-5, Math.max(5,parseInt(v.position.y)));
      var pd = this.sContext.getImageData(dX, dY, 1, 1).data; // Get the pixel data
      
      this.dContext.strokeStyle = "#"+Utils.RGBtoHex(pd[0], pd[1], pd[2]); // set the stroke style
      this.dContext.beginPath(); // begin drawing
      this.dContext.moveTo(lastP.x, lastP.y); // move to vehicle's last position
      this.dContext.lineTo(v.position.x, v.position.y); // draw line to vector's current position
      this.dContext.stroke(); // draw the stroke
    }
    // this conditional gradually changes the width of the stroke 
    if(this.dContext.lineWidth == 6) {
      this.lineWidthMod = -1;
    }
    if(this.dContext.lineWidth == 1) {
      this.lineWidthMod = 1;
    }
  },
  /**
   * Set a new waypoint for the vehicles to follow.
   */
  newWayPoint: function() {
    this.mv.x = Math.random() * this.dCanvas.width;
    this.mv.y = Math.random() * this.dCanvas.height;
  },
  /**
   * Creates a vehicle with random configuration of maxSpeed, maxForce, color, velocity,
   * and set's the bounds to that of the drawing canvas.
   */
  createVehicle: function() {
    var radius = 0;
    var v = new SteeredVehicle();
    v.maxSpeed = 10 + Math.random() * 30;
    v.maxForce = 1 + Math.random() * 3;
    v.color = Utils.randomColor();
    v.velocity = new Vector2D(-5+Math.random()*10,-5+Math.random()*10)
    v.position = new Vector2D(this.dCanvas.width/2,this.dCanvas.height/2);
    v.bounds = {x:radius,y:radius,width:this.dCanvas.width-radius,height:this.dCanvas.height-radius};
    v.edgeBehavior = "BOUNCE";
    return v;
  },
  /**
   * Add the specified amount of vehicles.
   */
  addVehicles: function(num) {
    for(var i = 0; i < num; i++) {
      this.vehicles.push(this.createVehicle());
    }
  },
  /**
   * Remove all the current vehicles.
   */
  clearVehicles: function() {
    for(var i = 0; i < this.vehicles.length; i++) {
      this.vehicles.pop();
    }
    this.vehicles = [];
  },
  /**
   * Start drawing with the specified frequency and frequency of new way points
   */
  startPaint: function(freq1, freq2) {
    if(freq1==null) freq1 = 33;
    if(freq2==null) freq2 = 500;
    this.dContext.lineWidth = 1;
    this.paintInterval = setInterval(function(that) {that.update();},freq1,this);
    this.targetInterval = setInterval(function(that) {that.newWayPoint();}, freq2, this);
    this.painting = true;
  },
  /**
   * Stop drawing
   */
  stopPaint: function() {
    clearInterval(this.paintInterval);
    clearInterval(this.targetInterval);
    this.painting = false;
  },
  /**
   * Move's the way point to the x and y position of the mouse above the drawing canvas.
   */
  watchMouse: function(e) {
    mv.x = e.clientX - dCanvas.offsetLeft;
    mv.y = e.clientY - dCanvas.offsetTop;
  },
  /**
   * Clear the drawing canvas.
   */
  clearCanvas: function() {
    this.dContext.clearRect(0,0,this.dCanvas.width,this.dCanvas.height);
    this.dCanvas.width = this.dCanvas.width;
  }
});
