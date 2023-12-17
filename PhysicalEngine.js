export default class PhysicalEngine {
  constructor(_frameRate, _bottom, _ceiling, _leftLimit, _rightLimit) {
    this.frameRate = _frameRate;
    this.bottom = _bottom;
    this.speedMinimum = 0.003;

    this.ceiling = _ceiling;
    this.leftLimit = _leftLimit;
    this.rightLimit = _rightLimit;
  }

  fallWithGravity(sphere) {
    //console.log(sphere);
    sphere.verticalMovement.speed += 9.8 * this.frameRate;
    sphere.position[1] -= sphere.verticalMovement.speed;

    //first move down OFFSET
    // 처음 떨어지는 속도 조정
    if (sphere.verticalMovement.firstMoveDown == true) {
      sphere.position[1] -= (sphere.position[1] - 50) * -0.05 * Math.random();
    }
  }

  bounceUpWithGravity(sphere) {
    // 처음 튕겨 올라가는 속도 조정
    if (sphere.verticalMovement.firstMoveDown == true) {
      sphere.verticalMovement.firstMoveDown = false;
      sphere.verticalMovement.speed += 3;
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

  checkBoundaryHit(sphere, sphereRadius) {
    let sphereX = sphere.position[0];
    let tempPosition1;
    let tempPosition2;
    if (Math.abs(sphereX - this.leftLimit) <= sphereRadius) {
      tempPosition1 = [this.leftLimit, 0, 0];
      tempPosition2 = [this.leftLimit, 1, 1];
    } else if (Math.abs(sphereX - this.rightLimit) <= sphereRadius) {
      tempPosition1 = [this.rightLimit, 0, 0];
      tempPosition2 = [this.rightLimit, 1, 1];
    }

    let normalVector = normalize(cross(tempPosition1, tempPosition2));
    let projectionScalar = dot(
      [-sphere.position[0], -sphere.position[1], -sphere.position[2]],
      normalVector
    );
    let projectedNormalVector = multiplyVectorByScalar(
      projectionScalar,
      normalVector
    );
    let directionVector = addVectors(
      multiplyVectorByScala(2, projectedNormalVector),
      sphere.position
    );
    sphere.collisionMovement.scale = getScalaFromVector(directionVector);
    sphere.collisionMovement.direction = normalize(directionVector);
  }

  checkElasticCollision(sphere1, sphere2, sphereRadius) {
    let tempVector = subtractVectors(sphere1.position, sphere2.position);
    if (getScalaFromVector(tempVector) > sphereRadius) {
      return;
    }

    let a = [];
    let b = [];
    if (sphere1.collisionMovement.scale != 0) {
      a = multiplyVectorByScalar(
        sphere1.collisionMovement.scale,
        sphere1.collisionMovement.direction
      );
    } else {
      a = sphere1.position;
    }

    if (sphere2.collisionMovement.scale != 0) {
      b = multiplyVectorByScalar(
        sphere2.collisionMovement.scale,
        sphere2.collisionMovement.direction
      );
    } else {
      b = sphere2.position;
    }

    let mass = 10;
    let momentumA = multiplyVectorByScalar(mass, a);
    let momentumB = multiplyVectorByScalar(mass, b);
    let sum1 = addVectors(momentumA, momentumB);

    //after collision
    let restitution = 0.5;
    momentumA *= -restitution;
    momentumB *= restitution;
    let sum2 = addVectors(momentumA, momentumB);

    let temp = subtractVectors(sum1, sum2);
    b = divideVectorByScalar(2, temp);
    a = subtractVectors(sum1, b);

    sphere1.collisionMovement.scale = getScalarFromVector(a);
    sphere1.collisionMovement.direction = normalVector(a);

    sphere2.collisionMovement.scale = getScalarFromVector(b);
    sphere2.collisionMovement.direction = normalVector(b);
  }

  moveAfterCollision(sphere) {
    if (sphere.collisionMovement.scale != 0) {
      let moveVector = multiplyVectorByScalar(
        sphere.collisionMovement.scale * this.frameRate,
        sphere.collisionMovement.direction
      );

      sphere.collisionMovement.scale -=
        sphere.collisionMovement.scale * this.frameRate;
      sphere.position = addVectors(sphere.position, moveVector);
    }
  }
}

function addVectors(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function multiplyVectorByScalar(scala, vector) {
  return [scala * vector[0], scala * vector[1], scala * vector[2]];
}

function divideVectorByScalar(scala, vector) {
  return [scala / vector[0], scala / vector[1], scala / vector[2]];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function getScalarFromVector(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function normalize(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
