export default class Sphere {
  constructor(_position, _color, _scale, _state) {
    this.position = _position;
    this.color = _color;
    this.scale = _scale;
    this.state = _state;
    this.orginalPos = _position;

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

    this.isSetRandom = false;

    this.isGoingToOriginPos = false;
  }

  setRestitution() {
    if (this.isSetRandom && this.state != FINAL) {
      this.restitution = 1;
      this.state = GAS;
    }
  }

  getScalrToOriginalPos() {
    return getScalarFromVector(subtractVectors(this.position, this.orginalPos));
  }

  getFloor() {
    let total;
    if (this.zLevel == 1) {
      total = 0 / MOUSE_CONTROLL_SPEED;
    } else if (this.zLevel == 3) {
      total = 12 / MOUSE_CONTROLL_SPEED;
    } else if (this.zLevel == 5) {
      total = 24 / MOUSE_CONTROLL_SPEED;
    } else if (this.zLevel == 7) {
      total = 36 / MOUSE_CONTROLL_SPEED;
    } else if (this.zLevel == 9) {
      total = 48 / MOUSE_CONTROLL_SPEED;
    }

    if (this.yLevel == 850) {
      this.yLevel = 11 / MOUSE_CONTROLL_SPEED;
    } else if (this.yLevel == 840) {
      this.yLevel = 10 / MOUSE_CONTROLL_SPEED;
    } else if (this.yLevel == 830) {
      this.yLevel = 9 / MOUSE_CONTROLL_SPEED;
    } else if (this.yLevel == 820) {
      this.yLevel = 8 / MOUSE_CONTROLL_SPEED;
    } else if (this.yLevel == 810) {
      this.yLevel = 7 / MOUSE_CONTROLL_SPEED;
    } else if (this.yLevel == 800) {
      this.yLevel = 6 / MOUSE_CONTROLL_SPEED;
    } else if (this.yLevel == 790) {
      this.yLevel = 5 / MOUSE_CONTROLL_SPEED;
    } else if (this.yLevel == 780) {
      this.yLevel = 4 / MOUSE_CONTROLL_SPEED;
    } else if (this.yLevel == 770) {
      this.yLevel = 3 / MOUSE_CONTROLL_SPEED;
    } else if (this.yLevel == 760) {
      this.yLevel = 2 / MOUSE_CONTROLL_SPEED;
    } else if (this.yLevel == 750) {
      this.yLevel = 1 / MOUSE_CONTROLL_SPEED;
    }

    return Math.round(total + this.yLevel);
  }
}
