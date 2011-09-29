/**
 * The hero
 */
function Wizard() {
  this.loc = new Point(display.width/2 - 29/2, display.height - 56);
  this.lastBigShot = 0;
  this.init();
  this.stunTime = 0;

  this.update = function() {
    this.tick++;
    if (this.stunTime > 0) {
      this.stunTime--;
    } else {
      if (mouse.leftPressed && (this.tick - this.lastShot) > 
	  33/g_shots_per_sec) {
	var v = this.loc.vectorTo(new Point(mouse.x, mouse.y), g_shot_speed);
	this.shoot(v);
	this.lastShot = this.tick;
      }
      else if (mouse.rightPressed && (this.tick - this.lastBigShot) >
	       33/g_big_shots_per_sec) {
	var v = this.loc.vectorTo(new Point(mouse.x, mouse.y), g_big_shot_speed);
	this.shootBig(v);
	this.lastBigShot = this.tick;
      }
    }
  };

  this.shoot = function(v) {
    g_shots.push(new RockShot(this.loc.x + 15 + this.dir.x,
			  this.loc.y + this.dir.y, v));
  };

  this.shootBig = function(v) {
    g_shots.push(new FireShot(this.loc.x + this.dir.x,
			  this.loc.y + this.dir.y, v));
  };

  this.draw = function() {
    if (this.stunTime % 4 > 1) {
      // stun flash, draw nothing
    } else if((this.tick - this.lastShot) < 6 ||
	      (this.tick - this.lastBigShot) < 18) {
      ctx.drawImage(resourceManager.getImage("wizard_act"),
		    this.loc.x, this.loc.y);
    } else {
      ctx.drawImage(resourceManager.getImage("wizard"),
		    this.loc.x, this.loc.y);
    }

    if ((this.tick - this.lastBigShot) < 33/g_big_shots_per_sec) {
      ctx.beginPath();
      ctx.arc(this.loc.x + 15, this.loc.y + 10,
	      g_player_size, 0, 
	      Math.PI*2*(this.tick - this.lastBigShot) / (33/g_big_shots_per_sec),
	      true);

      ctx.lineWidth = 3;
      ctx.strokeStyle = "red"; // line color
      ctx.stroke();
    }
  };
}
Wizard.prototype = new Player;
