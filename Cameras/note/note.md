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