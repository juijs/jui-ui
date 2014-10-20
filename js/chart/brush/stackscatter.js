jui.define("chart.brush.stackscatter", [], function() {

	var StackScatterBrush = function(chart, brush) {

        this.draw = function() {
            return this.drawScatter(chart, brush, this.getStackXY());
        }
	}

	return StackScatterBrush;
}, "chart.brush.scatter");