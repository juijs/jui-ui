jui.define("chart.brush.imagecolumn", [], function() {

    /**
     * @class chart.brush.imagecolumn
     *
     * implements column brush
     *
     * @extends chart.brush.column
     */
	var ImageColumnBrush = function(chart, axis, brush) {
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
			this.eachData(function(i, data) {
				var startX = axis.x(i) - (half_width / 2);

				for(var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						tooltipY = axis.y(value),
						position = (tooltipY <= zeroY) ? "top" : "bottom";

                    // 최소 크기 설정
                    if(Math.abs(zeroY - tooltipY) < brush.minSize) {
                        tooltipY = (position == "top") ? tooltipY - brush.minSize : tooltipY + brush.minSize;
                    }

					var	height = Math.abs(zeroY - tooltipY),
						r = this.chart.svg.image({
							width : col_width,
							height : col_width,
							"xlink:href" : brush.uri
						});

					if(value != 0) {
						this.addEvent(r, i, j);
					}

					if (tooltipY <= zeroY) {
						r.translate(startX, tooltipY);
					} else {
						r.translate(startX, zeroY);
					}

					if(height > 0) {
						r.scale(1, (height > col_width) ? height / col_width : col_width / height);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 다음 컬럼 좌표 설정
					startX += col_width + brush.innerPadding;
				}
			});

            return g;
		}
	}

	return ImageColumnBrush;
}, "chart.brush.imagebar");
