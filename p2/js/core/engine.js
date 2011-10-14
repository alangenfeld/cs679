/*******************************************************************************
 * Core game engine
 *******************************************************************************/

/**
 * The heart of the beast
 */
var Game = function() {
  this.paused = false;
  this.gloop = null;
  this.reset = null;

  this.pause = function () {
    if (this.paused) {
      this.paused = false;      
      this.start();
    } else {
      this.paused = true;
      this.gloop = null;
    }
  };

  this.wait = function() {
    if(keyboard.space) {
      if (game.reset) {
	game.reset();
	game.reset = null;
      }
      game.paused = false;
      game.start();
    } else {
      // fix for delay of game over message in some browsers
      this.gloop = setTimeout(game.wait, 30); 
    }
  };

  // takes a reset function as a callback
  this.over = function(rst) {
    this.paused = true;
    this.reset = rst;
  };

  this.start = function() {
    loopStart = Date.now();
    
    // update each game object
    objectManager.updateAll();
    updateFinish = Date.now();
    
    // clear screen and redraw objects
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    ctx.clearRect(0, 0, display2.width, display2.height);

    gl.viewport(0, 0, display.width, display.height);
    mat4.perspective(45, display.width / display.height, 
		     0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);

    // look in to window.requestAnimFrame
    objectManager.drawAll();
    renderFinish = Date.now();
    
    updateStats();
    if (game.paused) {
      requestAnimFrame(game.wait, display);
    } else {
      requestAnimFrame(game.start, display);
    }
  };
};
var game = new Game;
