jui.define("chart.brush.path", [], function() {

	var PathBrush = function(brush) {
		this.drawBefore = function(chart) {
		}

		this.draw = function(chart) {

			var g = chart.svg.group({
				'class' : 'brush path'
			});
			
			for(var ti = 0, len = brush.target.length; ti < len; ti++) {
				var s = chart.series(brush.target[ti]);
	
				var color = chart.theme.color(ti+2, brush.colors);
				var path = chart.svg.path({
					fill : color,
					"fill-opacity" : chart.theme("pathOpacity"),
					stroke : color,
					"stroke-width" : chart.theme("pathBorderWidth")
				});
	
				g.append(path);
	
				for (var i = 0; i < s.data.length; i++) {
					var obj = brush.c(i, s.data[i]);
	
					if (i == 0) {
						path.MoveTo(obj.x, obj.y);
					} else {
						path.LineTo(obj.x, obj.y);
					}
				}
	
				path.ClosePath();				
			}


			return this;
		}
	}

	return PathBrush;
}, "chart.brush.core");
