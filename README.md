# JavaScript Vehicles

A JavaScript implementation of simple steered vehicles.

### Usage

Simply include the scripts in this order in your HTML page.

    <script type="text/javascript" src="Class.js"></script>
    <script type="text/javascript" src="Vector2D.js"></script>
    <script type="text/javascript" src="Vehicle.js"></script>
    <script type="text/javascript" src="SteeredVehicle.js"></script>

Create new vehicles like so:

    var v = new SteeredVehicle();
    v.maxSpeed = 10 + Math.random() * 30;
    v.maxForce = 1 + Math.random() * 3;
    v.velocity = new Vector2D(5+Math.random()*10,5+Math.random()*10)
    v.position = new Vector2D(0, 0);
    v.bounds = {x:0, y:0, width:1000, height:1000};
    v.edgeBehavior = "WRAP";

Setup an interval and make the vehicle(s) move:

    var interval = setInterval(function() {
      v.wander();
      v.update();
    }, 30);

Then its up to you to do the rest! Maybe draw some lines or create a flock of vehicles. Go crazy!