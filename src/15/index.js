import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

const App = () => {
    // renderer
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
    });

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // scene
    const scene = new THREE.Scene();

    // camera
    const camera = new THREE.PerspectiveCamera(
        75,
        innerWidth / innerHeight,
        1,
        1000
    );
    camera.position.set(2, 3, 10);

    scene.add(camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.dampingFactor = 0.03;
    controls.enableDamping = true;

    // Light
    const ambientLight = new THREE.AmbientLight('white', 0.5);
    scene.add(ambientLight);

    const directionLight = new THREE.DirectionalLight('white', 0.5);
    const directionLightHelper = new THREE.DirectionalLightHelper(
        directionLight,
        5,
        'red'
    );
    directionLight.position.set(4, 5, 0);
    directionLight.castShadow = true;
    scene.add(directionLight, directionLightHelper);

    // ======================================================================================================================== //

    // Controls (물리 엔진)
    const cannonWorld = new CANNON.World();
    cannonWorld.gravity.set(0, -10, 0);

    const defaultMaterial = new CANNON.Material('default');
    const rubberMaterial = new CANNON.Material('rubber');
    const ironMaterial = new CANNON.Material('iron');
    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
            friction: 0.2,
            restitution: 0,
        }
    );
    const rubberDefaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        rubberMaterial,
        {
            friction: 0.5,
            restitution: 0.3,
        }
    );

    const ifronDefaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
            friction: 0.5,
            restitution: 0,
        }
    );

    cannonWorld.defaultContactMaterial = defaultContactMaterial;
    cannonWorld.addContactMaterial(rubberDefaultContactMaterial);
    cannonWorld.addContactMaterial(ifronDefaultContactMaterial);

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

    const boxShape = new CANNON.Sphere(1);
    const boxBody = new CANNON.Body({
        mass: 30,
        position: new CANNON.Vec3(0, 4, 0),
        shape: boxShape,
        material: rubberMaterial,
    });
    console.log(boxBody);
    cannonWorld.addBody(boxBody);

    // ======================================================================================================================== //

    // Plane
    const floorMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
            color: 'slategray',
        })
    );

    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Draw
    const clock = new THREE.Clock();
    const draw = () => {
        const delta = clock.getElapsedTime();

        let cannonStepTime = 1 / 60;
        if (delta < 0.01) {
            cannonStepTime = 1 / 120;
        }
        cannonWorld.step(cannonStepTime, delta, 3);

        if (modelMesh) {
            modelMesh.position.copy(boxBody.position);
            modelMesh.quaternion.copy(boxBody.quaternion);
        }

        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);

        controls.update();
    };

    const resize = () => {
        window.addEventListener('resize', () => {
            // camera
            camera.aspect = innerWidth / innerHeight;
            camera.updateProjectionMatrix();

            // renderer
            renderer.setSize(innerWidth, innerHeight);
            renderer.render(scene, camera);
        });
    };

    draw();
    resize();
};

export default App;
