precision mediump float;

uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    gl_FragColor = vec4(0.2, 0.5, 0.7, 1.0);
}