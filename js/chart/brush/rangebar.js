jui.define("chart.brush.rangebar", [], function() {

	var RangeBarBrush = function(chart, brush) {
		var g, count, height, half_height, barHeight;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;
			count = chart.data().length;

			height = brush.y.rangeBand();
			half_height = height - (outerPadding * 2);
			barHeight = (half_height - (brush.target.length - 1) * innerPadding) / brush.target.length;

			borderColor = chart.theme("barBorderColor");
			borderWidth = chart.theme("barBorderWidth");
			borderOpacity = chart.theme("barBorderOpacity");
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var group = chart.svg.group(),
					startY = brush.y(i) - (half_height / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var data = chart.data(i, brush.target[j]),
						startX = brush.x(data[1]),
						zeroX = brush.x(data[0]);

					var r = chart.svg.rect({
						x : zeroX,
						y : startY,
						height : barHeight,
						width : Math.abs(zeroX - startX),
						fill : chart.color(j, brush),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, j, i);
                    group.append(r);

					startY += barHeight + innerPadding;
				}
				
				g.append(group);
			}

            return g;
		}

        this.drawSetup = function() {
            return {
                outerPadding: 2,
                innerPadding: 1
            }
        }
	}

	return RangeBarBrush;
}, "chart.brush.core");
