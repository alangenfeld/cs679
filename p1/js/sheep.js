/**
 * Pesky enemies
 */
function Sheep(x, y) {
  this.loc = new Point(x,y);
  this.size = 7;
  this.bubble = 10;
  this.vision = 20;
  this.zone = 25;
  if (x && y) {
    this.init();
  }
  
  this.avoidEdges = function() { 
    if (this.loc.x - g_boid_size/2 < 1 + this.bubble) {
      this.dir.x = 1;
    } else if (this.loc.x + g_boid_size/2 > display.width - 1 - this.bubble) {
      this.dir.x = -1;
    }
    
    if (this.loc.y + g_boid_size/2 > display.height) {
      gameInfo.sheepSuccess();
      this.leave();
    }
  };
  
  this.wind = function() {
    return new Vector(0, 1);
  };

  this.draw = function() {
    // body
    ctx.beginPath();
    ctx.arc(this.loc.x, this.loc.y, 
	    this.size/2, 0, Math.PI*2, true);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"; // line color
    ctx.closePath();
    ctx.stroke();
    // head
    ctx.beginPath();
    ctx.arc(this.loc.x + this.dir.x * this.size/4, 
	    this.loc.y + this.dir.y * this.size/4, 
	    this.size/3, 0, Math.PI*2, true);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"; // line color
    ctx.closePath();
    ctx.stroke();
  };
}
Sheep.prototype = new Boid;
  
