import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const gltfLoader = new GLTFLoader();

export class House {
    constructor(info) {
        this.x = info.x;
        this.z = info.z;

        this.height = info.height || 2;

        gltfLoader.load(info.modelSrc, (glb) => {
            this.mesh = glb.scene.children[0];
            this.mesh.position.set(this.x, this.height / 2, this.z);
            this.mesh.castShadow = true;
            info.scene.add(this.mesh);
        });
    }
}
