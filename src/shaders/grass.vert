precision mediump float;

varying vec3 vColor;

void main() {
    vColor = color.rgb;


    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}