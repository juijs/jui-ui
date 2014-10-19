jui.define("chart.widget.scroll", [ "util.base" ], function (_) {

    var ScrollWidget = function(widget) {
        var self = this;
        var thumbWidth = 0,
            thumbLeft = 0,
            bufferCount = 0,
            dataLength = 0,
            totalWidth = 0,
            piece = 0,
            rate = 0 ;

        function setScrollEvent(chart, thumb) {
            var isMove = false,
                mouseStart = 0,
                thumbStart = 0;

            thumb.on("mousedown", function(e) {
                if(isMove) return;

                var offset = self.offset(chart, e);

                isMove = true;
                mouseStart = offset.x;
                thumbStart = thumbLeft;
            });

            chart.addEvent("body", "mousemove", function(e) {
                if(!isMove) return;

                var offset = self.offset(chart, e),
                    gap = thumbStart + offset.x - mouseStart;

                if(gap < 0) {
                    gap = 0;
                } else {
                    if(gap + thumbWidth > chart.width()) {
                        gap = chart.width() - thumbWidth;
                    }
                }

                thumb.translate(gap, 1);
                thumbLeft = gap;

                var startgap = gap * rate,
                    start = startgap == 0 ? 0 : Math.floor(startgap / piece);
                
                if (gap + thumbWidth == chart.width()) {
                	start += 1;
                }

               	chart.zoom(start, start + bufferCount);
            });

            chart.addEvent("body", "mouseup", function(e) {
                if(!isMove) return;

                isMove = false;
                mouseStart = 0;
                thumbStart = 0;
            });
        }

        this.drawBefore = function(chart) {
            var opts = chart.options;

			dataLength =  opts.data.length; 
			bufferCount = opts.bufferCount;

			piece = chart.width() / bufferCount;
			totalWidth = piece * dataLength;
			rate = totalWidth / chart.width();
            thumbWidth = chart.width() * (bufferCount / dataLength) + 2;
        }

        this.draw = function(chart) {
            return chart.svg.group({}, function() {
                chart.svg.rect({
                    width: chart.width(),
                    height: 7,
                    fill: chart.theme("scrollBackgroundColor")
                });

                var thumb = chart.svg.rect({
                    width: thumbWidth,
                    height: 5,
                    fill: chart.theme("scrollThumbBackgroundColor"),
                    stroke: chart.theme("scrollThumbBorderColor"),
                    "stroke-width": 1
                }).translate(thumbLeft, 1);

                // 차트 스크롤 이벤트
                setScrollEvent(chart, thumb);

            }).translate(chart.x(), chart.y2());
        }

        this.drawSetup = function() {
            return {}
        }
    }

    return ScrollWidget;
}, "chart.widget.core");