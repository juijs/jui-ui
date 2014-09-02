jui.define("chart.grid.block", [ "util.scale" ], function(UtilScale) {

	var BlockGrid = function(orient, grid) {

		this.top = function(chart, g, scale) {

			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x2 : chart.width(),
				}))
			}

			for (var i = 0; i < this.points.length; i++) {

				var axis = chart.svg.group({
					"transform" : "translate(" + this.points[i] + ", 0)"
				})

				axis.append(this.line(chart, {
					x1 : -this.half_band,
					y1 : 0,
					x2 : -this.half_band,
					y2 : -this.bar
				}));

				axis.append(chart.text({
					x : 0,
					y : -20,
					'text-anchor' : 'middle'
				}, (grid.format) ? grid.format(this.domain[i]) : this.domain[i]))

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(" + chart.width() + ", 0)"
				})

				axis.append(this.line(chart, {
					y2 : -this.bar
				}));

				g.append(axis);
			}

		}
		this.bottom = function(chart, g, scale) {
			var full_height = chart.height();

			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x2 : chart.width(),
				}))
			}

			for (var i = 0; i < this.points.length; i++) {

				var axis = chart.svg.group({
					"transform" : "translate(" + this.points[i] + ", 0)"
				})

				axis.append(this.line(chart, {
					x1 : -this.half_band,
					y1 : 0,
					x2 : -this.half_band,
					y2 : (grid.line) ? -full_height : this.bar
				}));

				axis.append(chart.text({
					x : 0,
					y : 20,
					'text-anchor' : 'middle',
					fill : chart.theme("gridFontColor")
				}, (grid.format) ? grid.format(this.domain[i]) : this.domain[i]))

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(" + chart.width() + ", 0)"
				})

				axis.append(this.line(chart, {
					y2 : (grid.line) ? -chart.height() : this.bar
				}));

				g.append(axis);

			}

		}
		this.left = function(chart, g, scale) {
			var full_width = chart.width();

			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y2 : chart.height()
				}))
			}

			for (var i = 0; i < this.points.length; i++) {

				var axis = chart.svg.group({
					"transform" : "translate(0, " + (this.points[i] - this.half_band ) + ")"
				})

				axis.append(this.line(chart, {
					x2 : (grid.line) ? full_width : -this.bar
				}));

				axis.append(chart.text({
					x : -this.bar - 4,
					y : this.half_band,
					'text-anchor' : 'end'
				}, (grid.format) ? grid.format(this.domain[i]) : this.domain[i]))

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(0, " + chart.height() + ")"
				})

				axis.append(this.line(chart, {
					x2 : (grid.line) ? chart.width() : -this.bar
				}));

				g.append(axis);
			}

		}

		this.right = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y2 : chart.height()
				}))
			}

			for (var i = 0; i < this.points.length; i++) {

				var axis = chart.svg.group({
					"transform" : "translate(0, " + (this.points[i] - this.half_band) + ")"
				})

				axis.append(this.line(chart, {
					x2 : (grid.line) ? -chart.width() : this.bar
				}));

				axis.append(chart.text({
					x : this.bar + 4,
					y : this.half_band,
					'text-anchor' : 'start'
				}, (grid.format) ? grid.format(this.domain[i]) : this.domain[i]))

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(0, " + chart.height() + ")"
				})

				axis.append(this.line(chart, {
					x2 : (grid.line) ? -chart.width() : this.bar
				}));

				g.append(axis);

			}
		}

		this.drawBefore = function(chart) {
			grid.type = grid.type || "block";
			grid = this.setBlockDomain(chart, grid);

			var width = chart.width();
			var height = chart.height();
			var max = (orient == 'left' || orient == 'right') ? height : width;

			this.scale = UtilScale.ordinal().domain(grid.domain);
			var range = [0, max];

			if (grid.full) {
				this.scale.rangeBands(range);
			} else {
				this.scale.rangePoints(range);
			}

			this.points = this.scale.range();
			this.domain = this.scale.domain();
			this.band = this.scale.rangeBand();
			this.half_band = (grid.full) ? 0 : this.band / 2;
			this.bar = 6;
		}

		this.draw = function(chart) {

			return this.drawGrid(chart, orient, 'block', grid);
		}
	}

	return BlockGrid;
}, "chart.grid.core");
