jui.define("chart.brush.stackarea", [], function() {

	var StackAreaBrush = function(brush) {

		this.draw = function(chart) {
            this.drawArea(brush, chart, this.getStackXY(brush, chart));
		}
	}

	return StackAreaBrush;
}, "chart.brush.area");
