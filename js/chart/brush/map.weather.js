jui.define("chart.brush.map.weather", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.bubble
     * @extends chart.brush.core
     */
	var MapWeatherBrush = function(chart, axis, brush) {
        var self = this;
        var W = 66,
            H = 60,
            R = 5,
            IMAGES = {
                sunny: "data:image/gif;base64,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",
                cloudy: "data:image/gif;base64,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",
                murky: "data:image/gif;base64,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",
                rain: "data:image/gif;base64,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",
                snow: "data:image/gif;base64,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"
            };

        function getFormat(id) {
            var name = null;

            if(_.typeCheck("function", brush.format)) {
                name = self.format(id);
            }

            return (name && name != "") ? name : id;
        }

        function createWeather(id, name, uri, temp) {
            var xy = axis.map(id);
            if(xy == null) return;

            var g = chart.svg.group(),
                rect = chart.svg.rect({
                    width: W + 2,
                    height: H,
                    rx: R,
                    ry: R,
                    fill: chart.theme("mapWeatherBackgroundColor"),
                    stroke: chart.theme("mapWeatherBorderColor"),
                    "stroke-width": 1
                }),
                img = chart.svg.image({
                    x: 1,
                    y: 2,
                    width: W,
                    height: 45,
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": uri
                }),
                title = chart.svg.text({
                    x: W / 2,
                    dy: -4,
                    "font-size" : chart.theme("mapWeatherFontSize"),
                    "font-weight": "bold",
                    "text-anchor": "middle",
                    fill: chart.theme("mapWeatherTitleFontColor")
                }).text(name),
                info = chart.svg.text({
                    x: W / 2,
                    dy: 54,
                    "font-size" : chart.theme("mapWeatherFontSize"),
                    "text-anchor": "middle",
                    fill: chart.theme("mapWeatherInfoFontColor")
                }).text(temp);

            g.append(rect);
            g.append(img);
            g.append(title);
            g.append(info);
            g.translate(xy.x - W/2, xy.y - H/2);

            return g;
        }

		this.draw = function() {
            var g = chart.svg.group();

            this.eachData(function(i, d) {
                var id = axis.getValue(d, "id", null),
                    temp = axis.getValue(d, "temperature", 0),
                    icon = axis.getValue(d, "weather", "sunny");

                g.append(createWeather(id, getFormat(id), IMAGES[icon], temp));
            });

			return g;
		}
	}

    MapWeatherBrush.setup = function() {
        return {
            format: null
        }
    }

	return MapWeatherBrush;
}, "chart.brush.map.core");
