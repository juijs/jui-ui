jui.define("chart.core", [ "svg", "util" ], function(svg, _) {
    var UIChart = function() {
        this.render = function() {
            alert(this.draw());
        }
    }

    return UIChart;
}, "core");