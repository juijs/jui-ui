jui.define("chart.brush.area", [], function() {

    var AreaBrush = function(brush) {
        var self = this;

        function createArea(brush, chart, pos, index) {
            var x = pos.x,
                y = pos.y,
                maxY = chart.height();

            var p = chart.svg.path({
                fill : chart.theme.color(index),
                opacity : chart.theme("areaOpacity")
            }).MoveTo(x[0], y[0]);

            if(brush.symbol == "curve") {
                var px = self.curvePoints(x),
                    py = self.curvePoints(y);

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

            p.LineTo(x[x.length - 1], maxY);
            p.LineTo(x[0], maxY);
            p.ClosePath();

            return p;
        }

        this.drawArea = function(brush, chart, path) {
            var g = chart.svg.group().translate(chart.x(), chart.y());

            for (var k = 0; k < path.length; k++) {
                var p = createArea(brush, chart, path[k], k);
                g.prepend(p);
            }
        }

        this.draw = function(chart) {
            this.drawArea(brush, chart, this.getXY(brush, chart));
        }
    }

    return AreaBrush;
}, "chart.brush.core");
