/**
 * Flocking creature
 */
function Boid(x, y) {
  this.speed = g_speed;
  this.bubble = g_bubble;
  this.vision = g_vision;
  this.zone = g_zone;
  this.loc = new Point(x, y);
  this.dir = new Vector(Math.random()*2 - 1, Math.random()*2 - 1, this.speed);
  if (x && y) {
    this.init();
  }
  this.influences = new Array();

  this.update = function() {
    this.influences.push(this.dir);
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

    for (idx in other_boids) {
      if (other_boids[idx] == this) {
	continue;
      } else if (this.loc.distance(other_boids[idx].loc) < this.bubble) {
	var v =	this.loc.vectorTo(other_boids[idx].loc, this.speed * other_boids.length);
	v.inverse();
	this.influences.push(v);
      } else if (this.loc.distance(other_boids[idx].loc) < this.zone) {
	this.influences.push(other_boids[idx].dir);
      } else if (this.loc.distance(other_boids[idx].loc) < this.vision) {
	var v =	this.loc.vectorTo(other_boids[idx].loc, this.speed);
	this.influences.push(v);
      }
    };
    this.influences.push(this.wind());
    //influences.push(this.avoidShots());
    this.dir = averageVectors(this.influences, this.speed);
    this.influences.length = 0;

    this.avoidPlayer();
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

  this.wind = function() {
    return new Vector(0, 0);
  };

  this.avoidEdges = function() {
    if (this.loc.x - g_boid_size/2 < 1 + this.bubble) {
	this.dir.x = 1;
    } else if (this.loc.x + g_boid_size/2 > display.width - 1 - this.bubble) {
	this.dir.x = -1;
    }

    if (this.loc.y - g_boid_size/2 < 1 + this.bubble) {
	this.dir.y = 1;
    } else if (this.loc.y + g_boid_size/2 > display.height - 1 - this.bubble) {
	this.dir.y = -1;
    }
  };

  this.avoidPlayer = function() {
    if (this.loc.distance(player.loc) < g_boid_size/2 + g_player_size/2 + this.bubble) {
      var temp = this.loc.vectorTo(player.loc, this.speed);
      temp.inverse();
      this.dir = temp;
    }
  };

  /*
  this.avoidShots = function() {
    for (idx in g_shots) {
      var dist = this.loc.distance(g_shots[idx].loc);

      if (dist < g_boid_size/2 + g_shot_size/2 + this.bubble) {

        // remove boid if its hit
        if (dist < g_boid_size/2 + g_shot_size/2) {
	  this.leave();
        }

        var temp = this.loc.vectorTo(g_shots[idx].loc, this.speed*5);
        temp.inverse();
	return temp;
      }
    }
    return new Vector(0,0);
  };
  */

  this.leave = function() {
    g_boids.splice(g_boids.indexOf(this), 1);
    this.shutdown();
  };

  this.draw = function() {
    ctx.fillRect(this.loc.x - g_boid_size/2, this.loc.y - g_boid_size/2, g_boid_size, g_boid_size);
  };
}
Boid.prototype = new GameObject;

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
