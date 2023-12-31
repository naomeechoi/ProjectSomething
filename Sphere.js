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
  }

  changeState(wheel) {
    if (this.state == SOLID) {
      if (this.getFloor() <= wheel) {
        this.state = LIQUID;
        this.direction = DOWN;
        this.scalar = (this.position[1] - BOTTOM) * 9.8 * this.mass;

        return true;
      }
    } else if (this.state == LIQUID) {
      if (wheel > CRITICAL_POINT / 2)
        if (
          this.position[1] < BOTTOM + SPHERERADIUS * 3 &&
          this.scalar * this.direction[1] < 0.0001
        ) {
          this.state = FLOWING_LIQUID;

          this.direction = getRandomDirection();
          this.direction[1] = 0;
          this.scalar = SPHERERADIUS * 10;
        }

      return true;
    } else if (this.state == FLOWING_LIQUID) {
      if (wheel > CRITICAL_POINT * 3) {
        this.state = GAS;
        this.restitution = 1;
        this.scalar = 1000;
        this.direction = getRandomDirection();
      }
      return true;
    } else if (this.state == GAS) {
      if (wheel > CRITICAL_POINT * 5) {
        this.state = FINAL;
        this.direction = normalize(
          subtractVectors(this.orginalPos, this.position)
        );
        this.scalar = 1000;
      }
      return true;
    }

    return false;
  }

  upSpeed(wheel) {
    if (this.state == FLOWING_LIQUID || this.state == GAS) {
      if (wheel > CRITICAL_POINT) {
        this.scalar = this.scalar + SPHERERADIUS;
      }
    }
  }

  backToOriginalPos() {
    if (this.state == FINAL && this.getDistanceFromOriginalPos() < 10) {
      this.position = this.orginalPos;
      this.direction = [0, 0, 0];
      this.scalar = 0;
    }
  }

  getDistanceFromOriginalPos() {
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
