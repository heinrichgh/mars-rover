import * as THREE from 'three';

import InputParser from "./input-parser";
import Grid from "./grid";
import Direction from "./direction";

// TODO:
// Mini-map
// Input + run
// Camera zoom out at the end?
// Use nicer model instead of blocks
// REFACTOR THIS FILE!

///////////////////////////////
const inputText = `5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`;
// const inputText = `100 100
// 1 2 N
// RRRR
// 3 3 E
// LLLL
// 60 80 S
// RLRL
// 62 82 S
// RRLLRRLL`;
const parser = new InputParser();
const parsed = parser.parse(inputText);
//////////////////////////////////////////

const cubeMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.5, metalness: 1.0});
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xff0000, roughness: 0.5, metalness: 1.0});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.createElement('canvas');
const context = canvas.getContext('webgl2', {alpha: false});
const renderer = new THREE.WebGLRenderer({canvas: canvas, context: context, antialias: true});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// let sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
// let light1 = new THREE.PointLight( 0xffffff );
// light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffff40 } ) ) );
// light1.position.x = 0;
// light1.position.y = 0;
// light1.position.z = 2.5;
// light1.castShadow = true;
// scene.add( light1 );

let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.x = -1;
directionalLight.position.y = 2;
directionalLight.position.z = -1;
directionalLight.castShadow = true;
scene.add(directionalLight);


// var loader = new GLTFLoader();
//
// let mixer : THREE.AnimationMixer;
//
// loader.load( 'dist/buster-drone/scene.gltf', function ( gltf ) {
//
//     const scaleFactor = 0.007;
//     gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
//     // gltf.scene.
//     gltf.scene.position.set(0.5, 0.5, 0.7)
//     gltf.scene.rotateX(Math.PI / 2.0);
//     scene.add( gltf.scene );
//
//     // gltf.scene.traverse( function ( object ) {
//     //
//     //     if ( object instanceof THREE.Mesh ) {
//     //
//     //         object.castShadow = true;
//     //
//     //     }
//     //
//     // } );
//
//     console.dir(gltf.animations);
//     mixer = new THREE.AnimationMixer( gltf.scene );
//
//     let action = mixer.clipAction( gltf.animations[ 0 ] );
//
//     action.play();
//
// }, undefined, function ( error ) {
//
//     console.error( error );
//
// } );

// const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 0.5, 1);

const planeSize = {
    width: parsed.grid.width + 1,
    height: parsed.grid.height + 1
};

const maxEdge = Math.max(planeSize.width, planeSize.height);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSize.width, planeSize.height), planeMaterial);
plane.receiveShadow = true;
plane.rotateX(Math.PI / -2.0);
plane.position.x = planeSize.width / 2.0;
plane.position.z = planeSize.height / -2.0;

const gridHelper = new THREE.GridHelper(maxEdge, maxEdge);
gridHelper.position.x = planeSize.width / 2.0;
gridHelper.position.z = planeSize.height / -2.0;
// gridHelper.rotateX(Math.PI / 2.0);
scene.add(gridHelper);

scene.add(plane);

// camera.position.z = Math.ceil((planeSize.width + planeSize.height) / 2.0);
// camera.position.y = Math.floor((planeSize.width + planeSize.height) / -2.0);
// camera.position.x = plane.position.x;
camera.position.set(2, 2, 2);
camera.lookAt(2, 0, -2);
// camera.lookAt(plane.position.x, plane.position.y, 0);


const grid = new Grid(parsed.grid.width, parsed.grid.height);

let cubes: THREE.Mesh[] = [];

for (let rover of parsed.rovers) {
    grid.placeRover(rover.position, rover.direction, rover.commands);

    const cube = new THREE.Mesh(geometry, cubeMaterial);
    let sphere = new THREE.SphereBufferGeometry(0.1, 16, 8);
    let sphereMesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xffff40}));
    sphereMesh.position.set(0, 0.25, -0.4);

    cube.add(sphereMesh);

    cube.position.x = rover.position.x + 0.5;
    cube.position.y = 0.25;
    cube.position.z = -1 * (rover.position.y + 0.5);
    cube.castShadow = true;

    console.log(cube.rotation);
    switch (rover.direction) {
        case Direction.North:
            cube.rotation.set(0, 0, 0);
            break;
        case Direction.East:
            // cube.rotateY(Math.PI / -2.0);
            cube.rotation.set(0, 3 * Math.PI / 2.0, 0);
            break;
        case Direction.South:
            // cube.rotateY(Math.PI);
            cube.rotation.set(0, Math.PI, 0);
            break;
        case Direction.West:
            // cube.rotateY(Math.PI / 2.0);
            cube.rotation.set(0, Math.PI / 2.0, 0);
            break;
    }
    console.log(cube.rotation);

    cubes.push(cube);
    scene.add(cube);
}

////////////////////////////////////////////////////////////////////

function Render() {
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

let stepCounter = 0;

function Update(step: number) {
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    // if (mixer) {
    //     mixer.update(step);
    // }
// return;
    if (stepCounter % 60 === 0) {
        console.log(grid.next());
    }
    stepCounter = (stepCounter + 1) % 60;

    const placedRovers = grid.getPlacedRovers();

    for (let i = 0; i < placedRovers.length; i++) {
        // if this cube moved, camera should follow
        const targetX = placedRovers[i].rover.position.x + 0.5;
        const targetZ = -1 * (placedRovers[i].rover.position.y + 0.5);

        let directionX = 1;
        if (targetX < cubes[i].position.x) {
            directionX = -1;
        }
        let directionZ = 1;
        if (targetZ < cubes[i].position.z) {
            directionZ = -1;
        }

        if (Math.abs(targetX - cubes[i].position.x) > 0.01) {
            cubes[i].position.x += directionX * step;
            camera.position.set(cubes[i].position.x, 4, cubes[i].position.z + 4);
            camera.lookAt(cubes[i].position.x, 0, cubes[i].position.z);
        } else {
            cubes[i].position.x = targetX;
        }

        if (Math.abs(targetZ - cubes[i].position.z) > 0.01) {
            cubes[i].position.z += directionZ * step;
            camera.position.set(cubes[i].position.x, 4, cubes[i].position.z + 4);
            camera.lookAt(cubes[i].position.x, 0, cubes[i].position.z);
        } else {
            cubes[i].position.z = targetZ;
        }

        // rotation animation
        let direction = 1;
        let targetRotation = 0;
        let finalRotation = 0;

        switch (placedRovers[i].rover.direction) {
            case Direction.North:
                if (cubes[i].rotation.y >= 3 * Math.PI / 2.0) {
                    direction = 1;
                    targetRotation = 2 * Math.PI;
                } else {
                    direction = -1;
                    targetRotation = 0;
                }
                finalRotation = 0;
                break;
            case Direction.East:
                if (cubes[i].rotation.y <= 0) {
                    direction = -1;
                    targetRotation = Math.PI / -2.0;
                } else {
                    direction = 1;
                    targetRotation = 3 * Math.PI / 2.0;
                }
                finalRotation = 3 * Math.PI / 2.0;
                break;
            case Direction.South:
                finalRotation = targetRotation = Math.PI;
                if (cubes[i].rotation.y < targetRotation) {
                    direction = 1;
                } else {
                    direction = -1;
                }
                break;
            case Direction.West:
                finalRotation = targetRotation = Math.PI / 2.0;
                if (cubes[i].rotation.y < targetRotation) {
                    direction = 1;
                } else {
                    direction = -1;
                }
                break;
        }

        if (Math.abs(cubes[i].rotation.y - targetRotation) > 0.001 && Math.abs(cubes[i].rotation.y - finalRotation) > 0.001) {
            const rotationSize = 90 * step * direction;
            const newRotationDeg = THREE.MathUtils.radToDeg(cubes[i].rotation.y) + rotationSize;
            const newRotationRad = THREE.MathUtils.degToRad(newRotationDeg);
            cubes[i].rotation.set(0, newRotationRad, 0);

            camera.position.set(cubes[i].position.x, 4, cubes[i].position.z+4);
            camera.lookAt(cubes[i].position.x, 0, cubes[i].position.z);
        }
        if (Math.abs(cubes[i].rotation.y - targetRotation) < 0.001 || Math.abs(cubes[i].rotation.y - finalRotation) < 0.001) {
            cubes[i].rotation.y = finalRotation;
        }

    }
}

let last: number;
let dt = 0;
let step = 1 / 60.0;

function frame(now: number) {
    if (!last) last = now;

    dt = Math.min((now - last) / 1000);

    while (dt > step) {
        dt = dt - step;
        Update(step);
    }
    Render();
    last = now;
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
