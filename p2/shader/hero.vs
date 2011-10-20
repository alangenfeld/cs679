attribute vec3 vtx;
attribute vec3 normal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;
uniform vec3 lightPos;

varying vec3 modelPos;
varying vec4 worldPos;
varying vec3 n;
varying vec4 l;

void main(void) {
  modelPos = vtx;
  worldPos = uMVMatrix * vec4(vtx, 1.0);
  gl_Position = uPMatrix * worldPos;
  n = uNMatrix * normal;
  l = uMVMatrix * vec4(lightPos, 1.0);
}

