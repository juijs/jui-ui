jui.define("chart.brush.line", [], function() {

	var LineBrush = function() {
        var g;
        var circleColor, disableOpacity, lineBorderWidth;

        this.setActiveEffect = function(elem) {
            var lines = this.lineList;

            for(var i = 0; i < lines.length; i++) {
                var opacity = (elem == lines[i].element) ? 1 : disableOpacity,
                    color = lines[i].element.attr("stroke");

                if(lines[i].tooltip != null) {
                    lines[i].tooltip.style(color, circleColor, opacity);
                }

                lines[i].element.attr({ opacity: opacity });
            }
        }

        this.addLineElement = function(elem) {
            if(!this.lineList) {
                this.lineList = [];
            }

            this.lineList.push(elem);
        }

        this.createLine = function(pos, index) {
            var x = pos.x,
                y = pos.y;

            var p = this.chart.svg.path({
                stroke : this.color(index),
                "stroke-width" : lineBorderWidth,
                fill : "transparent",
                "cursor" : (this.brush.activeEvent != null) ? "pointer" : "normal"
            });

            if(pos.length > 0) {
                p.MoveTo(x[0], y[0]);

                if (this.brush.symbol == "curve") {
                    var px = this.curvePoints(x),
                        py = this.curvePoints(y);

                    for (var i = 0; i < x.length - 1; i++) {
                        p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                    }
                } else {
                    for (var i = 0; i < x.length - 1; i++) {
                        if (this.brush.symbol == "step") {
                            var sx = x[i] + ((x[i + 1] - x[i]) / 2);

                            p.LineTo(sx, y[i]);
                            p.LineTo(sx, y[i + 1]);
                        }

                        p.LineTo(x[i + 1], y[i + 1]);
                    }
                }
            }

            return p;
        }

        this.drawTooltip = function(g, pos, index) {
            var display = this.brush.display;

            for (var i = 0; i < pos.x.length; i++) {
                if(display == "max" && pos.max[i] || display == "min" && pos.min[i]) {
                    var orient = (display == "max" && pos.max[i]) ? "top" : "bottom";

                    var tooltip = this.drawItem(g, null, {
                        fill: this.color(index),
                        stroke: circleColor,
                        opacity: 1
                    });

                    tooltip.control(orient, pos.x[i], pos.y[i], pos.value[i]);

                    // 컬럼 상태 설정 (툴팁)
                    this.lineList[index].tooltip = tooltip;
                }
            }
        }

        this.drawLine = function(path) {
            var self = this;

            for(var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k);

                this.addEvent(p, null, k);
                g.append(p);

                // 컬럼 상태 설정
                this.addLineElement({
                    element: p,
                    tooltip: null
                });

                // Max & Min 툴팁 추가
                if(this.brush.display != null) {
                    this.drawTooltip(g, path[k], k);
                }

                // 액티브 이벤트 설정
                if(this.brush.activeEvent != null) {
                    (function(elem) {
                        elem.on(self.brush.activeEvent, function(e) {
                            self.setActiveEffect(elem);
                        });
                    })(p);
                }
            }

            // 액티브 라인 설정
            for(var k = 0; k < path.length; k++) {
                if(this.brush.active == this.brush.target[k]) {
                    this.setActiveEffect(this.lineList[k].element);
                }
            }

            return g;
        }

        this.drawBefore = function() {
            g = this.chart.svg.group();
            circleColor = this.chart.theme("lineCircleBorderColor");
            disableOpacity = this.chart.theme("lineDisableBorderOpacity");
            lineBorderWidth = this.chart.theme("lineBorderWidth");
        }

        this.draw = function() {
            return this.drawLine(this.getXY());
        }

        this.drawAnimate = function(root) {
            var svg = this.chart.svg;

            root.each(function(i, elem) {
                if(elem.is("util.svg.element.path")) {
                    var len = elem.length();

                    elem.attr({
                        "stroke-dasharray": len
                    });

                    elem.append(svg.animate({
                        attributeName: "stroke-dashoffset",
                        from: len,
                        to: "0",
                        begin: "0s",
                        dur: "1s",
                        repeatCount: "1"
                    }));
                }
            });
        }
	}

    LineBrush.setup = function() {
        return {
            symbol: "normal", // normal, curve, step
            display: null,
            active: null,
            activeEvent: null, // or click, mouseover, ...
            items: [ "tooltip" ]
        };
    }

	return LineBrush;
}, "chart.brush.core");