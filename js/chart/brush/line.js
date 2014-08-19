jui.define("chart.brush.line", [], function() {

	var LineBrush = function(brush) {

		this.draw = function(chart) {
            var g = chart.svg.group().translate(chart.area('x'), chart.area('y')),
                path = this.getPath(brush, chart);

            this.drawLine(brush, chart, path, g);
		}

        this.getPath = function(brush, chart) {
            var path = [],
                posX = (brush.full) ? 0 : chart.x.rangeBand() / 2;

            for (var i = 0; i < chart.data().length; i++) {
                var startX = brush.x(i) + posX,
                    valueSum = 0;

                for (var j = 0; j < brush.target.length; j++) {
                    var value = chart.series(brush.target[j]).data[i];

                    if (brush.nest === false && j > 0) {
                        valueSum += chart.series(brush.target[j - 1]).data[i];
                    }

                    if (!path[j]) {
                        path[j] = {
                            x : [],
                            y : []
                        };
                    }

                    path[j].x.push(startX);
                    path[j].y.push(brush.y(value + valueSum));
                }
            }

            return path;
        }

        this.drawLine = function(brush, chart, path, g) {
            for (var k = 0; k < path.length; k++) {
                var p = chart.svg.path({
                    stroke : this.color(k),
                    "stroke-width" : 2,
                    fill : "transparent"
                });

                var x = path[k].x,
                    y = path[k].y;

                for (var i = 0; i < x.length - 1; i++) {
                    p.MoveTo(x[i], y[i]);
                    p.LineTo(x[i + 1], y[i + 1]);
                }

                p.attr(chart.attr(brush.type, brush.target[k]));
                g.append(p);
            }
        }
	}

	return LineBrush;
}, "chart.brush"); 