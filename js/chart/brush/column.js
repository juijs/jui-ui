jui.define("chart.brush.column", [], function() {

	var ColumnBrush = function(chart, axis, brush) {
		var g, activeTooltip, style;
		var zeroY, width, col_width, half_width;

		this.drawBefore = function() {
			style = this.getBarStyle();
			zeroY = axis.y(0);

			width = axis.x.rangeBand();
			half_width = (width - brush.outerPadding * 2);
			col_width = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;

			// 엘리먼트 생성
			g = chart.svg.group();
			activeTooltip = this.createTooltip(style.activeColor, style.circleColor);
		}

		this.draw = function() {
			var points = this.getXY(),
				style = this.getBarStyle();

			this.eachData(function(i, data) {
				var startX = axis.x(i) - (half_width / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						startY = axis.y((value == 0) ? brush.minValue : value),
						height = Math.abs(zeroY - startY),
						position = (startY <= zeroY) ? "top" : "bottom",
						radius = (col_width < style.borderRadius || height < style.borderRadius) ? 0 : style.borderRadius,
						r = this.getBarElement(col_width, height, i, j);

					var tooltipX = startX + (col_width / 2),
						tooltipY = startY;

					if (startY <= zeroY) {
						r.attr({
							"radius-top": radius,
							"x": startX,
							"y": startY
						});
					} else {
						r.attr({
							"radius-bottom": radius,
							"x": startX,
							"y": zeroY
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
					this.setActiveEffectOption(g, this.color(j), points[j].max[i], points[j].min[i], tooltipX, tooltipY, value, position);

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
