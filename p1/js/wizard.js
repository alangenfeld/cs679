/**
 * The hero
 */
function Wizard() {
  this.loc = new Point(display.width/2, display.height - g_player_size);
  this.lastBigShot = 0;
  this.init();

  this.update = function() {
    if (mouse.leftPressed && (Date.now() - this.lastShot) > 1000/g_shots_per_sec) {
      var v = this.loc.vectorTo(new Point(mouse.x, mouse.y), g_shot_speed);
      this.shoot(v);
      this.lastShot = Date.now();
    }
    else if (mouse.rightPressed && (Date.now() - this.lastBigShot) > 1000/g_big_shots_per_sec) {
		console.log("BIG SHOT");
      var v = this.loc.vectorTo(new Point(mouse.x, mouse.y), g_big_shot_speed);
      this.shootBig(v);
      this.lastBigShot = Date.now();
    }
  };

  this.shoot = function(v) {
    g_shots.push(new Shot(this.loc.x + this.dir.x,
			  this.loc.y + this.dir.y, v, g_shot_size));
  };

  this.shootBig = function(v) {
    g_shots.push(new Shot(this.loc.x + this.dir.x,
			  this.loc.y + this.dir.y, v, g_shot_size*4));
  };

  this.draw = function() {
    ctx.fillStyle="#000000";
    ctx.fillRect(this.loc.x - g_player_size/2, this.loc.y - g_player_size/2, g_player_size, g_player_size);

    if ((Date.now() - this.lastBigShot) < 1000/g_big_shots_per_sec) {
		ctx.beginPath();
		ctx.arc(this.loc.x, this.loc.y,
			g_player_size/2 + 2, 0, Math.PI*2*(Date.now() - this.lastBigShot) / (1000/g_big_shots_per_sec), true);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "red"; // line color
		ctx.stroke();
	}
  };
}
Wizard.prototype = new Player;
