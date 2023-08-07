import { Scene, BoxGeometry, MeshPhongMaterial, SphereGeometry } from 'three';

export const cm1 = {
    canvas: document.querySelector('#three-canvas'),
    scene: new Scene(),
};

export const cm2 = {
    backgroundColor: '#3e1322',
    lightColor: '#ffe9ac',
    pillarColor: '#071d28',
    floorColor: '#111',
    barColor: '#441c1d',
    glassColor: '9fdfff',
};

export const geo = {
    pillar: new BoxGeometry(5, 10, 5),
    floor: new BoxGeometry(200, 1, 200),
    bar: new BoxGeometry(0.1, 0.3, 1.2 * 21),
    sideLight: new SphereGeometry(0.1, 6, 6),
    glass: new BoxGeometry(1.2, 0.05, 1.2),
};

export const mat = {
    pillar: new MeshPhongMaterial({ color: cm2.pillarColor }),
    floor: new MeshPhongMaterial({ color: cm2.floorColor }),
    bar: new MeshPhongMaterial({ color: cm2.barColor }),
    sideLight: new MeshPhongMaterial({ color: cm2.lightColor }),
    glass1: new MeshPhongMaterial({
        color: cm2.glassColor,
        transparent: true,
        opacity: 0.1,
    }),
    glass2: new MeshPhongMaterial({
        color: cm2.glassColor,
        transparent: true,
        opacity: 1,
    }),
};