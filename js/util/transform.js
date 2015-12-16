jui.define("util.transform", [ "util.math" ], function(math) {
    var Transform = function(points) {
        function calculate(m) {
            for(var i = 0, count = points.length; i < count; i++) {
                points[i] = math.matrix(m, points[i]);
            }

            return points;
        }

        // 매트릭스 맵
        this.matrix = function() {
            var a = arguments,
                type = a[0];

            if(type == "move") {
                return [
                    new Float32Array([1, 0, a[1]]),
                    new Float32Array([0, 1, a[2]]),
                    new Float32Array([0, 0, 1])
                ];
            } else if(type == "scale") {
                return [
                    new Float32Array([ a[1], 0, 0 ]),
                    new Float32Array([ 0, a[2], 0 ]),
                    new Float32Array([ 0, 0, 1 ])
                ];
            } else if(type == "rotate") {
                return [
                    new Float32Array([ Math.cos(math.radian(a[1])), -Math.sin(math.radian(a[1])), 0 ]),
                    new Float32Array([ Math.sin(math.radian(a[1])), Math.cos(math.radian(a[1])), 0 ]),
                    new Float32Array([ 0, 0, 1 ])
                ];
            } else if(type == "move3d") {
                return [
                    new Float32Array([ 1, 0, 0, a[1] ]),
                    new Float32Array([ 0, 1, 0, a[2] ]),
                    new Float32Array([ 0, 0, 1, a[3] ]),
                    new Float32Array([ 0, 0, 0, 1 ])
                ];
            } else if(type == "scale3d") {
                return [
                    new Float32Array([ a[1], 0, 0, 0 ]),
                    new Float32Array([ 0, a[2], 0, 0 ]),
                    new Float32Array([ 0, 0, a[3], 0 ]),
                    new Float32Array([ 0, 0, 0, 1 ])
                ];
            } else if(type == "rotate3dz") {
                return [
                    new Float32Array([ Math.cos(math.radian(a[1])), -Math.sin(math.radian(a[1])), 0, 0 ]),
                    new Float32Array([ Math.sin(math.radian(a[1])), Math.cos(math.radian(a[1])), 0, 0 ]),
                    new Float32Array([ 0, 0, 1, 0 ]),
                    new Float32Array([ 0, 0, 0, 1 ])
                ];
            } else if(type == "rotate3dx") {
                return [
                    new Float32Array([ 1, 0, 0, 0 ]),
                    new Float32Array([ 0, Math.cos(math.radian(a[1])), -Math.sin(math.radian(a[1])), 0 ]),
                    new Float32Array([ 0, Math.sin(math.radian(a[1])), Math.cos(math.radian(a[1])), 0 ]),
                    new Float32Array([ 0, 0, 0, 1 ])
                ];
            } else if(type == "rotate3dy") {
                return [
                    new Float32Array([ Math.cos(math.radian(a[1])), 0, Math.sin(math.radian(a[1])), 0 ]),
                    new Float32Array([ 0, 1, 0, 0 ]),
                    new Float32Array([ -Math.sin(math.radian(a[1])), 0, Math.cos(math.radian(a[1])), 0 ]),
                    new Float32Array([ 0, 0, 0, 1 ])
                ];
            }
        }

        // 2차원 이동
        this.move = function(dx, dy) {
            return calculate(this.matrix("move", dx, dy));
        }

        // 3차원 이동
        this.move3d = function(dx, dy, dz) {
            return calculate(this.matrix("move3d", dx, dy, dz));
        }

        // 2차원 스케일
        this.scale = function(sx, sy) {
            return calculate(this.matrix("scale", sx, sy));
        }

        // 3차원 스케일
        this.scale3d = function(sx, sy, sz) {
            return calculate(this.matrix("scale3d", sx, sy, sz));
        }

        // 2차원 회전
        this.rotate = function(angle) {
            return calculate(this.matrix("rotate", angle));
        }

        // Z축 중심 3차원 회전 - 롤(ROLL)
        this.rotate3dz = function(angle) {
            return calculate(this.matrix("rotate3dz", angle));
        }

        // X축 중심 3차원 회전 - 롤(PITCH)
        this.rotate3dx = function(angle) {
            return calculate(this.matrix("rotate3dx", angle));
        }

        // Y축 중심 3차원 회전 - 요(YAW)
        this.rotate3dy = function(angle) {
            return calculate(this.matrix("rotate3dy", angle));
        }

        // 임의의 행렬 처리
        this.custom = function(m) {
            return calculate(m);
        }

        // 행렬의 병합
        this.merge = function() {
            var a = arguments,
                m = this.matrix.apply(this, a[0]);

            for(var i = 1; i < a.length; i++) {
                m = math.matrix(m, this.matrix.apply(this, a[i]));
            }

            return calculate(m);
        }

        // 행렬의 병합 (콜백 형태)
        this.merge2 = function(callback) {
            for(var i = 0, count = points.length; i < count; i++) {
                var a = callback.apply(null, points[i]),
                    m = this.matrix.apply(this, a[0]);

                for(var j = 1; j < a.length; j++) {
                    m = math.matrix(m, this.matrix.apply(this, a[j]));
                }

                points[i] = math.matrix(m, points[i]);
            }
        }
    }

    return Transform;
});