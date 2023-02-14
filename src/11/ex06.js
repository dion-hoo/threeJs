import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { PreventDragClick } from '../../utils/PreventDragClick.js';
import { MySphere } from './MySphere.js';


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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 6;
    camera.position.z = 10;
    scene.add(camera);

    // Light
    const ambientLight = new THREE.AmbientLight('#fff', 0.5);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight('#fff', 0.5);

    light.position.x = 2;
    light.position.y = 3;
    light.position.z =3;
    light.castShadow = true;

    scene.add(light);

    // Controls
    new OrbitControls(camera, renderer.domElement);


    ////////////////////////////////////////////////////////////////////////////////////////

    // Cannon (물리 엔진)
    const cannonWorld = new CANNON.World();
    const defaultMaterial = new CANNON.Material("default");
    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial, {
            friction: 0.2,
            restitution : 0.4 // 반발력
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
        material: defaultMaterial
    });

    floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(-1, 0, 0),
        Math.PI / 2
    )
    cannonWorld.addBody(floorBody);

    // 성능
    cannonWorld.allowSleep = true; 
    cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);


    // Mesh
    const planeGeometry = new THREE.PlaneGeometry(6, 6);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 'white' });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    planeMesh.receiveShadow = true;
    planeMesh.rotation.x = -Math.PI / 2;

    const sphereGeometry = new THREE.SphereGeometry(0.5);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: '#1c9' });
    const spheres = [];

    scene.add(planeMesh);




    // 그리기
    const clock = new THREE.Clock();

    function draw() {
        const delta = clock.getDelta();

        let cannonStepTime = delta < 0.01 ? 1 / 120 : 1 / 60;

        cannonWorld.step(cannonStepTime, delta, 3);
        spheres.forEach(s => {
            s.mesh.position.copy(s.cannonBody.position);
            s.mesh.quaternion.copy(s.cannonBody.quaternion);
        })

        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
    }

    function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    function collide() {
        
    }



    // 이벤트
    window.addEventListener('resize', setSize);
    canvas.addEventListener('click', () => {
        const mySphere = new MySphere({
            scene,
            cannonWorld,
            geometry : sphereGeometry,
            material: sphereMaterial,
            x: (Math.random() - 0.5) * 2,
            y: Math.random() * 3 + 2,
            z: (Math.random() - 0.5) * 2,
            scale: Math.random() + 0.2
        });

        spheres.push(mySphere);

        mySphere.cannonBody.addEventListener('collide', collide);
    });

    const preventDragClick = new PreventDragClick(canvas);
    const btn = document.createElement('button');
    btn.style.cssText = "position : absolute;top:20px;left:20px; font-size:20px;"
    btn.innerHTML = "Delete";
    document.body.append(btn);

    btn.addEventListener('click', () => {
        spheres.forEach(s => {
            s.cannonBody.removeEventListener('collide', collide);
            cannonWorld.removeBody(s.cannonBody);
            scene.remove(s.mesh);
        })
    });

    draw();
}
