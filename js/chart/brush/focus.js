jui.define("chart.brush.focus", [], function() {
    var FocusBrush = function(chart, brush) {
        var g;

        this.drawFocus = function(start, end) {
            var borderColor = chart.theme("focusBorderColor"),
                borderSize = chart.theme("focusBorderWidth"),
                bgColor = chart.theme("focusBackgroundColor"),
                bgOpacity = chart.theme("focusBackgroundOpacity");

            var height = chart.height();

            g = chart.svg.group({}, function() {
                var startX = start,
                    endX = end;

                chart.svg.line({
                    stroke: borderColor,
                    "stroke-width": borderSize,
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: height
                }).translate(startX, 0);

                chart.svg.rect({
                    width: Math.abs(endX - startX),
                    height: height,
                    fill: bgColor,
                    opacity: bgOpacity
                }).translate(startX, 0)

                chart.svg.line({
                    stroke: borderColor,
                    "stroke-width": borderSize,
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: height
                }).translate(endX, 0);
            }).translate(chart.x(), chart.y());

            return g;
        }

        this.draw = function() {

            var start = 0;
            var end = 0;

            if (brush.x.type == 'block') {
                start = brush.x(brush.start) - brush.x.rangeBand()/2;
                end = brush.x.rangeBand() * Math.abs(brush.end- brush.start);
            } else  {
                start = brush.x(brush.start);
                end = brush.x(brush.end);
            }

            return this.drawFocus(start, end);
        }

        this.drawSetup = function() {
            return this.getOptions({
                start: 0,
                end: 0
            });
        }
    }

    return FocusBrush;
}, "chart.brush.core");