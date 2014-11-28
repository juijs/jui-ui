jui.define("chart.brush.column", [], function() {

	var ColumnBrush = function(chart, brush) {
		var g, activeTooltip;
		var zeroY, count, width, columnWidth, half_width;
		var outerPadding, innerPadding, display;
		var borderColor, borderWidth, borderOpacity, tooltipColor, circleColor;
		var columns = [];

		function setActiveEvent(elem, x, y, value, isTop) {
			if(brush.active == null) return;

			elem.on(brush.active, function(e) {
				for(var i = 0; i < columns.length; i++) {
					columns[i].element.attr({ fill: columns[i].color });
				}

				g.each(function(i, child) {
					if(e.target == child.element) {
						child.attr({ fill: tooltipColor });
						showTooltip(activeTooltip, x, y, value, isTop);
					}
				});
			});
		}

		function createTooltip(fill) {
			return chart.svg.group({ "visibility" : "hidden" }, function() {
				chart.text({
					"text-anchor" : "middle",
					"font-weight" : 600
				});

				chart.svg.circle({
					r: 5,
					fill: fill,
					stroke: circleColor,
					"stroke-width": 1
				});
			});
		}

		function showTooltip(tooltip, x, y, value, isTop) {
			var text = tooltip.get(0);
			tooltip.attr({ visibility: "visible" }).translate(x, y);

			text.element.textContent = chart.format(value);
			text.attr({ y: (isTop) ? -7 : 16 });
		}

		this.drawBefore = function() {
			// 기본 값 세팅
			display = brush.display;
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
			tooltipColor = chart.theme("columnActiveBackgroundColor");
			circleColor = chart.theme("columnCircleBorderColor");

			// 엘리먼트 생성
			g = chart.svg.group();
		}

		this.draw = function() {
			var points = this.getXY();

			for (var i = 0; i < count; i++) {
				var startX = brush.x(i) - (half_width / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = chart.data(i)[brush.target[j]],
						startY = brush.y(value),
						isTop = true,
                        r = null;

					var tooltipX = startX + (columnWidth / 2),
						tooltipY = startY;

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

						isTop = false;
					}

					r.attr({
						width : columnWidth,
						height : Math.abs(zeroY - startY),
						fill : chart.color(j, brush),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity,
						"cursor" : (brush.active != null) ? "pointer" : "normal"
					});

					// 컬럼 상태 설정
					columns.push({
						element: r,
						color: chart.color(j, brush)
					});

					// 컬럼 관련 이벤트 설정
					setActiveEvent(r, tooltipX, tooltipY, value, isTop);

					// 브러쉬 이벤트 및 그룹 추가
                    this.addEvent(r, j, i);
                    g.append(r);

					startX += columnWidth + innerPadding;

					// Max & Min 툴팁 추가
					if(display == "max" && points[j].max[i] || display == "min" && points[j].min[i]) {
						var tooltip = createTooltip(chart.color(j, brush));

						showTooltip(tooltip, tooltipX, tooltipY, value, isTop);
						g.append(tooltip);
					}
				}
			}

			activeTooltip = createTooltip(tooltipColor);
			g.append(activeTooltip);

            return g;
		}

        this.drawSetup = function() {
            return {
                outerPadding: 2,
                innerPadding: 1,
				active: null, // or click, mouseover, ...
				display: null // or max, min
            }
        }
	}

	return ColumnBrush;
}, "chart.brush.core");
