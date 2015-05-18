jui.define("chart.brush.map.marker", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.flightroute
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapMarkerBrush = function(chart, axis, brush) {
        var g;

		this.draw = function() {
            g = chart.svg.group();

            this.eachData(function(i, d) {
                var id = axis.getValue(d, "id", null),
                    xy = axis.map(id);

                if(xy != null) {
                    var w = brush.width,
                        h = brush.height,
                        html = _.typeCheck("function", brush.markup) ? brush.markup(d) : brush.markup;

                    if(html != "") {
                        var obj = chart.svg.foreignObject({
                            width: w,
                            height: h
                        }).html(html).translate(xy.x - w / 2, xy.y - h / 2);

                        g.append(obj);
                    }
                }
            });

			return g;
		}
	}

    MapMarkerBrush.setup = function() {
        return {
            width : 0,
            height : 0,
            markup : null
        }
    }

	return MapMarkerBrush;
}, "chart.brush.map.core");
