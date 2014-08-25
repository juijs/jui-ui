jui.define("chart.brush.area", [], function() {

	var AreaBrush = function(brush) {
		var path = [];
        var zeroY, maxY, count, width;

		this.drawBefore = function(chart) {
			zeroY = brush.y(0);
			maxY = chart.area('height');
			count = chart.data().length;
			width = brush.x.rangeBand();

            for (var i = 0; i < count; i++) {
                var startX = brush.x(i) + 1, valueSum = 0;

                for (var j = 0; j < brush.target.length; j++) {
                    var value = chart.series(brush.target[j]).data[i];

                    if (brush.stack && j > 0) {
                        valueSum += chart.series(brush.target[j - 1]).data[i];
                    }

                    if (!path[j]) {
                        path[j] = {
                            x : [],
                            y : []
                        };
                    }

                    path[j].x.push(startX);
                    path[j].y.push(brush.y(value + valueSum));
                }
            }
		}

		this.draw = function(chart) {
            var g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

			for (var i = 0; i < path.length; i++) {
				var p = chart.svg.polygon({
					fill : chart.theme.color(i),
					opacity : 0.5
				});

				var x = path[i].x, y = path[i].y;

				p.point(x[0], maxY);

				for (var j = 0; j < x.length - 1; j++) {
					p.point(x[j], y[j]);
				}

				p.point(x[x.length - 1], y[y.length - 1]);
				p.point(x[x.length - 1], maxY);

				g.prepend(p);
			}
		}
	}

	return AreaBrush;
}, "chart.brush");
