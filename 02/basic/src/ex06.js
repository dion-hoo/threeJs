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
    const camera = new THREE.OrthographicCamera(-innerWidth / innerHeight, innerWidth / innerHeight, 1, -1, 0.1, 1000);

    camera.position.x = 0;
    camera.position.y = 1;
    camera.position.z = 5;

    camera.lookAt(0, 0, 0);
    camera.zoom = 0.4;
    camera.updateProjectionMatrix();

    scene.add(camera);

    const light = new THREE.DirectionalLight('#fff', 0.9);
    light.position.x = 2;
    light.position.z = 4;
    scene.add(light);

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 'red',
    });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    // draw

    const clock = new THREE.Clock();

    function draw() {
        // mesh.rotation.y += 0.1;
        const time = clock.getDelta();

        mesh.rotation.y = time;
        mesh.position.y += 0.01;

        if (mesh.position.y > 3) {
            mesh.position.y = 0;
        }
        renderer.render(scene, camera);

        renderer.setAnimationLoop(draw);
        //requestAnimationFrame(draw);
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
