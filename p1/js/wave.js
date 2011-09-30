/**
 * Manages waves for the game
 */
function Wave() {
  this.spawn = false;
  this.lastSpawn = 0;
  this.num = 0;
  this.init();
  this.displayOpacity = 0;

  this.update = function() {

  };
  
  this.draw = function() {
    var now = Date.now();
    if ((now - this.lastSpawn) > 20000) {  
      this.spawn = true;  
      this.lastSpawn = now;
      this.num++;
      ctx.font = "24pt Courier";
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.strokeText("Wave " + this.num, 0, 220, 240);
      this.displayOpacity = 1.0;
      if(this.num > 1) {
        gameInfo.addToScore(1000*this.num);
      }
    } else {
      ctx.font = "24pt Courier";
      ctx.fillStyle = 'rgba(0,0,0,' + this.displayOpacity + ')';
      ctx.strokeText("Wave " + this.num, 0, 350, 240);
      this.displayOpacity *= .95;
      console.log(this.displayOpacity);
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
