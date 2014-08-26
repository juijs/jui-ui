jui.define("chart.brush.stackline", [], function() {

	var StackLineBrush = function(brush) {

        this.draw = function(chart) {
            this.drawLine(brush, chart, this.getStackXY(brush, chart));
        }
	}

	return StackLineBrush;
}, "chart.brush.line");