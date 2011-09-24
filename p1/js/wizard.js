/**
 * The hero
 */
function Wizard() {
  this.loc = new Point(display.width/2, display.height - g_player_size);

  this.init();

  this.update = function() {
    if (mouse.pressed && (Date.now() - this.lastShot) > 1000/g_shots_per_sec) {
      var v = this.loc.vectorTo(new Point(mouse.x, mouse.y), g_shot_speed);
      this.shoot(v);
      this.lastShot = Date.now();
    }
  };

  this.shoot = function(v) {
    g_shots.push(new Shot(this.loc.x + this.dir.x,
			  this.loc.y + this.dir.y, v));
  };
}
Wizard.prototype = new Player;
