jui.define("chart.brush.scatterpath", [], function() {

	var ScatterPathBrush = function() {

        this.drawScatter = function(points) {
            var width = height = this.brush.size;

            var g = this.chart.svg.group();
            var path = this.chart.svg.path({
                fill : this.chart.color(0, this.brush),
                stroke : this.chart.color(0, this.brush),
                "stroke-width" : this.chart.theme("scatterBorderWidth")
            });

            for(var i = 0; i < points.length; i++) {
                var target = this.chart.series(this.brush.target[i]),
                    symbol = (!target.symbol) ? this.brush.symbol : target.symbol;
              
                for(var j = 0; j < points[i].x.length; j++) {
                    path[symbol].call(path, points[i].x[j], points[i].y[j], width, height);
                }
            }

            g.append(path);

            return g;
        }

        this.draw = function() {
            return this.drawScatter(this.getXY());
        }

        this.drawSetup = function() {
            return {
                symbol: "circle", // or triangle, rectangle, cross
                size: 7
            }
        }
	}

	return ScatterPathBrush;
}, "chart.brush.core");