jui.define("chart.brush.bar", [], function() {

	var BarBrush = function(chart, brush) {
		var g, zeroX, count, height, half_height, barHeight;
		var outerPadding, innerPadding;

		this.drawBefore = function() {
			g = chart.svg.group().translate(chart.x(), chart.y());

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;

			zeroX = brush.x(0);
			count = chart.data().length;

			height = brush.y.rangeBand();
			half_height = height - outerPadding*2;
			barHeight = (half_height - (brush.target.length - 1) * innerPadding) / brush.target.length;
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var startY = brush.y(i) - half_height/2;
				
				var group = chart.svg.group();

				for (var j = 0; j < brush.target.length; j++) {
					var startX = brush.x(chart.data(i, brush.target[j])),
                        r = null;

					if (startX >= zeroX) {
						r = chart.svg.rect({
							x : zeroX,
							y : startY,
							height : barHeight,
							width : Math.abs(zeroX - startX),
							fill : chart.color(j, brush.colors)
						});
					} else {
						var w = Math.abs(zeroX - startX);

						r = chart.svg.rect({
							y : startY,
							x : zeroX - w,
							height : barHeight,
							width : w,
							fill : chart.color(j, brush.colors)
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
