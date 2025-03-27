import * as THREE from 'three';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js";
import {createGUI} from "./gui.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import landscapeVertexShader from "./shaders/landscape.vert";
import landscapeFragmentShader from "./shaders/landscape.frag";
import grassVertexShader from "./shaders/grass.vert";
import grassFragmentShader from "./shaders/grass.frag";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {randomXZPositionMatrix} from "./util.ts";
import {MyDirectionalLight} from "./types.ts";

const TIME_SPEED = .05;

const PLANE_SIZE = 1000;
const PLANE_SEGMENTS = 128;

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

let planeUniforms = { // arrays in here have to be padded to the max length
    u_plane_resolution: {value: new THREE.Vector2(PLANE_SIZE, PLANE_SIZE)},
    u_time: {value: 0.0},
};

let directionalLight: MyDirectionalLight = {
    color: new THREE.Vector3(1.0, 1.0, 1.0), direction: new THREE.Vector4(1.)
};

let grassUniforms = { // arrays in here have to be padded to the max length
    u_plane_resolution: {value: new THREE.Vector2(PLANE_SIZE, PLANE_SIZE)},
    u_time: {value: 0.0},
    u_material_properties: {value: new THREE.Vector4(.1, .7, .2, 1.)},
    u_directional_light: {value: directionalLight},
    u_show_normals: {value: false},
};

const renderPass = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderPass);

const controls = new OrbitControls(camera, renderer.domElement);


// createLighting(scene);

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
    const count = 200000;
    const instancedGrassMesh = new THREE.InstancedMesh(grass.geometry, grass.material, count);
    const matrix = new THREE.Matrix4();

    for (let i = 0; i < count; i++) {
        randomXZPositionMatrix(matrix, 6, PLANE_SIZE - 15);
        instancedGrassMesh.setMatrixAt(i, matrix);
    }

    scene.add(instancedGrassMesh);
}, undefined, undefined);


const stats = createGUI(landscapeMaterial, grassMaterial, grassUniforms, directionalLight);

const clock = new THREE.Clock();
let delta = 0;

function animate() {
    requestAnimationFrame(animate);
    planeUniforms.u_time.value += TIME_SPEED * delta;
    grassUniforms.u_time.value += TIME_SPEED * delta;
    delta = clock.getDelta();

    composer.render();
    controls.update(delta)
    stats.update();
}

animate();
