jui.define("chart.brush.point", [], function() {

	var PointBrush = function(brush) {

        this.draw = function(chart) {
            var g = chart.svg.group().translate(chart.area('x'), chart.area('y'));
            var points = [],
                posX = (brush.full) ? 0 : chart.x.rangeBand() / 2;

            for (var i = 0; i < chart.data().length; i++) {
                points[i] = brush.x(i) + posX;
            }

            this.drawPoint(brush, chart, points, g);
        }

		this.drawPoint = function(brush, chart, points, g) {
            for (var i = 0; i < points.length; i++) {
                var valueSum = 0;

                for (var j = 0; j < brush.target.length; j++) {
                    var value = chart.series(brush.target[j]).data[i];

                    if (brush.nest === false && j > 0) {
                        valueSum += chart.series(brush.target[j - 1]).data[i];
                    }

                    var circle = chart.svg.circle({
                        cx: points[i],
                        cy: brush.y(value + valueSum),
                        r: 1,
                        fill: this.color(j)
                    });

                    circle.attr(chart.attr(brush.type, brush.target[j]));
                    g.append(circle);
                }
            }
		}
	}

	return PointBrush;
}, "chart.brush"); 