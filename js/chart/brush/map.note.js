jui.define("chart.brush.map.note", [ "jquery", "util.base" ], function($, _) {
	var PADDING = 7,
		ANCHOR = 7,
		TEXT_Y = 14;

    /**
     * @class chart.brush.over 
     * @extends chart.brush.core
     */
	var MapNoteBrush = function(chart, axis, brush) {
		var self = this;
		var g = null,
			tooltips = {};

		this.drawBefore = function() {
			g = chart.svg.group();
		}

		this.draw = function() {
			if(brush.activeEvent != null) {
				this.on(brush.activeEvent, function(obj, e) {
					var targetId = axis.getValue(obj.data, "id");

					if(tooltips[targetId]) {
						for (var id in tooltips) {
							tooltips[id].attr({ visibility: (targetId == id) ? "visibility" : "hidden" });
						}
					}
				});
			}

			this.eachData(function(i, d) {
				var id = axis.getValue(d, "id"),
					value = axis.getValue(d, "value", 0),
					texts = axis.getValue(d, "texts", []),
					text = id + ": " + value,
					xy = axis.map(id);

				if(_.typeCheck("function", brush.format)) {
					text = self.format(d);
				}

				var size = chart.svg.getTextSize(text),
					w = size.width + (PADDING * 2),
					h = size.height;

				if(xy != null) {
					var tooltip = chart.svg.group({
						visibility: ($.inArray(id, brush.active) != -1) ? "visibility" : "hidden"
					}, function() {
						chart.svg.polygon({
							points: self.balloonPoints("top", w, h, ANCHOR),
							fill: chart.theme("tooltipBackgroundColor"),
							"fill-opacity": chart.theme("tooltipBackgroundOpacity"),
							stroke: chart.theme("tooltipBorderColor"),
							"stroke-width": 1
						});

						chart.text({
							"font-size": chart.theme("tooltipFontSize"),
							"fill": chart.theme("tooltipFontColor"),
							"text-anchor": "middle",
							x: w / 2,
							y: TEXT_Y
						}, text);

						chart.texts({
							"font-size": chart.theme("tooltipFontSize"),
							"fill": chart.theme("tooltipFontColor"),
							"text-anchor": "start"
						}, texts, 1.2).translate(0, -(TEXT_Y * texts.length));

					}).translate(xy.x - (w / 2), xy.y - h - ANCHOR);

					tooltips[id] = tooltip;
					g.append(tooltip);
				}
			});

			return g;
		}
	}

	MapNoteBrush.setup = function() {
		return {
			active: [],
			activeEvent: null,
			format: null
		}
	}

	return MapNoteBrush;
}, "chart.brush.map.core");
