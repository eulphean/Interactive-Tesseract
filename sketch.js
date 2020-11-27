var points = []; 
var angle = 0; 
var projected3d = []; 
var gui; 

// GUI Parameters. 
var params = {
  debug: true,
  angleOffset: 0.005,
  angleOffsetMin: 0.0001,
  angleOffsetMax: 0.1,
  angleOffsetStep: 0.0001,
  sphereRad: 5,
  sphereRadMin: 1,
  sphereRadMax: 10,
  sphereRadStep: 0.5,
  w: 0, 
  wMin: -5,
  wMax: 5,
  wStep: 0.1,
  d: 2,
  dMin: -5,
  dMax: 5,
  dStep: 0.1,
  orbitControls: false,
  xy: false,
  yz: false,
  xz: false, 
  xw: false,
  yw: false,
  zw: false
}

// Build rotations. 

// Default
let rIdentity = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];

function setup() {
  // put setup code here
  createCanvas(600, 600, WEBGL); 
  camera(0, 0, 500, 0, 0, 0, 0, 1, 0);
  background(153); 

  gui = createGui('Tesseract');
  console.log(gui);
  gui.addObject(params); 
}

function draw() {
  background(153); 

  if (params.debug) {
    debugMode();
  } else {
    debugMode(AXES);
  }

  // 8 points of the cube
  points[0] = new vec4(-1, -1, -1, params.w); 
  points[1] = new vec4(1, -1, -1, params.w); 
  points[2] = new vec4(1, 1, -1, params.w); 
  points[3] = new vec4(-1, 1, -1, params.w); 
  points[4] = new vec4(-1, -1, 1, params.w); 
  points[5] = new vec4(1, -1, 1, params.w); 
  points[6] = new vec4(1, 1, 1, params.w); 
  points[7] = new vec4(-1, 1, 1, params.w); 

  // 8 points of the hyper cube. 
  points[8] = new vec4(-1, -1, -1, -params.w); 
  points[9] = new vec4(1, -1, -1, -params.w); 
  points[10] = new vec4(1, 1, -1, -params.w); 
  points[11] = new vec4(-1, 1, -1, -params.w); 
  points[12] = new vec4(-1, -1, 1, -params.w); 
  points[13] = new vec4(1, -1, 1, -params.w); 
  points[14] = new vec4(1, 1, 1, -params.w); 
  points[15] = new vec4(-1, 1, 1, -params.w); 

  // Enable orbital controls. 
  if (params.orbitControls) {
      orbitControl();
  }
  push();

  for (let i = 0; i < points.length; i++) {
    let vec = points[i]; 

    // Construct rotation matrix. 
    let rMat = getRotation(vec); 

     // Projectiion matrix to convert from 4D to 3D
    // Orthographic projection if w = 1 = It will look like a cube
    let d = params.d; 
    let w = 1 / (d - rMat.w); 
    let projectionMat = [
      [w, 0, 0, 0],
      [0, w, 0, 0],
      [0, 0, w, 0]
    ]; 

    let projected = matmulvec4(projectionMat, rMat);
    projected.mult(50); 
    projected3d[i] = projected; 

    push();
    translate(projected.x, projected.y, projected.z); 
    sphere(params.sphereRad);
    pop();
  }; 

  // Connect outer cube. 
  for (let i = 0; i < 4; i++) {
    connect(0, i, (i + 1) % 4, projected3d);
    connect(0, i + 4, ((i + 1) % 4) + 4, projected3d);
    connect(0, i, i + 4, projected3d);
  }

  // Coonnect inner cube. 
  for (let i = 0; i < 4; i++) {
    connect(8, i, (i + 1) % 4, projected3d);
    connect(8, i + 4, ((i + 1) % 4) + 4, projected3d);
    connect(8, i, i + 4, projected3d);
  }

   // Coonnect the two cubes.  
   for (let i = 0; i < 8; i++) {
    connect(0, i, i+8, projected3d);
  }
  
  pop();

  angle -= params.angleOffset;
}

function connect(offset, i, j, points) {
  const a = points[i + offset];
  const b = points[j + offset];
  push();
  strokeWeight(1);
  stroke(255, 0, 0);
  line(a.x, a.y, a.z, b.x, b.y, b.z);
  pop();
}

function keyTyped() {
  if (key === 'h') {
    gui.toggleVisibility();
  }
}

function getRotation(vec) {
  let rotation = matmul(rIdentity, vec); 
  let mat; 
  if (params.xy) {
     mat = rotateXY(angle); 
     rotation = matmulvec4(mat, rotation);
  }

  if (params.yz) {
    mat = rotateYZ(angle); 
    rotation = matmulvec4(mat, rotation); 
  }

  if (params.xz) {
    mat = rotateXZ(angle); 
    rotation = matmulvec4(mat, rotation); 
  }

  if (params.xw) {
    mat = rotateXW(angle); 
    rotation = matmulvec4(mat, rotation); 
  }

  if (params.yw) {
    mat = rotateYW(angle);
    rotation = matmulvec4(mat, rotation); 
  }

  if (params.zw) {
    mat = rotateZW(angle);
    rotation = matmulvec4(mat, rotation); 
  }

  return rotation;
}