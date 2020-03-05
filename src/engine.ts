import * as THREE from "three";
import {Object3D, Scene} from "three";
import {Mesh} from "three";
import Grid from "./grid";
import Direction from "./direction";
import {ParsedInput} from "./input-parser";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

enum GameState {
    Run,
    Pause,
    Stop
}

const debug = false;

const cubeMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.5, metalness: 1.0});
// const planeMaterial = new THREE.MeshStandardMaterial({color: 0xff0000, roughness: 0.5, metalness: 1.0});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const geometry = new THREE.BoxGeometry(1, 0.5, 1);

let texLoader = new THREE.TextureLoader()
    .setPath( 'dist/graniterockface1-bl/' );

let planeMaterial : THREE.MeshStandardMaterial;

if (debug) {
    planeMaterial = new THREE.MeshStandardMaterial({color: 0xff0000, roughness: 0.5, metalness: 1.0});
} else {
    planeMaterial = new THREE.MeshStandardMaterial();
    planeMaterial.roughness = 1; // attenuates roughnessMap
    planeMaterial.metalness = 1; // attenuates metalnessMap

    let diffuseMap = texLoader.load('graniterockface1_Base_Color.png');
    diffuseMap.encoding = THREE.sRGBEncoding;
    planeMaterial.map = diffuseMap;
// roughness is in G channel, metalness is in B channel
    planeMaterial.metalnessMap = texLoader.load('graniterockface1_Metallic.png');
    planeMaterial.roughnessMap = texLoader.load('graniterockface1_Roughness.png');
    planeMaterial.normalMap = texLoader.load('graniterockface1_Normal.png');

// planeMaterial.map.wrapS = THREE.RepeatWrapping;
    planeMaterial.map.wrapS = planeMaterial.map.wrapT = THREE.RepeatWrapping;
    planeMaterial.roughnessMap.wrapS = planeMaterial.roughnessMap.wrapT = THREE.RepeatWrapping;
    planeMaterial.metalnessMap.wrapS = planeMaterial.metalnessMap.wrapT = THREE.RepeatWrapping;
    planeMaterial.normalMap.wrapS = planeMaterial.normalMap.wrapT = THREE.RepeatWrapping;
}

let wallE = new THREE.Scene();
const loader = new GLTFLoader();

loader.load( 'dist/walle/scene.gltf', function ( gltf ) {

    // const scaleFactor = 1;
    // gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
    gltf.scene.position.y = 0.55;
    gltf.scene.rotateY(Math.PI);
    // scene.add( gltf.scene );

    gltf.scene.traverse( function ( object ) {

        if ( object instanceof THREE.Mesh ) {
            object.castShadow = true;
        }
    } );

    wallE.add(gltf.scene);
}, undefined, function ( error ) {
    console.error( error );
} );

class Engine {

    readonly renderer: THREE.WebGLRenderer;
    stepCounter = 0;
    cubes: Scene[] = [];
    // cubes: THREE.Mesh[] = [];
    grid: Grid;
    gameState = GameState.Stop;

    constructor() {
        const canvas = <HTMLCanvasElement> document.getElementById('main-render-canvas') ;
        const context = canvas.getContext('webgl2', {alpha: false});
        this.renderer = new THREE.WebGLRenderer({canvas: canvas, context: context, antialias: true});
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        camera.position.set(0, 50, 0);
        camera.lookAt(0, 0, 0);
    }

    init(parsed: ParsedInput) {
        this.clearScene();

        this.stepCounter = 0;
        this.cubes = [];
        this.grid = new Grid(parsed.grid.width, parsed.grid.height);
        if (!debug) {
            planeMaterial.map.repeat.set(parsed.grid.width / 5, parsed.grid.height / 5);
        }

        const light = new THREE.AmbientLight( 0x404040 ); // soft white light
        scene.add( light );
        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.x = -1;
        directionalLight.position.y = 2;
        directionalLight.position.z = -1;
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        directionalLight.shadow.mapSize.width = 1024;  // default
        directionalLight.shadow.mapSize.height = 1024; // default
        const d = 10;

        directionalLight.shadow.camera.left = - d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = - d;

        // directionalLight.shadow.camera.near = 0.5;    // default
        // directionalLight.shadow.camera.far = 0;     // default


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
        gridHelper.position.x = maxEdge / 2.0;
        gridHelper.position.z = maxEdge / -2.0;

        scene.add(gridHelper);
        scene.add(plane);


        for (let rover of parsed.rovers) {
            this.grid.placeRover(rover.position, rover.direction, rover.commands);

            let cube : THREE.Scene;
            if (debug) {
                cube = new THREE.Scene().add(new THREE.Mesh(geometry, cubeMaterial));
                let sphere = new THREE.SphereBufferGeometry(0.1, 16, 8);
                let sphereMesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xffff40}));
                sphereMesh.position.set(0, 0.25, -0.4);
                cube.castShadow = true;
                cube.add(sphereMesh);
            } else {
                cube = wallE.clone();
            }

            cube.position.x = rover.position.x + 0.5;
            cube.position.z = -1 * (rover.position.y + 0.5);

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

            this.cubes.push(cube);
            scene.add(cube);
        }

        this.gameState = GameState.Pause;
    }

    stop() {
        this.clearScene();
        this.gameState = GameState.Stop;
    }

    togglePause() {
        if (this.gameState === GameState.Run) {
            this.gameState = GameState.Pause;
            return true;
        } else if (this.gameState === GameState.Pause) {
            this.gameState = GameState.Run;
        }

        return false;
    }

    render() {
        this.renderer.render(scene, camera);
    }

    update(step: number) {
        if (this.gameState === GameState.Stop || this.gameState === GameState.Pause) {
            return;
        }

        if (this.stepCounter % 60 === 0) {
            this.grid.next();
        }
        this.stepCounter = (this.stepCounter + 1) % 60;

        const placedRovers = this.grid.getPlacedRovers();

        for (let i = 0; i < placedRovers.length; i++) {
            const cube = this.cubes[i];
            // if this cube moved, camera should follow
            const targetX = placedRovers[i].rover.position.x + 0.5;
            const targetZ = -1 * (placedRovers[i].rover.position.y + 0.5);

            let directionX = 1;
            if (targetX < cube.position.x) {
                directionX = -1;
            }
            let directionZ = 1;
            if (targetZ < cube.position.z) {
                directionZ = -1;
            }

            let cameraHeight = 3;
            let cameraDistanceFromZ = 3;
            if (Math.abs(targetX - cube.position.x) > 0.01) {
                cube.position.x += directionX * step;
                camera.position.set(cube.position.x, cameraHeight, cube.position.z + cameraDistanceFromZ);
                camera.lookAt(cube.position.x, 0, cube.position.z);
            } else {
                cube.position.x = targetX;
            }

            if (Math.abs(targetZ - cube.position.z) > 0.01) {
                cube.position.z += directionZ * step;
                camera.position.set(cube.position.x, cameraHeight, cube.position.z + cameraDistanceFromZ);
                camera.lookAt(cube.position.x, 0, cube.position.z);
            } else {
                cube.position.z = targetZ;
            }

            // rotation animation
            let direction = 1;
            let targetRotation = 0;
            let finalRotation = 0;

            switch (placedRovers[i].rover.direction) {
                case Direction.North:
                    if (cube.rotation.y >= 3 * Math.PI / 2.0) {
                        direction = 1;
                        targetRotation = 2 * Math.PI;
                    } else {
                        direction = -1;
                        targetRotation = 0;
                    }
                    finalRotation = 0;
                    break;
                case Direction.East:
                    if (cube.rotation.y <= 0) {
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
                    if (cube.rotation.y < targetRotation) {
                        direction = 1;
                    } else {
                        direction = -1;
                    }
                    break;
                case Direction.West:
                    finalRotation = targetRotation = Math.PI / 2.0;
                    if (cube.rotation.y < targetRotation) {
                        direction = 1;
                    } else {
                        direction = -1;
                    }
                    break;
            }

            if (Math.abs(cube.rotation.y - targetRotation) > 0.001 && Math.abs(cube.rotation.y - finalRotation) > 0.001) {
                const rotationSize = 90 * step * direction;
                const newRotationDeg = THREE.MathUtils.radToDeg(cube.rotation.y) + rotationSize;
                const newRotationRad = THREE.MathUtils.degToRad(newRotationDeg);
                cube.rotation.set(0, newRotationRad, 0);

                camera.position.set(cube.position.x, cameraHeight, cube.position.z + cameraDistanceFromZ);
                camera.lookAt(cube.position.x, 0, cube.position.z);
            }
            if (Math.abs(cube.rotation.y - targetRotation) < 0.001 || Math.abs(cube.rotation.y - finalRotation) < 0.001) {
                cube.rotation.y = finalRotation;
            }

        }

        return placedRovers;
    }

    clearScene() {
        this.clearThree(scene);
    }

    private clearThree(obj : Object3D){
        while(obj.children.length > 0){
            this.clearThree(obj.children[0])
            obj.remove(obj.children[0]);
        }

        if (obj instanceof Mesh) {
            if (obj.geometry) obj.geometry.dispose();

            if (obj.material instanceof THREE.Material) {
                obj.material.dispose()
            }
        }
    }
}

export default Engine;