jui.define("chart.brush.splitarea", [ "util.base" ], function(_) {

    var SplitAreaBrush = function() {

        this.drawArea = function(path) {
            var g = this.chart.svg.group(),
                maxY = this.chart.height(),
                split = this.brush.split,
                splitColor = this.chart.theme("areaSplitBackgroundColor");

            for (var k = 0; k < path.length; k++) {
                var opts = {
                    fill: this.chart.color(k, this.brush),
                    "fill-opacity": this.chart.theme("areaOpacity"),
                    "stroke-width": 0
                };

                var line = this.createLine(path[k], k),
                    xList = path[k].x;

                line.each(function(i, p) {
                    if(i == 0) {
                        split = (split != null) ? split : xList.length - 1;

                        p.LineTo(xList[split], maxY);
                        p.LineTo(xList[0], maxY);
                        p.attr(opts);
                    } else {
                        opts["fill"] = splitColor;

                        p.LineTo(xList[xList.length - 1], maxY);
                        p.LineTo(xList[split], maxY);
                        p.attr(opts);
                    }

                    p.ClosePath();
                });

                this.addEvent(line, null, null);
                g.prepend(line);
            }

            return g;
        }

        this.draw = function() {
            return this.drawArea(this.getXY());
        }
    }

    return SplitAreaBrush;
}, "chart.brush.splitline");
