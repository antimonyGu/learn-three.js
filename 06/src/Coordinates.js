import * as THREE from 'three'
// const THREE = require('three');

// var THREE = window.THREE;
/**
 * @module  model/Coordinates
 */
/**
 * Coordinates helper, it creates the axes, ground and grids
 * shown in the world
 * @class
 * @param {Object} config
 * @param {Object} theme
 */
export function Coordinates(config, theme) {
  config = config || {};
  /**
   * Group where all the objects (axes, ground, grids) are put
   * @type {THREE.Object3D}
   */
  this.mesh = new THREE.Object3D();
  /**
   * Axes object, the mesh representing the axes is under this object 
   * under `mesh`
   * @type {Object}
   */
  this.axes = {
    name: 'Axes',
    mesh: this.drawAllAxes({axisLength:100,axisRadius:1,axisTess:50}),
    visible: config.axes !== undefined ? config.axes : true
  };
  /**
   * Ground object, the mesh representing the axes is under this object
   * under `mesh`
   * @type {Object}
   */
  this.ground = {
    name: 'Ground',
    mesh: this.drawGround({size:100000, color: theme.groundColor}),
    visible: config.ground !== undefined ? config.ground : true
  };
  
  /**
   * GridXZ object, the mesh representing the axes is under this object
   * under `mesh`
   * @type {Object}
   */
  this.gridX = {
    name: 'XY grid',
    mesh: this.drawGrid({size:10000, scale:0.01, color: theme.gridColor}),
    visible: config.gridX !== undefined ? config.gridX : true
  };
  /**
   * GridYZ object, the mesh representing the axes is under this object
   * under `mesh`
   * @type {Object}
   */  
  this.gridY = {
    name: 'XZ grid',
    mesh: this.drawGrid({size:10000, scale:0.01, orientation:"y", color: theme.gridColor}),
    visible: config.gridY !== undefined ? config.gridY : false
  };
  
  /**
   * GridXY object, the mesh representing the axes is under this object
   * under `mesh`
   * @type {Object}
   */
  this.gridZ = {
    name: 'YZ grid',
    mesh: this.drawGrid({size:10000, scale:0.01, orientation:"z", color: theme.gridColor}),
    visible: config.gridZ !== undefined ? config.gridZ : false
  };
  Coordinates.prototype.init.call(this, config);
}
/**
 * Adds the axes, ground, grid meshes to `this.mesh`
 * @param  {object} options
 * @return {this}
 */
Coordinates.prototype.init = function (options) {
  var me = this;
  for (var key in me) {
    if (me.hasOwnProperty(key)) {
      var v = me[key];
      if (v.mesh) {
        me.mesh.add(v.mesh);
        v.mesh.visible = v.visible;
      }
    }
  }
  return me;
};
/**
 * Creates a dat.gui folder which has controls for the 
 * ground, axes and grids
 * @param  {dat.gui} gui
 * @return {this}
 */
Coordinates.prototype.initDatGui = function (gui) {
  var me = this,
    folder;
  folder = gui.addFolder('default scene helpers');
  for (var key in me) {
    if (me.hasOwnProperty(key)) {
      var v = me[key];
      if (v.hasOwnProperty('mesh')) {
        folder.add(v, 'visible')
          .name(v.name)
          .onFinishChange((function (property) {
            return function (newValue) {
              property.mesh.visible = newValue;
            };
          })(v));
      }
    }
  }
  return me;
};
/**
 * Draws a grid
 * @param  {object} params
 * @param  {object} params.size=100
 * @param  {object} params.scale=0.1
 * @param  {object} params.color=#505050
 * @param  {object} params.orientation=0.1
 * @return {THREE.Mesh}
 */
Coordinates.prototype.drawGrid = function (params) {
  params = params || {};
  var color = params.color !== undefined ? params.color:'#505050';
  var orientation = params.orientation !== undefined ? params.orientation:"x";
  var grid = new THREE.GridHelper( 500, 10, 0xa8a8a8, color );
  // grid.setColors( 0xa8a8a8, color );
  if (orientation === "x") {
    grid.rotation.x = - Math.PI / 2;
  } else if (orientation === "y") {
    grid.rotation.y = - Math.PI / 2;
  } else if (orientation === "z") {
    grid.rotation.z = - Math.PI / 2;
  }
  return grid;
};
/**
 * Draws the ground
 * @param  {object} params
 * @param  {object} params.size=100
 * @param  {object} params.scale=0x000000
 * @param  {object} params.offset=-0.2
 * @return {THREE.Mesh}
 */
Coordinates.prototype.drawGround = function (params) {
  params = params || {};
  var size = params.size !== undefined ? params.size:100;
  var color = params.color !== undefined ? params.color:0x000000;
  var offset = params.offset !== undefined ? params.offset:-0.5;
  var ground = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      opacity: 0.6,
      color: color
    })
  );
  ground.rotation.x = - Math.PI / 2;
  ground.position.y = offset;
  return ground;
};
/**
 * Draws an axis
 * @param  {object} params
 * @param  {object} params.axisRadius=0.04
 * @param  {object} params.axisLength=11
 * @param  {object} params.axisTess=46
 * @param  {object} params.axisOrientation=x
 * @return {THREE.Mesh}
 */
Coordinates.prototype.drawAxes = function (params) {
  // x = red, y = green, z = blue  (RGB = xyz)
  params = params || {};
  var axisRadius = params.axisRadius !== undefined ? params.axisRadius:0.04;
  var axisLength = params.axisLength !== undefined ? params.axisLength:11;
  var axisTess = params.axisTess !== undefined ? params.axisTess:48;
  var axisOrientation = params.axisOrientation !== undefined ? params.axisOrientation:"x";
  var wrap = new THREE.Object3D();
  var axisMaterial = new THREE.MeshLambertMaterial({ color: 0x000000, side: THREE.DoubleSide });
  var axis = new THREE.Mesh(
    new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), 
    axisMaterial
  );
  if (axisOrientation === "x") {
    axis.rotation.z = - Math.PI / 2;
    axis.position.x = axisLength/2-1;
  } else if (axisOrientation === "y") {
    axis.position.y = axisLength/2-1;
  }
  
  wrap.add( axis );
  
  var arrow = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 4*axisRadius, 8*axisRadius, axisTess, 1, true), 
    axisMaterial
  );
  if (axisOrientation === "x") {
    arrow.rotation.z = - Math.PI / 2;
    arrow.position.x = axisLength - 1 + axisRadius*4/2;
  } else if (axisOrientation === "y") {
    arrow.position.y = axisLength - 1 + axisRadius*4/2;
  }
  wrap.add( arrow );
  return wrap;
};
/**
 * Creates an Object3D which contains all axes
 * @param  {Object} params
 * @param  {object} params.axisRadius=0.04  cylinder radius
 * @param  {object} params.axisLength=11    cylinder length
 * @param  {object} params.axisTess=46      cylinder tesselation
 * @return {THREE.Object3D}
 */
Coordinates.prototype.drawAllAxes = function (params) {
  params = params || {};
  var axisRadius = params.axisRadius !== undefined ? params.axisRadius:0.04;
  var axisLength = params.axisLength !== undefined ? params.axisLength:10;
  var axisTess = params.axisTess !== undefined ? params.axisTess:24;
  var wrap = new THREE.Object3D();
  var axisXMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
  var axisYMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
  var axisZMaterial = new THREE.MeshLambertMaterial({ color: 0x0000FF });
  axisXMaterial.side = THREE.DoubleSide;
  axisYMaterial.side = THREE.DoubleSide;
  axisZMaterial.side = THREE.DoubleSide;
  var axisX = new THREE.Mesh(
    new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), 
    axisXMaterial
  );
  var axisY = new THREE.Mesh(
    new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), 
    axisYMaterial
  );
  var axisZ = new THREE.Mesh(
    new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), 
    axisZMaterial
  );
  axisX.rotation.z = - Math.PI / 2;
  axisX.position.x = axisLength/2-1;
  axisY.position.y = axisLength/2-1;
  
  axisZ.rotation.y = - Math.PI / 2;
  axisZ.rotation.z = - Math.PI / 2;
  axisZ.position.z = axisLength/2-1;
  wrap.add( axisX );
  wrap.add( axisY );
  wrap.add( axisZ );
  var arrowX = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 4*axisRadius, 4*axisRadius, axisTess, 1, true), 
    axisXMaterial
  );
  var arrowY = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 4*axisRadius, 4*axisRadius, axisTess, 1, true), 
    axisYMaterial
  );
  var arrowZ = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 4*axisRadius, 4*axisRadius, axisTess, 1, true), 
    axisZMaterial
  );
  arrowX.rotation.z = - Math.PI / 2;
  arrowX.position.x = axisLength - 1 + axisRadius*4/2;
  arrowY.position.y = axisLength - 1 + axisRadius*4/2;
  arrowZ.rotation.z = - Math.PI / 2;
  arrowZ.rotation.y = - Math.PI / 2;
  arrowZ.position.z = axisLength - 1 + axisRadius*4/2;
  wrap.add( arrowX );
  wrap.add( arrowY );
  wrap.add( arrowZ );
  return wrap;
};
// module.exports = Coordinates;