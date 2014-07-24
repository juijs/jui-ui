jui.define("chart.draw", [ "util" ], function(_) {
    var Draw = function() {
        this.render = function(chart) {
            if(!_.typeCheck("function", this._draw)) {
                throw new Error("JUI_CRITICAL_ERR: '_draw' method must be implemented");
            }

            this._draw(chart);
        }
    }

    return Draw;
});