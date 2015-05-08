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

			// 맵 오버 효과 이벤트
			this.on("map.mouseover", function(obj, e) {
				if(activePath == obj.element) return;

				originFill = obj.element.styles.fill || obj.element.attributes.fill;
				obj.element.css({
					fill: chart.theme("mapSelectorColor")
				});
			});
			this.on("map.mouseout", function(obj, e) {
				if(activePath == obj.element) return;

				obj.element.css({
					fill: originFill
				});
			});

			// 맵 패스 액티브 이벤트
			if(brush.activeEvent != null) {
				this.on(brush.activeEvent, function(obj, e) {
					activePath = obj.element;

					axis.map.each(function (i, obj) {
						obj.element.css({
							fill: originFill
						});
					});

					obj.element.css({
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
