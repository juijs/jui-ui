jui.define("chart.brush.patterncolumn", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.patterncolumn
     * @extends chart.brush.column
     */
	var PatternColumnBrush = function() {
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
				var startX = this.offset("x", i) -(half_width / 2);

				for (var j = 0; j < targets.length; j++) {
					var value = data[targets[j]],
						patternId = this.createPattern(col_width, col_height, targets[j], value);
						startY = this.axis.y(value),
						height = Math.abs(zeroY - startY),
						r = this.chart.svg.rect({
							width: col_width,
							height: height,
							fill: "url(#" + patternId + ")",
							"stroke-width": 0
						});

					if(value != 0) {
						this.addEvent(r, i, j);
					}

					if (startY <= zeroY) {
						r.translate(startX, startY);
					} else {
						r.translate(startX, zeroY);
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

	return PatternColumnBrush;
}, "chart.brush.patternbar");
