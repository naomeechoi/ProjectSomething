const SOLID = 0;

export default class PhysicalEngine {
  constructor(_frameRate, _top, _bottom, _left, _right) {
    this.frameRate = _frameRate;
    this.speedMinimum = 0.003;

    this.top = _top;
    this.bottom = _bottom;
    this.left = _left;
    this.right = _right;
  }

  applyGravity(sphere) {
    if (sphere.state == SOLID) {
      return;
    }
    if (sphere.position[1] <= this.bottom) {
      return;
    }

    sphere.position[1] -= 10 * 9.8 * this.frameRate;

    //first move down OFFSET
    // 처음 떨어지는 속도 조정
    /*
    if (sphere.verticalMovement.movem
      /*ent == true) {
      sphere.position[1] -= (sphere.position[1] - 50) * -0.05 * Math.random();
    }*/
  }

  checkBoundaryHit_LeftRight(sphere, sphereRadius) {
    let sphereX = sphere.position[0];
    let tempPosition1;
    let tempPosition2;

    if (Math.abs(sphereX - this.left) <= sphereRadius) {
      tempPosition1 = [0, 1, 0];
      tempPosition2 = [0, 0, 1];
    } else if (Math.abs(sphereX - this.right) <= sphereRadius) {
      tempPosition1 = [0, 1, 0];
      tempPosition2 = [0, 0, -1];
    } else {
      return;
    }

    let sphereVelocity = multiplyVectorByScalar(
      sphere.movement.remainScalar,
      sphere.movement.direction
    );

    let normalVector = normalize(cross(tempPosition1, tempPosition2));
    let projectionScalar = dot(
      multiplyVectorByScalar(-1, sphereVelocity),
      normalVector
    );

    let projectedNormalVector = multiplyVectorByScalar(
      projectionScalar,
      normalVector
    );

    //최종 반사 벡터
    let directionVector = addVectors(
      multiplyVectorByScalar(2, projectedNormalVector),
      sphereVelocity
    );

    sphere.movement.remainScalar =
      getScalarFromVector(directionVector) * sphere.movement.restitution;
    sphere.movement.scalarPerFrame =
      sphere.movement.remainScalar * this.frameRate;
    sphere.movement.direction = normalize(directionVector);
  }

  checkBoundaryHit_TopBottom(sphere, sphereRadius) {
    if (sphere.state == SOLID) {
      return;
    }

    let sphereY = sphere.position[1];
    let normalVector;
    console.log(sphereY + " " + this.bottom);
    if (sphereY - this.bottom <= sphereRadius) {
      normalVector = [0, 1, 0];
    } else if (this.top - sphereY <= sphereRadius) {
      normalVector = [0, -1, 0];
    } else {
      return;
    }

    let sphereVelocity = multiplyVectorByScalar(
      sphere.movement.remainScalar,
      sphere.movement.direction
    );

    let projectionScalar = dot(
      multiplyVectorByScalar(-1, sphereVelocity),
      normalVector
    );

    let projectedNormalVector = multiplyVectorByScalar(
      projectionScalar,
      normalVector
    );

    //최종 반사 벡터
    let directionVector = addVectors(
      multiplyVectorByScalar(2, projectedNormalVector),
      sphereVelocity
    );

    sphere.movement.remainScalar = Math.abs(
      getScalarFromVector(directionVector) * sphere.movement.restitution
    );
    sphere.movement.scalarPerFrame =
      sphere.movement.remainScalar * this.frameRate;
    sphere.movement.direction = normalize(directionVector);
  }

  checkHitWithSolidSphere(sphere, solidSphere) {
    let sphereVelocity = multiplyVectorByScalar(
      sphere.movement.remainScalar,
      sphere.movement.direction
    );

    let normalVector = normalize(subtractVectors(solidSphere, sphere));
    let projectionScalar = dot(
      multiplyVectorByScalar(-1, sphereVelocity),
      normalVector
    );
    let projectedNormalVector = multiplyVectorByScalar(
      projectionScalar,
      normalVector
    );
    //최종 반사 벡터
    let directionVector = addVectors(
      multiplyVectorByScalar(2, projectedNormalVector),
      sphereVelocity
    );
    sphere.movement.remainScalar =
      getScalarFromVector(directionVector) * sphere.movement.restitution;
    sphere.movement.scalarPerFrame =
      sphere.movement.remainScalar * this.frameRate;
    sphere.movement.direction = normalize(directionVector);
  }

  checkElasticCollision(sphere1, sphere2, sphereRadius) {
    if ((sphere1.state = SOLID && sphere2.state == SOLID)) {
      return;
    }

    let tempVector = subtractVectors(sphere1.position, sphere2.position);
    if (getScalarFromVector(tempVector) > sphereRadius) {
      return;
    }

    if (sphere1 == SOLID) {
      checkHitWithSolidSphere(sphere2, sphere1);
      return;
    } else if (sphere2 == SOLID) {
      checkHitWithSolidSphere(sphere1, sphere2);
      return;
    }

    let sphereVelocity1 = multiplyVectorByScalar(
      sphere1.movement.remainScalar,
      sphere1.movement.direction
    );

    let sphereVelocity2 = multiplyVectorByScalar(
      sphere2.movement.remainScalar,
      sphere2.movement.direction
    );

    let momentumA = multiplyVectorByScalar(sphere1.mass, sphereVelocity1);
    let momentumB = multiplyVectorByScalar(sphere2.mass, sphereVelocity2);
    let sum1 = addVectors(momentumA, momentumB);

    //after collision
    let restitution = 0.7;
    momentumA *= -restitution;
    momentumB *= restitution;
    //momentumA *= -sphere1.movement.restitution;
    //momentumB *= sphere2.movement.restitution;
    let sum2 = addVectors(momentumA, momentumB);

    let temp = subtractVectors(sum1, sum2);
    sphereVelocity2 = divideVectorByScalar(2, temp);
    sphereVelocity1 = subtractVectors(sum1, sphereVelocity2);

    sphere1.movement.remainScalar =
      getScalarFromVector(sphereVelocity1) * sphere1.movement.restitution;
    sphere1.movement.scalarPerFrame =
      sphere1.movement.remainScalar * this.frameRate;
    sphere1.movement.direction = normalize(sphereVelocity1);

    sphere2.movement.remainScalar =
      getScalarFromVector(sphereVelocity2) * sphere2.movement.restitution;
    sphere2.movement.scalarPerFrame =
      sphere2.movement.remainScalar * this.frameRate;
    sphere2.movement.direction = normalize(sphereVelocity2);
  }

  move(sphere) {
    if (sphere.state == SOLID) {
      return;
    }

    if (
      sphere.state != SOLID &&
      sphere.movement.remainScalar == 0 &&
      sphere.position[1] > this.bottom
    ) {
      sphere.movement.direction = [0, -1, 0];
      sphere.movement.remainScalar = sphere.mass * sphere.position[1] * 9.8;
      sphere.movement.scalarPerFrame =
        (sphere.movement.remainScalar / sphere.mass) * this.frameRate;
    }

    if (isSameVectors(sphere.movement.direction, [0, -1, 0]) == false) {
      sphere.position = addVectors(
        sphere.position,
        multiplyVectorByScalar(
          sphere.movement.scalarPerFrame,
          sphere.movement.direction
        )
      );
    }

    sphere.movement.remainScalar -= sphere.movement.scalarPerFrame;
    if (sphere.movement.remainScalar <= 0) {
      sphere.movement.remainScalar = 0;
      sphere.movement.scalarPerFrame = 0;
    }
  }
}

function isSameVectors(a, b) {
  if (a[0] == b[0] && a[1] == b[1] && a[2] == b[2]) {
    return true;
  }

  return false;
}

function addVectors(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function multiplyVectorByScalar(scalar, vector) {
  return [scalar * vector[0], scalar * vector[1], scalar * vector[2]];
}

function divideVectorByScalar(scalar, vector) {
  return [scalar / vector[0], scalar / vector[1], scalar / vector[2]];
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
