/**
 * Pesky enemies
 */
function BasicSheep(x, y) {
  this.loc = new Point(x,y);
  this.size = 8;
  this.bubble = 12;
  this.vision = 18;
  this.zone = 22;
  this.speed = 3;
  this.color = "#FFFFFF";
  if (x && y) {
    this.init();
  }
  
  this.avoidEdges = function() { 
    if (this.loc.x - this.size/2 < 1 + this.bubble) {
      this.dir.x = 1;
    } else if (this.loc.x + this.size/2 > display.width - 1 - this.bubble) {
      this.dir.x = -1;
    }

    if (this.loc.y > display.height - wall.height - this.size/2 && wall.health > 0) {
      wall.hit(this.size);
      this.leave();
    } else if (this.loc.y - this.size/2 > display.height) {
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

function BlackSheep(x, y) {
  this.loc = new Point(x,y);
  this.bubble = 50;
  this.color = "#000000";
  if (x && y) {
    this.init();
  }
}
BlackSheep.prototype = new BasicSheep;

function SheepSpawner(x, y) {
  var n = Math.random();
  if (n < .25) {
    for (var i=0; i<2; i++) {
      g_boids.push(new BigSheep(x, y));    
    }
  } else if (n < .5) {
    for (var i=0; i<5; i++) {
      g_boids.push(new BlackSheep(x, y));    
    }
  } else {
    for (var i=0; i<20; i++) {
      g_boids.push(new BasicSheep(x, y));    
    }
  }
};
