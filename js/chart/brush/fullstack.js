jui.define("chart.brush.fullstack", [], function() {

	var FullStackBrush = function(brush) {
		var g, zeroY, count, width, barWidth, gauge;
		var outerPadding = brush.outerPadding || 15;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

			zeroY = brush.y(0);
			count = chart.data().length;

			width = chart.x.rangeBand();
			barWidth = width - outerPadding * 2;
			gauge = brush.gauge || false;
		}

		this.draw = function(chart) {
			var chart_height = chart.area('height');
			for (var i = 0; i < count; i++) {

				var startX = brush.x(i) + outerPadding;

				var heightSum = 0;
				var heightArr = [];
				for (var j = 0; j < brush.target.length; j++) {
					var height = chart.series(brush.target[j]).data[i];

					heightSum += height;
					heightArr.push(height);
				}

				if (gauge) {
					var gaugeRect = chart.svg.rect({
						x : startX,
						y : 0,
						width : barWidth,
						height : chart_height,
						fill : this.color(6),
						"fill-opacity" : 0.1
					})

                    // 속성 옵션 적용
                    gaugeRect.attr(chart.attr(brush.type, brush.target[j]));

					g.append(gaugeRect);
				}

				var startY = 0;

				for (var j = heightArr.length - 1; j >= 0; j--) {
					
					var height = chart_height - brush.y.rate(heightArr[j] , heightSum); 
					
					var r = chart.svg.rect({
						x : startX,
						y : startY,
						width : barWidth,
						height : height,
						fill : this.color(j)
					});

                    r.attr(chart.attr(brush.type, brush.target[j]));
					g.append(r);

					startY += height;
				}
			}
		}
	}

	return FullStackBrush;
}, "chart.brush");
