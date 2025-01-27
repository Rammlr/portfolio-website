precision mediump float;

varying vec3 vColor;

uniform float u_time;

void main() {
    vec3 green = vec3(0., 255., 0.) / 255.;
    //    vec3 brown = vec3(92., 64., 51.) / 255.;
    gl_FragColor = vec4(mix(green, vec3(1.), vColor), 1.0);
}