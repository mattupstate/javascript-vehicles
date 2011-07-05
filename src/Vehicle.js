/**
 * Vehicle is a simple representation of an object with position, velocity, and
 * rotation. The vehicle can also be configured with the following properties:
 * 
 * Maximum Speed: vehicle.maxSpeed = Number (default=1)
 * Mass: vehicle.mass = Number (default=1)
 * Bounds: vehicle.bounds = Object (default={x:0, y:0, width:1000, height:1000})
 * Edge Behavior: vehicle.edgeBehavior = String ('WRAP' or 'BOUNCE')
 
 */
var Vehicle = Class.extend({
  init: function() {
    this.position = new Vector2D(0,0);
    this.velocity = new Vector2D(0,0);
    this.maxSpeed = 1;
    this.mass = 1;
    this.rotation = 0;
    this.edgeBehavior = "WRAP";
    this.bounds = {x:0, y:0, width:1000, height:1000}; 
  },
  /**
   * Update the vehicle's position and rotation according to it's velocity.
   
   */
  update: function() {
    this.velocity.truncate(this.maxSpeed);
    this.position = this.position.add(this.velocity);
    if(this.edgeBehavior == "WRAP") {
      this.wrap();
    } else if(this.edgeBehavior == "BOUNCE") {
      this.bounce();
    }
    this.rotation = this.velocity.getAngle() * 180 / Math.PI;
  },
  /**
   * Wraps the positions the vehicle if it has moved out of the defined bounds.
   
   */
  wrap: function() {
    if(this.bounds != undefined) {
      if(this.position.x > this.bounds.width) this.position.x = 0;
      if(this.position.x < 0) this.position.x = this.bounds.width;
      if(this.position.y > this.bounds.height) this.position.y = 0;
      if(this.position.y < 0) this.position.y = this.bounds.height;
    }
  },
  /**
   * Bounces the vehicle off the edge of the defined bounds
   
   */
  bounce: function() {
    if(this.bounds != undefined) {
      if(this.position.x > this.bounds.width) {
        this.position.x = this.bounds.width;
        this.velocity.x *= -1;
      } else if(this.position.x < this.bounds.x) {
        this.position.x = this.bounds.x;
        this.velocity.x *= -1;
      }
      if(this.position.y > this.bounds.height) {
        this.position.y = this.bounds.height;
        this.velocity.y *= -1;
      }
      else if(this.position.y < this.bounds.y) {
        this.position.y = this.bounds.y;
        this.velocity.y *= -1;
      }
    }
  }
});