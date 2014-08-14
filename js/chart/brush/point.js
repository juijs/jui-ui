jui.define("chart.brush.point", [], function() {

	var PointBrush = function(brush) {
		var g, zeroY, count, width;
		var r = 5, pos = brush.position || "middle"

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
			count = chart.series(brush.target[0]).data.length;
			width = brush.x.scale.rangeBand();
		}

		this.draw = function(chart) {
			for (var i = 0; i < count; i++) {
				var startX = brush.x.scale(i) + getPositionX();

				for (var j = 0; j < brush.target.length; j++) {
					var data = chart.series(brush.target[j]).data[i], startY = brush.y.scale(data);
					var circle = chart.svg.circle({
						cx : startX,
						cy : startY,
						r : r,
						fill : this.color(j)
					});

					circle.attr(chart.attr(brush.type, brush.target[j]));

					(function(c, d) {
						circle.on("click", function() {
							chart.emit("click", [c, d]);
						});
					})(circle, data);

					g.append(circle);
				}
			}
		}
	}

	return PointBrush;
}, "chart.brush"); 