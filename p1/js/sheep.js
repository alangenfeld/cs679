/**
 * Pesky enemies
 */
function BasicSheep(x, y) {
  this.loc = DisplacedPoint(x,y);
  this.size = 20;
  this.bubble = 22;
  this.vision = 24;
  this.zone = 28;
  this.speed = 3;
  this.color = "#FFFFFF";
  this.sprite = "sheep_s";
  if (x && y) {
    this.init();
  }
  
  this.avoidEdges = function() { 
    if (this.loc.x - this.size/2 < 1 + this.bubble) {
      this.dir.x = 4*Math.random();
    } else if (this.loc.x + this.size/2 > display.width - 1 - this.bubble) {
      this.dir.x = -4*Math.random();
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
    if(rotateSheep) {
	  var angle = this.dir.angle() - 90;
      ctx.save();
      ctx.translate(this.loc.x, this.loc.y);
      ctx.rotate(angle/180*Math.PI);
      ctx.drawImage(resourceManager.getImage(this.sprite),
		  -this.size/2, -this.size/2);
      ctx.restore();
	} else {
      ctx.drawImage(resourceManager.getImage(this.sprite),
		  this.loc.x - this.size/2, this.loc.y - this.size/2);
    };
  };
}
BasicSheep.prototype = new Boid;

function BigSheep(x, y) {
  this.loc = DisplacedPoint(x,y);
  this.size = 40;
  this.bubble = 50;
  this.speed = 2;
  this.color = "#F0F0F0";
  this.sprite = "sheep";
  if (x && y) {
    this.init();
  }
}
BigSheep.prototype = new BasicSheep;

function BlackSheep(x, y) {
  this.loc = DisplacedPoint(x,y);
  this.bubble = 50;
  this.color = "#000000";
  this.sprite = "sheep_b";
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
