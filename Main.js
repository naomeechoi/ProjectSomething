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

    sphereController.startMoveSpheres(wheel);
    sphereController.startVerticalMove(wheel);

    if (wheel > 70) {
      sphereController.fastVerticalMove();
    }

    if (wheel > 90) {
      sphereController.randomMove();
    }

    if (wheel > 110) {
      sphereController.finalSecene();
    }
    // draw();
  });

  //1초에 60번이면 6000 1000 0.02
  const collisionIntervalId = setInterval(
    () => collision(),
    (SECOND * FRAMERATE) / 100
  );
  const moveIntervalId = setInterval(() => move(), SECOND * FRAMERATE);
  const drawIntervalId = setInterval(() => draw(), SECOND * FRAMERATE * 2);
  //update();
};

function draw() {
  sphereController.drawScene();
  //window.requestAnimationFrame(update);
}

function move() {
  sphereController.moveSpheres();
  // 이거 다음으로 실행되는 인터벌이 같은 함수를 만들고 거기에 위치보정 함수를 넣어보자..
  //(중력이 충돌할 때 외에도 적용되게 하기 위해)
}

function collision() {
  sphereController.collisionSpheres();
  // 이거 다음으로 실행되는 인터벌이 같은 함수를 만들고 거기에 위치보정 함수를 넣어보자..
  //(중력이 충돌할 때 외에도 적용되게 하기 위해)
}
