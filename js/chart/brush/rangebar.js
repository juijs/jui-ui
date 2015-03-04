jui.define("chart.brush.rangebar", [], function() {

    /**
     * @class chart.brush.rangebar 
     * 
     * implements range bar brush 
     * 
     * @extends chart.brush.core 
     */
	var RangeBarBrush = function(chart, axis, brush) {
		var g, height, half_height, barHeight;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;

			height = axis.y.rangeBand();
			half_height = height - (outerPadding * 2);
			barHeight = (half_height - (brush.target.length - 1) * innerPadding) / brush.target.length;

			borderColor = chart.theme("barBorderColor");
			borderWidth = chart.theme("barBorderWidth");
			borderOpacity = chart.theme("barBorderOpacity");
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var group = chart.svg.group(),
					startY = axis.y(i) - (half_height / 2);

				for(var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						startX = axis.x(value[1]),
						zeroX = axis.x(value[0]);

					var r = chart.svg.rect({
						x : zeroX,
						y : startY,
						height : barHeight,
						width : Math.abs(zeroX - startX),
						fill : this.color(j),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, i, j);
                    group.append(r);

					startY += barHeight + innerPadding;
				}
				
				g.append(group);
			});

            return g;
		}
	}

	RangeBarBrush.setup = function() {
		return {
            /** @cfg {Number} [outerPadding=2] Determines the outer margin of a bar. */
			outerPadding: 2,
            /** @cfg {Number} [innerPadding=1] Determines the inner margin of a bar. */
			innerPadding: 1
		};
	}

	return RangeBarBrush;
}, "chart.brush.core");
