jui.define("chart.widget.tooltip", [ "jquery" ], function($) {
    var TooltipWidget = function(chart, widget) {
        var g, text, rect;
        var padding = 7, anchor = 7, textY = 14;

        function printTooltip(chart, obj, brushIndex) {
            if(obj.target && widget.all === false) {
                var t = chart.series(obj.target);

                // 위젯 포지션에 따른 별도 처리
                if(widget.position == "bottom") {
                    text.attr({ y: textY + anchor });
                }

                text.attr({ "text-anchor": "middle" });
                text.html(((t.text) ? t.text : obj.target) + ": " + obj.data[obj.target]);
            } else {
                var list = [],
                    brush = chart.brush(brushIndex);

                for(var i = 0; i < brush.target.length; i++) {
                    var key = brush.target[i],
                        t = chart.series(key),
                        x = padding,
                        y = (textY * i) + (padding * 2);

                    // 위젯 포지션에 따른 별도 처리
                    if(widget.position == "bottom") {
                        y = y + anchor;
                    }

                    list.push("<tspan x='" + x + "' y='" + y + "'>" +
                        ((t.text) ? t.text : key) + ": " + obj.data[key] +
                    "</tspan>");
                }

                text.attr({ "text-anchor": "inherit" });
                text.html(list.join(""));
            }
        }

        this.drawBefore = function() {
            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                rect = chart.svg.polygon({
                    fill: chart.theme("tooltipBackgroundColor"),
                    "fill-opacity": chart.theme("tooltipOpacity"),
                    stroke: chart.theme("tooltipBorderColor"),
                    "stroke-width": 1
                });

                text = chart.svg.text({
                    "font-family": chart.theme("fontFamily"),
                    "font-size": chart.theme("tooltipFontSize"),
                    "fill": chart.theme("tooltipFontColor"),
                    y: textY
                });
            });
        }

        this.draw = function() {
            var self = this,
                isActive = false,
                w, h;

            chart.on("mouseover", function(obj, e) {
                if(isActive || ($.inArray(obj.index, widget.brush) == -1 && widget.brush != obj.index)) return;

                // 툴팁 텍스트 출력
                printTooltip(chart, obj, widget.brush);

                var bbox = text.element.getBBox();
                w = bbox.width + (padding * 2);
                h = bbox.height + padding;

                text.attr({ x: w / 2 });
                rect.attr({ points: self.balloonPoints(widget.position, w, h, anchor) });
                g.attr({ visibility: "visible" });

                isActive = true;
            });

            chart.on("mousemove", function(obj, e) {
                if(!isActive) return;

                var offset = self.offset(e);
                var x = offset.x - (w / 2),
                    y = offset.y - h - anchor - (padding / 2);

                if(widget.position == "left" || widget.position == "right") {
                    y = offset.y - (h / 2) - (padding / 2);
                }

                if(widget.position == "left") {
                    x = offset.x - w - anchor;
                } else if(widget.position == "right") {
                    x = offset.x + anchor;
                } else if(widget.position == "bottom") {
                    y = offset.y + (anchor * 2);
                }

                g.translate(x, y);
            });

            chart.on("mouseout", function(obj, e) {
                if(!isActive) return;

                g.attr({ visibility: "hidden" });
                isActive = false;
            });

            return g;
        }

        this.drawSetup = function() {
            return {
                position: "top", // or bottom, left, right
                all: false,
                brush: 0
            }
        }
    }

    return TooltipWidget;
}, "chart.widget.core");