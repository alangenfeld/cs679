/*******************************************************************************
 * Game setup and runtime logic
 *******************************************************************************/

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
var g_boids = new Array();

/**
 * Runtime
 */
g_boids.push(new Boid());

GameLoop();
