/*******************************************************************************
 * Core game engine
 *******************************************************************************/

// drawing context
var display = $("display");
var gl = display.getContext("experimental-webgl");

var targetFPS = 60;

// stats
var lastRender, loopStart, updateFinish, renderFinish;
var updateStats = function() {
  if(statsOn){
    $("ut").innerHTML = (updateFinish - loopStart) + " ms";
    $("rt").innerHTML = (renderFinish - updateFinish) + " ms";
    $("fps").innerHTML = (Math.floor(1000 / (renderFinish - lastRender))) + " fps";
    $("num_objs").innerHTML = (objectManager.objects.length);
  }
  lastRender = renderFinish;
  return (1000/targetFPS) - (renderFinish - loopStart);
};

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
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // look in to window.requestAnimFrame
    objectManager.drawAll();
    renderFinish = Date.now();
    
    var sleep = updateStats();
    if (game.paused) {
      this.gloop = setTimeout(game.wait, sleep);
    } else {
      this.gloop = setTimeout(game.start, sleep);
    }
  };
};
var game = new Game;
