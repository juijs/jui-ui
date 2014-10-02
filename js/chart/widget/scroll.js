jui.define("chart.widget.scroll", [ "util.base" ], function(_) {

    var ScrollWidget = function(widget) {
        var thumbWidth = 0,
            thumbLeft = 0,
            thumbLimit = 0;

        function setScrollEvent(chart, thumb) {
            var isMove = false,
                mouseStart = 0,
                thumbStart = 0,
                step = 0;

            thumb.on("mousedown", function(e) {
                if(isMove) return;

                isMove = true;
                mouseStart = e.offsetX;
                thumbStart = thumbLeft;
            });

            $("body").on("mousemove", function(e) {
                if(!isMove) return;

                var gap = thumbStart + e.offsetX - mouseStart;

                if(gap < 0) {
                    gap = 0;
                } else {
                    if(gap + thumbWidth > chart.width()) {
                        gap = chart.width() - thumbWidth;
                    }
                }

                if(step > thumbLimit) {
                    if(gap < thumbLeft) {
                        chart.prev();
                    } else {
                        chart.next();
                    }

                    step = 0;
                } else {
                    step += Math.abs(gap - thumbLeft);
                }

                thumb.translate(gap, 1);
                thumbLeft = gap;
            });

            $("body").on("mouseup", function(e) {
                if(!isMove) return;

                isMove = false;
                mouseStart = 0;
                thumbStart = 0;
            });
        }

        this.drawBefore = function(chart) {
            var opts = chart.options,
                limit = (opts.data.length - opts.bufferCount) * opts.shiftCount;

            thumbWidth = chart.width() / (opts.data.length / opts.bufferCount);
            thumbLimit = (chart.width() - thumbWidth) / limit;
        }

        this.draw = function(chart) {
            chart.svg.group({ autoRender: false }, function() {
                chart.svg.rect({
                    width: chart.width(),
                    height: 7,
                    fill: "#dcdcdc"
                });

                var thumb = chart.svg.rect({
                    width: thumbWidth,
                    height: 5,
                    fill: "#b2b2b2",
                    stroke: "#9f9fa4",
                    "stroke-width": 1
                }).translate(thumbLeft, 1);

                // 차트 스크롤 이벤트
                setScrollEvent(chart, thumb);

            }).translate(chart.x(), chart.y2());
        }
    }

    return ScrollWidget;
}, "chart.draw");