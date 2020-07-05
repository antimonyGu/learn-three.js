# Introduction

# Events
```js
function onDocumentMouseDown( event ) {
    var mouseVector = new THREE.Vector3(
        2 * ( mouseX / canvasWidth ) - 1,
        1 - 2 * ( mouseY / canvasHeight ));
    var projector = new THREE.Projector();
    var raycaster = projector.pickingRay( mouseVector.clone(), camera );
    var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {

		intersects[ 0 ].object.material.color.setRGB( Math.random(), Math.random(), Math.random() );

		var sphere = new THREE.Mesh( sphereGeom, sphereMaterial );
		sphere.position = intersects[ 0 ].point;
		scene.add( sphere );
	}
}
```
![picking](./note-pictures/picking.jpg)

# Dragging

# The Rendering Loop

# Incremental Animation

# TIMED ANIMATION
```js
var clock = new THREE.Clock();
function render() {
    var delta = clock.getDelta();
}
bird.animated.rotation.z += tiltDirection * 30 * delta * Math.PI/180; // This way to render the rotation will cause a problem, that when you switch to another page the render of this page will be stopped by the broswer. And when you back to this page again the delta will be a huge number so the drinking bird will rotate in a very fast speed.

// The way to solve this problem is using the bulletproof which is taking the modulus of the rotation angle.
```

# KEY FRAMING
[an very clear introduction of quaternion and slerp](https://github.com/Krasjet/quaternion/tree/master/demo)

# TEXTURE ANIMATION


