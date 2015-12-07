jui.define("chart.polygon.core", [ "chart.vector", "util.transform", "util.math", "util.base" ],
    function(Vector, Transform, math, _) {

    var PolygonCore = function() {
        this.perspective = 0.9;

        this.rotate = function(width, height, depth, degree) {
            var p = this.perspective,
                cx = width / 2,
                cy = height / 2,
                cz = depth / 2,
                maxDepth = Math.max(width, height, depth),
                t = new Transform(this.vertices),
                m = t.matrix("move3d", cx, cy, cz);

            // 폴리곤 이동 및 각도 변경
            m = math.matrix3d(m, t.matrix("rotate3dx", degree.x));
            m = math.matrix3d(m, t.matrix("rotate3dy", degree.y));
            m = math.matrix3d(m, t.matrix("rotate3dz", degree.z));
            m = math.matrix3d(m, t.matrix("move3d", -cx, -cy, -cz));
            this.vertices = t.custom(m);

            for (var i = 0, count = this.vertices.length; i < count; i++) {
                var far = Math.abs(this.vertices[i][2] - maxDepth),
                    s = math.scaleValue(far, 0, maxDepth, p, 1),
                    t2 = new Transform(),
                    m2 = t2.matrix("move3d", cx, cy, maxDepth/2);

                // 폴리곤 스케일 변경
                m2 = math.matrix3d(m2, t2.matrix("scale3d", s, s, s));
                m2 = math.matrix3d(m2, t2.matrix("move3d", -cx, -cy, -maxDepth/2));
                this.vertices[i] = math.matrix3d(m2, this.vertices[i]);

                // 벡터 객체 생성 및 갱신
                if(_.typeCheck("array", this.vectors)) {
                    if(this.vectors[i] == null) {
                        this.vectors[i] = new Vector(this.vertices[i][0], this.vertices[i][1], this.vertices[i][2]);
                    } else {
                        this.vectors[i].x = this.vertices[i][0];
                        this.vectors[i].y = this.vertices[i][1];
                        this.vectors[i].z = this.vertices[i][2];
                    }
                }
            }
        }

        this.min = function() {
            var obj = {
                x: this.vertices[0][0],
                y: this.vertices[0][1],
                z: this.vertices[0][2]
            };

            for(var i = 1, len = this.vertices.length; i < len; i++) {
                obj.x = Math.min(obj.x, this.vertices[i][0]);
                obj.y = Math.min(obj.y, this.vertices[i][1]);
                obj.z = Math.min(obj.z, this.vertices[i][2]);
            }

            return obj;
        }

        this.max = function() {
            var obj = {
                x: this.vertices[0][0],
                y: this.vertices[0][1],
                z: this.vertices[0][2]
            };

            for(var i = 1, len = this.vertices.length; i < len; i++) {
                obj.x = Math.max(obj.x, this.vertices[i][0]);
                obj.y = Math.max(obj.y, this.vertices[i][1]);
                obj.z = Math.max(obj.z, this.vertices[i][2]);
            }

            return obj;
        }
    }

    return PolygonCore;
});