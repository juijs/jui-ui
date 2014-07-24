jui.define("chart.brush.bar", [], function() {

    var BarBrush = function(brush) {

		function drawBar(chart, data, startX) {
			
			//console.log(startX);
			
			var barPadding = chart.get('barPadding');
			var seriesPadding = chart.get('seriesPadding');
			var tickWidth = chart.area.chart.width / chart.get('labels').length;
			var colors = ["black", 'red', 'blue'];
			var max = brush.grid.max;
			var min = brush.grid.min;
			var range = max - min; 
			var height = chart.area.chart.height; 
			var rate = height / range; 
			
			var unit = (tickWidth - barPadding*2 - seriesPadding * (data.length - 1))/data.length;
			var x = startX + barPadding;

			for(var i = 0; i < data.length; i++ ) {
			
				var value = data[i];
				var unitHeight = rate * Math.abs(value);

				if (value > 0) {
					chart.rect(x, ((max - value) * rate), unit, unitHeight, {
						fill : colors[i]
					})	
					
				} else if (value < 0) {
					var zeroBase = max * rate;					
					chart.rect(x, zeroBase, unit, unitHeight, {
						fill : colors[i]
					})
					
				}
				//break;
				x += unit + seriesPadding;	
			}
			
		}

        this.draw = function(chart) {
            var series = chart.get('series');

            var labels = chart.get('labels');
            var tickWidth = (chart.area.chart.width / labels.length);
            
            var startX = 0;

			for(var i = 0, len = labels.length; i < len; i++) {
	
				var data = [];
		
				for(var j = 0; j < brush.series.length; j ++ ) {
					
					var s = series[brush.series[j]];
					data.push(s.data[i]);
				}

                drawBar(chart, data, startX);
				
				startX += tickWidth;
				
			}

        }
    }
	
	return BarBrush;
}, "chart.brush");