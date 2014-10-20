jui.define("chart.brush.stackline", [], function() {

	var StackLineBrush = function(brush) {

        this.draw = function(chart) {
            return this.drawLine(chart, brush, this.getStackXY());
        }
	}

	return StackLineBrush;
}, "chart.brush.line");