define(['three', 'event', 'model', 'skyshader'],
function(THREE, FEVENT, FMODEL) {

  var SphereBufferGeometry = THREE.SphereBufferGeometry,
      SkyMaterial          = THREE.SkyMaterial,
      Vector3              = THREE.Vector3,
      Object3D             = THREE.Object3D,
      Mesh                 = THREE.Mesh,
      DirectionalLight     = THREE.DirectionalLight;

  function Sky(radius) {
    Object3D.call(this);
    var that = this;
    this.name = "sky";

    // sky
    var geometry  = new SphereBufferGeometry(radius);
    var material  = new SkyMaterial();
    material.side = THREE.BackSide;
    var sky = new Mesh(geometry, material);

    // sun light
    var light = new DirectionalLight(0xf7f7e7, 0.8);

    FEVENT.on('placetime', function() {
      var sunAltAz = FMODEL.getSunAltAz();
      var sunXYZ   = new Vector3().fromAngles(sunAltAz.az, sunAltAz.alt);
      sunXYZ.multiplyScalar(radius);
      material.uniforms.sunPosition.value.copy(sunXYZ);
      light.position.copy(sunXYZ);
    });

    this.add(sky, light);
  };

  Sky.prototype = Object.create(THREE.Object3D.prototype);
  Sky.prototype.constructor = Sky;

  return {
    Sky: Sky
  };

});
