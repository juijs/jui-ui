jui.define("chart.brush.bar", [], function() {

	/**
	 * Bar Brush 객체 
	 * 
	 * <code>
	 * {
	 * 	type : 'bar',
	 *  target : ['field1', 'field2'],  // 생략하면 모든 series 를 target 으로 설정
	 *  outerPadding : 2,	// bar 바깥쪽 padding 
	 *  innerPadding : 1	// bar 안쪽 padding 
	 *  
	 * } 
	 * </code>
	 * 
 	 * @param {Object} brush
	 */
	var BarBrush = function(brush) {
		var g, zeroX, count, height, half_height, barHeight;
		var outerPadding, innerPadding;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.x(), chart.y());

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;

			zeroX = brush.x(0);
			count = chart.data().length;

			height = brush.y.rangeBand();
			half_height = height - outerPadding*2;
			barHeight = (half_height - (brush.target.length - 1) * innerPadding) / brush.target.length;
		}

		this.draw = function(chart) {
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

                    this.addEvent(brush, chart, r, j, i);
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
