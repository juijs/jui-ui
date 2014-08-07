jui.define("chart.brush.line", [], function() {

    var LineBrush = function(grid) {
        var g, zeroY, series, count, width;

        function computeControlPoints(K) {
            var p1 = [];
            var p2 = [];
            var n = K.length - 1;

            /*rhs vector*/
            var a = [];
            var b = [];
            var c = [];
            var r = [];

            /*left most segment*/
            a[0] = 0;
            b[0] = 2;
            c[0] = 1;
            r[0] = K[0]+2*K[1];

            /*internal segments*/
            for (i = 1; i < n - 1; i++)
            {
                a[i] = 1;
                b[i] = 4;
                c[i] = 1;
                r[i] = 4 * K[i] + 2 * K[i + 1];
            }

            /*right segment*/
            a[n-1] = 2;
            b[n-1] = 7;
            c[n-1] = 0;
            r[n-1] = 8 * K[n-1] + K[n];

            /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
            for (var i = 1; i < n; i++)
            {
                var m = a[i] / b[i - 1];
                b[i] = b[i] - m * c[i - 1];
                r[i] = r[i] - m * r[i - 1];
            }

            p1[n - 1] = r[n - 1] / b[n - 1];
            for (var i = n - 2; i >= 0; --i)
                p1[i] = (r[i] - c[i] * p1[i+1]) / b[i];

            /*we have p1, now compute p2*/
            for (var i = 0; i < n - 1; i++)
                p2[i] = 2 * K[i + 1] - p1[i + 1];

            p2[n - 1] = 0.5 * (K[n] + p1[n-1]);

            return { p1: p1, p2: p2 };
        }

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
                    px = computeControlPoints(x),
                    py = computeControlPoints(y);

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