jui.define("chart.grid", [ "util" ], function(_) {
    var Grid = function() {

      
        this.render = function(chart) {
            if (!_.typeCheck("function", this.draw)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
            }

            if (_.typeCheck("function", this.drawBefore)) {
                this.drawBefore(chart);
            }

            return this.draw(chart);
        }

    }

    return Grid;
}, "chart.draw");