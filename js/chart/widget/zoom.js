jui.define("chart.widget.zoom", [ "util.base" ], function(_) {

    var ZoomWidget = function(chart, widget) {
        var axis, count, tick;

        function setDragEvent(self, thumb, bg) {
            var isMove = false,
                mouseStart = 0,
                thumbWidth = 0;

            self.on("chart.mousedown", function(e) {
                if(isMove || axis.start > 0) return;

                isMove = true;
                mouseStart = e.bgX;
            });

            self.on("chart.mousemove", function(e) {
                if(!isMove) return;

                thumbWidth = e.bgX - mouseStart;

                if(thumbWidth > 0) {
                    thumb.attr({
                        width: thumbWidth
                    });

                    thumb.translate(mouseStart, chart.area("y"));
                } else {
                    thumb.attr({
                        width: Math.abs(thumbWidth)
                    });

                    thumb.translate(mouseStart + thumbWidth, chart.area("y"));
                }
            });

            self.on("chart.mouseup", endZoomAction);
            self.on("bg.mouseup", endZoomAction);
            self.on("bg.mouseout", endZoomAction);

            function endZoomAction() {
                isMove = false;
                if(thumbWidth == 0) return;

                var x = ((thumbWidth > 0) ? mouseStart : mouseStart + thumbWidth) - chart.padding("left");
                var start = Math.floor(x / tick),
                    end = Math.ceil((x + Math.abs(thumbWidth)) / tick);

                // 차트 줌
                if(start < end) {
                    chart.zoom(start, end);
                    bg.attr({ "visibility": "visible" });

                    // 차트 렌더링이 활성화되지 않았을 경우
                    if(!chart.isRender()) {
                        chart.render();
                    }
                }

                resetDragStatus();
            }

            function resetDragStatus() { // 엘리먼트 및 데이터 초기화
                isMove = false;
                mouseStart = 0;
                thumbWidth = 0;

                thumb.attr({
                    width: 0
                });
            }
        }

        this.drawBefore = function() {
            axis = chart.axis(chart.options.axisIndex);
            count = (axis.data.length < axis.buffer && axis.data.length > 0) ? axis.data.length : axis.buffer;
            tick = chart.area("width") / count;
        }

        this.draw = function() {
            var self = this;
            var cw = chart.area("width"),
                ch = chart.area("height"),
                r = 12;

            return chart.svg.group({}, function() {
                var thumb = chart.svg.rect({
                    height: ch,
                    fill: chart.theme("zoomBackgroundColor"),
                    opacity: 0.3
                });

                var bg = chart.svg.group({
                    visibility: "hidden"
                }, function() {
                    chart.svg.rect({
                        width: cw,
                        height: ch,
                        fill: chart.theme("zoomFocusColor"),
                        opacity: 0.2
                    });

                    chart.svg.group({
                        cursor: "pointer"
                    }, function() {
                        chart.svg.circle({
                            r: r,
                            cx: cw,
                            cy: 0,
                            opacity: 0
                        });

                        chart.svg.path({
                            d: "M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M16.9,15.5l-1.4,1.4L12,13.4l-3.5,3.5   l-1.4-1.4l3.5-3.5L7.1,8.5l1.4-1.4l3.5,3.5l3.5-3.5l1.4,1.4L13.4,12L16.9,15.5z",
                            fill: chart.theme("zoomFocusColor")
                        }).translate(cw - r, -r);
                    }).on("click", function(e) {
                        bg.attr({ visibility: "hidden" });
                        chart.page(1);

                        // 차트 렌더링이 활성화되지 않았을 경우
                        if(!chart.isRender()) {
                            chart.render();
                        }
                    });

                }).translate(chart.area("x"), chart.area("y"));

                setDragEvent(self, thumb, bg);
            });
        }

        this.drawSetup = function() {
            return this.getOptions();
        }
    }

    return ZoomWidget;
}, "chart.widget.core");