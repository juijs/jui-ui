jui.define("chart.brush.stackscatter", [], function() {

	var ScatterBrush = function(brush) {

        this.draw = function(chart) {
            this.drawScatter(brush, chart, this.getStackXY(brush, chart));
        }
	}

	return ScatterBrush;
}, "chart.brush.scatter");