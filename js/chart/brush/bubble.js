jui.define("chart.brush.bubble", [], function() {

	var BubbleBrush = function(chart, axis, brush) {
        var self = this;

        function createBubble(chart, brush, pos, index) {
            var series = chart.series(brush.target[index]),
                radius = self.getScaleValue(pos.value, series.min, series.max, brush.min, brush.max);

            return chart.svg.circle({
                cx: pos.x,
                cy: pos.y,
                r: radius,
                "fill": self.color(index),
                "fill-opacity": chart.theme("bubbleBackgroundOpacity"),
                "stroke": self.color(index),
                "stroke-width": chart.theme("bubbleBorderWidth")
            });
        }

        this.drawBubble = function(chart, brush, points) {
            var g = chart.svg.group({
                "clip-path" : "url(#" + chart.clipId + ")"
            });

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].x.length; j++) {
                    var b = createBubble(chart, brush, {
                        x: points[i].x[j], y: points[i].y[j], value: points[i].value[j]
                    }, i);

                    this.addEvent(b, j, i);
                    g.append(b);
                }
            }

            return g;
        }

        this.draw = function() {
            return this.drawBubble(chart, brush, this.getXY());
        }

        this.drawSetup = function() {
            return {
                min: 5,
                max: 30
            };
        }
	}

	return BubbleBrush;
}, "chart.brush.core");