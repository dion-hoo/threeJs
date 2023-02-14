import * as THREE from 'three';

// ----- 주제: AxesHelper, GridHelper

export default function example() {
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
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.x = 1;
    camera.position.y = 3;
    camera.position.z = 0;

    scene.add(camera);

    const ambientLight = new THREE.AmbientLight('#fff', 0.5);
    const driectionLight = new THREE.DirectionalLight('#fff', 1);
    driectionLight.position.x = 1;
    driectionLight.position.z = 2;
    scene.add(ambientLight);
    scene.add(driectionLight);

    // GridHelper
    const gridHelper = new THREE.GridHelper(4, 4, 'red', 'blue');
    scene.add(gridHelper);

    // AxesHelper
    const acesHelper = new THREE.AxesHelper(2);

    scene.add(acesHelper);

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 'seagreen',
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = -2;
    mesh.position.z = -2;
    scene.add(mesh);

    camera.lookAt(mesh.position);

    // 그리기
    const clock = new THREE.Clock();

    function draw() {
        const time = clock.getElapsedTime();

        mesh.rotation.y = time;

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
