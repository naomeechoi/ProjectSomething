var gl = null;
var vertexColorProgramInfo = null;
var solidColorProgramInfo = null;
var sphereBufferInfo = null;
var perspectiveProjectionMatirx = null;
var cameraMatrix = null;
var worldMatrix = null;
var cameraBufferInfo;
var clipspaceCubeBufferInfo;

export default class SphereShader {
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

    if (!vertexColorProgramInfo || !solidColorProgramInfo) {
      alert("Something's wrong");
    }
  }

  setSphereBufferInfo() {
    let vertices = [];

    var radius = 5;
    var x, y, z, xy; // vertex position
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
        vertices.push(x);
        vertices.push(y);
        vertices.push(z);
      }
    }

    let indices = [];
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

    let positions = [];
    indices.forEach((element) => {
      var firstIdx = (element - 1) * 3;
      positions.push(vertices[firstIdx]);
      positions.push(vertices[firstIdx + 1]);
      positions.push(vertices[firstIdx + 2]);
    });

    sphereBufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
      position: { numComponents: 3, data: positions, type: Float32Array },
    });
    this.slideSettings = [];
  }

  beforeDraw() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.SCISSOR_TEST);

    const effectiveWidth = gl.canvas.clientWidth / 2;
    const aspect = effectiveWidth / gl.canvas.clientHeight;
    const near = 1;
    const far = 2000;

    perspectiveProjectionMatirx = this.slideSettings.cam1Ortho
      ? m4.orthographic(
          -this.slideSettings.cam1OrthoUnits * aspect,
          this.slideSettings.cam1OrthoUnits * aspect,
          -this.slideSettings.cam1OrthoUnits,
          this.slideSettings.cam1OrthoUnits,
          this.slideSettings.cam1Near,
          this.slideSettings.cam1Far
        )
      : m4.perspective(
          degToRad(this.slideSettings.cam1FieldOfView),
          aspect,
          this.slideSettings.cam1Near,
          this.slideSettings.cam1Far
        );
    const cameraPosition = [
      this.slideSettings.cam1PosX,
      this.slideSettings.cam1PosY,
      this.slideSettings.cam1PosZ,
    ];
    const target = [-280, -140 + 950, 0];
    const up = [0, 1, 0];
    cameraMatrix = m4.lookAt(cameraPosition, target, up);
    worldMatrix = m4.yRotation(degToRad(this.slideSettings.rotation));
    worldMatrix = m4.xRotate(
      worldMatrix,
      degToRad(this.slideSettings.rotation)
    );

    gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  drawScene(position, color, scale) {
    const viewMatrix = m4.inverse(cameraMatrix);
    let mat = m4.multiply(perspectiveProjectionMatirx, viewMatrix);

    let tempMat = m4.translate(
      worldMatrix,
      position[0],
      position[1],
      position[2]
    );

    tempMat = m4.scale(tempMat, scale[0], scale[1], scale[2]);

    mat = m4.multiply(mat, tempMat);
    gl.useProgram(vertexColorProgramInfo.program);
    webglUtils.setBuffersAndAttributes(
      gl,
      vertexColorProgramInfo,
      sphereBufferInfo
    );

    webglUtils.setUniforms(vertexColorProgramInfo, {
      u_matrix: mat,
      u_color: color,
    });
    webglUtils.drawBufferInfo(gl, sphereBufferInfo);
  }
}
