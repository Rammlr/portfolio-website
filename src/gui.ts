import * as THREE from 'three';
import Stats from "three/examples/jsm/libs/stats.module.js";
import {GUI} from "dat.gui";

export function createGUI(landscapeMaterial: THREE.ShaderMaterial, grassMaterial: THREE.ShaderMaterial): Stats {
    const gui = new GUI();

    gui.add(landscapeMaterial, 'wireframe').name('Landscape Wireframe');
    gui.add(grassMaterial, 'wireframe').name('Grass Wireframe');

    const stats = new Stats();
    document.body.appendChild(stats.dom);
    return stats;
}