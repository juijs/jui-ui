jui.define("chart.brush.bar", [], function() {

	var BarBrush = function(brush) {
		var g, zeroY, count, width, barWidth;
		var outerPadding = brush.outerPadding || 15, innerPadding = brush.innerPadding || 10;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

			zeroY = brush.y(0);
			count = chart.data().length;

			width = chart.x.rangeBand();
			barWidth = (width - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;
		}

		this.draw = function(chart) {
			for (var i = 0; i < count; i++) {
				var startX = brush.x(i) + outerPadding;

				for (var j = 0; j < brush.target.length; j++) {
					var startY = brush.y(chart.series(brush.target[j]).data[i]);

					if (startY <= zeroY) {
						var r = chart.svg.rect({
							x : startX,
							y : startY,
							width : barWidth,
							height : Math.abs(zeroY - startY),
							fill : this.color(j)
						});

                        r.attr(chart.attr(brush.type, brush.target[j]));
						g.append(r);
					} else {
						var r = chart.svg.rect({
							x : startX,
							y : zeroY,
							width : barWidth,
							height : Math.abs(zeroY - startY),
							fill : this.color(j)
						});

                        r.attr(chart.attr(brush.type, brush.target[j]));
						g.append(r);
					}

					startX += barWidth + innerPadding;
				}
			}
		}
	}

	return BarBrush;
}, "chart.brush");
