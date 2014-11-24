jui.define("chart.brush.stackcolumn", [], function() {

	var ColumnStackBrush = function(chart, brush) {
		var g, zeroY, count, width, barWidth;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			barWidth = width - brush.outerPadding * 2;

			borderColor = chart.theme("columnBorderColor");
			borderWidth = chart.theme("columnBorderWidth");
			borderOpacity = chart.theme("columnBorderOpacity");
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var group = chart.svg.group();
				
				var startX = brush.x(i) - barWidth / 2,
                    startY = brush.y(0),
                    value = 0;


				for(var j = 0; j < brush.target.length; j++) {
					var yValue = chart.data(i, brush.target[j]) + value,
                        endY = brush.y(yValue);
					
					var r = chart.svg.rect({
						x : startX,
						y : (startY > endY) ? endY : startY,
						width : barWidth,
						height : Math.abs(startY - endY),
						fill : chart.color(j, brush),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});
					
                    this.addEvent(r, j, i);
					group.append(r);					
					
					startY = endY;
					value = yValue;
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

	return ColumnStackBrush;
}, "chart.brush.core");
