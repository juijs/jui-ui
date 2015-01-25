jui.define("chart.brush.path", [], function() {

    /**
     * @class chart.brush.path 
     * 
     * implements path brush  
     *  
     * @extends chart.brush.core
     */
	var PathBrush = function(chart, axis, brush) {

		this.draw = function() {
			var g = this.chart.svg.group();
			
			for(var ti = 0, len = this.brush.target.length; ti < len; ti++) {
				var color = this.color(ti);

				var path = chart.svg.path({
					fill : color,
					"fill-opacity" : chart.theme("pathBackgroundOpacity"),
					stroke : color,
					"stroke-width" : chart.theme("pathBorderWidth")
				});
	
				g.append(path);
	
				this.eachData(function(i, data) {
					var obj = this.axis.c(i, data[brush.target[ti]]),
						x = obj.x - chart.area("x"),
						y = obj.y - chart.area("y");

					if (i == 0) {
						path.MoveTo(x, y);
					} else {
						path.LineTo(x, y);
					}
				});
	
				path.ClosePath();
			}

			return g;
		}
	}

	return PathBrush;
}, "chart.brush.core");
