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
  update: function() {
    this.steeringForce.truncate(this.maxForce);
    this.steeringForce = this.steeringForce.divide(this.mass);
    this.velocity = this.velocity.add(this.steeringForce);
    this.steeringForce = new Vector2D(0,0);
    this._super();
  },
  seek: function(target) {
    var desiredVelocity = target.subtract(this.position);
    desiredVelocity.normalize();
    desiredVelocity = desiredVelocity.multiply(this.maxSpeed);
    var force = desiredVelocity.subtract(this.velocity);
    this.steeringForce = this.steeringForce.add(force);
  },
  flee: function(target) {
    var desiredVelocity = target.subtract(this.position);
    desiredVelocity.normalize();
    desiredVelocity = desiredVelocity.multiply(this.maxSpeed);
    var force = desiredVelocity.subtract(this.velocity);
    this.steeringForce = this.steeringForce.subtract(force);
  },
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
  pursue: function(target) {
    var lookAheadTime = this.position.dist(target.position) / this.maxSpeed;
    var predictedTarget = target.position.add(target.velocity.multiply(lookAheadTime));
    this.seek(predictedTarget);
  },
  evade: function(target) {
    var lookAheadTime = this.position.dist(target.position) / this.maxSpeed;
    var predictedTarget = target.position.subtract(target.velocity.multiply(lookAheadTime));
    this.flee(predictedTarget);
  },
  wander: function() {
    var center = this.velocity.clone().normalize().multiply(this.wanderDistance);
    var offset = new Vector2D(0,0);
    offset.setLength(this.wanderRadius);
    offset.setAngle(this.wanderAngle);
    this.wanderAngle += Math.random() * this.wanderRange - this.wanderRange * .5;
    var force = center.add(offset);
    this.steeringForce = this.steeringForce.add(force);
  },
  avoid: function(vehicles) {
    var i = 0;
    var amt = vehicles.length;
    for(i; i < amt; i++) {
      var circle = vehicles[i];
      var heading = this.velocity.clone().normalize();
      
      // vector between circle and vehicle:
      var difference = circle.position.subtract(this.position);
      var dotProd = difference.dotProd(heading);
      
      // if circle is in front of vehicle...
      if(dotProd > 0) {
        // vector to represent "feeler" arm
        var feeler = heading.multiply(this.avoidDistance);
        // project difference vector onto feeler
        var projection = heading.multiply(dotProd);
        // distance from circle to feeler
        var dist = projection.subtract(difference).getLength();
        
        // if feeler intersects circle (plus buffer),
        //and projection is less than feeler length,
        // we will collide, so need to steer
        if(dist < circle.radius + this.avoidBuffer && projection.getLength() < feeler.getLength()) {
          // calculate a force +/- 90 degrees from vector to circle
          var force = heading.multiply(this.maxSpeed);
          force.setAngle(force.getAngle() + difference.sign(this.velocity) * Math.PI / 2);
          
          // scale this force by distance to circle.
          // the further away, the smaller the force
          force = force.multiply(1.0 - projection.getLength() / feeler.getLength());
          
          // add to steering force
          this.steeringForce = this.steeringForce.add(force);
          
          // braking force
          this.velocity = this.velocity.multiply(projection.getLength() / feeler.getLength());
        }
      }
    }
  },
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
  inSight: function(vehicle) {
    if(this.position.dist(vehicle.position) > this.inSightDist) return false;
    var heading = this.velocity.clone().normalize();
    var difference = vehicle.position.subtract(this.position);
    var dotProd = difference.dotProd(heading);
    
    if(dotProd < 0) return false;
    return true;
  },
  tooClose: function(vehicle) {
    return this.position.dist(vehicle.position) < this.tooCloseDist;
  }
});