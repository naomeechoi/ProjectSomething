const FRAMERATE = 1 / 60;
const SECOND = 1000;

// sphere states
const SOLID = 0;
const LIQUID = 1;
const FLOWING_LIQUID = 2;
const GAS = 3;
const FINAL = 4;

const SPHERERADIUS = 5;

let UP = [0, 1, 0];
let DOWN = [0, -1, 0];

const TOP = 1500;
const BOTTOM = 400;
const LEFT = -2000;
const RIGHT = 400;
const FRONT = -700;
const BACK = 2000;

function isSameVectors(a, b) {
  if (a[0] == b[0] && a[1] == b[1] && a[2] == b[2]) {
    return true;
  }

  return false;
}

function addVectors(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function multiplyVectorByScalar(scalar, vector) {
  return [scalar * vector[0], scalar * vector[1], scalar * vector[2]];
}

function divideVectorByScalar(scalar, vector) {
  return [vector[0] / scalar, vector[1] / scalar, vector[2] / scalar];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function getScalarFromVector(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function normalize(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
