export class Stuff {
    constructor(info = {}) {
        this.name = info.name || '';
        this.x = info.x || 0;
        this.y = info.y || 0;
        this.z = info.z || 0;

        this.rotationX = info.ratationX || 0;
        this.rotationY = info.ratationY || 0;
        this.rotationZ = info.ratationZ || 0;
    }
}
