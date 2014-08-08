jui.define("chart.brush.stack", [], function() {

    var StackBrush = function(brush) {
        var g, zeroY, series, count, width, barWidth;
        var outerPadding = 15, innerPadding = 10;

        this.drawBefore = function(chart) {
            g = chart.svg.group().translate(chart.area.x, chart.area.y);

            zeroY = brush.y.scale(0);
            series = chart.options.series;
            count = series[brush.series[0]].data.length;

            width = chart.x.scale.rangeBand();
            barWidth = width - outerPadding*2;
        }

        this.draw = function(chart) {
			for(var i = 0; i < count; i++) {
				var startX = brush.x.scale(i) + outerPadding;
				
				var heightSum = 0;
				var heightArr = [];
				for(var j = 0; j < brush.series.length; j++) {
					var height = series[brush.series[j]].data[i];
					
					heightSum += height;
					heightArr.push(chart.area.height - brush.y.scale(height)); 
				}
				
				var startY = brush.y.scale(heightSum);
				
				for(var j = heightArr.length - 1; j  >= 0 ; j--) {
                    var r = chart.svg.rect({
                        x: startX,
                        y: startY,
                        width: barWidth,
                        height: heightArr[j],
                        fill: this.getColor(j)
                    });

                    g.append(r);
                    
                    startY += heightArr[j]
				}
				
			}
        }
    }
	
	return StackBrush;
}, "chart.brush");