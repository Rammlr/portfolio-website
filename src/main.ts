import * as THREE from 'three';
import fragmentShader from './shaders/fragment.frag';
import vertexShader from './shaders/vertex.vert';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
    -1, 1, 1, -1,
    0.1, 10
);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: 'high-performance'});
renderer.setSize(window.innerWidth, window.innerHeight);
const canvas = renderer.domElement;
document.body.appendChild(canvas);

const renderPass = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderPass);

const uniforms = {}

const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms
});

const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const stats = new Stats();
document.body.appendChild(stats.dom);

// const clock = new THREE.Clock();
// let delta = 0;

function animate() {
    requestAnimationFrame(animate);
    // delta = clock.getDelta();
    composer.render();
    stats.update();
}

animate();
