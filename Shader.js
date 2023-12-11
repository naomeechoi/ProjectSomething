var vertexColorProgramInfo;
var solidColorProgramInfo;
var gl;
var sphereBufferInfo;
var cameraBufferInfo;
var clipspaceCubeBufferInfo;
var slideSettings;

export default class Shader {
  constructor() {
    var canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");

    if (!gl) {
      console.log("WebGL not supported, falling back on experimental-webgl");
      gl = canvas.getContext("experimental-webgl");
    }

    if (!gl) {
      alert("Your browser does not support WebGL");
    }

    vertexColorProgramInfo = webglUtils.createProgramInfo(gl, [
      "vertex-shader-3d",
      "fragment-shader-3d",
    ]);

    solidColorProgramInfo = webglUtils.createProgramInfo(gl, [
      "solid-color-vertex-shader",
      "solid-color-fragment-shader",
    ]);

    sphereBufferInfo = this.createSphereBufferInfo(5);
    cameraBufferInfo = this.createCameraBufferInfo(gl, 10);
    clipspaceCubeBufferInfo = this.createClipspaceCubeBufferInfo(gl);
  }

  createSphereBufferInfo(radius = 10) {
    var x, y, z, xy; // vertex position
    var positions = [];
    var stackCount = 10;
    var sectorCount = 10;
    var sectorStep = (2 * Math.PI) / sectorCount;
    var stackStep = Math.PI / stackCount;
    var sectorAngle, stackAngle;
    for (var i = 0; i <= stackCount; ++i) {
      stackAngle = Math.PI / 2 - i * stackStep; // st
      xy = radius * Math.cos(stackAngle); // r * cos(
      z = radius * Math.sin(stackAngle); // r * sin(u
      // add (sectorCount+1) vertices per stack
      // first and last vertices have same position a
      for (var j = 0; j <= sectorCount; ++j) {
        sectorAngle = j * sectorStep; // starting fro
        // vertex position (x, y, z)
        x = xy * Math.cos(sectorAngle); // r * cos(u)
        y = xy * Math.sin(sectorAngle); // r * cos(u)
        positions.push(x);
        positions.push(y);
        positions.push(z);
      }
    }
    var indices = [];
    var k1, k2;
    for (var i = 0; i <= stackCount; ++i) {
      k1 = i * (sectorCount + 1); // beginning of cur
      k2 = k1 + sectorCount + 1; // beginning of next
      for (var j = 0; j <= sectorCount; ++j, ++k1, ++k2) {
        // 2 triangles per sector excluding first and
        // k1 => k2 => k1+1
        if (i != 0) {
          indices.push(k1);
          indices.push(k2);
          indices.push(k1 + 1);
        }
        // k1+1 => k2 => k2+1
        if (i != stackCount - 1) {
          indices.push(k1 + 1);
          indices.push(k2);
          indices.push(k2 + 1);
        }
      }
    }
    var color = [
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
    ];
    var colors = [];
    for (var i = 0; i <= indices.length / 3; i++) {
      colors.push(color[0] * i);
      colors.push(color[1] * i);
      colors.push(color[2] * 1);
    }
    return webglUtils.createBufferInfoFromArrays(gl, {
      position: { numComponents: 3, data: positions, type: Float32Array },
      color: { numComponents: 3, data: colors, type: Uint8Array },
      indices,
    });
  }

  createCameraBufferInfo(gl, scale = 1) {
    const positions = [
      -1,
      -1,
      1, // cube vertices
      1,
      -1,
      1,
      -1,
      1,
      1,
      1,
      1,
      1,
      -1,
      -1,
      3,
      1,
      -1,
      3,
      -1,
      1,
      3,
      1,
      1,
      3,
      0,
      0,
      1, // cone tip
    ];

    const indices = [
      0,
      1,
      1,
      3,
      3,
      2,
      2,
      0, // cube indices
      4,
      5,
      5,
      7,
      7,
      6,
      6,
      4,
      0,
      4,
      1,
      5,
      3,
      7,
      2,
      6,
    ];

    const numSegments = 6;
    const coneBaseIndex = positions.length / 3;
    const coneTipIndex = coneBaseIndex - 1;
    for (let i = 0; i < numSegments; i++) {
      const u = i / numSegments;
      const angle = u * Math.PI * 2;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      positions.push(x, y, 0);
      indices.push(coneTipIndex, coneBaseIndex + i);
      indices.push(coneBaseIndex + i, coneBaseIndex + ((i + 1) % numSegments));
    }
    positions.forEach((v, ndx) => {
      positions[ndx] *= scale;
    });
    return webglUtils.createBufferInfoFromArrays(gl, {
      position: positions,
      indices,
    });
  }

  createClipspaceCubeBufferInfo(gl) {
    // first let's add a cube. It goes from 1 to 3
    // because cameras look down -Z so we want
    // the camera to start at Z = 0. We'll put a
    // a cone in front of this cube opening
    // toward -Z
    const positions = [
      -1,
      -1,
      -1, // cube vertices
      1,
      -1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      -1,
      1,
      1,
      1,
      1,
      1,
    ];
    const indices = [
      0,
      1,
      1,
      3,
      3,
      2,
      2,
      0, // cube indices
      4,
      5,
      5,
      7,
      7,
      6,
      6,
      4,
      0,
      4,
      1,
      5,
      3,
      7,
      2,
      6,
    ];
    return webglUtils.createBufferInfoFromArrays(gl, {
      position: positions,
      indices,
    });
  }

  setSlide() {
    slideSettings = {
      rotation: 0, // in degrees
      cam1FieldOfView: 127, // in degrees
      cam1PosX: -292,
      cam1PosY: 65,
      cam1PosZ: -261,
      cam1Near: 23,
      cam1Far: 500,
      cam1Ortho: false,
      cam1OrthoUnits: 120,
    };
    webglLessonsUI.setupUI(document.querySelector("#ui"), slideSettings, [
      {
        type: "slider",
        key: "rotation",
        min: 0,
        max: 360,
        change: this.render,
        precision: 2,
        step: 0.001,
      },
      {
        type: "slider",
        key: "cam1FieldOfView",
        min: 1,
        max: 170,
        change: this.render,
      },
      {
        type: "slider",
        key: "cam1PosX",
        min: -600,
        max: 600,
        change: this.render,
      },
      {
        type: "slider",
        key: "cam1PosY",
        min: -200,
        max: 200,
        change: this.render,
      },
      {
        type: "slider",
        key: "cam1PosZ",
        min: -500,
        max: 500,
        change: this.render,
      },
      {
        type: "slider",
        key: "cam1Near",
        min: 1,
        max: 500,
        change: this.render,
      },
      {
        type: "slider",
        key: "cam1Far",
        min: 1,
        max: 500,
        change: this.render,
      },
      { type: "checkbox", key: "cam1Ortho", change: this.render },
      {
        type: "slider",
        key: "cam1OrthoUnits",
        min: 1,
        max: 150,
        change: this.render,
      },
    ]);
  }

  render() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.SCISSOR_TEST);

    ///////////////////////////////////////////////////////
    // first view
    ///////////////////////////////////////////////////////
    const effectiveWidth = gl.canvas.clientWidth / 2;
    const aspect = effectiveWidth / gl.canvas.clientHeight;
    const near = 1;
    const far = 2000;

    const perspectiveProjectionMatirx = slideSettings.cam1Ortho
      ? m4.orthographic(
          -slideSettings.cam1OrthoUnits * aspect,
          slideSettings.cam1OrthoUnits * aspect,
          -slideSettings.cam1OrthoUnits,
          slideSettings.cam1OrthoUnits,
          slideSettings.cam1Near,
          slideSettings.cam1Far
        )
      : m4.perspective(
          degToRad(slideSettings.cam1FieldOfView),
          aspect,
          slideSettings.cam1Near,
          slideSettings.cam1Far
        );

    const cameraPosition = [
      slideSettings.cam1PosX,
      slideSettings.cam1PosY,
      slideSettings.cam1PosZ,
    ];

    const target = [-270, 0, 0];
    const up = [0, 1, 0];
    const cameraMatrix = m4.lookAt(cameraPosition, target, up);

    let worldMatrix = m4.yRotation(degToRad(slideSettings.rotation));
    worldMatrix = m4.xRotate(worldMatrix, degToRad(slideSettings.rotation));
    //worldMatrix = m4.translate(worldMatrix, -35, 75, -5);

    const { width, height } = gl.canvas;
    const leftWidth = (width / 2) | 0;

    // draw on the left with orthographic camera
    //gl.viewport(0, 0, leftWidth, height);
    //gl.scissor(0, 0, leftWidth, height);
    gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
    gl.clearColor(0, 0, 0, 1);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var tempPositions = [
      //i
      [85, 50],
      [95, 50],
      [105, 50],
      [115, 50],
      [125, 50],
      [105, 40],
      [105, 30],
      [105, 20],
      [105, 10],
      [105, 0],
      [105, -10],
      [105, -20],
      [105, -30],
      [105, -40],
      [85, -50],
      [95, -50],
      [105, -50],
      [115, -50],
      [125, -50],

      //a
      [35, 50],
      [45, 40],
      [25, 40],
      [55, 30],
      [15, 30],
      [55, 20],
      [15, 20],
      [55, 10],
      [15, 10],
      [55, 0],
      [15, 0],
      [45, 0],
      [35, 0],
      [25, 0],
      [55, -10],
      [15, -10],
      [55, -20],
      [15, -20],
      [55, -30],
      [15, -30],
      [55, -40],
      [15, -40],
      [55, -50],
      [15, -50],

      //m
      [-45, 50],
      [-45, 40],
      [-45, 30],
      [-45, 20],
      [-45, 10],
      [-45, 0],
      [-45, -50],
      [-45, -40],
      [-45, -30],
      [-45, -20],
      [-45, -10],
      [-45, 50],
      [-5, 50],
      [-5, 40],
      [-5, 30],
      [-5, 20],
      [-5, 10],
      [-5, 0],
      [-5, -50],
      [-5, -40],
      [-5, -30],
      [-5, -20],
      [-5, -10],
      [-15, 40],
      [-35, 40],
      [-25, 0],
      [-25, 10],
      [-25, 20],
      [-25, 30],

      //s
      [-95, 50],
      [-85, 40],
      [-105, 40],
      [-75, 30],
      [-115, 30],
      [-75, 20],
      [-85, 10],
      [-95, 0],
      [-105, 0],
      [-115, -10],
      [-115, -20],
      [-115, -30],
      [-105, -40],
      [-95, -50],
      [-85, -40],
      [-75, -30],

      //0
      [-155, 50],
      [-145, 40],
      [-165, 40],
      [-135, 30],
      [-135, 20],
      [-135, 10],
      [-135, 0],
      [-135, -10],
      [-135, -20],
      [-135, -30],
      [-175, 30],
      [-175, 20],
      [-175, 10],
      [-175, 0],
      [-175, -10],
      [-175, -20],
      [-175, -30],
      [-145, -40],
      [-165, -40],
      [-155, -50],

      //m
      [-195, 50],
      [-195, 40],
      [-195, 30],
      [-195, 20],
      [-195, 10],
      [-195, 0],
      [-195, -50],
      [-195, -40],
      [-195, -30],
      [-195, -20],
      [-195, -10],
      [-195, 50],
      [-235, 50],
      [-235, 40],
      [-235, 30],
      [-235, 20],
      [-235, 10],
      [-235, 0],
      [-235, -50],
      [-235, -40],
      [-235, -30],
      [-235, -20],
      [-235, -10],
      [-225, 40],
      [-205, 40],
      [-215, 0],
      [-215, 10],
      [-215, 20],
      [-215, 30],

      //e
      //[-255, 50],
      [-265, 50],
      [-275, 50],
      [-285, 50],
      [-295, 50],
      [-255, 40],
      [-255, 30],
      [-255, 20],
      [-255, 10],
      [-255, 0],
      [-265, 0],
      [-275, 0],
      [-285, 0],
      //[-295, 0],
      //[-255, -50],
      [-265, -50],
      [-275, -50],
      [-285, -50],
      [-295, -50],
      [-255, -40],
      [-255, -30],
      [-255, -20],
      [-255, -10],
      [-235, 0],

      //t
      [-315, 50],
      [-325, 50],
      [-335, 50],
      [-345, 50],
      [-355, 50],
      [-335, 40],
      [-335, 30],
      [-335, 20],
      [-335, 10],
      [-335, 0],
      [-335, -10],
      [-335, -20],
      [-335, -30],
      [-335, -40],
      [-335, -50],

      //h
      [-375, 50],
      [-375, 40],
      [-375, 30],
      [-375, 20],
      [-375, 10],
      [-375, 0],
      [-375, -10],
      [-375, -20],
      [-375, -30],
      [-375, -40],
      [-375, -50],
      [-415, 50],
      [-415, 40],
      [-415, 30],
      [-415, 20],
      [-415, 10],
      [-415, 0],
      [-415, -10],
      [-415, -20],
      [-415, -30],
      [-415, -40],
      [-415, -50],
      [-385, 0],
      [-395, 0],
      [-405, 0],

      //i
      [-435, 50],
      [-445, 50],
      [-455, 50],
      [-465, 50],
      [-475, 50],
      [-455, 40],
      [-455, 30],
      [-455, 20],
      [-455, 10],
      [-455, 0],
      [-455, -10],
      [-455, -20],
      [-455, -30],
      [-455, -40],
      [-435, -50],
      [-445, -50],
      [-455, -50],
      [-465, -50],
      [-475, -50],

      //n
      [-495, 50],
      [-495, 40],
      [-495, 30],
      [-495, 20],
      [-495, 10],
      [-495, 0],
      [-495, -10],
      [-495, -20],
      [-495, -30],
      [-495, -40],
      [-495, -50],
      [-535, 50],
      [-535, 40],
      [-535, 30],
      [-535, 20],
      [-535, 10],
      [-535, 0],
      [-535, -10],
      [-535, -20],
      [-535, -30],
      [-535, -40],
      [-535, -50],
      [-505, 0],
      [-515, -10],
      [-525, -20],

      //0
      [-575, 50],
      [-565, 40],
      [-585, 40],
      [-555, 30],
      [-555, 20],
      [-555, 10],
      [-555, 0],
      [-585, 0],
      [-555, -10],
      [-555, -20],
      [-555, -30],
      [-565, -40],
      [-575, -50],
      [-595, -50],
      [-585, -40],
      [-595, -40],
      [-595, -30],
      [-595, -20],
      [-595, -10],
      [-595, 0],
      [-155, -50],
    ];

    tempPositions.forEach((element) => {
      for (var i = 1; i < 6; i++) {
        var tempMat = m4.translate(
          worldMatrix,
          element[0],
          element[1],
          -5 + i * -10
        );
        drawScene(perspectiveProjectionMatirx, cameraMatrix, tempMat);
      }

      //var tempMat = m4.translate(worldMatrix, element[0], element[1], -5);
      //drawScene(perspectiveProjectionMatirx, cameraMatrix, tempMat);
    });

    ///////////////////////////////////////////////////////
    // end first view
    ///////////////////////////////////////////////////////

    /*
    ///////////////////////////////////////////////////////
    // second view
    ///////////////////////////////////////////////////////
    const rightWidth = width - leftWidth;
    gl.viewport(leftWidth, 0, rightWidth, height);
    gl.scissor(leftWidth, 0, rightWidth, height);
    gl.clearColor(0.8, 0.8, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const perspectiveProjectionMatirx2 = m4.perspective(
      degToRad(60),
      aspect,
      near,
      far
    );

    const cameraPosition2 = [-600, 400, -400];
    const target2 = [0, 0, 0];
    const cameraMatrix2 = m4.lookAt(cameraPosition2, target2, up);

    tempPositions.forEach((element) => {
      var tempMat = m4.translate(worldMatrix, element[0], element[1], -5);
      drawScene(perspectiveProjectionMatirx2, cameraMatrix2, tempMat);
    });
    ///////////////////////////////////////////////////////
    // end second view
    ///////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////
    // draw camera and clip space
    ///////////////////////////////////////////////////////
    {
      const viewMatrix = m4.inverse(cameraMatrix2);
      let mat = m4.multiply(perspectiveProjectionMatirx2, viewMatrix);
      mat = m4.multiply(mat, cameraMatrix);
      gl.useProgram(solidColorProgramInfo.program);

      webglUtils.setBuffersAndAttributes(
        gl,
        solidColorProgramInfo,
        cameraBufferInfo
      );
      webglUtils.setUniforms(solidColorProgramInfo, {
        u_matrix: mat,
        u_color: [0, 0, 0, 1],
      });
      webglUtils.drawBufferInfo(gl, cameraBufferInfo, gl.LINES);

      mat = m4.multiply(mat, m4.inverse(perspectiveProjectionMatirx));
      webglUtils.setBuffersAndAttributes(
        gl,
        solidColorProgramInfo,
        clipspaceCubeBufferInfo
      );
      webglUtils.setUniforms(solidColorProgramInfo, {
        u_matrix: mat,
        u_color: [0, 0, 0, 1],
      });
      webglUtils.drawBufferInfo(gl, clipspaceCubeBufferInfo, gl.LINES);
    }*/

    function drawScene(projectionMatrix, cameraMatrix, worldMatrix) {
      const viewMatrix = m4.inverse(cameraMatrix);
      let mat = m4.multiply(projectionMatrix, viewMatrix);
      mat = m4.multiply(mat, worldMatrix);
      gl.useProgram(vertexColorProgramInfo.program);
      webglUtils.setBuffersAndAttributes(
        gl,
        vertexColorProgramInfo,
        sphereBufferInfo
      );
      webglUtils.setUniforms(vertexColorProgramInfo, { u_matrix: mat });
      webglUtils.drawBufferInfo(gl, sphereBufferInfo);
    }
  }
}

var m3 = {
  multiply: function (a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];

    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },

  identity: function () {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  },

  translation: function (tx, ty) {
    return [1, 0, 0, 0, 1, 0, tx, ty, 1];
  },

  rotation: function (angleInDegrees) {
    var angleInRadians = (angleInDegrees * Math.PI) / 180;
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [c, -s, 0, s, c, 0, 0, 0, 1];
  },

  scailing: function (sx, sy) {
    return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
  },

  projection: function (width, height) {
    return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1];
  },
};

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
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

var m4 = {
  lookAt: function (cameraPosition, target, up) {
    var zAxis = normalize(subtractVectors(cameraPosition, target));
    var xAxis = normalize(cross(up, zAxis));
    var yAxis = normalize(cross(zAxis, xAxis));

    return [
      xAxis[0],
      xAxis[1],
      xAxis[2],
      0,
      yAxis[0],
      yAxis[1],
      yAxis[2],
      0,
      zAxis[0],
      zAxis[1],
      zAxis[2],
      0,
      cameraPosition[0],
      cameraPosition[1],
      cameraPosition[2],
      1,
    ];
  },

  projection: function (width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
      2 / width,
      0,
      0,
      0,
      0,
      -2 / height,
      0,
      0,
      0,
      0,
      2 / depth,
      0,
      -1,
      1,
      0,
      1,
    ];
  },

  perspective: function (fieldOfViewInRadians, aspect, near, far) {
    var f = 1 / Math.tan(0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    return [
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * rangeInv,
      -1,
      0,
      0,
      near * far * rangeInv * 2,
      0,
    ];
  },

  orthographic: function (left, right, bottom, top, near, far, dst) {
    dst = dst || new Float32Array(16);

    dst[0] = 2 / (right - left);
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = 0;
    dst[5] = 2 / (top - bottom);
    dst[6] = 0;
    dst[7] = 0;
    dst[8] = 0;
    dst[9] = 0;
    dst[10] = 2 / (near - far);
    dst[11] = 0;
    dst[12] = (left + right) / (left - right);
    dst[13] = (bottom + top) / (bottom - top);
    dst[14] = (near + far) / (near - far);
    dst[15] = 1;

    return dst;
  },

  multiply: function (a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function (tx, ty, tz) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
  },

  xRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  },

  yRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  },

  zRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },

  scaling: function (sx, sy, sz) {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
  },

  makeZToMatrix: function (fudgeFactor) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, fudgeFactor, 0, 0, 0, 1];
  },

  translate: function (m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function (m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

  inverse: function (m) {
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0 = m22 * m33;
    var tmp_1 = m32 * m23;
    var tmp_2 = m12 * m33;
    var tmp_3 = m32 * m13;
    var tmp_4 = m12 * m23;
    var tmp_5 = m22 * m13;
    var tmp_6 = m02 * m33;
    var tmp_7 = m32 * m03;
    var tmp_8 = m02 * m23;
    var tmp_9 = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;

    var t0 =
      tmp_0 * m11 +
      tmp_3 * m21 +
      tmp_4 * m31 -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 =
      tmp_1 * m01 +
      tmp_6 * m21 +
      tmp_9 * m31 -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 =
      tmp_2 * m01 +
      tmp_7 * m11 +
      tmp_10 * m31 -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 =
      tmp_5 * m01 +
      tmp_8 * m11 +
      tmp_11 * m21 -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d *
        (tmp_1 * m10 +
          tmp_2 * m20 +
          tmp_5 * m30 -
          (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d *
        (tmp_0 * m00 +
          tmp_7 * m20 +
          tmp_8 * m30 -
          (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d *
        (tmp_3 * m00 +
          tmp_6 * m10 +
          tmp_11 * m30 -
          (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d *
        (tmp_4 * m00 +
          tmp_9 * m10 +
          tmp_10 * m20 -
          (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d *
        (tmp_12 * m13 +
          tmp_15 * m23 +
          tmp_16 * m33 -
          (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d *
        (tmp_13 * m03 +
          tmp_18 * m23 +
          tmp_21 * m33 -
          (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d *
        (tmp_14 * m03 +
          tmp_19 * m13 +
          tmp_22 * m33 -
          (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d *
        (tmp_17 * m03 +
          tmp_20 * m13 +
          tmp_23 * m23 -
          (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d *
        (tmp_14 * m22 +
          tmp_17 * m32 +
          tmp_13 * m12 -
          (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d *
        (tmp_20 * m32 +
          tmp_12 * m02 +
          tmp_19 * m22 -
          (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d *
        (tmp_18 * m12 +
          tmp_23 * m32 +
          tmp_15 * m02 -
          (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d *
        (tmp_22 * m22 +
          tmp_16 * m02 +
          tmp_21 * m12 -
          (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
    ];
  },

  vectorMultiply: function (v, m) {
    var dst = [];
    for (var i = 0; i < 4; i++) {
      dst[i] = 0.0;
      for (var j = 0; j < 4; j++) {
        dst[i] += v[j] * m[j * 4 + 1];
      }
    }
  },
};

function degToRad(degree) {
  return (degree * Math.PI) / 180;
}
