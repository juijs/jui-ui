jui.define("chart.brush.path", [], function() {

	var PathBrush = function(chart, brush) {

		this.draw = function() {
			var g = chart.svg.group({
				'class' : 'brush path'
			});
			
			var data = chart.data(),
                data_count = data.length;
			
			for(var ti = 0, len = brush.target.length; ti < len; ti++) {
				var color = chart.color(ti, brush);

				var path = chart.svg.path({
					fill : color,
					"fill-opacity" : chart.theme("pathOpacity"),
					stroke : color,
					"stroke-width" : chart.theme("pathBorderWidth")
				});
	
				g.append(path);
	
				for (var i = 0; i < data_count; i++) {
					var obj = brush.c(i, chart.data(i, brush.target[ti])),
						x = obj.x - chart.x(),
						y = obj.y - chart.y();
	
					if (i == 0) {
						path.MoveTo(x, y);
					} else {
						path.LineTo(x, y);
					}
				}
	
				path.ClosePath();
			}

			return g;
		}
	}

	return PathBrush;
}, "chart.brush.core");
