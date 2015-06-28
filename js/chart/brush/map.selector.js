jui.define("chart.brush.map.selector", [ "jquery", "util.base" ], function($, _) {
	var PADDING = 7,
		ANCHOR = 7,
		TEXT_Y = 14;

    /**
     * @class chart.brush.over 
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapSelectorBrush = function(chart, axis, brush) {
		var self = this;
		var g = null, tooltips = {},
			activePath = null, activeTooltip = null;

		this.drawTooltip = function() {
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
						visibility: ($.inArray(id, brush.tooltip) != -1) ? "visibility" : "hidden"
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
						}).text(text);

						for(var i = 0, len = texts.length; i < len; i++) {
							chart.text({
								"font-size": chart.theme("tooltipFontSize"),
								"fill": chart.theme("tooltipFontColor"),
								"text-anchor": "start",
								x: 0,
								y: -(TEXT_Y * (len - i))
							}).text(texts[i]);
						}
					}).translate(xy.x - (w / 2), xy.y - h - ANCHOR);

					tooltips[id] = tooltip;
					g.append(tooltip);
				}
			});
		}

		this.drawBefore = function() {
			g = chart.svg.group();
		}

		this.draw = function() {
			var originFill = null;

			this.on("map.mouseover", function(obj, e) {
				originFill = obj.path.styles.fill || obj.path.attributes.fill;
				obj.path.css({
					fill: chart.theme("mapSelectorColor")
				});
			});
			this.on("map.mouseout", function(obj, e) {
				obj.path.css({
					fill: originFill
				});
			});

			if(brush.tooltipEvent != null) {
				this.on(brush.tooltipEvent, function(obj, e) {
					var targetId = axis.getValue(obj.data, "id");

					if(tooltips[targetId]) {
						for (var id in tooltips) {
							tooltips[id].attr({visibility: (targetId == id) ? "visibility" : "hidden"});
						}
					}
				});
			}

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

			this.drawTooltip();

			return g;
		}
	}

	MapSelectorBrush.setup = function() {
		return {
			active: [],
			activeEvent: null,
			tooltip: [],
			tooltipEvent: null,
			format: null
		}
	}

	return MapSelectorBrush;
}, "chart.brush.map.core");
