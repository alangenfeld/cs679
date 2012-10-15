attribute vec3 vertex;
attribute vec3 normal;

uniform mat4 uMMatrix;
uniform mat3 uNMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

varying vec4 worldPos;
varying vec3 n;

void main(void) {
  worldPos = uMMatrix * vec4(vertex, 1.0);

  n = uNMatrix * normal;

  gl_Position = uPMatrix * uVMatrix * worldPos;
}
