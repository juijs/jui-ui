jui.define("chart.brush.map.selector", [ "util.base" ], function(_) {
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
		var g = null, activePath = null;

		this.drawTooltip = function() {
			this.eachData(function(i, d) {
				var id = axis.getValue(d, "id", null),
					value = axis.getValue(d, "value", 0),
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
						visibility: "hidden"
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
						}).html(text);
					}).translate(xy.x - (w / 2), xy.y - h - ANCHOR);

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

			this.drawTooltip();

			return g;
		}
	}

	MapSelectorBrush.setup = function() {
		return {
			activeEvent: null,
			active: null,
			format: null
		}
	}

	return MapSelectorBrush;
}, "chart.brush.map.core");
