jui.define("chart.brush.stackscatter", [], function() {

	var StackScatterBrush = function(brush) {

        this.draw = function(chart) {
            return this.drawScatter(brush, chart, this.getStackXY());
        }
	}

	return StackScatterBrush;
}, "chart.brush.scatter");