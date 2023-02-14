import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';

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

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.y = 10;
    camera.position.z = 16;
    scene.add(camera);

    // Light
    const ambientLight = new THREE.AmbientLight('#fff', 0.5);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight('#fff', 0.5);
    light.position.y = 3;

    scene.add(light);

    // Controls
    new OrbitControls(camera, renderer.domElement);

    ////////////////////////////////////////////////////////////////////////////////////////

    // Cannon (물리 엔진)
    const cannonWorld = new CANNON.World();

    // 중력
    cannonWorld.gravity.set(0, -10, 0);

    // 바닥 Geometry, Material
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 0, 0),
        shape: floorShape,
    });

    floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(-1, 0, 0),
        Math.PI / 2
    );
    cannonWorld.addBody(floorBody);

    // box Geometry, Material
    const boxShape = new CANNON.Box(new CANNON.Vec3(0.25, 2, 0.25));
    const boxBody = new CANNON.Body({
        mass: 3,
        position: new CANNON.Vec3(0, 10, 0),
        shape: boxShape,
    });
    cannonWorld.addBody(boxBody);

    // Mesh
    const planeGeometry = new THREE.PlaneGeometry(6, 6);
    const boxGeometry = new THREE.BoxGeometry(0.5, 4, 0.5);

    const material1 = new THREE.MeshStandardMaterial({ color: 'white' });
    const material2 = new THREE.MeshStandardMaterial({ color: '#1c9' });

    const plane = new THREE.Mesh(planeGeometry, material1);
    const box = new THREE.Mesh(boxGeometry, material2);

    plane.rotation.x = -Math.PI / 2;
    box.position.y = 2;

    scene.add(plane, box);

    // 그리기
    const clock = new THREE.Clock();

    function draw() {
        const delta = clock.getDelta();

        let cannonStepTime = delta < 0.01 ? 1 / 120 : 1 / 60;

        cannonWorld.step(cannonStepTime, delta, 3);
        box.position.copy(boxBody.position);
        box.quaternion.copy(boxBody.quaternion); // 회전

        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
    }

    function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    // 이벤트
    window.addEventListener('resize', setSize);

    draw();
}
