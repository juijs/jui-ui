jui.define("chart.brush.scatterpath", ["util.base"], function(_) {

	var ScatterPathBrush = function() {

        this.drawScatter = function(points) {
            //"use asm";
            var width = height = this.brush.size,
                color = this.color(0),
                strokeWidth = this.brush.strokeWidth;

            var opt = {
                fill : "none",
                    stroke : color,
                "stroke-width" : strokeWidth,
                "stroke-opacity" : 1,
                "stroke-linecap" : "butt",
                "stroke-linejoin" :  "round"
            };

            var g = this.chart.svg.group(),
                path = this.chart.svg.pathSymbol();

            var tpl = path.template(width, height);

            var count = 5;
            var list = [];

            for(var i = 1; i <= count; i++) {
                list[i] = this.chart.svg.pathSymbol(opt);
            }

            var loop = _.loop5(points[0].x.length);

            for(var i = 0; i < points.length; i++) {
                var target = this.chart.get("series", this.brush.target[i]),
                    symbol = (target && target.symbol) ? target.symbol : this.brush.symbol;

                loop(function(index, group) {
                    list[group].add(points[i].x[index]|0, points[i].y[index]|0, tpl[symbol]);
                })

            }

            for(var i = 1; i <= count; i++) {
                g.append(list[i]);
            }

            return g;
        }

        this.draw = function() {
            return this.drawScatter(this.getXY(false));
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