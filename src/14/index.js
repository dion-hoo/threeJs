import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { cm1, cm2 } from './common.js';
import { Pillar } from './Pillar.js';
import { Floor } from './Floor.js';
import { Bar } from './Bar.js';
import { SideLight } from './SideLight.js';
import { Glass } from './Glass.js';
import { Player } from './Player.js';
import gsap from 'gsap';
import { PreventDragClick } from '../../utils/PreventDragClick.js';

const Game = () => {
    // rederder
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
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
    const camera2 = camera.clone();
    const camera3 = camera.clone();
    camera.position.set(-4, 19, 14);

    camera2.position.y = 0;
    camera2.lookAt(0, 1, 0);

    camera3.position.set(0, 13, -16);
    camera3.lookAt(0, 0, 1);

    scene.add(camera, camera2);

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
    spotLight1.shadow.mapSize.width = 2048;
    spotLight1.shadow.mapSize.height = 2048;
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

    // 물리 엔진
    cm1.world.gravity.set(0, -10, 0);

    const defaultContactMaterial = new CANNON.ContactMaterial(
        cm1.defaultMaterial,
        cm1.defaultMaterial,
        {
            friction: 1,
            restitution: 0,
        }
    );
    const glassDefaultContactMaterial = new CANNON.ContactMaterial(
        cm1.defaultMaterial,
        cm1.glassMaterial,
        {
            friction: 0.6,
            restitution: 0,
        }
    );
    const playerGlassContactMaterial = new CANNON.ContactMaterial(
        cm1.glassMaterial,
        cm1.playerMaterial,
        {
            friction: 1,
            restitution: 0,
        }
    );
    cm1.world.defaultContactMaterial = defaultContactMaterial;
    cm1.world.addContactMaterial(glassDefaultContactMaterial);
    cm1.world.addContactMaterial(playerGlassContactMaterial);

    const objects = [];

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
    objects.push(pillar1, pillar2);

    // 바닥
    new Floor({
        name: 'floor',
    });

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

    const SideLights = [];
    for (let i = 0; i < 49; i++) {
        SideLights.push(
            new SideLight({
                name: 'sideLight',
                container: bar1.mesh,
                z: i * 0.5 - glassUnitSize * 10,
            })
        );
    }

    for (let i = 0; i < 49; i++) {
        SideLights.push(
            new SideLight({
                name: 'sideLight',
                container: bar4.mesh,
                z: i * 0.5 - glassUnitSize * 10,
            })
        );
    }

    // 유리판
    const numberOfGlass = 10;
    let glassTypeNumber = 0;
    let glassTypes = [];
    const glassZ = [];
    for (let i = 0; i < numberOfGlass; i++) {
        glassZ.push(-(i * glassUnitSize * 2 - glassUnitSize * 9));
    }

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
            step: i + 1,
            name: `glass-${glassTypes[0]}`,
            x: -1,
            y: 10.5,
            z: glassZ[i],
            type: glassTypes[0],
            cannonMaterial: cm1.glassMaterial,
        });

        const glass2 = new Glass({
            step: i + 1,
            name: `glass-${glassTypes[1]}`,
            x: 1,
            y: 10.5,
            z: glassZ[i],
            type: glassTypes[1],
            cannonMaterial: cm1.glassMaterial,
        });

        objects.push(glass1, glass2);
    }

    // Player
    const player = new Player({
        name: 'player',
        x: 0,
        y: 11,
        z: 13,
        rotationY: Math.PI,
        cannonMaterial: cm1.playerMaterial,
        mass: 30,
    });
    objects.push(player);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let fail = false;
    let jumping = false;
    let onReplay = false;
    let isEnd = false;
    const checkClickedObject = (mesh) => {
        if (mesh.name.indexOf('glass') >= 0) {
            // 클릭했을 경우
            if (jumping || fail) return;

            if (mesh.step - 1 === cm2.step) {
                jumping = true;

                player.actions[2].stop();
                player.actions[2].play();

                switch (mesh.type) {
                    case 'normal':
                        // 실패했을 경우
                        setTimeout(() => {
                            fail = true;
                            player.actions[0].stop();
                            player.actions[1].play();

                            SideLights.map((sideLight) => {
                                sideLight.turnOff();
                            });

                            setTimeout(() => {
                                onReplay = true;
                                player.cannonBody.position.y = 10;
                                setTimeout(() => {
                                    onReplay = false;
                                }, 3000);
                            }, 1000);
                        }, 700);

                        break;

                    default:
                        // 성공했을 경우
                        fail = false;
                        break;
                }

                setTimeout(() => {
                    jumping = false;
                }, 1000);

                gsap.to(player.cannonBody.position, {
                    duration: 1,
                    x: mesh.position.x,
                    z: glassZ[cm2.step],
                });

                gsap.to(player.cannonBody.position, {
                    duration: 0.4,
                    y: 12,
                });

                cm2.step++;

                if (cm2.step === numberOfGlass && mesh.type === 'strong') {
                    setTimeout(() => {
                        player.actions[2].stop();
                        player.actions[2].play();

                        gsap.to(player.cannonBody.position, {
                            duration: 1,
                            x: 0,
                            z: -14,
                        });

                        gsap.to(player.cannonBody.position, {
                            duration: 0.4,
                            y: 12,
                        });

                        isEnd = true;
                    }, 1000);
                }
            }
        }
    };

    const checkIntersects = () => {
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(cm1.scene.children);

        for (const item of intersects) {
            checkClickedObject(item.object);

            break;
        }
    };

    const clock = new THREE.Clock();
    const draw = () => {
        const delta = clock.getDelta();

        let cannonStepTime = 1 / 60;
        if (delta < 0.012) cannonStepTime = 1 / 120;
        cm1.world.step(cannonStepTime, delta, 3);

        objects.forEach((item) => {
            if (item.cannonBody) {
                if (item.name === 'player') {
                    if (item.modelMesh) {
                        item.modelMesh.position.copy(item.cannonBody.position);
                        if (fail) {
                            item.modelMesh.quaternion.copy(
                                item.cannonBody.quaternion
                            );
                        }
                    }
                    item.modelMesh.position.y += 0.15;
                } else {
                    item.mesh.position.copy(item.cannonBody.position);
                    item.mesh.quaternion.copy(item.cannonBody.quaternion);

                    if (item.modelMesh) {
                        item.modelMesh.position.copy(item.cannonBody.position);
                        item.modelMesh.quaternion.copy(
                            item.cannonBody.quaternion
                        );
                    }
                }
            }
        });

        controls.update();

        if (cm1.mixer) {
            cm1.mixer.update(delta);
        }

        if (isEnd) {
            renderer.render(scene, camera3);
        } else {
            if (onReplay) {
                camera2.position.x = player.cannonBody.position.x;
                camera2.position.z = player.cannonBody.position.z;
                renderer.render(scene, camera2);
            } else {
                if (player.cannonBody) {
                    camera.position.z = player.cannonBody.position.z;
                }

                renderer.render(scene, camera);
            }
        }

        renderer.setAnimationLoop(draw);
    };
    draw();

    const preventDragClick = new PreventDragClick(canvas);
    canvas.addEventListener('click', (e) => {
        if (preventDragClick.mouseMoved) return;

        mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
        mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);

        checkIntersects();
    });
};

export default Game;
