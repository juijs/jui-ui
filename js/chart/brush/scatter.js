jui.define("chart.brush.scatter", [], function() {

	var ScatterBrush = function(brush) {

        function createScatter(brush, chart, pos, index) {
            var elem = null,
                target = chart.series(brush.target[index]),
                symbol = (!target.symbol) ? brush.symbol : target.symbol,
                w = h = (brush.size) ? brush.size : 5;

            var color = chart.theme.color(index, brush.colors),
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
                        chart.svg.line({ stroke: color, "stroke-width": 2, x1: 0, y1: 0, x2: w, y2: h });
                        chart.svg.line({ stroke: color, "stroke-width": 2, x1: 0, y1: w, x2: h, y2: 0 });
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

        this.drawScatter = function(brush, chart, points) {
            var g = chart.svg.group({
                'clip-path' : 'url(#' + chart.clipId + ')'
            }).translate(chart.x(), chart.y());

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].x.length; j++) {
                    var p = createScatter(brush, chart, { x: points[i].x[j], y: points[i].y[j] }, i);
                    this.addEvent(brush, chart, p, i, j);

                    g.append(p);
                }
            }
        }

        this.draw = function(chart) {
            this.drawScatter(brush, chart, this.getXY(brush, chart));
        }
	}

	return ScatterBrush;
}, "chart.brush.core");