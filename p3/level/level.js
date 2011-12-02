/* © 2009 ROBO Design
 * http://www.robodesign.ro
 */


// Keep everything in anonymous function, called on window load.
if (window.addEventListener) {
    var lineArray = [];
    var polyArray = [];
    function undoLine() {

        imageView.getContext('2d').clearRect(0, 0, imageView.width, imageView.height);
        imageView.getContext('2d').beginPath();
        for (var i = 0; i < lineArray.length - 1; i++) {


            imageView.getContext('2d').moveTo(lineArray[i].xStart, lineArray[i].yStart);
            imageView.getContext('2d').lineTo(lineArray[i].xFinish, lineArray[i].yFinish);



        }
        lineArray.pop();
        for (var i = 0; i < polyArray.length; i++) {


            imageView.getContext('2d').moveTo(polyArray[i].xStart, polyArray[i].yStart);
            imageView.getContext('2d').lineTo(polyArray[i].xFinish, polyArray[i].yFinish);



        }
        imageView.getContext('2d').stroke();
        imageView.getContext('2d').closePath();
    }

    function undoPoly() {

        imageView.getContext('2d').clearRect(0, 0, imageView.width, imageView.height);
        imageView.getContext('2d').beginPath();
        for (var i = 0; i < polyArray.length - 1; i++) {


            imageView.getContext('2d').moveTo(polyArray[i].xStart, polyArray[i].yStart);
            imageView.getContext('2d').lineTo(polyArray[i].xFinish, polyArray[i].yFinish);



        }
        polyArray.pop();
        for (var i = 0; i < lineArray.length ; i++) {


            imageView.getContext('2d').moveTo(lineArray[i].xStart, lineArray[i].yStart);
            imageView.getContext('2d').lineTo(lineArray[i].xFinish, lineArray[i].yFinish);



        }
        imageView.getContext('2d').stroke();
        imageView.getContext('2d').closePath();
    }

    function generateCode() {

        var newtext = "<!DOCTYPE html> \n <html lang=\"en\"> \n  <head>\n <meta charset=\"utf-8\"> \n <title>Level</title> \n <style type=\"text\/css\"><!-- #container { position: relative;  #imageView { border: 1px solid #000; } #imageTemp { position: absolute; top: 1px; left: 1px; } --></style> \n </head> \n";
        newtext += "<script type=\"text\/javascript\"> \n function load() { \n var lineArray = []; \n var polyArray = []; \n";
        for (var i = 0; i < lineArray.length; i++) {

            var tempXstart = lineArray[i].xStart.toString();
            var tempYstart = lineArray[i].yStart.toString();
            var tempXfinish = lineArray[i].xFinish.toString();
            var tempYfinish = lineArray[i].yFinish.toString();
            
            newtext += "lineArray[lineArray.length] = { 'xStart': "+tempXstart+", 'yStart': "+tempYstart+", 'xFinish': "+tempXfinish+", 'yFinish': "+tempYfinish+" }; \n"



		}

        for (var i = 0; i < polyArray.length; i++) {

            var tempXstart = polyArray[i].xStart.toString();
            var tempYstart = polyArray[i].yStart.toString();
            var tempXfinish = polyArray[i].xFinish.toString();
            var tempYfinish = polyArray[i].yFinish.toString();

            newtext += "polyArray[polyArray.length] = { 'xStart': " + tempXstart + ", 'yStart': " + tempYstart + ", 'xFinish': " + tempXfinish + ", 'yFinish': " + tempYfinish + " }; \n"



		}

        newtext += " imageView.getContext('2d').clearRect(0, 0, imageView.width, imageView.height); \n imageView.getContext('2d').beginPath(); \n for (var i = 0; i < polyArray.length; i++) { \n imageView.getContext('2d').moveTo(polyArray[i].xStart, polyArray[i].yStart); \n imageView.getContext('2d').lineTo(polyArray[i].xFinish, polyArray[i].yFinish); \n } \n for (var i = 0; i < lineArray.length ; i++) { \n     imageView.getContext('2d').moveTo(lineArray[i].xStart, lineArray[i].yStart); \n imageView.getContext('2d').lineTo(lineArray[i].xFinish, lineArray[i].yFinish); \n } \n imageView.getContext('2d').stroke(); \n imageView.getContext('2d').closePath(); \n ";


        newtext += "\n } \n  </script> ";
        newtext += " \n <body onload = \"load()\"> \n <div id=\"container\"> \n <canvas id=\"imageView\" width=\"800\" height=\"400\"> \n </canvas> \n</div> \n </body> \n</html> \n ";
 
	
	document.myform.outputtext.value = newtext;





    }


    window.addEventListener('load', function () {
	    var canvas, context, canvaso, contexto;

	    // The active tool instance.
	    var tool;
	    var tool_default = 'line';

	    function init() {
		// Find the canvas element.
		canvaso = document.getElementById('imageView');
		if (!canvaso) {
		    alert('Error: I cannot find the canvas element!');
		    return;
		}

		if (!canvaso.getContext) {
		    alert('Error: no canvas.getContext!');
		    return;
		}

		// Get the 2D canvas context.
		contexto = canvaso.getContext('2d');
		if (!contexto) {
		    alert('Error: failed to getContext!');
		    return;
		}

		// Add the temporary canvas.
		var container = canvaso.parentNode;
		canvas = document.createElement('canvas');
		if (!canvas) {
		    alert('Error: I cannot create a new canvas element!');
		    return;
		}

		canvas.id = 'imageTemp';
		canvas.width = canvaso.width;
		canvas.height = canvaso.height;
		container.appendChild(canvas);

		context = canvas.getContext('2d');











		// Get the tool select input.
		var tool_select = document.getElementById('dtool');
		if (!tool_select) {
		    alert('Error: failed to get the dtool element!');
		    return;
		}
		tool_select.addEventListener('change', ev_tool_change, false);

		// Activate the default tool.
		if (tools[tool_default]) {
		    tool = new tools[tool_default]();
		    tool_select.value = tool_default;
		}

		// Attach the mousedown, mousemove and mouseup event listeners.
		canvas.addEventListener('mousedown', ev_canvas, false);
		canvas.addEventListener('mousemove', ev_canvas, false);
		canvas.addEventListener('mouseup', ev_canvas, false);
	    }

	    // The general-purpose event handler. This function just determines the mouse 
	    // position relative to the canvas element.
	    function ev_canvas(ev) {
		if (ev.layerX || ev.layerX == 0) { // Firefox
		    ev._x = ev.layerX;
		    ev._y = ev.layerY;
		} else if (ev.offsetX || ev.offsetX == 0) { // Opera
		    ev._x = ev.offsetX;
		    ev._y = ev.offsetY;
		}

		// Call the event handler of the tool.
		var func = tool[ev.type];
		if (func) {
		    func(ev);
		}
	    }

	    // The event handler for any changes made to the tool selector.
	    function ev_tool_change(ev) {
		if (tools[this.value]) {
		    tool = new tools[this.value]();
		}
	    }

	    // This function draws the #imageTemp canvas on top of #imageView, after which 
	    // #imageTemp is cleared. This function is called each time when the user 
	    // completes a drawing operation.
	    function img_update() {
		contexto.drawImage(canvas, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
	    }










	    // This object holds the implementation of each drawing tool.
	    var tools = {};

	    // The drawing polygon.
	    tools.poly = function () {
		var tool = this;
		this.started = false;

		// This is called when you start holding down the mouse button.
		// This starts the polygon drawing.
		this.mousedown = function (ev) {

		    tool.started = true;
		    tool.x0 = ev._x;
		    tool.y0 = ev._y;
		};


		this.mousemove = function (ev) {
		    if (!tool.started) {
			return;
		    }

		    context.clearRect(0, 0, canvas.width, canvas.height);

		    context.beginPath();
		    context.moveTo(tool.x0, tool.y0);
		    context.lineTo(ev._x, ev._y);

		    context.stroke();
		    context.closePath();




		};

		// This is called when you release the mouse button.
		this.mouseup = function (ev) {
		    if (tool.started) {
			tool.mousemove(ev);
			//tool.started = false;

			polyArray[polyArray.length] = { 'xStart': tool.x0, 'yStart': tool.y0, 'xFinish': ev._x, 'yFinish': ev._y };
			img_update();
			tool.x0 = ev._x;
			tool.y0 = ev._y;
                    
		    }
		};
	    };

	    // The line tool.
	    tools.line = function () {
		var tool = this;
		this.started = false;

		this.mousedown = function (ev) {
		    tool.started = true;
		    tool.x0 = ev._x;
		    tool.y0 = ev._y;
		};

		this.mousemove = function (ev) {
		    if (!tool.started) {
			return;
		    }

		    context.clearRect(0, 0, canvas.width, canvas.height);

		    context.beginPath();
		    context.moveTo(tool.x0, tool.y0);
		    context.lineTo(ev._x, ev._y);

		    context.stroke();
		    context.closePath();




		};

		this.mouseup = function (ev) {
		    if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;

			lineArray[lineArray.length] = { 'xStart': tool.x0, 'yStart': tool.y0, 'xFinish': ev._x, 'yFinish': ev._y };
			img_update();
		    }
		};
	    };


	    init();

	}, false);
}






  

