jui.define("chart.brush.scatterpath", ["util.base"], function(_) {

    /**
     * @class chart.brush.scatterpath
     *
     * scatter path 는 path 를 이용해서 최적화된 symbol 을 그리는 브러쉬
     *
     * scatter 로 표현하지 못하는 많은 양의 데이타를 표시 하는데 사용할 수 있다.
     *
     * @extends chart.brush.core
     *
     */
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

            var loop = _.loop(points[0].x.length);

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
            
            path.remove();

            return g;
        }

        this.draw = function() {
            return this.drawScatter(this.getXY(false));
        }
	}

    ScatterPathBrush.setup = function() {
        return {
            /** @cfg {"circle"/"triangle"/"rectangle"/"cross"} [symbol="circle"] Determines the shape of a starter (circle, rectangle, cross, triangle).  */
            symbol: "circle", // or triangle, rectangle, cross
            /** @cfg {Number} [size=7]  Determines the size of a starter. */
            size: 7,
            /** @cfg {Number} [strokeWidth=1] Set the line thickness of a starter. */
            strokeWidth : 1
        };
    }

	return ScatterPathBrush;
}, "chart.brush.core");