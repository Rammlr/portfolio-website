import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {MaterialProperties, MyDirectionalLight} from './types.ts';
import Dat from 'dat.gui';
import init from 'three-dat.gui';

init(Dat);

export function createGUI(landscapeMaterial: THREE.ShaderMaterial, grassMaterial: THREE.ShaderMaterial, grassUniforms: any, directionalLight: MyDirectionalLight, grassMaterialProperties: MaterialProperties): Stats {
    const gui = new Dat.GUI();

    gui.add(landscapeMaterial, 'wireframe').name('Landscape Wireframe');
    gui.add(grassMaterial, 'wireframe').name('Grass Wireframe');
    gui.add(grassUniforms.u_show_normals, 'value').name('Show Grass Normals');

    const directionalLightFolder = gui.addFolder('Directional Light');
    directionalLightFolder.addVector('Directional Light Color', directionalLight.color);
    directionalLightFolder.addVector('Directional Light Direction', directionalLight.direction);

    const materialPropertiesFolder = gui.addFolder('Grass Material Properties');
    materialPropertiesFolder.add(grassMaterialProperties, 'ka', 0., 1.).name('Ambient Coefficient');
    materialPropertiesFolder.add(grassMaterialProperties, 'kd', 0., 1.).name('Diffuse Coefficient');
    materialPropertiesFolder.add(grassMaterialProperties, 'ks', 0., 1.).name('Specular Coefficient');
    materialPropertiesFolder.add(grassMaterialProperties, 'alpha', 0., 5.).name('Shininess Exponent');

    const stats = new Stats();
    document.body.appendChild(stats.dom);
    return stats;
}
