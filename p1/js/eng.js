/*
 * This is a clowny js game engine 
 */

// globals

// holds all game objects
var g_ObjMan = new Array();

// sprite asset manager
var g_ResMan = new Array();

// drawing context
var display = document.getElementById("display");
var ctx = display.getContext("2d");

// heart of the beast
var GameLoop = function() {

  ctx.clearRect(0, 0, display.width, display.height);

  for (idx in g_ObjMan) {
    g_ObjMan[idx].update();
  }

  for (idx in g_ObjMan) {
    g_ObjMan[idx].draw();
  }

  this.gloop = setTimeout(GameLoop, 1000/60);
};

// base game object
function GameObject() {
  this.x = 0;
  this.y = 0;

  this.init = function() {
    g_ObjMan.push(this);
  }

  this.update = function() {
    return;
  }

  this.draw = function() {
    return;
  }

  this.shutdown = function() {
    g_ObjMan.splice(g_ObjMan.indexOf(this), 1);
  }
}
