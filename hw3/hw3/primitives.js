// cube
const positions = new Float32Array([
    -1, -1, -1,  // 0
     1, -1, -1,  // 1
     1,  1, -1,  // 2
    -1,  1, -1,  // 3
    -1, -1,  1,  // 4
     1, -1,  1,  // 5
     1,  1,  1,  // 6
    -1,  1,  1   // 7
]);

const colors = new Float32Array([
    1,0,0,
    0,1,0,
    0,0,1,
    1,1,0,
    1,0,1,
    0,1,1,
    1,1,0,
    1,0,1
]);

const colorsSphere = new Float32Array([
    1,0,0,
    0,1,0,
    0,0,1,
    1,1,0,
    1,0,1,
    0,1,1
]);

const colorsTorus = new Float32Array([
    0.5,  0,0.5,
    0,    1,  0,
    0.5,0.5,  1
]);

const muscleColor = new Float32Array([
    0.922,0.834,0
]);

const poppingVeinColor = new Float32Array([
    1,0.11,0
]);


const indices = new Uint16Array([
  // Front
  4, 5, 6,   4, 6, 7,
  // Back
  1, 0, 3,   1, 3, 2,
  // Top
  3, 7, 6,   3, 6, 2,
  // Bottom
  0, 1, 5,   0, 5, 4,
  // Right
  1, 2, 6,   1, 6, 5,
  // Left
  0, 4, 7,   0, 7, 3,
]);

// sphere
function createSphere(radius = 1, segments = 20, rings = 20) {
    const positions = [];
    const colors = [];
    const indices = [];

    for (let latitude = 0; latitude <= rings; ++latitude) {
        const theta = latitude * Math.PI / rings;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        // Map latitude to an index in colorsSphere
        const colorIndex = Math.floor((latitude / rings) * (colorsSphere.length / 3 - 0.1));
        const colorOffset = colorIndex * 3;

        for (let longitude = 0; longitude <= segments; ++longitude) {
            const phi = longitude * 2 * Math.PI / segments;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = radius * sinTheta * cosPhi;
            const y = radius * cosTheta;
            const z = radius * sinTheta * sinPhi;

            positions.push(x, y, z);
            // Assign colors
            const r = colorsSphere[colorOffset];
            const g = colorsSphere[colorOffset + 1];
            const b = colorsSphere[colorOffset + 2];
            colors.push(r, g, b);
        }
    }

    for (let latitude = 0; latitude < rings; ++latitude) {
        for (let longitude = 0; longitude < segments; ++longitude) {
            const first = latitude * (segments + 1) + longitude;
            const second = first + segments + 1;
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }

    return {
        positions: new Float32Array(positions),
        colors: new Float32Array(colors),
        indices: new Uint16Array(indices),
        vertexCount: indices.length
    };
}

// torus
function createTorus(outerRadius = 1, innerRadius = 0.3, segments = 30, rings = 20) {
    const positions = [];
    const colors = [];
    const indices = [];

    for (let ring = 0; ring <= rings; ++ring) {
        const phi = ring * 2 * Math.PI / rings;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        // Map latitude to an index in colorsTorus
        const colorIndex = Math.floor((ring / rings) * (colorsTorus.length / 3 - 0.1));
        const colorOffset = colorIndex * 3;

        for (let seg = 0; seg <= segments; ++seg) {
            const theta = seg * 2 * Math.PI / segments;
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            const x = (outerRadius + innerRadius * cosTheta) * cosPhi;
            const y = innerRadius * sinTheta;
            const z = (outerRadius + innerRadius * cosTheta) * sinPhi;

            positions.push(x, y, z);
            // Assign colors
            const r = colorsTorus[colorOffset];
            const g = colorsTorus[colorOffset + 1];
            const b = colorsTorus[colorOffset + 2];
            colors.push(r, g, b);
        }
    }

    for (let ring = 0; ring < rings; ++ring) {
        for (let seg = 0; seg < segments; ++seg) {
            const first = ring * (segments + 1) + seg;
            const second = first + segments + 1;
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }

    return {
        positions: new Float32Array(positions),
        colors: new Float32Array(colors),
        indices: new Uint16Array(indices),
        vertexCount: indices.length
    };
}

// arm
function createArmSegment(radius = 1, segments = 20, rings = 20) {
    const positions = [];
    const colors = [];
    const indices = [];

    for (let latitude = 0; latitude <= rings; ++latitude) {
        const theta = latitude * Math.PI / rings;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let longitude = 0; longitude <= segments; ++longitude) {
            const phi = longitude * 2 * Math.PI / segments;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = radius * sinTheta * cosPhi;
            const y = (radius / 4) * cosTheta;
            const z = (radius / 4) * sinTheta * sinPhi;

            positions.push(x, y, z);
            // Assign colors
            const r = muscleColor[0];
            const g = muscleColor[1];
            const b = muscleColor[2];
            colors.push(r, g, b);
        }
    }

    for (let latitude = 0; latitude < rings; ++latitude) {
        for (let longitude = 0; longitude < segments; ++longitude) {
            const first = latitude * (segments + 1) + longitude;
            const second = first + segments + 1;
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }

    return {
        positions: new Float32Array(positions),
        colors: new Float32Array(colors),
        indices: new Uint16Array(indices),
        vertexCount: indices.length
    };
}