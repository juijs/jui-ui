jui.define("chart.widget.zoom", [ "util.base" ], function(_) {

    var ZoomWidget = function(widget) {
        var count, tick;

        function setDragEvent(chart, thumb, bg) {
            var isMove = false,
                mouseStart = 0,
                thumbWidth = 0;

            chart.on("bg.mousedown", function(e) {
                if(isMove || chart.zoom().start > 0) return;

                isMove = true;
                mouseStart = e.offsetX;
            });

            chart.on("bg.mousemove", function(e) {
                if(!isMove) return;

                thumbWidth = e.offsetX - mouseStart;

                if(thumbWidth > 0) {
                    thumb.attr({
                        width: thumbWidth
                    });

                    thumb.translate(mouseStart, chart.y());
                } else {
                    thumb.attr({
                        width: Math.abs(thumbWidth)
                    });

                    thumb.translate(mouseStart + thumbWidth, chart.y());
                }
            });

            chart.addEvent(chart.root, "mouseup", function(e) {
                if(!isMove) return;

                var x = ((thumbWidth > 0) ? mouseStart : mouseStart + thumbWidth) - chart.padding("left");
                var start = Math.round(x / tick),
                    end = Math.round((x + Math.abs(thumbWidth)) / tick);

                // 차트 줌
                if(start < end) {
                    chart.zoom(start, end);
                    bg.attr({ "visibility": "visible" });
                }

                // 엘리먼트 및 데이터 초기화
                isMove = false;
                mouseStart = 0;

                thumb.attr({
                    width: 0
                });
            });
        }

        this.drawBefore = function(chart) {
            var opts = chart.options;

            count = (opts.data.length < opts.bufferCount) ? opts.data.length : opts.bufferCount;
            tick = chart.width() / count;
        }

        this.draw = function(chart) {
            var r = chart.svg.rect({
                autoRender: false,
                height: chart.height(),
                fill: chart.theme("zoomBackgroundColor"),
                opacity: 0.3
            });

            var bg = chart.svg.group({
                autoRender: false,
                visibility: "hidden"
            }, function() {
                chart.svg.rect({
                    width: chart.width(),
                    height: chart.height(),
                    fill: chart.theme("zoomFocusColor"),
                    opacity: 0.2
                });

                chart.svg.path({
                    d: "M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M16.9,15.5l-1.4,1.4L12,13.4l-3.5,3.5   l-1.4-1.4l3.5-3.5L7.1,8.5l1.4-1.4l3.5,3.5l3.5-3.5l1.4,1.4L13.4,12L16.9,15.5z",
                    fill: chart.theme("zoomFocusColor"),
                    cursor: "pointer"
                }).on("click", function(e) {
                    bg.attr({ visibility: "hidden" });
                    chart.page(1);
                }).translate(chart.width() - 12, -12)
            }).translate(chart.x(), chart.y());

            setDragEvent(chart, r, bg);
        }
    }

    return ZoomWidget;
}, "chart.draw");