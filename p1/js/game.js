/*******************************************************************************
 * Project 1: Flock
 *******************************************************************************/


/*******************************************************************************
 * the classes
 *******************************************************************************/
function Boid(x, y) {
  x = !x ? Math.random() * display.width : x;
  y = !y ? Math.random() * display.height : y;
  this.loc = new Point(x, y);
  this.dir = new Vector(Math.random()*2 - 1, Math.random()*2 - 1, g_speed);
  this.init();

  // comment
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
    //this.cleanup();
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

    if (this.loc.x < g_boid_size/2) {
	this.dir.x = 1;
    } else if (this.loc.x > g_canvas_width - g_boid_size/2) {
	this.dir.x = -1;
    }

    if (this.loc.y < g_boid_size/2) {
	this.dir.y = 1;
    } else if (this.loc.y > g_canvas_height - g_boid_size/2) {
	this.dir.y = -1;
    }

  };

  this.avoidPlayer = function() {
    if (this.loc.distance(player.loc) < 20) {
      // TODO: look into why this wasn't working
      //this.dir = this.loc.vectorTo(player.loc, g_speed).inverse();

      var temp = this.loc.vectorTo(player.loc, g_speed);
      temp.inverse();
      this.dir = temp;
    }
  };

  this.avoidShots = function() {
    for (idx in g_shots) {
      if (this.loc.distance(g_shots[idx].loc) < 20) {
	// TODO: look into why this wasn't working
        //this.dir = this.loc.vectorTo(g_shots[idx].loc, g_speed).inverse();

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

function Player(x, y) {

  // player location/direction
  this.loc = new Point(x, y);
  this.dir = new Vector(0, 0, g_player_speed);

  this.init();

  this.update = function() {
    this.dir.x = g_dir*g_player_speed;

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
    } else if(this.loc.x + g_player_size/2 > g_canvas_width) {
      this.loc.x = g_canvas_width - g_player_size/2;
    }
  };
    

}

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
	    this.shutdown()
	} else {
	    this.loc.move(this.dir);
	}
    };
}

Boid.prototype = new GameObject;
Player.prototype = new GameObject;
Shot.prototype = new GameObject;

/*******************************************************************************
 * the game
 *******************************************************************************/
var g_speed = parseInt($("spd_in").value);
$("spd_in").onchange = function() {
  g_speed = parseInt(this.value);
  $("spd").innerHTML = this.value;
};

var g_vision = parseInt($("vision_in").value);
$("vision_in").onchange = function() {
  g_vision = parseInt(this.value);
  $("vision").innerHTML = this.value;
};

var g_zone = parseInt($("zone_in").value);
$("zone_in").onchange = function() {
  g_zone = parseInt(this.value);
  $("zone").innerHTML = this.value;
};

var g_bubble = parseInt($("bubble_in").value);
$("bubble_in").onchange = function() {
  g_bubble = parseInt(this.value);
  $("bubble").innerHTML = this.value;
};

var g_boid_size = 5;
var g_player_size = 20;
var g_shot_size = 10;

var g_player_speed = 4;
var g_shot_speed = 4;

var g_canvas_width = document.getElementById("display").width;
var g_canvas_height = document.getElementById("display").height;

var g_dir = 0;

var player = new Player(g_player_size/2, g_canvas_height - g_player_size/2);
var g_boids = new Array();
g_boids.push(new Boid());

var g_shots = new Array();

display.onclick = function(e) {
  g_boids.push(new Boid(e.offsetX, e.offsetY));
};

// prevent double click from highlighting text 
display.onselectstart = function () {
  return false;
};

window.addEventListener("keydown",handleKeyDown,true);
window.addEventListener("keyup",handleKeyUp,true);

function handleKeyDown(e) {

  if (e.keyCode == 37) {
    g_dir = -1;
  } else if (e.keyCode == 39) {
    g_dir = 1;
  } else if(e.keyCode == 32) {
    player.shoot();
  }
};

function handleKeyUp(e) {
  if (e.keyCode == 37 && g_dir == -1) {
    g_dir = 0;
  } else if (e.keyCode == 39 && g_dir == 1) {
    g_dir = 0;
  }
};

GameLoop();
