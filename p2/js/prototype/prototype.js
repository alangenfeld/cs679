/**
 * Setup
 */
var camera = new Camera();
var board = new GameBoard( 12, 12, 20 );
var hero = new Character(6, "#0000FF", 1, 1, 3 );
var enemy = new Enemy(6, "#EEEE00", 7, 7, 3 );
var pawns = new Array();
for ( var i=0; i<7; i++ ){
    while ( true ){
	var px = Math.floor( Math.random() * board.width );
	var py = Math.floor( Math.random() * board.height );
	if ( px < board.width && py < board.height && board.map[py][px] == 0 ){
	    pawns[i] = new Pawn( 3, "#FF0000", px, py );
	    break;
	}
    }
}

var streams = new MovementStream( 20, 20, 30, 16, 5 );
streams.generate( 80 );
enemy.setStreams( streams.streams );
var actions = new ActionQueue( 10, 550, 40, 30 );
var actionsAI = new ActionQueue( 10, 550, 100, 30 );

var logic = new GameLogic();

/**
 * Start
 */
game.start();
