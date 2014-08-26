jui.define("chart.brush.bubble", [], function() {

	var BubbleBrush = function(brush) {
        var self = this;

        function createBubble(brush, chart, pos, index) {
            var r_min = (typeof brush.min != "undefined") ? brush.min : 5,
                r_max = (typeof brush.min != "undefined") ? brush.max : 30,
                radius = self.getScaleValue(pos.value, brush.min, brush.max, r_min, r_max);

            return chart.svg.circle({
                cx: pos.x,
                cy: pos.y,
                r: radius,
                "fill": chart.theme.color(index),
                "fill-opacity": 0.5,
                "stroke": chart.theme.color(index),
                "stroke-width": 1
            });
        }

        this.drawBubble = function(brush, chart, points) {
            var g = chart.svg.group({
                'clip-path' : 'url(#clip)'
            }).translate(chart.area('x'), chart.area('y'));

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].x.length; j++) {
                    var b = createBubble(brush, chart, {
                        x: points[i].x[j], y: points[i].y[j], value: points[i].value[j]
                    }, i);

                    g.append(b);
                }
            }
        }

        this.draw = function(chart) {
            this.drawBubble(brush, chart, this.getXY(brush, chart));
        }
	}

	return BubbleBrush;
}, "chart.brush"); 