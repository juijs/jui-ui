jui.define("chart.brush.pin", [], function() {
    var PinBrush = function(chart, brush) {
        var g;
        var size = 6;

        this.draw = function() {
            var color = chart.theme("pinBorderColor"),
                width = chart.theme("pinBorderWidth");

            g = chart.svg.group({}, function() {
                var x = brush.x(brush.split) - (size / 2);

                chart.svg.polygon({
                    fill: color
                })
                .point(size, 0)
                .point(size / 2, size)
                .point(0, 0)
                .translate(x, 0);

                chart.svg.line({
                    stroke: color,
                    "stroke-width": width,
                    x1: size / 2,
                    y1: 0,
                    x2: size / 2,
                    y2: chart.height()
                }).translate(x, 0);
            });

            return g;
        }

        this.drawSetup = function() {
            return this.getOptions({
                split: 0
            });
        }
    }

    return PinBrush;
}, "chart.brush.core");