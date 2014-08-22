jui.define("chart.grid.block", ["chart.util"], function(util) {

	var Grid = function(orient, grid) {
		var self = this;
		var size;

		function drawBlock(chart, orient, domain, range, full) {

			var g = chart.svg.group({
				'class' : 'grid block'
			});
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
			
			console.log(points);

			var band = scale.rangeBand();
			var values = [];
			var half_band = (full) ? 0 : band / 2;

			if (orient == 'top') {

				var height = chart.widget('top').size;
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
				var height = chart.widget.size('bottom');
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
							x1 : -band/2,
							y1 : 0,
							x2 : -band/2,
							y2 : bar,
							stroke : "black",
							"stroke-width" : 1
						});

						chart.svg.text({
							x : 0,
							y : 20,
							'text-anchor' : 'middle'
						}, domain[i])
					}));
				}

			} else if (orient == 'left') {
				var width = chart.widget('left').size;
				var bar = 6;
				var barX = width - bar;

				g.append(chart.svg.line({
					x1 : Math.round(width),
					y1 : 0,
					x2 : Math.round(width),
					y2 : max,
					stroke : "black",
					"stroke-width" : 1
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
							x2 : width,
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
				var width = chart.widget('right').size;
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

			scale.result = {
				g : g, 
				values : values 
			}
			
			return scale; 
		}


		this.drawBefore = function(chart) {
			grid.type = grid.type || "block";
			grid = this.setBlockDomain(chart, grid);
		}

		this.draw = function(chart) {

			var width = chart.area('width'), height = chart.area('height'), max = (orient == 'left' || orient == 'right') ? height : width;

			var scale = drawBlock(chart, orient, grid.domain, [0, max], grid.full);
			if (orient == 'left') {
				var x = chart.area('x') - chart.widget('left').size;
				var y = chart.area('y');
			} else if (orient == 'right') {
				var x = chart.area('x2');
				var y = chart.area('y');
			} else if (orient == 'top') {
				var x = chart.area('x');
				var y = chart.area('y') - chart.widget('top').size;
			} else if (orient == 'bottom') {
				var x = chart.area('x');
				var y = chart.area('y2');
			}

			scale.result.g.translate(x, y);
			scale.key = grid.key;

			return scale;
		}
	}

	return Grid;
}, "chart.grid");
