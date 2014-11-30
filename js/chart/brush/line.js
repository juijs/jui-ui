jui.define("chart.brush.line", [], function() {

	var LineBrush = function() {
        var columns = [];

        function setActiveEvent(self, elem) {
            if(self.brush.active == null) return;

            elem.on(self.brush.active, function(e) {
                for(var i = 0; i < columns.length; i++) {
                    var opacity = (elem == columns[i].element) ? 1 : self.chart.theme("lineDisableBorderOpacity");

                    columns[i].element.attr({ opacity: opacity });
                    if(columns[i].tooltip != null) {
                        columns[i].tooltip.attr({ opacity: opacity });
                    }
                }
            });
        }

        this.createLine = function(pos, index) {
            var x = pos.x,
                y = pos.y;

            var p = this.chart.svg.path({
                stroke : this.chart.color(index, this.brush),
                "stroke-width" : this.chart.theme("lineBorderWidth"),
                fill : "transparent",
                "cursor" : (this.brush.active != null) ? "pointer" : "normal"
            }).MoveTo(x[0], y[0]);

            if(this.brush.symbol == "curve") {
                var px = this.curvePoints(x),
                    py = this.curvePoints(y);

                for (var i = 0; i < x.length - 1; i++) {
                    p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                }
            } else {
                for (var i = 0; i < x.length - 1; i++) {
                    if(this.brush.symbol == "step") {
                        var sx = x[i] + ((x[i + 1] - x[i]) / 2);

                        p.LineTo(sx, y[i]);
                        p.LineTo(sx, y[i + 1]);
                    }

                    p.LineTo(x[i + 1], y[i + 1]);
                }
            }

            return p;
        }

        this.drawTooltip = function(g, pos, index) {
            var display = this.brush.display,
                circleColor = this.chart.theme("lineCircleBorderColor");

            for (var i = 0; i < pos.x.length; i++) {
                if(display == "max" && pos.max[i] || display == "min" && pos.min[i]) {
                    var tooltip = this.createTooltip(this.chart.color(index, this.brush), circleColor),
                        isTop = (display == "max" && pos.max[i]) ? true : false;

                    this.showTooltip(tooltip, pos.x[i], pos.y[i], pos.value[i], isTop);
                    g.append(tooltip);

                    // 컬럼 상태 설정 (툴팁)
                    columns[index].tooltip = tooltip;
                }
            }
        }

        this.drawLine = function(path) {
            var g = this.chart.svg.group();

            for (var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k);

                this.addEvent(p, k, null);
                g.append(p);

                // 컬럼 상태 설정
                columns[k] = {
                    element: p,
                    tooltip: null
                };

                // 액티브 라인 추가
                if(this.brush.active != null) {
                    setActiveEvent(this, p);
                }

                // Max & Min 툴팁 추가
                if(this.brush.display != null) {
                    this.drawTooltip(g, path[k], k);
                }
            }

            return g;
        }

        this.draw = function() {
            return this.drawLine(this.getXY());
        }

        this.drawSetup = function() {
            return {
                symbol: "normal", // normal, curve, step
                active: null, // or click, mouseover, ...
                display: null
            }
        }
	}

	return LineBrush;
}, "chart.brush.core");