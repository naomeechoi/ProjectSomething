import SphereControler from "./SphereControler.js";
import Sphere from "./Sphere.js";

window.onload = function () {
  console.log("This is working");
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  this.sphereControler = new SphereControler();
  this.sphereControler.draw();
};
