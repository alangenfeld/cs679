/**
 * Projectile to kill the boids
 */
function Shot(x, y, v, size, bubble) {
  this.loc = new Point(x, y);
  this.dir = v? v : new Vector(0, -1, g_shot_speed);
  this.size =  g_shot_size;
  this.bubble =  this.size/2;
  this.tick = 0;
  if (x && y) {
    this.init();
  }
  
  this.draw = function() {
      ctx.fillStyle="#FF0000";
      ctx.beginPath();
      ctx.arc(this.loc.x, this.loc.y, 
	      this.size/2, 0 ,Math.PI*2, true);
      ctx.closePath();
      ctx.fill();
  };
  
  this.update = function() {
    // move shot
    this.tick++;
    if(this.loc.y < -this.size/2) {
      g_shots.splice(g_shots.indexOf(this), 1);
      this.shutdown();
    } else if(this.loc.y > display.height + this.size/2) {
      g_shots.splice(g_shots.indexOf(this), 1);
      this.shutdown();
    } else if(this.loc.x < -this.size/2) {
      g_shots.splice(g_shots.indexOf(this), 1);
      this.shutdown();
    } else if(this.loc.x > display.width + this.size/2) {
      g_shots.splice(g_shots.indexOf(this), 1);
      this.shutdown();
    } else {
      this.loc.move(this.dir);
    }
  };
}
Shot.prototype = new GameObject;

/**
 * Rock to scare them
 */
function RockShot(x, y, v) {
  this.loc = new Point(x, y);
  this.dir = v;
  this.size =  g_shot_size;
  this.bubble =  g_shot_size * 3;
  this.init();
  this.draw = function() {

  };
}
RockShot.prototype = new Shot;

/**
 * Rock to scare them
 */
function FireShot(x, y, v) {
  this.loc = new Point(x, y);
  this.dir = v;
  this.size = 128;
  this.bubble =  this.size/2;
  this.init();

  this.draw = function() {

    ctx.drawImage(resourceManager.getImage("fireball"),
		  (Math.floor(this.tick/2)%3)*128, 0,
		  128, 113,
		  this.loc.x - this.size/2, this.loc.y - this.size/2,
		  128, 113);

  };
}
FireShot.prototype = new Shot;
