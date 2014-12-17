jui.define("chart.brush.fullstackcolumn", [], function() {

	var FullStackColumnBrush = function(chart, brush) {
		var g, zeroY, count, width, bar_width;

		this.drawBefore = function() {
			g = chart.svg.group();

			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			bar_width = width - brush.outerPadding * 2;
		}

		this.draw = function() {
			var chart_height = chart.height();

			for (var i = 0; i < count; i++) {
				var group = chart.svg.group();

				var startX = brush.x(i) - bar_width / 2,
                    sum = 0,
                    list = [];

				for (var j = 0; j < brush.target.length; j++) {
					var height = chart.data(i, brush.target[j]);

					sum += height;
					list.push(height);
				}

				var startY = 0,
                    max = brush.y.max();
				
				for (var j = list.length - 1; j >= 0; j--) {
					var height = chart_height - brush.y.rate(list[j], sum),
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
			}

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

            return g;
		}
	}

	return FullStackColumnBrush;
}, "chart.brush.fullstackbar");
