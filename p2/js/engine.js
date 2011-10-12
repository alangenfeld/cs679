/*******************************************************************************
 * Core game engine
 *******************************************************************************/

// drawing context
var display = $("display");
var display2 = $("display2");
var gl = display.getContext("experimental-webgl");
var ctx = display2.getContext("2d");

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
  
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms(shader) {
  gl.uniformMatrix4fv(shader.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shader.mvMatrixUniform, false, mvMatrix);
}

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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    ctx.clearRect(0, 0, display2.width, display2.height);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 
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
