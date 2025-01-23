import * as THREE from 'three';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js";
import {createGUI} from "./gui.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {createLighting} from "./lighting.ts";
import landscapeVertexShader from "./shaders/landscape.vert";
import landscapeFragmentShader from "./shaders/landscape.frag";

const TIME_SPEED = .05;


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd8ecff);
// scene.fog = new THREE.FogExp2( 0xaaccff, 0.0003 );

const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 1, 20000
);
camera.position.x = 600;
camera.position.y = 600;

const renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: 'high-performance'});
renderer.setSize(window.innerWidth, window.innerHeight);

const canvas = renderer.domElement;
document.body.appendChild(canvas);

const uniforms = { // arrays in here have to be padded to the max length
    u_resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
    u_time: {value: 0.0},
}

const renderPass = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderPass);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);


createLighting(scene);

const worldWidth = 128, worldDepth = 128;

const landscapeGeometry = new THREE.PlaneGeometry(1000, 1000, worldWidth - 1, worldDepth - 1);
landscapeGeometry.rotateX(-Math.PI / 2);

const landscapeMaterial = new THREE.ShaderMaterial
({
    uniforms,
    vertexShader: landscapeVertexShader,
    fragmentShader: landscapeFragmentShader,
    wireframe: false
});

const landscape = new THREE.Mesh(landscapeGeometry, landscapeMaterial);
scene.add(landscape);


const stats = createGUI(landscapeMaterial);

const clock = new THREE.Clock();
let delta = 0;

function animate() {
    requestAnimationFrame(animate);
    uniforms.u_time.value += TIME_SPEED * delta;
    delta = clock.getDelta();

    composer.render();
    controls.update(delta)
    stats.update();
}

animate();
