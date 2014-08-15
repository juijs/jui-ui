jui.define("chart.brush.line", [], function() {

	var LineBrush = function(brush) {
		var g, zeroY, count, width;
        var pos = brush.position || "middle";

        function getPositionX() {
            if (pos == "left")
                return 0;
            else if (pos == "right")
                return width;

            return width / 2;
        }

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

			zeroY = brush.y.scale(0);
			count = chart.data().length;
			width = chart.x.scale.rangeBand();
		}

		this.draw = function(chart) {
			var path = {};

			for (var i = 0; i < count; i++) {
				var startX = brush.x.scale(i) + getPositionX(),
                    valueSum = 0;

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

			for (var k in path) {
				var p = chart.svg.path({
					stroke : this.color(k),
					"stroke-width" : 2,
					fill : "transparent"
				});

				var x = path[k].x, y = path[k].y, px = [], py = [];

				if (brush.curve) {
					px = this.curvePoints(x);
					py = this.curvePoints(y);
				}

				for (var i = 0; i < x.length - 1; i++) {
					p.MoveTo(x[i], y[i]);

					if (brush.smooth) {
						p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
					} else {
						p.LineTo(x[i + 1], y[i + 1]);
					}
				}

                p.attr(chart.attr(brush.type, brush.target[j]));
				g.append(p);
			}
		}
	}

	return LineBrush;
}, "chart.brush"); 