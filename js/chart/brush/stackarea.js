jui.define("chart.brush.stackarea", [], function() {

	var StackAreaBrush = function(chart, brush) {

		this.draw = function() {
            return this.drawArea(chart, brush, this.getStackXY());
		}
	}

	return StackAreaBrush;
}, "chart.brush.area");
