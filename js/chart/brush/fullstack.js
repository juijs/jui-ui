jui.define("chart.brush.fullstack", [], function() {

	var FullStackBrush = function(chart, brush) {
		var g, zeroY, count, width, barWidth;

		this.drawBefore = function() {
			g = chart.svg.group();

			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			barWidth = width - brush.outerPadding * 2;
		}

		this.draw = function() {
			var chart_height = chart.height();

			for (var i = 0; i < count; i++) {
				var startX = brush.x(i) - barWidth / 2,
                    sum = 0,
                    list = [];

				for (var j = 0; j < brush.target.length; j++) {
					var height = chart.data(i, brush.target[j]);

					sum += height;
					list.push(height);
				}

				var startY = 0,
                    max = brush.y.max(),
                    current = max;
				
				for (var j = list.length - 1; j >= 0; j--) {
					var height = chart_height - brush.y.rate(list[j] , sum);
					
					var r = chart.svg.rect({
						x : startX,
						y : startY,
						width : barWidth,
						height : height,
						fill : chart.color(j, brush)
					});

                    this.addEvent(r, j, i);
					g.append(r);

					if (brush.text) {
						var percent = Math.round((list[j]/sum)*max);
						var text = chart.svg.text({
							x : startX + barWidth / 2,
							y : startY + height / 2 + 8,
							"text-anchor" : "middle"
						}, ((current - percent < 0 ) ? current : percent) + "%");					
						g.append(text);					
						current -= percent;
					}
					
					startY += height;										
				}
			}

            return g;
		}

        this.drawSetup = function() {
            return {
                outerPadding: 15
            }
        }
	}

	return FullStackBrush;
}, "chart.brush.core");
