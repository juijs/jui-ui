jui.define("chart.brush.map.selector", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.over 
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapSelectorBrush = function(chart, axis, brush) {
		var activePath = null;

		this.draw = function() {
			var g = chart.svg.group(),
				originFill = null;

			this.on("map.mouseover", function(obj, e) {
				if(activePath == obj.path) return;

				originFill = obj.path.styles.fill || obj.path.attributes.fill;
				obj.path.css({
					fill: chart.theme("mapSelectorColor")
				});
			});
			this.on("map.mouseout", function(obj, e) {
				if(activePath == obj.path) return;

				obj.path.css({
					fill: originFill
				});
			});

			if(brush.activeEvent != null) {
				this.on(brush.activeEvent, function(obj, e) {
					activePath = obj.path;

					axis.map.each(function(i, obj) {
						obj.path.css({
							fill: originFill
						});
					});

					obj.path.css({
						fill: chart.theme("mapSelectorActiveColor")
					});
				});
			}

			return g;
		}
	}

	MapSelectorBrush.setup = function() {
		return {
			activeEvent: null
		}
	}

	return MapSelectorBrush;
}, "chart.brush.map.core");
