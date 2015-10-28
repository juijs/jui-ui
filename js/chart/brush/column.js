jui.define("chart.brush.column", [], function() {

    /**
     * @class chart.brush.column 
     * @extends chart.brush.bar
     */
	var ColumnBrush = function() {
		var g;
		var zeroY, width, col_width, half_width;

		this.drawBefore = function() {
			var op = this.brush.outerPadding,
				ip = this.brush.innerPadding,
				len = this.brush.target.length;

			g = this.chart.svg.group();
			zeroY = this.axis.y(0);
			width = this.axis.x.rangeBand();

			if(this.brush.size > 0) {
				col_width = this.brush.size;
				half_width = (col_width * len) + ((len - 1) * ip);
			} else {
				half_width = (width - op * 2);
				col_width = (width - op * 2 - (len - 1) * ip) / len;
				col_width = (col_width < 0) ? 0 : col_width;
			}
		}

		this.draw = function() {
			var points = this.getXY(),
				style = this.getBarStyle();

			this.eachData(function(i, data) {
				var startX = this.offset("x", i) - (half_width / 2);

				for (var j = 0; j < this.brush.target.length; j++) {
					var value = data[this.brush.target[j]],
						tooltipX = startX + (col_width / 2),
						tooltipY = this.axis.y(value),
						position = (tooltipY <= zeroY) ? "top" : "bottom";

                    // 최소 크기 설정
                    if(Math.abs(zeroY - tooltipY) < this.brush.minSize) {
                        tooltipY = (position == "top") ? tooltipY - this.brush.minSize : tooltipY + this.brush.minSize;
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
					startX += col_width + this.brush.innerPadding;
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
