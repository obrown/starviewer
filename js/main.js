requirejs.config({
    baseUrl: "js",
    paths: {
      jquery: 'https://code.jquery.com/jquery-2.2.4.min',
      three: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r76/three.min'
    }
});


require(['model', 'view'],
function(FMODEL, FVIEW) {

FMODEL.init();
FVIEW.init();

// expose global variables for debugging purposes
window.FIRMAMENT_EXPOSE = function() {
	window.fm = FMODEL;
	window.fv = FVIEW;
};

// tick user time
setInterval(function() {
  FMODEL.time = new Date();
}, 500);

});
