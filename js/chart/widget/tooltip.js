jui.define("chart.widget.tooltip", [ "jquery" ], function($) {
    /**
     * @class chart.widget.tooltip
     * implements tooltip widget
     * @extends chart.widget.core
     * @alias TooltipWidget
     * @requires jquery
     *
     */
    var TooltipWidget = function(chart, axis, widget) {
        var self = this;
        var g, text, rect;
        var padding = 7, anchor = 7, textY = 14;
        var tspan = []; // 멀티라인일 경우, 하위 노드 캐시

        function setMessage(index, message) {
            if(!tspan[index]) {
                var elem = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                text.element.appendChild(elem);
                tspan[index] = elem;
            }

            tspan[index].textContent = message;
        }

        function getFormat(key, value, data) {
            if(typeof(widget.format) == "function") {
                return self.format(key, value, data);
            } else {
                if (!value) {
                    return key;
                }

                return key + ": " + self.format(value);
            }
        }

        function printTooltip(obj) {
            if(obj.dataKey && widget.all === false) {
                var t = chart.get("series", obj.dataKey),
                    k = obj.dataKey,
                    d = (obj.data != null) ? obj.data[k] : null;

                // 위젯 포지션에 따른 별도 처리
                if(widget.orient == "bottom") {
                    text.attr({ y: textY + anchor });
                }

                // 툴팁 값 설정
                var message = getFormat((t.text) ? t.text : k, d, obj.data);
                setMessage(0, message);

                text.attr({ "text-anchor": "middle" });
            } else {
                var brush = obj.brush;

                for(var i = 0; i < brush.target.length; i++) {
                    var key = brush.target[i],
                        t = chart.get("series", key),
                        x = padding,
                        y = (textY * i) + (padding * 2),
                        d = (obj.data != null) ? obj.data[key] : null;

                    // 위젯 포지션에 따른 별도 처리
                    if(widget.orient == "bottom") {
                        y = y + anchor;
                    }

                    var message = getFormat((t.text) ? t.text : key, d, obj.data);
                    setMessage(i, message);

                    tspan[i].setAttribute("x", x);
                    tspan[i].setAttribute("y", y);
                }

                text.attr({ "text-anchor": "inherit" });
            }
        }

        function existBrush(index) {
            var list = self.getIndexArray(self.widget.brush);

            return ($.inArray(index, list) == -1) ? false : true;
        }

        this.drawBefore = function() {
            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                rect = chart.svg.polygon({
                    fill: chart.theme("tooltipBackgroundColor"),
                    "fill-opacity": chart.theme("tooltipBackgroundOpacity"),
                    stroke: chart.theme("tooltipBorderColor"),
                    "stroke-width": 1
                });

                text = chart.text({
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

            this.on("mouseover", function(obj, e) {
                if(isActive || !existBrush(obj.brush.index)) return;
                if(!obj.dataKey && !obj.data) return;

                // 툴팁 텍스트 출력
                printTooltip(obj);

                var size = text.size();
                w = size.width + (padding * 2);
                h = size.height + padding;

                text.attr({ x: w / 2 });
                rect.attr({ points: self.balloonPoints(widget.orient, w, h, anchor) });
                g.attr({ visibility: "visible" });

                isActive = true;
            });

            this.on("mousemove", function(obj, e) {
                if(!isActive) return;

                var x = e.bgX - (w / 2),
                    y = e.bgY - h - anchor - (padding / 2);

                if(widget.orient == "left" || widget.orient == "right") {
                    y = e.bgY - (h / 2) - (padding / 2);
                }

                if(widget.orient == "left") {
                    x = e.bgX - w - anchor;
                } else if(widget.orient == "right") {
                    x = e.bgX + anchor;
                } else if(widget.orient == "bottom") {
                    y = e.bgY + (anchor * 2);
                }

                g.translate(x, y);
            });

            this.on("mouseout", function(obj, e) {
                if(!isActive) return;

                g.attr({ visibility: "hidden" });
                isActive = false;
            });

            return g;
        }
    }

    TooltipWidget.setup = function() {
        return {
            /** @cfg {"bottom"/"top"/"left"/"right" } Determines the side on which the tool tip is displayed (top, bottom, left, right). */
            orient: "top",
            /** @cfg {Boolean} [all=false] Determines whether to show all values of row data.*/
            all: false,
            /** @cfg {Function} [format=null] Sets the format of the value that is displayed on the tool tip. */
            format: null,
            /** @cfg {Number} [brush=0] Specifies a brush index for which a widget is used. */
            brush: 0
        };
    }

    return TooltipWidget;
}, "chart.widget.core");