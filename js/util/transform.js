jui.define("util.transform", [ "util.math" ], function(math) {
    var Transform = function(points) {

        function calculate(m) {
            for(var i = 0, count = points.length; i < count; i++) {
                points[i] = math.matrix(m, points[i]);
            }

            return points;
        }

        function makeFrustum(left, right, bottom, top, near, far) {
            var x = 2 * near / (right - left);
            var y = 2 * near / (top - bottom);

            var a = ( right + left ) / ( right - left );
            var b = ( top + bottom ) / ( top - bottom );
            var c = - ( far + near ) / ( far - near );
            var d = - 2 * far * near / ( far - near );

            return [
                [ x, 0, a, 0 ],
                [ 0, y, b, 0 ],
                [ 0, 0, c, d ],
                [ 0, 0, -1, 0 ]
            ];

            /*/
            te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
            te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
            te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
            te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;
            /**/
        }

        function makePerspective(fov, aspect, near, far) {
            var ymax = near * Math.tan( math.radian( fov * 0.5 ) );
            var ymin = - ymax;
            var xmin = ymin * aspect;
            var xmax = ymax * aspect;

            return makeFrustum( xmin, xmax, ymin, ymax, near, far );
        }

        function lookAt(eye, center, up) {
            var eye0 = eye[0],
                eye1 = eye[1],
                eye2 = eye[2],
                up0 = up[0],
                up1 = up[1],
                up2 = up[2],
                center0 = center[0],
                center1 = center[1],
                center2 = center[2];

            //var x = vec3.create(), y = vec3.create(), z = vec3.create();
            /*/
            if (eye0 == center0 && eye1 == center1 && eye2 == center2) {
                return mat4.identity();
            }
            /**/

            var z0,z1,z2,l,x0,x1,x2,y0,y1,y2;

            //vec3.direction(eye, center, z);
            z0 = eye0 - center0;
            z1 = eye1 - center1;
            z2 = eye2 - center2;

            // normalize (no check needed for 0 becuase of early return)
            l = Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 = z0/l;
            z1 = z1/l;
            z2 = z2/l;

            //vec3.normalize(vec3.cross(up, z, x));
            x0 = up1 * z2 - up2 * z1;
            x1 = up2 * z0 - up0 * z2;
            x2 = up0 * z1 - up1 * z0;
            l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

            if (l == 0) {
                x0 = 0;
                x1 = 0;
                x2 = 0;
            } else {
                x0 = x0/l;
                x1 = x1/l;
                x2 = x2/l;
            };

            //vec3.normalize(vec3.cross(z, x, y));
            y0 = z1 * x2 - z2 * x1;
            y1 = z2 * x0 - z0 * x2;
            y2 = z0 * x1 - z1 * x0;
            l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);

            if (l == 0) {
                y0 = 0;
                y1 = 0;
                y2 = 0;
            } else {
                y0 = y0/l;
                y1 = y1/l;
                y2 = y2/l;
            }

            return [
                [ x0, y0, z0, 0 ],
                [ x1, y1, z1, 0 ],
                [ x2, y2, z2, 0 ],
                [
                    -(x0 * eye0 + x1 * eye1 + x2 * eye2),
                    -(y0 * eye0 + y1 * eye1 + y2 * eye2),
                    -(z0 * eye0 + z1 * eye1 + z2 * eye2),
                    1
                ]
            ]
        };

        // 매트릭스 맵
        this.matrix = function() {
            var a = arguments,
                type = a[0];

            var map = {
                // 2D 행렬, 3x3
                move: [
                    [ 1, 0, a[1] ],
                    [ 0, 1, a[2] ],
                    [ 0, 0, 1 ]
                ],
                scale: [
                    [ a[1], 0, 0 ],
                    [ 0, a[2], 0 ],
                    [ 0, 0, 1 ]
                ],
                rotate: [
                    [ Math.cos(math.radian(a[1])), -Math.sin(math.radian(a[1])), 0 ],
                    [ Math.sin(math.radian(a[1])), Math.cos(math.radian(a[1])), 0 ],
                    [ 0, 0, 1 ]
                ],

                // 3D 행렬, 4x4
                move3d: [
                    [ 1, 0, 0, a[1] ],
                    [ 0, 1, 0, a[2] ],
                    [ 0, 0, 1, a[3] ],
                    [ 0, 0, 0, 1 ]
                ],
                scale3d: [
                    [ a[1], 0, 0, 0 ],
                    [ 0, a[2], 0, 0 ],
                    [ 0, 0, a[3], 0 ],
                    [ 0, 0, 0, 1 ]
                ],
                rotate3dz: [
                    [ Math.cos(math.radian(a[1])), -Math.sin(math.radian(a[1])), 0, 0 ],
                    [ Math.sin(math.radian(a[1])), Math.cos(math.radian(a[1])), 0, 0 ],
                    [ 0, 0, 1, 0 ],
                    [ 0, 0, 0, 1 ]
                ],
                rotate3dx: [
                    [ 1, 0, 0, 0 ],
                    [ 0, Math.cos(math.radian(a[1])), -Math.sin(math.radian(a[1])), 0 ],
                    [ 0, Math.sin(math.radian(a[1])), Math.cos(math.radian(a[1])), 0 ],
                    [ 0, 0, 0, 1 ]
                ],
                rotate3dy: [
                    [ Math.cos(math.radian(a[1])), 0, Math.sin(math.radian(a[1])), 0 ],
                    [ 0, 1, 0, 0 ],
                    [ -Math.sin(math.radian(a[1])), 0, Math.cos(math.radian(a[1])), 0 ],
                    [ 0, 0, 0, 1 ]
                ],
                perspective: makePerspective(a[1], a[2], a[3], a[4]),
                lookat: lookAt([ a[1], a[2], a[3] ], [ a[4], a[5], a[6] ], [ a[7], a[8], a[9] ])
            }

            return map[type];
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

        this.perspective3d = function(depth) {
            return calculate(this.matrix("perspective3d", depth));
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
    }

    return Transform;
});