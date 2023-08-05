import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { House } from './House.js';
import gsap from 'gsap';

const example = () => {
    // Renderer
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
    });

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#fff');

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75,
        innerWidth / innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 2, 25);
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.update();

    // Light
    const ambientLight = new THREE.AmbientLight('white', 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight('white', 0.7);
    spotLight.position.set(0, 150, 100);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    scene.add(spotLight);

    // Mesh
    const floorMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial('#fff')
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // House
    const houses = [];
    houses.push(
        new House({
            scene,
            modelSrc: '../models/house.glb',
            x: 0,
            z: 20,
            height: 2,
        })
    );
    houses.push(
        new House({
            scene,
            modelSrc: '../models/house.glb',
            x: 10,
            z: 10,
            height: 2,
        })
    );
    houses.push(
        new House({
            scene,
            modelSrc: '../models/house.glb',
            x: 5,
            z: -10,
            height: 2,
        })
    );
    houses.push(
        new House({
            scene,
            modelSrc: '../models/house.glb',
            x: -5,
            z: -10,
            height: 2,
        })
    );
    houses.push(
        new House({
            scene,
            modelSrc: '../models/house.glb',
            x: -10,
            z: 10,
            height: 2,
        })
    );

    const draw = () => {
        controls.update();

        // draw
        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
    };

    draw();

    let currentSection = 0;
    const handleScroll = () => {
        const newSection = Math.round(window.scrollY / window.innerHeight);

        if (currentSection !== newSection) {
            console.log(newSection);
            gsap.to(camera.position, {
                duration: 1,
                x: houses[newSection].x,
                z: houses[newSection].z - 5,
            });

            currentSection = newSection;
        }
    };

    window.addEventListener('scroll', handleScroll);
};

export default example;
