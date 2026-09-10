// --- Triangle ---
const positions = new Float32Array([
   0.0,  2.0, 0.0,  // vertex 1
  -1.0,  0.0, 0.0,  // vertex 2
   1.0,  0.0, 0.0,  // vertex 3
   0.0, -2.0, 0.0,  // vertex 4
  -1.0,  0.0, 0.0,  // vertex 5
   1.0,  0.0, 0.0   // vertex 6
]);

const colors = new Float32Array([
  1.0, 0.5, 0.0,  // Orange
  0.0, 1.0, 1.0,  // Sky Blue
  0.5, 0.0, 0.5,  // Purple-ish
  1.0, 0.0, 0.0,  // Red
  0.0, 1.0, 0.0,  // Green
  0.0, 0.0, 1.0   // Blue
]);

// --- HW2: Transformations ---
var twoDTransform = {
  translation: function translation(tx, ty) {
    return [
      1,  0,  0,
       0,  1,  0,
      tx, ty, 1
    ];
  },

  rotation: function rotation(angle) {
    var cosine = Math.cos(angle);
    var sine = Math.sin(angle);
    return [
      cosine, -sine, 0,
      sine,  cosine, 0,
      0,  0,  1
    ];
  },

  scaling: function scaling(sx, sy) {
    return [
      sx, 0,  0,
      0, sy,  0,
      0,  0,  1
    ];
  },

  shearing: function shearing(shx, shy) {
    return [
      1, shx, 0,
      shy, 1, 0,
      0,  0,  1
    ];
  },

  reflection: function reflection(axis) {
    if (axis == "x") {
      return [
        1,  0, 0,
        0, -1, 0,
        0,  0, 0
      ];
    } else if (axis == "y") {
      return [
        -1, 0, 0,
         0, 1, 0,
         0, 0, 0
      ];
    } else if (axis == "y=x") {
      return [
        0, 1, 0,
        1, 0, 0,
        0, 0, 0
      ];
    } else { // Reflect across y = -x
      return [
         0, -1, 0,
        -1,  0, 0,
         0,  0, 0
      ];
    }
  }
}
