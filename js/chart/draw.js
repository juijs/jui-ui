jui.define("chart.draw", [], function() {
    var Draw = function() {
        this.render = function(chart) {
            //this.calculate();
            this.paint(chart);
        }
    }

    return Draw;
});