jui.define("chart.brush.ohlc", [], function() {

    var OHLCBrush = function(chart, brush) {
        var g, count;

        function getTargets(chart) {
            var target = {};

            for (var j = 0; j < brush.target.length; j++) {
                var t = chart.series(brush.target[j]);
                target[t.type] = t;
            }

            return target;
        }

        this.drawBefore = function() {
            g = chart.svg.group();
            count = chart.data().length;
        }

        this.draw = function() {
            var targets = getTargets(chart);

            for (var i = 0; i < count; i++) {
                var startX = brush.x(i);

                var open = targets.open.data[i],
                    close = targets.close.data[i],
                    low =  targets.low.data[i],
                    high = targets.high.data[i],
                    color = (open > close) ? chart.theme("ohlcInvertBorderColor") : chart.theme("ohlcBorderColor");

                var lowHigh = chart.svg.line({
                    x1: startX,
                    y1: brush.y(high),
                    x2: startX,
                    y2: brush.y(low),
                    stroke: color,
                    "stroke-width": 1
                });

                var close = chart.svg.line({
                    x1: startX,
                    y1: brush.y(close),
                    x2: startX + chart.theme("ohlcBorderRadius"),
                    y2: brush.y(close),
                    stroke: color,
                    "stroke-width": 1
                });

                var open = chart.svg.line({
                    x1: startX,
                    y1: brush.y(open),
                    x2: startX - chart.theme("ohlcBorderRadius"),
                    y2: brush.y(open),
                    stroke: color,
                    "stroke-width": 1
                });

                this.addEvent(lowHigh, null, i);

                g.append(lowHigh);
                g.append(close);
                g.append(open);
            }

            return g;
        }

        this.drawSetup = function() {
            return {}
        }
    }

    return OHLCBrush;
}, "chart.brush.core");
