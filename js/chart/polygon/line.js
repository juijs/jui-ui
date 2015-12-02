jui.define("chart.polygon.line", [], function() {
    var LinePolygon = function(x1, y1, d1, x2, y2, d2) {
        this.vertices = [
            new Float32Array([ x1, y1, d1, 1 ]),
            new Float32Array([ x2, y2, d2, 1 ])
        ];

        this.vectors = [];
    }

    return LinePolygon;
}, "chart.polygon.core");