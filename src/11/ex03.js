import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { PreventDragClick } from '../../utils/PreventDragClick.js';

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

    ////////////////////////////////////////////////////////////////////////////////////////

    // Cannon (물리 엔진)
    const cannonWorld = new CANNON.World();

    const defaultMaterial = new CANNON.Material('default');
    const rubberMaterial = new CANNON.Material('rubber');
    const ironMaterial = new CANNON.Material('iron');
    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
            friction: 0.2,
            restitution: 0.4, // 반발력
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

    // sphereMesh Geometry, Material
    const sphereShape = new CANNON.Sphere(0.5);
    const sphereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 5, 0),
        shape: sphereShape,
        material: defaultMaterial,
    });
    cannonWorld.addBody(sphereBody);

    // Mesh
    const planeGeometry = new THREE.PlaneGeometry(6, 6);
    const sphereGeometry = new THREE.SphereGeometry(0.5);

    const material1 = new THREE.MeshStandardMaterial({ color: 'white' });
    const material2 = new THREE.MeshStandardMaterial({ color: '#1c9' });

    const plane = new THREE.Mesh(planeGeometry, material1);
    plane.receiveShadow = true;

    const sphereMesh = new THREE.Mesh(sphereGeometry, material2);
    sphereMesh.castShadow = true;

    plane.rotation.x = -Math.PI / 2;
    sphereMesh.position.y = 2;

    scene.add(plane, sphereMesh);

    // 그리기
    const clock = new THREE.Clock();

    function draw() {
        const delta = clock.getDelta();

        let cannonStepTime = delta < 0.01 ? 1 / 120 : 1 / 60;

        cannonWorld.step(cannonStepTime, delta, 3);
        sphereMesh.position.copy(sphereBody.position);
        sphereMesh.quaternion.copy(sphereBody.quaternion); // 회전

        sphereBody.velocity.x *= 0.98;
        sphereBody.velocity.y *= 0.98;
        sphereBody.velocity.z *= 0.98;
        sphereBody.angularVelocity.x *= 0.98;
        sphereBody.angularVelocity.y *= 0.98;
        sphereBody.angularVelocity.z *= 0.98;

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
    canvas.addEventListener('click', () => {
        if (preventDragClick.mouseMoved) return;

        sphereBody.velocity.set(0, 0, 0);
        sphereBody.angularVelocity.set(0, 0, 0);
        sphereBody.applyForce(new CANNON.Vec3(-500, 0, 0), sphereBody.position);
    });

    const preventDragClick = new PreventDragClick(canvas);

    draw();
}
