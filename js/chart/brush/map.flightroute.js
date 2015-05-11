jui.define("chart.brush.map.flightroute", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.flightroute
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapFlightRouteBrush = function(chart, axis, brush) {
        var g;
        var smallColor, largeColor, borderWidth, lineColor, lineWidth, outerSize;
        var smallRate = 0.4, largeRate = 1.33;

        this.drawAirport = function(type, xy) {
            var color = (type == "large") ? largeColor : smallColor,
                innerSize = outerSize * smallRate;

            var outer = chart.svg.circle({
                r: (type == "large") ? outerSize * largeRate : outerSize,
                "stroke-width": (type == "large") ? borderWidth * largeRate : borderWidth,
                "fill": "transparent",
                "fill-opacity": 0,
                "stroke": color
            }).translate(xy.x, xy.y);

            var inner = chart.svg.circle({
                r: (type == "large") ? innerSize * largeRate : innerSize,
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
                stroke: lineColor,
                "stroke-width": lineWidth
            });

            g.append(line);
        }

        this.drawBefore = function() {
            g = chart.svg.group();
            smallColor = chart.theme("mapFlightRouteAirportSmallColor");
            largeColor = chart.theme("mapFlightRouteAirportLargeColor");
            borderWidth = chart.theme("mapFlightRouteAirportBorderWidth");
            outerSize = chart.theme("mapFlightRouteAirportRadius");
            lineColor = chart.theme("mapFlightRouteLineBorderColor");
            lineWidth = chart.theme("mapFlightRouteLineBorderWidth");
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
        }
    }

	return MapFlightRouteBrush;
}, "chart.brush.map.core");
