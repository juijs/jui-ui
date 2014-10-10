jui.define("chart.widget.cross", [ "util.base" ], function(_) {

    var CrossWidget = function(widget) {
        var self = this;
        var tw = 50, th = 18, ta = tw / 10; // 툴팁 넓이, 높이, 앵커 크기
        var g, xline, yline, xTooltip, yTooltip;

        function getTooltipData(data) {
            if(!_.typeCheck("function", widget.format)) return;
            return widget.format(data);
        }

        this.drawBefore = function(chart) {
            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                xline = chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: chart.width(),
                    y2: 0,
                    stroke: chart.theme("crossBorderColor"),
                    "stroke-width": chart.theme("crossBorderWidth"),
                    opacity: chart.theme("crossBorderOpacity")
                });

                yline = chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: chart.height(),
                    stroke: chart.theme("crossBorderColor"),
                    "stroke-width": chart.theme("crossBorderWidth"),
                    opacity: chart.theme("crossBorderOpacity")
                });

                // 포맷 옵션이 없을 경우, 툴팁을 생성하지 않음
                if(widget.format) {
                    yTooltip = chart.svg.group({}, function () {
                        chart.svg.polygon({
                            fill: chart.theme("crossBalloonBackgroundColor"),
                            "fill-opacity": chart.theme("crossBalloonOpacity"),
                            points: self.balloonPoints("left", tw, th, ta)
                        });

                        chart.svg.text({
                            "font-family": chart.theme("fontFamily"),
                            "font-size": chart.theme("crossBalloonFontSize"),
                            "fill": chart.theme("crossBalloonFontColor"),
                            "text-anchor": "middle",
                            x: tw / 2,
                            y: 12
                        });
                    }).translate(-(tw + ta), 0);

                    xTooltip = chart.svg.group({}, function () {
                        chart.svg.polygon({
                            fill: chart.theme("crossBalloonBackgroundColor"),
                            "fill-opacity": chart.theme("crossBalloonOpacity"),
                            points: self.balloonPoints("bottom", tw, th, ta)
                        });

                        chart.svg.text({
                            "font-family": chart.theme("fontFamily"),
                            "font-size": chart.theme("crossBalloonFontSize"),
                            "fill": chart.theme("crossBalloonFontColor"),
                            "text-anchor": "middle",
                            x: tw / 2,
                            y: 17
                        });
                    }).translate(0, chart.height() + ta);
                }

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

                if(yTooltip) {
                    yTooltip.translate(-(tw + ta), e.offsetY - top - (th / 2));
                    yTooltip.get(1).html(getTooltipData(widget.y.invert(e.offsetY - chart.y())));
                }

                if(xTooltip) {
                    xTooltip.translate(e.offsetX - left - (tw / 2), chart.height() + ta);
                    xTooltip.get(1).html(getTooltipData(widget.x.invert(e.offsetX - chart.x())));
                }
            });

            return g;
        }
    }

    return CrossWidget;
}, "chart.widget.core");