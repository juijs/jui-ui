jui.define("chart.brush.point", [], function() {

    var PointBrush = function(grid) {
        var g, zeroY, series, count, width;
        var r = 10;

        this.drawBefore = function(chart) {
            g = chart.svg.group().translate(chart.area.x, chart.area.y);

            zeroY = grid.y.scale(0);
            series = chart.options.series;
            count = series[grid.series[0]].data.length;
            width = chart.x.scale.rangeBand();


            console.log(grid.series);
            console.log(series);
        }

        this.draw = function(chart) {
            for(var i = 0; i < count; i++) {
                var startX = grid.x.scale(i) + (width / 2);

                for(var j = 0; j < grid.series.length; j++) {
                    var startY = grid.y.scale(series[grid.series[j]].data[i]);

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