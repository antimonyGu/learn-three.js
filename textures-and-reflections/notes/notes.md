# HOW TEXTURE WORK
![](./notes-pictures/texture-work.jpg)
WebGL do not allow to load cross-domin images into WebGL texture. You can use CORS or JSONP or reverse proxy etc. to solve this problem.

# TEXTURE UVs
![](notes-pictures/texture-UV.png)

# UVs in three.js
```javascript
// example: making a triangle with UVs code
let geo = new THREE.Geometry();

// generate vertices
geo.vertices.push( new THREE.Vector3(0.0, 0.0, 0.0) );
geo.vertices.push( new THREE.Vector3(4.0, 0.0, 0.0) );
geo.vertices.push( new THREE.Vector3(4.0, 4.0, 0.0) );

let uvs = [];
uvs.push( new THREE.Vector2(0.0, 0.0) );
uvs.push( new THREE.Vector2(1.0, 0.0) ); 
uvs.push( new THREE.Vector2(1.0, 1.0) ); 

// generate faces
geo.faces.push( new THREE.Face3(0, 1, 2) );
geo.faceVertexUVs[0].push(  [uvs[0], uvs[1], uvs[2] ] );
```

# TEXTURE MAPPING

