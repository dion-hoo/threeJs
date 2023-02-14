import * as THREE from 'three';

export const example = () => {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(devicePixelRatio > 1 ? 2 : 1);

    document.body.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // 직교 카메라
    const camera = new THREE.OrthographicCamera(
        -innerWidth / innerHeight,
        innerWidth / innerHeight,
        1,
        -1,
        0.1,
        1000
    );

    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 15;

    camera.lookAt(0, 0, 0);
    camera.zoom = 0.4;
    camera.updateProjectionMatrix();

    scene.add(camera);

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
        color: 'red',
    });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    // draw
    renderer.render(scene, camera);

    const setSize = () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(innerWidth, innerHeight);
        renderer.render(scene, camera);
    };

    window.addEventListener('resize', setSize);
};

export default example;
