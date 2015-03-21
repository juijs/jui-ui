jui.define("chart.widget.zoom", [ "util.base" ], function(_) {

    /**
     * @class chart.widget.zoom
     * implements zoom widget
     * @extends chart.widget.core
     * @alias ZoomWidget
     * @requires util.base
     *
     */
    var ZoomWidget = function() {
        var self = this,
            top = 0,
            left = 0;

        function setDragEvent(axisIndex, thumb, bg) {
            var axis = self.chart.axis(axisIndex),
                isMove = false,
                mouseStart = 0,
                thumbWidth = 0;

            self.on("axis.mousedown", function(e) {
                if(isMove) return;

                isMove = true;
                mouseStart = e.bgX;
            }, axisIndex);

            self.on("axis.mousemove", function(e) {
                if(!isMove) return;

                thumbWidth = e.bgX - mouseStart;

                if(thumbWidth > 0) {
                    thumb.attr({
                        width: thumbWidth
                    });

                    thumb.translate(mouseStart, top + axis.area("y"));
                } else {
                    thumb.attr({
                        width: Math.abs(thumbWidth)
                    });

                    thumb.translate(mouseStart + thumbWidth, top + axis.area("y"));
                }
            }, axisIndex);

            self.on("axis.mouseup", endZoomAction, axisIndex);
            self.on("chart.mouseup", endZoomAction);
            self.on("bg.mouseup", endZoomAction);
            self.on("bg.mouseout", endZoomAction);

            function endZoomAction() {
                isMove = false;
                if(thumbWidth == 0) return;

                var tick = axis.area("width") / (axis.end - axis.start),
                    x = ((thumbWidth > 0) ? mouseStart : mouseStart + thumbWidth) - left,
                    start = Math.floor(x / tick) + axis.start,
                    end = Math.ceil((x + Math.abs(thumbWidth)) / tick) + axis.start;

                // 차트 줌
                if(start < end) {
                    axis.zoom(start, end);
                    bg.attr({ "visibility": "visible" });

                    // 차트 렌더링이 활성화되지 않았을 경우
                    if(!self.chart.isRender()) {
                        self.chart.render();
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

        this.drawSection = function(axisIndex) {
            var axis = this.chart.axis(axisIndex),
                cw = axis.area("width"),
                ch = axis.area("height"),
                r = 12;

            return this.chart.svg.group({}, function() {
                var thumb = self.chart.svg.rect({
                    height: ch,
                    fill: self.chart.theme("zoomBackgroundColor"),
                    opacity: 0.3
                });

                var bg = self.chart.svg.group({
                    visibility: "hidden"
                }, function() {
                    self.chart.svg.rect({
                        width: cw,
                        height: ch,
                        fill: self.chart.theme("zoomFocusColor"),
                        opacity: 0.2
                    });

                    self.chart.svg.group({
                        cursor: "pointer"
                    }, function() {
                        self.chart.svg.circle({
                            r: r,
                            cx: cw,
                            cy: 0,
                            opacity: 0
                        });

                        self.chart.svg.path({
                            d: "M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M16.9,15.5l-1.4,1.4L12,13.4l-3.5,3.5 l-1.4-1.4l3.5-3.5L7.1,8.5l1.4-1.4l3.5,3.5l3.5-3.5l1.4,1.4L13.4,12L16.9,15.5z",
                            fill: self.chart.theme("zoomFocusColor")
                        }).translate(cw - r, -r);
                    }).on("click", function(e) {
                        bg.attr({ visibility: "hidden" });
                        axis.screen(1);

                        // 차트 렌더링이 활성화되지 않았을 경우
                        if(!self.chart.isRender()) {
                            self.chart.render();
                        }
                    });

                }).translate(left + axis.area("x"), top + axis.area("y"));

                setDragEvent(axisIndex, thumb, bg);
            });
        }

        this.drawBefore = function() {
            top = this.chart.padding("top");
            left = this.chart.padding("left");
        }

        this.draw = function() {
            var g = this.chart.svg.group(),
                count = this.chart.axis().length;

            for(var i = 0; i < count; i++) {
                g.append(this.drawSection(i));
            }

            return g;
        }
    }

    return ZoomWidget;
}, "chart.widget.core");