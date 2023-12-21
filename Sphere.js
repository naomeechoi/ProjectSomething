export default class Sphere {
  constructor(_position, _color, _state) {
    this.originalPosition = _position;
    this.position = _position;
    this.color = _color;

    // 0 -> solid, 1 -> liquid, 2 -> gas
    this.state = _state;
    this.mass = 0.3;
    this.gravitySpeed = 0;

    this.movement = {
      direction: [0, 0, 0],
      scalar: 0,
      restitution: 0.9,
      firstMoveDown: true,
    };

    this.floor = this.getFloor();
  }

  getFloor() {
    var positiveNumber = this.position[1] + 50;
    var Z = this.position[2] + 60 / 10;
    return 1;
  }
}
