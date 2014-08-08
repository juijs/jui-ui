jui.define("chart.brush.path", [], function() {

	var Brush = function(brush) {
		this.drawBefore = function(chart) {
		}
		
		this.draw = function(chart) {
			var series = chart.get('series');
			var s = series[brush.target[0]];
			var g = chart.svg.group();
			
			var path = chart.svg.path({
				fill : this.getColor(brush.index),
				"fill-opacity" : 0.5,
				stroke : this.getColor(brush.index + 1),
				"stroke-width" : 1
			});
			
			g.append(path);
			
			var x1 = 0;
			var y1 = 0;
			for(var i = 0; i < s.data.length; i++) {
				var obj = brush.c.xy(i, s.data[i]/s.max);
				
				g.append(chart.svg.circle({
					cx : obj.x,
					cy : obj.y,
					r : 3,
					fill : this.getColor(0)
				}));
				
				if (i == 0) {
					path.MoveTo(obj.x, obj.y);
				} else {
					path.LineTo(obj.x, obj.y);	
				}
			}
			
			path.ClosePath();

			return this; 
		}
	}

	return Brush;
}, "chart.brush");
