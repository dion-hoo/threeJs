import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { cm1, cm2 } from './common.js';
import { Pillar } from './Pillar.js';
import { Floor } from './Floor.js';
import { Bar } from './Bar.js';
import { SideLight } from './SideLight.js';
import { Glass } from './Glass.js';

const Game = () => {
    // rederder

    const renderer = new THREE.WebGLRenderer({
        canvas: cm1.canvas,
        antialias: true,
    });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene
    const scene = cm1.scene;
    scene.background = new THREE.Color(cm2.backgroundColor);

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75,
        innerWidth / innerHeight,
        1,
        1000
    );
    camera.position.set(-4, 19, 14);

    scene.add(camera);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.dampingFactor = 0.02;
    controls.enableDamping = true;

    // Light
    const anmbientLight = new THREE.AmbientLight(cm2.lightColor, 0.8);
    scene.add(anmbientLight);

    const spotLightDistance = 50;
    const spotLight1 = new THREE.SpotLight(cm2.lightColor, 1);
    spotLight1.castShadow = true;
    const spotLight2 = spotLight1.clone();
    const spotLight3 = spotLight1.clone();
    const spotLight4 = spotLight1.clone();

    spotLight1.position.set(
        -spotLightDistance,
        spotLightDistance,
        spotLightDistance
    );
    spotLight2.position.set(
        spotLightDistance,
        spotLightDistance,
        spotLightDistance
    );
    spotLight3.position.set(
        -spotLightDistance,
        spotLightDistance,
        -spotLightDistance
    );
    spotLight4.position.set(
        spotLightDistance,
        spotLightDistance,
        -spotLightDistance
    );
    scene.add(spotLight1, spotLight2, spotLight3, spotLight4);

    // 기둥
    // 1.2가 유리창 하나의 사이즈
    const glassUnitSize = 1.2;
    const pillar1 = new Pillar({
        name: 'pillar',
        x: 0,
        y: 5.5,
        z: -glassUnitSize * 12 - glassUnitSize / 2,
    });

    const pillar2 = new Pillar({
        name: 'pillar',
        x: 0,
        y: 5.5,
        z: glassUnitSize * 12 + glassUnitSize / 2,
    });

    // 바닥
    new Floor({
        name: 'floor',
    });

    const draw = () => {
        controls.update();

        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
    };

    // 바
    const bar1 = new Bar({
        name: 'bar',
        x: -1.6,
        y: 10.3,
        z: 0,
    });
    const bar2 = new Bar({
        name: 'bar',
        x: -0.4,
        y: 10.3,
        z: 0,
    });
    const bar3 = new Bar({
        name: 'bar',
        x: 0.4,
        y: 10.3,
        z: 0,
    });
    const bar4 = new Bar({
        name: 'bar',
        x: 1.6,
        y: 10.3,
        z: 0,
    });

    for (let i = 0; i < 49; i++) {
        new SideLight({
            name: 'sideLight',
            container: bar1.mesh,
            z: i * 0.5 - glassUnitSize * 10,
        });
    }

    for (let i = 0; i < 49; i++) {
        new SideLight({
            name: 'sideLight',
            container: bar4.mesh,
            z: i * 0.5 - glassUnitSize * 10,
        });
    }

    // 유리판
    const numberOfGlass = 10;
    let glassTypeNumber = 0;
    let glassTypes = [];
    for (let i = 0; i < numberOfGlass; i++) {
        glassTypeNumber = Math.round(Math.random());

        switch (glassTypeNumber) {
            case 0:
                glassTypes = ['normal', 'strong'];
                break;

            case 1:
                glassTypes = ['strong', 'normal'];
                break;
        }

        const glass1 = new Glass({
            name: `glass-${glassTypes[0]}`,
            x: -1,
            y: 10.5,
            z: i * glassUnitSize * 2 - glassUnitSize * 9,
            type: glassTypes[0],
        });

        const glass2 = new Glass({
            name: `glass-${glassTypes[1]}`,
            x: 1,
            y: 10.5,
            z: i * glassUnitSize * 2 - glassUnitSize * 9,
            type: glassTypes[1],
        });
    }

    draw();
};

export default Game;
