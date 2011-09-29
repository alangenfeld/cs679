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
    ctx.fillStyle="#000000";
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
function Shot(x, y, v, size) {
  this.loc = new Point(x, y);
  this.dir = v? v : new Vector(0, -1, g_shot_speed);
  this.size = size? size : g_shot_size;
  this.init();
  
  this.draw = function() {
    ctx.fillStyle="#FF0000";
    ctx.beginPath();
    ctx.arc(this.loc.x, this.loc.y, 
	    this.size/2, 0 ,Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  };
  
  this.update = function() {

    /*
    var other_boids;

    // look in the same bucket
    if(g_update_complexity == 1) {
      other_boids = getBucket(this.loc);
    }
    // look in same bucket + 8 neighboring buckets
    else if(g_update_complexity == 2) {
      other_boids = getBuckets(this.loc);
    }
    // look at all
    else {
      other_boids = g_boids;
    }

    // check if shot is close to boid
    for (idx in other_boids) {
      var boid = other_boids[idx];
	  var dist = this.loc.distance(boid.loc)

      if (dist < g_boid_size/2 + this.size/2 + boid.bubble) {

        // remove boid if its hit
        if (dist < g_boid_size/2 + this.size/2) {
          boid.leave();
        } else {
          var temp = boid.loc.vectorTo(this.loc, boid.speed*5);
          temp.inverse();
          boid.influences.push(temp);
		}
      }
	  //boid.influences.push(new Vector(0,0));
    }
	*/

    // move shot
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
