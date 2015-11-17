jui.define("chart.brush.map.selector", [ "jquery" ], function($) {

    /**
     * @class chart.brush.over 
     * @extends chart.brush.core
     */
	var MapSelectorBrush = function(chart, axis, brush) {
		var g = null,
			activePath = null;

		this.drawBefore = function() {
			g = chart.svg.group();
		}

		this.draw = function() {
			var originFill = null;

			this.on("map.mouseover", function(obj, e) {
				if(activePath == obj.path) return;

				originFill = obj.path.styles.fill || obj.path.attributes.fill;
				obj.path.css({
					fill: chart.theme("mapSelectorHoverColor")
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

			if(brush.active.length > 0) {
				activePath = [];

				axis.map.each(function(i, obj) {
					if($.inArray(axis.getValue(obj.data, "id"), brush.active) != -1) {
						activePath.push(obj.path);

						obj.path.css({
							fill: chart.theme("mapSelectorActiveColor")
						});
					}
				});
			}

			return g;
		}
	}

	MapSelectorBrush.setup = function() {
		return {
			active: [],
			activeEvent: null
		}
	}

	return MapSelectorBrush;
}, "chart.brush.map.core");
