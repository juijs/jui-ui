jui.define("chart.brush.area", [], function() {

    var AreaBrush = function(brush) {
        var g, zeroY, maxY, series, count, width;

        this.drawBefore = function(chart) {
            g = chart.svg.group().translate(chart.area.x, chart.area.y);

            zeroY = brush.y.scale(0);
            maxY = chart.area.height;
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

                var p2 = chart.svg.polygon({
                    fill: this.getColor(k),
                    opacity: 0.3
                });

                var x = path[k].x,
                    y = path[k].y;

                p2.point(x[0], maxY);

                for(var i = 0; i < x.length - 1; i++) {
                    p.MoveTo(x[i], y[i]);
                    p.LineTo(x[i + 1], y[i + 1]);
                    p2.point(x[i], y[i]);
                }

                p2.point(x[x.length - 1], y[y.length - 1]);
                p2.point(x[x.length - 1], maxY);

                g.append(p);
                g.append(p2);
            }
        }
    }

    return AreaBrush;
}, "chart.brush");