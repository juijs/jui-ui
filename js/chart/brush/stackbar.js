jui.define("chart.brush.stackbar", [], function() {

	var StackBarBrush = function(brush) {
		var g, series, count, height, barWidth;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.x(), chart.y());

			series = chart.series();
			count = chart.data().length;

			height = brush.y.rangeBand();
			barWidth = height - brush.outerPadding * 2;
		}

		this.draw = function(chart) {
			for (var i = 0; i < count; i++) {
				var group = chart.svg.group();
				
				var startY = brush.y(i) - barWidth/ 2,
                    startX = brush.x(0),
                    value = 0;
				
				for (var j = 0; j < brush.target.length; j++) {
					var xValue = chart.data(i, brush.target[j]) + value,
                        endX = brush.x(xValue);

					var r = chart.svg.rect({
						x : (startX < endX) ? startX : endX,
						y : startY,
						width : Math.abs(startX - endX),
						height : barWidth,
						fill : chart.color(j, brush.colors)
					});

                    this.addEvent(r, i, j);
					group.append(r);					
					
					startX = endX;
					value = xValue;
				}
				
				g.append(group);
			}

            return g;
		}

        this.drawSetup = function() {
            return {
                outerPadding: 15
            }
        }
	}

	return StackBarBrush;
}, "chart.brush.core");
