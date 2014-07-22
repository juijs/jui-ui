jui.define("chart.draw", [], function() {
    var Draw = function() {
        this.init = function() {
            this.calculate();
            this.draw();
        }
    }

    return Draw;
});