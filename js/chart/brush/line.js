jui.define("chart.brush.line", [], function() {

    var LineBrush = function(brush) {

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
            
            //console.log(brush);
            
            for(var i = 0, len = brush.series.length; i < len; i++) {
            	var s = series[brush.series[i]];
            	s.paths = s.paths || [];
            	
            	for(var j = 0, jlen = s.data.length; j < jlen; j++) {
            		var y = chart.convert(height, grid.max, grid.min, s.data[j]);
            		var x = (rate * j) + pos;
            		
            		s.paths.push({x : x, y : y})
            	}
            	
            	for (var k = 0; k < s.paths.length - 1; k++) {
                    var x1 = s.paths[k].x,
                        y1 = s.paths[k].y,
                        x2 = s.paths[k + 1].x,
                        y2 = s.paths[k + 1].y;

                    chart.line(x1, y1, x2, y2, {
                        "stroke-width": 1,
                        "stroke": colors[i]
                    });
                }
                
            }

        }
    }

    return LineBrush;
}, "chart.brush");