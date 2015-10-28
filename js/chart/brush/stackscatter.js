jui.define("chart.brush.stackscatter", [], function() {

	/**
	 * @class chart.brush.stackscatter
	 * @extends chart.brush.scatter
	 */
	var StackScatterBrush = function() {
        this.draw = function() {
            return this.drawScatter(this.getStackXY());
        }
	}

	return StackScatterBrush;
}, "chart.brush.scatter");