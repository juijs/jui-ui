jui.define("chart.grid.draw3d", [ "util.base", "chart.polygon.grid", "chart.polygon.line", "chart.polygon.point" ],
    function(_, GridPolygon, LinePolygon, PointPolygon) {

    /**
     * @class chart.grid.draw3d
     * @abstract
     */
    var Draw3DGrid = function() {

        this.createGridX = function(position, index, x, isActive, isLast) {
            var line = this.getLineOption(),
                axis = this.chart.svg.group();

            if (line) {
                this.drawValueLine(position, axis, isActive, line, index, x, isLast);
            }

            return axis;
        }

        this.createGridY = function(position, index, y, isActive, isLast) {
            var line = this.getLineOption(),
                axis = this.chart.svg.group();

            if (line) {
                this.drawValueLine(position, axis, isActive, line, index, y, isLast);
            }

            return axis;
        }

        /**
         * @method center
         *
         * draw center
         *
         * @param {chart.util.svg} g
         * @param {Array} ticks
         * @param {Array} values
         * @param {Number} min
         * @param {Function} checkActive
         */
        this.drawCenter = function(g, ticks, values, checkActive, moveZ) {
            var axis = this.chart.svg.group(),
                line = this.getLineOption();

            if(line) {
                this.drawValueLineCenter(axis, ticks, values, checkActive, moveZ);
            }

            this.drawValueTextCenter(axis, ticks, values, checkActive, moveZ);

            g.append(axis);
        }

        this.drawBaseLine = function(position, g) {
            var axis = this.chart.svg.group();
            this.drawAxisLine(position, axis);

            g.append(axis);
        }

        /**
         * @method axisLine
         * theme 이 적용된  axis line 리턴
         * @param {ChartBuilder} chart
         * @param {Object} attr
         */
        this.drawAxisLine = function(position, axis) {
            var isTopOrBottom = (position == "top" || position == "bottom"),
                borderColor = (isTopOrBottom) ? "gridXAxisBorderColor" : "gridYAxisBorderColor",
                borderWidth = (isTopOrBottom) ? "gridXAxisBorderWidth" : "gridYAxisBorderWidth";

            if(position == "center") {
                borderColor = "gridZAxisBorderColor";
                borderWidth = "gridZAxisBorderWidth";
            }

            var face = this.chart.svg.polygon({
                stroke: this.chart.theme(borderColor),
                "stroke-width": this.chart.theme(borderWidth),
                "stroke-opacity" : 1,
                fill: this.chart.theme("gridFaceBackgroundColor"),
                "fill-opacity": this.chart.theme("gridFaceBackgroundOpacity")
            });

            var p = null,
                w = this.axis.area("width"),
                h = this.axis.area("height"),
                d = this.axis.depth;

            if(position == "center") {
                p = new GridPolygon("center", w, h, d);
            } else {
                if(isTopOrBottom) {
                    h = (position == "bottom") ? h : 0;
                    p = new GridPolygon("horizontal", w, h, d);
                } else {
                    w = (position == "right") ? w : 0;
                    p = new GridPolygon("vertical", w, h, d);
                }
            }

            // 사각면 위치 계산 및 추가
            this.calculate3d(p);
            for(var i = 0; i < p.vectors.length; i++) {
                face.point(p.vectors[i].x, p.vectors[i].y);
            }

            axis.append(face);
        }

        this.drawValueLine = function(position, axis, isActive, line, index, xy, isLast) {
            var isDrawLine = false,
                w = this.axis.area("width"),
                h = this.axis.area("height"),
                d = this.axis.depth,
                l1 = null,
                l2 = null;

            if (position == "top") {
                isDrawLine = this.checkDrawLineY(index, isLast);
                l1 = new LinePolygon(xy, 0, 0, xy, 0, d);
                l2 = new LinePolygon(xy, 0, d, xy, h, d);
            } else if (position == "bottom" ) {
                isDrawLine = this.checkDrawLineY(index, isLast);
                l1 = new LinePolygon(xy, h, 0, xy, h, d);
                l2 = new LinePolygon(xy, h, d, xy, 0, d);
            } else if (position == "left") {
                isDrawLine = this.checkDrawLineX(index, isLast);
                l1 = new LinePolygon(0, xy, 0, 0, xy, d);
                l2 = new LinePolygon(0, xy, d, w, xy, d);
            } else if (position == "right" ) {
                isDrawLine = this.checkDrawLineX(index, isLast);
                l1 = new LinePolygon(w, xy, 0, w, xy, d);
                l2 = new LinePolygon(w, xy, d, 0, xy, d);
            }

            if(isDrawLine) {
                // 폴리곤 계산
                this.calculate3d(l1, l2);

                var lo1 = this.line({
                    stroke: this.chart.theme("gridBorderColor"),
                    "stroke-width": this.chart.theme("gridBorderWidth"),
                    x1: l1.vectors[0].x,
                    y1: l1.vectors[0].y,
                    x2: l1.vectors[1].x,
                    y2: l1.vectors[1].y
                });

                var lo2 = this.line({
                    stroke: this.chart.theme("gridBorderColor"),
                    "stroke-width": this.chart.theme("gridBorderWidth"),
                    x1: l2.vectors[0].x,
                    y1: l2.vectors[0].y,
                    x2: l2.vectors[1].x,
                    y2: l2.vectors[1].y
                });

                if (line.type.indexOf("dashed") > -1) {
                    lo1.attr({ "stroke-dasharray": "5,5" });
                    lo2.attr({ "stroke-dasharray": "5,5" });
                }

                axis.append(lo1);
                axis.append(lo2);
            }
        }

        this.drawValueLineCenter = function(axis, ticks, values, checkActive, moveZ) {
            var len = (this.grid.type != "block") ? ticks.length - 1 : ticks.length,
                w = this.axis.area("width"),
                h = this.axis.area("height"),
                d = this.axis.depth,
                dx = (this.axis.get("y").orient == "left") ? 0 : w,
                dy = (this.axis.get("x").orient == "top") ? 0 : h;

            // z축 라인 드로잉
            for(var i = 1; i < len; i++) {
                var t = i * (d / len),
                    p1 = new LinePolygon(0, dy, t, w, dy, t),
                    p2 = new LinePolygon(dx, 0, t, dx, h, t);

                this.calculate3d(p1, p2);

                axis.append(this.line({
                    stroke: this.chart.theme("gridBorderColor"),
                    "stroke-width": this.chart.theme("gridBorderWidth"),
                    x1: p1.vectors[0].x,
                    y1: p1.vectors[0].y,
                    x2: p1.vectors[1].x,
                    y2: p1.vectors[1].y
                }));

                axis.append(this.line({
                    stroke: this.chart.theme("gridBorderColor"),
                    "stroke-width": this.chart.theme("gridBorderWidth"),
                    x1: p2.vectors[0].x,
                    y1: p2.vectors[0].y,
                    x2: p2.vectors[1].x,
                    y2: p2.vectors[1].y
                }));
            }
        }

        this.drawValueText = function(position, axis, index, xy, domain) {
            if (this.grid.hideText) return;

            var isVertical = (position == "left" || position == "right");

            var tickSize = this.chart.theme("gridTickBorderSize"),
                tickPadding = this.chart.theme("gridTickPadding"),
                w = this.axis.area("width"),
                h = this.axis.area("height"),
                x = 0,
                y = 0;

            if(position == "top") {
                x = xy;
                y = -(tickSize + tickPadding * 2);
            } else if(position == "bottom") {
                x = xy;
                y = h + tickSize + tickPadding * 2;
            } else if(position == "left") {
                x = -(tickSize + tickPadding);
                y = xy;
            } else if(position == "right") {
                x = w + tickSize + tickPadding;
                y = xy;
            }

            var p = new PointPolygon(x, y, 0);
            this.calculate3d(p);

            axis.append(this.getTextRotate(this.chart.text({
                x: p.vectors[0].x,
                y: p.vectors[0].y,
                dx: !isVertical ? this.chart.theme("gridXFontSize") / 3 : 0,
                dy: isVertical ? this.chart.theme("gridYFontSize") / 3 : 0,
                fill: this.chart.theme(isVertical ? "gridYFontColor" : "gridXFontColor"),
                "text-anchor": isVertical ? (position == "left" ? "end" : "start") : "middle",
                "font-size": this.chart.theme(isVertical ? "gridYFontSize" : "gridXFontSize"),
                "font-weight": this.chart.theme(isVertical ? "gridYFontWeight" : "gridXFontWeight")
            }, domain)));
        }

        this.drawValueTextCenter = function(axis, ticks, values, checkActive, moveZ) {
            var margin = this.chart.theme("gridTickBorderSize") + this.chart.theme("gridTickPadding"),
                isLeft = (this.axis.get("y").orient == "left"),
                isTop = (this.axis.get("x").orient == "top"),
                len = (this.grid.type != "block") ? ticks.length - 1 : ticks.length,
                w = this.axis.area("width"),
                h = this.axis.area("height"),
                d = this.axis.depth,
                x = (isLeft) ? w + margin : -margin,
                y = (isTop) ? -margin : h + margin;

            // z축 라인 드로잉
            for(var i = 0; i < ticks.length; i++) {
                var domain = this.format(ticks[i], i),
                    t = i * (d / len) + moveZ,
                    p = new PointPolygon(x, y, t);

                this.calculate3d(p);

                axis.append(this.getTextRotate(this.chart.text({
                    x: p.vectors[0].x,
                    y: p.vectors[0].y,
                    fill: this.chart.theme("gridZFontColor"),
                    "text-anchor": (isLeft) ? "start" : "end",
                    "font-size": this.chart.theme("gridZFontSize"),
                    "font-weight": this.chart.theme("gridZFontWeight")
                }, domain)));
            }
        }

        this.drawPattern = function() {}
        this.drawImage = function() {}
    }

    return Draw3DGrid;
}, "chart.draw");