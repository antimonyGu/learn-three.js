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
Objects with UVs and textures can be imported into three.js. [webgl_loader_md2_control demo](https://threejs.org/examples/#webgl_loader_md2_control)   
![illustration of texture mapping](./notes-pictures/texture-mapping.png)  
The way in which a model is associated with its texture is called texture mapping. The spheres and other objects we saw before had fairly natural projections of the texture onto their surfaces. For a more complex object, such as this humanoid, an artist uses a modeling program to assign the parts of the texture to the model. When a triangle mesh has a texture applied to it the texture is used by the whole mesh. Because of this, a single texture is used to hold all the different images for the various parts of the mesh. This kind of texture is called a texture atlas or a mosaic.

# TEXTURE DISTORTION
## Some further reading
[Its-Really-Not-a-Rendering-Bug-You-se](https://www.geekshavefeelings.com/x/wp-content/uploads/2010/03/Its-Really-Not-a-Rendering-Bug-You-see....pdf)  
[limits-of-triangles](http://www.realtimerendering.com/blog/limits-of-triangles/)  
Though I do not have enough time to read them. Orz

# WRAP MODES
- repeat: If you want to have things look continuous, such as water, then the texture itself needs to be what is called seamless, where its edges mach up.
- mirrored repeat: If your texture is not seamless, one cheap way to tile it accross the plane is to set the wrap mode to be mirrored repeat.
- clamp to edge: The pixels on the edge are used to fill in the area.
```javascript
// set wrap mode in three.js
let texture = new THREE.Texture();
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
```
## An example
[relative path of the demo](../exercises/src/examples/wrap-mode.js)