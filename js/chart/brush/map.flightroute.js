jui.define("chart.brush.map.flightroute", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.flightroute
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapFlightRouteBrush = function(chart, axis, brush) {
        var g;

        this.drawAirport = function(type, xy) {
            var color = (type == "large") ? "black" : "#CC0000",
                outerSize = 8,
                innerSize = outerSize * 0.4,
                borderWidth = 2;

            var outer = chart.svg.circle({
                r: (type == "large") ? outerSize * 1.33 : outerSize,
                "stroke-width": (type == "large") ? borderWidth * 1.33 : borderWidth,
                "fill": "transparent",
                "fill-opacity": 0,
                "stroke": color
            }).translate(xy.x, xy.y);

            var inner = chart.svg.circle({
                r: (type == "large") ? innerSize * 1.33 : innerSize,
                "stroke-width": 0,
                "fill": color
            }).translate(xy.x, xy.y);

            g.append(outer);
            g.append(inner);
        }

        this.drawRoutes = function(xy, target) {
            var line = chart.svg.line({
                x1: xy.x,
                y1: xy.y,
                x2: target.x,
                y2: target.y,
                stroke: "red",
                "stroke-width": 1
            });

            g.append(line);
        }

        this.drawBefore = function() {
            g = chart.svg.group();
        }

		this.draw = function() {
            this.eachData(function(i, d) {
                var type = axis.getValue(d, "airport", null),
                    routes = axis.getValue(d, "routes", []),
                    xy = axis.map(axis.getValue(d, "id", null));

                if(type != null && xy != null) {
                    for(var j = 0; j < routes.length; j++) {
                        var target = axis.map(routes[j]);

                        if(target != null) {
                            this.drawRoutes(xy, target);
                        }
                    }

                    this.drawAirport(type, xy);
                }
            });

			return g;
		}
	}

    MapFlightRouteBrush.setup = function() {
        return {
            color : null,
            min : 10,
            max : 30
        }
    }

	return MapFlightRouteBrush;
}, "chart.brush.map.core");
