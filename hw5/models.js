function createCube() {
  const positions = new Float32Array([
    -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,   // front
     1, -1, -1,  -1, -1, -1,  -1,  1, -1,   1,  1, -1,   // back
    -1,  1,  1,   1,  1,  1,   1,  1, -1,  -1,  1, -1,   // top
    -1, -1, -1,   1, -1, -1,   1, -1,  1,  -1, -1,  1,   // bottom
     1, -1,  1,   1, -1, -1,   1,  1, -1,   1,  1,  1,   // right
    -1, -1, -1,  -1, -1,  1,  -1,  1,  1,  -1,  1, -1    // left
  ]);
  const faceNormals = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]];
  const normals = new Float32Array(faceNormals.flatMap(n => [...n, ...n, ...n, ...n]));

  const indices = new Uint16Array([
     0,  1,  2,   0,  2,  3,   // front
     4,  5,  6,   4,  6,  7,   // back
     8,  9, 10,   8, 10, 11,   // top
    12, 13, 14,  12, 14, 15,   // bottom
    16, 17, 18,  16, 18, 19,   // right
    20, 21, 22,  20, 22, 23    // left
  ]);
  return { positions, normals, indices };
}

function createCylinder(segments) {
  const pos = [], nrm = [], idx = [];

  // Side
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2, x = Math.cos(a), z = Math.sin(a);
    pos.push(x, -1, z, x, 1, z);
    nrm.push(x, 0, z, x, 0, z);
  }
  for (let i = 0; i < segments; i++) {
    const b = i * 2;
    idx.push(b, b + 1, b + 3, b, b + 3, b + 2);
  }

  // Caps
  for (const y of [-1, 1]) {
    const center = pos.length / 3;
    pos.push(0, y, 0);
    nrm.push(0, y, 0);
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pos.push(Math.cos(a), y, Math.sin(a));
      nrm.push(0, y, 0);
    }
    for (let i = 1; i <= segments; i++) {
      if (y > 0) idx.push(center, center + i + 1, center + i);
      else idx.push(center, center + i, center + i + 1);
    }
  }

  return { positions: new Float32Array(pos), normals: new Float32Array(nrm), indices: new Uint16Array(idx) };
}

function createSphere(segments) {
    const position = [], normal = [], indice = [];

    for (let latitude = 0; latitude <= segments; latitude++) {
        const theta = latitude * Math.PI / segments;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let longitude = 0; longitude <= segments; longitude++) {
            const phi = longitude * 2 * Math.PI / segments;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = sinTheta * cosPhi;
            const y = sinTheta * sinPhi;
            const z = cosTheta;

            position.push(x, y, z);
            normal.push(x, y, z);
        }
    }

    for (let latitude = 0; latitude < segments; latitude++) {
        for (let longitude = 0; longitude < segments; longitude++) {
            const first = latitude * (segments + 1) + longitude;
            const second = first + segments + 1;
            indice.push(first, second, first + 1);
            indice.push(second, second + 1, first + 1);
        }
    }

    return {
        positions: new Float32Array(position),
        normals: new Float32Array(normal),
        indices: new Uint16Array(indice)
    };
}

function createTorus(segments, innerRadius = 0.25) {
    const position = [], normal = [], indice = [];

    for (let ring = 0; ring <= segments; ring++) {
        const phi = ring * 2 * Math.PI / segments;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        for (let seg = 0; seg <= segments; seg++) {
            const theta = seg * 2 * Math.PI / segments;
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            const x = (1 + innerRadius * cosTheta) * cosPhi;
            const y = (1 + innerRadius * cosTheta) * sinPhi;
            const z = innerRadius * sinTheta;

            position.push(x, y, z);
            normal.push(x, y, z);
        }
    }

    for (let ring = 0; ring < segments; ring++) {
        for (let seg = 0; seg < segments; seg++) {
            const first = ring * (segments + 1) + seg;
            const second = first + segments + 1;
            indice.push(first, second, first + 1);
            indice.push(second, second + 1, first + 1);
        }
    }

    return {
        positions: new Float32Array(position),
        colors: new Float32Array(normal),
        indices: new Uint16Array(indice)
    };
}
