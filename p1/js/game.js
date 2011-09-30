/*******************************************************************************
 * Game setup and runtime logic
 *******************************************************************************/

/**
 * Setup
 */
var g_boids = new Array();
var g_shots = new Array();
var statsOn = false;
var rotateSheep = false;

function GameInfo() {
  this.init();

  this.gameOver = false;

  this.sheepPassed = 0;

  this.sheepSuccess = function() {
    this.sheepPassed++;
    this.lastSheepPassed = Date.now();
  };

  this.score = 0;
  $("score").innerHTML = this.score;

  this.addToScore = function(num) {
    this.score += num;
    $("score").innerHTML = this.score;
  };

  this.lastSheepPassed = 0;

  this.update = function() {
  };

  this.draw = function() {
    if ((Date.now() - this.lastSheepPassed) < 5000) {
      //$("msg2").innerHTML = this.sheepPassed + "/" + g_num_sheep_allowed;
      //$("msg2").style.opacity = 1 - (Date.now() - this.lastSheepPassed)/5000;
      var displayOpacity = 1.0 - (Date.now() - this.lastSheepPassed)/5000;
      ctx.font = "bold 24pt Courier";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      var temp = ctx.globalAlpha;
      ctx.globalAlpha = displayOpacity;
      ctx.fillText("" + this.sheepPassed + "/" + g_num_sheep_allowed, display.width/2, display.height/2 - 30, 480);
      ctx.globalAlpha = temp;
    }
    if(this.sheepPassed >= g_num_sheep_allowed) {
      //$("msg").innerHTML = "Game Over, Press Space to Continue";
      //$("msg").style.opacity = 1.0;
      ctx.font = "bold 24pt Courier";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText("Game Over!", display.width/2, display.height/2, 480);
      ctx.fillText("Press Space to Continue.", display.width/2, display.height/2 + 30, 480);
      game.over(
	function() {
	  gameInfo.sheepPassed = 0;
	  gameInfo.score = 0;
	  wave.num = 0;
	  //$("msg").innerHTML = "";
	  //$("msg2").innerHTML = "";
	  objectManager.clear();
	  g_boids = new Array();
	  gameSetup();
	});
    }
  }

}
GameInfo.prototype = new GameObject;

/**
 * Runtime
 */
resourceManager.addImage("sheep", "img/sheep.png");
resourceManager.addImage("sheep_s", "img/sheep_s.png");
resourceManager.addImage("sheep_b", "img/sheep_b.png");
resourceManager.addImage("wizard", "img/wizard.png");
resourceManager.addImage("wizard_act", "img/wizard_act.png");
resourceManager.addImage("fireball", "img/fireball.png");
resourceManager.addImage("rock", "img/rock.png");
resourceManager.addImage("grass", "img/grass.png");
resourceManager.addImage("fence", "img/fence.png");

var player, farms, gameInfo, wall, wave;
function gameSetup() {
  gameInfo = new GameInfo;
  wall = new Wall(display.width, 16);
  wave = new Wave();

  player = new Wizard();
  farms = new Array(new Farm(display.width/4, -30));
  farms.push(new Farm(3*display.width/4, -50));
  farms.push(new Farm(display.width/2, -80));
}  

gameSetup();

ctx.font = "bold 24pt Courier";
ctx.fillStyle = "black";
ctx.textAlign = "center";
ctx.fillText("Instructions", display.width/2, 220, 480);
ctx.font = "24pt Courier";
ctx.fillText("Sheep are coming!", display.width/2, 250, 480);
ctx.fillText("Defend the town.", display.width/2, 280, 480);
ctx.fillText("Left click: boulder.", display.width/2, 310, 480);
ctx.fillText("Right click: fireball.", display.width/2, 340, 480);
ctx.fillText("Press space to start.", display.width/2, 370, 480);

function start() {
  if (keyboard.space) {
    //$("msg").innerHTML = "";
    //$("msg2").innerHTML = "";
    game.start();
  } else {
    this.p = setTimeout(start,30);
  }
}
start();


