jui.define("chart.widget.tooltip", [ "jquery" ], function($) {
    var TooltipWidget = function(chart, widget) {
        var g, text, rect;
        var padding = 7, anchor = 7, textY = 14;
        var tspan = []; // 멀티라인일 경우, 하위 노드 캐시

        function printTooltip(obj) {
            if(obj.target && widget.all === false) {
                var t = chart.series(obj.target),
                    k = obj.target;

                // 위젯 포지션에 따른 별도 처리
                if(widget.position == "bottom") {
                    text.attr({ y: textY + anchor });
                }

                // 툴팁 값 설정
                var value = (obj.data[k]) ? ": " + obj.data[k] : "";

                // 옵션 키가 있을 경우
                if(widget.key != null) {
                    text.html(obj.data[widget.key] + value);
                } else {
                    text.html(((t.text) ? t.text : k) + value);
                }

                text.attr({ "text-anchor": "middle" });

            } else {
                var brush = chart.brush(obj.index);

                for(var i = 0; i < brush.target.length; i++) {
                    var key = brush.target[i],
                        t = chart.series(key),
                        x = padding,
                        y = (textY * i) + (padding * 2);

                    // 위젯 포지션에 따른 별도 처리
                    if(widget.position == "bottom") {
                        y = y + anchor;
                    }

                    var content = ((t.text) ? t.text : key) + ": " + obj.data[key];

                    if(!tspan[i]) {
                        var elem = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                        text.element.appendChild(elem);
                        tspan[i] = elem;
                    }

                    tspan[i].setAttribute("x", x);
                    tspan[i].setAttribute("y", y);
                    tspan[i].textContent = content;
                }

                text.attr({ "text-anchor": "inherit" });
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
                if(!obj.target && obj.data.length == 0) return;

                // 툴팁 텍스트 출력
                printTooltip(obj);

                var size = text.size();
                w = size.width + (padding * 2);
                h = size.height + padding;

                text.attr({ x: w / 2 });
                rect.attr({ points: self.balloonPoints(widget.position, w, h, anchor) });
                g.attr({ visibility: "visible" });

                isActive = true;
            });

            chart.on("mousemove", function(obj, e) {
                if(!isActive) return;

                var x = e.bgX - (w / 2),
                    y = e.bgY - h - anchor - (padding / 2);

                if(widget.position == "left" || widget.position == "right") {
                    y = e.bgY - (h / 2) - (padding / 2);
                }

                if(widget.position == "left") {
                    x = e.bgX - w - anchor;
                } else if(widget.position == "right") {
                    x = e.bgX + anchor;
                } else if(widget.position == "bottom") {
                    y = e.bgY + (anchor * 2);
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
                brush: [ 0 ],
                key: null
            }
        }
    }

    return TooltipWidget;
}, "chart.widget.core");