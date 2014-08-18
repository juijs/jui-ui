jui.define("chart.grid.block", ["chart.util"], function(util) {

	var Grid = function(orient, grid) {
		var self = this;

		function drawBlock(chart, orient, domain, range, full) {

			var g = chart.svg.group();
			var scale = util.scale.ordinal().domain(domain);

			var max = range[0];
			var min = range[0];

			for (var i = 0; i < range.length; i++) {
				if (range[i] > max)
					max = range[i];
				else if (range[i] < min)
					min = range[i];
			}

			if (full) {
				var points = scale.rangeBands(range).range();
			} else {
				var points = scale.rangePoints(range).range();
			}

			var band = scale.rangeBand();
			var values = [];
			var half_band = (full) ? 0 : band / 2;

			if (orient == 'top') {

				var height = 30;
				var bar = 6;
				var barY = height - bar;

				g.append(chart.svg.line({
					x1 : 0,
					y1 : height + 0.5,
					x2 : max,
					y2 : height + 0.5,
					stroke : "black",
					"stroke-width" : 0.5
				}));

				for (var i = 0; i < points.length; i++) {
					values[i] = {
						point : points[i],
						band : band
					};

					g.append(chart.svg.group({
						"transform" : "translate(" + points[i] + ", 0)"
					}, function() {
						chart.svg.line({
							x1 : 0,
							y1 : barY,
							x2 : 0,
							y2 : height,
							stroke : "black",
							"stroke-width" : 0.5
						});

						chart.svg.text({
							x : half_band,
							y : 20,
							'text-anchor' : 'middle'
						}, domain[i])
					}));
				}

			} else if (orient == 'bottom') {
				var height = 30;
				var bar = 6;
				var barY = height - bar;

				g.append(chart.svg.line({
					x1 : 0,
					y1 : 0.5,
					x2 : max,
					y2 : 0.5,
					stroke : "black",
					"stroke-width" : 0.5
				}));

				for (var i = 0; i < points.length; i++) {
					values[i] = {
						point : points[i],
						band : band
					};

					g.append(chart.svg.group({
						"transform" : "translate(" + points[i] + ", 0)"
					}, function() {
						chart.svg.line({
							x1 : 0.5,
							y1 : 0,
							x2 : 0.5,
							y2 : bar,
							stroke : "black",
							"stroke-width" : 0.5
						});

						chart.svg.text({
							x : half_band,
							y : 20,
							'text-anchor' : 'middle'
						}, domain[i])
					}));
				}

			} else if (orient == 'left') {
				var width = 30;
				var bar = 6;
				var barX = width - bar;

				g.append(chart.svg.line({
					x1 : width + 0.5,
					y1 : 0,
					x2 : width + 0.5,
					y2 : max,
					stroke : "black",
					"stroke-width" : 0.5
				}));

				for (var i = 0; i < points.length; i++) {
					values[i] = {
						point : points[i],
						band : band
					};

					g.append(chart.svg.group({
						"transform" : "translate(0, " + points[i] + ")"
					}, function() {
						chart.svg.line({
							x1 : barX,
							y1 : 0.5,
							x2 : width + chart.area('width'),
							y2 : 0.5,
							stroke : "black",
							"stroke-width" : 0.5
						});

						chart.svg.text({
							x : bar * 4,
							y : half_band,
							'text-anchor' : 'end'
						}, domain[i])
					}));
				}

			} else if (orient == 'right') {
				var width = 30;
				var bar = 6;
				var barX = width - bar;

				g.append(chart.svg.line({
					x1 : 0,
					y1 : 0,
					x2 : 0,
					y2 : max,
					stroke : "black",
					"stroke-width" : 0.5
				}));

				for (var i = 0; i < points.length; i++) {
					values[i] = {
						point : points[i],
						band : band
					};

					g.append(chart.svg.group({
						"transform" : "translate(0, " + points[i] + ")"
					}, function() {
						chart.svg.line({
							x1 : 0,
							y1 : 0,
							x2 : bar,
							y2 : 0,
							stroke : "black",
							"stroke-width" : 0.5
						});

						chart.svg.text({
							x : bar,
							y : half_band,
							'text-anchor' : 'start'
						}, domain[i])
					}));
				}
			}

			return {
				g : g,
				scale : scale,
				values : values
			};
		}


		this.drawBefore = function(chart) {
			grid.type = grid.type || "block";
			grid = this.setBlockDomain(chart, grid);
		}

		this.draw = function(chart) {

			var width = chart.area('width'), height = chart.area('height'), max = (orient == 'left' || orient == 'right') ? height : width;

			var obj = drawBlock(chart, orient, grid.domain, [0, max], grid.full);

			if (orient == 'left') {
				var x = chart.area('x') - 30;
				var y = chart.area('y');
			} else if (orient == 'right') {
				var x = chart.area('x2');
				var y = chart.area('y');
			} else if (orient == 'top') {
				var x = chart.area('x');
				var y = chart.area('y') - 30;
			} else if (orient == 'bottom') {
				var x = chart.area('x');
				var y = chart.area('y2');
			}

			obj.g.translate(x, y);
			obj.key = grid.key;

			return obj;
		}
	}

	return Grid;
}, "chart.grid");
