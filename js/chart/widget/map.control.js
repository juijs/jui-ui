jui.define("chart.widget.map.control", [ "util.base" ], function(_) {

    /**
     * @class chart.widget.map.control
     * @extends chart.widget.map.core
     */
    var MapControlWidget = function(chart, axis, widget) {
        var self = this,
            map = null;
        var pathGroup = null,
            pathScale = null,
            pathX = null,
            pathY = null,
            isDragEnd = false;

        function initZoomEvent() {
            $(pathGroup.element).on("mousewheel DOMMouseScroll", function(e) {
                if(e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
                    if(pathScale < 2) {
                        pathScale += 0.1;
                    }
                } else {
                    if(pathScale > 0.5) {
                        pathScale -= 0.1;
                    }
                }

                map.scale(pathScale);
                return false;
            });
        }

        function initMoveEvent() {
            var startX = null,
                startY = null,
                tmpXY = null;

            self.on("axis.mousedown", function(e) {
                if(startX != null || startY != null) return;

                startX = pathX + e.axisX;
                startY = pathY + e.axisY;
                tmpXY = pathX + "," + pathY;
            });

            self.on("axis.mousemove", function(e) {
                if(startX == null || startY == null) return;

                var xy = map.view(startX - e.axisX, startY - e.axisY);
                pathX = xy.x;
                pathY = xy.y;
            });

            self.on("axis.mouseup", endMoveAction);
            self.on("axis.mouseout", endMoveAction);

            function endMoveAction(e) {
                if(startX == null || startY == null) return;

                startX = null;
                startY = null;
                isDragEnd = (pathX + "," + pathY != tmpXY);
            }
        }

        this.draw = function() {
            map = chart.axis(widget.axis).map;
            pathGroup = map.group();
            pathScale = map.scale();
            pathX = map.view().x;
            pathY = map.view().y;

            if(widget.zoom) {
                initZoomEvent();
            }

            if(widget.move) {
                initMoveEvent();
                chart.svg.root.attr({ cursor: "move" });
            }

            return chart.svg.group();
        }
    }

    MapControlWidget.setup = function() {
        return {
            /** @cfg {Boolean} [move=false] Set to be moved to see the point of view of the topology map. */
            move: false,
            /** @cfg {Boolean} [zoom=false] Set the zoom-in / zoom-out features of the topology map. */
            zoom: false
        }
    }

    return MapControlWidget;
}, "chart.widget.map.core");