jui.define("chart.brush.rangecolumn", [], function() {

	var RangeColumnBrush = function(chart, brush) {
		var g, count, width, columnWidth, half_width;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;
			count = chart.data().length;

			width = brush.x.rangeBand();
			half_width = (width - outerPadding * 2);
			columnWidth = (width - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;

			borderColor = chart.theme("columnBorderColor");
			borderWidth = chart.theme("columnBorderWidth");
			borderOpacity = chart.theme("columnBorderOpacity");
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var startX = brush.x(i) - (half_width / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var data = chart.data(i)[ brush.target[j]],
						startY = brush.y(data[1]),
						zeroY = brush.y(data[0]);

					var r = chart.svg.rect({
						x : startX,
						y : startY,
						width : columnWidth,
						height : Math.abs(zeroY - startY),
						fill : chart.color(j, brush),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, j, i);
                    g.append(r);

					startX += columnWidth + innerPadding;
				}
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

	return RangeColumnBrush;
}, "chart.brush.core");
