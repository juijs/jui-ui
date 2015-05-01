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
            for(var i = 0; i < tick; i++) {
                if(nowScale == scale) {
                    return SCROLL_MAX_Y - (tick * i);
                }
            }
        }

        function setButtonEvents() {
            var originViewX = viewX,
                originViewY = viewY;

            btn.top.on("click", function(e) {
                viewY -= blockY;
                axis.map.view(viewX, viewY);
            });
            btn.right.on("click", function(e) {
                viewX += blockX;
                axis.map.view(viewX, viewY);
            });
            btn.bottom.on("click", function(e) {
                viewY += blockY;
                axis.map.view(viewX, viewY);
            });
            btn.left.on("click", function(e) {
                viewX -= blockX;
                axis.map.view(viewX, viewY);
            });
            btn.home.on("click", function(e) {
                viewX = originViewX;
                viewY = originViewY;
                axis.map.view(viewX, viewY);
            });

            btn.up.on("click", function(e) {
                scale += 0.1;
                axis.map.scale(scale);
            });
            btn.down.on("click", function(e) {
                scale -= 0.1;
                axis.map.scale(scale);
            });
        }

        this.drawBefore = function() {
            scale = axis.map.scale();
            viewX = axis.map.view().x;
            viewY = axis.map.view().y;
            blockX = axis.map.size().width / 10;
            blockY = axis.map.size().height / 10;
            tick = (widget.maxScale - widget.minScale) * 10;
            step = (SCROLL_MAX_Y - SCROLL_MIN_Y) / tick;
        }

        this.draw = function() {
            return chart.svg.group({}, function() {
                var top = chart.svg.group(),
                    bottom = chart.svg.group().translate(20, 80);

                top.append(createBtnGroup("left", 0.8, 0, 20, "http://www.amcharts.com/lib/3/images/panLeft.gif"));
                top.append(createBtnGroup("right", 0.8, 40, 20, "http://www.amcharts.com/lib/3/images/panRight.gif"));
                top.append(createBtnGroup("top", 0.8, 20, 0, "http://www.amcharts.com/lib/3/images/panUp.gif"));
                top.append(createBtnGroup("bottom", 0.8, 20, 40, "http://www.amcharts.com/lib/3/images/panDown.gif"));
                top.append(createBtnGroup("home", 0, 20, 20, "http://www.amcharts.com/lib/3/images/homeIcon.gif"));

                bottom.append(chart.svg.rect({
                    x: 0.5,
                    y: 0.5,
                    width: 26,
                    height: 196,
                    rx: 4,
                    ry: 4,
                    stroke: 0,
                    fill: chart.theme("mapControlScrollColor"),
                    "fill-opacity": 0.15
                }).translate(-3, -3));

                bottom.append(createScrollThumbLines());
                bottom.append(createBtnGroup("up", 0.8, 0, 0, "http://www.amcharts.com/lib/3/images/plus.gif"));
                bottom.append(createBtnGroup("down", 0.8, 0, 170, "http://www.amcharts.com/lib/3/images/minus.gif"));
                bottom.append(createBtnGroup("thumb", 0.8, 0, getScrollThumbY(widget.minScale)));

                // 버튼 클릭 이벤트 설정
                setButtonEvents();
            });
        }
    }

    MapControlWidget.setup = function() {
        return {
            /** @cfg {"top"/"bottom" } Sets the location where the label is displayed (top, bottom). */
            orient: "top",
            /** @cfg {"start"/"end" } Aligns the label (center, start, end). */
            align: "start",

            minScale: 1,
            maxScale: 3
        }
    }

    return MapControlWidget;
}, "chart.widget.map.core");