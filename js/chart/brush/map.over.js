jui.define("chart.brush.map.over", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.over 
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapOverBrush = function() {

		this.draw = function() {
			var g = this.chart.svg.group();

			this.axis.map.group(function(i, path) {
				path.hover(function() {
					$(this).attr({
						fill : "blue",
						stroke : "red",
						'stroke-width' : 0.5
					});
				}, function() {
					$(this).attr({
						fill: "",
						stroke: "",
						'stroke-width': 0
					});
				});
			});

			return g;
		}
	}

	return MapOverBrush;
}, "chart.brush.map.core");
