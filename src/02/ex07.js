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
    scene.fog = new THREE.Fog('#000', 3, 7);

    // 직교 카메라
    const camera = new THREE.OrthographicCamera(
        -innerWidth / innerHeight,
        innerWidth / innerHeight,
        1,
        -1,
        0.1,
        1000
    );

    camera.position.y = 1;
    camera.position.z = 5;

    camera.lookAt(0, 0, 0);
    camera.zoom = 0.4;
    camera.updateProjectionMatrix();

    scene.add(camera);

    const light = new THREE.DirectionalLight('#fff', 0.9);
    light.position.x = 1;
    light.position.y = 3;
    light.position.z = 5;
    scene.add(light);

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 'red',
    });

    const meshes = [];
    let mesh;
    for (let i = 0; i < 10; i++) {
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 5 - 2.5;
        mesh.position.z = Math.random() * 5 - 2.5;
        scene.add(mesh);

        meshes.push(mesh);
    }

    scene.add(meshes);

    // draw
    let oldTime = Date.now();

    function draw() {
        const newTime = Date.now();
        const deltaTme = newTime - oldTime;

        oldTime = newTime;

        for (let mesh of meshes) {
            mesh.rotation.y += deltaTme * 0.001;
        }

        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
    }

    const setSize = () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(innerWidth, innerHeight);
        renderer.render(scene, camera);
    };

    window.addEventListener('resize', setSize);

    draw();
};

export default example;
