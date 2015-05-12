jui.define("chart.brush.map.flightroute", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.flightroute
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapFlightRouteBrush = function(chart, axis, brush) {
        var self = this;
        var g, tooltip;
        var smallColor, largeColor, borderWidth, lineColor, lineWidth, outerSize;
        var smallRate = 0.4, largeRate = 1.33, padding = 7, anchor = 7, textY = 14;

        function printTooltip(obj) {
            var msg = obj.data.title;

            if(_.typeCheck("string", msg) && msg != "") {
                tooltip.get(1).text(msg);
                tooltip.get(1).attr({ "text-anchor": "middle" });
            }

            return msg;
        }

        function setOverEffect(type, xy, outer, inner) {
            outer.hover(over, out);
            inner.hover(over, out);

            function over(e) {
                if(!printTooltip(xy)) return;

                var color = (type == "large") ? smallColor : largeColor,
                    size = tooltip.get(1).size(),
                    innerSize = outerSize * smallRate,
                    w = size.width + (padding * 2),
                    h = size.height + padding;

                tooltip.get(1).attr({ x: w / 2 });
                tooltip.get(0).attr({
                    points: self.balloonPoints("top", w, h, anchor),
                    stroke: color
                });
                tooltip.attr({ visibility: "visible" });
                tooltip.translate(xy.x - (w / 2), xy.y - h - anchor - innerSize);

                outer.attr({ stroke: color });
                inner.attr({ fill: color });
            }

            function out(e) {
                var color = (type == "large") ? largeColor : smallColor;

                tooltip.attr({ visibility: "hidden" });
                outer.attr({ stroke: color });
                inner.attr({ fill: color });
            }
        }

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

            // 마우스오버 이벤트 설정
            setOverEffect(type, xy, outer, inner);
        }

        this.drawRoutes = function(target, xy) {
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
            tooltip = chart.svg.group({
                visibility: "hidden"
            }, function() {
                chart.svg.polygon({
                    fill: chart.theme("tooltipBackgroundColor"),
                    "fill-opacity": chart.theme("tooltipBackgroundOpacity"),
                    stroke: chart.theme("tooltipBorderColor"),
                    "stroke-width": 2
                });

                chart.text({
                    "font-size": chart.theme("tooltipFontSize"),
                    "fill": chart.theme("tooltipFontColor"),
                    y: textY
                });
            });

            smallColor = chart.theme("mapFlightRouteAirportSmallColor");
            largeColor = chart.theme("mapFlightRouteAirportLargeColor");
            borderWidth = chart.theme("mapFlightRouteAirportBorderWidth");
            outerSize = chart.theme("mapFlightRouteAirportRadius");
            lineColor = chart.theme("mapFlightRouteLineBorderColor");
            lineWidth = chart.theme("mapFlightRouteLineBorderWidth");
        }

		this.draw = function() {
            this.eachData(function(i, d) {
                var id = axis.getValue(d, "id", null),
                    type = axis.getValue(d, "airport", null),
                    routes = axis.getValue(d, "routes", []),
                    xy = axis.map(id);

                if(type != null && xy != null) {
                    for(var j = 0; j < routes.length; j++) {
                        var target = axis.map(routes[j]);

                        if(target != null) {
                            this.drawRoutes(target, xy);
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
