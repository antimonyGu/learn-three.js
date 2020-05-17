uniform vec3 uMaterialColor;

uniform vec3 uDirLightPos;
uniform vec3 uDirLightColor;

uniform float uKd;
uniform float uScale;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vModelPosition;

void main() {
	// compute direction to light
	vec4 lDirection = viewMatrix * vec4( uDirLightPos, 0.0 );
	vec3 lVector = normalize( lDirection.xyz );

	// diffuse: N * L. Normal must be normalized, since it's interpolated.
	vec3 normal = normalize( vNormal );
	
	float diffuse = max( dot( normal, lVector ), 0.0);
	// Student: use the vModelPosition as an input to a function and
	// then multiply the diffuse contribution by this amount.
    diffuse = .5 + .5 * sin(uScale * vModelPosition.x) * sin(uScale * vModelPosition.y) * sin(uScale * vModelPosition.z);

	gl_FragColor = vec4( uKd * uMaterialColor * uDirLightColor * diffuse, 1.0 );
}