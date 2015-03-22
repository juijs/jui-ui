jui.define("chart.widget.zoomscroll", [ "util.base", "chart.builder" ], function (_, builder) {

    /**
     * @class chart.widget.zoomscroll
     * @extends chart.widget.core
     * @alias ScrollWidget
     * @requires util.base
     */
    var ZoomScrollWidget = function(chart, axis, widget) {
        var self = this,
            w = null,
            h = null,
            tick = 0,
            start = null,
            end = null,
            count = null;
        var l_rect = null,
            r_rect = null;

        function setDragEvent(group, isLeft) {
            var bg = group.get(0),
                ctrl = group.get(1);

            var isMove = false,
                mouseStart = 0,
                bgWidth = 0;

            ctrl.on("mousedown", function(e) {
                if(isMove) return;

                isMove = true;
                bgWidth = bg.attributes.width;
                mouseStart = e.x;
            });

            self.on("chart.mousemove", function(e) {
                if(!isMove) return;
                var dis = e.x - mouseStart;

                if(isLeft) {
                    if(dis > 0 && !preventDragAction()) return;

                    var tw = bgWidth + dis;

                    bg.attr({ width: tw });
                    ctrl.attr({ x1: tw, x2: tw });

                    start = Math.floor(tw / tick);
                } else {
                    if(dis < 0 && !preventDragAction()) return;

                    var tw = bgWidth - dis;

                    bg.attr({ width: tw, x: w - tw });
                    ctrl.attr({ x1: w - tw, x2: w - tw });

                    end = count - Math.floor(tw / tick);
                }
            });

            self.on("chart.mouseup", endZoomAction);
            self.on("bg.mouseup", endZoomAction);

            function endZoomAction() {
                if(!isMove) return;

                isMove = false;
                var axies = chart.axis();

                for(var i = 0; i < axies.length; i++) {
                    axies[i].zoom(start, end);
                }
            }

            function preventDragAction() {
                var l = l_rect.attributes.width,
                    r = r_rect.attributes.x;

                if(l <= r - tick) return true;
                return false;
            }
        }

        this.drawBefore = function() {
            count = axis.origin.length;
            start = axis.start;
            end = axis.end;
            w = chart.area("width");
            h = chart.theme("zoomScrollBackgroundSize");
            tick = w / count;
        }

        this.draw = function() {
            var bgColor = chart.theme("zoomScrollBackgroundColor"),
                focusColor = chart.theme("zoomScrollFocusColor"),
                brushColor = chart.theme("zoomScrollBrushColor");

            var c = builder(null, {
                width: w,
                height: h,
                padding: 0,
                axis: {
                    x: _.extend({ hide: true, line: false }, axis.get("x"), true),
                    y: _.extend({ hide: true, line: false }, axis.get("y"), true),
                    data: axis.origin
                },
                brush: {
                    type: "area",
                    target: widget.target,
                    line: false,
                    colors: [ brushColor ]
                },
                style: {
                    backgroundColor: "transparent"
                }
            });

            return chart.svg.group({}, function() {
                chart.svg.rect({
                    width: w,
                    height: h,
                    fill: bgColor,
                    "fill-opacity": 0.1,
                    stroke: bgColor,
                    "stroke-opacity": 0.1
                });

                chart.svg.image({
                    width: w,
                    height: h,
                    "xlink:href": c.svg.toDataURI()
                });

                chart.svg.group({}, function() {
                    var lw = start * tick;

                    l_rect = chart.svg.rect({
                        width: lw,
                        height: h,
                        fill: focusColor,
                        "fill-opacity": 0.3,
                        stroke: focusColor,
                        "stroke-opacity": 0.3
                    });

                    chart.svg.line({
                        x1: lw,
                        x2: lw,
                        y1: 0,
                        y2: h,
                        stroke: bgColor,
                        "stroke-width": 1.5,
                        "stroke-opacity": 0.3,
                        cursor: "w-resize"
                    });

                    setDragEvent(this, true);
                });

                chart.svg.group({}, function() {
                    var rw = (count - end) * tick;

                    r_rect = chart.svg.rect({
                        x: w - rw,
                        width: rw,
                        height: h,
                        fill: focusColor,
                        "fill-opacity": 0.3,
                        stroke: focusColor,
                        "stroke-opacity": 0.3
                    });

                    chart.svg.line({
                        x1: w - rw,
                        x2: w - rw,
                        y1: 0,
                        y2: h,
                        stroke: bgColor,
                        "stroke-width": 1.5,
                        "stroke-opacity": 0.3,
                        cursor: "e-resize"
                    });

                    setDragEvent(this, false);
                });
            }).translate(chart.area("x"), chart.area("y2") - h);
        }
    }

    ZoomScrollWidget.setup = function() {
        return {
            target : null
        }
    }

    return ZoomScrollWidget;
}, "chart.widget.core");