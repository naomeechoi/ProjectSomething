window.onload = function () {
    console.log("This is working");
    var canvas = document.getElementById("game-surface");
    var maxWidthHeight = 500;
    canvas.width = maxWidthHeight;
    canvas.height = maxWidthHeight;
  
    var gl = canvas.getContext("webgl");
  
    if (!gl) {
      console.log("WebGL not supported, falling back on experimental-webgl");
      gl = canvas.getContext("experimental-webgl");
    }
  
    if (!gl) {
      alert("Your browser does not support WebGL");
    }
  
    // bring glsl text source, glsl 텍스트 소스 가져오기
    var vertexShaderSource = document.getElementById("vertex-shader-2d").text;
    var fragmentShaderSource = document.getElementById("fragment-shader-2d").text;
  
    // create and compile shaders and check vaildations, 쉐이더 생성과 컴파일 검증까지
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
  
    // make program, 프로그램 만들기
    var program = createProgram(gl, vertexShader, fragmentShader);
  
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  
    // create and bind buffer, and add buffer data, 버퍼 생성 바인드 및 데이터 구성
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var verticesContainer = [];
    setVerticesArray(verticesContainer);
    setGeometry(gl, verticesContainer);
  
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl, verticesContainer.length);
  
    var cameraAngleRadians = degreesToRadians(0);
    var fieldOfViewRadians = degreesToRadians(60);
  
    // 카메라 앵글 슬라이드바 설정
    function updateCameraAngle(ele) {
      cameraAngleRadians = degreesToRadians(ele.target.value);
      ele.target.previousSibling.innerHTML =
        ele.target.previousSibling.getAttribute("name") + ele.target.value;
      drawScene();
    }
  
    makeSliderAndRedraw("cameraAngleAngle: ", "perspectiveSlider", 0, 0, 360, (ele) => {
      return updateCameraAngle(ele);
    });
  
    // 원근 각도 슬라이드바 설정
    function updatePerspective(ele) {
      fieldOfViewRadians = degreesToRadians(ele.target.value);
      ele.target.previousSibling.innerHTML =
        ele.target.previousSibling.getAttribute("name") + ele.target.value;
      drawScene();
    }
  
    makeSliderAndRedraw("perspectiveAngle: ", "perspectiveSlider", 60, 1, 360, (ele) => {
      return updatePerspective(ele);
    });
  
  
    function makeSliderAndRedraw(eleName, parentDivId, baseValue, min, max, func) {
      var parentDiv = document.getElementById(parentDivId);
  
      var division = document.createElement("d");
  
      var tempSlider = document.createElement("input");
      tempSlider.className = "slider";
      tempSlider.type = "range";
      tempSlider.min = min;
      tempSlider.max = max;
      tempSlider.step = 0.01;
      tempSlider.value = baseValue;
  
      var text = document.createElement("p");
      text.setAttribute("name", eleName);
      text.innerHTML = eleName + tempSlider.value;
  
      division.appendChild(text);
      division.appendChild(tempSlider);
      parentDiv.appendChild(division);
  
      tempSlider.oninput = function (ele) {
        func(ele);
      };
    }
  
    drawScene();
  
    function drawScene() {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
  
      gl.useProgram(program);
  
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
      // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      var size = 3; // 2 components per iteration
      var type = gl.FLOAT; // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0; // start at the beginning of the buffer
      gl.vertexAttribPointer(
        positionLocation,
        size,
        type,
        normalize,
        stride,
        offset
      );
  
      gl.enableVertexAttribArray(colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  
      var colorSize = 3;
      var colorType = gl.UNSIGNED_BYTE;
      var colorNormalize = true;
      var colorStride = 0;
      var colorOffset = 0;
      gl.vertexAttribPointer(
        colorLocation, colorSize, colorType, colorNormalize, colorStride, colorOffset);
  
      var numSs = 5;
      var radius = 200;
      // Compute the matrices
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var zNear = 1;
      var zFar = 2000;
      var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
  
      var fPosition = [radius, 0, 0];
  
      var cameraMatrix = m4.yRotation(cameraAngleRadians);
      cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);
      var cameraPosition = [
        cameraMatrix[12],
        cameraMatrix[13],
        cameraMatrix[14],
      ]
  
      var up = [0 ,1, 0];
      cameraMatrix = m4.lookAt(cameraPosition, fPosition, up);
  
      var viewMatrix = m4.inverse(cameraMatrix);
      var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
  
      for(var i = 0; i < numSs; i++)
      {
        var angle = i * Math.PI * 2 / numSs;
        var x = Math.cos(angle) * radius;
        var y = Math.sin(angle) * radius;
  
        var matrix = m4.translate(viewProjectionMatrix, x, 0, y);
  
    
        gl.uniformMatrix4fv(matrixLocation, false, matrix);
    
        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        //var count = 15 * 2 * 6;
        var count = verticesContainer.length;
        gl.drawArrays(primitiveType, offset, count);
      }
    }
  };
  
  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
  
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  
  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("ERROR linking program", gl.getProgramInfoLog(program));
      return;
    }
  
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.error("ERROR validating program", gl.getProgramInfoLog(program));
      return;
    }
  
    gl.useProgram(program);
    return program;
  }
  
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  function setRectangle(gl, x, y, width, height) {
    var x1 = parseInt(x);
    var x2 = x1 + parseInt(width);
    var y1 = parseInt(y);
    var y2 = y1 + parseInt(height);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
      gl.STATIC_DRAW
    );
  }
  
  function setGeometry(gl, container) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(container),
      gl.STATIC_DRAW
    );
  }
  
  function setVerticesArray(container)
  {
    var radius = 30;
    var x, y, z, xy;                              // vertex position
    var vertices = [];
  
    var stackCount  = 100;
    var sectorCount = 100;
  
    var sectorStep = 2 * Math.PI / sectorCount;
    var stackStep = Math.PI / stackCount;
    var sectorAngle, stackAngle;
  
    for(var i = 0; i <= stackCount; ++i)
    {
      stackAngle = Math.PI / 2 - i * stackStep;        // starting from pi/2 to -pi/2
      xy = radius * Math.cos(stackAngle);             // r * cos(u)
      z = radius * Math.sin(stackAngle);              // r * sin(u)
      // add (sectorCount+1) vertices per stack
      // first and last vertices have same position and normal, but different tex coords
      for(var j = 0; j <= sectorCount; ++j)
      {
          sectorAngle = j * sectorStep;           // starting from 0 to 2pi
          // vertex position (x, y, z)
          x = xy * Math.cos(sectorAngle);             // r * cos(u) * cos(v)
          y = xy * Math.sin(sectorAngle);             // r * cos(u) * sin(v)
          vertices.push(x);
          vertices.push(y);
          vertices.push(z);
      }
    }
  
    var indices = [];
    var k1, k2;
    for(var i = 0; i <= stackCount; ++i)
    {
        k1 = i * (sectorCount + 1);     // beginning of current stack
        k2 = k1 + sectorCount + 1;      // beginning of next stack
  
        for(var j = 0; j <= sectorCount; ++j, ++k1, ++k2)
        {
            // 2 triangles per sector excluding first and last stacks
            // k1 => k2 => k1+1
            if(i != 0)
            {
                indices.push(k1);
                indices.push(k2);
                indices.push(k1 + 1);
            }
  
            // k1+1 => k2 => k2+1
            if(i != (stackCount-1))
            {
                indices.push(k1 + 1);
                indices.push(k2);
                indices.push(k2 + 1);
            }
        }
    }
  
    indices.forEach(element => {
      var firstIdx = (element - 1) * 3;
      container.push(vertices[firstIdx]);
      container.push(vertices[firstIdx + 1]);
      container.push(vertices[firstIdx + 2]);
    });
  
  }
  
  function setColors(gl, length) {
    var colorArray = [];
    for(var i = 0; i <= length / 3; i++)
    {
      colorArray.push(10);
      colorArray.push(130);
      colorArray.push(200);
    }
  
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array(colorArray),
      gl.STATIC_DRAW
    );
  }
  
  var m3 = {
    multiply: function (a, b) {
      var a00 = a[0 * 3 + 0];
      var a01 = a[0 * 3 + 1];
      var a02 = a[0 * 3 + 2];
      var a10 = a[1 * 3 + 0];
      var a11 = a[1 * 3 + 1];
      var a12 = a[1 * 3 + 2];
      var a20 = a[2 * 3 + 0];
      var a21 = a[2 * 3 + 1];
      var a22 = a[2 * 3 + 2];
      var b00 = b[0 * 3 + 0];
      var b01 = b[0 * 3 + 1];
      var b02 = b[0 * 3 + 2];
      var b10 = b[1 * 3 + 0];
      var b11 = b[1 * 3 + 1];
      var b12 = b[1 * 3 + 2];
      var b20 = b[2 * 3 + 0];
      var b21 = b[2 * 3 + 1];
      var b22 = b[2 * 3 + 2];
  
      return [
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22,
      ];
    },
  
    identity: function () {
      return [1, 0, 0, 0, 1, 0, 0, 0, 1];
    },
  
    translation: function (tx, ty) {
      return [1, 0, 0, 0, 1, 0, tx, ty, 1];
    },
  
    rotation: function (angleInDegrees) {
      var angleInRadians = (angleInDegrees * Math.PI) / 180;
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
      return [c, -s, 0, s, c, 0, 0, 0, 1];
    },
  
    scailing: function (sx, sy) {
      return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
    },
  
    projection: function (width, height) {
      return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1];
    },
  };
  
  function subtractVectors(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
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
    return [a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]];
  }
  
  var m4 = {
  
    lookAt: function(cameraPosition, target, up) {
      var zAxis = normalize(subtractVectors(cameraPosition, target));
      var xAxis = normalize(cross(up, zAxis));
      var yAxis = normalize(cross(zAxis, xAxis));
  
      return [
        xAxis[0], xAxis[1], xAxis[2], 0,
        yAxis[0], yAxis[1], yAxis[2], 0,
        zAxis[0], zAxis[1], zAxis[2], 0,
        cameraPosition[0],
        cameraPosition[1],
        cameraPosition[2],
        1,
     ]; 
    },
  
    projection: function(width, height, depth) {
      // Note: This matrix flips the Y axis so 0 is at the top.
      return [
         2 / width, 0, 0, 0,
         0, -2 / height, 0, 0,
         0, 0, 2 / depth, 0,
        -1, 1, 0, 1,
      ];
    },
  
    perspective: function(fieldOfViewInRadians, aspect, near, far) {
      var f = 1 / Math.tan(0.5 * fieldOfViewInRadians);
      var rangeInv = 1.0 / (near - far);
  
      return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
      ];
    },
  
    multiply: function(a, b) {
      var a00 = a[0 * 4 + 0];
      var a01 = a[0 * 4 + 1];
      var a02 = a[0 * 4 + 2];
      var a03 = a[0 * 4 + 3];
      var a10 = a[1 * 4 + 0];
      var a11 = a[1 * 4 + 1];
      var a12 = a[1 * 4 + 2];
      var a13 = a[1 * 4 + 3];
      var a20 = a[2 * 4 + 0];
      var a21 = a[2 * 4 + 1];
      var a22 = a[2 * 4 + 2];
      var a23 = a[2 * 4 + 3];
      var a30 = a[3 * 4 + 0];
      var a31 = a[3 * 4 + 1];
      var a32 = a[3 * 4 + 2];
      var a33 = a[3 * 4 + 3];
      var b00 = b[0 * 4 + 0];
      var b01 = b[0 * 4 + 1];
      var b02 = b[0 * 4 + 2];
      var b03 = b[0 * 4 + 3];
      var b10 = b[1 * 4 + 0];
      var b11 = b[1 * 4 + 1];
      var b12 = b[1 * 4 + 2];
      var b13 = b[1 * 4 + 3];
      var b20 = b[2 * 4 + 0];
      var b21 = b[2 * 4 + 1];
      var b22 = b[2 * 4 + 2];
      var b23 = b[2 * 4 + 3];
      var b30 = b[3 * 4 + 0];
      var b31 = b[3 * 4 + 1];
      var b32 = b[3 * 4 + 2];
      var b33 = b[3 * 4 + 3];
      return [
        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
      ];
    },
  
    translation: function(tx, ty, tz) {
      return [
         1,  0,  0,  0,
         0,  1,  0,  0,
         0,  0,  1,  0,
         tx, ty, tz, 1,
      ];
    },
  
    xRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
  
      return [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1,
      ];
    },
  
    yRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
  
      return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1,
      ];
    },
  
    zRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
  
      return [
         c, s, 0, 0,
        -s, c, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1,
      ];
    },
  
    scaling: function(sx, sy, sz) {
      return [
        sx, 0,  0,  0,
        0, sy,  0,  0,
        0,  0, sz,  0,
        0,  0,  0,  1,
      ];
    },
  
    makeZToMatrix: function(fudgeFactor){
      return [
        1, 0,  0,  0,
        0, 1,  0,  0,
        0,  0, 1,  fudgeFactor,
        0,  0,  0,  1,
      ];
    },
  
    translate: function(m, tx, ty, tz) {
      return m4.multiply(m, m4.translation(tx, ty, tz));
    },
  
    xRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.xRotation(angleInRadians));
    },
  
    yRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.yRotation(angleInRadians));
    },
  
    zRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.zRotation(angleInRadians));
    },
  
    scale: function(m, sx, sy, sz) {
      return m4.multiply(m, m4.scaling(sx, sy, sz));
    },
  
    inverse: function(m) {
      var m00 = m[0 * 4 + 0];
      var m01 = m[0 * 4 + 1];
      var m02 = m[0 * 4 + 2];
      var m03 = m[0 * 4 + 3];
      var m10 = m[1 * 4 + 0];
      var m11 = m[1 * 4 + 1];
      var m12 = m[1 * 4 + 2];
      var m13 = m[1 * 4 + 3];
      var m20 = m[2 * 4 + 0];
      var m21 = m[2 * 4 + 1];
      var m22 = m[2 * 4 + 2];
      var m23 = m[2 * 4 + 3];
      var m30 = m[3 * 4 + 0];
      var m31 = m[3 * 4 + 1];
      var m32 = m[3 * 4 + 2];
      var m33 = m[3 * 4 + 3];
      var tmp_0  = m22 * m33;
      var tmp_1  = m32 * m23;
      var tmp_2  = m12 * m33;
      var tmp_3  = m32 * m13;
      var tmp_4  = m12 * m23;
      var tmp_5  = m22 * m13;
      var tmp_6  = m02 * m33;
      var tmp_7  = m32 * m03;
      var tmp_8  = m02 * m23;
      var tmp_9  = m22 * m03;
      var tmp_10 = m02 * m13;
      var tmp_11 = m12 * m03;
      var tmp_12 = m20 * m31;
      var tmp_13 = m30 * m21;
      var tmp_14 = m10 * m31;
      var tmp_15 = m30 * m11;
      var tmp_16 = m10 * m21;
      var tmp_17 = m20 * m11;
      var tmp_18 = m00 * m31;
      var tmp_19 = m30 * m01;
      var tmp_20 = m00 * m21;
      var tmp_21 = m20 * m01;
      var tmp_22 = m00 * m11;
      var tmp_23 = m10 * m01;
  
      var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
          (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
      var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
          (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
      var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
          (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
      var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
          (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  
      var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  
      return [
        d * t0,
        d * t1,
        d * t2,
        d * t3,
        d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
              (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
        d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
              (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
        d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
              (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
        d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
              (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
        d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
              (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
        d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
              (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
        d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
              (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
        d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
              (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
        d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
              (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
        d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
              (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
        d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
              (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
        d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
              (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
      ];
    },
  
    vectorMultiply: function(v, m) {
      var dst = [];
      for (var i = 0; i < 4; i++) {
        dst[i] = 0.0;
        for(var j = 0; j < 4; j++) {
          dst[i] += v[j] * m[j * 4 + 1];
        }
      }
    }
  
  };
  
  function degreesToRadians(degree)
  {
    return degree * Math.PI / 180;
  }