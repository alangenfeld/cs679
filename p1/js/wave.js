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

      if(this.num > 1) {
        gameInfo.addToScore(1000*this.num);
      }
    } else {
      var opacity = parseFloat($("msg").style.opacity);
      $("msg").style.opacity = opacity * .95;
      this.spawn = false; 
    }
  };
}
Wave.prototype = new GameObject;

/**
 * Sheep generators
 */
function Farm(x,y) {
  this.loc = new Point(x,y);
  this.init();

  this.update = function() {
    if (wave.spawn) {
      var numSheep = wave.num;
      for (var i=0; i < numSheep; i++) {
	SheepSpawner(this.loc.x, this.loc.y);	
      }
    }
  };
}
Farm.prototype = new GameObject;
