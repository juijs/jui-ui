jui.define("chart.brush.imagebar", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.imagebar
     * @extends chart.brush.column
     */
	var ImageBarBrush = function() {
		var self = this;
		var g, targets, padding, zeroX, height, half_height, col_width, col_height;

		this.getImageURI = function(key, value) {
			var uri = this.brush.uri;

			if(_.typeCheck("function", uri)) {
				uri = uri.apply(this.chart, [ key, value ]);
			}

			return uri;
		}

		this.getBarStyle = function() {
			return {
				borderColor: this.chart.theme("barBorderColor"),
				borderWidth: this.chart.theme("barBorderWidth"),
				borderOpacity: this.chart.theme("barBorderOpacity")
			}
		}

		this.drawBefore = function() {
			g = this.chart.svg.group();
			targets = this.brush.target;
			padding = this.brush.innerPadding;
			zeroX = this.axis.x(0);
			height = this.axis.y.rangeBand();
			col_width = this.brush.width;
			col_height = this.brush.height;
			half_height = (col_height * targets.length) + ((targets.length - 1) * padding);
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var startY = this.offset("y", i) - (half_height / 2);

				for (var j = 0; j < targets.length; j++) {
					var value = data[targets[j]],
						startX = this.axis.x(value);

					var width = Math.abs(zeroX - startX),
						bar = this.chart.svg.group({}, function() {
							var img = self.chart.svg.image({
								width: col_width,
								height: col_height,
								"xlink:href": self.getImageURI(targets[j], value)
							});

							if(self.brush.fixed) {
								var w = width - col_width,
									style = self.getBarStyle();

								// 바 크기 음수 처리
								if(w < 0) w = 0;

								self.chart.svg.rect({
									width: w,
									height: col_height,
									fill: self.color(i, j),
									stroke : style.borderColor,
									"stroke-width" : style.borderWidth,
									"stroke-opacity" : style.borderOpacity
								});

								img.translate(w, 0);
							} else {
								if(width > 0 && col_width > 0) {
									img.scale((width > col_width) ? width / col_width : col_width / width, 1);
								}
							}
						});

					if(value != 0) {
						this.addEvent(bar, i, j);
					}

					if (startX >= zeroX) {
						bar.translate(zeroX, startY);
					} else {
						bar.translate(zeroX - width, startY);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(bar);

					// 다음 컬럼 좌표 설정
					startY += col_height + padding;
				}
			});

            return g;
		}
	}

	ImageBarBrush.setup = function() {
		return {
			innerPadding: 2,
			width: 0,
			height: 0,
			fixed: true,
			uri: null
		}
	}

	return ImageBarBrush;
}, "chart.brush.core");
