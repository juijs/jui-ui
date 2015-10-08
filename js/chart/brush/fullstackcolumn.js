jui.define("chart.brush.fullstackcolumn", [], function() {

    /**
     * @class chart.brush.fullstackcolumn 
     * @extends chart.brush.fullstackbar
     */
	var FullStackColumnBrush = function(chart, axis, brush) {
		var g, zeroY, width, bar_width;

		this.getTargetSize = function() {
			var width = this.axis.x.rangeBand();

			if(this.brush.size > 0) {
				return this.brush.size;
			} else {
				return width - this.brush.outerPadding * 2;
			}
		}

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroY = axis.y(0);
			width = axis.x.rangeBand();
			bar_width = this.getTargetSize();
		}

		this.draw = function() {
			var chart_height = axis.area("height");

			this.eachData(function(i, data) {
				var group = chart.svg.group();

				var startX = this.offset("x", i) - bar_width / 2,
                    sum = 0,
                    list = [];

				for(var j = 0; j < brush.target.length; j++) {
					var height = data[brush.target[j]];

					sum += height;
					list.push(height);
				}

				var startY = 0,
                    max = axis.y.max();
				
				for(var j = list.length - 1; j >= 0; j--) {
					var height = chart_height - axis.y.rate(list[j], sum),
						r = this.getBarElement(i, j);

					r.attr({
						x: startX,
						y: startY,
						width: bar_width,
						height: height
					});

					group.append(r);

					// 퍼센트 노출 옵션 설정
					if(brush.showText) {
						var p = Math.round((list[j] / sum) * max),
							x = startX + bar_width / 2,
							y = startY + height / 2 + 8;

						group.append(this.drawText(p, x, y));
					}

					// 액티브 엘리먼트 이벤트 설정
					this.setActiveEventOption(group);

					startY += height;										
				}

				this.addBarElement(group);
				g.append(group);
			});

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

            return g;
		}
	}

	return FullStackColumnBrush;
}, "chart.brush.fullstackbar");
