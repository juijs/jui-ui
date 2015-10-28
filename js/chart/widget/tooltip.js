jui.define("chart.widget.tooltip", [ "jquery", "util.base", "util.color" ], function($, _, ColorUtil) {
    var PADDING = 7, ANCHOR = 7, RATIO = 1.2;

    /**
     * @class chart.widget.tooltip
     * @extends chart.widget.core
     * @alias TooltipWidget
     * @requires jquery
     *
     */
    var TooltipWidget = function(chart, axis, widget) {
        var self = this,
            tooltips = {},
            lineHeight = 0;

        function getFormat(k, d) {
            var key = null,
                value = null;

            if(_.typeCheck("function", widget.format)) {
                var obj = self.format(d, k);

                if(_.typeCheck("object", obj)) {
                    key = obj.key;
                    value = obj.value;
                } else {
                    value = obj;
                }
            } else {
                if(k && !d) {
                    value = k;
                }

                if(k && d) {
                    key = k;
                    value = self.format(d[k]);
                }
            }

            return {
                key: key,
                value: value
            }
        }

        function printTooltip(obj) {
            var tooltip = tooltips[obj.brush.index],
                texts = tooltip.get(1).get(1),
                width = 0,
                height = 0,
                onlyValue = false;

            if(obj.dataKey && widget.all === false) {
                setTextInTooltip([ obj.dataKey ]);
            } else {
                setTextInTooltip(obj.brush.target);
            }

            function setTextInTooltip(targets) {
                for(var i = 0; i < targets.length; i++) {
                    var key = targets[i],
                        msg = getFormat(key, obj.data);

                    texts.get(i).attr({ x: PADDING });

                    if(msg.key) {
                        texts.get(i).get(0).text(msg.key);
                    } else {
                        texts.get(i).get(1).attr({ "text-anchor": "middle" });
                        onlyValue = true;
                    }

                    if(msg.value) {
                        texts.get(i).get(1).attr({ x: 0 }).text(msg.value);
                    }

                    width = Math.max(width, texts.get(i).size().width);
                }

                height = targets.length * lineHeight;
            }

            return {
                width: width + PADDING * 3,
                height: height + PADDING,
                onlyValue: onlyValue
            };
        }

        function existBrush(index) {
            var list = self.getIndexArray(self.widget.brush);

            return ($.inArray(index, list) == -1) ? false : true;
        }

        function getColorByKey(obj) {
            var targets = obj.brush.target;

            for(var i = 0; i < targets.length; i++) {
                if(targets[i] == obj.dataKey) {
                    return ColorUtil.lighten(self.chart.color(i, obj.brush.colors));
                }
            }

            return null;
        }

        function getTooltipXY(e, size, orient) {
            var x = e.bgX - (size.width / 2),
                y = e.bgY - size.height - ANCHOR - (PADDING / 2),
                lineX = 2;

            if(orient == "left" || orient == "right") {
                y = e.bgY - (size.height / 2) - (PADDING / 2);
            }

            if(orient == "left") {
                x = e.bgX - size.width - ANCHOR;
            } else if(orient == "right") {
                x = e.bgX + ANCHOR;
                lineX = -2;
            } else if(orient == "bottom") {
                y = e.bgY + (ANCHOR * 2);
            }

            return {
                x: x,
                y: y,
                c: lineX
            }
        }

        function setTooltipEvent() {
            var isActive = false,
                size = null,
                orient = null,
                axis = null;

            self.on("mouseover", function(obj, e) {
                if(isActive || !existBrush(obj.brush.index)) return;
                if(!obj.dataKey && !obj.data) return;

                // 툴팁 크기 가져오기
                size = printTooltip(obj);
                orient = widget.orient;
                axis = chart.axis(obj.brush.axis);

                // 툴팁 좌표 가져오기
                var xy = getTooltipXY(e, size, orient),
                    x = xy.x - chart.padding("left"),
                    y = xy.y - chart.padding("top");

                // 엑시스 범위를 넘었을 경우 처리
                if(widget.flip) {
                    if (orient == "left" && x < 0) {
                        orient = "right";
                    } else if (orient == "right" && x + size.width > axis.area("width")) {
                        orient = "left";
                    } else if (orient == "top" && y < 0) {
                        orient = "bottom";
                    } else if (orient == "bottom" && y + size.height > axis.area("height")) {
                        orient = "top";
                    }
                }

                // 툴팁 엘리먼트 가져오기
                var tooltip = tooltips[obj.brush.index],
                    line = tooltip.get(0),
                    rect = tooltip.get(1).get(0),
                    text = tooltip.get(1).get(1).translate(0, (orient != "bottom") ? lineHeight : lineHeight + ANCHOR),
                    borderColor = chart.theme("tooltipBorderColor") || getColorByKey(obj),
                    lineColor = chart.theme("tooltipLineColor") || getColorByKey(obj);

                rect.attr({
                    points: self.balloonPoints(orient, size.width, size.height, (widget.anchor) ? ANCHOR : null),
                    stroke: borderColor
                });
                line.attr({ stroke: lineColor });
                text.each(function(i, elem) {
                    elem.get(1).attr({ x: (size.onlyValue) ? size.width / 2 : size.width - PADDING });
                });
                tooltip.attr({ visibility: "visible" });

                isActive = true;
            });

            self.on("mousemove", function(obj, e) {
                if(!isActive) return;

                var tooltip = tooltips[obj.brush.index],
                    line = tooltip.get(0),
                    target = tooltip.get(1),
                    xy = getTooltipXY(e, size, orient);

                line.attr({
                    x1: e.bgX + xy.c,
                    y1: chart.padding("top") + axis.area("y"),
                    x2: e.bgX + xy.c,
                    y2: chart.padding("top") + axis.area("y2")
                });

                target.translate(xy.x, xy.y);
            });

            self.on("mouseout", function(obj, e) {
                if(!isActive) return;

                var tooltip = tooltips[obj.brush.index];
                tooltip.attr({ visibility: "hidden" });

                isActive = false;
            });
        }

        this.drawBefore = function() {
            lineHeight = chart.theme("tooltipFontSize") * RATIO;
        }

        this.draw = function() {
            var group = chart.svg.group(),
                list = this.getIndexArray(this.widget.brush);

            for(var i = 0; i < list.length; i++) {
                var brush = chart.get("brush", list[i]),
                    words = [ "" ];

                // 모든 타겟을 툴팁에 보여주는 옵션일 경우
                if(widget.all && brush.target.length > 1) {
                    for (var j = 1; j < brush.target.length; j++) {
                        words.push("");
                    }
                }

                tooltips[brush.index] = chart.svg.group({ visibility: "hidden" }, function() {
                    chart.svg.line({
                        "stroke-width": chart.theme("tooltipLineWidth"),
                        visibility: (widget.line) ? "visible" : "hidden"
                    });

                    chart.svg.group({}, function () {
                        chart.svg.polygon({
                            fill: chart.theme("tooltipBackgroundColor"),
                            "fill-opacity": chart.theme("tooltipBackgroundOpacity"),
                            "stroke-width": chart.theme("tooltipBorderWidth")
                        });

                        var text = chart.texts({
                            "font-size": chart.theme("tooltipFontSize"),
                            "fill": chart.theme("tooltipFontColor")
                        }, words, RATIO);

                        for(var i = 0; i < words.length; i++) {
                            text.get(i).append(chart.svg.tspan({ "text-anchor": "start", "font-weight": "bold", "x": PADDING }));
                            text.get(i).append(chart.svg.tspan({ "text-anchor": "end" }));
                        }
                    });
                });

                group.append(tooltips[brush.index]);
            }

            setTooltipEvent();

            return group;
        }
    }

    TooltipWidget.setup = function() {
        return {
            /** @cfg {"bottom"/"top"/"left"/"right"} Determines the side on which the tool tip is displayed (top, bottom, left, right). */
            orient: "top",
            /** @cfg {Boolean} [anchor=true] Remove tooltip's anchor */
            anchor: true,
            /** @cfg {Boolean} [all=false] Determines whether to show all values of row data.*/
            all: false,
            /** @cfg {Boolean} [line=false] Visible Guidelines. */
            line: false,
            /** @cfg {Boolean} [flip=false] When I went out of the area, reversing the tooltip. */
            flip: false,
            /** @cfg {Function} [format=null] Sets the format of the value that is displayed on the tool tip. */
            format: null,
            /** @cfg {Number} [brush=0] Specifies a brush index for which a widget is used. */
            brush: 0
        };
    }

    return TooltipWidget;
}, "chart.widget.core");