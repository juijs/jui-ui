jui.define("chart.brush.pin", [], function() {
    var PinBrush = function(chart, axis, brush) {
        var self = this, g,
            size = 6;

        this.draw = function() {
            var color = chart.theme("pinBorderColor"),
                width = chart.theme("pinBorderWidth");

            g = chart.svg.group({}, function() {
                var d = axis.x(brush.split),
                    x = d - (size / 2),
                    value = brush.format(axis.x.invert(d));

                chart.text({
                    "text-anchor": "middle",
                    "font-size": chart.theme("pinFontSize"),
                    "fill": chart.theme("pinFontColor")
                }, value).translate(x, -4);

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
                    y2: chart.area("height")
                }).translate(x, 0);
            });

            return g;
        }
    }

    PinBrush.setup = function() {
        return {
            split: 0,
            showValue: false,
            format: null
        };
    }

    return PinBrush;
}, "chart.brush.core");