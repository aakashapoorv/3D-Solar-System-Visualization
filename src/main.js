import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls, clock;
let sun, earth, moon;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    clock = new THREE.Clock();

    camera.position.set(0, 20, 30);
    camera.lookAt(0, 0, 0);

    createCelestialBodies();

}

function createCelestialBodies() {
    sun = new THREE.Mesh(
        new THREE.SphereGeometry(5, 32, 32),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/sun.jpg') })
    );
    scene.add(sun);

    earth = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 32, 32),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/earth.png') })
    );
    earth.position.set(15, 0, 0);
    scene.add(earth);

    moon = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 32, 32),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/moon.png') })
    );
    moon.position.set(18, 0, 0);
    scene.add(moon);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

init();
animate();
