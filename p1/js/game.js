/*******************************************************************************
 * Project 1: Flock
 *******************************************************************************/


/*******************************************************************************
 * the classes
 *******************************************************************************/
function Boid(x, y) {
  x = !x ? Math.random() * display.width : x;
  y = !y ? Math.random() * display.height : y;
  this.loc = new Point(x, y);
  this.dir = new Vector(Math.random()*2 - 1, Math.random()*2 - 1, g_speed);
  this.init();

  // comment
  this.update = function() {
    var influences = new Array(this.dir);
    for (idx in g_boids) {
      if (g_boids[idx] == this) {
	continue;
      } else if (this.loc.distance(g_boids[idx].loc) < g_bubble) {
	var v =	this.loc.vectorTo(g_boids[idx].loc, g_speed * g_boids.length);
	v.inverse();
	influences.push(v);
      } else if (this.loc.distance(g_boids[idx].loc) < g_zone) {
	influences.push(g_boids[idx].dir);
      } else if (this.loc.distance(g_boids[idx].loc) < g_vision) {
	var v =	this.loc.vectorTo(g_boids[idx].loc, g_speed);
	influences.push(v);
      }
    }
    this.dir = averageVectors(influences, g_speed);
    this.cleanup();
    this.loc.move(this.dir);
  };

  this.cleanup = function() {

    if (this.loc.x > display.width) {
      this.loc.x = this.loc.x % display.width;
    } else if (this.loc.x < 0) {
      this.loc.x = this.loc.x + display.width;
    } else if (this.loc.y > display.height) {
      this.loc.y = this.loc.y % display.height;
    } else if (this.loc.y < 0) {
      this.loc.y = this.loc.y + display.height;
    }

  };

  this.draw = function() {
    ctx.fillRect(this.loc.x, this.loc.y, 5, 5);
  };
}
Boid.prototype = new GameObject;

/*******************************************************************************
 * the game
 *******************************************************************************/
var g_speed = parseInt($("spd_in").value);
$("spd_in").onchange = function() {
  g_speed = parseInt(this.value);
  $("spd").innerHTML = this.value;
};

var g_vision = parseInt($("vision_in").value);
$("vision_in").onchange = function() {
  g_vision = parseInt(this.value);
  $("vision").innerHTML = this.value;
};

var g_zone = parseInt($("zone_in").value);
$("zone_in").onchange = function() {
  g_zone = parseInt(this.value);
  $("zone").innerHTML = this.value;
};

var g_bubble = parseInt($("bubble_in").value);
$("bubble_in").onchange = function() {
  g_bubble = parseInt(this.value);
  $("bubble").innerHTML = this.value;
};

var g_boids = new Array();
g_boids.push(new Boid());

display.onclick = function(e) {
  g_boids.push(new Boid(e.offsetX, e.offsetY));
};

// prevent double click from highlighting text 
display.onselectstart = function () {
  return false;
};

GameLoop();
