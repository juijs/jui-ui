jui.define("chart.polygon.gridpoint", [], function() {
    var GridPointPolygon = function(x, y, d) {
        this.vertices = [
            new Float32Array([ x, y, d, 1 ])
        ]
    }

    return GridPointPolygon;
}, "chart.polygon.core");