attribute vec3 vertex;
attribute vec3 normal;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uLMatrix;
const mat4 ScaleMatrix = mat4(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);

varying vec4 litPos;
varying vec4 worldPos;
varying vec3 n;

void main(void) {
  worldPos = uMMatrix * vec4(vertex, 1.0);

  litPos =  ScaleMatrix * uPMatrix * uLMatrix * uMMatrix * vec4(vertex, 1.0);

  n = mat3(uMMatrix) * normal;

  gl_Position = uPMatrix * uVMatrix * worldPos;
}
