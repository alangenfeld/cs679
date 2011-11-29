attribute vec3 vertex;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uLPMatrix;

varying vec4 worldDist;

void main(void) {
  vec4 worldPos = uMMatrix * vec4(vertex, 1.0);
  gl_Position = uLPMatrix * uVMatrix * worldPos;
}
