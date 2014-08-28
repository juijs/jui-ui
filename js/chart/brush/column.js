jui.define("chart.brush.column", [], function() {

	var ColumnBrush = function(brush) {
		var g, zeroY, count, width, columnWidth, half_width;
		var outerPadding = brush.outerPadding || 2, innerPadding = brush.innerPadding || 1;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.x(), chart.y());

			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			half_width = (width - outerPadding * 2);
			columnWidth = (width - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;
		}

		this.draw = function(chart) {
			for (var i = 0; i < count; i++) {
				var startX = brush.x(i) - half_width/2;

				for (var j = 0; j < brush.target.length; j++) {
					var startY = brush.y(chart.series(brush.target[j]).data[i]);

					if (startY <= zeroY) {
						var r = chart.svg.rect({
							x : startX,
							y : startY,
							width : columnWidth,
							height : Math.abs(zeroY - startY),
							fill : chart.theme.color(j)
						});

						g.append(r);
					} else {
						var r = chart.svg.rect({
							x : startX,
							y : zeroY,
							width : columnWidth,
							height : Math.abs(zeroY - startY),
							fill : chart.theme.color(j)
						});

						g.append(r);
					}

					startX += columnWidth + innerPadding;
				}
			}
		}
	}

	return ColumnBrush;
}, "chart.brush");
