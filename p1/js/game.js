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
  this.score = 0;
  $("score").innerHTML = this.score;

  this.addToScore = function(num) {
    this.score += num;
	$("score").innerHTML = this.score;
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

game.start();
