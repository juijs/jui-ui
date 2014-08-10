jui.define("chart.brush.line", [], function() {

    var LineBrush = function(brush) {
        var g, zeroY, series, count, width;

        this.drawBefore = function(chart) {
            g = chart.svg.group().translate(chart.getArea('x'), chart.getArea('y'));

            zeroY = brush.y.scale(0);
            series = chart.options.series;
            count = series[brush.target[0]].data.length;
            width = chart.x.scale.rangeBand();
        }

        this.draw = function(chart) {
            var path = {};

            for(var i = 0; i < count; i++) {
                var startX = brush.x.scale(i) + (width / 2);

                for(var j = 0; j < brush.target.length; j++) {
                    var startY = brush.y.scale(series[brush.target[j]].data[i]);

                    if(!path[j]) {
                        path[j] = { x: [], y: [] };
                    }

                    path[j].x.push(startX);
                    path[j].y.push(startY);
                }
            }

            for(var k in path) {
                var p = chart.svg.path({
                    stroke: this.getColor(k),
                    "stroke-width": 2,
                    fill: "transparent"
                });

                var x = path[k].x,
                    y = path[k].y,
                    px = [],
                    py = [];

                if(brush.smooth) {
                    px = this.curvePoints(x);
                    py = this.curvePoints(y);
                }

                for(var i = 0; i < x.length - 1; i++) {
                    p.MoveTo(x[i], y[i]);

                    if(brush.smooth) {
                        p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                    } else {
                        p.LineTo(x[i + 1], y[i + 1]);
                    }
                }

                g.append(p);
            }
        }
    }

    return LineBrush;
}, "chart.brush");