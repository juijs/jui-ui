jui.define("chart.brush.waterfall", [], function() {

	var WaterFallBrush = function(chart, brush) {
		var g, zeroY, count, width, columnWidth, half_width;
		var outerPadding;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			half_width = (width - outerPadding * 2);
			columnWidth = (width - outerPadding * 2 - (brush.target.length - 1)) / brush.target.length;
		}

		this.draw = function() {
			var target = brush.target[0],
				stroke = chart.theme("waterfallLineColor");

			for (var i = 0; i < count; i++) {
				var startX = brush.x(i) - half_width / 2,
					startY = brush.y(chart.data(i)[target]),
					r = null, l = null;

				if(i == 0 || (i == count - 1 && brush.end)) {
					var color = chart.theme("waterfallEdgeBackgroundColor");

					if (startY <= zeroY) {
						r = chart.svg.rect({
							x: startX,
							y: startY,
							width: columnWidth,
							height: Math.abs(zeroY - startY),
							fill: color
						});
					} else {
						r = chart.svg.rect({
							x: startX,
							y: zeroY,
							width: columnWidth,
							height: Math.abs(zeroY - startY),
							fill: color
						});
					}
				} else {
					var preValue = chart.data(i - 1)[target],
						nowValue = chart.data(i)[target],
						preStartY = brush.y(preValue),
						nowStartY = brush.y(nowValue),
						h = preStartY - nowStartY;

					if(h > 0) {
						r = chart.svg.rect({
							x: startX,
							y: preStartY - h,
							width: columnWidth,
							height: Math.abs(h),
							fill: chart.theme("waterfallBackgroundColor")
						});
					} else {
						r = chart.svg.rect({
							x: startX,
							y: preStartY,
							width: columnWidth,
							height: Math.abs(h),
							fill: chart.theme("waterfallInvertBackgroundColor")
						});
					}

					if(brush.line) {
						l = chart.svg.line({
							x1: startX - outerPadding * 2,
							y1: nowStartY + h,
							x2: startX,
							y2: nowStartY + h,
							stroke: stroke,
							"stroke-width": 1,
							"stroke-dasharray": chart.theme("waterfallLineDashArray")
						});

						g.append(l);
					}
				}

				this.addEvent(r, 0, i);
				g.append(r);

				startX += columnWidth;
			}

            return g;
		}

        this.drawSetup = function() {
            return {
				line: true,
				end: false,
                outerPadding: 5
            }
        }
	}

	return WaterFallBrush;
}, "chart.brush.core");
