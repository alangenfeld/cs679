attribute vec3 vertex;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec3 modelPos;
varying vec4 worldPos;
varying vec3 n;
varying vec2 texCoord;

void main(void) {
  texCoord = uv;
  worldPos = uMVMatrix * vec4(vertex, 1.0);
  gl_Position = uPMatrix * worldPos;
  n = uNMatrix * normal;
}
