jui.define("chart.brush.imagecolumn", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.imagecolumn
     *
     * implements column brush
     *
     * @extends chart.brush.column
     */
	var ImageColumnBrush = function(chart, axis, brush) {
		var g;
		var targets, padding, zeroY, width, half_width, col_width, col_height;

		this.drawBefore = function() {
			g = this.chart.svg.group();
			targets = this.brush.target;
			padding = this.brush.innerPadding;
			zeroY = this.axis.y(0);
			width = this.axis.x.rangeBand();
			col_width = this.brush.width;
			col_height = this.brush.height;
			half_width = (col_width * targets.length) + ((targets.length - 1) * padding);
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var startX = axis.x(i) - (half_width / 2);

				for (var j = 0; j < targets.length; j++) {
					var value = data[targets[j]],
						startY = axis.y(value);

					var	height = Math.abs(zeroY - startY),
						r = this.chart.svg.image({
							width : col_width,
							height : col_width,
							"xlink:href" : this.getImageURI(targets[j], value)
						});

					if(value != 0) {
						this.addEvent(r, i, j);
					}

					if (startY <= zeroY) {
						r.translate(startX, startY);
					} else {
						r.translate(startX, zeroY);
					}

					if(height > 0 && col_height > 0) {
						r.scale(1, (height > col_width) ? height / col_width : col_width / height);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 다음 컬럼 좌표 설정
					startX += col_width + padding;
				}
			});

            return g;
		}
	}

	return ImageColumnBrush;
}, "chart.brush.imagebar");
