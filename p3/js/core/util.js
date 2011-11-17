/**
 * why not have some utility classes
 */
function $() {
  return document.getElementById.apply(document, arguments);
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

// loadShaderFromFile
// adapted from: http://webreflection.blogspot.com/2010/09/fragment-and-vertex-shaders-my-way-to.html

// note: we have to wait until things load before using them,
// so there's this ajax request

// hacked by MG to take the whole shader path
// needs to figure out the shader type by dissecting the name

// remember, this takes (and returns) lists!
var shaderMap = new Array();

function shaderNameToType(str)
{
  
  if (str.slice(0, 2) == "fs") {
    return "fs" };
  if (str.slice(0, 2) == "vs") {
    return "vs" };
  if (str.search("frag") >= 0) {
    return "fs" };
  if (str.search("vert") >= 0) {
    return "vs" };
  if (str.search(".fs") >= 0) {
    return "fs" };
  if (str.search(".vs") >= 0) {
    return "vs" };
  throw "Can't guess shader type!";
  
}

function loadShaders(gl, shaders, callback) {
  
  // (C) WebReflection - Mit Style License
  function onreadystatechange() {
    
    var
    xhr = this,
    i = xhr.i
    ;
    if (xhr.readyState == 4) {
      
      shaders[i] = gl.createShader(
        shaderNameToType(shaders[i]) =="fs" ?
          gl.FRAGMENT_SHADER :
          gl.VERTEX_SHADER
      );
      gl.shaderSource(shaders[i], xhr.responseText);
      gl.compileShader(shaders[i]);
      if (!gl.getShaderParameter(shaders[i], gl.COMPILE_STATUS))
        throw gl.getShaderInfoLog(shaders[i])
      ;
      // console.log("Compiled:"+xhr.responseText)
      !--length && typeof callback == "function" && callback(shaders);
    }
  }
  for (var
       shaders = [].concat(shaders),
       asynchronous = !!callback,
       i = shaders.length,
       length = i,
       xhr;
       i--;
      ) {
        (xhr = new XMLHttpRequest).i = i;
        // this line used to build the path
        // xhr.open("get", loadShaders.base + shaders[i] + ".c", asynchronous);
        xhr.open("get", shaders[i], asynchronous);
        if (asynchronous) {
          xhr.onreadystatechange = onreadystatechange;
        }
        xhr.send(null);
        onreadystatechange.call(xhr);
      }
  return shaders;
}


function getShader(name) {
  var shaderProgram = shaderMap[name];
  if (!shaderProgram) {
    // load the shaders from files
    var fragmentShader = loadShaders(gl, "shader/"+name+".vs")[0];
    var vertexShader   = loadShaders(gl, "shader/"+name+".fs")[0];
    // build the shaderProgram object
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // make sure all is well
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw("shader failure " + gl.getProgramInfoLog(shaderProgram));
    }

    shaderProgram.mMatrix = gl.getUniformLocation(shaderProgram, "uMMatrix");   
    shaderProgram.vMatrix = gl.getUniformLocation(shaderProgram, "uVMatrix");
    shaderProgram.lMatrix = gl.getUniformLocation(shaderProgram, "uLMatrix");
    shaderProgram.pMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");

    shaderMap[name] = shaderProgram;
  }

  return shaderProgram;
}

function handleLoadedTexture(texture) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  gl.bindTexture(gl.TEXTURE_2D, null);
}

