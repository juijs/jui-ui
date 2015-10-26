jui.define("chart.polygon.core", [ "util.transform" ], function(Transform) {
    var PolygonCore = function() {
        this.vertices = [];
        this.faces = [];
        this.edges = [];
        this.perspective = 1;

        this.rotate = function(width, height, depth, degree) {
            var t = new Transform(this.vertices),
                cx = width / 2,
                cy = height / 2,
                cz = depth / 2;

            this.vertices = t.merge(

                // Perspective Matrix (fov, aspect, near, far)
                [ "perspective", 70, 1, 1, 10000 ],

                // LookAt Matrix (eye, target, up)
                [
                    "lookat",
                    width, 0, depth,
                    0, height, 0,
                    1, 1, 1
                ],

                // Model Matrix
                [ "move3d", cx, cy, cz ],
                [ "rotate3dx", degree.x ],
                [ "rotate3dy", degree.y ],
                [ "rotate3dz", degree.z ],
                [ "move3d", -cx, -cy, -cz ]
            );
        }
    }

    return PolygonCore;
});