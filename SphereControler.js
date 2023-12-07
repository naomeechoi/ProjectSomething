// export default SphereControler;
import Shader from "./Shader.js";

export default class SphereControler {
  constructor() {
    this.shader = new Shader();
    this.container = [];
  }

  setBuffers() {
    this.shader.setPositionBuffer(this.getSphereVertices());
  }

  draw() {
    this.shader.readyToDraw();
    this.container.forEach((element) => {
      this.shader.draw(
        element.color,
        element.position[0],
        element.position[1],
        element.position[2]
      );
    });
  }

  getSphereVertices() {
    var container = [];
    var radius = 130;
    var x, y, z, xy; // vertex position
    var vertices = [];

    var stackCount = 10;
    var sectorCount = 10;

    var sectorStep = (2 * Math.PI) / sectorCount;
    var stackStep = Math.PI / stackCount;
    var sectorAngle, stackAngle;

    for (var i = 0; i <= stackCount; ++i) {
      stackAngle = Math.PI / 2 - i * stackStep; // starting from pi/2 to -pi/2
      xy = radius * Math.cos(stackAngle); // r * cos(u)
      z = radius * Math.sin(stackAngle); // r * sin(u)
      // add (sectorCount+1) vertices per stack
      // first and last vertices have same position and normal, but different tex coords
      for (var j = 0; j <= sectorCount; ++j) {
        sectorAngle = j * sectorStep; // starting from 0 to 2pi
        // vertex position (x, y, z)
        x = xy * Math.cos(sectorAngle); // r * cos(u) * cos(v)
        y = xy * Math.sin(sectorAngle); // r * cos(u) * sin(v)
        vertices.push(x);
        vertices.push(y);
        vertices.push(z);
      }
    }

    var indices = [];
    var k1, k2;
    for (var i = 0; i <= stackCount; ++i) {
      k1 = i * (sectorCount + 1); // beginning of current stack
      k2 = k1 + sectorCount + 1; // beginning of next stack

      for (var j = 0; j <= sectorCount; ++j, ++k1, ++k2) {
        // 2 triangles per sector excluding first and last stacks
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

    indices.forEach((element) => {
      var firstIdx = (element - 1) * 3;
      container.push(vertices[firstIdx]);
      container.push(vertices[firstIdx + 1]);
      container.push(vertices[firstIdx + 2]);
    });

    return container;
  }
}
