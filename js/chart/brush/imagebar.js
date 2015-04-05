jui.define("chart.brush.imagebar", [], function() {

    /**
     * @class chart.brush.imagebar
     *
     * implements column brush
     *
     * @extends chart.brush.column
     */
	var ImageBarBrush = function(chart, axis, brush) {
		var g;
		var zeroX, height, half_height, bar_height;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroX = axis.x(0);
			height = axis.y.rangeBand();
			half_height = height - (brush.outerPadding * 2);

			bar_height = (half_height - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
			bar_height = (bar_height < 0) ? 0 : bar_height;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var startY = axis.y(i) - (half_height / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						tooltipX = axis.x(value),
						position = (tooltipX >= zeroX) ? "right" : "left";

					// 최소 크기 설정
					if(Math.abs(zeroX - tooltipX) < brush.minSize) {
						tooltipX = (position == "right") ? tooltipX + brush.minSize : tooltipX - brush.minSize;
					}

					var width = Math.abs(zeroX - tooltipX),
						r = this.chart.svg.image({
							width : bar_height,
							height : bar_height,
							"xlink:href" : brush.uri
						});

					if(value != 0) {
						this.addEvent(r, i, j);
					}

					if (tooltipX >= zeroX) {
						r.translate(zeroX, startY);
					} else {
						r.translate(zeroX - width, startY);
					}

					if(width > 0) {
						r.scale((width > bar_height) ? width / bar_height : bar_height / width, 1);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 다음 컬럼 좌표 설정
					startY += bar_height + brush.innerPadding;
				}
			});

            return g;
		}
	}

	ImageBarBrush.setup = function() {
		return {
			/** @cfg {Number} [minSize=0] Sets the minimum size as it is not possible to draw a bar when the value is 0. */
			minSize: 0,
			/** @cfg {Number} [outerPadding=2] Determines the outer margin of a bar.  */
			outerPadding: 2,
			/** @cfg {Number} [innerPadding=1] Determines the inner margin of a bar. */
			innerPadding: 1,
			/** @cfg {Number} [uri=null] */
			uri : null
		}
	}

	return ImageBarBrush;
}, "chart.brush.core");
