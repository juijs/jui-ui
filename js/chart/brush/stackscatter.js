jui.define("chart.brush.stackscatter", [], function() {

	var StackScatterBrush = function(brush) {

        this.draw = function(chart) {
            return this.drawScatter(brush, chart, this.getStackXY(brush, chart));
        }
	}

	return StackScatterBrush;
}, "chart.brush.scatter");