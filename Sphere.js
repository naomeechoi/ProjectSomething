export default class Sphere {
  constructor(_position, _color, _scale, _state) {
    this.position = _position;
    this.color = _color;
    this.scale = _scale;
    this.state = _state;
    this.orginalPos = _position;

    this.mass = 0.9;
    this.gravitySpeed = 0;
    this.direction = [0, 0, 0];
    this.scalar = 0;
    this.restitution = 0.7;

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

    let yLevel = this.orginalPos[1];
    let zLevel = this.orginalPos[2] / 5;
    if (zLevel == 1) {
      total = 0 / MOUSE_CONTROLL_SPEED;
    } else if (zLevel == 3) {
      total = 12 / MOUSE_CONTROLL_SPEED;
    } else if (zLevel == 5) {
      total = 24 / MOUSE_CONTROLL_SPEED;
    } else if (zLevel == 7) {
      total = 36 / MOUSE_CONTROLL_SPEED;
    } else if (zLevel == 9) {
      total = 48 / MOUSE_CONTROLL_SPEED;
    }

    if (yLevel == 850) {
      yLevel = 11 / MOUSE_CONTROLL_SPEED;
    } else if (yLevel == 840) {
      yLevel = 10 / MOUSE_CONTROLL_SPEED;
    } else if (yLevel == 830) {
      yLevel = 9 / MOUSE_CONTROLL_SPEED;
    } else if (yLevel == 820) {
      yLevel = 8 / MOUSE_CONTROLL_SPEED;
    } else if (yLevel == 810) {
      yLevel = 7 / MOUSE_CONTROLL_SPEED;
    } else if (yLevel == 800) {
      yLevel = 6 / MOUSE_CONTROLL_SPEED;
    } else if (yLevel == 790) {
      yLevel = 5 / MOUSE_CONTROLL_SPEED;
    } else if (yLevel == 780) {
      yLevel = 4 / MOUSE_CONTROLL_SPEED;
    } else if (yLevel == 770) {
      yLevel = 3 / MOUSE_CONTROLL_SPEED;
    } else if (yLevel == 760) {
      yLevel = 2 / MOUSE_CONTROLL_SPEED;
    } else if (yLevel == 750) {
      yLevel = 1 / MOUSE_CONTROLL_SPEED;
    }

    return Math.round(total + yLevel);
  }
}
