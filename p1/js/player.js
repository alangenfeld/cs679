/**
 * The hero
 */
function Player(x, y) {
  this.loc = new Point(x, y);
  this.dir = new Vector(0, 0, g_player_speed);
  this.lastShot = 0;
  this.tick = 0;

  this.init();

  this.update = function() {
    this.tick++;
    var kbd = 0;
    if (keyboard.left) {
      kbd -= 1;
    }
    if (keyboard.right) {
      kbd += 1;
    }

    if (keyboard.space && (Date.now() - this.lastShot) > 1000/g_shots_per_sec) {
      this.shoot();
      this.lastShot = Date.now();
    }

    this.dir.x = kbd * g_player_speed;

    this.cleanup();
    this.loc.move(this.dir);
  };

  this.draw = function() {
    ctx.fillStyle="#000000";
    ctx.fillRect(this.loc.x - g_player_size/2,
		 this.loc.y - g_player_size/2, 
		 g_player_size, 
		 g_player_size);
  };

  this.shoot = function() {
    g_shots.push(new Shot(this.loc.x + g_shot_size/2, this.loc.y - g_shot_size));
  };

  this.cleanup = function() {
    if(this.loc.x - g_player_size/2 < 0) {
      this.loc.x = g_player_size/2;
    } else if(this.loc.x + g_player_size/2 > display.width) {
      this.loc.x = display.width - g_player_size/2;
    }
  };
}
Player.prototype = new GameObject;


