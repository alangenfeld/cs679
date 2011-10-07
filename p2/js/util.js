/**
 * why not have some utility classes
 */
function $() {
  return document.getElementById.apply(document, arguments);
}
function DisplacedPoint(x, y) {
  var rx = Math.random()*60 - 30;
  var ry = Math.random()*60 - 30;
  return new Point(x+rx,y+ry);
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

  this.angle = function() {
    var rad = Math.atan2(this.y, this.x);

	if(rad > 0) {
      return 180*(rad / Math.PI);
    } else {
      return 180*(rad / Math.PI) + 360;
	}
  };
  
  this.inverse = function() {
    this.x = -this.x;
    this.y = -this.y;
  };
}

function averageVectors(initialDir, vectors, mag) {
  var x = 0;
  var y = 0;

  for (idx in vectors) {
    x += vectors[idx].x;
    y += vectors[idx].y;
  }
  x /= vectors.length;
  y /= vectors.length;
  return new Vector((initialDir.x + x)/2, (initialDir.y + y)/2, mag);
}

