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
				var originFill = path.styles.fill,
					originStroke = path.styles.stroke;

				path.hover(function() {
					$(this).css({
						fill: "blue",
						stroke: "red"
					});
				}, function() {
					$(this).css({
						fill: originFill,
						stroke: originStroke
					});
				});
			});

			return g;
		}
	}

	return MapOverBrush;
}, "chart.brush.map.core");
