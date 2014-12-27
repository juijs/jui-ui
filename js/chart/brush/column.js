jui.define("chart.brush.column", [], function() {

	var ColumnBrush = function(chart, brush) {
		var g, activeTooltip, style;
		var zeroY, width, col_width, half_width;

		this.drawBefore = function() {
			style = this.getBarStyle();
			zeroY = brush.y(0);

			width = brush.x.rangeBand();
			half_width = (width - brush.outerPadding * 2);
			col_width = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;

			// 엘리먼트 생성
			g = chart.svg.group();
			activeTooltip = this.createTooltip(style.activeColor, style.circleColor);
		}

		this.draw = function() {
			var points = this.getXY();

			this.eachData(function(i, data) {
				var startX = brush.x(i) - (half_width / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						startY = brush.y((value == 0) ? brush.minValue : value),
						position = (startY <= zeroY) ? "top" : "bottom",
						r = this.getBarElement(col_width, Math.abs(zeroY - startY), i, j);

					var tooltipX = startX + (col_width / 2),
						tooltipY = startY;

					if (startY <= zeroY) {
						r = r.attr({
							x: startX,
							y: startY
						});
					} else {
						r = r.attr({
							x: startX,
							y: zeroY
						});
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 액티브 엘리먼트 설정
					if (brush.active == i) {
						this.setActiveEffect(r, activeTooltip, tooltipX, tooltipY, value, position);
					}

					// 컬럼 및 기본 브러쉬 이벤트 설정
					this.setActiveEventOption(r, activeTooltip, tooltipX, tooltipY, value, position);

					// Max & Min 툴팁 추가
					this.setActiveEffectOption(g, this.getColor(j), points[j].max[i], points[j].min[i], tooltipX, tooltipY, value, position);

					// 다음 컬럼 좌표 설정
					startX += col_width + brush.innerPadding;
				}
			});

			g.append(activeTooltip);

            return g;
		}
	}

	return ColumnBrush;
}, "chart.brush.bar");
