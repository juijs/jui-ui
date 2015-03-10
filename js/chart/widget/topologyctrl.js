jui.define("chart.widget.topologyctrl", [ "util.base" ], function(_) {

    /**
     * @class chart.widget.topologyctrl
     * 
     * 토폴로지 이벤트 핸들러
     * 
     * @extends chart.widget.core 
     */
    var TopologyControlWidget = function(chart, axis, widget) {
        var self = this;
        var targetKey, startX, startY;
        var renderWait = false;
        var scale = 1, boxX = 0, boxY = 0;

        function initDragEvent() {
            self.on("chart.mousemove", function(e) {
                if(!_.typeCheck("string", targetKey)) return;

                var xy = axis.c(targetKey);
                xy.setX(startX + (e.chartX - startX));
                xy.setY(startY + (e.chartY - startY));

                if(renderWait === false) {
                    setTimeout(function () {
                        chart.render();
                        setBrushEvent();

                        renderWait = false;
                    }, 70);

                    renderWait = true;
                }
            });

            self.on("chart.mouseup", endDragAction);
            self.on("bg.mouseup", endDragAction);
            self.on("bg.mouseout", endDragAction);

            function endDragAction(e) {
                if(!_.typeCheck("string", targetKey)) return;
                targetKey = null;
            }
        }

        function initZoomEvent() {
            $(chart.root).bind("mousewheel DOMMouseScroll", function(e){
                if(e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
                    if(scale < 2) {
                        scale += 0.1;
                    }
                } else {
                    if(scale > 0.5) {
                        scale -= 0.1;
                    }
                }

                chart.scale(scale);
                return false;
            });
        }

        function initMoveEvent() {
            var startX = null, startY = null;

            self.on("chart.mousedown", function(e) {
                if(_.typeCheck("string", targetKey)) return;
                if(startX != null || startY != null) return;

                startX = boxX + e.x;
                startY = boxY + e.y;
            });

            self.on("chart.mousemove", function(e) {
                if(startX == null || startY == null) return;

                var xy = chart.view(startX - e.x, startY - e.y);
                boxX = xy.x;
                boxY = xy.y;
            });

            self.on("chart.mouseup", endMoveAction);
            self.on("bg.mouseup", endMoveAction);
            self.on("bg.mouseout", endMoveAction);

            function endMoveAction(e) {
                if(startX == null || startY == null) return;

                startX = null;
                startY = null;
            }
        }

        function setBrushEvent() {
            chart.svg.root.get(0).each(function(i, brush) {
                var cls = brush.attr("class");

                if(cls && cls.indexOf("topologynode") != -1) {
                    brush.each(function(i, node) {
                        var index = parseInt(node.attr("index"));

                        if(!isNaN(index)) {
                            var data = axis.data[index];

                            (function (key) {
                                node.on("mousedown", function(e) {
                                    if (_.typeCheck("string", targetKey)) return;

                                    var xy = axis.c(key);
                                    targetKey = key;
                                    startX = xy.x;
                                    startY = xy.y;

                                    // 선택한 노드 맨 마지막으로 이동
                                    xy.moveLast();
                                });
                            })(self.axis.getValue(data, "key"));
                        }
                    });
                }
            });
        }

        this.draw = function() {
            if(widget.zoom) {
                initZoomEvent();
            }

            if(widget.move) {
                initMoveEvent();
                chart.svg.root.attr({ cursor: "move" });
            }

            initDragEvent();
            setBrushEvent();

            return chart.svg.group();
        }
    }

    TopologyControlWidget.setup = function() {
        return {
            /** @cfg {Boolean} [move=false] Set to be moved to see the point of view of the topology map. */
            move: false,
            /** @cfg {Boolean} [zoom=false] Set the zoom-in / zoom-out features of the topology map. */
            zoom: false
        }
    }

    return TopologyControlWidget;
}, "chart.widget.core");