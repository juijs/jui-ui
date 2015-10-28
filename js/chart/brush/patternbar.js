jui.define("chart.brush.patternbar", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.patternbar
     * @extends chart.brush.core
     */
	var PatternBarBrush = function() {
		var g;
		var targets, padding, zeroX, height, half_height, col_width, col_height;

		this.createPattern = function(width, height, key, value) {
			var id = _.createId("pattern-"),
				pattern = this.chart.svg.pattern({
					id: id,
					x: 0,
					y: 0,
					width: width,
					height: height,
					patternUnits: "userSpaceOnUse"
				}),
				image = this.chart.svg.image({
					width: width,
					height: height,
					"xlink:href" : this.getImageURI(key, value)
				});

			pattern.append(image);
			this.chart.appendDefs(pattern);

			return id;
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
				var startY = this.offset("y", i) -(half_height / 2);

				for (var j = 0; j < targets.length; j++) {
					var value = data[targets[j]],
						patternId = this.createPattern(col_width, col_height, targets[j], value),
						startX = this.axis.x(value),
						width = Math.abs(zeroX - startX),
						r = this.chart.svg.rect({
							width: width,
							height: col_height,
							fill: "url(#" + patternId + ")",
							"stroke-width": 0
						});

					if(value != 0) {
						this.addEvent(r, i, j);
					}

					if (startX >= zeroX) {
						r.translate(zeroX, startY);
					} else {
						r.translate(zeroX - width, startY);
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

	PatternBarBrush.setup = function() {
		return {
			innerPadding: 2,
			width: 0,
			height: 0,
			uri: null
		}
	}

	return PatternBarBrush;
}, "chart.brush.imagebar");
