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

// stats
var fps = document.getElementById("fps");
var rt = document.getElementById("rt");
var ut = document.getElementById("ut");

// heart of the beast
var lastRender = 0;
var GameLoop = function() {

  var t1 = Date.now();
  for (idx in g_ObjMan) {
    g_ObjMan[idx].update();
  }
  var t2 = Date.now();
  ctx.clearRect(0, 0, display.width, display.height);
  for (idx in g_ObjMan) {
    g_ObjMan[idx].draw();
  }
  var t3 = Date.now();

  var frames = 1000 / (t3 - lastRender);
  lastRender = t3;

  var updateTime = t2 - t1;
  var renderTime = t3 - t2;
  var sleep = (1000/30) - (t3 - t1);
  ut.innerHTML = updateTime;
  rt.innerHTML = renderTime;
  fps.innerHTML = frames;
  this.gloop = setTimeout(GameLoop, sleep);
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
