jui.define("chart.brush.line", [], function() {

	var LineBrush = function(brush) {
        var self = this,
            path = [];

        function createPath(brush, chart, path, index) {
            var p = chart.svg.path({
                stroke : self.color(index),
                "stroke-width" : 2,
                fill : "transparent"
            });

            var x = path[index].x,
                y = path[index].y;

            if(brush.symbol == "curve") {
                var px = self.curvePoints(x),
                    py = self.curvePoints(y);

                for (var i = 0; i < x.length - 1; i++) {
                    p.MoveTo(x[i], y[i]);
                    p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                }
            } else {
                for (var i = 0; i < x.length - 1; i++) {
                    p.MoveTo(x[i], y[i]);

                    if(brush.symbol == "step") {
                        p.LineTo(x[i], y[i + 1]);
                    }

                    p.LineTo(x[i + 1], y[i + 1]);
                }
            }

            return p;
        }

        this.drawBefore = function(chart) {
            for (var i = 0, len = chart.data().length; i < len; i++) {
                var startX = brush.x(i),
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
        }

		this.draw = function(chart) {
            var g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

            this.drawLine(brush, chart, path, g);
		}

        this.drawLine = function(brush, chart, path, g) {
            for (var k = 0; k < path.length; k++) {
                var p = createPath(brush, chart, path, k);

                p.attr(chart.attr(brush.type, brush.target[k]));
                g.append(p);
            }
        }
	}

	return LineBrush;
}, "chart.brush"); 