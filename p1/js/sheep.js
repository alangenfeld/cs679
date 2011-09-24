/**
 * Pesky enemies
 */
function BasicSheep(x, y) {
  this.loc = new Point(x,y);
  this.size = 12;
  this.bubble = 14;
  this.vision = 20;
  this.zone = 25;
  this.speed = 3;
  this.color = "#FFFFFF";
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
    ctx.fillStyle = this.color;

    // body
    ctx.beginPath();
    ctx.arc(this.loc.x, this.loc.y, 
	    this.size/2, 0, Math.PI*2, true);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"; // line color
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // head
    ctx.beginPath();
    ctx.arc(this.loc.x + this.dir.x * this.size/4, 
	    this.loc.y + this.dir.y * this.size/4, 
	    this.size/3, 0, Math.PI*2, true);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"; // line color
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };
}
BasicSheep.prototype = new Boid;

function BigSheep(x, y) {
  this.loc = new Point(x,y);
  this.size = 24;
  this.bubble = 30;
  this.speed = 2;
  this.color = "#F0F0F0";
  if (x && y) {
    this.init();
  }
}
BigSheep.prototype = new BasicSheep;

function YellowSheep(x, y) {
  this.loc = new Point(x,y);
  this.bubble = 30;
  this.color = "#F0F0C0";
  if (x && y) {
    this.init();
  }
}
YellowSheep.prototype = new BasicSheep;

function CrazySheep(x, y) {
  this.loc = new Point(x,y);
  this.vision = 30;
  this.color = "#FFC0FF";
  if (x && y) {
    this.init();
  }
}
CrazySheep.prototype = new BasicSheep;

function Sheep(x, y) {
  var n = Math.random();
  if (n < .1) {
    return new YellowSheep(x, y);    
  } else if (n < .4) {
    return new CrazySheep(x, y);    
  } else if (n < .8) {
    return new BigSheep(x, y);    
  } else {
    return new BasicSheep(x, y);    
  }
};
