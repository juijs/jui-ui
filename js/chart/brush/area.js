jui.define("chart.brush.area", [], function() {

    var AreaBrush = function(brush) {

        this.drawArea = function(brush, chart, path) {
            var g = chart.svg.group().translate(chart.x(), chart.y()),
                maxY = chart.height();

            for (var k = 0; k < path.length; k++) {
                var p = this.createLine(brush, chart, path[k], k),
                    xList = path[k].x;

                p.LineTo(xList[xList.length - 1], maxY);
                p.LineTo(xList[0], maxY);
                p.ClosePath();
                p.attr({
                    fill: chart.theme.color(k, brush.colors),
                    "fill-opacity": chart.theme("areaOpacity"),
                    "stroke-width": 0
                });

                g.prepend(p);
            }
        }

        this.draw = function(chart) {
            this.drawArea(brush, chart, this.getXY(brush, chart));
        }
    }

    return AreaBrush;
}, "chart.brush.line");
