// https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial 
// This link explain why in the vertex shader glsl do not define attribute variables, because three.js will pass built in attributes and uniforms to the shader
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

void main() {

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	vNormal = normalize( normalMatrix * normal );
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	vViewPosition = -mvPosition.xyz;
	vWorldPosition = position;

}