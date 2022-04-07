import * as THREE from 'three';
import { DoubleSide } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ----- 주제: OrbitControls

export default function example() {
    // 텍스처 이미지 로드
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = () => {
        console.log('로드 시작');
    };

    loadingManager.onProgress = () => {
        console.log('이미지 하나하나가 로드 될때 마다 발생');
    };

    loadingManager.onLoad = () => {
        console.log('모든 이미지들이 모두 로드가 끝났을때');
    };

    loadingManager.onError = () => {
        console.log('에러가 났을때');
    };

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const gradientText = textureLoader.load('/assets/img/gradient.png');

    gradientText.magFilter = THREE.NearestFilter;

    // Renderer
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 1.5;
    camera.position.z = 6;
    scene.add(camera);

    // Light
    const ambientLight = new THREE.AmbientLight('white', 0.5);

    const directionalLight = new THREE.DirectionalLight('white', 1);
    directionalLight.position.x = 1;
    directionalLight.position.z = 2;
    scene.add(ambientLight, directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Mesh
    const geometry = new THREE.ConeGeometry(1, 2, 128);
    const material = new THREE.MeshToonMaterial({
        color: 'plum',
        gradientMap: gradientText,
        side: DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

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

    draw();
}
