jui.define("chart.widget.cross", [ "util.base" ], function(_) {

    var CrossWidget = function(chart, widget) {
        var self = this;
        var tw = 50, th = 18, ta = tw / 10; // 툴팁 넓이, 높이, 앵커 크기
        var g, xline, yline, xTooltip, yTooltip;
        var tspan = [];

        function printTooltip(index, text, message) {
            if(!tspan[index]) {
                var elem = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                text.element.appendChild(elem);
                tspan[index] = elem;
            }

            tspan[index].textContent = widget.format(message);
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
                if(_.typeCheck("function", widget.format)) {
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
            chart.on("chart.mouseover", function(e) {
                g.attr({ visibility: "visible" });
            });

            chart.on("chart.mouseout", function(e) {
                g.attr({ visibility: "hidden" });
            });

            chart.on("chart.mousemove", function(e) {
                var left = e.chartX + 2,
                    top = e.chartY + 2;

                xline.attr({
                    y1: top,
                    y2: top
                });

                yline.attr({
                    x1: left,
                    x2: left
                });

                // 포맷 옵션이 없을 경우, 처리하지 않음
                if(_.typeCheck("function", widget.format)) {
                    if (yTooltip) {
                        yTooltip.translate(-(tw + ta), top - (th / 2));
                        printTooltip(0, yTooltip.get(1), self.widget.y.invert(top));
                    }

                    if (xTooltip) {
                        xTooltip.translate(left - (tw / 2), chart.height() + ta);
                        printTooltip(1, xTooltip.get(1), self.widget.x.invert(left));
                    }
                }
            });

            return g;
        }

        this.drawSetup = function() {
            var callback = function(value) {
                return chart.format(value);
            }

            return $.extend(this.parent.drawSetup(), {
                format: callback
            });
        }
    }

    return CrossWidget;
}, "chart.widget.core");