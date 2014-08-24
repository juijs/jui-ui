jui.define("chart.grid.block", ["chart.util"], function(util) {

	var Grid = function(orient, grid) {
		var self = this;
		var size;

		function drawBlock(chart, orient, g, domain, range, full) {

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
			var format = grid.format; 

			if (orient == 'top') {

				var height = chart.widget.size('top');
				var bar = 6;
				var barY = height - bar;

				g.append(chart.svg.line({
					x1 : 0,
					y1 : height,
					x2 : max,
					y2 : height,
					stroke : "black",
					"stroke-width" : 1
				}));

				for (var i = 0; i < points.length; i++) {
					values[i] = {
						point : points[i],
						band : band
					};


					var axis = chart.svg.group({
							"transform" : "translate(" + points[i] + ", 0)"
						})
						
						axis.append(
							chart.svg.line({
								x1 : 0,
								y1 : barY,
								x2 : 0,
								y2 : height,
								stroke : "black",
								"stroke-width" : 1
							})
						);
	
						axis.append(chart.text({
								x : half_band,
								y : 20,
								'text-anchor' : 'middle'
							}, (format) ? format(domain[i]) : domain[i])
						)						


					g.append(axis);
				}
				
				if (full) {
					g.append(chart.svg.group({
						"transform" : "translate(" + max + ", 0)"
					}, function() {
						chart.svg.line({
							x1 : 0,
							y1 : barY,
							x2 : 0,
							y2 : height,
							stroke : "black",
							"stroke-width" : 1
						});
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
					"stroke-width" : 1
				}));

				for (var i = 0; i < points.length; i++) {
					values[i] = {
						point : points[i],
						band : band
					};
					
					var axis = chart.svg.group({
						"transform" : "translate(" + points[i] + ", 0)"
					})
					
						axis.append(chart.svg.line({
							x1 : -half_band,
							y1 : 0,
							x2 : -half_band,
							y2 : bar,
							stroke : "black",
							"stroke-width" : 1
						}));

						axis.append(chart.text({
							x : 0,
							y : 20,
							'text-anchor' : 'middle'
						}, (format) ? format(domain[i]) : domain[i])
					)


					g.append(axis);
				}

			} else if (orient == 'left') {
				var width = chart.widget.size('left');
				var bar = 6;
				var barX = width - bar;

				g.append(chart.svg.line({
					x1 : width,
					y1 : 0,
					x2 : width,
					y2 : max,
					stroke : "black",
					"stroke-width" : 1
				})); 

				for (var i = 0; i < points.length; i++) {
					values[i] = {
						point : points[i],
						band : band
					};
					
					var axis = chart.svg.group({
						"transform" : "translate(0, " + points[i] + ")"
					})
					
					axis.append(chart.svg.line({
							x1 : barX,
							y1 : -half_band,
							x2 : width,
							y2 : -half_band,
							stroke : "black",
							"stroke-width" : 1
						}));

					axis.append(chart.text({
							x : width-10,
							y : 0, 
							'text-anchor' : 'end'
						}, (format) ? format(domain[i]) : domain[i]));
					
					g.append(axis);
				}

			} else if (orient == 'right') {
				var width = chart.widget.size('right');
				var bar = 6;
				var barX = width - bar;

				g.append(chart.svg.line({
					x1 : 0,
					y1 : 0,
					x2 : 0,
					y2 : max,
					stroke : "black",
					"stroke-width" : 1
				}));

				for (var i = 0; i < points.length; i++) {
					values[i] = {
						point : points[i],
						band : band
					};

					var axis = chart.svg.group({
						"transform" : "translate(0, " + points[i] + ")"
					})
					
					axis.append(chart.svg.line({
							x1 : 0,
							y1 : 0,
							x2 : bar,
							y2 : 0,
							stroke : "black",
							"stroke-width" : 1
						}));

					axis.append(chart.text({
							x : bar + 5,
							y : half_band,
							'text-anchor' : 'start'
						}, (format) ? format(domain[i]) : domain[i]))
					
					g.append(axis);
				}
			}

			
			return scale; 
		}


		this.drawBefore = function(chart) {
			grid.type = grid.type || "block";
			grid = this.setBlockDomain(chart, grid);
		}

		this.draw = function(chart) {

			var width = chart.area('width'), height = chart.area('height'), max = (orient == 'left' || orient == 'right') ? height : width;
			var root = chart.svg.group({
				'class' : 'grid block'
			})
			
			var scale = drawBlock(chart, orient, root, grid.domain, [0, max], grid.full);
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

			root.translate(x, y);
			scale.key = grid.key;

			return scale;
		}
	}

	return Grid;
}, "chart.grid");
