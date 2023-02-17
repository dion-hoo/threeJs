import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { PreventDragClick } from '../../utils/PreventDragClick.js';
import { Domino } from './Domino.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function example() {
    // Renderer
    const canvas = document.querySelector('#three-canvas');

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.y = 6;
    camera.position.z = 10;
    scene.add(camera);

    // Light
    const ambientLight = new THREE.AmbientLight('#fff', 0.5);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight('#fff', 0.5);

    light.position.x = 2;
    light.position.y = 3;
    light.position.z = 3;
    light.castShadow = true;

    scene.add(light);

    // Controls
    new OrbitControls(camera, renderer.domElement);

    // loader
    const gltfLoader = new GLTFLoader();

    ////////////////////////////////////////////////////////////////////////////////////////

    // Cannon (물리 엔진)
    const cannonWorld = new CANNON.World();
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
            friction: 0.01,
            restitution: 0.9, // 반발력
        }
    );

    cannonWorld.defaultContactMaterial = defaultContactMaterial;
    // 중력
    cannonWorld.gravity.set(0, -20, 0);

    // 바닥 Geometry, Material
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 0, 0),
        shape: floorShape,
        material: defaultMaterial,
    });

    floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(-1, 0, 0),
        Math.PI / 2
    );
    cannonWorld.addBody(floorBody);

    // 성능
    // cannonWorld.allowSleep = true;
    cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);

    // 도미노
    const dominos = [];
    let domino;

    for (let i = 0; i < 20; i++) {
        domino = new Domino({
            index: i,
            scene,
            cannonWorld,
            gltfLoader,
            z: -i * 0.8,
        });
        dominos.push(domino);
    }

    // Mesh
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 'white' });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    planeMesh.receiveShadow = true;
    planeMesh.rotation.x = -Math.PI / 2;

    scene.add(planeMesh);

    // 그리기
    const clock = new THREE.Clock();

    function draw() {
        const delta = clock.getDelta();

        cannonWorld.step(1 / 60, delta, 3);

        dominos.forEach((domino) => {
            if (!domino.cannonBody) return;

            domino.modelMesh.position.copy(domino.cannonBody.position);
            domino.modelMesh.quaternion.copy(domino.cannonBody.quaternion);
        });

        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
    }

    function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    // ratcaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function checkInersects() {
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children);

        if (!intersects[0].object.cannonBody) return;

        intersects[0].object.cannonBody.applyForce(
            new CANNON.Vec3(0, 0, -100),
            new CANNON.Vec3(0, 0, 0)
        );
    }

    // 이벤트
    window.addEventListener('resize', setSize);
    canvas.addEventListener('click', (e) => {
        if (preventDragClick.mouseMoved) return;

        mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
        mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);

        checkInersects();
    });

    const preventDragClick = new PreventDragClick(canvas);

    draw();
}
