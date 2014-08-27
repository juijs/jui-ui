jui.define("chart.grid.block", ["chart.util"], function(util) {

	var Grid = function(orient, grid) {

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
			var half_band = (full) ? 0 : band / 2;
			var format = grid.format; 

			if (orient == 'top') {

				var height = chart.widget.size('top');
				var bar = 6;
				var barY = height - bar;

				for (var i = 0; i < points.length; i++) {

					var axis = chart.svg.group({
							"transform" : "translate(" + points[i] + ", 0)"
						})
						
						axis.append(
							chart.svg.line({
								x1 : 0,
								y1 : barY,
								x2 : 0,
								y2 : height,
								stroke : chart.theme("gridBorderColor"),
								"stroke-width" : chart.theme("gridBorderWidth"),
							"stroke-opacity" : 1
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
							stroke : chart.theme("gridBorderColor"),
							"stroke-width" : chart.theme("gridBorderWidth"),
							"stroke-opacity" : 1
						});
					}));
				}

			} else if (orient == 'bottom') {
				var height = chart.widget.size('bottom');
				var bar = 6;
				var barY = height - bar;
				var full_height = chart.area('height');

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
						}, (format) ? format(domain[i]) : domain[i])
					)


					g.append(axis);
				}
				
				var axis = chart.svg.group({
						"transform" : "translate(" + (points[points.length-1] + band) + ", 0)"
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
				var width = chart.widget.size('left');
				var bar = 6;
				var barX = width - bar;
				var full_width = chart.area('width');

				for (var i = 0; i < points.length; i++) {
					
					var axis = chart.svg.group({
						"transform" : "translate(0, " + points[i] + ")"
					})
					
					axis.append(chart.svg.line({
							x1 : (grid.line) ? width : barX,
							y1 : -half_band,
							x2 : (grid.line) ? width + full_width : width,
							y2 : -half_band,
							stroke : chart.theme("gridBorderColor"),
							"stroke-width" : chart.theme("gridBorderWidth"),
							"stroke-opacity" : 1
						}));

					axis.append(chart.text({
							x : width-10,
							y : 0, 
							'text-anchor' : 'end',
							fill : chart.theme("gridFontColor")
						}, (format) ? format(domain[i]) : domain[i]));
					
					g.append(axis);
				}
				
					var axis = chart.svg.group({
						"transform" : "translate(0, " + (points[points.length-1] + band) + ")"
					})
					
					axis.append(chart.svg.line({
							x1 : (grid.line) ? width : barX,
							y1 : -half_band,
							x2 : (grid.line) ? width + full_width : width,
							y2 : -half_band,
							stroke : chart.theme("gridBorderColor"),
							"stroke-width" : chart.theme("gridBorderWidth"),
							"stroke-opacity" : 1
						}));

					g.append(axis);				

			} else if (orient == 'right') {
				var width = chart.widget.size('right');
				var bar = 6;
				var barX = width - bar;

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
							x : bar + 5,
							y : half_band,
							'text-anchor' : 'start',
							fill : chart.theme("gridFontColor")
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
				var x = chart.area('x') - chart.widget.size('left');
				var y = chart.area('y');
			} else if (orient == 'right') {
				var x = chart.area('x2');
				var y = chart.area('y');
			} else if (orient == 'top') {
				var x = chart.area('x');
				var y = chart.area('y') - chart.widget.size('top');
			} else if (orient == 'bottom') {
				var x = chart.area('x');
				
				var y = chart.area('y2');
			}
			
			root.translate(x, y);
			
			if (grid.hide) {
				root.attr({
					display : 'none'
				})
			}
			
			scale.key = grid.key;

			return scale;
		}
	}

	return Grid;
}, "chart.grid");
