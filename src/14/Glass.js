import { Stuff } from './Stuff.js';
import { cm1, geo, mat } from './common.js';
import { Mesh } from 'three';

export class Glass extends Stuff {
    constructor(info) {
        super(info);

        this.type = info.type;

        this.geometry = geo.glass;
        this.material = this.type === 'normal' ? mat.glass1 : mat.glass2;

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        cm1.scene.add(this.mesh);
    }
}
