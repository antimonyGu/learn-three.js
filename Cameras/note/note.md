# PROJECTIONS
- fish-eye
- perspective
- orthographic

# ORTHOGRAPHIC CAMERA

# THREE.JS ORTHGRAPHIC CAMERA

# LOOK AT
frame of reference for the camera(照相机的参考系)

# VIEW TRANSFORM

# NORMALIZED DEVICE COORDINATES

# PERSPECTIVE CAMERA
This camera is more like real life, with objects in the distance being smaller. The view matrix is the same as the orthographic camera. But perspective camera is different.
![perspective-camera](note-pictures/perspective-camera.jpg)

# THREE.JS PERSPECTIVE CAMERA
If you later change the values on the camera itself, such as the field of view near or far planes,  in three.js you need to call camera.updateProjectionMatrix();
in order to have these changes take effect.

# PERSPECATIVE MATRIX
![perspective matrix formed from the three.js parameters](./note-pictures/perspective-matrix.jpg)
![](./note-pictures/illustrator.jpg)

# HOMOGENEOUS COORDINATES
![homogeneous-matrix](note-pictures/homogeneous-matrix.jpg)

# CLIPPING
Clipping is a step that happens after projection and before division by W. It cutes the segments and triangle edges that poke out through the frustum.
![](note-pictures/clipping.jpg)

# FIELD OF VIEW(FOV)
When we try to go infinitely far away and have the field of view approaching an angle of zero degree the view becomes an orthographic projection.

# TRUE FIELD OF VIEW
