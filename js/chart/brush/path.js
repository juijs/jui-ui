jui.define("chart.brush.path", [], function() {

	var Brush = function(brush) {
		this.drawBefore = function(chart) {
		}
		
		this.draw = function(chart) {
			var s = chart.series(brush.target[0]);
			var g = chart.svg.group({
				'class' : 'brush path'
			});
			
			var path = chart.svg.path({
				fill : this.color(brush.index+1),
				"fill-opacity" : 0.7,
				stroke : this.color(brush.index + 3),
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
					fill : this.color(0)
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
