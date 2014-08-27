jui.define("chart.brush.fullstack", [], function() {

	var FullStackBrush = function(brush) {
		var g, zeroY, count, width, barWidth, gauge;
		var outerPadding = brush.outerPadding || 15;

		this.drawBefore = function(chart) {
			g = chart.svg.group().translate(chart.x(), chart.y());

			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			barWidth = width - outerPadding * 2;
		}

		this.draw = function(chart) {
			var chart_height = chart.height();
			for (var i = 0; i < count; i++) {

				var startX = brush.x(i) - barWidth/2;

				var sum = 0;
				var list = [];
				for (var j = 0; j < brush.target.length; j++) {
					var height = chart.series(brush.target[j]).data[i];

					sum += height;
					list.push(height);
				}

				var startY = 0;
				var max  = brush.y.max();
				var current = max; 
				
				for (var j = list.length - 1; j >= 0; j--) {
					
					var height = chart_height - brush.y.rate(list[j] , sum); 
					
					var r = chart.svg.rect({
						x : startX,
						y : startY,
						width : barWidth,
						height : height,
						fill : chart.theme.color(j)
					});
					
					g.append(r);

					if (brush.text) {
						var percent = Math.round((list[j]/sum)*max);
						var text = chart.svg.text({
							x : startX + barWidth/2,
							y : startY + height/2 + 8,
							'text-anchor' : 'middle'
						}, ((current - percent < 0 ) ? current : percent) + "%");					
						g.append(text);					
						current -= percent;
					}
					
					startY += height;										
				}
			}
		}
	}

	return FullStackBrush;
}, "chart.brush");
