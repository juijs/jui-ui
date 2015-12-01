jui.define("chart.polygon.grid", [], function() {
    var GridPolygon = function(type, width, height, depth) {
        var matrix = {
            center: [
                new Float32Array([ 0, 0, depth, 1 ]),
                new Float32Array([ width, 0, depth, 1 ]),
                new Float32Array([ width, height, depth, 1 ]),
                new Float32Array([ 0, height, depth, 1 ])
            ],
            horizontal: [
                new Float32Array([ 0, height, 0, 1 ]),
                new Float32Array([ width, height, 0, 1 ]),
                new Float32Array([ width, height, depth, 1 ]),
                new Float32Array([ 0, height, depth, 1 ])
            ],
            vertical: [
                new Float32Array([ width, 0, 0, 1 ]),
                new Float32Array([ width, height, 0, 1 ]),
                new Float32Array([ width, height, depth, 1 ]),
                new Float32Array([ width, 0, depth, 1 ])
            ]
        };

        this.vertices = matrix[type];

        this.vectors = [];
    }

    return GridPolygon;
}, "chart.polygon.core");