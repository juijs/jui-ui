jui.define("chart.brush.stackbar", [], function() {

	var StackBarBrush = function(chart, brush) {
		var g, series, count, height, barWidth;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

			series = chart.series();
			count = chart.data().length;

			height = brush.y.rangeBand();
			barWidth = height - brush.outerPadding * 2;

			borderColor = chart.theme("barBorderColor");
			borderWidth = chart.theme("barBorderWidth");
			borderOpacity = chart.theme("barBorderOpacity");
		}

		this.draw = function() {
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
						fill : chart.color(j, brush),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, j, i);
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
