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

  // Tangent; bitangent = cross(N, T)
  const faceTangents = [[1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [0, 0, -1], [0, 0, 1]];
  const tangents = new Float32Array(faceTangents.flatMap(t => [...t, ...t, ...t, ...t]));

  const texCoords = new Float32Array(faceNormals.flatMap(() => [0, 0, 1, 0, 1, 1, 0, 1]));

  const indices = new Uint16Array([
     0,  1,  2,   0,  2,  3,   // front
     4,  5,  6,   4,  6,  7,   // back
     8,  9, 10,   8, 10, 11,   // top
    12, 13, 14,  12, 14, 15,   // bottom
    16, 17, 18,  16, 18, 19,   // right
    20, 21, 22,  20, 22, 23    // left
  ]);
  return { positions, normals, tangents, texCoords, indices };
}


function createCylinder(segments = 64, uRepeat = 3) {
  const positions = [], normals = [], tangents = [], texCoords = [], indices = [];

  // Side: theta grows with u, so T points along the circle and B = cross(N, T) points up
  for (let i = 0; i <= segments; i++) {
    const u = i / segments, theta = 2 * Math.PI * u;
    const s = Math.sin(theta), c = Math.cos(theta);
    for (const y of [-1, 1]) {
      positions.push(s, y, c);
      normals.push(s, 0, c);
      tangents.push(c, 0, -s);
      texCoords.push(u * uRepeat, (y + 1) / 2);
    }
  }
  for (let i = 0; i < segments; i++) {
    const k = 2 * i;
    indices.push(k, k + 2, k + 3, k, k + 3, k + 1);
  }

  // Caps: planar mapping of x, z into the texture, T = +x on both
  for (const y of [1, -1]) {
    const center = positions.length / 3;
    positions.push(0, y, 0);
    normals.push(0, y, 0);
    tangents.push(1, 0, 0);
    texCoords.push(0.5, 0.5);
    for (let i = 0; i <= segments; i++) {
      const theta = 2 * Math.PI * i / segments;
      const s = Math.sin(theta), c = Math.cos(theta);
      positions.push(s, y, c);
      normals.push(0, y, 0);
      tangents.push(1, 0, 0);
      texCoords.push(0.5 + 0.5 * s, 0.5 - 0.5 * y * c);  // keeps cross(N, T) along +v
    }
    for (let i = 0; i < segments; i++) {
      const a = center + 1 + i, b = a + 1;
      if (y > 0) indices.push(center, a, b);
      else indices.push(center, b, a);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}


function createSphere(segments = 64) {
    const positions = [], normals = [], tangents = [], texCoords = [], indices = [];

    for (let latitude = 0; latitude <= segments; latitude++) {
        const theta = latitude * Math.PI / segments;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let longitude = 0; longitude <= segments; longitude++) {
            const phi = longitude * 2 * Math.PI / segments;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = sinTheta * cosPhi;
            const y = cosTheta;
            const z = sinTheta * sinPhi;

            positions.push(x, y, z);
            normals.push(x, y, z);

            const tanX = -sinPhi, tanY = 0, tanZ = cosPhi;
            tangents.push(tanX, tanY, tanZ);

            const u = 1 - (longitude/segments), v = 1 - (latitude/segments);
            texCoords.push(u, v);
        }
    }

    for (let latitude = 0; latitude < segments; latitude++) {
        for (let longitude = 0; longitude < segments; longitude++) {
            const first = latitude * (segments + 1) + longitude;
            const second = first + segments + 1;
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }

    return {
        positions: new Float32Array(positions),
        normals: new Float32Array(normals),
        tangents: new Float32Array(tangents),
        texCoords: new Float32Array(texCoords),
        indices: new Uint16Array(indices)
    };
}

function createTorus(segments = 64, innerRadius = 0.25) {
    const positions = [], normals = [], tangents = [], texCoords = [], indices = [];

    for (let ring = 0; ring <= segments; ring++) {
        const phi = ring * 2 * Math.PI / segments;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        for (let seg = 0; seg <= segments; seg++) {
            const theta = seg * 2 * Math.PI / segments;
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            const x = (1 + innerRadius * cosTheta) * cosPhi;
            const y = innerRadius * sinTheta;
            const z = (1 + innerRadius * cosTheta) * sinPhi;

            positions.push(x, y, z);
            
            const nx = cosTheta * cosPhi;
            const ny = sinTheta;
            const nz = cosTheta * sinPhi;

            normals.push(nx, ny, nz);

            const tanX = -sinPhi, tanY = 0, tanZ = cosPhi;
            tangents.push(tanX, tanY, tanZ);

            const u = ring/segments, v = seg/segments;
            texCoords.push(u, v);
        }
    }

    for (let ring = 0; ring < segments; ring++) {
        for (let seg = 0; seg < segments; seg++) {
            const first = ring * (segments + 1) + seg;
            const second = first + segments + 1;
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }

    return {
        positions: new Float32Array(positions),
        normals: new Float32Array(normals),
        tangents: new Float32Array(tangents),
        texCoords: new Float32Array(texCoords),
        indices: new Uint16Array(indices)
    };
}

function createCone(radius = 1, height = 2, segments = 64) {
    const positions = [], normals = [], tangents = [], texCoords = [], indices = [];

    // Cone's Slope
    const slope = Math.sqrt(radius^2 + height^2);
    const cosSlope = radius / slope, sinSlope = height / slope;
    for (let latitude = 0; latitude <= segments; latitude++) {
        const theta = latitude * 2 * Math.PI / segments;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        const x = radius * cosTheta;
        const y = -height/2;
        const z = radius * sinTheta;

        positions.push(x, y, z);
        normals.push(sinSlope * cosTheta, cosSlope, sinSlope * sinTheta);

        const tanX = -sinTheta, tanY = 0, tanZ = cosTheta;
        tangents.push(tanX, tanY, tanZ);

        const u = latitude/segments;
        texCoords.push(u, 0);

        positions.push(0, Math.abs(y), 0);
        normals.push(sinSlope * cosTheta, cosSlope, sinSlope * sinTheta);
        tangents.push(tanX, tanY, tanZ);
        texCoords.push(u, 1);
    }

    for (let latitude = 0; latitude < segments; latitude++) {
        const index = latitude * 2;
        indices.push(index, index + 1, index + 2);
        indices.push(index + 1, index + 3, index + 2);
    }

    // Cone's base
    const baseIndex = positions.length / 3;
    positions.push(0, -height/2, 0);
    normals.push(0, -1, 0);
    tangents.push(1, 0, 0);
    texCoords.push(0.5, 0.5);

    const baseEdgeIndex = positions.length / 3;
    for (let latitude = 0; latitude <= segments; latitude++) {
        const theta = latitude * 2 * Math.PI / segments;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        const x = radius * cosTheta;
        const y = -height/2;
        const z = radius * sinTheta;
        positions.push(x, y, z);
        normals.push(0, -1, 0);
        tangents.push(1, 0, 0);
        texCoords.push(cosTheta * 0.5 + 0.5, sinTheta * 0.5 + 0.5);
    }
    for (let latitude = 0; latitude < segments; latitude++) {
        indices.push(baseIndex, baseEdgeIndex + latitude + 1, baseEdgeIndex + latitude);
    }

    return {
        positions: new Float32Array(positions),
        normals: new Float32Array(normals),
        tangents: new Float32Array(tangents),
        texCoords: new Float32Array(texCoords),
        indices: new Uint16Array(indices)
    };
}