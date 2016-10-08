define(['jquery', 'three'],
function($, THREE) {

  function Controls(camera) {
    this.camera = camera;

    // default camera orientation
    camera.rotation.set(3 * Math.PI / 4, 0, 0, "ZYX");

    this.moveDamping = 0.005;
    this.zoomDamping = 0.005;

    // translate events to interface
    var that = this;

    this.controlState = {
      start: {},       // click start
      mouseDown: false // mouse is down
    };

    $("canvas").mousemove(function(event) {
      event.preventDefault();
      that.move(event.clientX, event.clientY);
    });
    $("canvas").mousedown(function(event) {
      if (event.which !== 1) return;
      that.down(event.clientX, event.clientY);
    });
    $("canvas").mouseup(function(event) {
      if (event.which !== 1) return;
      that.up();
    });

    $("canvas").on('touchmove',  function(event) {
      event.preventDefault();
      var touch = event.originalEvent.touches.item(0);
      that.move(touch.clientX, touch.clientY);
    });
    $("canvas").on('touchstart', function(event) {
      var touch = event.originalEvent.touches.item(0);
      that.down(touch.clientX, touch.clientY);
    });
    $("canvas").on('touchend',   function() {
      that.up();
    });

    $("canvas").on('mousewheel',     function(event) {
      that.zoom(event.wheelDelta);
    });
    $("canvas").on('DOMMouseScroll', function(event) {
      that.zoom(-event.originalEvent.detail * 32);
    });
  }

  function clamp(min, max, x) {
    return Math.min(Math.max(min, x), max);
  }

  function angularDistance(theta, phi) {
    var delta = theta - phi;
    if (delta < -Math.PI) {delta += Math.PI * 2;}
    if (delta > Math.PI)  {delta -= Math.PI * 2;}
    return delta;
  }

  Controls.prototype.move = function(x, y) {
    if (this.controlState.mouseDown) {
      var deltaX = x - this.controlState.start.x;
      var deltaY = y - this.controlState.start.y;

      this.controlState.start.x = x;
      this.controlState.start.y = y;

      var yaw   = this.camera.rotation.z + deltaX * this.moveDamping,
          pitch = this.camera.rotation.x + deltaY * this.moveDamping;

      pitch = clamp(0, Math.PI, pitch);

      this.camera.rotation.z = yaw;
      this.camera.rotation.x = pitch;
    }
  };

  Controls.prototype.zoom = function(delta) {
    var currentZoom = this.camera.zoom;
    currentZoom += delta * this.zoomDamping; 
    currentZoom = clamp(1.0, 4.0, currentZoom);
    this.camera.zoom = currentZoom;
    this.camera.updateProjectionMatrix();
  };

  Controls.prototype.down = function(x, y) {
    this.controlState.start.x = x;
    this.controlState.start.y = y;
    this.controlState.mouseDown = true;
  };

  Controls.prototype.up = function() {
    this.controlState.mouseDown = false;
  };

  return {
    Controls: Controls
  };
});
