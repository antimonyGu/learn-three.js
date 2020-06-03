////////////////////////////////////////////////////////////////////////////////
// Moving flashlight - make the flashlight move by changing the position in
// the fragment shader
////////////////////////////////////////////////////////////////////////////////
/*global THREE, requestAnimationFrame, Detector, dat */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import $ from "jquery";
import themes from './themes'
import { Coordinates as  CoordinateCreater } from './Coordinates';
const  Coordinates = new CoordinateCreater({}, themes.dark);
import * as dat from 'dat.gui';
import { TeapotBufferGeometry } from 'three/examples/jsm/geometries/TeapotBufferGeometry.js';
import vertexShader from './glsl-shader/flashlight-vertex.glsl';
import fragmentShader from './glsl-shader/flashlight-fragment.glsl';

var container, camera, scene, renderer;
var cameraControls;
var effectController;
var clock = new THREE.Clock();
var teapotSize = 600;
var tess = 7, newTess = tess;
var tessLevel = [2, 3, 4, 5, 6, 8, 10, 12, 16, 24, 32];
var maxTessLevel = tessLevel.length - 1;
var ambientLight, light;
var teapot;
var phongBalancedMaterial;
var phongBalancedGroundMaterial;
var flashlightOffset;

function init() {
	var canvasWidth = 846; 
	var canvasHeight = 494;
	var canvasRatio = canvasWidth / canvasHeight;

	// LIGHTS
	ambientLight = new THREE.AmbientLight(0x333333); // 0.2

	light = new THREE.DirectionalLight(0xffffff, 1.0);
	// direction is set by controller

	// RENDERER
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor(0xAAAAAA, 1.0);

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	// CAMERA
	camera = new THREE.PerspectiveCamera(45, canvasRatio, 0.01, 800);
	camera.position.set( 4.3, 8.9, 10.6 );

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0, 0.5, 0);

	// MATERIALS
	flashlightOffset = new THREE.Vector2();

	var materialColor = new THREE.Color();
	materialColor.setHSL(1.0, 0.8, 0.6);

	phongBalancedMaterial = createShaderMaterial("phongBalanced", light, ambientLight);
	phongBalancedMaterial.uniforms.uMaterialColor.value.copy(materialColor);
	phongBalancedMaterial.side = THREE.DoubleSide;

	phongBalancedGroundMaterial = createShaderMaterial("phongBalanced", light, ambientLight);
	phongBalancedGroundMaterial.side = THREE.DoubleSide;
	phongBalancedGroundMaterial.uniforms.shininess.value = 20;
	phongBalancedGroundMaterial.uniforms.uKd.value = 0.5;
	phongBalancedGroundMaterial.uniforms.uKs.value = 0.2;

    materialColor.setRGB(0, 1, 1);
	phongBalancedGroundMaterial.uniforms.uMaterialColor.value.copy(materialColor);
	phongBalancedGroundMaterial.uniforms.uSpecularColor.value.copy(materialColor);

}


function fillScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0x808080, 2000, 4000);

	scene.add(camera);

	scene.add(ambientLight);
	scene.add(light);

	var teapotSize = 1;
	var teapot = new THREE.Mesh(
		new TeapotBufferGeometry(teapotSize, 20, true, true, true, true), 
		phongBalancedMaterial);
	teapot.position.y += teapotSize;

	var solidGround = new THREE.Mesh(
		new THREE.PlaneGeometry( 100, 100, 1,1 ),
		phongBalancedGroundMaterial );
	solidGround.rotation.x = - Math.PI / 2;
	scene.add( solidGround );

	scene.add(teapot);
}

function loadShader(shadertype) {
	return document.getElementById(shadertype).textContent;
}

function createShaderMaterial(id, light, ambientLight) {

	var shaderTypes = {

		'phongBalanced' : {

			uniforms: {

				"uDirLightPos":	{ type: "v3", value: new THREE.Vector3() },
				"uDirLightColor": { type: "c", value: new THREE.Color( 0xffffff ) },

				"uAmbientLightColor": { type: "c", value: new THREE.Color( 0x050505 ) },

				"uMaterialColor":  { type: "c", value: new THREE.Color( 0xffffff ) },
				"uSpecularColor":  { type: "c", value: new THREE.Color( 0xffffff ) },

				uKd: {
					type: "f",
					value: 0.7
				},
				uKs: {
					type: "f",
					value: 0.3
				},
				shininess: {
					type: "f",
					value: 100.0
				},
				uFlashRadius: {
					type: "f",
					value: 1.0
				},
				"uFlashOffset":	{ type: "v2", value: new THREE.Vector2() }
			}
		}

	};

	var shader = shaderTypes[id];

	var u = THREE.UniformsUtils.clone(shader.uniforms);

	var material = new THREE.ShaderMaterial({ uniforms: u, vertexShader: vertexShader, fragmentShader: fragmentShader });

	material.uniforms.uDirLightPos.value = light.position;
	material.uniforms.uDirLightColor.value = light.color;

	material.uniforms.uAmbientLightColor.value = ambientLight.color;
	
	material.uniforms.uFlashOffset.value = flashlightOffset;

	return material;

}

function setupGui() {

	effectController = {

		flashRadius: 2.0,
		flashOffsetX: 1.7,
		flashOffsetY: -0.3,
		
		shininess: 20.0,
		ka: 0.2,
		kd: 0.4,
		ks: 0.35,
		metallic: false,

		hue: 0.09,
		saturation: 0.46,
		lightness: 0.7,

		lhue: 0.04,
		lsaturation: 0.0,
		llightness: 0.7
	};

	var h;

	var gui = new dat.GUI();

	// material (attributes)

	h = gui.addFolder("Flashlight control");
	h.add(effectController, "flashRadius", 0.0, 10.0, 1.0).name("radius");
	h.add(effectController, "flashOffsetX", -10.0, 10.0, 1.0).name("offset X");
	h.add(effectController, "flashOffsetY", -10.0, 10.0, 1.0).name("offset Y");
	
	h = gui.addFolder("Material control");
	h.add(effectController, "shininess", 1.0, 100.0, 1.0).name("shininess");
	h.add(effectController, "ka", 0.0, 1.0, 0.025).name("m_ka");
	h.add(effectController, "kd", 0.0, 1.0, 0.025).name("m_kd");
	h.add(effectController, "ks", 0.0, 1.0, 0.025).name("m_ks");
	h.add(effectController, "metallic");
	// TODO: add tess for tessellation

	// material (color)

	h = gui.addFolder("Material color");

	h.add(effectController, "hue", 0.0, 1.0, 0.025).name("m_hue");
	h.add(effectController, "saturation", 0.0, 1.0, 0.025).name("m_saturation");
	h.add(effectController, "lightness", 0.0, 1.0, 0.025).name("m_lightness");

	// light (point)

	h = gui.addFolder("Light color");

	h.add(effectController, "lhue", 0.0, 1.0, 0.025).name("hue");
	h.add(effectController, "lsaturation", 0.0, 1.0, 0.025).name("saturation");
	h.add(effectController, "llightness", 0.0, 1.0, 0.025).name("lightness");

}

//

function animate() {

	requestAnimationFrame(animate);
	render();

}

function render() {

	var delta = clock.getDelta();

	cameraControls.update(delta);

	if (newTess !== tess ) {
		tess = newTess;

		fillScene();
	}

	flashlightOffset.set( -effectController.flashOffsetX, -effectController.flashOffsetY );
	
	phongBalancedGroundMaterial.uniforms.uFlashRadius.value = 
		effectController.flashRadius;

	phongBalancedMaterial.uniforms.uFlashRadius.value = 
		effectController.flashRadius;

	phongBalancedMaterial.uniforms.shininess.value = effectController.shininess;
	phongBalancedMaterial.uniforms.uKd.value = effectController.kd;
	phongBalancedMaterial.uniforms.uKs.value = effectController.ks;

	var materialColor = new THREE.Color();
	materialColor.setHSL(effectController.hue, effectController.saturation, effectController.lightness);
	phongBalancedMaterial.uniforms.uMaterialColor.value.copy(materialColor);

	if (!effectController.metallic) {
		materialColor.setRGB(1, 1, 1);
	}
	phongBalancedMaterial.uniforms.uSpecularColor.value.copy(materialColor);

	// Ambient's actually controlled by the light for this demo - TODO fix
	ambientLight.color.setHSL(effectController.hue, effectController.saturation, effectController.lightness * effectController.ka);

	light.position.copy(camera.position);

	light.color.setHSL(effectController.lhue, effectController.lsaturation, effectController.llightness);

	renderer.render(scene, camera);

}

function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length>0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild( renderer.domElement );
}

try {
  init();
  fillScene();
  setupGui();
  addToDOM();
  animate();
} catch(e) {
  var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
  $('#container').append(errorReport+e);
}