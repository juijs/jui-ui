jui.define("chart.widget.cross", [ "util.base" ], function(_) {


    /**
     * @class chart.widget.cross
     * implements cross widget
     * @extends chart.widget.core
     * @alias CoreWidget
     * @requires util.base
     *
     */
    var CrossWidget = function(chart, axis, widget) {
        var self = this;
        var tw = 50, th = 18, ta = tw / 10; // 툴팁 넓이, 높이, 앵커 크기
        var pl = 0, pt = 0; // 엑시스까지의 여백
        var g, xline, yline, xTooltip, yTooltip;
        var tspan = [];

        function printTooltip(index, text, message) {
            if(!tspan[index]) {
                var elem = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                text.element.appendChild(elem);
                tspan[index] = elem;
            }

            tspan[index].textContent = message;
        }

        this.drawBefore = function() {
            // 위젯 옵션에 따라 엑시스 변경
            axis = this.chart.axis(widget.axis);

            // 엑시스 여백 값 가져오기
            pl = chart.padding("left") + axis.area("x");
            pt = chart.padding("top") + axis.area("y");

            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                // 포맷 옵션이 없을 경우, 툴팁을 생성하지 않음
                if(_.typeCheck("function", widget.yFormat)) {
                    xline = chart.svg.line({
                        x1: 0,
                        y1: 0,
                        x2: axis.area("width"),
                        y2: 0,
                        stroke: chart.theme("crossBorderColor"),
                        "stroke-width": chart.theme("crossBorderWidth"),
                        opacity: chart.theme("crossBorderOpacity")
                    });

                    yTooltip = chart.svg.group({}, function () {
                        chart.svg.polygon({
                            fill: chart.theme("crossBalloonBackgroundColor"),
                            "fill-opacity": chart.theme("crossBalloonBackgroundOpacity"),
                            points: self.balloonPoints("left", tw, th, ta)
                        });

                        chart.text({
                            "font-size": chart.theme("crossBalloonFontSize"),
                            "fill": chart.theme("crossBalloonFontColor"),
                            "text-anchor": "middle",
                            x: tw / 2,
                            y: 12
                        });
                    }).translate(-(tw + ta), 0);
                }

                if(_.typeCheck("function", widget.xFormat)) {
                    yline = chart.svg.line({
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: axis.area("height"),
                        stroke: chart.theme("crossBorderColor"),
                        "stroke-width": chart.theme("crossBorderWidth"),
                        opacity: chart.theme("crossBorderOpacity")
                    });

                    xTooltip = chart.svg.group({}, function () {
                        chart.svg.polygon({
                            fill: chart.theme("crossBalloonBackgroundColor"),
                            "fill-opacity": chart.theme("crossBalloonBackgroundOpacity"),
                            points: self.balloonPoints("bottom", tw, th, ta)
                        });

                        chart.text({
                            "font-size": chart.theme("crossBalloonFontSize"),
                            "fill": chart.theme("crossBalloonFontColor"),
                            "text-anchor": "middle",
                            x: tw / 2,
                            y: 17
                        });
                    }).translate(0, axis.area("height") + ta);
                }
            }).translate(pl, pt);
        }

        this.draw = function() {
            this.on("axis.mouseover", function(e) {
                g.attr({ visibility: "visible" });
            }, widget.axis);

            this.on("axis.mouseout", function(e) {
                g.attr({ visibility: "hidden" });
            }, widget.axis);

            this.on("axis.mousemove", function(e) {
                var left = e.bgX - pl,
                    top = e.bgY - pt + 2;

                if(xline) {
                    xline.attr({
                        y1: top,
                        y2: top
                    });
                }

                if(yline) {
                    yline.attr({
                        x1: left,
                        x2: left
                    });
                }

                // 포맷 옵션이 없을 경우, 처리하지 않음
                if(yTooltip) {
                    yTooltip.translate(-(tw + ta), top - (th / 2));

                    var value = axis.y.invert(e.chartY),
                        message = widget.yFormat.call(self.chart, value);
                    printTooltip(0, yTooltip.get(1), message);
                }

                if(xTooltip) {
                    xTooltip.translate(left - (tw / 2), axis.area("height") + ta);

                    var value = axis.x.invert(e.chartX),
                        message = widget.xFormat.call(self.chart, value);
                    printTooltip(1, xTooltip.get(1), message);
                }
            }, widget.axis);

            return g;
        }
    }

    CrossWidget.setup = function() {
        return {
            axis: 0,
            /**
             * @cfg {Function} [xFormat=null] Sets the format for the value on the X axis shown on the tooltip.
             */            
            xFormat: null,
            /**
             * @cfg {Function} [yFormat=null] Sets the format for the value on the Y axis shown on the tooltip.
             */
            yFormat: null
        };
    }

    return CrossWidget;
}, "chart.widget.core");