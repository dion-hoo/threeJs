import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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
    camera.position.z = 4;
    scene.add(camera);

    // Light
    const ambientLight = new THREE.AmbientLight('#fff', 0.5);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight('#fff', 0.5);

    light.position.x = 2;
    light.position.y = 3;
    light.position.z = 2;
    light.castShadow = true;

    scene.add(light);

    // Controls
    new OrbitControls(camera, renderer.domElement);

    // Mesh
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.PointsMaterial({
        size: 2,
        sizeAttenuation: false,
    });
    const points = new THREE.Points(geometry, material);

    scene.add(points);

    // 그리기
    const clock = new THREE.Clock();

    function draw() {
        const delta = clock.getDelta();

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

    const preventDragClick = new PreventDragClick(canvas);

    draw();
}
