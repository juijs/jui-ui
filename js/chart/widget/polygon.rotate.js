jui.define("chart.widget.polygon.rotate", [ "util.base" ], function (_) {
    var DEGREE_LIMIT = 180;

    /**
     * @class chart.widget.polygon.rotate
     * @extends chart.widget.polygon.core
     * @alias ScrollWidget
     * @requires util.base
     */
    var PolygonRotateWdiget = function(chart, axis, widget) {
        var self = this;

        function setScrollEvent(w, h) {
            var isMove = false,
                mouseStartX = 0;
                mouseStartY = 0,
                sdx = 0,
                sdy = 0,
                cacheXY = null,
                unit = self.widget.unit,
                degree = self.axis.degree;

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

                degree.x = sdx + dx;
                degree.y = sdy - dy;

                // 각도 Interval이 맞을 경우, 렌더링하지 않음
                if(degree.x % unit != 0 && degree.y % unit != 0) return;

                // 이전 각도와 동일할 경우, 렌더링하지 않음
                var newCacheXY = degree.x + ":" + degree.y;
                if(cacheXY == newCacheXY) return;

                chart.render();
                cacheXY = newCacheXY;
            }

            function mouseup(e) {
                if(!isMove) return;

                isMove = false;
                mouseStartX = 0;
                mouseStartY = 0;
            }
        }

        this.draw = function() {
            var d = this.axis.degree;

            if(_.typeCheck("integer", d)) { // 기본 각도 설정
                this.axis.degree = { x: d, y: d, z: d };
            }

            setScrollEvent(this.axis.area("width"), this.axis.area("height"));

            return chart.svg.group();
        }
    }

    PolygonRotateWdiget.setup = function() {
        return {
            unit: 5 // 회전 최소 각도
        }
    }

    return PolygonRotateWdiget;
}, "chart.widget.polygon.core");