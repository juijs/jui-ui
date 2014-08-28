jui.define("chart.brush.stackbar", [], function() {

	var StackBarBrush = function(brush) {
		var g, series, count, height, barWidth;
		var outerPadding = brush.outerPadding || 15;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.x(), chart.y());

			series = chart.series();
			count = chart.data().length;

			height = brush.y.rangeBand();
			barWidth = height - outerPadding * 2;
		}

		this.draw = function(chart) {
			for (var i = 0; i < count; i++) {
				var startY = brush.y(i) - barWidth/2;

				var widthSum = 0;
				var widthArr = [];
				for (var j = 0; j < brush.target.length; j++) {
					var width = chart.series(brush.target[j]).data[i];

					widthSum += width;
					widthArr.push(brush.x(width));
				}

				var startX = 0;

				for (var j = 0; j < widthArr.length; j++) {
					var r = chart.svg.rect({
						x : startX,
						y : startY,
						width : widthArr[j],
						height : barWidth,
						fill : chart.theme.color(j)
					});

					g.append(r);

					startX += widthArr[j]
				}

			}
		}
	}

	return StackBarBrush;
}, "chart.brush");
