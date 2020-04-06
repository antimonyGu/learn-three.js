////////////////////////////////////////////////////////////////////////////////
// Flower exercise: make a flower
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document, window, dat*/
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import $ from "jquery";
import themes from './themes'
import { Coordinates as  CoordinateCreater } from './Coordinates';
const  Coordinates = new CoordinateCreater({}, themes.dark);
import * as dat from 'dat.gui';

var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var gridX = true;
var gridY = false;
var gridZ = false;
var axes = true;
var ground = true;

function fillScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x222222 );

	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -500, 250, -200 );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

	// FLOWER
	var petalMaterial = new THREE.MeshLambertMaterial( { color: 0xCC5920 } );
	var flowerHeight = 200;
	var petalLength = 120;
    const sphereRadius = 20;
    const cylinderRediusTop = 15;
	var cylGeom = new THREE.CylinderGeometry( cylinderRediusTop, 0, petalLength, 32 );
	var flower = new THREE.Object3D();

	/////////
	// YOUR CODE HERE
	// add code here to make 24 petals, radiating around the sphere
	// Just rotates and positions on the cylinder and petals are needed.
    // create 24 petals
    // 下面是标准答案的实现，我自己的实现十分繁琐复杂，因为对scale, rotate, translate的顺序和Object3D的使用还是没有完全掌握
	for ( var i = 0; i < 24 ; i++ ) {
        var cylinder = new THREE.Mesh( cylGeom, petalMaterial );
        cylinder.position.y = petalLength / 2;
        cylinder.scale.x = .25;
        // use the THREE.Object3D to reverse the order of translation and rotation
        var petal = new THREE.Object3D();
        petal.add( cylinder );
        petal.rotation.z = 70 * Math.PI/180;
        petal.rotation.y = 15*i * Math.PI/180;
        petal.position.y = flowerHeight;

        flower.add( petal );
    }

	// Rest of the flower
	var stamenMaterial = new THREE.MeshLambertMaterial( { color: 0x333310 } );
	var stamen = new THREE.Mesh(
		new THREE.SphereGeometry( sphereRadius, 32, 16 ), stamenMaterial );
	stamen.position.y = flowerHeight;	// move to flower center
	flower.add( stamen );

	var stemMaterial = new THREE.MeshLambertMaterial( { color: 0x339424 } );
	var stem = new THREE.Mesh(
		new THREE.CylinderGeometry( 10, 10, flowerHeight, 32 ), stemMaterial );
	stem.position.y = flowerHeight/2;	// move from ground to stamen
	flower.add( stem );

	scene.add( flower );

}


function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 38, canvasRatio, 1, 10000 );
	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	camera.position.set(-200, 400, 20);
	cameraControls.target.set(0,150,0);
	fillScene();

}

function addToDOM() {
	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function drawHelpers() {
	if (ground) {
		Coordinates.drawGround({size:10000});
	}
	if (gridX) {
		Coordinates.drawGrid({size:10000,scale:0.01});
	}
	if (gridY) {
		Coordinates.drawGrid({size:10000,scale:0.01, orientation:"y"});
	}
	if (gridZ) {
		Coordinates.drawGrid({size:10000,scale:0.01, orientation:"z"});
	}
	if (axes) {
		Coordinates.drawAllAxes({axisLength:200,axisRadius:1,axisTess:50});
	}
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);

	if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes)
	{
		gridX = effectController.newGridX;
		gridY = effectController.newGridY;
		gridZ = effectController.newGridZ;
		ground = effectController.newGround;
		axes = effectController.newAxes;

		fillScene();
		drawHelpers();
	}

	renderer.render(scene, camera);
}



function setupGui() {

	effectController = {

		newGridX: gridX,
		newGridY: gridY,
		newGridZ: gridZ,
		newGround: ground,
		newAxes: axes

	};

	var gui = new dat.GUI();
	var h = gui.addFolder("Grid display");
	h.add( effectController, "newGridX").name("Show XZ grid");
	h.add( effectController, "newGridY" ).name("Show YZ grid");
	h.add( effectController, "newGridZ" ).name("Show XY grid");
	h.add( effectController, "newGround" ).name("Show ground");
	h.add( effectController, "newAxes" ).name("Show axes");

}


// this is the main action sequence
try {
	init();
	fillScene();
	drawHelpers();
	addToDOM();
	setupGui();
	animate();
} catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}
