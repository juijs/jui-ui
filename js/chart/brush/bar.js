jui.define("chart.brush.bar", [ "util.base" ], function(_) {

	var BarBrush = function(chart, axis, brush) {
		var g, active, minmax, minmaxIndex;
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
				element: r,
				color: color
			}, info));

			return r;
		}

		this.setActiveEffect = function(r) {
			var style = this.getBarStyle(),
				cols = this.barList;

			for(var i = 0; i < cols.length; i++) {
				var opacity = (cols[i] == r) ? 1 : style.disableOpacity;

				cols[i].element.attr({ opacity: opacity });

				if(i == minmaxIndex) {
					minmax.style(r.color, style.circleColor, opacity);
				}
			}
		}

		this.drawETC = function(group) {
			var self = this,
				style = this.getBarStyle();

			// 액티브 툴팁 생성
			active = this.drawItem(group);

			for (var i = 0; i < this.barList.length; i++) {
				var r = this.barList[i];

				// Max & Min 툴팁 생
				if (this.brush.display == "max" && r.max || this.brush.display == "min" && r.min) {
					minmaxIndex = i;

					minmax = this.drawItem(group, null, {
						fill: r.color,
						stroke: style.circleColor,
						opacity: 1
					});

					minmax.control(r.position, r.tooltipX, r.tooltipY, r.value);
				}

				// 컬럼 및 기본 브러쉬 이벤트 설정
				if (r.value != 0 && this.brush.activeEvent != null) {
					(function(bar) {
						active.style(bar.color, style.circleColor, 1);

						bar.element.on(self.brush.activeEvent, function(e) {
							active.control(bar.position, bar.tooltipX, bar.tooltipY, bar.value);
							self.setActiveEffect(bar);
						});

						bar.element.attr({ cursor: "pointer" });
					})(r);
				}
			}

			// 액티브 툴팁 위치 설정
			var r = this.barList[this.brush.active];
			if(r != null) {
				active.style(r.color, style.circleColor, 1);
				active.control(r.position, r.tooltipX, r.tooltipY, r.value);
				this.setActiveEffect(r);
			}
		}

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroX = axis.x(0);
			height = axis.y.rangeBand();
			half_height = height - (brush.outerPadding * 2);
			bar_height = (half_height - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
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

			this.drawETC(g);

            return g;
		}

		this.drawAnimate = function(root) {
			var svg = this.chart.svg;

			root.append(
				svg.animate({
					attributeName: "opacity",
					from: "0",
					to: "1",
					begin: "0s" ,
					dur: "1.4s",
					repeatCount: "1",
					fill: "freeze"
				})
			);

			root.each(function(i, elem) {
				if(elem.is("util.svg.element.path")) {
					var xy = elem.data("translate").split(","),
						w = elem.attr("width");

					elem.append(svg.animateTransform({
						attributeName: "transform",
						type: "translate",
						from: (parseInt(xy[0]) - parseInt(w) + " " + xy[1]),
						to: xy[0] + " " + xy[1],
						begin: "0s",
						dur: "0.7s",
						repeatCount: "1",
						fill: "freeze"
					}));
				}
			});
		}
	}

	BarBrush.setup = function() {
		return {
			minValue: 0,
			outerPadding: 2,
			innerPadding: 1,
			active: null,
			activeEvent: null, // or click, mouseover, ...
			display: null, // or max, min
			items: [ "tooltip" ]
		};
	}

	return BarBrush;
}, "chart.brush.core");
