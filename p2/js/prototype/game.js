/**
 * Setup
 */
var camera = new Camera();
var board = new GameBoard( 12, 12, 20 );
var hero = new Character(12, "#0000FF", 3, 3, 3 );
var enemy = new Enemy(12, "#EEEE00", 7, 7, 3 );
var pawns = new Array();


var streams = new MovementStream( 20, 20, 30, 16, 1 );
var actions = new ActionQueue( 10, 550, 40, 30 );
var actionsAI = new ActionQueue( 10, 550, 100, 30 );

var logic = new GameLogic();

pawns.clear = function() {
  for (var i=0; i<this.length; i++) {
    this[i].shutdown();
  }
  this.splice(0, this.length);
};

pawns.remove = function(obj) {
  this.splice(this.indexOf(obj), 1);
};

function startLevel(lvlNum) {
  logic.timePerTurn = Math.max(45 - (lvlNum-1) * 3, 10);
  var numPawns = Math.min(((lvlNum-1) * 3) + 1, 30);

  logic.AIKP = 0;
  logic.playerKP = 0;
  logic.level = lvlNum;
  logic.turn = 1;
  hero.setPos(3, 3);
  enemy.setPos(7, 7);
  pawns.clear();
  for ( var i=0; i<numPawns; i++ ){
    while ( true ){
      var px = Math.floor( Math.random() * board.width );
      var py = Math.floor( Math.random() * board.height );
      if ( px < board.width && py < board.height && board.map[py][px] == 0 ){
	pawns[i] = new Pawn( 3, "#FF0000", px, py );
	break;
      }
    }
  }
  streams.generate( 80 );
  enemy.setStreams( streams.streams );
  logic.turnStart = logic.tick;
}

function showGameOver() {
  $("lossText").innerHTML = (hero.death) ? 
    "You were killed, allowing the enemy AI to score " + pawns.length + logic.AIKP + 
    "to your " + logic.playerKP :
    "You lost with " +  logic.playerKP + " to the enemies " + logic.AIKP + " kills, with " +
    pawns.length + " pawns remaining.";

  $("game").style.display = "none";
  $("gameOver").style.display = "block";
}

function showVictory() {
  $("levelNum").innerHTML = logic.level;
  $("winText").innerHTML = (enemy.death) ?
    "You killed the enemy, scoring you " + pawns.length + logic.playerKP + 
    "to your enemies " + logic.AIKP :
    (logic.playerKP == logic.AIKP) ? 
    "You won by tieing the enemy AI in kills." : 
    "You won by beating the enemy " +  logic.playerKP + " to " + logic.AIKP + 
    " in kills, with " + pawns.length + " pawns remaining.";
  $("game").style.display = "none";
  $("win").style.display = "block";
}

function returnToGame() {
  $("win").style.display = "none";
  $("gameOver").style.display = "none";
  $("game").style.display = "block";
}

/**
 * Start
 */
$("loading").innerHTML = "GAME LOADED";
$("instr").innerHTML += "Click to play!";
$("landing").onclick = function() {
  $("landing").style.display = "none";
  $("game").style.display = "block";
  startLevel(1);
  game.start();
};


