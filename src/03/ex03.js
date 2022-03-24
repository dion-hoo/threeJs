import * as THREE from 'three';
import dat from 'dat.gui';

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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.y = 1;
    camera.position.z = 8;

    scene.add(camera);

    const ambientLight = new THREE.AmbientLight('#fff', 0.5);
    const driectionLight = new THREE.DirectionalLight('#fff', 1);
    driectionLight.position.x = 1;
    driectionLight.position.z = 2;
    scene.add(ambientLight);
    scene.add(driectionLight);

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 'seagreen',
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.z = 2;
    scene.add(mesh);

    // Dat GUI
    const gui = new dat.GUI();

    gui.add(mesh.position, 'y', 0, 5, 0.01).name('Y위치');
    gui.add(mesh.position, 'z').min(-10).max(3).step(1).name('위치 Z');
    gui.add(camera.position, 'x', -10, 10, 0.01).name('카메라x');

    camera.lookAt(mesh.position);

    // 그리기
    const clock = new THREE.Clock();

    function draw() {
        const time = clock.getElapsedTime();

        camera.lookAt(mesh.position);

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
