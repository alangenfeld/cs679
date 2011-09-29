/**
 * The hero
 */
function Wizard() {
  this.loc = new Point(display.width/2 - 29/2, display.height - 56);
  this.lastBigShot = 0;
  this.init();
  this.stunTime = 0;

  this.update = function() {
    if (this.stunTime > 0) {
      this.stunTime--;
    } else {
      if (mouse.leftPressed && (Date.now() - this.lastShot) > 
	  1000/g_shots_per_sec) {
	var v = this.loc.vectorTo(new Point(mouse.x, mouse.y), g_shot_speed);
	this.shoot(v);
	this.lastShot = Date.now();
      }
      else if (mouse.rightPressed && (Date.now() - this.lastBigShot) >
	       1000/g_big_shots_per_sec) {
	var v = this.loc.vectorTo(new Point(mouse.x, mouse.y), g_big_shot_speed);
	this.shootBig(v);
	this.lastBigShot = Date.now();
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
    } else if((Date.now() - this.lastShot) < 200 ||
	      (Date.now() - this.lastBigShot) < 300) {
      ctx.drawImage(resourceManager.getImage("wizard_act"),
		    this.loc.x, this.loc.y);
    } else {
      ctx.drawImage(resourceManager.getImage("wizard"),
		    this.loc.x, this.loc.y);
    }

    if ((Date.now() - this.lastBigShot) < 1000/g_big_shots_per_sec) {
      ctx.beginPath();
      ctx.arc(this.loc.x + 15, this.loc.y + 10,
	      g_player_size, 0, Math.PI*2*(Date.now() - this.lastBigShot) / (1000/g_big_shots_per_sec), true);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "red"; // line color
      ctx.stroke();
    }
  };
}
Wizard.prototype = new Player;
