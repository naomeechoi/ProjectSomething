export default class Sphere {
  constructor(_position, _color, _state) {
    this.position = _position;
    this.color = _color;
    this.state = _state;

    this.mass = 0.3;
    this.gravitySpeed = 0;
    this.direction = [0, 0, 0];
    this.scalar = 0;
    this.restitution = 0.9;
    this.firstMoveDown = true;

    this.floor = this.getFloor();
  }

  getFloor() {
    var positiveNumber = this.position[1] + 50;
    var Z = this.position[2] + 60 / 10;
    return 1;
  }
}
