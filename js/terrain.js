define(['three', 'noise'],
function(THREE, noise) {

THREE.TerrainGeometry = function(size, points) {
  
  THREE.PlaneGeometry.call(this, size, size, points - 1, points - 1);

  var simplex = new noise.SimplexNoise();
  var nVertices = this.vertices.length;
  for (var i = 0; i < nVertices; i++) {
    var x = i % points, y = ~~(i / points);
    this.vertices[i].z += simplex.sumOctave(x, y, 8, 0.5, 0.01, 0, 32);
  }

  // ensure center point at 0 height
  var centerVertex = (~~(points / 2) + 0.5) * points;
  this.translate(0, 0, -this.vertices[centerVertex].z);
};

THREE.TerrainGeometry.prototype = Object.create(THREE.PlaneGeometry.prototype);
THREE.TerrainGeometry.prototype.constructor = THREE.TerrainGeometry;

});
