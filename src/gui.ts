import * as THREE from 'three';
import Stats from "three/examples/jsm/libs/stats.module.js";
import {GUI} from "dat.gui";

export function createGUI(landscapeMaterial: THREE.ShaderMaterial, grassMaterial: THREE.ShaderMaterial, grassUniforms: any, directionalLight: any): Stats {
    const gui = new GUI();

    gui.add(landscapeMaterial, 'wireframe').name('Landscape Wireframe');
    gui.add(grassMaterial, 'wireframe').name('Grass Wireframe');
    gui.add(grassUniforms.u_show_normals, 'value').name('Show Grass Normals');

    const directionalLightFolder = gui.addFolder('Directional Light');
    directionalLightFolder.add(directionalLight, 'color');
    // directionalLightFolder.add(directionalLight, 'direction');

    const stats = new Stats();
    document.body.appendChild(stats.dom);
    return stats;
}