jui.define("chart.brush.column", [], function() {

	var ColumnBrush = function(chart, brush) {
		var g, zeroY, count, width, columnWidth, half_width;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;
		var columns = [];

		function setActiveEvent(elem) {
			if(brush.activeEvent == null) return;

			elem.on(brush.activeEvent, function(e) {
				for(var i = 0; i < columns.length; i++) {
					columns[i].element.attr({ fill: columns[i].color });
				}

				g.each(function(i, child) {
					if(e.toElement == child.element) {
						child.attr({ fill: chart.theme("columnActiveBackgroundColor") });
					}
				});
			});
		}

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;

			zeroY = brush.y(0);
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
					var startY = brush.y(chart.data(i)[brush.target[j]]),
                        r = null;

					if (startY <= zeroY) {
						r = chart.svg.rect({
							x : startX,
							y : startY
						});
					} else {
						r = chart.svg.rect({
							x : startX,
							y : zeroY
						});
					}

					r.attr({
						width : columnWidth,
						height : Math.abs(zeroY - startY),
						fill : chart.color(j, brush),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity,
						"cursor" : (brush.activeEvent != null) ? "pointer" : "normal"
					})

					// 컬럼 상태 설정
					columns.push({
						element: r,
						color: chart.color(j, brush)
					});

					// 컬럼 관련 이벤트 설정
					setActiveEvent(r);
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
                innerPadding: 1,
				activeEvent: null, // or click, mouseover, ...
				activeTooltip: false
            }
        }
	}

	return ColumnBrush;
}, "chart.brush.core");
