import SphereControler from "./SphereControler.js";
import Sphere from "./Sphere.js";

window.onload = function () {
  console.log("This is working");
  var canvas = document.getElementById("game-surface");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  this.sphereControler = new SphereControler();
  this.sphereControler.setBuffers();
  this.sphereControler.draw();

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.sphereControler.draw();
  });

  window.addEventListener("mousedown", function (event) {
    var color = [
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
    ];

    var tempX = event.clientX;
    var tempY = event.clientY;

    var count = 10000;
    while (count != 0) {
      if (this.sphereControler.container.lenght != 0) {
        this.sphereControler.container.forEach((element) => {
          var preX = element.position[0];
          var preY = element.position[1];
          var lengthBetweenX = tempX - preX;
          var lengthBetweenY = tempY - preY;
          var lengthBetweenSpheres = Math.sqrt(
            Math.pow(lengthBetweenX, 2) + Math.pow(lengthBetweenY, 2)
          );
          var radius = 130;
          var diameter = radius * 2;
          if (lengthBetweenSpheres < diameter) {
            tempX +=
              (lengthBetweenX / lengthBetweenSpheres) *
              Math.abs(diameter - lengthBetweenSpheres);
            tempY +=
              (lengthBetweenY / lengthBetweenSpheres) *
              Math.abs(diameter - lengthBetweenSpheres);
          }
        });
      }

      count--;
    }

    var newSphere = new Sphere(tempX, tempY, color);
    this.sphereControler.container.push(newSphere);
    this.sphereControler.draw();
  });
};
