import { cm1, cm2, geo, mat } from './common.js';
import { Mesh } from 'three';

export class SideLight {
    constructor(info) {
        this.name = info.name || '';
        this.x = info.x || 0;
        this.y = info.y || 0;
        this.z = info.z || 0;

        this.geometry = geo.sideLight;
        this.material = mat.sideLight;

        const container = info.container || cm1.scene;

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.position.set(this.x, this.y, this.z);

        container.add(this.mesh);
    }

    turnOff() {
        this.mesh.material.color.set(cm2.lightOffColor);
    }
}
