jui.define("chart.brush.item.arrow", [ "util.base" ], function(_) {
    /**
     * @class chart.brush.item.arrow
     *
     * implements simple brush item
     *
     * @extends chart.brush.item.core
     * @requires util.base
     */
	var ArrowBrushItem = function() {


        this.drawBefore = function() {

        }

        this.draw = function() {

            var svg = this.chart.svg;
            var chart = this.chart;

            var g = svg.group().translate(this.item.centerX, this.item.centerY);

            this.group.append(g);

            // 바깥 지름 부터 그림
            var startX = 0;
            var startY = -(this.item.centerY/2 + 5);

            var path = svg.path({
                stroke : this.chart.theme("gaugeArrowColor"),
                "stroke-width" : 0.2,
                "fill" : this.chart.theme("gaugeArrowColor")
            });

            path.MoveTo(startX, startY);
            path.LineTo(5, 0);
            path.LineTo(-5, 0);
            path.ClosePath();

            // start angle
            path.rotate(this.item.startAngle);
            g.append(path)
            path.rotate(this.item.endAngle + this.item.startAngle);

            g.append(svg.circle({
                cx : 0,
                cy : 0,
                r : 5,
                fill : chart.theme("gaugeArrowColor")
            }));

            g.append(svg.circle({
                cx : 0,
                cy : 0,
                r : 2,
                fill : chart.theme("gaugeArrowColor")
            }));

            return g;
        }

	}

	return ArrowBrushItem;
}, "chart.brush.item.core");