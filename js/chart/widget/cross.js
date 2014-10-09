jui.define("chart.widget.cross", [ "util.base" ], function(_) {

    var CrossWidget = function(widget) {
        var g, xline, yline;

        this.drawBefore = function(chart) {
            console.log(widget);

            chart.svg.root.attr({ cursor: "none" });

            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                xline = chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: chart.width(),
                    y2: 0,
                    stroke: "#a9a9a9",
                    "stroke-width": 1,
                    opacity: 0.8
                });

                yline = chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: chart.height(),
                    stroke: "#a9a9a9",
                    "stroke-width": 1,
                    opacity: 0.8
                });
            }).translate(chart.x(), chart.y());
        }

        this.draw = function(chart) {
            chart.on("bg.mouseover", function(e) {
                g.attr({ visibility: "visible" });
            });

            chart.on("bg.mouseout", function(e) {
                g.attr({ visibility: "hidden" });
            });

            chart.on("bg.mousemove", function(e) {
                var left = chart.padding("left") - 2,
                    top = chart.padding("top") - 2;

                xline.attr({
                    y1: e.offsetY - top,
                    y2: e.offsetY - top
                });

                yline.attr({
                    x1: e.offsetX - left,
                    x2: e.offsetX - left
                });
            });

            return g;
        }
    }

    return CrossWidget;
}, "chart.draw");