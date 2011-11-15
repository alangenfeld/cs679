attribute vec3 vertex;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
  vec4 worldPos = uMVMatrix * vec4(vertex, 1.0);
  gl_Position = uPMatrix * worldPos;
}
