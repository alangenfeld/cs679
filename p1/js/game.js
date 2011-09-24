/*******************************************************************************
 * Game setup and runtime logic
 *******************************************************************************/

/**
 * Setup
 */
var g_boids = new Array();
var g_shots = new Array();
var statsOn = false;

function GameInfo() {
  this.sheepPassed = 0;
  $("sheepPassed").innerHTML = this.sheepPassed;

  this.sheepSuccess = function() {
    this.sheepPassed++;
    $("sheepPassed").innerHTML = this.sheepPassed;
  };
}
var gameInfo = new GameInfo;

/**
 * Runtime
 */
var player = new Wizard();
var farms = new Array(new Farm(0, -30));
farms.push(new Farm(display.width, -30));
farms.push(new Farm(display.width/2, -30));

GameLoop();
