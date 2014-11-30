jui.define("chart.widget.pin", [ "jquery" ], function($) {
    var PinWidget = function(chart, widget) {
        var g;
        var size = 6;

        this.draw = function() {
            if(widget.split == null) return;

            var self = this,
                color = this.chart.theme("pinBorderColor"),
                width = this.chart.theme("pinBorderWidth");

            g = chart.svg.group({}, function() {
                self.chart.svg.polygon({
                    fill: color
                })
                .point(size, 0)
                .point(size / 2, size)
                .point(0, 0);

                self.chart.svg.line({
                    stroke: color,
                    "stroke-width": width,
                    x1: size / 2,
                    y1: 0,
                    x2: size / 2,
                    y2: self.chart.height()
                });
            }).translate(this.chart.x() + widget.x(widget.split) - (size / 2), this.chart.y());

            return g;
        }

        this.drawSetup = function() {
            return $.extend(this.parent.drawSetup(), {
                split: null
            });
        }
    }

    return PinWidget;
}, "chart.widget.core");