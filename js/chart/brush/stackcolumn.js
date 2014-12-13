jui.define("chart.brush.stackcolumn", [], function() {

	var ColumnStackBrush = function(chart, brush) {
		var g, zeroY, count, width, bar_width;

		this.drawBefore = function() {
			g = chart.svg.group();

			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			bar_width = width - brush.outerPadding * 2;
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var group = chart.svg.group();
				
				var startX = brush.x(i) - bar_width / 2,
                    startY = brush.y(0),
                    value = 0;

				for(var j = 0; j < brush.target.length; j++) {
					var yValue = chart.data(i, brush.target[j]) + value,
                        endY = brush.y(yValue),
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

				// 액티브 엘리먼트 이벤트 설정
				if(brush.activeEvent != null) {
					this.setActiveEvent(group);
					group.attr({ cursor: "pointer" });
				}

				this.addBarElement(group);
				g.append(group);
			}

			// 액티브 엘리먼트 설정
			if(this.barList[brush.active]) {
				this.setActiveEffect(this.barList[brush.active]);
			}

            return g;
		}
	}

	return ColumnStackBrush;
}, "chart.brush.stackbar");
