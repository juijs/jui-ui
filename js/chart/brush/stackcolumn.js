jui.define("chart.brush.stackcolumn", [], function() {

	/**
	 * @class chart.brush.stackcolumn
	 *
	 * stack 형태의 column 브러쉬
	 *
	 * @extends chart.brush.stackbar
	 */
	var ColumnStackBrush = function(chart, axis, brush) {
		var g, zeroY, width, bar_width;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroY = axis.y(0);
			width = axis.x.rangeBand();
			bar_width = width - brush.outerPadding * 2;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var group = chart.svg.group();
				
				var startX = axis.x(i) - bar_width / 2,
                    startY = axis.y(0),
                    value = 0;

				for(var j = 0; j < brush.target.length; j++) {
					var yValue = data[brush.target[j]] + value,
                        endY = axis.y(yValue),
						r = this.getBarElement(i, j);

					r.attr({
						x : startX,
						y : (startY > endY) ? endY : startY,
						width : bar_width,
						height : Math.abs(startY - endY)
					});

					group.append(r);
					
					startY = endY;
					value = yValue;
				}

				this.setActiveEventOption(group); // 액티브 엘리먼트 이벤트 설정
				this.addBarElement(group);
				g.append(group);
			});

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

            return g;
		}
	}

	return ColumnStackBrush;
}, "chart.brush.stackbar");
