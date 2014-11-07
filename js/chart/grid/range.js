jui.define("chart.grid.range", [ "util.scale" ], function(UtilScale) {

	/**
	 * 숫자 범위(range) 그리드 객체 
	 *  
	 * @param {Object} orient
	 * @param {Object} grid
	 */
	var RangeGrid = function(orient, chart, grid) {

		this.top = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x2 : chart.width()
				}));
			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? chart.height() : -bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				axis.append(chart.text({
					x : 0,
					y : -bar - 4,
					"text-anchor" : "middle",
					fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
				}, (grid.format) ? grid.format(ticks[i]) : ticks[i] + ""));

				g.append(axis);
			}
		}

		this.bottom = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x2 : chart.width()
				}));
			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? -chart.height() : bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				axis.append(chart.text({
					x : 0,
					y : bar * 3,
					"text-anchor" : "middle",
					fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
				}, (grid.format) ? grid.format(ticks[i]) : ticks[i] + ""))

				g.append(axis);
			}
		}

		this.left = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y2 : chart.height()
				}));

			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = chart.svg.group({
					"transform" : "translate(0, " + values[i] + ")"
				})

				axis.append(this.line(chart, {
					x2 : (grid.line) ? chart.width() : -bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")					
				}));

				if (!grid.hideText) {
					axis.append(chart.text({
						x : -bar - 4,
						y : bar,
						"text-anchor" : "end",
						fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
					}, (grid.format) ? grid.format(ticks[i]) : ticks[i] + ""));
				}

				g.append(axis);

			}
		}

		this.right = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y2 : chart.height()
				}));
			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = chart.svg.group({
					"transform" : "translate(0, " + values[i] + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? -chart.width() : bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				axis.append(chart.text({
					x : bar + 4,
					y : bar,
					"text-anchor" : "start",
					fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
				}, (grid.format) ? grid.format(ticks[i]) : ticks[i] + ""));

				g.append(axis);
			}
		}

		this.drawBefore = function() {
			grid = this.setRangeDomain(chart, grid);

			var width = chart.width(), height = chart.height();

			if (orient == "left" || orient == "right") {
				this.scale = UtilScale.linear().domain(grid.domain).range([height, 0]);
			} else {
				this.scale = UtilScale.linear().domain(grid.domain).range([0, width]);
			}

			this.step = grid.step;
			this.nice = grid.nice;
			this.ticks = this.scale.ticks(this.step, this.nice);
			this.bar = 6;

			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = this.scale(this.ticks[i]);
			}
		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "range", grid);
		}

		this.drawSetup = function() {
			return {
				// core options
				domain: null,
				step: 10,
				min: 0,
				max: 0,
				reverse: false,
				key: null,
				hide: false,
				unit: 0,

				// common options
				line: false,
				format: null,
				color : null,

				// range options
				hideText: false,
				nice: false
			}
		}
	}

	return RangeGrid;
}, "chart.grid.core");
