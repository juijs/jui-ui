jui.define("chart.brush.pin", [], function() {
    var PinBrush = function(chart, axis, brush) {
        var self = this;

        this.draw = function() {
            var size = brush.size,
                color = chart.theme("pinBorderColor"),
                width = chart.theme("pinBorderWidth");

            var g = chart.svg.group({}, function() {
                var d = axis.x(brush.split),
                    x = d - (size / 2),
                    value = self.format(axis.x.invert(d));

                chart.text({
                    "text-anchor": "middle",
                    "font-size": chart.theme("pinFontSize"),
                    "fill": chart.theme("pinFontColor")
                }, value).translate(d, -4);

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
            size: 6,
            split: 0,
            showValue: false,
            format: null
        };
    }

    return PinBrush;
}, "chart.brush.core");