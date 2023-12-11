// export default SphereControler;
import Shader from "./Shader.js";

export default class SphereControler {
  constructor() {
    this.shader = new Shader();
    this.container = [];
  }

  getBufferIndices(radius = 10) {
    var x, y, z, xy; // vertex position
    var positions = [];
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

    var indices = [];
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

    return indices;
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

  draw() {
    this.shader.setSlide();
    this.shader.render();
  }
}
