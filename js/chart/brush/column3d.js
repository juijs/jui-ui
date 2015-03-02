jui.define("chart.brush.column3d", [], function() {

    /**
     * @class chart.brush.column3d
     *
     * implements column brush
     *
     * @extends chart.brush.bar
     */
	var Column3DBrush = function(chart, axis, brush) {
		var g;
		var zeroY, width, col_width, half_width;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroY = axis.y(0);
			width = axis.x.rangeBand();
			half_width = (width - brush.outerPadding * 2);

			col_width = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
            col_width = (col_width < 0) ? 0 : col_width;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
                for(var j = 0; j < brush.target.length; j++) {
                    var xy = axis.c(i, data[brush.target[j]]);

                    this.chart.svg.circle({
                        r: 2,
                        fill: this.color(j),
                        cx: xy.x,
                        cy: xy.y
                    });
                }
			});

            return g;
		}
	}

	return Column3DBrush;
}, "chart.brush.core");
