attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec3 vtxPosition;

void main(void) {
  vtxPosition = aVertexPosition;
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
