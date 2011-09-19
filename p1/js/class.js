/**
 * Classes used in the game
 */

/**
 * Flocking creature
 */
function Boid(x, y) {
  x = !x ? Math.random() * display.width : x;
  y = !y ? Math.random() * display.height : y;
  this.loc = new Point(x, y);
  this.dir = new Vector(Math.random()*2 - 1, Math.random()*2 - 1, g_speed);
  this.init();

  this.update = function() {
    var influences = new Array(this.dir);
    for (idx in g_boids) {
      if (g_boids[idx] == this) {
	continue;
      } else if (this.loc.distance(g_boids[idx].loc) < g_bubble) {
	var v =	this.loc.vectorTo(g_boids[idx].loc, g_speed * g_boids.length);
	v.inverse();
	influences.push(v);
      } else if (this.loc.distance(g_boids[idx].loc) < g_zone) {
	influences.push(g_boids[idx].dir);
      } else if (this.loc.distance(g_boids[idx].loc) < g_vision) {
	var v =	this.loc.vectorTo(g_boids[idx].loc, g_speed);
	influences.push(v);
      }
    };

    this.dir = averageVectors(influences, g_speed);

    this.avoidPlayer();
    this.avoidShots();
    this.avoidEdges();
    this.loc.move(this.dir);
  };

  this.cleanup = function() {
    if (this.loc.x > display.width) {
      this.loc.x = this.loc.x % display.width;
    } else if (this.loc.x < 0) {
      this.loc.x = this.loc.x + display.width;
    } else if (this.loc.y > display.height) {
      this.loc.y = this.loc.y % display.height;
    } else if (this.loc.y < 0) {
      this.loc.y = this.loc.y + display.height;
    }
  };

  this.avoidEdges = function() {
    if (this.loc.x - g_boid_size/2 < 1 + g_bubble) {
	this.dir.x = 1;
    } else if (this.loc.x + g_boid_size/2 > display.width - 1 - g_bubble) {
	this.dir.x = -1;
    }

    if (this.loc.y - g_boid_size/2 < 1 + g_bubble) {
	this.dir.y = 1;
    } else if (this.loc.y + g_boid_size/2 > display.height - 1 - g_bubble) {
	this.dir.y = -1;
    }
  };

  this.avoidPlayer = function() {
    if (this.loc.distance(player.loc) < g_boid_size/2 + g_player_size/2 + g_bubble) {
      // TODO: look into why this wasn't working
      //this.dir = this.loc.vectorTo(player.loc, g_speed).inverse();

      var temp = this.loc.vectorTo(player.loc, g_speed);
      temp.inverse();
      this.dir = temp;
    }
  };

  this.avoidShots = function() {
    for (idx in g_shots) {
      var dist = this.loc.distance(g_shots[idx].loc);

      if (dist < g_boid_size/2 + g_shot_size/2 + g_bubble) {

	// remove boid if its hit
	if (dist < g_boid_size/2 + g_shot_size/2) {
	    g_boids.splice(g_boids.indexOf(this), 1);
	    this.shutdown();
	}

        var temp = this.loc.vectorTo(g_shots[idx].loc, g_speed);
	temp.inverse();
	this.dir = temp;
	continue;
      }
    }
  };

  this.draw = function() {
    ctx.fillRect(this.loc.x - g_boid_size/2, this.loc.y - g_boid_size/2, g_boid_size, g_boid_size);
  };
}
Boid.prototype = new GameObject;

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
function Shot(x, y) {
  this.loc = new Point(x, y);
  this.dir = new Vector(0, -1, g_shot_speed);
  this.init();
  
  this.draw = function() {
    //console.log("player.draw()");
    ctx.fillRect(this.loc.x - g_shot_size/2, this.loc.y - g_shot_size/2, g_shot_size, g_shot_size);
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

/**
 * Spawn projectiles when moused is pressed
 */
function BoidSpawner() {
  this.init();

  this.update = function(){
    if(mouse.pressed) {
      g_boids.push(new Boid(mouse.x, mouse.y));
    }
  };
}
BoidSpawner.prototype = new GameObject;
