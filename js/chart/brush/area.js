jui.define("chart.brush.area", [], function() {

	var AreaBrush = function(brush) {
		var g, zeroY, maxY, count, width;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

			zeroY = brush.y.scale(0);
			maxY = chart.area('height');
			count = chart.data().length;
			width = chart.x.scale.rangeBand();
		}

		this.draw = function(chart) {
			var path = [];

			for (var i = 0; i < count; i++) {
				var startX = brush.x.scale(i) + 1, valueSum = 0;

				for (var j = 0; j < brush.target.length; j++) {
					var value = chart.series(brush.target[j]).data[i];

					if (brush.nest === false && j > 0) {
						valueSum += chart.series(brush.target[j - 1]).data[i];
					}

					if (!path[j]) {
						path[j] = {
							x : [],
							y : []
						};
					}

					path[j].x.push(startX);
					path[j].y.push(brush.y.scale(value + valueSum));
				}
			}

			for (var i = 0; i < path.length; i++) {
				var p = chart.svg.polygon({
					fill : this.color(i),
					opacity : 0.9
				});

				var x = path[i].x, y = path[i].y;

				p.point(x[0], maxY);

				for (var j = 0; j < x.length - 1; j++) {
					p.point(x[j], y[j]);
				}

				p.point(x[x.length - 1], y[y.length - 1]);
				p.point(x[x.length - 1], maxY);

                p.attr(chart.attr(brush.type, brush.target[j]));
				g.prepend(p);
			}
		}
	}

	return AreaBrush;
}, "chart.brush");
