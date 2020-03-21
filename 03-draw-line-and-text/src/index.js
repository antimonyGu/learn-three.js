import * as THREE from 'three'
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerWidth);
document.body.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

let scene = new THREE.Scene();

let material = new THREE.LineBasicMaterial({ color: 0x0000ff });
let points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));
let geometry = new THREE.BufferGeometry().setFromPoints(points);

let line = new THREE.Line( geometry, material );
scene.add( line );
renderer.render(scene, camera);

