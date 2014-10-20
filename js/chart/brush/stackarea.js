jui.define("chart.brush.stackarea", [], function() {

	var StackAreaBrush = function(brush) {

		this.draw = function(chart) {
            return this.drawArea(chart, brush, this.getStackXY());
		}
	}

	return StackAreaBrush;
}, "chart.brush.area");
