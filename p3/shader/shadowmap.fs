#ifdef GL_ES
precision highp float;
#endif
  
varying vec4 worldPos;

uniform vec3 lightPos;

vec4 pack2 (float fDepth) {
  return vec4(floor(fDepth) / 256.0, fract(fDepth),
               fract(fDepth) * 256.0, fract(fDepth) * 256.0 * 256.0);
}

void main (void)
{
  // Encode depth to RGBA texture
  gl_FragColor = pack2(distance(worldPos.xyz, lightPos));
}
