import SphereController from "./SphereController.js";
let sphereController = new SphereController();

window.onload = function () {
  console.log("This is working");
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  update();
};

function update() {
  sphereController.drawScene();
  window.requestAnimationFrame(update);
}
