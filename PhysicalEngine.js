const SOLID = 0;

export default class PhysicalEngine {
  constructor() {}

  gravity(sphere) {
    if (sphere.state == SOLID) {
      return;
    }
    if (sphere.position[1] < BOTTOM) {
      return;
    }

    sphere.gravitySpeed += 9.8 * FRAMERATE;

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

    if (Math.abs(sphereX - LEFT) <= sphereRadius) {
      tempPosition1 = [0, 1, 0];
      tempPosition2 = [0, 0, 1];
    } else if (Math.abs(sphereX - RIGHT) <= sphereRadius) {
      tempPosition1 = [0, 1, 0];
      tempPosition2 = [0, 0, -1];
    } else {
      return;
    }

    let sphereVelocity = multiplyVectorByScalar(
      sphere.remainScalar,
      sphere.direction
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

    sphere.remainScalar =
      getScalarFromVector(directionVector) * sphere.restitution;
    sphere.scalarPerFrame = sphere.remainScalar * FRAMERATE;
    sphere.direction = normalize(directionVector);
  }

  checkBoundaryHit_TopBottom(sphere, sphereRadius) {
    if (sphere.state == SOLID) {
      return;
    }

    let sphereY = sphere.position[1];
    let normalVector;
    if (sphereY - sphereRadius < BOTTOM) {
      normalVector = [0, 1, 0];

      //밑에 갇히는 문제 해결하기 위해 충돌시 바로 위치 보정
      sphere.position[1] = BOTTOM + sphereRadius * 1.1;
      this.setPosition(sphere);
      sphere.gravitySpeed = 0;
    } else if (sphereY + sphereRadius > TOP) {
      normalVector = [0, -1, 0];

      //위에 갇히는 문제 해결하기 위해 충돌시 바로 위치 보정
      sphere.position[1] = TOP - sphereRadius * 1.1;
      this.setPosition(sphere);
    } else {
      return;
    }

    let sphereVelocity = multiplyVectorByScalar(
      sphere.scalar,
      sphere.direction
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

    sphere.scalar =
      Math.abs(getScalarFromVector(directionVector)) * sphere.restitution;
    sphere.direction = normalize(directionVector);
  }

  checkHitWithSolidSphere(sphere, solidSphere) {
    let sphereVelocity = multiplyVectorByScalar(
      sphere.scalar,
      sphere.direction
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
    sphere.scalar = Math.abs(
      getScalarFromVector(directionVector) * sphere.restitution
    );
    sphere.direction = normalize(directionVector);
  }

  checkElasticCollision(sphere1, sphere2, sphereRadius) {
    if (sphere1.state == SOLID && sphere2.state == SOLID) {
      return;
    }
    let offset = 0;
    let tempVector = subtractVectors(sphere1.position, sphere2.position);
    let gap = Math.abs(getScalarFromVector(tempVector));
    if (gap < sphereRadius + offset) {
      if (sphere1 == SOLID) {
        checkHitWithSolidSphere(sphere2, sphere1);
        return;
      } else if (sphere2 == SOLID) {
        checkHitWithSolidSphere(sphere1, sphere2);
        return;
      }

      let tempDirection = sphere1.direction;
      let tempScalar = sphere1.scalar;
      sphere1.direction = sphere2.direction;
      sphere1.scalar = sphere2.scalar;
      sphere2.direction = tempDirection;
      sphere2.scalar = tempScalar;
    }
  }

  setPosition(sphere) {
    if (sphere.state == SOLID) {
      return;
    }

    sphere.position = addVectors(
      sphere.position,
      multiplyVectorByScalar(sphere.scalar * FRAMERATE, sphere.direction)
    );

    sphere.position[1] -= sphere.gravitySpeed;
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
  return [vector[0] / scalar, vector[1] / scalar, vector[2] / scalar];
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
