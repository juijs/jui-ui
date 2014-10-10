jui.define("chart.brush.stackcolumn", [], function() {

	var ColumnStackBrush = function(brush) {
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
				
				var group = chart.svg.group();
				
				var startX = brush.x(i) - barWidth/2;
				var startY = brush.y(0);
				var value = 0;


				for(var j = 0; j < brush.target.length; j++) {
					var yValue = chart.data(i, brush.target[j]) + value; 
					
					var endY = brush.y(yValue);
					
					var r = chart.svg.rect({
						x : startX,
						y : (startY > endY) ? endY : startY,
						width : barWidth,
						height : Math.abs(startY - endY),
						fill : chart.color(j, brush.colors)
					});
					
                    this.addEvent(brush, chart, r, i, j);
					group.append(r);					
					
					startY = endY;
					value = yValue;
				}
				
				g.append(group);

			}

            return g;
		}
	}

	return ColumnStackBrush;
}, "chart.brush.core");
