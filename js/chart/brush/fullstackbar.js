jui.define("chart.brush.fullstackbar", [], function() {

	var FullStackBarBrush = function(chart, brush) {
		var g, zeroX, count, height, bar_height;

		this.drawBefore = function() {
			g = chart.svg.group();

			zeroX = brush.x(0);
			count = chart.data().length;

			height = brush.y.rangeBand();
			bar_height = height - brush.outerPadding * 2;
		}

		this.drawText = function(percent, x, y) {
			var text = this.chart.text({
				x : x,
				y : y,
				"text-anchor" : "middle"
			}, percent + "%");

			return text;
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var group = chart.svg.group();

				var startY = brush.y(i) - bar_height / 2,
					sum = 0,
					list = [];

				for (var j = 0; j < brush.target.length; j++) {
					var width = chart.data(i, brush.target[j]);

					sum += width;
					list.push(width);
				}

				var startX = 0,
					max = brush.x.max();

				for (var j = list.length - 1; j >= 0; j--) {
					var width = brush.x.rate(list[j], sum),
						r = this.getBarElement(i, j);

					r.attr({
						x : startX,
						y : startY,
						width: width,
						height: bar_height
					});

					group.append(r);

					// 퍼센트 노출 옵션 설정
					if(brush.showText) {
						var p = Math.round((list[j] / sum) * max),
							x = startX + width / 2,
							y = startY + bar_height / 2 + 5;

						group.append(this.drawText(p, x, y));
					}

					// 액티브 엘리먼트 이벤트 설정
					this.setActiveEventOption(group);

					startX += width;
				}

				this.addBarElement(group);
				g.append(group);
			}

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

			return g;
		}

		this.drawSetup = function() {
			return this.getOptions({
				outerPadding: 15,
				active: null,
				activeEvent: null, // or click, mouseover, ...
				showText: false
			});
		}
	}

	return FullStackBarBrush;
}, "chart.brush.stackbar");
