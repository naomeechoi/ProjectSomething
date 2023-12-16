export default class PhysicalEngine {
  constructor(_frameRate, _bottom) {
    this.frameRate = _frameRate;
    this.bottom = _bottom;
    this.speedMinimum = 0.003;
  }

  fallWithGravity(sphere) {
    //console.log(sphere);
    sphere.verticalMovement.speed += 9.8 * this.frameRate;
    sphere.position[1] -= sphere.verticalMovement.speed;

    //first move down OFFSET
    // 처음 떨어지는 속도 조정
    if (sphere.verticalMovement.firstMoveDown == true) {
      sphere.position[1] -= (sphere.position[1] - 50) * -0.05;
    }
  }

  bounceUpWithGravity(sphere) {
    // 처음 튕겨 올라가는 속도 조정
    if (sphere.verticalMovement.firstMoveDown == true) {
      sphere.verticalMovement.firstMoveDown = false;
      sphere.verticalMovement.speed += 7;
    }

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
        if (nextSpeed > this.speedMinimum) {
          sphere.verticalMovement.state = UP;
          sphere.verticalMovement.speed = nextSpeed;
        } else {
          sphere.verticalMovement.state = FINISHED;
          sphere.verticalMovement.speed = 0;
          //sphere.position[1] = this.bottom;
        }
      }
    } else if (sphere.verticalMovement.state == UP) {
      if (sphere.verticalMovement.speed > this.speedMinimum) {
        this.bounceUpWithGravity(sphere);
      } else {
        let gapBeforeBottom = sphere.position[1] - this.bottom;
        if (gapBeforeBottom > 0.03) {
          sphere.verticalMovement.state = DOWN;
          sphere.verticalMovement.speed = 0;
        } else {
          sphere.verticalMovement.state = FINISHED;
          sphere.verticalMovement.speed = 0;
          //sphere.position[1] = this.bottom;
        }
      }
    }
  }
}
