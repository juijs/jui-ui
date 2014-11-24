jui.define("chart.brush.bar", [], function() {

	var BarBrush = function(chart, brush) {
		var g, zeroX, count, height, half_height, barHeight;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;

			zeroX = brush.x(0);
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
					var startX = brush.x(chart.data(i, brush.target[j])),
                        r = null;

					if (startX >= zeroX) {
						r = chart.svg.rect({
							x : zeroX,
							y : startY,
							height : barHeight,
							width : Math.abs(zeroX - startX),
							fill : chart.color(j, brush),
							stroke : borderColor,
							"stroke-width" : borderWidth,
							"stroke-opacity" : borderOpacity
						});
					} else {
						var w = Math.abs(zeroX - startX);

						r = chart.svg.rect({
							y : startY,
							x : zeroX - w,
							height : barHeight,
							width : w,
							fill : chart.color(j, brush),
							stroke : borderColor,
							"stroke-width" : borderWidth,
							"stroke-opacity" : borderOpacity
						});
					}

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

	return BarBrush;
}, "chart.brush.core");
