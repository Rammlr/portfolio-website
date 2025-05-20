import * as THREE from 'three';
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js";
import {createGUI} from "./gui.ts";
import landscapeVertexShader from "./shaders/landscape.vert";
import landscapeFragmentShader from "./shaders/landscape.frag";
import grassVertexShader from "./shaders/grass.vert";
import grassFragmentShader from "./shaders/grass.frag";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {enterPlaygroundMode, isOnMobile, randomXZPositionMatrix, vector3ToHexNumber} from "./util.ts";
import {MaterialProperties, MyDirectionalLight} from "./types.ts";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {addScrollControls} from "./scrollAnimator.ts";

let isInPlaygroundMode = false;

// make it callable from html
(window as any).enterPlaygroundMode = () => {
    enterPlaygroundMode(controls);
    isInPlaygroundMode = true;
}

if (isOnMobile()) {
    document.body.getElementsByTagName('main')[0].remove();
    document.body.append(document.createElement('h1'));
    const h1tag = document.body.getElementsByTagName('h1')[0];
    h1tag.innerText = 'Mobile not supported. Please use a desktop browser.';
    h1tag.style.zIndex = '99';
    h1tag.style.position = 'absolute';
    h1tag.style.padding = '20px';
}

const TIME_SPEED = .05;
const PLANE_SIZE = 2000;
const PLANE_SEGMENTS = 256;
const GRASS_COUNT = isOnMobile() ? 200_000 : 1_000_000;


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd8ecff);
// scene.fog = new THREE.FogExp2( 0xaaccff, 0.0003 );

const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 1, 20000
);
addScrollControls(camera);

const renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: 'high-performance'});
renderer.setSize(window.innerWidth, window.innerHeight);

const canvas = renderer.domElement;
document.body.appendChild(canvas);

let planeUniforms = { // arrays in here have to be padded to the max length
    u_plane_resolution: {value: new THREE.Vector2(PLANE_SIZE, PLANE_SIZE)},
    u_time: {value: 0.0},
};

let directionalLight: MyDirectionalLight = {
    color: new THREE.Vector3(1.0, 1.0, .7), direction: new THREE.Vector3(-1., -.5, -0.25)
};

let directionalLight2 = {
    color: new THREE.Vector3(1., 1., .7), direction: new THREE.Vector3(-1., -.5, 0.25)
}

let grassMaterialProperties: MaterialProperties = {
    ka: 0.3,
    kd: 0.65,
    ks: 0.05,
    alpha: 1.0
};

let grassUniforms = { // arrays in here have to be padded to the max length
    u_plane_resolution: {value: new THREE.Vector2(PLANE_SIZE, PLANE_SIZE)},
    u_time: {value: 0.0},
    u_material_properties: {value: grassMaterialProperties},
    u_directional_lights: {value: [directionalLight, directionalLight2]},
    u_lower_color: {value: new THREE.Vector3(16., 130., 55.).divideScalar(255.)},
    u_upper_color: {value: new THREE.Vector3(153., 237., 150.).divideScalar(255.)},
    u_show_normals: {value: false},
};

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.disconnect(); // no controls per default, only in playground mode


const landscapeGeometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, PLANE_SEGMENTS - 1, PLANE_SEGMENTS - 1);
landscapeGeometry.rotateX(-Math.PI / 2);

const landscapeMaterial = new THREE.ShaderMaterial
({
    uniforms: planeUniforms,
    vertexShader: landscapeVertexShader,
    fragmentShader: landscapeFragmentShader,
    wireframe: false,
    side: THREE.DoubleSide,
});

const grassMaterial = new THREE.ShaderMaterial
({
    uniforms: grassUniforms,
    vertexShader: grassVertexShader,
    fragmentShader: grassFragmentShader,
    wireframe: false,
    vertexColors: true,
    side: THREE.DoubleSide,
});

const landscape = new THREE.Mesh(landscapeGeometry, landscapeMaterial);
scene.add(landscape);

const loader = new GLTFLoader();

loader.load('/grass.glb', function (gltf) {
    const grass = gltf.scene.children
        .find(child => child.type === 'Mesh')! as THREE.Mesh;
    grass.material = grassMaterial;
    const instancedGrassMesh = new THREE.InstancedMesh(grass.geometry, grass.material, GRASS_COUNT);
    const matrix = new THREE.Matrix4();

    for (let i = 0; i < GRASS_COUNT; i++) {
        randomXZPositionMatrix(matrix, 6, PLANE_SIZE - 15);
        instancedGrassMesh.setMatrixAt(i, matrix);
    }

    scene.add(instancedGrassMesh);
}, undefined, undefined);

const arrowHelper = new THREE.ArrowHelper(directionalLight.direction, new THREE.Vector3(0, -150, 0), 100, vector3ToHexNumber(directionalLight.color));
scene.add(arrowHelper);

const stats = createGUI(landscapeMaterial, grassMaterial, grassUniforms, directionalLight, grassMaterialProperties);

const clock = new THREE.Clock();
let delta = 0;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    planeUniforms.u_time.value += TIME_SPEED * delta;
    grassUniforms.u_time.value += TIME_SPEED * delta;
    delta = clock.getDelta();

    if (isInPlaygroundMode) {
        controls.update(delta);
    }

    composer.render();
    arrowHelper.setDirection(directionalLight.direction.normalize());
    arrowHelper.setColor(vector3ToHexNumber(directionalLight.color))
    stats.update();
    // console.log(camera.position);
    // console.log(camera.rotation);
}

animate();
