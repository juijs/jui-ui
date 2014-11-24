jui.define("chart.brush.scatter", [], function() {

	var ScatterBrush = function() {

        this.createScatter = function(pos, index) {
            var self = this;

            var elem = null,
                display = this.brush.display,
                target = this.chart.series(this.brush.target[index]),
                symbol = (!target.symbol) ? this.brush.symbol : target.symbol,
                w = h = this.brush.size;

            var color = this.chart.color(index, this.brush),
                borderColor = this.chart.theme("scatterBorderColor"),
                borderWidth = this.chart.theme("scatterBorderWidth");

            if(symbol == "triangle" || symbol == "cross") {
                var self = this;

                elem = this.chart.svg.group({ width: w, height: h }, function() {
                    if(symbol == "triangle") {
                        var poly = self.chart.svg.polygon();

                        poly.point(0, h)
                            .point(w, h)
                            .point(w / 2, 0);
                    } else {
                        self.chart.svg.line({ stroke: color, "stroke-width": borderWidth * 2, x1: 0, y1: 0, x2: w, y2: h });
                        self.chart.svg.line({ stroke: color, "stroke-width": borderWidth * 2, x1: 0, y1: w, x2: h, y2: 0 });
                    }
                }).translate(pos.x - (w / 2), pos.y - (h / 2));
            } else {
                if(symbol == "rectangle") {
                    elem = this.chart.svg.rect({
                        width: w,
                        height: h,
                        x: pos.x - (w / 2),
                        y: pos.y - (h / 2)
                    });
                } else {
                    elem = this.chart.svg.ellipse({
                        rx: w / 2,
                        ry: h / 2,
                        cx: pos.x,
                        cy: pos.y
                    });
                }
            }

            if(symbol != "cross") {
                elem.attr({
                    fill: color,
                    stroke: borderColor,
                    "stroke-width": borderWidth
                })
                .hover(function () {
                    elem.attr({
                        fill: self.chart.theme("scatterHoverColor"),
                        stroke: color,
                        "stroke-width": borderWidth * 2
                    });
                }, function () {
                    elem.attr({
                        fill: color,
                        stroke: borderColor,
                        "stroke-width": borderWidth
                    });
                });
            }

            // display 옵션이 max 또는 min일 때, 나머지 엘리먼트는 숨기기
            if(display == "max" && !pos.max || display == "min" && !pos.min) {
                elem.attr({ visibility: "hidden" });
            }

            return elem;
        }

        this.drawScatter = function(points) {
            var g = this.chart.svg.group();

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].x.length; j++) {
                    var p = this.createScatter({
                        x: points[i].x[j],
                        y: points[i].y[j],
                        max: points[i].max[j],
                        min: points[i].min[j]
                    }, i);
                    this.addEvent(p, i, j);

                    g.append(p);
                }
            }

            return g;
        }

        this.draw = function() {
            return this.drawScatter(this.getXY());
        }

        this.drawSetup = function() {
            return {
                symbol: "circle", // or triangle, rectangle, cross
                size: 7,
                display: null // max, min
            }
        }
	}

	return ScatterBrush;
}, "chart.brush.core");