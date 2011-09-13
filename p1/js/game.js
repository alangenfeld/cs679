/*******************************************************************************
 * Project 1: Flock
 *******************************************************************************/


/*******************************************************************************
 * the classes
 *******************************************************************************/
function Boid() {
  this.loc = new Point(
    Math.random() * display.width,
    Math.random() * display.height);
  this.dir = new Vector(Math.random(), Math.random(), g_speed);
  this.init();

  this.update = function() {
    var influences = new Array(this.dir);
    for (idx in g_boids) {
      if (this.loc.distance(g_boids[idx].loc) < g_vision) {
	influences.push(g_boids[idx].dir);
      }
    }
    this.dir = averageVectors(influences);
    
    this.loc.move(this.dir);
    this.cleanup();
  }

  this.cleanup = function() {
    if (this.loc.x > display.width) {
      this.dir.x = -g_speed;
    }
    if (this.loc.x < 0) {
      this.dir.x = g_speed;
    }
    if (this.loc.y > display.height) {
      this.dir.y = -g_speed;
    }
    if (this.loc.y < 0) {
      this.dir.y = g_speed;
    }
  }

  this.draw = function() {
    ctx.fillRect(this.loc.x, this.loc.y, 10, 10);
  }
}
Boid.prototype = new GameObject;

/*******************************************************************************
 * the game
 *******************************************************************************/
var g_speed = 4;
var g_vision = 20;

var g_boids = new Array();
g_boids.push(new Boid());

document.onclick = function() {
  g_boids.push(new Boid());
}

GameLoop();
