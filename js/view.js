define(['jquery', 'event','three', 'model', 'controls', 'ground', 'sky', 'stars'],
function($, FEVENT, THREE, FMODEL, FCONTROLS, FGROUND, FSKY, FSTARS) {

  var PerspectiveCamera    = THREE.PerspectiveCamera,
      Scene                = THREE.Scene,
      WebGLRenderer        = THREE.WebGLRenderer,
      Vector3              = THREE.Vector3,

      Controls             = FCONTROLS.Controls,

      Ground               = FGROUND.Ground,
      Sky                  = FSKY.Sky,
      Stars                = FSTARS.Stars;

  var constellationColour = 0xffffff,
      farPlane            = 4096,  // far clipping plane
      sunRadius           = 2048,
      starRadius          = 1024,
      fov                 = 76,    // camera field of view
      nearPlane           = 0.1,   // near clipping plane
      antialiasing        = true;  // attempt antialiasing

  var scene,
      controls;

  function init() {
    initDisplay();
    initSky();
    initGround();
    initStars();
  }

  function initDisplay() {
    var width  = $(window).width();
    var height = $(window).height();
    var dpr    = window.devicePixelRatio ? window.devicePixelRatio : 1;

    scene = new Scene();

    var camera = new PerspectiveCamera(fov, width / height, nearPlane, farPlane);
    camera.position.set(0.0, 0.0, 4.0);
    camera.up.set(0.0, 0.0, 1.0);

    var renderer = new WebGLRenderer({antialias: antialiasing});
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);

    $(window).resize(function() {
      width  = $(window).width();
      height = $(window).height();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

    (function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    })();

    $("body").append(renderer.domElement); // attach display to DOM

    controls = new Controls(camera);

    FEVENT.on('visibility', function(event) {
      toggleVisibility(event.objectName);
    });
  }

  function initStars() {
    $.when(FMODEL.starsLoaded).done(function() {
      var stars = new Stars(starRadius - 1);
      scene.add(stars);
    });
  }

  function initSky() {
    var sky = new Sky(sunRadius);
    scene.add(sky);
  }

  function initGround() {
    var ground = new Ground(starRadius, 0xc6c6bf, 0xffffff);
    scene.add(ground);
  }

  THREE.Vector3.prototype.fromAngles = function(theta, phi) {
    this.x = Math.cos(phi) * Math.cos(theta);
    this.y = Math.cos(phi) * Math.sin(theta);
    this.z = Math.sin(phi);
    return this;
  };

  return {
    init: init
  };
});
