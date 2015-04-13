jui.define("chart.brush.map.bubble", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.bubble
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapBubbleBrush = function(chart, axis, brush) {
		this.draw = function() {
            var g = chart.svg.group(),
                color = this.color(0),
                size = 5 * axis.map.scale();

            axis.map.data(function(i, data) {
                var xy = axis.map(data.id);

                if(xy.x != null && xy.y != null) {
                    var c = chart.svg.circle({
                        r: size,
                        "fill": color,
                        "fill-opacity": chart.theme("bubbleBackgroundOpacity"),
                        "stroke": color,
                        "stroke-width": chart.theme("bubbleBorderWidth")
                    });

                    c.translate(xy.x, xy.y);
                    g.append(c);
                }
            });

			return g;
		}
	}

	return MapBubbleBrush;
}, "chart.brush.map.core");
