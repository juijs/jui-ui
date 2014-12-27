jui.define("chart.brush.candlestick", [], function() {

    var CandleStickBrush = function(chart, brush) {
        var g, width = 0, barWidth = 0, barPadding = 0;

        function getTargetData(data) {
            var target = {};

            for (var j = 0; j < brush.target.length; j++) {
                var k = brush.target[j],
                    t = chart.series(k);

                target[t.type] = data[k];
            }

            return target;
        }

        this.drawBefore = function() {
            g = chart.svg.group();
            width = brush.x.rangeBand();
            barWidth = width * 0.7;
            barPadding = barWidth / 2;
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var data = getTargetData(data),
                    startX = brush.x(i),
                    r = null,
                    l = null;

                var open = data.open,
                    close = data.close,
                    low = data.low,
                    high = data.high;

                if(open > close) { // 시가가 종가보다 높을 때 (Red)
                    var y = brush.y(open);

                    l = chart.svg.line({
                        x1: startX,
                        y1: brush.y(high),
                        x2: startX,
                        y2: brush.y(low),
                        stroke: chart.theme("candlestickInvertBorderColor"),
                        "stroke-width": 1
                    });

                    r = chart.svg.rect({
                        x : startX - barPadding,
                        y : y,
                        width : barWidth,
                        height : Math.abs(brush.y(close) - y),
                        fill : chart.theme("candlestickInvertBackgroundColor"),
                        stroke: chart.theme("candlestickInvertBorderColor"),
                        "stroke-width": 1
                    });

                } else {
                    var y = brush.y(close);

                    l = chart.svg.line({
                        x1: startX,
                        y1: brush.y(high),
                        x2: startX,
                        y2: brush.y(low),
                        stroke: chart.theme("candlestickBorderColor"),
                        "stroke-width":1
                    });

                    r = chart.svg.rect({
                        x : startX - barPadding,
                        y : y,
                        width : barWidth,
                        height : Math.abs(brush.y(open) - y),
                        fill : chart.theme("candlestickBackgroundColor"),
                        stroke: chart.theme("candlestickBorderColor"),
                        "stroke-width": 1
                    });
                }

                this.addEvent(r, i, null);

                g.append(l);
                g.append(r);
            });

            return g;
        }

        this.drawSetup = function() {
            return this.getOptions();
        }
    }

    return CandleStickBrush;
}, "chart.brush.core");
