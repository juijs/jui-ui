jui.define("chart.brush.bar", [], function() {

	var BarBrush = function(chart, brush) {
		var g, activeTooltip;
		var zeroX, count, height, half_height, bar_height;

		this.getBarStyle = function() {
			return {
				borderColor: this.chart.theme("barBorderColor"),
				borderWidth: this.chart.theme("barBorderWidth"),
				borderOpacity: this.chart.theme("barBorderOpacity"),
				disableOpacity: this.chart.theme("barDisableBackgroundOpacity"),
				activeColor: this.chart.theme("barActiveBackgroundColor"),
				circleColor: this.chart.theme("barCircleBorderColor")
			}
		}

		this.addBarElement = function(elem) {
			if(!this.barList) {
				this.barList = [];
			}

			this.barList.push(elem);
		}

		this.getBarElement = function(width, height, dataIndex, targetIndex) {
			var style = this.getBarStyle(),
				color = this.chart.color(targetIndex, this.brush),
				value = this.chart.data(dataIndex)[this.brush.target[targetIndex]];

			var r = this.chart.svg.rect({
				width : width,
				height : height,
				fill : color,
				stroke : style.borderColor,
				"stroke-width" : style.borderWidth,
				"stroke-opacity" : style.borderOpacity
			});

			if(value != 0) {
				this.addEvent(r, targetIndex, dataIndex);
			}

			this.addBarElement({
				index: dataIndex,
				target: this.brush.target[targetIndex],
				element: r,
				color: color
			});

			return r;
		}

		this.setActiveEffect = function(bar, tooltip, x, y, value, position) {
			var style = this.getBarStyle(),
				columns = this.barList;

			for(var i = 0; i < columns.length; i++) {
				columns[i].element.attr({ fill: columns[i].color });
			}

			bar.attr({ fill: style.activeColor });
			this.showTooltip(tooltip, x, y, value, position);
		}

		this.setActiveEvent = function(bar, tooltip, x, y, value, position) {
			var self = this,
				style = this.getBarStyle(),
				columns = this.barList;

			bar.on(this.brush.activeEvent, function(e) {
				for(var i = 0; i < columns.length; i++) {
					var child = columns[i].element;

					if(e.target == child.element) {
						child.attr({ fill: style.activeColor });
						self.showTooltip(tooltip, x, y, value, position);
					} else {
						child.attr({ fill: columns[i].color });
					}
				}
			});
		}

		this.drawBefore = function() {
			var style = this.getBarStyle();

			zeroX = brush.x(0);
			count = chart.data().length;

			height = brush.y.rangeBand();
			half_height = height - (brush.outerPadding * 2);
			bar_height = (half_height - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;

			g = chart.svg.group();
			activeTooltip = this.createTooltip(style.activeColor, style.circleColor);
		}

		this.draw = function() {
			var style = this.getBarStyle(),
				points = this.getXY();

			for (var i = 0; i < count; i++) {
				var startY = brush.y(i) - (half_height / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = chart.data(i, brush.target[j]),
						startX = brush.x((value == 0) ? brush.minValue : value),
						width = Math.abs(zeroX - startX),
						position = (startX >= zeroX) ? "right" : "left",
                        r = this.getBarElement(width, bar_height, i, j);

					var tooltipX = startX,
						tooltipY = startY + (half_height / 2);

					if (startX >= zeroX) {
						r = r.attr({
							x : zeroX,
							y : startY
						});
					} else {
						r = r.attr({
							x : zeroX - width,
							y : startY
						});
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 액티브 엘리먼트 설정
					if (brush.active == i) {
						this.setActiveEffect(r, activeTooltip, tooltipX, tooltipY, value, position);
					}

					// 컬럼 및 기본 브러쉬 이벤트 설정
					if(value != 0 && brush.activeEvent != null) {
						this.setActiveEvent(r, activeTooltip, tooltipX, tooltipY, value, position);
						r.attr({ cursor: "pointer" });
					}

					// Max & Min 툴팁 추가
					if(brush.display == "max" && points[j].max[i] ||
						brush.display == "min" && points[j].min[i]) {
						var tooltip = this.createTooltip(chart.color(j, brush), style.circleColor);

						this.showTooltip(tooltip, tooltipX, tooltipY, value, position);
						g.append(tooltip);
					}

					// 다음 컬럼 좌표 설정
					startY += bar_height + brush.innerPadding;
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

	return BarBrush;
}, "chart.brush.core");
