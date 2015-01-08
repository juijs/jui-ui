jui.define("chart.brush.scatterpath", [], function() {

	var ScatterPathBrush = function() {

        this.drawScatter = function(points) {
            //"use asm";
            var width = height = this.brush.size;
            var unit = 30000;
            var color = this.color(0);
            var strokeWidth = this.brush.strokeWidth;

            var g = this.chart.svg.group();

            var path = this.chart.svg.path({
                fill : color,
                stroke : color,
                "stroke-width" : strokeWidth
            });

            var tpl = path.getSymbolTemplate(width, height);

            for(var i = 0; i < points.length; i++) {
                var target = this.chart.get("series", this.brush.target[i]),
                    symbol = (target && target.symbol) ? target.symbol : this.brush.symbol;

                var j = points[i].x.length;

                while(j--) {
                    //path[symbol].call(path, points[i].x[j], points[i].y[j], width, height);
                    path.template(points[i].x[j]|0, points[i].y[j]|0, tpl[symbol]);
                }
            }

            g.append(path);



            return g;
        }

        this.draw = function() {
            return this.drawScatter(this.getXY(false, true));
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