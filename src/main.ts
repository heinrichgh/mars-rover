import * as THREE from 'three';


import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import InputParser from "./input-parser";
import Grid from "./grid";


///////////////////////////////
const inputText = `5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`;
const parser = new InputParser();
const parsed = parser.parse(inputText);
//////////////////////////////////////////

var objectMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0.5, metalness: 1.0 } );
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.createElement( 'canvas' );
const context = canvas.getContext( 'webgl2', { alpha: false } );
const renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
renderer.outputEncoding = THREE.sRGBEncoding;


let sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
let light1 = new THREE.PointLight( 0xffffff, 2, 50 );
light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
light1.position.x = 0;
light1.position.y = 0;
light1.position.z = 4;

scene.add( light1 );

var loader = new GLTFLoader();

let mixer : THREE.AnimationMixer;

loader.load( 'dist/buster-drone/scene.gltf', function ( gltf ) {

    gltf.scene.scale.set(0.01, 0.01, 0.01);
    gltf.scene.position.set(2, 2, 2)
    gltf.scene.rotateX(Math.PI / 4);
    scene.add( gltf.scene );

    console.dir(gltf.animations);
    mixer = new THREE.AnimationMixer( gltf.scene );

    let action = mixer.clipAction( gltf.animations[ 0 ] );
    action.play();

}, undefined, function ( error ) {

    console.error( error );

} );

// const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
const cube = new THREE.Mesh( geometry, objectMaterial );
scene.add( cube );
cube.position.x = 5 + 0.5;
cube.position.y = 5 + 0.5;

const planeSize = {
    width: parsed.grid.width + 1,
    height: parsed.grid.height + 1
};

const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSize.width, planeSize.height), new THREE.MeshBasicMaterial({color: 0xff0000}));
plane.position.x = planeSize.width / 2.0;
plane.position.y = planeSize.height / 2.0;

scene.add(plane);

// camera.position.z = Math.ceil((planeSize.width + planeSize.height) / 2.0);
// camera.position.y = Math.floor((planeSize.width + planeSize.height) / -2.0);
// camera.position.x = plane.position.x;
camera.position.set(2, 2, 5);
camera.lookAt(2, 2, 0);
// camera.lookAt(plane.position.x, plane.position.y, 0);



const grid = new Grid(parsed.grid.width, parsed.grid.height);

let cubes : THREE.Mesh[] = [];

for (let rover of parsed.rovers) {
    grid.placeRover(rover.position, rover.direction, rover.commands);

    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, objectMaterial );
    cube.position.x = rover.position.x + 0.5;
    cube.position.y = rover.position.y + 0.5;

    cubes.push(cube);
    scene.add( cube );
}

////////////////////////////////////////////////////////////////////

function Render() {
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render( scene, camera );
}

let stepCounter = 0;
function Update(step: number) {
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    if (mixer) {
        mixer.update(step);
    }

    const placedRovers = grid.getPlacedRovers();

    for (let i = 0; i < placedRovers.length; i++) {
        cubes[i].position.x = placedRovers[i].rover.position.x + 0.5;
        cubes[i].position.y = placedRovers[i].rover.position.y + 0.5;
    }


    if (stepCounter === 60) {
        stepCounter = 0;
        grid.next();
    }
    stepCounter += 1;
}

let last : number;
let dt = 0;
let step = 1/60;

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
