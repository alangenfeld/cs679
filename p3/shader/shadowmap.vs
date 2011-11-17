attribute vec3 vertex;

uniform mat4 uMMatrix;
uniform mat4 uLMatrix;
uniform mat4 uPMatrix;

void main(void) {
  vec4 worldPos = uMMatrix * vec4(vertex, 1.0);
  gl_Position = uPMatrix * uLMatrix * worldPos;
}
