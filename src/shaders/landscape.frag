precision mediump float;

uniform vec2 u_plane_resolution;
uniform float u_time;

varying vec2 vUv;

#include "lygia/generative/pnoise.glsl"

void main() {
    vec2 st = vUv;
    st *= 10.;

    vec3 color = vec3(153., 192., 51.) / 255.;

    //    vec3 color = vec3(vUv.x, vUv.y, 0.0);

    //    vec3 color = vec3(0.0);
    //
    //    float noise = pnoise(st, vec2(1.2, 3.4)) * 0.5 + 0.5;
    //    color += noise;

    gl_FragColor = vec4(color, 1.0);
}