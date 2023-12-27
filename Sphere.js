export default class Sphere {
  constructor(_position, _color, _state) {
    this.position = _position;
    this.color = _color;
    this.state = _state;

    this.yLevel = _position[1];
    this.zLevel = _position[2] / 5;

    this.mass = 0.9;
    this.gravitySpeed = 0;
    this.direction = [0, 0, 0];
    this.scalar = 0;
    this.restitution = 0.7;

    this.floor = this.getFloor();

    this.upSphere = null;
    this.downSphere = null;

    this.bottomCount = 0;
  }

  getFloor() {
    //var positiveNumber = this.position[1] + 50;
    //var Z = this.position[2] + 60 / 10;
    let total;
    if (this.zLevel == 1) {
      total = 0;
    } else if (this.zLevel == 3) {
      total = 12;
    } else if (this.zLevel == 5) {
      total = 24;
    } else if (this.zLevel == 7) {
      total = 36;
    } else if (this.zLevel == 9) {
      total = 48;
    }

    if (this.yLevel == 850) {
      this.yLevel = 11;
    } else if (this.yLevel == 840) {
      this.yLevel = 10;
    } else if (this.yLevel == 830) {
      this.yLevel = 9;
    } else if (this.yLevel == 820) {
      this.yLevel = 8;
    } else if (this.yLevel == 810) {
      this.yLevel = 7;
    } else if (this.yLevel == 800) {
      this.yLevel = 6;
    } else if (this.yLevel == 790) {
      this.yLevel = 5;
    } else if (this.yLevel == 780) {
      this.yLevel = 4;
    } else if (this.yLevel == 770) {
      this.yLevel = 3;
    } else if (this.yLevel == 760) {
      this.yLevel = 2;
    } else if (this.yLevel == 750) {
      this.yLevel = 1;
    }

    return total + this.yLevel;
  }
}
