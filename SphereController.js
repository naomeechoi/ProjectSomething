// export default SphereControler;
import SphereShader from "./SphereShader.js";
import Sphere from "./Sphere.js";
let shader = new SphereShader();
let spheres = [];

export default class SphereController {
  constructor() {
    var bufferInfoPositions = [];
    var bufferInfoIndices = [];
    this.getBufferIndices(bufferInfoPositions, bufferInfoIndices);
    shader.addSphereBufferInfo(bufferInfoPositions, bufferInfoIndices);

    let color = [150, 50, 0, 1];
    //console.log(tempPositions[0]);
    tempPositions.forEach((element) => {
      for (var i = 1; i < 6; i++) {
        let tempPos = [element[0], element[1], -5 + i * -10];
        spheres.push(new Sphere(tempPos, color));
      }
    });

    this.setSlide();
  }

  setSlide() {
    shader.slideSettings = {
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
    webglLessonsUI.setupUI(
      document.querySelector("#ui"),
      shader.slideSettings,
      [
        {
          type: "slider",
          key: "rotation",
          min: 0,
          max: 360,
          change: this.drawScene,
          precision: 2,
          step: 0.001,
        },
        {
          type: "slider",
          key: "cam1FieldOfView",
          min: 1,
          max: 170,
          change: this.drawScene,
        },
        {
          type: "slider",
          key: "cam1PosX",
          min: -600,
          max: 600,
          change: this.drawScene,
        },
        {
          type: "slider",
          key: "cam1PosY",
          min: -200,
          max: 200,
          change: this.drawScene,
        },
        {
          type: "slider",
          key: "cam1PosZ",
          min: -500,
          max: 500,
          change: this.drawScene,
        },
        {
          type: "slider",
          key: "cam1Near",
          min: 1,
          max: 500,
          change: this.drawScene,
        },
        {
          type: "slider",
          key: "cam1Far",
          min: 1,
          max: 500,
          change: this.drawScene,
        },
        { type: "checkbox", key: "cam1Ortho", change: this.drawScene },
        {
          type: "slider",
          key: "cam1OrthoUnits",
          min: 1,
          max: 150,
          change: this.drawScene,
        },
      ]
    );
  }

  getBufferIndices(positions, indices) {
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
        positions.push(x);
        positions.push(y);
        positions.push(z);
      }
    }

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
  }

  setColorBuffer(colors) {
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
  }

  drawScene() {
    //shader.setSlide();
    //shader.setSlide(this.drawScene());
    shader.beforeDraw();
    //console.log("ddd");

    spheres.forEach((element) => {
      shader.drawScene(element.position, element.color);
    });

    // shader.drawCamera();
  }
}

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
  [-255, 50],
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
  [-295, 0],
  [-255, -50],
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
