/**
 * Pesky enemies
 */
function Sheep(x, y) {
  this.loc = new Point(x,y);
  this.init();
}
Sheep.prototype = new Boid;

/**
 * Sheep generators
 */
function Farm(x,y) {
  this.loc = new Point(x,y);
  this.lastSpawn = 0;
  this.init();

  this.update = function() {
    if ((Date.now() - this.lastSpawn) > 10000) {
      console.log('derp');
      for (var i=0; i < 15; i++) {
	var rx = (Math.random() * 8) - 4;
	var ry = (Math.random() * 8) - 4;
	g_boids.push(new Sheep(this.loc.x + rx, this.loc.y + ry));	
      }
      this.lastSpawn = Date.now();
    }
  };
}
Farm.prototype = new GameObject;
