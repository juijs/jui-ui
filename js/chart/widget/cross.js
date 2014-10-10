jui.define("chart.widget.cross", [ "util.base" ], function(_) {

    var CrossWidget = function(widget) {
        var self = this;
        var tw = 50, th = 18, ta = tw / 10; // 툴팁 넓이, 높이, 앵커 크기
        var g, xline, yline, xTooltip, yTooltip;

        this.drawBefore = function(chart) {
            // SVG 차트 기본 속성
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

                xTooltip = chart.svg.group({}, function() {
                    chart.svg.polygon({
                        fill: "black",
                        'fill-opacity' : 0.5,                        
                        points: self.balloonPoints("top", tw, th, ta)
                    });

                    chart.svg.text({
                        "font-family" : chart.theme("fontFamily"),
                        "font-size" : chart.theme("tooltipFontSize"),
                        "fill" : "white",
                        'text-anchor' : 'middle',                        
                        x: tw/2,
                        y: 13
                    });
                });

                yTooltip = chart.svg.group({}, function() {
                    chart.svg.polygon({
                        fill: "black",
                        'fill-opacity' : 0.5,
                        points: self.balloonPoints("bottom", tw, th, ta)
                    });

                    chart.svg.text({
                        "font-family" : chart.theme("fontFamily"),
                        "font-size" : chart.theme("tooltipFontSize"),
                        "fill" : "white",
                        'text-anchor' : 'middle',
                        x: tw/2,
                        y: 18
                    });
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
                var left = chart.x() - 2,
                    top = chart.y() - 2;

                xline.attr({
                    y1: e.offsetY - top,
                    y2: e.offsetY - top
                });

                yline.attr({
                    x1: e.offsetX - left,
                    x2: e.offsetX - left
                });

                xTooltip.translate(-(tw + ta), e.offsetY - top - (th / 2));
                yTooltip.translate(e.offsetX - left - (tw / 2), chart.height() + ta);

                // 텍스트 넣기
                xTooltip.get(1).html(widget.y.invert(1000));
                yTooltip.get(1).html(widget.x.invert(500));
            });

            return g;
        }
    }

    return CrossWidget;
}, "chart.widget.core");