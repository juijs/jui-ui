jui.define("chart.widget.vscroll", [ "util.base" ], function (_) {

    /**
     * @class chart.widget.vscroll
     * @extends chart.widget.core
     * @alias ScrollWidget
     * @requires util.base
     */
    var VScrollWidget = function(chart, axis, widget) {
        var self = this;
        var thumbHeight = 0,
            thumbTop = 0,
            bufferCount = 0,
            dataLength = 0,
            totalHeight = 0,
            piece = 0,
            rate = 0 ;

        function setScrollEvent(thumb) {
            var isMove = false,
                mouseStart = 0,
                thumbStart = 0,
                axies = chart.axis();

            self.on("bg.mousedown", mousedown);
            self.on("chart.mousedown", mousedown);
            self.on("bg.mousemove", mousemove);
            self.on("bg.mouseup", mouseup);
            self.on("chart.mousemove", mousemove);
            self.on("chart.mouseup", mouseup);

            function mousedown(e) {
                if(isMove && thumb.element != e.target) return;

                isMove = true;
                mouseStart = e.bgY;
                thumbStart = thumbTop;
            }

            function mousemove(e) {
                if(!isMove) return;

                var gap = thumbStart + e.bgY - mouseStart;

                if(gap < 0) {
                    gap = 0;
                } else {
                    if(gap + thumbHeight > chart.area("height")) {
                        gap = chart.area("height") - thumbHeight;
                    }
                }

                thumb.translate(1, gap);
                thumbTop = gap;

                var startgap = gap * rate,
                    start = startgap == 0 ? 0 : Math.floor(startgap / piece);

                if(gap + thumbHeight == chart.area("height")) {
                    start += 1;
                }

                for(var i = 0; i < axies.length; i++) {
                    axies[i].zoom(start, start + bufferCount);
                }

                // 차트 렌더링이 활성화되지 않았을 경우
                if(!chart.isRender()) {
                    chart.render();
                }
            }

            function mouseup(e) {
                if(!isMove) return;

                isMove = false;
                mouseStart = 0;
                thumbStart = 0;
            }
        }

        this.drawBefore = function() {
			dataLength =  axis.origin.length;
			bufferCount = axis.buffer;
			piece = chart.area("height") / bufferCount;
			totalHeight = piece * dataLength;
			rate = totalHeight / chart.area("height");
            thumbHeight = chart.area("height") * (bufferCount / dataLength) + 2;
        }

        this.draw = function() {
            var bgSize = chart.theme("scrollBackgroundSize"),
                bgX = (widget.orient == "right") ? chart.area("x2") : chart.area("x") - bgSize;

            return chart.svg.group({}, function() {
                chart.svg.rect({
                    width: bgSize,
                    height: chart.area("height"),
                    fill: chart.theme("scrollBackgroundColor")
                });

                var thumb = chart.svg.rect({
                    width: bgSize - 2,
                    height: thumbHeight,
                    fill: chart.theme("scrollThumbBackgroundColor"),
                    stroke: chart.theme("scrollThumbBorderColor"),
                    cursor: "pointer",
                    "stroke-width": 1
                }).translate(1, thumbTop);

                // 차트 스크롤 이벤트
                setScrollEvent(thumb);

            }).translate(bgX, chart.area("y"));
        }
    }

    VScrollWidget.setup = function() {
        return {
            orient : "left"
        }
    }

    return VScrollWidget;
}, "chart.widget.core");