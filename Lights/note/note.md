# PHOTONS AS PARTICAL
![photons](./note-pictures/photons.jpg)
**  This simple phonton model ignores various  effect such as polarization（偏振） and fluorescence（荧光）**

# DIRECTIONAL LIGHT(like sunlight)
![directional lights](./note-pictures/directional-lights.jpg)

# POINT LIGHT

# AMBIENT LIGHT

# SPOT LIGHT

# DEFERRED RENDEING
To avoid the expense of adding a lot of lights to the scene, we can use deferred rendering. 

# SHADOW MAPPING

# SHADOW BUFFER LIMITATIONS
- surface acne: 

# RAY TRACING
- The previous light model is called local illumination models, where object is affected by a light, and the result is sent to the eye. So light only from light sources. No light is reflected from other objects.
- Ray tracing can simulate light refelected from other objects. Ray tracing fires rays from the eye through each pixel.

# WHAT PATH ARE IGONRED?
- light -> object -> diffuse object
- light -> mirror -> object

# PATH TRACING
- A path tracing demo [a path tracing demo](http://madebyevan.com/webgl-path-tracing/)