jui.define("chart.brush.column", [], function() {

	var ColumnBrush = function(chart, brush) {
		var g, activeTooltip;
		var zeroY, count, width, columnWidth, half_width;
		var outerPadding, innerPadding, display;
		var borderColor, borderWidth, borderOpacity, tooltipColor, circleColor;
		var columns = [];

		function setActiveEffect(self, elem, x, y, value, isTop) {
			for(var i = 0; i < columns.length; i++) {
				columns[i].element.attr({ fill: columns[i].color });
			}

			elem.attr({ fill: tooltipColor });
			self.showTooltip(activeTooltip, x, y, value, isTop);
		}

		function setActiveEvent(self, elem, x, y, value, isTop) {
			elem.on(brush.activeEvent, function(e) {
				for(var i = 0; i < columns.length; i++) {
					columns[i].element.attr({ fill: columns[i].color });
				}

				g.each(function(i, child) {
					if(e.target == child.element) {
						child.attr({ fill: tooltipColor });
						self.showTooltip(activeTooltip, x, y, value, isTop);
					}
				});
			});
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
			activeTooltip = this.createTooltip(tooltipColor, circleColor);
		}

		this.draw = function() {
			var points = this.getXY();

			for (var i = 0; i < count; i++) {
				var startX = brush.x(i) - (half_width / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = chart.data(i)[brush.target[j]],
						startY = brush.y((value == 0) ? brush.minValue : value),
						isTop = true,
						r = null;

					var tooltipX = startX + (columnWidth / 2),
						tooltipY = startY;

					if (startY <= zeroY) {
						r = chart.svg.rect({
							x: startX,
							y: startY
						});
					} else {
						r = chart.svg.rect({
							x: startX,
							y: zeroY
						});

						isTop = false;
					}

					r.attr({
						width: columnWidth,
						height: Math.abs(zeroY - startY),
						fill: chart.color(j, brush),
						stroke: borderColor,
						"stroke-width": borderWidth,
						"stroke-opacity": borderOpacity
					});

					// 컬럼 상태 설정
					columns.push({
						index: i,
						target: brush.target[j],
						element: r,
						color: chart.color(j, brush)
					});

					// 액티브 엘리먼트 설정
					if (brush.active == i) {
						setActiveEffect(this, r, tooltipX, tooltipY, value, isTop);
					}

					// 컬럼 및 기본 브러쉬 이벤트 설정
					if(value != 0) {
						if (brush.activeEvent != null) {
							setActiveEvent(this, r, tooltipX, tooltipY, value, isTop);
							r.attr({ cursor: "pointer" });
						}

						this.addEvent(r, j, i);
					}

					// 그룹에 컬럼 엘리먼트 추가
                    g.append(r);

					// Max & Min 툴팁 추가
					if(display == "max" && points[j].max[i] || display == "min" && points[j].min[i]) {
						var tooltip = this.createTooltip(chart.color(j, brush), circleColor);

						this.showTooltip(tooltip, tooltipX, tooltipY, value, isTop);
						g.append(tooltip);
					}

					// 다음 컬럼 좌표 설정
					startX += columnWidth + innerPadding;
				}
			}

			g.append(activeTooltip);

            return g;
		}

        this.drawSetup = function() {
			return this.getOptions({
				minValue: 0,
                outerPadding: 2,
                innerPadding: 1,
				active: null,
				activeEvent: null, // or click, mouseover, ...
				display: null // or max, min
            });
        }
	}

	return ColumnBrush;
}, "chart.brush.core");
