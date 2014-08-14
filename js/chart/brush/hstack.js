jui.define("chart.brush.hstack", [], function() {

	var HStackBrush = function(brush) {
		var g, zeroY, series, count, height, barWidth;
		var outerPadding = 15, innerPadding = 10;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

			series = chart.series();
			count = chart.series(brush.target[0]).data.length;

			height = chart.y.scale.rangeBand();
			barWidth = height - outerPadding * 2;
		}

		this.draw = function(chart) {
			for (var i = 0; i < count; i++) {
				var startY = brush.y.scale(i) + outerPadding;

				var widthSum = 0;
				var widthArr = [];
				for (var j = 0; j < brush.target.length; j++) {
					var width = chart.series(brush.target[j]).data[i];

					widthSum += width;
					widthArr.push(brush.x.scale(width));
				}

				var startX = 0;

				for (var j = 0; j < widthArr.length; j++) {
					var r = chart.svg.rect({
						x : startX,
						y : startY,
						width : widthArr[j],
						height : barWidth,
						fill : this.color(j)
					});

					g.append(r);

					startX += widthArr[j]
				}

			}
		}
	}

	return HStackBrush;
}, "chart.brush");
