jui.define("chart.widget.rotate3d", [ "util.base" ], function (_) {
    var DEGREE_LIMIT = 180;

    /**
     * @class chart.widget.rotate3d
     * @extends chart.widget.core
     * @alias ScrollWidget
     * @requires util.base
     */
    var Rotate3DWidget = function(chart, axis, widget) {
        var self = this;

        function setScrollEvent(w, h) {
            var isMove = false,
                mouseStartX = 0;
                mouseStartY = 0,
                sdx = 0,
                sdy = 0;

            self.on("bg.mousedown", mousedown);
            self.on("chart.mousedown", mousedown);
            self.on("bg.mousemove", mousemove);
            self.on("bg.mouseup", mouseup);
            self.on("chart.mousemove", mousemove);
            self.on("chart.mouseup", mouseup);

            function mousedown(e) {
                if(isMove) return;

                isMove = true;
                mouseStartX = e.chartX;
                mouseStartY = e.chartY;
                sdx = self.axis.degree.x;
                sdy = self.axis.degree.y;
            }

            function mousemove(e) {
                if(!isMove) return;

                var gapX = e.chartX - mouseStartX,
                    gapY = e.chartY - mouseStartY,
                    dx = Math.floor((gapY / h) * DEGREE_LIMIT),
                    dy = Math.floor((gapX / w) * DEGREE_LIMIT);

                self.axis.degree.x = sdx + dx;
                self.axis.degree.y = sdy - dy;
                chart.render();
            }

            function mouseup(e) {
                if(!isMove) return;

                isMove = false;
                mouseStartX = 0;
                mouseStartY = 0;
            }
        }

        this.draw = function() {
            setScrollEvent(this.axis.area("width"), this.axis.area("height"));

            return chart.svg.group();
        }
    }

    Rotate3DWidget.setup = function() {
    }

    return Rotate3DWidget;
}, "chart.widget.core");