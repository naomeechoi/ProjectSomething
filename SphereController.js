// export default SphereControler;
import SphereShader from "./SphereShader.js";
import Sphere from "./Sphere.js";
import PhysicalEngine from "./PhysicalEngine.js";

export default class SphereController {
  constructor() {
    this.shader = new SphereShader();
    this.physicalEngine = new PhysicalEngine();
    this.spheres = [];

    this.shader.setSphereBufferInfo();
    this.addSpheres();
    this.setSlide();
  }

  addSpheres() {
    let arrays = [];
    letterArray.forEach((array) => {
      arrays.push(array);
    });

    var variation = 0.085;
    arrays.forEach((array) => {
      let tempColor = [
        1 - Math.random() * 0.5,
        1 - Math.random() * 0.5,
        1 - Math.random() * 0.5,
        1,
      ];
      array.forEach((element) => {
        let tempArray = [];
        element.forEach((positions) => {
          let color = [
            tempColor[0] - (positions[2] / 5) * variation,
            tempColor[1] - (positions[2] / 5) * variation,
            tempColor[2] - (positions[2] / 5) * variation,
            1,
          ];
          tempArray.push(new Sphere(positions, color, [1, 1, 1], SOLID));
        });
        this.spheres.push(tempArray);

        for (let i = 1; i < 5; i++) {
          let tempBigArray = [];
          element.forEach((positions) => {
            let tempArray = [];
            tempArray.push(positions[0]);
            tempArray.push(positions[1]);
            tempArray.push(positions[2] + i * SPHERERADIUS * 2);
            //45 35 25 15 5

            let color = [
              tempColor[0] - (tempArray[2] / 5) * variation,
              tempColor[1] - (tempArray[2] / 5) * variation,
              tempColor[2] - (tempArray[2] / 5) * variation,
              1,
            ];

            tempBigArray.push(new Sphere(tempArray, color, [1, 1, 1], SOLID));
          });
          this.spheres.push(tempBigArray);
        }
      });
    });

    this.spheres.forEach((array) => {
      for (var i = 0; i < array.length; i++) {
        if (i > 0) {
          array[i].upSphere = array[i - 1];
        }

        if (i < array.length - 1) {
          array[i].downSphere = array[i + 1];
        }
      }
    });
  }

  changeSpheresState(wheel) {
    this.spheres.forEach((sphereArray) => {
      sphereArray.forEach((sphere) => {
        if (sphere.changeState(wheel)) {
          this.physicalEngine.setPositionWithoutGravity(sphere);
        }
      });
    });
  }

  upSpheresSpeed(wheel) {
    this.spheres.forEach((sphereArray) => {
      sphereArray.forEach((sphere) => {
        sphere.upSpeed(wheel);
      });
    });
  }

  collisionSpheres() {
    this.spheres.forEach((sphereArray1) => {
      sphereArray1.forEach((sphere1) => {
        if (sphere1.state != FLOWING_LIQUID) {
          sphereArray1.forEach((sphere2) => {
            if (sphere1 != sphere2) {
              this.physicalEngine.checkCollisionBetweenSphere(sphere1, sphere2);
            }
          });
        }
        this.physicalEngine.checkBoundaryHit(sphere1, Y);
        this.physicalEngine.checkBoundaryHit(sphere1, X);
        this.physicalEngine.checkBoundaryHit(sphere1, Z);
      });
    });
  }

  moveSpheres() {
    this.spheres.forEach((sphereArray) => {
      sphereArray.forEach((sphere) => {
        this.physicalEngine.setPositionWithGravity(sphere);
      });
    });
  }

  drawScene() {
    this.shader.beforeDraw();

    this.spheres.forEach((sphereArray) => {
      sphereArray.forEach((sphere) => {
        this.physicalEngine.gravity(sphere);
        this.shader.drawScene(sphere.position, sphere.color, sphere.scale);
      });
    });
  }

  setSlide() {
    this.shader.slideSettings = {
      rotation: 0, // in degrees
      cam1FieldOfView: 112, // in degrees
      cam1PosX: 16,
      cam1PosY: 115 + 950,
      cam1PosZ: -270,
      cam1Near: 23,
      cam1Far: 2000,
      cam1Ortho: false,
      cam1OrthoUnits: 120,
    };

    /*
    webglLessonsUI.setupUI(
      document.querySelector("#ui"),
      this.shader.slideSettings,
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
    );*/
  }
}

var letterArray = [
  [
    //i
    [
      [85, 850, 5],
      [85, 750, 5],
    ],

    [
      [95, 850, 5],
      [95, 750, 5],
    ],

    [
      [105, 850, 5],
      [105, 840, 5],
      [105, 830, 5],
      [105, 820, 5],
      [105, 810, 5],
      [105, 800, 5],
      [105, 790, 5],
      [105, 780, 5],
      [105, 770, 5],
      [105, 760, 5],
      [105, 750, 5],
    ],

    [
      [115, 850, 5],
      [115, 750, 5],
    ],

    [
      [125, 850, 5],
      [125, 750, 5],
    ],
  ],

  [
    //a
    [
      [35, 850, 5],
      [35, 800, 5],
    ],

    [
      [45, 840, 5],
      [45, 800, 5],
    ],

    [
      [25, 840, 5],
      [25, 800, 5],
    ],

    [
      [15, 830, 5],
      [15, 820, 5],
      [15, 810, 5],
      [15, 800, 5],
      [15, 790, 5],
      [15, 780, 5],
      [15, 770, 5],

      [15, 760, 5],

      [15, 750, 5],
    ],

    [
      [55, 830, 5],
      [55, 820, 5],
      [55, 810, 5],
      [55, 800, 5],
      [55, 790, 5],
      [55, 780, 5],
      [55, 770, 5],
      [55, 760, 5],
      [55, 750, 5],
    ],
  ],

  [
    //m
    [
      [-45, 850, 5],
      [-45, 840, 5],
      [-45, 830, 5],
      [-45, 820, 5],
      [-45, 810, 5],
      [-45, 800, 5],
      [-45, 790, 5],
      [-45, 780, 5],
      [-45, 770, 5],
      [-45, 760, 5],
      [-45, 750, 5],
    ],

    [
      [-5, 850, 5],
      [-5, 840, 5],
      [-5, 830, 5],
      [-5, 820, 5],
      [-5, 810, 5],
      [-5, 800, 5],
      [-5, 790, 5],
      [-5, 780, 5],
      [-5, 770, 5],
      [-5, 760, 5],
      [-5, 750, 5],
    ],

    [[-15, 840, 5]],

    [
      [-25, 830, 5],
      [-25, 820, 5],
      [-25, 810, 5],
      [-25, 800, 5],
    ],

    [[-35, 840, 5]],
  ],

  [
    //s
    [
      [-95, 850, 5],
      [-95, 800, 5],
      [-95, 750, 5],
    ],

    [
      [-85, 840, 5],
      [-85, 810, 5],
      [-85, 760, 5],
    ],

    [
      [-75, 830, 5],
      [-75, 820, 5],
      [-75, 770, 5],
    ],

    [
      [-105, 840, 5],
      [-105, 800, 5],
    ],

    [
      [-115, 830, 5],
      [-115, 790, 5],
      [-115, 780, 5],
      [-115, 770, 5],
    ],

    [[-105, 760, 5]],
  ],

  [
    //0
    [
      [-165, 840, 5],
      [-165, 760, 5],
    ],

    [
      [-155, 850, 5],
      [-155, 750, 5],
    ],

    [
      [-145, 840, 5],
      [-145, 760, 5],
    ],

    [
      [-135, 830, 5],
      [-135, 820, 5],
      [-135, 810, 5],
      [-135, 800, 5],
      [-135, 790, 5],
      [-135, 780, 5],
      [-135, 770, 5],
    ],

    [
      [-175, 830, 5],
      [-175, 820, 5],
      [-175, 810, 5],
      [-175, 800, 5],
      [-175, 790, 5],
      [-175, 780, 5],
      [-175, 770, 5],
    ],
  ],

  [
    //m
    [
      [-195, 850, 5],
      [-195, 840, 5],
      [-195, 830, 5],
      [-195, 820, 5],
      [-195, 810, 5],
      [-195, 800, 5],
      [-195, 790, 5],
      [-195, 780, 5],
      [-195, 770, 5],
      [-195, 760, 5],
      [-195, 750, 5],
    ],

    [
      [-235, 850, 5],
      [-235, 840, 5],
      [-235, 830, 5],
      [-235, 820, 5],
      [-235, 810, 5],
      [-235, 800, 5],
      [-235, 790, 5],
      [-235, 780, 5],
      [-235, 770, 5],
      [-235, 760, 5],
      [-235, 750, 5],
    ],

    [
      [-215, 830, 5],
      [-215, 820, 5],
      [-215, 810, 5],
      [-215, 800, 5],
    ],

    [[-225, 840, 5]],
    [[-205, 840, 5]],
  ],

  [
    //e
    [
      [-255, 850, 5],
      [-255, 840, 5],
      [-255, 830, 5],
      [-255, 820, 5],
      [-255, 810, 5],
      [-255, 800, 5],
      [-255, 790, 5],
      [-255, 780, 5],
      [-255, 770, 5],
      [-255, 760, 5],
      [-255, 750, 5],
    ],

    [
      [-265, 850, 5],
      [-265, 800, 5],
      [-265, 750, 5],
    ],

    [
      [-275, 850, 5],
      [-275, 800, 5],

      [-275, 750, 5],
    ],

    [
      [-285, 850, 5],
      [-285, 800, 5],
      [-285, 750, 5],
    ],

    [
      [-295, 850, 5],

      [-295, 800, 5],

      [-295, 750, 5],
    ],
  ],

  [
    //t

    [[-315, 850, 5]],

    [[-325, 850, 5]],
    [
      [-335, 850, 5],
      [-335, 840, 5],
      [-335, 830, 5],
      [-335, 820, 5],
      [-335, 810, 5],
      [-335, 800, 5],
      [-335, 790, 5],
      [-335, 780, 5],
      [-335, 770, 5],
      [-335, 760, 5],
      [-335, 750, 5],
    ],

    [[-345, 850, 5]],

    [[-355, 850, 5]],
  ],

  [
    //h

    [
      [-375, 850, 5],
      [-375, 840, 5],
      [-375, 830, 5],
      [-375, 820, 5],
      [-375, 810, 5],
      [-375, 800, 5],
      [-375, 790, 5],
      [-375, 780, 5],
      [-375, 770, 5],
      [-375, 760, 5],
      [-375, 750, 5],
    ],

    [
      [-415, 850, 5],
      [-415, 840, 5],
      [-415, 830, 5],
      [-415, 820, 5],
      [-415, 810, 5],
      [-415, 800, 5],
      [-415, 790, 5],
      [-415, 780, 5],
      [-415, 770, 5],
      [-415, 760, 5],
      [-415, 750, 5],
    ],

    [[-385, 800, 5]],
    [[-405, 800, 5]],
    [[-395, 800, 5]],
  ],

  [
    //i

    [
      [-435, 850, 5],
      [-435, 750, 5],
    ],
    [
      [-445, 850, 5],
      [-445, 750, 5],
    ],

    [
      [-455, 850, 5],
      [-455, 840, 5],
      [-455, 830, 5],
      [-455, 820, 5],
      [-455, 810, 5],
      [-455, 800, 5],
      [-455, 790, 5],
      [-455, 780, 5],
      [-455, 770, 5],
      [-455, 760, 5],
      [-455, 750, 5],
    ],

    [
      [-465, 850, 5],
      [-465, 750, 5],
    ],

    [
      [-475, 850, 5],

      [-475, 750, 5],
    ],
  ],

  [
    //n

    [
      [-495, 850, 5],
      [-495, 840, 5],
      [-495, 830, 5],
      [-495, 820, 5],
      [-495, 810, 5],
      [-495, 800, 5],
      [-495, 790, 5],
      [-495, 780, 5],
      [-495, 770, 5],
      [-495, 760, 5],
      [-495, 750, 5],
    ],

    [
      [-535, 850, 5],
      [-535, 840, 5],
      [-535, 830, 5],
      [-535, 820, 5],
      [-535, 810, 5],
      [-535, 800, 5],
      [-535, 790, 5],
      [-535, 780, 5],
      [-535, 770, 5],
      [-535, 760, 5],
      [-535, 750, 5],
    ],

    [[-505, 810, 5]],
    [[-515, 790, 5]],
    [[-525, 770, 5]],
  ],

  [
    //g

    [
      [-575, 850, 5],
      [-575, 750, 5],
    ],
    [
      [-565, 840, 5],
      [-565, 760, 5],
    ],

    [
      [-555, 830, 5],
      [-555, 820, 5],
      [-555, 810, 5],
      [-555, 800, 5],
      [-555, 790, 5],
      [-555, 780, 5],
      [-555, 770, 5],
    ],

    [
      [-585, 840, 5],
      [-585, 800, 5],
      [-585, 760, 5],
    ],

    [
      [-595, 800, 5],
      [-595, 790, 5],
      [-595, 780, 5],
      [-595, 770, 5],
      [-595, 760, 5],
      [-595, 750, 5],
    ],
  ],
];
