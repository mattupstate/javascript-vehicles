/**
 * Vector2D is an object that represents a two-dimensional vector. It can be
 * used to represent position and forces such as velocity, accelleration and more.
 
 */
var Vector2D = Class.extend({
  init: function(x,y){
    this.x = x;
    this.y = y;
  },
  /**
   * Makes a copy of this vector.
   */
  clone: function() {
    return new Vector2D(this.x, this.y);
  },
  /**
   * Zero's out the vectory, setting the x and y positions to 0.
   
   */
  zero: function() {
    this.x = 0;
    this.y = 0;
    return this;
  },
  /**
   * Flag that denotes if the vector is zeroed or not.
   
   */
  isZero: function() {
    return this.x == 0 && this.y == 0;
  },
  /**
   * The value of the vector's length squared.
   
   */
  lengthSQ: function() {
    return this.x*this.x + this.y*this.y;
  },
  /**
   * The vector length (distance between x and y).
   
   */
  getLength: function() {
    return Math.sqrt(this.lengthSQ());
  },
  /**
   * Set the length
   */
  setLength: function(val) {
    var a = this.getAngle();
    this.x = Math.cos(a) * val;
    this.y = Math.sin(a) * val;
  },
  /**
   * The vector angle in radians
   
   */
  getAngle: function() {
    return Math.atan2(this.y, this.x);
  },
  /**
   * Set t he angle in radians
   
   */
  setAngle: function(val) {
    var len = this.getLength();
    this.x = Math.cos(val) * len;
    this.y = Math.sin(val) * len;
  },
  /**
   * Normalizes the vector.
   
   */
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
  /**
   * Flag that denotes if the vector is normalized.
   
   */
  isNormalized: function() {
    return this.getLength() == 1;
  },
  /**
   * Truncate the vector's distance with the specified maximum distance
   
   */
  truncate: function(max) {
    this.setLength(Math.min(max, this.getLength()));
    return this;
  },
  /**
   * Invert the vector's direction.
   
   */
  reverse: function() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  },
  /**
   * Get the vector's dot product.
   
   */
  dotProd: function(v2) {
    return this.x*v2.x + this.y*v2.y;
  },
  /**
   * Determine the angle between two vectors.
   
   */
  angleBetween: function(v1,v2) {
    if(!v1.isNormalized()) v1 = v1.clone().normalize();
    if(!v2.isNormalized()) v2 = v2.clone().normalize();
    return Math.acos(v1.dotProd(v2));
  },
  /**
   * Sign the vector with the specified vector.
   
   */
  sign: function(v2) {
    return this.perp().dotProd(v2) < 0 ? -1 : 1;
  },
  /**
   * Get a vector that is perpendicular to this vector.
   
   */
  perp: function() {
    return new Vector2D(-this.y, this.x);
  },
  /**
   * Get the distance between the specified vector and this vector;
   
   */
  dist: function(v2) {
    return Math.sqrt(this.distSQ(v2));
  },
  /**
   * Get the distance squared between the specified vector and this vector;
   */
  distSQ: function(v2) {
    var dx = v2.x - this.x;
    var dy = v2.y - this.y;
    return dx * dx + dy * dy;
  },
  /**
   * Add the sepcified vector this vector. 
   
   */
  add: function(v2) {
    return new Vector2D(this.x + v2.x, this.y + v2.y);
  },
  /**
   * Subtract the sepcified vector this vector. 
   */
  subtract: function(v2) {
    return new Vector2D(this.x - v2.x, this.y - v2.y);
  },
  /**
   * Multiply the sepcified vector this vector. 
   */
  multiply: function(value) {
    return new Vector2D(this.x * value, this.y * value);
  },
  /**
   * Divide the sepcified vector this vector. 
   */
  divide: function(value) {
    return new Vector2D(this.x/value, this.y/value);
  },
  /**
   * Check if the specified vector is equal to this vector. 
   */
  equals: function(v2) {
    return this.x == v2.x && this.y == v2.y;
  },
  toString: function() {
    return "[Vector2D (x:"+this.x+", y:"+this.y+")]";
  }
});
