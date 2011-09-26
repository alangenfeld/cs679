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
    var now = Date.now();
    if ((now - this.lastSpawn) > 20000) {  
      this.spawn = true;  
      this.lastSpawn = now;
      this.num++;
      $("waveNum").innerHTML = this.num;
      $("msg").innerHTML = "Wave " + this.num;
      $("msg").style.opacity = 1.0;
    } else {
      var opacity = parseFloat($("msg").style.opacity);
      $("msg").style.opacity = opacity * .95;
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
      var numSheep = Math.random()*10 + wave.num + 2;
//      var numSheep = 2;
      for (var i=0; i < numSheep; i++) {
	var rx = (Math.random() * 8) - 4;
	var ry = (Math.random() * 8) - 4;
	g_boids.push(new Sheep(this.loc.x + rx, this.loc.y + ry));	
      }
    }
  };
}
Farm.prototype = new GameObject;
