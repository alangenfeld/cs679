/*
 * why not have some utility classes
 */
function Point(x, y) {
  this.x = x;
  this.y = y;

  this.move = function(v) {
    this.x += v.x;
    this.y += v.y;
  }

  this.distance = function(p) {
    x = p.x - this.x;
    y = p.y - this.y;
    return Math.sqrt(x*x + y*y);
  }
}

function Vector(x, y, mag) {
  var length = Math.sqrt(x*x + y*y);
  this.x = (x/length) * mag;
  this.y = (y/length) * mag;
}

function averageVectors(vectors) {
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
