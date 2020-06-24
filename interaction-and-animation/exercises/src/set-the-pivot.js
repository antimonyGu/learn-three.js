////////////////////////////////////////////////////////////////////////////////
// Change from fixed steps to timed updates
////////////////////////////////////////////////////////////////////////////////

/*global THREE, document, window, Stats*/
var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");
k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display=
"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:11,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=
a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import $ from "jquery";
import themes from './themes'
import { Coordinates as  CoordinateCreater } from './Coordinates';
const  Coordinates = new CoordinateCreater({}, themes.dark);
import * as dat from 'dat.gui';

var camera, scene, renderer, stats;
var cameraControls;

var clock = new THREE.Clock();

var cylinder, sphere, cube;

var bevelRadius = 1.9;	// TODO: 2.0 causes some geometry bug.

var headlight;

var bird;

var tiltDirection = 1;

function init() {
	var canvasWidth = 846; 
	var canvasHeight = 494;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0x0, 1.0 );
	renderer.shadowMapEnabled = true;

	// CAMERA
	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 4000 );
	camera.position.set( -657, 220, 1120 );

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,310,0);
	
	// STATS
	stats = new Stats();
	stats.setMode( 0 );
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	stats.domElement.children[ 0 ].children[ 0 ].style.color = "#aaa";
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[ 1 ].style.display = "none";

}

function fillScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x0, 2000, 4000 );

	// LIGHTS
	scene.add( new THREE.AmbientLight( 0x222222 ) );

	headlight = new THREE.PointLight( 0xFFFFFF, 1.0 );
	scene.add( headlight );
	
	var light = new THREE.SpotLight( 0xFFFFFF, 1.0 );
	light.position.set( -600, 1200, 300 );
	light.angle = 20 * Math.PI / 180;
	light.exponent = 1;
	light.target.position.set( 0, 200, 0 );
	light.castShadow = true;
	
	scene.add( light );
		
	var lightSphere = new THREE.Mesh(
		new THREE.SphereGeometry( 10, 12, 6 ),
		new THREE.MeshBasicMaterial() );
	lightSphere.position.copy( light.position );

	scene.add( lightSphere );

	//////////////////////////////
	// Glass
	var glass = createGlass(260);
	glass.position.set( -245, 125, 0);
	scene.add(glass);

	//////////////////////////////
	// Bird
	bird = new THREE.Object3D();
	createDrinkingBird( bird );
	
	scene.add( bird );
}

function createGlass(height) {
	var cupMaterial = new THREE.MeshPhongMaterial( { color: 0x0, specular: 0xFFFFFF, shininess: 100, opacity: 0.3, transparent: true } );
	var waterMaterial = new THREE.MeshLambertMaterial( {
		color: 0x1F8BAF
		//opacity: 0.7,
		//transparent: true
	} );

	var glassGeometry = new THREE.CylinderGeometry(120, 100, height, 32);
	var glassMesh = new THREE.Mesh( glassGeometry, cupMaterial );
	var glassObject = new THREE.Object3D();
	glassObject.add(glassMesh);
	
	var glassWater = new THREE.Mesh( new THREE.CylinderGeometry(120, 100, height, 32), waterMaterial);

	glassWater.scale.set(0.9, 0.85, 0.9);
	glassWater.position.set(0, -10, 0);

	glassObject.add(glassWater);
	return glassObject;
}


// Supporting frame for the bird - base + legs + feet
function createSupport( bsupport ) {
	var legMaterial = new THREE.MeshPhongMaterial( { shininess: 4 } );
	legMaterial.color.setHex( 0xAdA79b );
	legMaterial.specular.setRGB( 0.5, 0.5, 0.5 );
	legMaterial.color.copy( legMaterial.color );
				
	var footMaterial = new THREE.MeshPhongMaterial( { color: 0x960f0b, shininess: 30 } );
	footMaterial.specular.setRGB( 0.5, 0.5, 0.5 );
	footMaterial.color.copy( footMaterial.color );
				
	// base
	var cube = new THREE.Mesh( 
		new THREE.CubeGeometry( 20+64+110, 4, 2*77+12, bevelRadius ), footMaterial );
	cube.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	cube.position.y = 4/2;	// half of height
	cube.position.z = 0;	// centered at origin
	bsupport.add( cube );
				
	// feet
	cube = new THREE.Mesh( 
		new THREE.CubeGeometry( 20+64+110, 52, 6, bevelRadius ), footMaterial );
	cube.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	cube.position.y = 52/2;	// half of height
	cube.position.z = 77 + 6/2;	// offset 77 + half of depth 6/2
	bsupport.add( cube );
				
	cube = new THREE.Mesh( 
		new THREE.CubeGeometry( 20+64+110, 52, 6, bevelRadius ), footMaterial );
	cube.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	cube.position.y = 52/2;	// half of height
	cube.position.z = -(77 + 6/2);	// negative offset 77 + half of depth 6/2
	bsupport.add( cube );
				
	cube = new THREE.Mesh( 
		new THREE.CubeGeometry( 64, 104, 6, bevelRadius ), footMaterial );
	cube.position.x = 0;	// centered on origin along X
	cube.position.y = 104/2;
	cube.position.z = 77 + 6/2;	// negative offset 77 + half of depth 6/2
	bsupport.add( cube );
				
	cube = new THREE.Mesh( 
		new THREE.CubeGeometry( 64, 104, 6, bevelRadius ), footMaterial );
	cube.position.x = 0;	// centered on origin along X
	cube.position.y = 104/2;
	cube.position.z = -(77 + 6/2);	// negative offset 77 + half of depth 6/2
	bsupport.add( cube );
				
	// legs
	cube = new THREE.Mesh( 
		new THREE.CubeGeometry( 60, 282+4, 4, bevelRadius ), legMaterial );
	cube.position.x = 0;	// centered on origin along X
	cube.position.y = 104 + 282/2 - 2;
	cube.position.z = 77 + 6/2;	// negative offset 77 + half of depth 6/2
	bsupport.add( cube );
				
	cube = new THREE.Mesh( 
		new THREE.CubeGeometry( 60, 282+4, 4, bevelRadius ), legMaterial );
	cube.position.x = 0;	// centered on origin along X
	cube.position.y = 104 + 282/2 - 2;
	cube.position.z = -(77 + 6/2);	// negative offset 77 + half of depth 6/2
	bsupport.add( cube );
}

// Body of the bird - body and the connector of body and head
function createBody(bbody) {
	var bodyMaterial = new THREE.MeshPhongMaterial( { shininess: 100 } );
	bodyMaterial.color.setRGB( 31/255, 86/255, 169/255 );
	bodyMaterial.specular.setRGB( 0.5, 0.5, 0.5 );
	bodyMaterial.color.copy( bodyMaterial.color );

	var glassMaterial = new THREE.MeshPhongMaterial( { color: 0x0, specular: 0xFFFFFF, shininess: 100, opacity: 0.3, transparent: true } );
	glassMaterial.color.copy( glassMaterial.color );

	var crossbarMaterial = new THREE.MeshPhongMaterial( { color: 0x808080, specular: 0xFFFFFF, shininess: 400 } );
	crossbarMaterial.color.copy( crossbarMaterial.color );

	// body
	sphere = new THREE.Mesh(
		new THREE.SphereGeometry( 104/2, 32, 16, 0, Math.PI * 2, Math.PI/2, Math.PI ), bodyMaterial );
	sphere.position.x = 0;
	sphere.position.y = 160;
	sphere.position.z = 0;
	bbody.add( sphere );
	
	// cap for top of hemisphere
	cylinder = new THREE.Mesh( 
		new THREE.CylinderGeometry( 104/2, 104/2, 0, 32 ), bodyMaterial );
	cylinder.position.x = 0;
	cylinder.position.y = 160;
	cylinder.position.z = 0;
	bbody.add( cylinder );		

	cylinder = new THREE.Mesh( 
		new THREE.CylinderGeometry( 12/2, 12/2, 390 - 100, 32 ), bodyMaterial );
	cylinder.position.x = 0;
	cylinder.position.y = 160 + 390/2 - 100;
	cylinder.position.z = 0;
	bbody.add( cylinder );
	
	// glass stem
	sphere = new THREE.Mesh(
		new THREE.SphereGeometry( 116/2, 32, 16 ), glassMaterial );
	sphere.position.x = 0;
	sphere.position.y = 160;
	sphere.position.z = 0;
	bbody.add( sphere );

	cylinder = new THREE.Mesh( 
		new THREE.CylinderGeometry( 24/2, 24/2, 390, 32 ), glassMaterial );
	cylinder.position.x = 0;
	cylinder.position.y = 160 + 390/2;
	cylinder.position.z = 0;
	bbody.add( cylinder );
		
	// crossbar	
	cylinder = new THREE.Mesh( 
		new THREE.CylinderGeometry( 5, 5, 200, 32 ), crossbarMaterial );
	cylinder.position.set( 0, 360, 0 );
	cylinder.rotation.x = 90 * Math.PI / 180.0;
	bbody.add( cylinder );
}

// Head of the bird - head + hat
function createHead(bhead) {
	var headMaterial = new THREE.MeshLambertMaterial( );
	headMaterial.color.r = 104/255;
	headMaterial.color.g = 1/255;
	headMaterial.color.b = 5/255;
	headMaterial.color.copy( headMaterial.color );
				
	var hatMaterial = new THREE.MeshPhongMaterial( { shininess: 100 } );
	hatMaterial.color.r = 24/255;
	hatMaterial.color.g = 38/255;
	hatMaterial.color.b = 77/255;
	hatMaterial.specular.setRGB( 0.5, 0.5, 0.5 );
	hatMaterial.color.copy( hatMaterial.color );

	var eyeMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x303030, shininess: 4 } );
	eyeMaterial.color.copy( eyeMaterial.color );
	
	// head
	sphere = new THREE.Mesh(
		new THREE.SphereGeometry( 104/2, 32, 16 ), headMaterial );
	sphere.position.x = 0;
	sphere.position.y = 160 + 390;
	sphere.position.z = 0;
	bhead.add( sphere );

	// hat
	cylinder = new THREE.Mesh( 
		new THREE.CylinderGeometry( 142/2, 142/2, 10, 32 ), hatMaterial );
	cylinder.position.x = 0;
	cylinder.position.y = 160 + 390 + 40 + 10/2;
	cylinder.position.z = 0;
	bhead.add( cylinder );
				
	cylinder = new THREE.Mesh( 
		new THREE.CylinderGeometry( 80/2, 80/2, 70, 32 ), hatMaterial );
	cylinder.position.x = 0;
	cylinder.position.y = 160 + 390 + 40 + 10 + 70/2;
	cylinder.position.z = 0;
	bhead.add( cylinder );

	// nose
	cylinder = new THREE.Mesh( 
		new THREE.CylinderGeometry( 6, 14, 70, 32 ), headMaterial );
	cylinder.position.set( -70, 530, 0 );
	cylinder.rotation.z = 90 * Math.PI / 180.0;
	bhead.add( cylinder );

	// eyes
	var sphGeom = new THREE.SphereGeometry( 10, 32, 16 );
	
	// left eye
	sphere = new THREE.Mesh( sphGeom, eyeMaterial );
	sphere.position.set( -48, 560, 0 );
	var eye = new THREE.Object3D();	
	eye.add( sphere );
	eye.rotation.y = 20 * Math.PI / 180.0;
	bhead.add( eye );

	// right eye
	sphere = new THREE.Mesh( sphGeom, eyeMaterial );
	sphere.position.set( -48, 560, 0 );
	eye = new THREE.Object3D();	
	eye.add( sphere );
	eye.rotation.y = -20 * Math.PI / 180.0;
	bhead.add( eye );
}

function createDrinkingBird(bbird) {
	var support = new THREE.Object3D();
	var body = new THREE.Object3D();
	var head = new THREE.Object3D();
	var pivotHeight = 360;

	body.translateY(-pivotHeight);
	head.translateY(-pivotHeight);

	// MODELS
	// base + legs + feet
	createSupport(support);
	
	// body + body/head connector
	createBody(body);

	// head + hat
	createHead(head);
	
	// make moving piece
	
	var bodyhead = new THREE.Object3D();
	bodyhead.add(body);
	bodyhead.add(head);
	bodyhead.translateY(pivotHeight);


	// Student: change pivot point
	// pivotHeight is the height of the crossbar
	// var pivotHeight = 360;
	
	// add field for animated part, for simplicity
	bbird.animated = bodyhead;
	
	bbird.add(support);
	bbird.add(bodyhead);

	// go through all objects and set the meshes (only)
	// so that they cast shadows
	bbird.traverse( function ( object ) {
		if ( object instanceof THREE.Mesh ) {
			object.castShadow = true;
			object.receiveShadow = true;
		}
	} );
	
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
    Coordinates.drawGround({size:10000});		
	Coordinates.drawGrid({size:10000,scale:0.01});
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);

	bird.animated.rotation.z += tiltDirection * 0.5 * Math.PI/180;
	if ( bird.animated.rotation.z > 103 * Math.PI/180 ) {
		tiltDirection = -1;
		bird.animated.rotation.z = 2*(103 * Math.PI/180) - bird.animated.rotation.z;
	} else if ( bird.animated.rotation.z < -22 * Math.PI/180 ) {
		tiltDirection = 1;
		bird.animated.rotation.z = 2*(-22 * Math.PI/180) - bird.animated.rotation.z;
	}

	headlight.position.copy( camera.position );
	stats.update();
	renderer.render(scene, camera);
}

// try {
  init();
  fillScene();
  drawHelpers();
  addToDOM();
  animate();
// } catch(e) {
//   var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
//   $('#container').append(errorReport+e);
// }