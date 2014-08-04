jui.define("chart.brush.bar", [], function() {

    var BarBrush = function(brush) {

        this.drawBefore = function(chart) {
        }

        this.draw = function(chart) {
        	var x = chart.area.x;
        	var y = chart.area.y;
        	
        	var g = chart.svg.group({
                "transform" : "translate(" + x + "," + y + ")"
            });
        	
        	var zeroY = brush.y.scale(0);
            var series = chart.options.series;
			var count = series[brush.series[0]].data.length;
			
			var outerPadding = 15; 
			var innerPadding = 10;
			
			var width = chart.x.scale.rangeBand();
			
			var barWidth = (width - outerPadding*2 - (brush.series.length-1) * innerPadding) / brush.series.length;
			
			for(var i = 0; i < count; i++) {
				var startX = brush.x.scale(i) + outerPadding;
				
				for(var j = 0; j < brush.series.length; j++) {
					var startY = brush.y.scale(series[brush.series[j]].data[i]);
					
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