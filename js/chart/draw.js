jui.define("chart.draw", [], function() {
    var Draw = function() {
        this.init = function() {
            this._calculate();
            this._draw();
        }
    }

    return Draw;
});