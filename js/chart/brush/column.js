jui.define("chart.brush.column", [], function() {

    /**
     * @class chart.brush.column 
     *
     * implements column brush
     *
     * @extends chart.brush.bar
     */
	var ColumnBrush = function(chart, axis, brush) {
		var g;
		var zeroY, width, col_width, half_width;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroY = axis.y(0);
			width = axis.x.rangeBand();
			half_width = (width - brush.outerPadding * 2);

			col_width = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
            col_width = (col_width < 0) ? 0 : col_width;
		}

		this.draw = function() {
			var points = this.getXY(),
				style = this.getBarStyle();

			this.eachData(function(i, data) {
				var startX = axis.x(i) - (half_width / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						tooltipX = startX + (col_width / 2),
						tooltipY = axis.y(value),
						position = (tooltipY <= zeroY) ? "top" : "bottom";

                    // 최소 크기 설정
                    if(Math.abs(zeroY - tooltipY) < brush.minSize) {
                        tooltipY = (position == "top") ? tooltipY - brush.minSize : tooltipY + brush.minSize;
                    }

					var	height = Math.abs(zeroY - tooltipY),
						radius = (col_width < style.borderRadius || height < style.borderRadius) ? 0 : style.borderRadius,
						r = this.getBarElement(i, j, {
							width: col_width,
							height: height,
							value: value,
							tooltipX: tooltipX,
							tooltipY: tooltipY,
							position: position,
							max: points[j].max[i],
							min: points[j].min[i]
						});

					if (tooltipY <= zeroY) {
						r.round(col_width, height, radius, radius, 0, 0);
						r.translate(startX, tooltipY);
					} else {
						r.round(col_width, height, 0, 0, radius, radius);
						r.translate(startX, zeroY);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 다음 컬럼 좌표 설정
					startX += col_width + brush.innerPadding;
				}
			});

			this.drawETC(g);

            return g;
		}

		this.drawAnimate = function(root) {
			var svg = this.chart.svg,
				type = this.brush.animate;

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
						x = parseInt(xy[0]),
						y = parseInt(xy[1]),
						h = parseInt(elem.attr("height")),
						start = (type == "top") ? y - h : y + h;

					elem.append(svg.animateTransform({
						attributeName: "transform",
						type: "translate",
						from: x + " " + start,
						to: x + " " + y,
						begin: "0s",
						dur: "0.7s",
						repeatCount: "1",
						fill: "freeze"
					}));
				}
			});
		}
	}

	return ColumnBrush;
}, "chart.brush.bar");
