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
  this.init();

  this.gameOver = false;

  this.sheepPassed = 0;
  $("sheepPassed").innerHTML = this.sheepPassed;

  this.sheepSuccess = function() {
    this.sheepPassed++;
	this.lastSheepPassed = Date.now();
    $("sheepPassed").innerHTML = this.sheepPassed;
  };

  this.score = 0;
  $("score").innerHTML = this.score;

  this.addToScore = function(num) {
    this.score += num;
	$("score").innerHTML = this.score;
  };

  this.lastSheepPassed = 0;

  this.update = function() {
    if ((Date.now() - this.lastSheepPassed) < 5000) {
      $("msg2").innerHTML = this.sheepPassed + "/" + g_num_sheep_allowed;
      $("msg2").style.opacity = 1 - (Date.now() - this.lastSheepPassed)/5000;
    }
	if(this.sheepPassed == g_num_sheep_allowed) {
      this.gameOver = true;
      $("msg").innerHTML = "Game Over, Press Space to Continue";
      $("msg").style.opacity = 1.0;
	}
  };

}
GameInfo.prototype = new GameObject;
var gameInfo = new GameInfo;

/**
 * Runtime
 */
var player = new Wizard();
var farms = new Array(new Farm(0, -30));
farms.push(new Farm(display.width, -30));
farms.push(new Farm(display.width/2, -30));

GameLoop();
