jui.define("chart.brush.line", [], function() {

	var LineBrush = function(brush) {

        this.createLine = function(chart, brush, pos, index) {
            var x = pos.x,
                y = pos.y;

            var p = chart.svg.path({
                stroke : chart.color(index, brush.colors),
                "stroke-width" : chart.theme("lineBorderWidth"),
                fill : "transparent"
            }).MoveTo(x[0], y[0]);

            if(brush.symbol == "curve") {
                var px = this.curvePoints(x),
                    py = this.curvePoints(y);

                for (var i = 0; i < x.length - 1; i++) {
                    p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                }
            } else {
                for (var i = 0; i < x.length - 1; i++) {
                    if(brush.symbol == "step") {
                        p.LineTo(x[i], y[i + 1]);
                    }

                    p.LineTo(x[i + 1], y[i + 1]);
                }
            }

            return p;
        }

        this.drawLine = function(chart, brush, path) {
            var g = chart.svg.group().translate(chart.x(), chart.y());

            for (var k = 0; k < path.length; k++) {
                var p = this.createLine(chart, brush, path[k], k);
                this.addEvent(p, k, null);

                g.append(p);
            }

            return g;
        }

        this.draw = function(chart) {
            return this.drawLine(chart, brush, this.getXY());
        }

        this.drawSetup = function() {
            return {
                symbol: "normal" // normal, curve, step
            }
        }
	}

	return LineBrush;
}, "chart.brush.core");