jui.define("chart.grid.range", ["util.scale"], function(UtilScale) {

	/**
	 *
	 * @param {Object} orient
	 * @param {Object} grid
	 */
	var Grid = function(orient, grid) {
		var self = this;

		this.drawRange = function(chart, orient, g, scale, step, format, nice) {
			step = step || 10;

			var ticks = scale.ticks(step, nice || false);
			var bar = 6;
			var values = []

			var max = scale.max();
			var min = scale.min();

			if (orient == 'left') {

				if (grid.line) {
					g.append(chart.svg.line({
						x1 : 0,
						y1 : 0,
						x2 : 0,
						y2 : chart.height(),
						stroke : chart.theme("gridAxisBorderColor"),
						"stroke-width" : chart.theme("gridAxisBorderWidth"),
						"stroke-opacity" : 1
					}));

				}

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var isZero = (ticks[i] == 0 && ticks[i] != scale.min());

					var axis = chart.svg.group({
						"transform" : "translate(0, " + values[i] + ")"
					})

					axis.append(chart.svg.line({
						x1 : 0,
						y1 : 0,
						x2 : (grid.line) ? chart.width() : -bar ,
						y2 : 0,
						stroke : chart.theme(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
						"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth"),
						"stroke-opacity" : 1
					}));

					axis.append(chart.text({
						x : -bar - 4,
						y : bar,
						'text-anchor' : 'end',
						fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
					}, (format) ? format(ticks[i]) : ticks[i] + ""));

					g.append(axis);

				}

			} else if (orient == 'bottom') {

				if (grid.line) {
					g.append(chart.svg.line({
						x1 : 0,
						y1 : 0,
						x2 : scale(scale.max()),
						y2 : 0,
						stroke : chart.theme("gridAxisBorderColor"),
						"stroke-width" : chart.theme("gridBorderWidth")
					}));
				}

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var isZero = (ticks[i] == 0 && ticks[i] != scale.min());

					var axis = chart.svg.group({
						"transform" : "translate(" + values[i] + ", 0)"
					})

					axis.append(chart.svg.line({
						x1 : 0,
						y1 : -chart.height(),
						x2 : 0,
						y2 : 0,
						stroke : chart.theme(isZero, "gridActiveBorderColor", "gridBorderColor"),
						"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth"),
						"stroke-opacity" : 1
					}));

					axis.append(chart.text({
						x : 0,
						y : bar * 3 ,
						'text-anchor' : 'middle',
						fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
					}, (format) ? format(ticks[i]) : ticks[i] + ""))

					g.append(axis);
				}

			} else if (orient == 'top') {
				if (grid.line) {
					g.append(chart.svg.line({
						x1 : 0,
						y1 : 0,
						x2 : scale(scale.max()),
						y2 : 0,
						stroke : chart.theme("gridAxisBorderColor"),
						"stroke-width" : chart.theme("gridAxisBorderWidth")
					}));
				}

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var isZero = (ticks[i] == 0 && ticks[i] != scale.min());

					var axis = chart.svg.group({
						"transform" : "translate(" + values[i] + ", " + barY + ")"
					})

					axis.append(chart.svg.line({
						x1 : 0,
						y1 : -bar,
						x2 : 0,
						y2 : chart.height(),
						stroke : chart.theme(isZero, "gridActiveBorderColor", "gridBorderColor"),
						"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth"),
						"stroke-opacity" : 1
					}));

					axis.append(chart.text({
						x : 0,
						y : -bar - 4,
						'text-anchor' : 'middle',
						fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
					}, (format) ? format(ticks[i]) : ticks[i] + ""));

					axis.append(text);

					g.append(axis);
				}

			} else if (orient == 'right') {

				if (grid.line) {
					g.append(chart.svg.line({
						x1 : 0,
						y1 : 0,
						x2 : 0,
						y2 : scale(scale.min()),
						stroke : chart.theme("gridAxisBorderColor"),
						"stroke-width" : chart.theme("gridAxisBorderWidth")
					}));
				}

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var isZero = (ticks[i] == 0 && ticks[i] != scale.min());

					var axis = chart.svg.group({
						"transform" : "translate(0, " + values[i] + ")"
					})

					axis.append(chart.svg.line({
						x1 : 0,
						y1 : 0,
						x2 : bar,
						y2 : 0,

						stroke : chart.theme(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
						"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth"),
						"stroke-opacity" : 1
					}));

					axis.append(chart.text({
						x : bar + 4,
						y : bar,
						'text-anchor' : 'start',
						fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
					}, (format) ? format(ticks[i]) : ticks[i] + ""));

					g.append(axis);
				}
			}

			return this.wrapper(chart, scale, grid.key);
		}

		this.drawBefore = function(chart) {
			grid = this.setRangeDomain(chart, grid);

			var width = chart.width(), height = chart.height();

			if (orient == 'left' || orient == 'right') {
				this.scale = this.scale = UtilScale.linear().domain(grid.domain).range([height, 0]);
			} else {
				this.scale = this.scale = UtilScale.linear().domain(grid.domain).range([0, width]);
			}

		}

		this.draw = function(chart) {

			var root = chart.svg.group({
				'class' : 'grid range',
			})

			this.drawRange(chart, orient, root, this.scale, grid.step, grid.format, grid.nice);

			if (orient == 'left') {
				var x = chart.x();
				var y = chart.y();
			} else if (orient == 'right') {
				var x = chart.x2();
				var y = chart.y();
			} else if (orient == 'top') {
				var x = chart.x();
				var y = chart.y();
			} else if (orient == 'bottom') {
				var x = chart.x();
				var y = chart.y2();
			}

			root.translate(x, y);

			if (grid.hide) {
				root.attr({ display : 'none' })
			}

			this.scale.key = grid.key;

			return this.scale;
		}
	}

	return Grid;
}, "chart.grid");
