/**
 * Manages waves for the game
 */
function Wave() {
  this.spawn = false;
  this.lastSpawn = 0;
  this.num = 0;
  this.init();
  $("waveNum").innerHTML = this.num;

  this.update = function() {
    if ((Date.now() - this.lastSpawn) > 10000) {  
      this.spawn = true;  
      this.lastSpawn = Date.now();
      this.num++;
      $("waveNum").innerHTML = this.num;
    }
    else {
     this.spawn = false; 
    }
  };
}
Wave.prototype = new GameObject;
var wave = new Wave();

/**
 * Sheep generators
 */
function Farm(x,y) {
  this.loc = new Point(x,y);
  this.init();

  this.update = function() {
    if (wave.spawn) {
      for (var i=0; i < 15; i++) {
	var rx = (Math.random() * 8) - 4;
	var ry = (Math.random() * 8) - 4;
	g_boids.push(new Sheep(this.loc.x + rx, this.loc.y + ry));	
      }
    }
  };
}
Farm.prototype = new GameObject;
