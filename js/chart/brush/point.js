jui.define("chart.brush.point", [], function() {

    var PointBrush = function(brush) {
        var radius = 1.7;

        this.draw = function(chart) {
            var series = chart.get('series');
            var barPadding = chart.get('barPadding');
            var seriesPadding = chart.get('seriesPadding');
            var labels = chart.get('labels');
			var colors = ["black", 'red', 'blue'];
            var height = chart.area.chart.height;
            var width = chart.area.chart.width;
            var rate = width / labels.length; 
            var pos = rate / 2; 
            var grid = brush.grid;
            
            for(var i = 0, len = brush.series.length; i < len; i++) {
            	var s = series[brush.series[i]];
            	
            	for(var j = 0; j < s.data.length; j++) {
            		var value = s.data[j];
            		
            		var y = chart.convert(height, grid.max, grid.min, value);
            		var x = (rate * j) + pos;
            		
           			chart.circle(x, y, radius * (value/15), {
                      fill: colors[i],
                    });                            		

            	}
            	

            }            
            
        }

        this.getRadius = function() {
            return radius;
        }
    }

    return PointBrush;
});