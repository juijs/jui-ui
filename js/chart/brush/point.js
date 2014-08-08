jui.define("chart.brush.point", [], function() {

    var PointBrush = function(brush) {
        var g, zeroY, series, count, width;
        var r = 10;

        this.drawBefore = function(chart) {
            g = chart.svg.group().translate(chart.area.x, chart.area.y);

            zeroY = brush.y.scale(0);
            series = chart.options.series;
            count = series[brush.target[0]].data.length;
            width = chart.x.scale.rangeBand();
        }

        this.draw = function(chart) {
            for(var i = 0; i < count; i++) {
                var startX = brush.x.scale(i) + (width / 2);

                for(var j = 0; j < brush.target.length; j++) {
                    var startY = brush.y.scale(series[brush.target[j]].data[i]);

                    g.append(chart.svg.circle({
                        cx: startX,
                        cy: startY,
                        r: r,
                        fill: this.getColor(j)
                    }));
                }
            }
        }
    }

    return PointBrush;
}, "chart.brush");