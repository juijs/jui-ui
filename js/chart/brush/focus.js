jui.define("chart.brush.focus", [], function() {
	/**
	 * @class chart.brush.focus
	 * @extends chart.brush.core
	 */
	var FocusBrush = function(chart, axis, brush) {
		var g, grid;

		this.drawFocus = function(start, end) {
			var borderColor = chart.theme("focusBorderColor"),
				borderSize = chart.theme("focusBorderWidth"),
				bgColor = chart.theme("focusBackgroundColor"),
				bgOpacity = chart.theme("focusBackgroundOpacity");

			var width = axis.area("width"),
				height = axis.area("height");

			g = chart.svg.group({}, function() {
				if(brush.hide) return;

				var a = chart.svg.line({
					stroke: borderColor,
					"stroke-width": borderSize,
					x1: 0,
					y1: 0,
					x2: (grid == "x") ? 0 : width,
					y2: (grid == "x") ? height : 0
				});

				var b = chart.svg.rect({
					width: (grid == "x") ? Math.abs(end - start) : width,
					height: (grid == "x") ? height : Math.abs(end - start),
					fill: bgColor,
					opacity: bgOpacity
				});

				var c = chart.svg.line({
					stroke: borderColor,
					"stroke-width": borderSize,
					x1: 0,
					y1: 0,
					x2: (grid == "x") ? 0 : width,
					y2: (grid == "x") ? height : 0
				});

				if(grid == "x") {
					a.translate(start, 0);
					b.translate(start, 0);
					c.translate(end, 0);
				} else {
					a.translate(0, start);
					b.translate(0, start);
					c.translate(0, end);
				}
			});

			return g;
		}

		this.drawBefore = function() {
			grid = (axis.y.type == "range") ? "x" : "y";
		}

		this.draw = function() {
			var start = 0, end = 0;

			if(brush.start == -1 || brush.end == -1) {
				return this.chart.svg.g();
			}

			if(axis[grid].type == "block") {
				var size = axis[grid].rangeBand();

				start = axis[grid](brush.start) - size / 2;
				end = axis[grid](brush.end) + size / 2;
			} else  {
				start = axis[grid](brush.start);
				end = axis[grid](brush.end);
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