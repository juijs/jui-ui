jui.define("chart.brush.bar", [], function() {

    var BarBrush = function(brush) {
    	
    	console.log(brush);

        this._draw = function(chart) {
        	
        	var x = chart.area.chart.x;
        	var y = chart.area.chart.y;
        	
        	var g = chart.group();
        	g.attr({
        		"transform" : "translate(" + x + "," + y + ")"
        	})
        	
        	var zeroY = brush.y.scale(0);
        	
            var series = chart.get('series');

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
						g.rect(startX, startY, barWidth, Math.abs(zeroY - startY), { fill: this.getColor(j) });	
					} else {
						g.rect(startX, zeroY, barWidth, Math.abs(zeroY - startY), { fill: this.getColor(j) });
					}
					
					
					startX += barWidth + innerPadding;
				}

			}
			 
        }
    }
	
	return BarBrush;
}, "chart.brush");