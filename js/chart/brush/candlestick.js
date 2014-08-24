jui.define("chart.brush.candlestick", [], function() {

	var CandleStickBrush = function(brush) {
        var g, zeroY, count, width, barWidth;

        this.drawBefore = function(chart) {
            g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

            zeroY = brush.y(0);
            count = chart.data().length;

            width = brush.x(1) - brush.x(0);
            barWidth = width * 0.7;
        }

        this.draw = function(chart) {
            
            for (var i = 0; i < count; i++) {
                console.log(brush.x(i));
            }
            
        }
	}

	return CandleStickBrush;
}, "chart.brush");
