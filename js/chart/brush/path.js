jui.define("chart.brush.path", [], function() {

	var PathBrush = function(brush) {

		this.draw = function(chart) {
			var g = chart.svg.group({
				'class' : 'brush path'
			});
			
			var data = chart.data(),
                data_count = data.length;
			
			for(var ti = 0, len = brush.target.length; ti < len; ti++) {
				var color = chart.color(ti, brush.colors);

				var path = chart.svg.path({
					fill : color,
					"fill-opacity" : chart.theme("pathOpacity"),
					stroke : color,
					"stroke-width" : chart.theme("pathBorderWidth")
				});
	
				g.append(path);
	
				for (var i = 0; i < data_count; i++) {
					var obj = brush.c(i, chart.data(i, brush.target[ti]));
	
					if (i == 0) {
						path.MoveTo(obj.x, obj.y);
					} else {
						path.LineTo(obj.x, obj.y);
					}
				}
	
				path.ClosePath();				
			}

			return g;
		}

        this.drawSetup = function() {
            return {}
        }
	}

	return PathBrush;
}, "chart.brush.core");
