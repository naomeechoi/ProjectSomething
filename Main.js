import SphereController from "./SphereController.js";

window.onload = function () {
  console.log("This is working");
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  this.sphereController = new SphereController();
  this.sphereController.drawScene();
};
