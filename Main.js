import SphereController from "./SphereController.js";
let sphereController = new SphereController();
let wheel = 0;
window.onload = function () {
  console.log("This is working");
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let isAdded = false;
  addEventListener("wheel", (event) => {
    wheel++;

    sphereController.changeSpheresState(wheel);

    /*
    let criticalPoint = 200 / MOUSE_CONTROLL_SPEED;

    if (wheel > criticalPoint / 2) {
      sphereController.startVerticalMove();
    }

    if (wheel > criticalPoint) {
      sphereController.fastVerticalMove();
    }

    if (wheel > criticalPoint * 3) {
      sphereController.randomMove();
    }

    if (wheel > criticalPoint * 5) {
      sphereController.finalSecene();
    }*/
    draw();
  });

  const collisionIntervalId = setInterval(
    () => collision(),
    (SECOND * FRAMERATE) / 100
  );
  const moveIntervalId = setInterval(() => move(), SECOND * FRAMERATE);
  const drawIntervalId = setInterval(() => draw(), SECOND * FRAMERATE * 2);
};

function draw() {
  sphereController.drawScene();
}

function move() {
  sphereController.moveSpheres();
}

function collision() {
  sphereController.collisionSpheres();
}
