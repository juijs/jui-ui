jui.define("chart.brush.imagecolumn", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.imagecolumn
     * @extends chart.brush.column
     */
	var ImageColumnBrush = function() {
		var self = this;
		var g, targets, padding, zeroY, width, half_width, col_width, col_height;

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
				var startX = this.offset("x", i) - (half_width / 2);

				for (var j = 0; j < targets.length; j++) {
					var value = data[targets[j]],
						startY = this.axis.y(value);

					var	height = Math.abs(zeroY - startY),
						bar = this.chart.svg.group({}, function() {
							var img = self.chart.svg.image({
								width: col_width,
								height: col_height,
								"xlink:href": self.getImageURI(targets[j], value)
							});

							if(self.brush.fixed) {
								var h = height - col_height,
									style = self.getBarStyle();

								// 컬럼 크기 음수 처리
								if(h < 0) h = 0;

								self.chart.svg.rect({
									y: col_height,
									width: col_width,
									height: h,
									fill: self.color(i, j),
									stroke : style.borderColor,
									"stroke-width" : style.borderWidth,
									"stroke-opacity" : style.borderOpacity
								});
							} else {
								if(height > 0 && col_height > 0) {
									img.scale(1, (height > col_height) ? height / col_height : col_height / height);
								}
							}
						});

					if(value != 0) {
						this.addEvent(bar, i, j);
					}

					if (startY <= zeroY) {
						bar.translate(startX, startY);
					} else {
						bar.translate(startX, zeroY);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(bar);

					// 다음 컬럼 좌표 설정
					startX += col_width + padding;
				}
			});

            return g;
		}
	}

	return ImageColumnBrush;
}, "chart.brush.imagebar");
