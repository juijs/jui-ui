jui.define("chart.brush.area", [], function() {

	var AreaBrush = function(brush) {

        this.drawArea = function(brush, chart, path) {
            var g = chart.svg.group().translate(chart.x(), chart.y()),
                maxY = chart.height();

            for (var i = 0; i < path.length; i++) {
                var p = chart.svg.polygon({
                    fill : chart.theme.color(i),
                    opacity : chart.theme("areaOpacity")
                });

                var x = path[i].x,
                    y = path[i].y;

                p.point(x[0], maxY);

                for (var j = 0; j < x.length - 1; j++) {
                    p.point(x[j], y[j]);
                }

                p.point(x[x.length - 1], y[y.length - 1]);
                p.point(x[x.length - 1], maxY);

                g.prepend(p);
            }
        }

		this.draw = function(chart) {
            this.drawArea(brush, chart, this.getXY(brush, chart));
		}
	}

	return AreaBrush;
}, "chart.brush.core");
