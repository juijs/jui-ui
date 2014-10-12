jui.define("chart.widget.tooltip", [ "jquery" ], function($) {
    var TooltipWidget = function(widget) {
        var g, text, rect;
        var padding = 7, anchor = 7, textY = 14;
        var position = (widget.position) ? widget.position : "top";

        function printTooltip(chart, obj) {
            if(obj.target) {
                var t = chart.series(obj.target);

                text.attr({
                    "text-anchor": "middle",
                    y: textY + anchor
                });
                text.html(((t.text) ? t.text : obj.target) + ": " + obj.data[obj.target]);
            } else {
                var list = [];

                for(var i = 0; i < widget.target.length; i++) {
                    var key = widget.target[i],
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

        this.drawBefore = function(chart) {
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

        this.draw = function(chart) {
            var self = this,
                isActive = false,
                w, h;

            chart.on("mouseover", function(obj, e) {
                var brush = (widget.brush) ? widget.brush : 0;

                if(isActive || ($.inArray(obj.index, brush) == -1 && brush != obj.index)) return;

                // 툴팁 텍스트 출력
                printTooltip(chart, obj);

                var bbox = text.element.getBBox();
                w = bbox.width + (padding * 2);
                h = bbox.height + padding;

                text.attr({ x: w / 2 });
                rect.attr({ points: self.balloonPoints(position, w, h, anchor) });
                g.attr({ visibility: "visible" });

                isActive = true;
            });

            chart.on("mousemove", function(obj, e) {
                if(!isActive) return;

                var x = e.offsetX - (w / 2),
                    y = e.offsetY - h - anchor - (padding / 2);

                if(position == "left" || position == "right") {
                    y = e.offsetY - (h / 2) - (padding / 2);
                }

                if(position == "left") {
                    x = e.offsetX - w - anchor;
                } else if(position == "right") {
                    x = e.offsetX + anchor;
                } else if(position == "bottom") {
                    y = e.offsetY + (anchor * 2);
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
    }

    return TooltipWidget;
}, "chart.widget.core");