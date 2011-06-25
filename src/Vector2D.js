var Vector2D = Class.extend({
  init: function(x,y){
    this.x = x;
    this.y = y;
  },
  clone: function() {
    return new Vector2D(this.x, this.y);
  },
  zero: function() {
    this.x = 0;
    this.y = 0;
    return this;
  },
  isZero: function() {
    return this.x == 0 && this.y == 0;
  },
  lengthSQ: function() {
    return this.x*this.x + this.y*this.y;
  },
  getLength: function() {
    return Math.sqrt(this.lengthSQ());
  },
  setLength: function(val) {
    var a = this.getAngle();
    this.x = Math.cos(a) * val;
    this.y = Math.sin(a) * val;
  },
  getAngle: function() {
    return Math.atan2(this.y, this.x);
  },
  setAngle: function(val) {
    var len = this.getLength();
    this.x = Math.cos(val) * len;
    this.y = Math.sin(val) * len;
  },
  normalize: function() {
    if(this.getLength() == 0) {
      this.x = 1;
      return this;
    }
    var len = this.getLength();
    this.x /= len;
    this.y /= len;
    return this;
  },
  isNormalized: function() {
    return this.getLength() == 1;
  },
  truncate: function(max) {
    this.setLength(Math.min(max, this.getLength()));
    return this;
  },
  reverse: function() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  },
  dotProd: function(v2) {
    return this.x*v2.x + this.y*v2.y;
  },
  angleBetween: function(v1,v2) {
    if(!v1.isNormalized()) v1 = v1.clone().normalize();
    if(!v2.isNormalized()) v2 = v2.clone().normalize();
    return Math.acos(v1.dotProd(v2));
  },
  sign: function(v2) {
    return this.perp().dotProd(v2) < 0 ? -1 : 1;
  },
  perp: function() {
    return new Vector2D(-this.y, this.x);
  },
  dist: function(v2) {
    return Math.sqrt(this.distSQ(v2));
  },
  distSQ: function(v2) {
    var dx = v2.x - this.x;
    var dy = v2.y - this.y;
    return dx * dx + dy * dy;
  },
  add: function(v2) {
    return new Vector2D(this.x + v2.x, this.y + v2.y);
  },
  subtract: function(v2) {
    return new Vector2D(this.x - v2.x, this.y - v2.y);
  },
  multiply: function(value) {
    return new Vector2D(this.x * value, this.y * value);
  },
  divide: function(value) {
    return new Vector2D(this.x/value, this.y/value);
  },
  equals: function(v2) {
    return this.x == v2.x && this.y == v2.y;
  },
  toString: function() {
    return "[Vector2D (x:"+this.x+", y:"+this.y+")]";
  }
});
