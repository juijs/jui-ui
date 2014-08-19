jui.define("chart.brush.sline", [], function() {

    var StepLineBrush = function(brush) {

        this.draw = function(chart) {
            var g = chart.svg.group().translate(chart.area('x'), chart.area('y')),
                path = this.getPath(brush, chart);

            this.drawLine(brush, chart, path, g);
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
                    p.LineTo(x[i], y[i + 1]);
                    p.LineTo(x[i + 1], y[i + 1]);
                }

                p.attr(chart.attr(brush.type, brush.target[k]));
                g.append(p);
            }
        }
    }

    return StepLineBrush;
}, "chart.brush.line");