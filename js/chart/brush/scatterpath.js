jui.define("chart.brush.scatterpath", [], function() {

	var ScatterPathBrush = function() {

        this.drawScatter = function(points) {
            var width = height = this.brush.size;

            var g = this.chart.svg.group();
            var path = this.chart.svg.path({
                fill : this.color(0),
                stroke : this.color(0),
                "stroke-width" : this.brush.strokeWidth
            });

            var tpl = path.getSymbolTemplate(width, height);

            var series = this.chart.series();

            for(var i = 0; i < points.length; i++) {
                var target = series[this.brush.target[i]],
                    symbol = (target && target.symbol) ? target.symbol : this.brush.symbol;
              
                for(var j = 0; j < points[i].x.length; j++) {
                    //path[symbol].call(path, points[i].x[j], points[i].y[j], width, height);
                    path.template(points[i].x[j], points[i].y[j], tpl[symbol]);
                }
            }

            g.append(path);

            return g;
        }

        this.draw = function() {
            return this.drawScatter(this.getCachedXY(false));
        }
	}

    ScatterPathBrush.setup = function() {
        return {
            symbol: "circle", // or triangle, rectangle, cross
            size: 7,
            strokeWidth : 1
        };
    }

	return ScatterPathBrush;
}, "chart.brush.core");