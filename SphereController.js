// export default SphereControler;
import SphereShader from "./SphereShader.js";
import Sphere from "./Sphere.js";
import PhysicalEngine from "./PhysicalEngine.js";
let shader = new SphereShader();
let physicalE = new PhysicalEngine();
let spheres = [];
let wordArrays = [];

export default class SphereController {
  constructor() {
    var bufferInfoPositions = [];
    var bufferInfoIndices = [];
    this.getBufferIndices(bufferInfoPositions, bufferInfoIndices);
    shader.addSphereBufferInfo(bufferInfoPositions, bufferInfoIndices);

    wordArrays.push(word_1);
    wordArrays.push(word_2);
    wordArrays.push(word_3);
    wordArrays.push(word_4);
    wordArrays.push(word_5);
    wordArrays.push(word_6);
    wordArrays.push(word_7);
    wordArrays.push(word_8);
    wordArrays.push(word_9);
    wordArrays.push(word_10);
    wordArrays.push(word_11);
    wordArrays.push(word_12);
    //
    var variation = 0.07; //0.35;

    wordArrays.forEach((array) => {
      let tempColor = [
        Math.random() + variation,
        Math.random() + variation,
        Math.random() + variation,
        1,
      ];

      let tempArray = [];
      //let tempColor = [Math.random(), Math.random(), Math.random(), 1];
      array.forEach((element) => {
        for (let i = 10; i > 0; i--) {
          let color = [
            Math.random() - variation * i,
            Math.random() - variation * i,
            Math.random() - variation * i,
            1,
          ];

          let tempPos = [element[0], element[1], element[2] + i * 10];
          tempArray.push(new Sphere(tempPos, color, SOLID));
        }
      });
      spheres.push(tempArray);
    });
    //spheres.push(new Sphere([-300, 800, 0], [0.5, 0.5, 1, 1], SOLID));
    //spheres.push(new Sphere([-300, 700, 0], [0.5, 1, 0.5, 1], SOLID));
    //spheres.push(new Sphere([-300, 600, 0], [1, 0.5, 0.5, 1], SOLID));
    this.setSlide();
  }

  startMoveSpheres() {
    spheres.forEach((sphereArray) => {
      sphereArray.forEach((sphere) => {
        if (sphere.state == SOLID) {
          sphere.state = LIQUID;
          sphere.direction = DOWNVECTOR;
          sphere.scalar = (sphere.position[1] - BOTTOM) * 9.8 * sphere.mass;
        }
      });
    });
  }

  moveSpheres() {
    let radius = 5;
    spheres.forEach((sphereArray1) => {
      sphereArray1.forEach((sphere1) => {
        sphereArray1.forEach((sphere2) => {
          if (sphere1 != sphere2) {
            physicalE.checkElasticCollision(sphere1, sphere2, radius);
          }
        });
        physicalE.checkBoundaryHit_TopBottom(sphere1, 5);
        physicalE.setPosition(sphere1);
      });
    });
  }

  drawScene() {
    shader.beforeDraw();

    spheres.forEach((sphereArray) => {
      sphereArray.forEach((sphere) => {
        physicalE.gravity(sphere);
        shader.drawScene(sphere.position, sphere.color);
      });
    });
  }

  setSlide() {
    shader.slideSettings = {
      rotation: 0, // in degrees
      cam1FieldOfView: 100, // in degrees
      cam1PosX: -310,
      cam1PosY: 115 + 950,
      cam1PosZ: -264,
      cam1Near: 23,
      cam1Far: 2000,
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
}

var word_1 = [
  //i
  [85, 850, -5],
  [95, 850, -5],
  [105, 850, -5],
  [115, 850, -5],
  [125, 850, -5],
  [105, 840, -5],
  [105, 830, -5],
  [105, 820, -5],
  [105, 810, -5],
  [105, 800, -5],
  [105, 790, -5],
  [105, 780, -5],
  [105, 770, -5],
  [105, 760, -5],
  [85, 750, -5],
  [95, 750, -5],
  [105, 750, -5],
  [115, 750, -5],
  [125, 750, -5],
];

var word_2 = [
  //a
  [35, 850, -5],
  [45, 840, -5],
  [25, 840, -5],
  [55, 830, -5],
  [15, 830, -5],
  [55, 820, -5],
  [15, 820, -5],
  [55, 810, -5],
  [15, 810, -5],
  [55, 800, -5],
  [15, 800, -5],
  [45, 800, -5],
  [35, 800, -5],
  [25, 800, -5],
  [55, 790, -5],
  [15, 790, -5],
  [55, 780, -5],
  [15, 780, -5],
  [55, 770, -5],
  [15, 770, -5],
  [55, 760, -5],
  [15, 760, -5],
  [55, 750, -5],
  [15, 750, -5],
];

var word_3 = [
  //m
  [-45, 850, -5],
  [-45, 840, -5],
  [-45, 830, -5],
  [-45, 820, -5],
  [-45, 810, -5],
  [-45, 800, -5],
  [-45, 750, -5],
  [-45, 760, -5],
  [-45, 770, -5],
  [-45, 780, -5],
  [-45, 790, -5],
  [-45, 850, -5],
  [-5, 850, -5],
  [-5, 840, -5],
  [-5, 830, -5],
  [-5, 820, -5],
  [-5, 810, -5],
  [-5, 800, -5],
  [-5, 750, -5],
  [-5, 760, -5],
  [-5, 770, -5],
  [-5, 780, -5],
  [-5, 790, -5],
  [-15, 840, -5],
  [-35, 840, -5],
  [-25, 800, -5],
  [-25, 810, -5],
  [-25, 820, -5],
  [-25, 830, -5],
];

var word_4 = [
  //s
  [-95, 850, -5],
  [-85, 840, -5],
  [-105, 840, -5],
  [-75, 830, -5],
  [-115, 830, -5],
  [-75, 820, -5],
  [-85, 810, -5],
  [-95, 800, -5],
  [-105, 800, -5],
  [-115, 790, -5],
  [-115, 780, -5],
  [-115, 770, -5],
  [-105, 760, -5],
  [-95, 750, -5],
  [-85, 760, -5],
  [-75, 770, -5],
];

var word_5 = [
  //0
  [-155, 850, -5],
  [-145, 840, -5],
  [-165, 840, -5],
  [-135, 830, -5],
  [-135, 820, -5],
  [-135, 810, -5],
  [-135, 800, -5],
  [-135, 790, -5],
  [-135, 780, -5],
  [-135, 770, -5],
  [-175, 830, -5],
  [-175, 820, -5],
  [-175, 810, -5],
  [-175, 800, -5],
  [-175, 790, -5],
  [-175, 780, -5],
  [-175, 770, -5],
  [-145, 760, -5],
  [-165, 760, -5],
  [-155, 750, -5],
];

var word_6 = [
  //m
  [-195, 850, -5],
  [-195, 840, -5],
  [-195, 830, -5],
  [-195, 820, -5],
  [-195, 810, -5],
  [-195, 800, -5],
  [-195, 750, -5],
  [-195, 760, -5],
  [-195, 770, -5],
  [-195, 780, -5],
  [-195, 790, -5],
  [-195, 850, -5],
  [-235, 850, -5],
  [-235, 840, -5],
  [-235, 830, -5],
  [-235, 820, -5],
  [-235, 810, -5],
  [-235, 800, -5],
  [-235, 750, -5],
  [-235, 760, -5],
  [-235, 770, -5],
  [-235, 780, -5],
  [-235, 790, -5],
  [-225, 840, -5],
  [-205, 840, -5],
  [-215, 800, -5],
  [-215, 810, -5],
  [-215, 820, -5],
  [-215, 830, -5],
];

var word_7 = [
  //e
  [-255, 850, -5],
  [-265, 850, -5],
  [-275, 850, -5],
  [-285, 850, -5],
  [-295, 850, -5],
  [-255, 840, -5],
  [-255, 830, -5],
  [-255, 820, -5],
  [-255, 810, -5],
  [-255, 800, -5],
  [-265, 800, -5],
  [-275, 800, -5],
  [-285, 800, -5],
  [-295, 800, -5],
  [-255, 750, -5],
  [-265, 750, -5],
  [-275, 750, -5],
  [-285, 750, -5],
  [-295, 750, -5],
  [-255, 760, -5],
  [-255, 770, -5],
  [-255, 780, -5],
  [-255, 790, -5],
];

var word_8 = [
  //t
  [-315, 850, -5],
  [-325, 850, -5],
  [-335, 850, -5],
  [-345, 850, -5],
  [-355, 850, -5],
  [-335, 840, -5],
  [-335, 830, -5],
  [-335, 820, -5],
  [-335, 810, -5],
  [-335, 800, -5],
  [-335, 790, -5],
  [-335, 780, -5],
  [-335, 770, -5],
  [-335, 760, -5],
  [-335, 750, -5],
];

var word_9 = [
  //h
  [-375, 850, -5],
  [-375, 840, -5],
  [-375, 830, -5],
  [-375, 820, -5],
  [-375, 810, -5],
  [-375, 800, -5],
  [-375, 790, -5],
  [-375, 780, -5],
  [-375, 770, -5],
  [-375, 760, -5],
  [-375, 750, -5],
  [-415, 850, -5],
  [-415, 840, -5],
  [-415, 830, -5],
  [-415, 820, -5],
  [-415, 810, -5],
  [-415, 800, -5],
  [-415, 790, -5],
  [-415, 780, -5],
  [-415, 770, -5],
  [-415, 760, -5],
  [-415, 750, -5],
  [-385, 800, -5],
  [-405, 800, -5],
  [-395, 800, -5],
];

var word_10 = [
  //i
  [-435, 850, -5],
  [-445, 850, -5],
  [-455, 850, -5],
  [-465, 850, -5],
  [-475, 850, -5],
  [-455, 840, -5],
  [-455, 830, -5],
  [-455, 820, -5],
  [-455, 810, -5],
  [-455, 800, -5],
  [-455, 790, -5],
  [-455, 780, -5],
  [-455, 770, -5],
  [-455, 760, -5],
  [-435, 750, -5],
  [-445, 750, -5],
  [-455, 750, -5],
  [-465, 750, -5],
  [-475, 750, -5],
];

var word_11 = [
  //n
  [-495, 850, -5],
  [-495, 840, -5],
  [-495, 830, -5],
  [-495, 820, -5],
  [-495, 810, -5],
  [-495, 800, -5],
  [-495, 790, -5],
  [-495, 780, -5],
  [-495, 770, -5],
  [-495, 760, -5],
  [-495, 750, -5],
  [-535, 850, -5],
  [-535, 840, -5],
  [-535, 830, -5],
  [-535, 820, -5],
  [-535, 810, -5],
  [-535, 800, -5],
  [-535, 790, -5],
  [-535, 780, -5],
  [-535, 770, -5],
  [-535, 760, -5],
  [-535, 750, -5],
  [-505, 800, -5],
  [-525, 780, -5],
  [-515, 790, -5],
];

var word_12 = [
  //g
  [-575, 850, -5],
  [-565, 840, -5],
  [-585, 840, -5],
  [-555, 830, -5],
  [-555, 820, -5],
  [-555, 810, -5],
  [-555, 800, -5],
  [-585, 800, -5],
  [-555, 790, -5],
  [-555, 780, -5],
  [-555, 770, -5],
  [-565, 760, -5],
  [-575, 750, -5],
  [-595, 750, -5],
  [-585, 760, -5],
  [-595, 760, -5],
  [-595, 770, -5],
  [-595, 780, -5],
  [-595, 790, -5],
  [-595, 800, -5],
];
