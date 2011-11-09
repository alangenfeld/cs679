attribute vec3 vertex;
attribute vec3 normal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec3 modelPos;
varying vec4 worldPos;
varying vec3 n;

void main(void) {
  worldPos = uMVMatrix * vec4(vertex, 1.0);
  gl_Position = uPMatrix * worldPos;
  n = uNMatrix * normal;
}
