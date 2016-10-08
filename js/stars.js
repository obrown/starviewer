define(['three', 'event', 'model', 'starshader'],
function(THREE, FEVENT, FMODEL) {

  var Object3D        = THREE.Object3D,
      Vector3         = THREE.Vector3,
      Geometry        = THREE.Geometry,
      TextureLoader   = THREE.TextureLoader,
      StarMaterial    = THREE.StarMaterial,
      BufferAttribute = THREE.BufferAttribute,
      Points          = THREE.Points,
      AmbientLight    = THREE.AmbientLight,
      BufferGeometry  = THREE.BufferGeometry;

  function Stars(radius) {
    Object3D.call(this);
    var that = this;
    this.name = "stars";
    
    var loader = new TextureLoader();
    // wait for texture load
    loader.load("img/star16.png", function(texture) { 
      var material = new StarMaterial();
      material.uniforms.texture.value = texture;
      material.uniforms.opacity.value = 1.0;
      var n = FMODEL.getNumberStars();

      var positions = new Float32Array(n * 3);
      var colours   = new Float32Array(n * 3);
      var sizes     = new Float32Array(n);

      var i  = 0;
      var i3 = 0;
      FMODEL.eachStar(function(star) {
        var p_ = star.getPosition();
        var p = new Vector3().fromAngles(p_.ra, p_.dec);
        p.multiplyScalar(radius);
        var s = star.getScale();
        var c = star.getColour();

        positions[i3 + 0] = p.x;
        positions[i3 + 1] = p.y;
        positions[i3 + 2] = p.z;

        colours[i3 + 0] = c.r;
        colours[i3 + 1] = c.g;
        colours[i3 + 2] = c.b;

        sizes[i] = s;

        i++;
        i3 += 3;
      }); 

      var geometry = new BufferGeometry();
      geometry.addAttribute('position', new BufferAttribute(positions, 3));
      geometry.addAttribute('colour',   new BufferAttribute(colours, 3));
      geometry.addAttribute('size',     new BufferAttribute(sizes, 1));

      var stars = new Points(geometry, material);
      that.add(stars);

      FEVENT.on('placetime', function() {
        var cRot = FMODEL.getCelestialSphereRot();
        that.rotation.set(cRot.x, cRot.y, cRot.z);
        // fade in stars when sun between 0 and 6 degrees below horizon
        var theta = FMODEL.getSunAltAz().alt;
        var phi   = -6.0 * (Math.PI / 180);
        var op = Math.min(Math.max(theta / phi, 0.0), 1.0);
        stars.material.uniforms.opacity.value = op;
      });

      // starlight for night
      var light = new AmbientLight(0xf7f7e7, 0.05);
      that.add(light);
    });

  };

  Stars.prototype = Object.create(THREE.Object3D.prototype);
  Stars.prototype.constructor = Stars;

  return {
    Stars: Stars
  };

});
