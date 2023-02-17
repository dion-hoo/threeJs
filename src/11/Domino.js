import { Body, Box, Vec3 } from 'cannon-es';

export class Domino {
    constructor({ index, scene, cannonWorld, gltfLoader, z }) {
        this.index = index;
        this.scene = scene;
        this.cannonWorld = cannonWorld;
        this.z = z;

        this.width = 0.6;
        this.height = 1;
        this.depth = 0.2;

        this.x = 0;
        this.y = 0.5;
        this.z = z;

        this.rotationY = 0;
        this.gltfLoader = gltfLoader;

        this.init();
    }

    init() {
        this.gltfLoader.load('./models/domino.glb', (glb) => {
            this.modelMesh = glb.scene.children[0];
            this.modelMesh.castShadow = true;
            this.modelMesh.name = `DOMINO${this.index}`;
            this.modelMesh.position.set(this.x, this.y, this.z);
            this.scene.add(this.modelMesh);

            this.setCannonBody();
        });
    }

    setCannonBody() {
        const shape = new Box(
            new Vec3(this.width / 2, this.height / 2, this.depth / 2)
        );

        this.cannonBody = new Body({
            mass: 1,
            position: new Vec3(this.x, this.y, this.z),
            shape,
        });

        this.cannonBody.quaternion.setFromAxisAngle(
            new Vec3(0, 1, 0), // y축
            this.rotationY
        );
        this.modelMesh.cannonBody = this.cannonBody;
        this.cannonWorld.addBody(this.cannonBody);
    }
}
