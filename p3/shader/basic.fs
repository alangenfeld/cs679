#ifdef GL_ES
precision highp float;
#endif
varying vec3 modelPos;
varying vec4 worldPos;
varying vec3 n;
varying vec2 texCoord;

uniform vec3 lightPos;
uniform vec3 lightCol;
uniform vec3 ambient;
uniform sampler2D texture;

//temp
void main(void) {
  vec4 col = texture2D(texture, texCoord);
  vec3 lightDirection = normalize(lightPos - worldPos.xyz);
  float w = max(dot(normalize(n), lightDirection), 0.0);
  float dist = length(lightPos - worldPos.xyz);
  float attenuation = (1.0/(dist));
  vec3 lighting = ambient + lightCol * w * attenuation;
  lighting = col.rgb * lighting;
  gl_FragColor = vec4(lighting, 1.0);
}
