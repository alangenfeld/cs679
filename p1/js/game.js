/*******************************************************************************
 * Game setup and runtime logic
 *******************************************************************************/

/**
 * Setup
 */
var g_boids = new Array();
var g_shots = new Array();
var statsOn = false;

/**
 * Runtime
 */
var player = new Wizard();
var farms = new Array(new Farm(0, 0));
farms.push(new Farm(display.width, 0));
farms.push(new Farm(display.width/2, 0));

GameLoop();
