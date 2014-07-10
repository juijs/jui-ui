jui.define("chart.core", [ "svg", "util" ], function(svg, _) {
    var UIChart = function() {
        this.merge = function(grid) {
            return this.draw() + ", " + grid.draw();
        }
    }

    return UIChart;
}, "core");