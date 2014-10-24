jui.define("chart.widget.cross", [ "util.base" ], function(_) {

    var CrossWidget = function(chart, widget) {
        var self = this;
        var tw = 50, th = 18, ta = tw / 10; // 툴팁 넓이, 높이, 앵커 크기
        var g, xline, yline, xTooltip, yTooltip;

        function getTooltipData(data) {
            if(!_.typeCheck("function", self.widget.format)) return;
            return self.widget.format(data);
        }

        this.drawBefore = function() {
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
                if(_.typeCheck("function", self.widget.format)) {
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

        this.draw = function() {
            chart.on("bg.mouseover", function(e) {
                g.attr({ visibility: "visible" });
            });

            chart.on("bg.mouseout", function(e) {
                g.attr({ visibility: "hidden" });
            });

            chart.on("bg.mousemove", function(e) {
                var left = chart.x() - 2,
                    top = chart.y() - 2,
                    offset = self.offset(e);

                xline.attr({
                    y1: offset.y - top,
                    y2: offset.y - top
                });

                yline.attr({
                    x1: offset.x - left,
                    x2: offset.x - left
                });

                if(yTooltip) {
                    yTooltip.translate(-(tw + ta), offset.y - top - (th / 2));
                    yTooltip.get(1).html(getTooltipData(self.widget.y.invert(offset.y - chart.y())));
                }

                if(xTooltip) {
                    xTooltip.translate(offset.x - left - (tw / 2), chart.height() + ta);
                    xTooltip.get(1).html(getTooltipData(self.widget.x.invert(offset.x - chart.x())));
                }
            });

            return g;
        }

        this.drawSetup = function() {
            return {
                format: null
            }
        }
    }

    return CrossWidget;
}, "chart.widget.core");