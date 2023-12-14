export default class Sphere {
  constructor(_position, _color, _restitution = 0.7) {
    this.position = _position;
    this.color = _color;
    this.floor = this.getFloor();

    this.verticalMovement = {
      previousHeight: this.position.y,
      targetPosition: 0,
      restitution: _restitution,
      state: 0, // 0 is Noting, 1 is going up, 2 is going down
      speed: 0,
    };
  }

  getFloor() {
    var positiveNumber = this.position[1] + 50;
    return positiveNumber / 10;
  }
}
