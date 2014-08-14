jui.define("chart.brush.rpoint", [], function() {

	var PointBrush = function(brush) {
		var g, zeroY, count, width;
		var r = 1, pos = brush.position || "middle"

		this.drawBefore = function(chart) {
			var defs = chart.svg.defs();
			var clip = chart.svg.clipPath({
				id : 'clip'
			})
			defs.append(clip)
			clip.append(chart.svg.rect({
				x : 0,
				y : 0,
				width : chart.area('width'),
				height : chart.area('height')
			}))
			g = chart.svg.group({
				"clip-path" : "url(#clip)"
			}).translate(chart.area('x'), chart.area('y'));

			zeroY = brush.y.scale(0);
			count = chart.series(brush.target[0]).data.length;
		}

		this.draw = function(chart) {

			var raw = chart.series(brush.x.key).data;

			for (var i = 0; i < count; i++) {
				var startX = brush.x.scale(raw[i]);

				for (var j = 0; j < brush.target.length; j++) {
					var data = chart.series(brush.target[j]).data[i], startY = brush.y.scale(data);
					var circle = chart.svg.circle({
						cx : startX,
						cy : startY,
						r : r,
						fill : this.color(j)
					});

                    circle.attr(chart.attr(brush.type, brush.target[j]));
					g.append(circle);
				}
			}
		}
	}

	return PointBrush;
}, "chart.brush");
