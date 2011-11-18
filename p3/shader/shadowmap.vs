attribute vec3 vertex;

uniform mat4 uMMatrix;
uniform mat4 uLMatrix[1];
uniform mat4 uLPMatrix;

void main(void) {
  vec4 worldPos = uMMatrix * vec4(vertex, 1.0);
  gl_Position = uLPMatrix * uLMatrix[0] * worldPos;
}
