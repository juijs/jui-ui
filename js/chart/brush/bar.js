jui.define("chart.brush.bar", [ "util.base" ], function(_) {

	var BarBrush = function(chart, axis, brush) {
		var g, activeTooltip, minmaxTooltip;
		var zeroX, height, half_height, bar_height;

		this.getBarStyle = function() {
			return {
				borderColor: this.chart.theme("barBorderColor"),
				borderWidth: this.chart.theme("barBorderWidth"),
				borderOpacity: this.chart.theme("barBorderOpacity"),
				borderRadius: this.chart.theme("barBorderRadius"),
				disableOpacity: this.chart.theme("barDisableBackgroundOpacity"),
				circleColor: this.chart.theme("barCircleBorderColor")
			}
		}

		this.addBarElement = function(elem) {
			if(!this.barList) {
				this.barList = [];
			}

			this.barList.push(elem);
		}

		this.getBarElement = function(dataIndex, targetIndex, info) {
			var style = this.getBarStyle(),
				color = this.color(targetIndex),
				value = this.getData(dataIndex)[this.brush.target[targetIndex]];

			var r = this.chart.svg.pathRect({
				width: info.width,
				height: info.height,
				fill : color,
				stroke : style.borderColor,
				"stroke-width" : style.borderWidth,
				"stroke-opacity" : style.borderOpacity
			});

			if(value != 0) {
				this.addEvent(r, dataIndex, targetIndex);
			}

			this.addBarElement(_.extend({
				index: dataIndex,
				target: this.brush.target[targetIndex],
				element: r,
				color: color,
				opacity: 1
			}, info));

			return r;
		}

		this.setActiveEffect = function(bar, activeTooltip, minmaxTooltip) {
			var style = this.getBarStyle(),
				columns = this.barList;

			for(var i = 0; i < columns.length; i++) {
				columns[i].opacity = (columns[i] == bar) ? 1 : style.disableOpacity;
				columns[i].element.attr({ fill: columns[i].color, opacity: columns[i].opacity });
			}

			activeTooltip.childrens[1].attr({ fill: bar.color, opacity: bar.opacity });
			minmaxTooltip.childrens[1].attr({ fill: bar.color, opacity: style.disableOpacity });

			this.showTooltip(activeTooltip, bar.tooltipX, bar.tooltipY, bar.value, bar.position);
		}

		this.setActiveEvent = function(bar, activeTooltip, minmaxTooltip) {
			var self = this;

			bar.element.on(this.brush.activeEvent, function(e) {
				self.setActiveEffect(bar, activeTooltip, minmaxTooltip);
			});
		}

		this.drawETC = function(activeTooltip, minmaxTooltip) {
			for(var i = 0; i < this.barList.length; i++) {
				var r = this.barList[i];

				// Max & Min 툴팁 생
				if (this.brush.display == "max" && r.max || this.brush.display == "min" && r.min) {
					minmaxTooltip.childrens[1].attr({ fill: r.color });
					this.showTooltip(minmaxTooltip, r.tooltipX, r.tooltipY, r.value, r.position);
				}

				// 액티브 엘리먼트 설정
				if (this.brush.active == i) {
					this.setActiveEffect(r, activeTooltip, minmaxTooltip);
				}

				// 컬럼 및 기본 브러쉬 이벤트 설정
				if (r.value != 0 && this.brush.activeEvent != null) {
					this.setActiveEvent(r, activeTooltip, minmaxTooltip);
					r.element.attr({ cursor: "pointer" });
				}
			}
		}

		this.drawBefore = function() {
			var style = this.getBarStyle();

			zeroX = axis.x(0);
			height = axis.y.rangeBand();
			half_height = height - (brush.outerPadding * 2);
			bar_height = (half_height - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;

			g = chart.svg.group();
			activeTooltip = this.createTooltip(null, style.circleColor);
			minmaxTooltip = this.createTooltip(null, style.circleColor);
		}

		this.draw = function() {
			var points = this.getXY(),
				style = this.getBarStyle();

			this.eachData(function(i, data) {
				var startY = axis.y(i) - (half_height / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						tooltipX = axis.x((value == 0) ? brush.minValue : value),
						tooltipY = startY + (half_height / 2),
						position = (tooltipX >= zeroX) ? "right" : "left";

					var width = Math.abs(zeroX - tooltipX),
						radius = (width < style.borderRadius || bar_height < style.borderRadius) ? 0 : style.borderRadius,
                        r = this.getBarElement(i, j, {
							width: width,
							height: bar_height,
							value: value,
							tooltipX: tooltipX,
							tooltipY: tooltipY,
							position: position,
							max: points[j].max[i],
							min: points[j].min[i]
						});

					if (tooltipX >= zeroX) {
						r.round(width, bar_height, 0, radius, radius, 0);
						r.translate(zeroX, startY);
					} else {
						r.round(width, bar_height, radius, 0, 0, radius);
						r.translate(zeroX - width, startY);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 다음 컬럼 좌표 설정
					startY += bar_height + brush.innerPadding;
				}
			});

			g.append(activeTooltip);
			g.append(minmaxTooltip);

			this.drawETC(activeTooltip, minmaxTooltip);

            return g;
		}
	}

	BarBrush.setup = function() {
		return {
			minValue: 0,
			outerPadding: 2,
			innerPadding: 1,
			active: null,
			activeEvent: null, // or click, mouseover, ...
			display: null // or max, min
		};
	}

	return BarBrush;
}, "chart.brush.core");
