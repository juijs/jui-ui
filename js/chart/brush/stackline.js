jui.define("chart.brush.stackline", [], function() {

	/**
	 * @class chart.brush.stackline
	 * @extends chart.brush.line
	 */
	var StackLineBrush = function() {
        this.draw = function() {
            return this.drawLine(this.getStackXY());
        }
	}

	return StackLineBrush;
}, "chart.brush.line");