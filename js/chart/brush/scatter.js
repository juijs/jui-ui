jui.define("chart.brush.scatter", [], function() {

	var ScatterBrush = function(brush) {

        function createScatter(chart, brush, pos, index) {
            var elem = null,
                target = chart.series(brush.target[index]),
                symbol = (!target.symbol) ? brush.symbol : target.symbol,
                w = h = brush.size;

            var color = chart.color(index, brush.colors),
                borderColor = chart.theme("scatterBorderColor"),
                borderWidth = chart.theme("scatterBorderWidth");

            if(symbol == "triangle" || symbol == "cross") {
                elem = chart.svg.group({ width: w, height: h }, function() {
                    if(symbol == "triangle") {
                        var poly = chart.svg.polygon();

                        poly.point(0, h)
                            .point(w, h)
                            .point(w / 2, 0);
                    } else {
                        var l1 = chart.svg.line({ stroke: color, "stroke-width": 2, x1: 0, y1: 0, x2: w, y2: h }),
                            l2 = chart.svg.line({ stroke: color, "stroke-width": 2, x1: 0, y1: w, x2: h, y2: 0 });

                        l1.hover(over, out);
                        l2.hover(over, out);

                        function over() {
                            l1.attr({ "stroke-width": 3 });
                            l2.attr({ "stroke-width": 3 });
                        }

                        function out() {
                            l1.attr({ "stroke-width": 2 });
                            l2.attr({ "stroke-width": 2 });
                        }
                    }
                }).translate(pos.x - (w / 2), pos.y - (h / 2));
            } else {
                if(symbol == "rectangle") {
                    elem = chart.svg.rect({
                        width: w,
                        height: h,
                        x: pos.x - (w / 2),
                        y: pos.y - (h / 2)
                    });
                } else {
                    elem = chart.svg.ellipse({
                        rx: w / 2,
                        ry: h / 2,
                        cx: pos.x,
                        cy: pos.y
                    });
                }
            }

            elem.attr({
                fill: color,
                stroke: borderColor,
                "stroke-width": borderWidth
            })
            .hover(function() {
                elem.attr({ stroke: color });
            }, function() {
                elem.attr({ stroke: borderColor });
            });

            return elem;
        }

        this.drawScatter = function(chart, brush, points) {
            var g = chart.svg.group().translate(chart.x(), chart.y());

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].x.length; j++) {
                    var p = createScatter(chart, brush, { x: points[i].x[j], y: points[i].y[j] }, i);
                    this.addEvent(p, i, j);

                    g.append(p);
                }
            }

            return g;
        }

        this.draw = function(chart) {
            return this.drawScatter(chart, brush, this.getXY());
        }

        this.drawSetup = function() {
            return {
                symbol: "circle", // or triangle, rectangle, cross
                size: 5
            }
        }
	}

	return ScatterBrush;
}, "chart.brush.core");