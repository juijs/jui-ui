jui.define("chart.brush.stackline", [], function() {

	var StackLineBrush = function(chart, brush) {

        this.draw = function() {
            return this.drawLine(chart, brush, this.getStackXY());
        }
	}

	return StackLineBrush;
}, "chart.brush.line");