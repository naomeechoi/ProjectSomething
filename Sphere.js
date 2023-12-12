export default class Sphere {
  constructor(positions, color) {
    this.position = positions;
    this.color = color;
    this.floor = this.getFloor();
  }

  getFloor() {
    var positiveNumber = this.position[1] + 50;
    return positiveNumber / 10;
  }
}
