jui.define("chart.brush.bar", [], function() {

	var BarBrush = function(brush) {
		var g, zeroX, series, count, height, half_height, barHeight;
		var outerPadding = brush.outerPadding || 2, innerPadding = brush.innerPadding || 1;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.x(), chart.y());

			zeroX = brush.x(0);
			series = chart.series();
			count = chart.data().length;

			height = brush.y.rangeBand();
			half_height = height - outerPadding*2;
			barHeight = (half_height - (brush.target.length - 1) * innerPadding) / brush.target.length;
		}

		this.draw = function(chart) {
			for (var i = 0; i < count; i++) {
				var startY = brush.y(i) - half_height/2;

				for (var j = 0; j < brush.target.length; j++) {
					var startX = brush.x(chart.series(brush.target[j]).data[i]);

					if (startX >= zeroX) {
						var r = chart.svg.rect({
							x : zeroX,
							y : startY,
							height : barHeight,
							width : Math.abs(zeroX - startX),
							fill : chart.theme.color(j)
						});

						g.append(r);
					} else {
						var w = Math.abs(zeroX - startX);

						var r = chart.svg.rect({
							y : startY,
							x : zeroX - w,
							height : barHeight,
							width : w,
							fill : chart.theme.color(j)
						});

						g.append(r);
					}

					startY += barHeight + innerPadding;
				}
			}
		}
	}

	return BarBrush;
}, "chart.brush.core");
