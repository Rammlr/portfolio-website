import * as THREE from 'three';
import {SRGBColorSpace} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {MaterialProperties, MyDirectionalLight} from './types.ts';
import Dat, {GUI} from 'dat.gui';
import init from 'three-dat.gui';

init(Dat);

function addColorPicker(propertyAccessor: () => THREE.Vector3, propertyName: string, folder: GUI) {
    const colorHex = `#${new THREE.Color().setRGB(propertyAccessor().x, propertyAccessor().y, propertyAccessor().z, SRGBColorSpace).getHexString()}`;
    const colorController = folder.addColor({color: colorHex}, 'color').name(propertyName);

    colorController.onChange((value: string) => {
        const color = new THREE.Color(value);
        propertyAccessor().set(color.r, color.g, color.b);
    });
}

export function createGUI(
    landscapeMaterial: THREE.ShaderMaterial,
    grassMaterial: THREE.ShaderMaterial,
    grassUniforms: any,
    directionalLight: MyDirectionalLight,
    grassMaterialProperties: MaterialProperties,
): Stats {
    const gui = new Dat.GUI({width: 360});

    gui.add(landscapeMaterial, 'wireframe').name('Landscape Wireframe');
    gui.add(grassMaterial, 'wireframe').name('Grass Wireframe');
    gui.add(grassUniforms.u_show_normals, 'value').name('Show Grass Normals');

    const directionalLightFolder = gui.addFolder('Directional Light');
    addColorPicker(() => directionalLight.color, 'Directional light Color', directionalLightFolder);
    directionalLightFolder.addVector('Directional Light Direction', directionalLight.direction);

    const grassColorFolder = gui.addFolder('Grass Colors');
    addColorPicker(() => grassUniforms.u_lower_color.value, 'Grass Lower Color', grassColorFolder);
    addColorPicker(() => grassUniforms.u_upper_color.value, 'Grass Upper Color', grassColorFolder);

    const materialPropertiesFolder = gui.addFolder('Grass Material Properties');
    materialPropertiesFolder.add(grassMaterialProperties, 'ka', 0., 1.).name('Ambient Coefficient');
    materialPropertiesFolder.add(grassMaterialProperties, 'kd', 0., 1.).name('Diffuse Coefficient');
    materialPropertiesFolder.add(grassMaterialProperties, 'ks', 0., 1.).name('Specular Coefficient');
    materialPropertiesFolder.add(grassMaterialProperties, 'alpha', 0., 5.).name('Shininess Exponent');

    const stats = new Stats();

    // hide stats and controls per default, only in playground mode
    stats.dom.classList.add('hidden');
    gui.domElement.classList.add('hidden');
    
    document.body.appendChild(stats.dom);
    return stats;
}
