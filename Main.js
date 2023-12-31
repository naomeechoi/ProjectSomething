import SphereController from "./SphereController.js";
let sphereController = new SphereController();
let wheel = 0;
window.onload = function () {
  console.log("This is working");
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  addEventListener("wheel", (event) => {
    wheel++;

    sphereController.changeSpheresState(wheel);
    sphereController.upSpheresSpeed(wheel);
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
