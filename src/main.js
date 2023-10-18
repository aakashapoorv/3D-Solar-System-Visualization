import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls, clock;
let sun, earth, moon;
let earthOrbit, moonOrbit;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let rotateEarth = true;
let rotateMoon = true;
let rotateSun = true;

let guiControls = {
    rotateSun: true,
    rotateEarth: true,
    rotateMoon: true,
};

let gui;

function initGUI() {
    gui = new dat.GUI();
    
    gui.add(guiControls, 'rotateSun').name('Rotate Sun').onChange((value) => {
        rotateSun = value;
    });
    
    gui.add(guiControls, 'rotateEarth').name('Rotate Earth').onChange((value) => {
        rotateEarth = value;
    });

    gui.add(guiControls, 'rotateMoon').name('Rotate Moon').onChange((value) => {
        rotateMoon = value;
    });
}

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
    createOrbits();
    initGUI();

    window.addEventListener('resize', onWindowResize, false);
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

function createOrbits() {
    // Create the Earth orbit using RingGeometry
    const earthOrbitGeometry = new THREE.RingGeometry(14.95, 15, 100);
    earthOrbit = new THREE.Mesh(earthOrbitGeometry, new THREE.MeshBasicMaterial({ color: 'cyan', side: THREE.DoubleSide }));
    earthOrbit.rotation.x = Math.PI / 2;
    scene.add(earthOrbit);

    // Create the Moon orbit using RingGeometry
    const moonOrbitGeometry = new THREE.RingGeometry(2.95, 3, 100);
    moonOrbit = new THREE.Mesh(moonOrbitGeometry, new THREE.MeshBasicMaterial({ color: 'cyan', side: THREE.DoubleSide }));
    moonOrbit.rotation.x = Math.PI / 2;
    earth.add(moonOrbit);  // Add the moon orbit as a child of the earth
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (rotateEarth) {
        earth.rotation.y += -0.01;
        const earthOrbitSpeed = -0.01;
        earth.position.x = 15 * Math.cos(clock.getElapsedTime() * earthOrbitSpeed);
        earth.position.z = 15 * Math.sin(clock.getElapsedTime() * earthOrbitSpeed);
    }

    if (rotateMoon) {
        moon.rotation.y += -0.02;
        const moonOrbitSpeed = -0.03;
        const moonOrbitRadius = 3;
        moon.position.x = earth.position.x + moonOrbitRadius * Math.cos(clock.getElapsedTime() * moonOrbitSpeed);
        moon.position.z = earth.position.z + moonOrbitRadius * Math.sin(clock.getElapsedTime() * moonOrbitSpeed);
    }

    if (rotateSun) {
        sun.rotation.y += 0.001;
    }

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('click', onDocumentMouseDown, false);

function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([earth, moon, sun]);
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        if (clickedObject === earth) {
            rotateEarth = !rotateEarth;
        } else if (clickedObject === moon) {
            rotateMoon = !rotateMoon;
        } else if (clickedObject === sun) {
            rotateSun = !rotateSun;
        }
    }
}

init();
animate();

