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

    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('../assets/img/star.png');

    // Mesh
    const geometry = new THREE.BufferGeometry();
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < positions.length; i++) {
        positions[i] = Math.random() * 10 - 5;
        colors[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.3,
        map: particleTexture,
        transparent: true,
        alphaMap: particleTexture,
        depthWrite: false,
        vertexColors: true,
    });
    const particles = new THREE.Points(geometry, material);

    scene.add(particles);

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
