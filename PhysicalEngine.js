export default class PhysicalEngine {
  constructor() {}

  gravity(sphere) {
    if (sphere.state != LIQUID) {
      return;
    }

    if (sphere.position[1] < BOTTOM) {
      return;
    }

    sphere.gravitySpeed += 9.8 * FRAMERATE;
  }

  checkBoundaryHit(sphere, axis) {
    if (sphere.state == SOLID) {
      return;
    }

    let normalVector;
    if (axis == Z) {
      if (sphere.position[2] - SPHERERADIUS < FRONT) {
        normalVector = [0, 0, 1];
        sphere.position[2] = FRONT + SPHERERADIUS * 1.001;
        this.setPositionWithoutGravity(sphere);
      } else if (sphere.position[2] + SPHERERADIUS > BACK) {
        normalVector = [0, 0, -1];
        sphere.position[2] = BACK - SPHERERADIUS * 1.001;
        this.setPositionWithoutGravity(sphere);
      } else {
        return;
      }
    } else if (axis == X) {
      if (sphere.position[0] - SPHERERADIUS < LEFT) {
        normalVector = [1, 0, 0];
        sphere.position[0] = LEFT + SPHERERADIUS * 1.001;
        this.setPositionWithoutGravity(sphere);
      } else if (sphere.position[0] + SPHERERADIUS > RIGHT) {
        normalVector = [-1, 0, 0];
        sphere.position[0] = RIGHT - SPHERERADIUS * 1.001;
        this.setPositionWithoutGravity(sphere);
      } else {
        return;
      }
    } else if (axis == Y) {
      if (sphere.position[1] - SPHERERADIUS < BOTTOM) {
        normalVector = [0, 1, 0];
        //밑에 갇히는 문제 해결하기 위해 충돌시 바로 위치 보정
        sphere.position[1] = BOTTOM + SPHERERADIUS * 1.001;
        this.setPositionWithoutGravity(sphere);
        sphere.gravitySpeed = 0;
      } else if (sphere.position[1] + SPHERERADIUS > TOP) {
        normalVector = [0, -1, 0];
        //위에 갇히는 문제 해결하기 위해 충돌시 바로 위치 보정
        sphere.position[1] = TOP - SPHERERADIUS * 1.001;
        this.setPositionWithoutGravity(sphere);
      } else {
        return;
      }
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

    if (axis == Y) {
      sphere.scalar =
        Math.abs(getScalarFromVector(directionVector)) * sphere.restitution;
    } else {
      sphere.scalar = Math.abs(getScalarFromVector(directionVector));
    }

    sphere.direction = normalize(directionVector);
    this.setPositionWithoutGravity(sphere);
  }

  checkCollisionBetweenSphere(sphere1, sphere2) {
    // 둘닥 고체 상태일 경우 멈춰있음으로 체크하지 않음
    if (sphere1.state == SOLID && sphere2.state == SOLID) {
      return;
    }

    // 하나라도 흐르고 있을 경우 체크하지 않음
    if (sphere1.state == FLOWING_LIQUID || sphere2.state == FLOWING_LIQUID) {
      return;
    }

    // 하나라도 기체일 경우 체크하지 않음
    if (sphere1.state == GAS || sphere2.state == GAS) {
      return;
    }

    // 하나라도 끝나가는 경우 체크하지 않음
    if (sphere1.state == FINAL || sphere2.state == FINAL) {
      return;
    }

    let offset = 0;
    let gap = Math.abs(
      getScalarFromVector(subtractVectors(sphere1.position, sphere2.position))
    );
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

      // 서로 방향과 스칼라 바꿔줌
      let tempDirection = sphere1.direction;
      let tempScalar = sphere1.scalar;
      sphere1.direction = sphere2.direction;
      sphere1.scalar = sphere2.scalar * sphere1.restitution;
      sphere2.direction = tempDirection;
      sphere2.scalar = tempScalar * sphere1.restitution;
    }
  }

  setPositionWithoutGravity(sphere) {
    if (sphere.state == SOLID) {
      return;
    }

    let newPosition = addVectors(
      sphere.position,
      multiplyVectorByScalar(sphere.scalar * FRAMERATE, sphere.direction)
    );

    this.checkCollisionBeforeMove(sphere, newPosition);
    sphere.position = newPosition;
    sphere.backToOriginalPos();
  }

  setPositionWithGravity(sphere) {
    if (sphere.state == SOLID) {
      return;
    }
    let newPosition = addVectors(
      sphere.position,
      multiplyVectorByScalar(sphere.scalar * FRAMERATE, sphere.direction)
    );
    if (sphere.state == LIQUID) {
      newPosition[1] -= sphere.gravitySpeed;
    }

    this.checkCollisionBeforeMove(sphere, newPosition);
    sphere.position = newPosition;
    sphere.backToOriginalPos();
  }

  checkCollisionBeforeMove(sphere, newPosition) {
    if (sphere.state != LIQUID) {
      return;
    }

    if (sphere.upSphere != null && sphere.upSphere.state == FLOWING_LIQUID) {
      return;
    }

    if (
      sphere.downSphere != null &&
      sphere.downSphere.state == FLOWING_LIQUID
    ) {
      return;
    }

    if (isSameVectors(sphere.direction, [0, 1, 0]) && sphere.upSphere != null) {
      if (newPosition[1] >= sphere.upSphere.position[1] - SPHERERADIUS) {
        newPosition[1] = sphere.upSphere.position[1] - SPHERERADIUS * 2;

        // 위에 있는 스피어가 고체 상태라면 고체 상태 스피어에게 영향 받지 않도록
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
      // 만약 위에 스피어가 없을 경우
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
      // 아래에 스피어가 없다면
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
