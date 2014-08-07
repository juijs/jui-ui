jui.define("chart.brush.line", [], function() {

    var LineBrush = function(grid) {
        var g, zeroY, series, count, width;

        this.drawBefore = function(chart) {
            g = chart.svg.group().translate(chart.area.x, chart.area.y);

            zeroY = grid.y.scale(0);
            series = chart.options.series;
            count = series[grid.series[0]].data.length;
            width = chart.x.scale.rangeBand();
        }

        this.draw = function(chart) {
            var path = {};

            for(var i = 0; i < count; i++) {
                var startX = grid.x.scale(i) + (width / 2);

                for(var j = 0; j < grid.series.length; j++) {
                    var startY = grid.y.scale(series[grid.series[j]].data[i]);

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
                    px = this.curvePoints(x),
                    py = this.curvePoints(y);

                for(var i = 0; i < x.length - 1; i++) {
                    p.MoveTo(x[i], y[i]);
                    p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                }

                g.append(p);
            }
        }
    }

    return LineBrush;
}, "chart.brush");