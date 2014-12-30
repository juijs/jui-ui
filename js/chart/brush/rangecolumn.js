jui.define("chart.brush.rangecolumn", [], function() {

	var RangeColumnBrush = function(chart, axis, brush) {
		var g, width, columnWidth, half_width;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;

			width = brush.x.rangeBand();
			half_width = (width - outerPadding * 2);
			columnWidth = (width - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;

			borderColor = chart.theme("columnBorderColor");
			borderWidth = chart.theme("columnBorderWidth");
			borderOpacity = chart.theme("columnBorderOpacity");
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var startX = brush.x(i) - (half_width / 2);

				for(var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						startY = brush.y(value[1]),
						zeroY = brush.y(value[0]);

					var r = chart.svg.rect({
						x : startX,
						y : startY,
						width : columnWidth,
						height : Math.abs(zeroY - startY),
						fill : this.color(j),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, i, j);
                    g.append(r);

					startX += columnWidth + innerPadding;
				}
			});

            return g;
		}
	}

	RangeColumnBrush.setup = function() {
		return {
			outerPadding: 2,
			innerPadding: 1
		};
	}

	return RangeColumnBrush;
}, "chart.brush.core");
