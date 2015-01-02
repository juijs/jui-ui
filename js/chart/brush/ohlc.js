jui.define("chart.brush.ohlc", [], function() {

    var OHLCBrush = function(chart, axis, brush) {
        var g;

        function getTargetData(data) {
            var target = {};

            for (var j = 0; j < brush.target.length; j++) {
                var k = brush.target[j],
                    t = chart.get("series", k);

                target[t.type] = data[k];
            }

            return target;
        }

        this.drawBefore = function() {
            g = chart.svg.group();
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var data = getTargetData(data),
                    startX = axis.x(i);

                var open = data.open,
                    close = data.close,
                    low = data.low,
                    high = data.high;

                var color = (open > close) ? chart.theme("ohlcInvertBorderColor") : chart.theme("ohlcBorderColor");

                var lowHigh = chart.svg.line({
                    x1: startX,
                    y1: axis.y(high),
                    x2: startX,
                    y2: axis.y(low),
                    stroke: color,
                    "stroke-width": 1
                });

                var close = chart.svg.line({
                    x1: startX,
                    y1: axis.y(close),
                    x2: startX + chart.theme("ohlcBorderRadius"),
                    y2: axis.y(close),
                    stroke: color,
                    "stroke-width": 1
                });

                var open = chart.svg.line({
                    x1: startX,
                    y1: axis.y(open),
                    x2: startX - chart.theme("ohlcBorderRadius"),
                    y2: axis.y(open),
                    stroke: color,
                    "stroke-width": 1
                });

                this.addEvent(lowHigh, i, null);

                g.append(lowHigh);
                g.append(close);
                g.append(open);
            });

            return g;
        }
    }

    return OHLCBrush;
}, "chart.brush.core");
