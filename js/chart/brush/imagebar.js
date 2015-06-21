jui.define("chart.brush.imagebar", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.imagebar
     *
     * implements column brush
     *
     * @extends chart.brush.column
     */
	var ImageBarBrush = function(chart, axis, brush) {
		var g;
		var targets, padding, zeroX, height, half_height, col_width, col_height;

		this.getImageURI = function(key, value) {
			var uri = this.brush.uri;

			if(_.typeCheck("function", uri)) {
				uri = uri.apply(this.chart, [ key, value ]);
			}

			return uri;
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
				var startY = axis.y(i) - (half_height / 2);

				for (var j = 0; j < targets.length; j++) {
					var value = data[targets[j]],
						startX = axis.x(value);

					var width = Math.abs(zeroX - startX),
						r = this.chart.svg.image({
							width : col_width,
							height : col_height,
							"xlink:href" : this.getImageURI(targets[j], value)
						});

					if(value != 0) {
						this.addEvent(r, i, j);
					}

					if (startX >= zeroX) {
						r.translate(zeroX, startY);
					} else {
						r.translate(zeroX - width, startY);
					}

					if(width > 0 && col_width > 0) {
						r.scale((width > col_width) ? width / col_width : col_width / width, 1);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

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
			uri: null
		}
	}

	return ImageBarBrush;
}, "chart.brush.core");
