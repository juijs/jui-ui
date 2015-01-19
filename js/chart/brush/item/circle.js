jui.define("chart.brush.item.circle", [ "util.base" ], function(_) {
    /**
     * @class chart.brush.item.circle
     *
     * implements simple brush item
     *
     * @extends chart.brush.item.core
     * @requires util.base
     */
	var CircleBrushItem = function() {

        this.draw = function() {
            var svg = this.chart.svg,
                chart = this.chart;

            var g = svg.group().translate(this.item.centerX, this.item.centerY);

            this.group.append(g);

            // 바깥 지름 부터 그림
            var startX = 0;
            var startY = Math.abs(this.item.centerY);

            g.append(svg.circle({
                cx : 0,
                cy : 0,
                r : startY-1.5,
                fill : 'transparent',
                stroke : chart.theme("gaugeArrowColor"),
                "stroke-width" : 3
            }));

            return g;
        }
	}
    
    

	return CircleBrushItem;
}, "chart.brush.item.core");