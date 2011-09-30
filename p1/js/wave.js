/**
 * Manages waves for the game
 */
function Wave() {
  this.spawn = false;
  this.lastSpawn = 0;
  this.num = 0;
  this.init();

  this.update = function() {

  };
  
  this.draw = function() {
    var now = Date.now();
    if ((now - this.lastSpawn) > 20000) {  
      this.spawn = true;  
      this.lastSpawn = now;
      this.num++;
      ctx.font = "bold 24pt Courier";
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText("Wave " + this.num, display.width/2, display.height/2, 480);
      if(this.num > 1) {
        gameInfo.addToScore(1000*this.num);
      }
    } else if((now - this.lastSpawn) < 5000) {
      ctx.font = "bold 24pt Courier";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      var temp = ctx.globalAlpha;
      ctx.globalAlpha = 1.0 - (now - this.lastSpawn)/5000;
      ctx.fillText("Wave " + this.num, display.width/2, display.height/2, 480);
      ctx.globalAlpha = temp;
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
