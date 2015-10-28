jui.define("chart.polygon.core", [ "util.transform", "util.math" ], function(Transform, math) {
    var PolygonCore = function() {
        this.perspective = 0.9;
        this.vertices = [];
        this.faces = [];
        this.edges = [];

        this.normalize = function() {
            for(var i = 0; i < this.vertices.length; i++) {
                var x = this.vertices[i][0],
                    y = this.vertices[i][1],
                    z = this.vertices[i][2],
                    u = Math.sqrt(x*x + y*y + z*z);

                this.vertices[i][0] /= u;
                this.vertices[i][1] /= u;
                this.vertices[i][2] /= u;
            }
        }

        this.rotate = function(width, height, depth, degree) {
            var t = new Transform(this.vertices),
                p = this.perspective,
                cx = width / 2,
                cy = height / 2,
                cz = depth / 2;

            t.merge2(function(x, y, z, w) {
                var s = math.scaleValue(z, 0, depth, 1, p);

                return [
                    [ "move3d", cx, cy, cz ],
                    [ "rotate3dx", degree.x ],
                    [ "rotate3dy", degree.y ],
                    [ "rotate3dz", degree.z ],
                    [ "scale3d", s, s, 1 ],
                    [ "move3d", -cx, -cy, -cz ]
                ]
            });
        }
    }

    return PolygonCore;
});