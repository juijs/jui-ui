jui.define("chart.brush.stack", [], function() {

	var StackBrush = function(brush) {
		var g, zeroY, count, width, barWidth, gauge;
		var outerPadding = brush.outerPadding || 15;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			barWidth = width - outerPadding * 2;
		}

		this.draw = function(chart) {
			var chart_height = chart.area('height');
			for (var i = 0; i < count; i++) {

				var startX = brush.x(i) - barWidth/2;

				var heightSum = 0;
				var heightArr = [];
				for (var j = 0; j < brush.target.length; j++) {
					var height = chart.series(brush.target[j]).data[i];

					heightSum += height;
					heightArr.push(chart_height - brush.y(height));
				}

				var startY = brush.y(heightSum);

				for (var j = heightArr.length - 1; j >= 0; j--) {
					var r = chart.svg.rect({
						x : startX,
						y : startY,
						width : barWidth,
						height : heightArr[j],
						fill : this.color(j)
					});

					g.append(r);

					startY += heightArr[j]
				}
			}
		}
	}

	return StackBrush;
}, "chart.brush");
