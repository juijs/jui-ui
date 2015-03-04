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

		this.drawBefore = function() {
			g = chart.svg.group();
		}

		this.draw = function() {
			this.eachData(function(i, data) {
                for(var j = 0; j < brush.target.length; j++) {
                    var xy = axis.c(i, data[brush.target[j]], j);

                    g.append(this.chart.svg.circle({
                        r: 3,
                        fill: this.color(j),
                        cx: xy.x + 1.5,
                        cy: xy.y + 1.5
                    }));
                }
			});

            return g;
		}
	}

	return Column3DBrush;
}, "chart.brush.core");
