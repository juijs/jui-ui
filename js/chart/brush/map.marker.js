jui.define("chart.brush.map.marker", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.flightroute
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapMarkerBrush = function(chart, axis, brush) {
		this.draw = function() {
            var g = chart.svg.group(),
                w = brush.width,
                h = brush.height;

            this.eachData(function(i, d) {
                var id = axis.getValue(d, "id", null),
                    xy = axis.map(id);

                if(xy != null) {
                    var html = _.typeCheck("function", brush.html) ? brush.html.call(chart, d) : brush.html,
                        svg = _.typeCheck("function", brush.svg) ? brush.svg.call(chart, d) : brush.svg,
                        cx = xy.x - w / 2,
                        cy = xy.y - h / 2;

                    if(_.typeCheck("string", html) && html != "") {
                        var obj = chart.svg.foreignObject({
                            width: w,
                            height: h
                        }).html(html).translate(cx, cy);

                        g.append(obj);
                    }

                    if(_.typeCheck("string", svg) && svg != "") {
                        var obj = chart.svg.group();
                        obj.html(svg).translate(cx, cy);

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
            html : null,
            svg : null
        }
    }

	return MapMarkerBrush;
}, "chart.brush.map.core");
