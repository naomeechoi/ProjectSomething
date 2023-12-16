export default class PhysicalEngine {
  constructor(_frameRate, _bottom) {
    this.frameRate = _frameRate;
    this.bottom = _bottom;
  }

  fallWithGravity(sphere) {
    //console.log(sphere);
    sphere.verticalMovement.speed += 9.8 * this.frameRate;
    sphere.position[1] -= sphere.verticalMovement.speed;
    sphere.position[1] -= (sphere.position[1] - 50) * 0.1;
  }

  bounceUpWithGravity(sphere) {
    sphere.verticalMovement.speed -= 9.8 * this.frameRate;
    sphere.position[1] += sphere.verticalMovement.speed;
  }

  moveVertically(sphere) {
    const START = 0;
    const UP = 1;
    const DOWN = 2;
    const FINISHED = 3;
    if (sphere.verticalMovement.state == DOWN) {
      if (sphere.position[1] - this.bottom > 0.03) {
        this.fallWithGravity(sphere);
      } else {
        let nextSpeed =
          sphere.verticalMovement.speed * sphere.verticalMovement.restitution;
        if (nextSpeed > 0.03) {
          sphere.verticalMovement.state = UP;
          sphere.verticalMovement.speed = nextSpeed;
        } else {
          sphere.verticalMovement.state = FINISHED;
          sphere.verticalMovement.speed = 0;
        }
      }
    } else if (sphere.verticalMovement.state == UP) {
      if (sphere.verticalMovement.speed > 0.03) {
        this.bounceUpWithGravity(sphere);
      } else {
        let gapBeforeBottom = sphere.position[1] - this.bottom;
        if (gapBeforeBottom > 0.03) {
          sphere.verticalMovement.state = DOWN;
          sphere.verticalMovement.speed = 0;
        } else {
          sphere.verticalMovement.state = FINISHED;
          sphere.verticalMovement.speed = 0;
        }
      }
    }
  }
}
