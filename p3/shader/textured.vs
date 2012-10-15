attribute vec3 vertex;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 uMMatrix;
uniform mat3 uNMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

varying vec4 worldPos;
varying vec3 n;
varying vec2 texCoord;

void main(void) {
  texCoord = uv;

  worldPos = uMMatrix * vec4(vertex, 1.0);

  n = uNMatrix * normal;

  gl_Position = uPMatrix * uVMatrix * worldPos;
}
