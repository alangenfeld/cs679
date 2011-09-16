/**
 * why not have some utility classes
 */
function $() {
  return document.getElementById.apply(document, arguments);
}

function Point(x, y) {
  this.x = x;
  this.y = y;

  this.move = function(v) {
    this.x += v.x;
    this.y += v.y;
  };

  this.distance = function(p) {
    x = p.x - this.x;
    y = p.y - this.y;
    return Math.sqrt(x*x + y*y);
  };

  this.vectorTo = function(p, mag) { 
    x = p.x - this.x;
    y = p.y - this.y;
    return new Vector(x, y, mag);
  };
}

function Vector(x, y, mag) {
  var length = Math.sqrt(x*x + y*y);
  if (!mag) {
    mag = 1;
  }

  this.x = 0;
  this.y = 0;

  if(length != 0) {
    this.x = (x/length) * mag;
    this.y = (y/length) * mag;
  }

  this.inverse = function() {
    this.x = -this.x;
    this.y = -this.y;
  };
}

function averageVectors(vectors, mag) {
  var x = 0;
  var y = 0;

  for (idx in vectors) {
    x += vectors[idx].x;
    y += vectors[idx].y;
  }
  x /= vectors.length;
  y /= vectors.length;
  return new Vector(x, y, g_speed);
}
