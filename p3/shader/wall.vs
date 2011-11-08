attribute vec3 vtx;
attribute vec3 normal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;


varying vec3 modelPos;
varying vec4 worldPos;
varying vec3 n;

void main(void) {
  modelPos = vtx;
  worldPos = uMVMatrix * vec4(vtx, 1.0);
  gl_Position = uPMatrix * worldPos;
  n = uNMatrix * normal;
}
