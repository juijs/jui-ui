jui.define("chart.brush.line", [], function() {

	var LineBrush = function() {

        this.createLine = function(pos, index) {
            var x = pos.x,
                y = pos.y;

            var p = this.chart.svg.path({
                stroke : this.chart.color(index, this.brush.colors),
                "stroke-width" : this.chart.theme("lineBorderWidth"),
                fill : "transparent"
            }).MoveTo(x[0], y[0]);

            if(this.brush.symbol == "curve") {
                var px = this.curvePoints(x),
                    py = this.curvePoints(y);

                for (var i = 0; i < x.length - 1; i++) {
                    p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                }
            } else {
                for (var i = 0; i < x.length - 1; i++) {
                    if(this.brush.symbol == "step") {
                        if(i == 0) {
                            p.MoveTo(x[i], y[i + 1]);
                        } else {
                            p.LineTo(x[i], y[i + 1]);
                        }
                    }

                    p.LineTo(x[i + 1], y[i + 1]);
                }
            }

            return p;
        }

        this.drawLine = function(path) {
            var g = this.chart.svg.group().translate(this.chart.x(), this.chart.y());

            for (var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k);
                this.addEvent(p, k, null);

                g.append(p);
            }

            return g;
        }

        this.draw = function() {
            return this.drawLine(this.getXY());
        }

        this.drawSetup = function() {
            return {
                symbol: "normal" // normal, curve, step
            }
        }
	}

	return LineBrush;
}, "chart.brush.core");