jui.define("chart.widget.map.control", [ "util.base" ], function(_) {
    var SCROLL_MIN_Y = 21.5,
        SCROLL_MAX_Y = 149;

    /**
     * @class chart.widget.map.control
     * @extends chart.widget.map.core
     */
    var MapControlWidget = function(chart, axis, widget) {
        var scale = 1,
            viewX = 0,
            viewY = 0,
            blockX = 0,
            blockY = 0,
            scrollY = 0,
            step = 0,
            tick = 0,
            btn = { top: null, right: null, bottom: null, left: null, home: null, up: null, down: null, thumb: null };

        function createBtnGroup(type, opacity, x, y, url) {
            btn[type] = chart.svg.group({
                cursor: (url != null) ? "pointer" : "move"
            }, function() {
                chart.svg.rect({
                    x: 0.5,
                    y: 0.5,
                    width: 20,
                    height: 20,
                    rx: 2,
                    ry: 2,
                    stroke: 0,
                    fill: chart.theme("mapControlButtonColor"),
                    "fill-opacity": opacity
                });

                if(url != null) {
                    chart.svg.image({
                        x: 4.5,
                        y: 4.5,
                        width: 11,
                        height: 11,
                        "xmlns:xlink": "http://www.w3.org/1999/xlink",
                        "xlink:href": url,
                        opacity: 0.6
                    });
                }
            }).translate(x, y);

            return btn[type];
        }

        function createScrollThumbLines() {
            return chart.svg.group({}, function() {
                for(var i = 0; i < 6; i++) {
                    var y = 22 * i;

                    chart.svg.path({
                        fill: "none",
                        "stroke-width": 1,
                        "stroke-opacity": 0.6,
                        stroke: chart.theme("mapControlScrollLineColor")
                    }).MoveTo(1.5, 41.5 + y).LineTo(18.5, 41.5 + y);
                }
            });
        }

        function getScrollThumbY(nowScale) {
            var y = SCROLL_MAX_Y - (step * ((nowScale - widget.minScale) / 0.1));

            if(y < SCROLL_MIN_Y) return SCROLL_MIN_Y;
            else if(y > SCROLL_MAX_Y) return SCROLL_MAX_Y;

            return y;
        }

        function getScrollScale(y) {
            return parseFloat((widget.minScale + ((SCROLL_MAX_Y - y) / step) * 0.1).toFixed(1));
        }

        function setButtonEvents() {
            var originViewX = viewX,
                originViewY = viewY;

            btn.top.on("click", function(e) {
                viewY -= blockY;
                move();
            });
            btn.right.on("click", function(e) {
                viewX += blockX;
                move();
            });
            btn.bottom.on("click", function(e) {
                viewY += blockY;
                move();
            });
            btn.left.on("click", function(e) {
                viewX -= blockX;
                move();
            });
            btn.home.on("click", function(e) {
                viewX = originViewX;
                viewY = originViewY;
                move();
            });

            btn.up.on("click", function(e) {
                if(scale > widget.maxScale) return;

                scale += 0.1;
                zoom();
            });
            btn.down.on("click", function(e) {
                if(scale - 0.09 < widget.minScale) return;

                scale -= 0.1;
                zoom();
            });

            function move() {
                axis.updateMap({
                    scale: scale,
                    viewX: viewX,
                    viewY: viewY
                });

                axis.map.view(viewX, viewY);
            }
            function zoom() {
                axis.updateMap({
                    scale: scale,
                    viewX: viewX,
                    viewY: viewY
                });

                scrollY = getScrollThumbY(scale);
                axis.map.scale(scale);
                btn.thumb.translate(0, scrollY);
            }
        }

        function setScrollEvent(bar) {
            var startY = 0,
                moveY = 0;

            btn.thumb.on("mousedown", function(e) {
                if(startY > 0) return;

                startY = e.y;
            });

            btn.thumb.on("mousemove", moveThumb);
            bar.on("mousemove", moveThumb);

            btn.thumb.on("mouseup", endMoveThumb);
            bar.on("mouseup", endMoveThumb);
            bar.on("mouseout", endMoveThumb);

            function moveThumb(e) {
                if(startY == 0) return;
                var sy = scrollY + e.y - startY;

                if(sy >= SCROLL_MIN_Y && sy <= SCROLL_MAX_Y) {
                    moveY = e.y - startY;
                    scale = getScrollScale(sy);

                    axis.updateMap({
                        scale: scale,
                        viewX: viewX,
                        viewY: viewY
                    });

                    axis.map.scale(scale);
                    btn.thumb.translate(0, getScrollThumbY(scale));
                }
            }

            function endMoveThumb(e) {
                if(startY == 0) return;

                startY = 0;
                scrollY += moveY;
            }
        }

        this.drawBefore = function() {
            scale = axis.map.scale();
            viewX = axis.map.view().x;
            viewY = axis.map.view().y;
            blockX = axis.map.size().width / 10;
            blockY = axis.map.size().height / 10;
            tick = (widget.maxScale - widget.minScale) * 10;
            step = (SCROLL_MAX_Y - SCROLL_MIN_Y) / tick;
            scrollY = getScrollThumbY(scale);
        }

        this.draw = function() {
            var g = chart.svg.group({}, function() {
                var top = chart.svg.group(),
                    bottom = chart.svg.group().translate(20, 80),
                    bar = chart.svg.rect({
                        x: 0.5,
                        y: 0.5,
                        width: 26,
                        height: 196,
                        rx: 4,
                        ry: 4,
                        stroke: 0,
                        fill: chart.theme("mapControlScrollColor"),
                        "fill-opacity": 0.15
                    }).translate(-3, -3);

                top.append(createBtnGroup("left", 0.8, 0, 20, "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIQjI9poMcdXpOKTujw0pGjAgA7"));
                top.append(createBtnGroup("right", 0.8, 40, 20, "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIQjI8JycvonomSKhksxBqbAgA7"));
                top.append(createBtnGroup("top", 0.8, 20, 0, "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIQjI+pCmvd2IkzUYqw27yfAgA7"));
                top.append(createBtnGroup("bottom", 0.8, 20, 40, "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIQjI+pyw37TDxTUhhq0q2fAgA7"));
                top.append(createBtnGroup("home", 0, 20, 20, "data:image/gif;base64,R0lGODlhCwALAPABAAAAAAAAACH5BAUAAAEALAAAAAALAAsAAAIZjI8ZoAffIERzMVMxm+9KvIBh6Imb2aVMAQA7"));

                bottom.append(bar);
                bottom.append(createScrollThumbLines());
                bottom.append(createBtnGroup("up", 0.8, 0, 0, "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAISjI8ZoMhtHpQH2HsV1TD29SkFADs="));
                bottom.append(createBtnGroup("down", 0.8, 0, 170, "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIMjI+py+0BopSv2qsKADs="));
                bottom.append(createBtnGroup("thumb", 0.8, 0, scrollY));

                // 버튼 클릭 이벤트 설정
                setButtonEvents();
                setScrollEvent(bar);
            });

            var ot = widget.orient,
                ag = widget.align,
                dx = widget.dx,
                dy = widget.dy,
                x2 = axis.area("x2"),
                y2 = axis.area("y2");

            // 컨트롤러 위치 설정
            if(ot == "bottom" && ag == "start") {
                g.translate(dx, y2 - (273 + dy));
            } else if(ot == "bottom" && ag == "end") {
                g.translate(x2 - (60 + dx), y2 - (273 + dy));
            } else if(ot == "top" && ag == "end") {
                g.translate(x2 - (60 + dx), dy);
            } else {
                g.translate(dx, dy);
            }

            return g;
        }
    }

    MapControlWidget.setup = function() {
        return {
            /** @cfg {"top"/"bottom" } Sets the location where the label is displayed (top, bottom). */
            orient: "top",
            /** @cfg {"start"/"end" } Aligns the label (center, start, end). */
            align: "start",

            minScale: 1,
            maxScale: 3,

            dx: 5,
            dy: 5
        }
    }

    return MapControlWidget;
}, "chart.widget.map.core");