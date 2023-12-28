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
  }

  checkBoundaryHit_FrontBack(sphere) {
    if (sphere.state == SOLID) {
      return;
    }
    let sphereZ = sphere.position[2];
    let normalVector;
    if (sphereZ - SPHERERADIUS < FRONT) {
      normalVector = [0, 0, 1];
      sphere.position[2] = FRONT + SPHERERADIUS * 1.001;
      this.setPosition(sphere);
    } else if (sphereZ + SPHERERADIUS > BACK) {
      normalVector = [0, 0, -1];
      sphere.position[2] = BACK - SPHERERADIUS * 1.001;
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
    sphere.scalar = Math.abs(getScalarFromVector(directionVector));
    sphere.direction = normalize(directionVector);
    this.setPosition(sphere);
  }

  checkBoundaryHit_LeftRight(sphere) {
    if (sphere.state == SOLID) {
      return;
    }

    let sphereX = sphere.position[0];
    let normalVector;
    if (sphereX - SPHERERADIUS < LEFT) {
      normalVector = [1, 0, 0];
      sphere.position[0] = LEFT + SPHERERADIUS * 1.001;
      this.setPosition(sphere);
    } else if (sphereX + SPHERERADIUS > RIGHT) {
      normalVector = [-1, 0, 0];
      sphere.position[0] = RIGHT - SPHERERADIUS * 1.001;
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

    sphere.scalar = Math.abs(getScalarFromVector(directionVector));
    sphere.direction = normalize(directionVector);

    this.setPosition(sphere);
  }

  checkBoundaryHit_TopBottom(sphere) {
    if (sphere.state == SOLID) {
      return;
    }

    let sphereY = sphere.position[1];
    let normalVector;
    if (sphereY - SPHERERADIUS < BOTTOM) {
      normalVector = [0, 1, 0];

      //밑에 갇히는 문제 해결하기 위해 충돌시 바로 위치 보정
      sphere.position[1] = BOTTOM + SPHERERADIUS * 1.001;
      this.setPosition(sphere);
      sphere.gravitySpeed = 0;
    } else if (sphereY + SPHERERADIUS > TOP) {
      normalVector = [0, -1, 0];

      //위에 갇히는 문제 해결하기 위해 충돌시 바로 위치 보정
      sphere.position[1] = TOP - SPHERERADIUS * 1.001;
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
    this.setPosition(sphere);
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

  checkElasticCollision(sphere1, sphere2) {
    if (sphere1.state == FLOWING_LIQUID || sphere2.state == FLOWING_LIQUID) {
      return;
    }
    if (sphere1.state == SOLID && sphere2.state == SOLID) {
      return;
    }

    let offset = 0;
    let tempVector = subtractVectors(sphere1.position, sphere2.position);
    let gap = Math.abs(getScalarFromVector(tempVector));
    if (gap < SPHERERADIUS + offset) {
      if (sphere1 == SOLID) {
        sphere2.direction = DOWN;
        sphere2.scalar *= sphere2.restitution;
        return;
      } else if (sphere2 == SOLID) {
        sphere1.direction = DOWN;
        sphere1.scalar *= sphere1.restitution;
        return;
      }

      let tempDirection = sphere1.direction;
      let tempScalar = sphere1.scalar;
      sphere1.direction = sphere2.direction;
      sphere1.scalar = sphere2.scalar * sphere1.restitution;
      sphere2.direction = tempDirection;
      sphere2.scalar = tempScalar * sphere1.restitution;
    }
  }

  setPosition(sphere) {
    if (sphere.state == SOLID) {
      return;
    }

    let newPosition = addVectors(
      sphere.position,
      multiplyVectorByScalar(sphere.scalar * FRAMERATE, sphere.direction)
    );

    this.checkCollisionBeforeMove(sphere, newPosition);
    sphere.position = newPosition;
  }

  setPosition2(sphere) {
    if (sphere.state == SOLID) {
      return;
    }
    let newPosition = addVectors(
      sphere.position,
      multiplyVectorByScalar(sphere.scalar * FRAMERATE, sphere.direction)
    );
    if (sphere.state != FLOWING_LIQUID) {
      newPosition[1] -= sphere.gravitySpeed;
      this.checkCollisionBeforeMove(sphere, newPosition);
    }
    sphere.position = newPosition;
  }

  checkCollisionBeforeMove(sphere, newPosition) {
    if (sphere.state == FLOWING_LIQUID) {
      return;
    }

    if (isSameVectors(sphere.direction, [0, 1, 0]) && sphere.upSphere != null) {
      if (newPosition[1] >= sphere.upSphere.position[1] - SPHERERADIUS) {
        newPosition[1] = sphere.upSphere.position[1] - SPHERERADIUS * 2;

        if (sphere.upSphere.state == SOLID) {
          sphere.direction = DOWN;
          sphere.scalar *= sphere.restitution;

          return;
        }

        let tempDirection = sphere.direction;
        let tempScalar = sphere.scalar;
        sphere.direction = sphere.upSphere.direction;
        sphere.scalar = sphere.upSphere.scalar * sphere.restitution;
        sphere.upSphere.direction = tempDirection;
        sphere.upSphere.scalar = tempScalar * sphere.upSphere.restitution;
      }
    } else if (
      isSameVectors(sphere.direction, [0, 1, 0]) &&
      sphere.upSphere == null
    ) {
      if (newPosition[1] >= TOP - SPHERERADIUS) {
        newPosition[1] = TOP - SPHERERADIUS * 2;
        sphere.direction = DOWN;
        sphere.scalar *= sphere.restitution;
      }
    }

    if (
      isSameVectors(sphere.direction, [0, -1, 0]) &&
      sphere.downSphere != null
    ) {
      if (newPosition[1] <= sphere.downSphere.position[1] + SPHERERADIUS) {
        newPosition[1] = sphere.downSphere.position[1] + SPHERERADIUS * 2;
        let tempDirection = sphere.direction;
        let tempScalar = sphere.scalar;

        if (sphere.downSphere.scalar < SPHERERADIUS) {
          // 밑에 깔린 애가 거의 움직이지 않을 때
          // 이 것에 빨려 들어가는 느낌 없애기 위해 강제로 위로 튀어 올라가게 수정
          sphere.direction = UP;
          sphere.scalar *= sphere.restitution;
          sphere.downSphere.direction = UP;
          sphere.downSphere.scalar = tempScalar * sphere.downSphere.restitution;
        } else {
          sphere.direction = sphere.downSphere.direction;
          sphere.scalar = sphere.downSphere.scalar * sphere.restitution;
          sphere.downSphere.direction = tempDirection;
          sphere.downSphere.scalar = tempScalar * sphere.downSphere.restitution;
        }

        sphere.gravitySpeed = 0;
      }
    } else if (
      isSameVectors(sphere.direction, [0, -1, 0]) &&
      sphere.downSphere == null
    ) {
      if (newPosition[1] <= BOTTOM + SPHERERADIUS) {
        newPosition[1] = BOTTOM + SPHERERADIUS * 2;
        sphere.direction = UP;
        sphere.scalar *= sphere.restitution;
        sphere.gravitySpeed = 0;
      }
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
