jui.define("chart.brush.bar", [], function() {

    var BarBrush = function(grid) {
        var g, zeroY, series, count, width, barWidth;
        var outerPadding = 15, innerPadding = 10;

        this.drawBefore = function(chart) {
            g = chart.svg.group().translate(chart.area.x, chart.area.y);

            zeroY = grid.y.scale(0);
            series = chart.options.series;
            count = series[grid.series[0]].data.length;

            width = chart.x.scale.rangeBand();
            barWidth = (width - outerPadding*2 - (grid.series.length-1) * innerPadding) / grid.series.length;
        }

        this.draw = function(chart) {
			for(var i = 0; i < count; i++) {
				var startX = grid.x.scale(i) + outerPadding;
				
				for(var j = 0; j < grid.series.length; j++) {
					var startY = grid.y.scale(series[grid.series[j]].data[i]);
					
					if (startY <= zeroY) {
                        var r = chart.svg.rect({
                            x: startX,
                            y: startY,
                            width: barWidth,
                            height: Math.abs(zeroY - startY),
                            fill: this.getColor(j)
                        });

                        g.append(r);
					} else {
                        var r = chart.svg.rect({
                            x: startX,
                            y: zeroY,
                            width: barWidth,
                            height: Math.abs(zeroY - startY),
                            fill: this.getColor(j)
                        });

                        g.append(r);
                    }
					
					startX += barWidth + innerPadding;
				}
			}
        }
    }
	
	return BarBrush;
}, "chart.brush");