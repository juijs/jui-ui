jui.define("chart.brush.stackarea", [], function() {

	/**
	 * @class chart.brush.stackarea
	 * @extends chart.brush.area
	 */
	var StackAreaBrush = function() {
		this.draw = function() {
            return this.drawArea(this.getStackXY());
		}
	}

	return StackAreaBrush;
}, "chart.brush.area");
