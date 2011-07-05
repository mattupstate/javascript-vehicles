/**
 * SteeredVehicle is an extension of Vehicle which adds basic steering methods.
 * A steered vehicle can be configured with the following additional properties:
 * 
 * Maximum Forece: vehicle.maxForce = Number (default=1)
 * Arrival Threshold: vehicle.arrivalThreshold = Number (default=100)
 * Wander Distance: vehicle.wanderDistance = Number (default=10)
 * Wander Radius: vehicle.wanderRadius = Number (default=5)
 * Wander Range: vehicle.wanderRange = Number (default=1)
 * Path Threshold: vehicle.pathThreshold = Number (default=20)
 * Avoid Distance: vehicle.avoidDistance = Number (default=300)
 * Avoid Buffer: vehicle.avoidBuffer = Number (defualt=20)
 * In Sight Distance: vehicle.inSightDist = Number (default=200)
 * Too Close Distance: vehicle.tooCloseDist = Number (default=60)
 
 */
var SteeredVehicle = Vehicle.extend({
  init: function() {
    this._super();
    this.maxForce = 1;
    this.steeringForce = new Vector2D(0,0);
    this.arrivalThreshold = 100;
    this.wanderAngle = 0;
    this.wanderDistance = 10;
    this.wanderRadius = 5;
    this.wanderRange = 1;
    this.pathIndex = 0;
    this.pathThreshold = 20;
    this.avoidDistance = 300;
    this.avoidBuffer = 20;
    this.inSightDist = 200;
    this.tooCloseDist = 60;
    this.hasArrived = false;
  },
  /**
   * Update the vehicle's position and rotation according to it's velocity and
   * steering forces.
   
   */
  update: function() {
    this.steeringForce.truncate(this.maxForce);
    this.steeringForce = this.steeringForce.divide(this.mass);
    this.velocity = this.velocity.add(this.steeringForce);
    this.steeringForce = new Vector2D(0,0);
    this._super();
  },
  /**
   * Eagerly steers and follows the vehicle towards the specified target. 
   
   */
  seek: function(target) {
    var desiredVelocity = target.subtract(this.position);
    desiredVelocity.normalize();
    desiredVelocity = desiredVelocity.multiply(this.maxSpeed);
    var force = desiredVelocity.subtract(this.velocity);
    this.steeringForce = this.steeringForce.add(force);
  },
  /**
   * Steers the vehicle directly away form the specified target, attempting 
   * to avoid the target at all times.
   
   */
  flee: function(target) {
    var desiredVelocity = target.subtract(this.position);
    desiredVelocity.normalize();
    desiredVelocity = desiredVelocity.multiply(this.maxSpeed);
    var force = desiredVelocity.subtract(this.velocity);
    this.steeringForce = this.steeringForce.subtract(force);
  },
  /**
   * Steers the vehicle towards the specified target but also eases the 
   * arrival of the vehicle to match that of the target.
   
   */
  arrive: function(target) {
    var desiredVelocity = target.subtract(this.position);
    desiredVelocity.normalize();
    var dist = this.position.dist(target);
    if(dist > this.arrivalThreshold) {
      this.hasArrived = false;
      desiredVelocity = desiredVelocity.multiply(this.maxSpeed);
    } else {
      this.hasArrived = true;
      desiredVelocity = desiredVelocity.multiply(this.maxSpeed * dist / this.arrivalThreshold);
    }
    var force = desiredVelocity.subtract(this.velocity);
    this.steeringForce = this.steeringForce.add(force);
  },
  /**
   * Steers the vehicle towards a predicted position based on the target's
   * position and velocity, effectively making the vehicle 'smarter'.
   
   */
  pursue: function(target) {
    var lookAheadTime = this.position.dist(target.position) / this.maxSpeed;
    var predictedTarget = target.position.add(target.velocity.multiply(lookAheadTime));
    this.seek(predictedTarget);
  },
  /**
   * Steers the vehicle away from a predicted position based on the target's
   * position and velocity, effectively making the vehicle 'smarter'
   
   */
  evade: function(target) {
    var lookAheadTime = this.position.dist(target.position) / this.maxSpeed;
    var predictedTarget = target.position.subtract(target.velocity.multiply(lookAheadTime));
    this.flee(predictedTarget);
  },
  /**
   * Steers the vehicle in a smooth, slightly random manner.
   
   */
  wander: function() {
    var center = this.velocity.clone().normalize().multiply(this.wanderDistance);
    var offset = new Vector2D(0,0);
    offset.setLength(this.wanderRadius);
    offset.setAngle(this.wanderAngle);
    this.wanderAngle += Math.random() * this.wanderRange - this.wanderRange * .5;
    var force = center.add(offset);
    this.steeringForce = this.steeringForce.add(force);
  },
  /**
   * Steers the vehicle in a direction away from a specified list of other vehicles.
   
   */
  avoid: function(vehicles) {
    var i = 0;
    var amt = vehicles.length;
    for(i; i < amt; i++) {
      var circle = vehicles[i];
      var heading = this.velocity.clone().normalize();
      
      var difference = circle.position.subtract(this.position);
      var dotProd = difference.dotProd(heading);
      
      if(dotProd > 0) {
        var feeler = heading.multiply(this.avoidDistance);
        var projection = heading.multiply(dotProd);
        var dist = projection.subtract(difference).getLength();
        
        if(dist < circle.radius + this.avoidBuffer && projection.getLength() < feeler.getLength()) {
          var force = heading.multiply(this.maxSpeed);
          force.setAngle(force.getAngle() + difference.sign(this.velocity) * Math.PI / 2);
          force = force.multiply(1.0 - projection.getLength() / feeler.getLength());
          this.steeringForce = this.steeringForce.add(force);
          this.velocity = this.velocity.multiply(projection.getLength() / feeler.getLength());
        }
      }
    }
  },
  /**
   * Steers the vehicle along a specified path.
   
   */
  followPath: function(path, loop) {
    var wayPoint = path[this.pathIndex];
    if(wayPoint == undefined) return;
    if(this.position.dist(wayPoint) < this.pathThreshold) {
      if(this.pathIndex >= path.length - 1) {
        if(loop) {
          this.pathIndex = 0;
        }
      } else {
        this.pathIndex++;
      }
    }
    if(this.pathIndex >= path.length - 1 && !loop) {
      arrive(wayPoint);
    } else {
      seek(wayPoint);
    }
  },
  /**
   * Steers the vehicle in a flocking/group fashion based on the specified
   * list of vehicles in the flock/group.
   
   */
  flock: function(vehicles) {
    var averageVelocity = this.velocity.clone();
    var averagePosition = new Vector2D(0,0);
    var inSightCount = 0;
    for(var i = 0; i < vehicles.length; i++) {
      var vehicle = vehicles[i];
      if(vehicle != this && inSight(vehicle)) {
        averageVelocity = averageVelocity.add(vehicle.velocity);
        averagePosition = averagePosition.add(vehicle.position);
        if(tooClose(vehicle)) flee(vehicle.position);
        inSightCount++;
      }
    }
    if(inSightCount > 0) {
      averageVelocity = averageVelocity.divide(inSightCount);
      averagePosition = averagePosition.divide(inSightCount);
      seek(averagePosition);
      this.steeringForce.add(averageVelocity.subtract(this.velocity));
    }
  },
  /**
   * Checks if the specified vehicle is in sight of this vehicle based on the
   * vehicle's inSightDist property.
   
   */
  inSight: function(vehicle) {
    if(this.position.dist(vehicle.position) > this.inSightDist) return false;
    var heading = this.velocity.clone().normalize();
    var difference = vehicle.position.subtract(this.position);
    var dotProd = difference.dotProd(heading);
    
    if(dotProd < 0) return false;
    return true;
  },
  /**
   * Determines if the specified vehicle is too close to this vechicle based 
   * on the vehicle's tooClostDist property.
   
   */
  tooClose: function(vehicle) {
    return this.position.dist(vehicle.position) < this.tooCloseDist;
  }
});