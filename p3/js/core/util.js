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


function isBitSet( value, position ) {
  return value & ( 1 << position );
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
    shaderProgram.nMatrix = gl.getUniformLocation(shaderProgram, "uNMatrix");   
    shaderProgram.vMatrix = gl.getUniformLocation(shaderProgram, "uVMatrix");
    shaderProgram.pMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.lpMatrix = gl.getUniformLocation(shaderProgram, "uLPMatrix");

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

var modelMap = new Array();

function getModel(modelName) {
  var model = modelMap[modelName];
  if (model)
    return model;
  
  var path = "models/" + modelName + ".js";
  model = fetchModel(path);
  modelMap[modelName] = model;
  return model;
}

function fetchModel(modelName) {
  function onreadystatechange() {
    var
    xhr = this,
    i = xhr.i
    ;
    if (xhr.readyState == 4) {
      model = parseTHREE(JSON.parse(xhr.responseText));
    }
  }
  xhr = new XMLHttpRequest;
  xhr.open("get", modelName, false);
  xhr.send(null);
  onreadystatechange.call(xhr);

  return model;
}

function loadModel(obj, modelName) {
  var model = getModel(modelName);

  var vtxIndex = new Array();
  var normals = new Array();

  for(var i in model.faces) {
    var face = model.faces[i];

    vtxIndex.push(face.a);
    vtxIndex.push(face.b);
    vtxIndex.push(face.c);

    normals[3*face.a] = face.vertexNormals[0].x;
    normals[3*face.a+1] = face.vertexNormals[0].y;
    normals[3*face.a+2] = face.vertexNormals[0].z;
    normals[3*face.b] = face.vertexNormals[1].x;
    normals[3*face.b+1] = face.vertexNormals[1].y;
    normals[3*face.b+2] = face.vertexNormals[1].z;
    normals[3*face.c] = face.vertexNormals[2].x;
    normals[3*face.c+1] = face.vertexNormals[2].y;
    normals[3*face.c+2] = face.vertexNormals[2].z;

    // if quad
    if (face.d) { 
      vtxIndex.push(face.a);
      vtxIndex.push(face.c);
      vtxIndex.push(face.d);

      normals[3*face.d] = face.vertexNormals[3].x;
      normals[3*face.d+1] = face.vertexNormals[3].y;
      normals[3*face.d+2] = face.vertexNormals[3].z;
    }
  }

  obj.vertices = model.vertices;
  obj.normals = normals;
  obj.vtxIndex = vtxIndex;

  obj.light = true;
  obj.attributeCount = model.faces.length;
}

// this is a total hack. 
function parseTHREE( json ) {

  var scope = {
    faceUvs: new Array(), 
    faceVertexUvs: new Array(),
    vertices: new Array(), 
    materials: new Array(), 
    faces: new Array()
  };
  
  var i, j, 

  offset, zLength,

  type,
  isQuad, 
  hasMaterial, 
  hasFaceUv, hasFaceVertexUv,
  hasFaceNormal, hasFaceVertexNormal,
  hasFaceColor, hasFaceVertexColor,

  vertex, face,

  faces = json.faces,
  vertices = json.vertices,
  normals = json.normals,
  colors = json.colors,

  nUvLayers = 0;

  // disregard empty arrays
  for ( i = 0; i < json.uvs.length; i++ ) {
    if ( json.uvs[ i ].length ) nUvLayers ++;
  }

  for ( i = 0; i < nUvLayers; i++ ) {
    scope.faceUvs[ i ] = [];
    scope.faceVertexUvs[ i ] = [];
  }

  offset = 0;
  zLength = vertices.length;

  while ( offset < zLength ) {
//    vertex = {};
//    vertex.x = vertices[ offset ++ ];
//    vertex.y = vertices[ offset ++ ];
//    vertex.z = vertices[ offset ++ ];
    //scope.vertices.push( vertex );

    scope.vertices.push(vertices[ offset ++ ] * json.scale);
    scope.vertices.push(vertices[ offset ++ ] * json.scale);
    scope.vertices.push(vertices[ offset ++ ] * json.scale);
  }

  offset = 0;
  zLength = faces.length;

  while ( offset < zLength ) {
    type = faces[ offset ++ ];

    isQuad              = isBitSet( type, 0 );
    hasMaterial         = isBitSet( type, 1 );
    hasFaceUv           = isBitSet( type, 2 );
    hasFaceVertexUv     = isBitSet( type, 3 );
    hasFaceNormal       = isBitSet( type, 4 );
    hasFaceVertexNormal = isBitSet( type, 5 );
    hasFaceColor        = isBitSet( type, 6 );
    hasFaceVertexColor  = isBitSet( type, 7 );

    face = {};

    if ( isQuad ) {
      
      face.a = faces[ offset ++ ];
      face.b = faces[ offset ++ ];
      face.c = faces[ offset ++ ];
      face.d = faces[ offset ++ ];

      nVertices = 4;
    } else {
      //            face = new THREE.Face3();
      face.a = faces[ offset ++ ];
      face.b = faces[ offset ++ ];
      face.c = faces[ offset ++ ];

      nVertices = 3;
    }

    if ( hasMaterial ) {
      materialIndex = faces[ offset ++ ];
      face.materials = scope.materials[ materialIndex ];
    }

    if ( hasFaceUv ) {
      for ( i = 0; i < nUvLayers; i++ ) {
        uvLayer = json.uvs[ i ];

        uvIndex = faces[ offset ++ ];

        u = uvLayer[ uvIndex * 2 ];
        v = uvLayer[ uvIndex * 2 + 1 ];

	//                scope.faceUvs[ i ].push( new THREE.UV( u, v ) );
      }

    }

    if ( hasFaceVertexUv ) {
      for ( i = 0; i < nUvLayers; i++ ) {
        uvLayer = json.uvs[ i ];

        uvs = [];

        for ( j = 0; j < nVertices; j ++ ) {
	  
          uvIndex = faces[ offset ++ ];
          u = uvLayer[ uvIndex * 2 ];
          v = uvLayer[ uvIndex * 2 + 1 ];

	  //                    uvs[ j ] = new THREE.UV( u, v );
        }
        scope.faceVertexUvs[ i ].push( uvs );
      }
    }

    if ( hasFaceNormal ) {
      normalIndex = faces[ offset ++ ] * 3;

      normal = {};
      //            normal = new THREE.Vector3();

      normal.x = normals[ normalIndex ++ ];
      normal.y = normals[ normalIndex ++ ];
      normal.z = normals[ normalIndex ];

      face.normal = normal;
    }

    if ( hasFaceVertexNormal ) {
      for ( i = 0; i < nVertices; i++ ) {
        normalIndex = faces[ offset ++ ] * 3;
	normal = {};
	//                normal = new THREE.Vector3();

        normal.x = normals[ normalIndex ++ ];
        normal.y = normals[ normalIndex ++ ];
        normal.z = normals[ normalIndex ];

	if (!face.vertexNormals) {
	  face.vertexNormals = new Array();
          face.vertexNormals.push( normal );
	}
	else
          face.vertexNormals.push( normal );
      }
    }

    if ( hasFaceColor ) {
      //            color = new THREE.Color( faces[ offset ++ ] );
      face.color = color;
    }

    if ( hasFaceVertexColor ) {
      for ( i = 0; i < nVertices; i++ ) {
        colorIndex = faces[ offset ++ ];

	//                color = new THREE.Color( colors[ colorIndex ] );
        face.vertexColors.push( color );
      }
    }

    scope.faces.push( face );

  }
  return scope;
};
