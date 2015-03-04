jui.define("chart.brush.focus", [], function() {
	/**
	 * @class chart.brush.focus
	 *
	 * implements focus brush
	 *
	 * @extends chart.brush.core
	 */
	var FocusBrush = function(chart, axis, brush) {
		var g;

		this.drawFocus = function(start, end) {
			var borderColor = chart.theme("focusBorderColor"),
				borderSize = chart.theme("focusBorderWidth"),
				bgColor = chart.theme("focusBackgroundColor"),
				bgOpacity = chart.theme("focusBackgroundOpacity");

			var height = chart.area('height');

			g = chart.svg.group({}, function() {
				var startX = start,
					endX = end;

				if (brush.hide) {
					return ;
				}

				chart.svg.line({
					stroke: borderColor,
					"stroke-width": borderSize,
					x1: 0,
					y1: 0,
					x2: 0,
					y2: height
				}).translate(startX, 0);

				chart.svg.rect({
					width: Math.abs(endX - startX),
					height: height,
					fill: bgColor,
					opacity: bgOpacity
				}).translate(startX, 0)

				chart.svg.line({
					stroke: borderColor,
					"stroke-width": borderSize,
					x1: 0,
					y1: 0,
					x2: 0,
					y2: height
				}).translate(endX, 0);
			});

			return g;
		}

		this.draw = function() {
			var start = 0, end = 0;

			if(brush.start == -1 || brush.end == -1) {
				return this.chart.svg.g();
			}

			if(axis.x.type == "block") {
				start = axis.x(brush.start) - axis.x.rangeBand() / 2;
				end = axis.x(brush.end) + axis.x.rangeBand() / 2;
			} else  {
				start = axis.x(brush.start);
				end = axis.x(brush.end);
			}

			return this.drawFocus(start, end);
		}
	}

	FocusBrush.setup = function() {
		return {
			/** @cfg {Integer} [start=-1] Sets a focus start index.*/
			start: -1,

			/** @cfg {Integer} [end=-1] Sets a focus end index. */
			end: -1
		};
	}

	return FocusBrush;
}, "chart.brush.core");