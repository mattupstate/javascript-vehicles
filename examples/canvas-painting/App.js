var App = Class.extend({
  init: function(dCanvas,sCanvas) {
    this.dCanvas = dCanvas;
    this.sCanvas = sCanvas;
    this.dContext = dCanvas.getContext('2d');
    this.sContext = sCanvas.getContext('2d');
    this.mv = new Vector2D(0,0);
    this.vehicles = [];
    this.newWayPoint();
    this.painting = false;
    this.lineWidthMod = 1;
  },
  update: function() {
    var width = this.dContext.lineWidth + this.lineWidthMod;
    this.dContext.lineWidth = width; 
    for(var i = 0; i < this.vehicles.length; i++) {
      var v = this.vehicles[i];
      var lastP = v.position;
      
      v.arrive(this.mv)
      v.update();
      var dX = Math.min(this.sCanvas.width-5, Math.max(5,parseInt(v.position.x)));
      var dY = Math.min(this.sCanvas.height-5, Math.max(5,parseInt(v.position.y)));
      var pd = this.sContext.getImageData(dX, dY, 1, 1).data;
      
      this.dContext.strokeStyle = "#"+Utils.RGBtoHex(pd[0], pd[1], pd[2]);; 
      this.dContext.beginPath();
      this.dContext.moveTo(lastP.x, lastP.y);
      this.dContext.lineTo(v.position.x, v.position.y);
      this.dContext.stroke();
    }
    if(this.dContext.lineWidth == 6) {
      this.lineWidthMod = -1;
    }
    if(this.dContext.lineWidth == 1) {
      this.lineWidthMod = 1;
    }
  },
  newWayPoint: function() {
    this.mv.x = Math.random() * this.dCanvas.width;
    this.mv.y = Math.random() * this.dCanvas.height;
  },
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
  addVehicles: function(num) {
    for(var i = 0; i < num; i++) {
      this.vehicles.push(this.createVehicle());
    }
  },
  clearVehicles: function() {
    for(var i = 0; i < this.vehicles.length; i++) {
      this.vehicles.pop();
    }
    this.vehicles = [];
  },
  startPaint: function(freq1, freq2) {
    if(freq1==null) freq1 = 33;
    if(freq2==null) freq2 = 500;
    this.dContext.lineWidth = 1;
    this.paintInterval = setInterval(function(that) {that.update();},freq1,this);
    this.targetInterval = setInterval(function(that) {that.newWayPoint();}, freq2, this);
    this.painting = true;
  },
  stopPaint: function() {
    clearInterval(this.paintInterval);
    clearInterval(this.targetInterval);
    this.painting = false;
  },
  watchMouse: function(e) {
    mv.x = e.clientX - dCanvas.offsetLeft;
    mv.y = e.clientY - dCanvas.offsetTop;
  },
  clearCanvas: function() {
    this.dContext.clearRect(0,0,this.dCanvas.width,this.dCanvas.height);
    this.dCanvas.width = this.dCanvas.width;
  }
});
