////////////////////////////////////////////////////////////////////////////////
// Add a reflection map
////////////////////////////////////////////////////////////////////////////////
/*global THREE, requestAnimationFrame */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TeapotBufferGeometry } from 'three/examples/jsm/geometries/TeapotBufferGeometry.js';
import $ from "jquery";
import themes from './themes'
import { Coordinates as  CoordinateCreater } from './Coordinates';
const  Coordinates = new CoordinateCreater({}, themes.dark);
import * as dat from 'dat.gui';

var txrpath = "/";	// STUDENT: set to "" to run on your computer, "/" for submitting code to Udacity

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();
var teapotSize = 400;

function fillScene() {
	scene = new THREE.Scene();

	// LIGHTS
	scene.add( new THREE.AmbientLight( 0x333333 ) );

	var light = new THREE.DirectionalLight( 0xFFFFFF, 0.9 );
	light.position.set( -1300, 700, 1240 );

	scene.add( light );

	light = new THREE.DirectionalLight( 0xFFFFFF, 0.7 );
	light.position.set( 1000, -500, -1200 );

	scene.add( light );

	// MATERIALS
    // debugger
	// var path =  "./cs291/textures/skybox/";
	// var urls = [path + "px.jpg", path + "nx.jpg",
	// 			path + "py.jpg", path + "ny.jpg",
	// 			path + "pz.jpg", path + "nz.jpg" ];
	// var textureCube = THREE.ImageUtils.loadTextureCube( urls ); // most likely the loadTextureCube has been deprecated

    var path =  "./cs291/textures/skybox/";
	var urls = ["px.jpg", "nx.jpg",
				"py.jpg", "ny.jpg",
				"pz.jpg", "nz.jpg" ];
	var textureCube = new THREE.CubeTextureLoader()
        .setPath(path)
        .load( urls );
	textureCube.format = THREE.RGBFormat;
	var teapotMaterial = new THREE.MeshPhongMaterial(
		{ color: 0x770000, specular:0xffaaaa, envMap: textureCube } );

	var teapot = new THREE.Mesh(
		new TeapotBufferGeometry( teapotSize,
			8, true, true, true, true, true ),
		teapotMaterial );

	scene.add( teapot );

    debugger
	var shader = THREE.ShaderLib.cube;
    // const isInstanceofShaderMaterial = shader instanceof THREE.ShaderMaterial;
    // const isInstanceofRawShaderMaterial = shader instanceof THREE.RawShaderMaterial;
    
	// shader.uniforms.tCube.value = textureCube; // this method to set environment box has been deprecated
	// new way to set env map correlated discuss link https://stackoverflow.com/questions/59454931/three-js-r111-three-shaderlib-cube-uniforms-tcube-to-envmap-issue
    shader.uniforms.envMap.value = textureCube;
	var skyMaterial = new THREE.ShaderMaterial( {
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	} );
	Object.defineProperty( skyMaterial, 'envMap', {
		get: function () {
			return this.uniforms.envMap.value;
		}
	} );

	var sky = new THREE.Mesh( new THREE.CubeGeometry( 5000, 5000, 5000 ), skyMaterial );
	scene.add( sky );
}

function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, canvasWidth/ canvasHeight, 100, 20000 );
	camera.position.set( -222, 494, 1746 );

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( canvasWidth, canvasHeight );
	renderer.setClearColor( 0xAAAAAA, 1.0 );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	// CONTROLS

	cameraControls = new OrbitControls( camera, renderer.domElement );
	cameraControls.target.set(0, -160, 0);

}

// EVENT HANDLERS

function addToDOM() {
	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update( delta );

	renderer.render( scene, camera );
}

// try {
	init();
	fillScene();
	addToDOM();
	animate();
// } catch(e) {
// 	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
// 	$('#container').append(errorReport+e);
// }
