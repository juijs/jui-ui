jui.define("chart.brush.equalizer", [], function() {

	var BarBrush = function(brush) {
		var g, zeroY, count, width, barWidth, unit, gap;
		var outerPadding = brush.outerPadding || 15, innerPadding = brush.innerPadding || 10;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

			zeroY = brush.y(0);
			count = chart.data().length;
 
			width = chart.x.rangeBand();
			barWidth = (width - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;

			unit = brush.unit || 5;
			gap = brush.gap || 1;
		}

		this.draw = function(chart) {
			for (var i = 0; i < count; i++) {
				var startX = brush.x(i) + outerPadding;

				for (var j = 0; j < brush.target.length; j++) {
					var startY = brush.y(chart.series(brush.target[j]).data[i]);

					if (startY <= zeroY) {

						var height = Math.abs(zeroY - startY)
						var padding = 1.5;

						var eY = zeroY;
						var eMin = startY;
						var eIndex = 0;
						while (eY > eMin) {

							var unitHeight = (eY - unit < eMin ) ? Math.abs(eY - eMin) : unit;

							var r = chart.svg.rect({
								x : startX,
								y : eY - unitHeight,
								width : barWidth,
								height : unitHeight,
								fill : this.color(Math.floor(eIndex / gap))
							});

							eY -= unitHeight + padding;
							eIndex++;

                            r.attr(chart.attr(brush.type, brush.target[j]));
							g.append(r);
						}
					} else {

						var padding = 1.5;

						var eY = zeroY;
						var eMax = startY;
						var eIndex = 0;
						while (eY < eMax) {
							var unitHeight = (eY + unit > eMax ) ? Math.abs(eY - eMax) : unit;
							var r = chart.svg.rect({
								x : startX,
								y : eY,
								width : barWidth,
								height : unitHeight,
								fill : this.color(Math.floor(eIndex / gap))
							});

							eY += unitHeight + padding;
							eIndex++;

                            r.attr(chart.attr(brush.type, brush.target[j]));
							g.append(r);
						}

					}

					startX += barWidth + innerPadding;
				}
			}
		}
	}

	return BarBrush;
}, "chart.brush");
