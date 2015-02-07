jui.define("chart.brush.ohlc", [], function() {

    /**
     * @class chart.brush.ohlc 
     * 
     * implments ohlc brush 
     *  
     * @extends chart.brush.candlestick
     */
    var OHLCBrush = function(chart, axis, brush) {
        var g;

        this.drawBefore = function() {
            g = chart.svg.group();
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var startX = axis.x(i);

                var high = this.getValue(data, "high", 0),
                    low = this.getValue(data, "low", 0),
                    open = this.getValue(data, "open", 0),
                    close = this.getValue(data, "close", 0);

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
}, "chart.brush.candlestick");
