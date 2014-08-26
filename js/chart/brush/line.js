jui.define("chart.brush.line", [], function() {

	var LineBrush = function(brush) {

        function createLine(brush, chart, pos, index) {
            var p = chart.svg.path({
                stroke : chart.theme.color(index),
                "stroke-width" : 2,
                fill : "transparent"
            });

            var x = pos.x,
                y = pos.y;

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

        this.drawLine = function(brush, chart, path) {
            var g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

            for (var k = 0; k < path.length; k++) {
                var p = createLine(brush, chart, path[k], k);
                g.append(p);
            }
        }

        this.draw = function(chart) {
            this.drawLine(brush, chart, this.getXY(brush, chart));
        }
	}

	return LineBrush;
}, "chart.brush"); 