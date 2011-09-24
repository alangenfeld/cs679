/**
 * The hero
 */
function Player(x, y) {
  this.loc = new Point(x, y);
  this.dir = new Vector(0, 0, g_player_speed);
  this.lastShot = 0;

  this.init();

  this.update = function() {
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
    //console.log("player.draw()");
    ctx.fillRect(this.loc.x - g_player_size/2, this.loc.y - g_player_size/2, g_player_size, g_player_size);
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

/**
 * Projectile to kill the boids
 */
function Shot(x, y, v) {
  this.loc = new Point(x, y);
  this.dir = v? v : new Vector(0, -1, g_shot_speed);
  this.init();
  
  this.draw = function() {
    ctx.fillStyle="#FF0000";
    ctx.beginPath();
    ctx.arc(this.loc.x, this.loc.y, 
	    g_shot_size/2, 0 ,Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle="#000000";
  };
  
  this.update = function() {
    if(this.loc.y < g_shot_size/2) {
      g_shots.splice(g_shots.indexOf(this), 1);
      this.shutdown();
    } else {
      this.loc.move(this.dir);
    }
  };
}
Shot.prototype = new GameObject;
