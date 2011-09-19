/*******************************************************************************
 * Game setup and runtime logic
 *******************************************************************************/

/**
 * Dynamic Variables 
 */
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

/**
 * Static Variables
 */
var g_boid_size = 5;
var g_player_size = 20;
var g_shot_size = 20;

var g_player_speed = 4;
var g_shot_speed = 8;
var g_shots_per_sec = 2;


/**
 * Setup
 */
var player = new Player(g_player_size/2, display.height - g_player_size/2);
var g_boids = new Array();
var g_shots = new Array();
var g_spawner = new BoidSpawner();

/**
 * Runtime
 */

g_boids.push(new Boid());

GameLoop();
