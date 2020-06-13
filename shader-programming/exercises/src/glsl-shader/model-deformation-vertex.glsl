varying vec3 vNormal;
varying vec3 vViewPosition;

uniform float uSphereRadius2;	// squared

void main() {
	// Student: modify position. You'll need to copy it to a
	// temporary vector and modify the temporary. 
	// Don't forget to use this temporary in the rest of the shader.
	vec3 newPosition = position;
	newPosition.z = sqrt(uSphereRadius2 - newPosition.x * newPosition.x - newPosition.y * newPosition.y);
	newPosition.z -= sqrt(uSphereRadius2);

	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
	// vNormal = normalize( normalMatrix * normal );
	vec3 newNormal = vec3( newPosition ) - vec3(0.0, 0.0, -sqrt(uSphereRadius2));
	vNormal = normalize( normalMatrix * newNormal );
	vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
	vViewPosition = -mvPosition.xyz;
}