var statsOn = true;

/**
 * Setup
 */
var camera = new Camera();
var board = new GameBoard( 12, 12, 20 );
var hero = new Character( 12, "#0000FF", 1, 1, 3 );
var pawns = new Array(7);
for ( var i=0; i<7; i++ ){
    while ( true ){
	var px = Math.floor( Math.random() * board.width );
	var py = Math.floor( Math.random() * board.height );
	if ( px < board.width && py < board.height && board.map[py][px] == 0 ){
	    pawns[i] = new Pawn( 4, "#FF0000", px, py );
	    break;
	}
    }
}
var logic = new GameLogic();


/**
 * Start
 */
game.start();