jui.define("chart.brush.map.bubble", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.bubble
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapBubbleBrush = function(chart, axis, brush) {
        var self = this;

        function getMinMaxValues() {
            var min = 0,
                max = 0,
                dataList = self.listData();

            for(var i = 0; i < dataList.length; i++) {
                var value = axis.getValue(dataList[i], "value", 0);

                min = (i == 0) ? value : Math.min(value, min);
                max = (i == 0) ? value : Math.max(value, max);
            }

            return {
                min: min,
                max: max
            }
        }

		this.draw = function() {
            var g = chart.svg.group(),
                color = _.typeCheck("string", brush.color) ? chart.color(brush.color) : this.color(0),
                minmax = getMinMaxValues();

            this.eachData(function(i, d) {
                var value = axis.getValue(d, "value", 0),
                    size = this.getScaleValue(value, minmax.min, minmax.max, brush.min, brush.max),
                    xy = axis.map(axis.getValue(d, "id", null));

                if(xy != null) {
                    if(_.typeCheck("function", brush.color)) {
                        color = chart.color(brush.color.call(chart, d) || color);
                    }

                    var c = chart.svg.circle({
                        r: size,
                        "fill": color,
                        "fill-opacity": chart.theme("mapBubbleBackgroundOpacity"),
                        "stroke": color,
                        "stroke-width": chart.theme("mapBubbleBorderWidth")
                    });

                    c.translate(xy.x, xy.y);
                    g.append(c);
                }
            });

			return g;
		}
	}

    MapBubbleBrush.setup = function() {
        return {
            color : null,
            min : 10,
            max : 30
        }
    }

	return MapBubbleBrush;
}, "chart.brush.map.core");
