import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {MyDirectionalLight} from './types.ts';
import Dat from 'dat.gui';
import init from 'three-dat.gui';

init(Dat);

export function createGUI(landscapeMaterial: THREE.ShaderMaterial, grassMaterial: THREE.ShaderMaterial, grassUniforms: any, directionalLight: MyDirectionalLight): Stats {
    const gui = new Dat.GUI();

    gui.add(landscapeMaterial, 'wireframe').name('Landscape Wireframe');
    gui.add(grassMaterial, 'wireframe').name('Grass Wireframe');
    gui.add(grassUniforms.u_show_normals, 'value').name('Show Grass Normals');

    const directionalLightFolder = gui.addFolder('Directional Light');
    console.log(directionalLight)
    directionalLightFolder.addVector('Directional Light Color', directionalLight.color);
    directionalLightFolder.addVector('Directional Light Direction', directionalLight.direction);

    const stats = new Stats();
    document.body.appendChild(stats.dom);
    return stats;
}
