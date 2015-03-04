jui.define("chart.brush.waterfall", [], function() {

	/**
	 * @class chart.brush.waterfall
	 *
	 * waterfall 형태의 브러쉬
	 *
	 * @extends chart.brush.core
	 */
	var WaterFallBrush = function(chart, axis, brush) {
		var g, count, zeroY, width, columnWidth, half_width;
		var outerPadding;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
			count = this.listData().length;
			zeroY = axis.y(0);

			width = axis.x.rangeBand();
			half_width = (width - outerPadding * 2);
			columnWidth = (width - outerPadding * 2 - (brush.target.length - 1)) / brush.target.length;
		}

		this.draw = function() {
			var target = brush.target[0],
				stroke = chart.theme("waterfallLineColor");

			this.eachData(function(i, data) {
				var startX = axis.x(i) - half_width / 2,
					startY = axis.y(data[target]),
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
					var preValue = this.getData(i - 1)[target],
						nowValue = data[target],
						preStartY = axis.y(preValue),
						nowStartY = axis.y(nowValue),
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

				this.addEvent(r, i, 0);
				g.append(r);

				startX += columnWidth;
			});

            return g;
		}
	}

	WaterFallBrush.setup = function() {
		return {
			/** @cfg {Boolean} [line=true] Connects with a line between columns of a waterfall.*/
			line: true,
			/** @cfg {Boolean} [end=false] Sets effects for the last column of a waterfall.*/
			end: false,
			/** @cfg {Boolean} [outerPadding=5] Determines the outer margin of a waterfall.*/
			outerPadding: 5
		};
	}

	return WaterFallBrush;
}, "chart.brush.core");
