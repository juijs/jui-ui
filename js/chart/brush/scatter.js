jui.define("chart.brush.scatter", [], function() {

	var ScatterBrush = function(brush) {
        var self = this;

        function createScatter(brush, chart, x, y, index) {
            var elem = null;
            var target = chart.series(brush.target[index]),
                symbol = (!target.symbol) ? brush.symbol : target.symbol,
                w = (brush.size) ? brush.size : 5,
                h = w;

            if(symbol == "triangle" || symbol == "cross") {
                elem = chart.svg.group({ width: w, height: h }, function() {
                    if(symbol == "triangle") {
                        var poly = chart.svg.polygon({
                            fill: self.color(index)
                        });

                        poly.point(0, h)
                            .point(w, h)
                            .point(w / 2, 0);
                    } else {
                        chart.svg.line({ stroke: self.color(index), "stroke-width": 2, x1: 0, y1: 0, x2: w, y2: h });
                        chart.svg.line({ stroke: self.color(index), "stroke-width": 2, x1: 0, y1: w, x2: h, y2: 0 });
                    }

                }).translate(x - (w / 2), y - (h / 2));
            } else {
                if(symbol == "rectangle") {
                    elem = chart.svg.rect({
                        width: w,
                        height: h,
                        x: x - (w / 2),
                        y: y - (h / 2),
                        fill: self.color(index)
                    });
                } else {
                    elem = chart.svg.ellipse({
                        rx: w / 2,
                        ry: h / 2,
                        cx: x,
                        cy: y,
                        fill: self.color(index)
                    });
                }
            }

            return elem;
        }

        this.draw = function(chart) {
            var g = chart.svg.group().translate(chart.area('x'), chart.area('y'));
            var points = [];

            for (var i = 0; i < chart.data().length; i++) {
                points[i] = brush.x(i);
            }

            this.drawScatter(brush, chart, points, g);
        }

		this.drawScatter = function(brush, chart, points, g) {
            for (var i = 0; i < points.length; i++) {
                var valueSum = 0;

                for (var j = 0; j < brush.target.length; j++) {
                    var obj = chart.series(brush.target[j]),
                        value = obj.data[i];

                    if (brush.nest === false && j > 0) {
                        valueSum += chart.series(brush.target[j - 1]).data[i];
                    }

                    g.append(createScatter(brush, chart, points[i], brush.y(value + valueSum), j));
                }
            }
		}
	}

	return ScatterBrush;
}, "chart.brush"); 