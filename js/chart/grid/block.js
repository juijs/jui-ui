jui.define("chart.grid.block", ["util.scale"], function(UtilScale) {

	var Grid = function(orient, grid) {

		this.drawBlock = function(chart, orient, g, scale) {

			var full = grid.full;
			var points = scale.range();
			var domain = scale.domain();			
			var band = scale.rangeBand();
			var half_band = (full) ? 0 : band / 2;
			var format = grid.format;
			var bar = 6;


			if (orient == 'top') {

				for (var i = 0; i < points.length; i++) {

					var axis = chart.svg.group({
						"transform" : "translate(" + points[i] + ", 0)"
					})

					axis.append(chart.svg.line({
						x1 : 0,
						y1 : 0,
						x2 : 0,
						y2 : -bar,
						stroke : chart.theme("gridAxisBorderColor"),
						"stroke-width" : chart.theme("gridBorderWidth"),
						"stroke-opacity" : 1
					}));

					axis.append(chart.text({
						x : half_band,
						y : -20,
						'text-anchor' : 'middle'
					}, (format) ? format(domain[i]) : domain[i]))

					g.append(axis);
				}

				if (full) {
					g.append(chart.svg.group({
						"transform" : "translate(" + (points[points.length-1] + band) + ", 0)"
					}, function() {
						chart.svg.line({
							x1 : 0,
							y1 : 0,
							x2 : 0,
							y2 : -bar,
							stroke : chart.theme("gridAxisBorderColor"),
							"stroke-width" : chart.theme("gridBorderWidth"),
							"stroke-opacity" : 1
						});
					}));
				}

			} else if (orient == 'bottom') {

				var full_height = chart.height();

				for (var i = 0; i < points.length; i++) {

					var axis = chart.svg.group({
						"transform" : "translate(" + points[i] + ", 0)"
					})

					axis.append(chart.svg.line({
						x1 : -half_band,
						y1 : 0,
						x2 : -half_band,
						y2 : (grid.line) ? -full_height : bar,
						stroke : chart.theme("gridAxisBorderColor"),
						"stroke-width" : chart.theme("gridBorderWidth"),
						"stroke-opacity" : 1
					}));

					axis.append(chart.text({
						x : 0,
						y : 20,
						'text-anchor' : 'middle',
						fill : chart.theme("gridFontColor")
					}, (format) ? format(domain[i]) : domain[i]))

					g.append(axis);
				}

				var axis = chart.svg.group({
					"transform" : "translate(" + (points[points.length - 1] + band) + ", 0)"
				})

				axis.append(chart.svg.line({
					x1 : -half_band,
					y1 : 0,
					x2 : -half_band,
					y2 : (grid.line) ? -full_height : bar,
					stroke : chart.theme("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth"),
					"stroke-opacity" : 1
				}));

				g.append(axis);
			} else if (orient == 'left') {
				var full_width = chart.width();

				for (var i = 0; i < points.length; i++) {

					var axis = chart.svg.group({
						"transform" : "translate(0, " + points[i] + ")"
					})

					axis.append(chart.svg.line({
						x1 : 0,
						y1 : -half_band,
						x2 : (grid.line) ? full_width : -bar,
						y2 : -half_band,
						stroke : chart.theme("gridBorderColor"),
						"stroke-width" : chart.theme("gridBorderWidth"),
						"stroke-opacity" : 1
					}));

					axis.append(chart.text({
						x : -bar - 4,
						y : 0,
						'text-anchor' : 'end',
						fill : chart.theme("gridFontColor")
					}, (format) ? format(domain[i]) : domain[i]))

					g.append(axis);
				}

				var axis = chart.svg.group({
					"transform" : "translate(0, " + (points[points.length - 1] + band) + ")"
				})

				axis.append(chart.svg.line({
					x1 : 0,
					y1 : -half_band,
					x2 : (grid.line) ? full_width : -bar,
					y2 : -half_band,
					stroke : chart.theme("gridBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth"),
					"stroke-opacity" : 1
				}));

				g.append(axis);

			} else if (orient == 'right') {
				for (var i = 0; i < points.length; i++) {

					var axis = chart.svg.group({
						"transform" : "translate(0, " + points[i] + ")"
					})

					axis.append(chart.svg.line({
						x1 : 0,
						y1 : 0,
						x2 : bar,
						y2 : 0,
						stroke : chart.theme("gridBorderColor"),
						"stroke-width" : chart.theme("gridBorderWidth"),
						"stroke-opacity" : 1
					}));

					axis.append(chart.text({
						x : bar + 4,
						y : half_band,
						'text-anchor' : 'start',
						fill : chart.theme("gridFontColor")
					}, (format) ? format(domain[i]) : domain[i]))

					g.append(axis);
				}
			}

			return this.wrapper(chart, scale, grid.key);
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
		}

		this.draw = function(chart) {

			var root = chart.svg.group({
				'class' : 'grid block'
			})

			this.drawBlock(chart, orient, root, this.scale);

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

			return this.scale;
		}
	}

	return Grid;
}, "chart.grid");
