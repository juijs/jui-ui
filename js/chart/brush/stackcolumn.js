jui.define("chart.brush.stackcolumn", [], function() {

	var ColumnStackBrush = function(brush) {
		var g, zeroY, count, width, barWidth, gauge;
		var outerPadding = brush.outerPadding || 15;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.x(), chart.y());

			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			barWidth = width - outerPadding * 2;
		}

		this.draw = function(chart) {
			var chart_height = chart.height();
			for (var i = 0; i < count; i++) {

				var startX = brush.x(i) - barWidth/2;

				var heightSum = 0;
				var heightArr = [];
				for (var j = 0; j < brush.target.length; j++) {
					var height = chart.data(i, brush.target[j]);

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
						fill : chart.theme.color(j, brush.colors)
					});

                    this.addEvent(brush, chart, r, i, j);
					g.append(r);

					startY += heightArr[j]
				}
			}
		}
	}

	return ColumnStackBrush;
}, "chart.brush.core");
