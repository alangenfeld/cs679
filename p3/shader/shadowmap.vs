attribute vec3 vertex;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uLPMatrix;
//const mat4 ScaleMatrix = mat4(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);

varying vec4 worldPos;

void main(void) {
  worldPos = uMMatrix * vec4(vertex, 1.0);
  gl_Position = uLPMatrix * uVMatrix * worldPos;
}
