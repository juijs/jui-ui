jui.define("chart.brush.map.bubble", [ "util.base", "util.math" ], function(_, math) {

    /**
     * @class chart.brush.map.bubble
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

        this.drawText = function(value, x, y) {
            var text = value;

            if(_.typeCheck("function", this.brush.format)) {
                text = this.format(value);
            }

            var elem = this.chart.text({
                "font-size" : this.chart.theme("mapBubbleFontSize"),
                fill : this.chart.theme("mapBubbleFontColor"),
                x : x,
                y : y + 3,
                "text-anchor" : "middle"
            }, text);

            return elem;
        }

		this.draw = function() {
            var g = chart.svg.group(),
                minmax = getMinMaxValues();

            this.eachData(function(i, d) {
                var value = axis.getValue(d, "value", 0),
                    size = math.scaleValue(value, minmax.min, minmax.max, brush.min, brush.max),
                    xy = axis.map(axis.getValue(d, "id", null)),
                    color = this.color(i, 0);

                if(xy != null) {
                    var c = chart.svg.circle({
                        cx: xy.x,
                        cy: xy.y,
                        r: size,
                        "fill": color,
                        "fill-opacity": chart.theme("mapBubbleBackgroundOpacity"),
                        "stroke": color,
                        "stroke-width": chart.theme("mapBubbleBorderWidth")
                    });

                    g.append(c);

                    // 가운데 텍스트 보이기
                    if(this.brush.showText) {
                        g.append(this.drawText(value, xy.x, xy.y));
                    }
                }
            });

			return g;
		}
	}

    MapBubbleBrush.setup = function() {
        return {
            min : 10,
            max : 30,
            showText : false,
            format : null
        }
    }

	return MapBubbleBrush;
}, "chart.brush.map.core");
