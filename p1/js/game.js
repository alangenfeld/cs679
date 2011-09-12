
var start = function() {

  var display = document.getElementById("display");

  var ctx = display.getContext("2d");

  var x,y,w,h;

  w = h = 10;
  x = y = 0;

  var loop = function() {
    ctx.clearRect(0, 0, display.width, display.height);
    x+=1;
    y+=1;
    ctx.fillRect(x, y, w, h);
    var gloop = setTimeout(loop, 100);
  };
  loop();
};
