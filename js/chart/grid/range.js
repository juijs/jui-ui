jui.define("chart.grid.range", ["chart.util"], function(util) {

	/**
	 *
	 * grid {
	 * 	  domain  :  real world value
	 *    step : Line Step Count
	 *    min : Min Value
	 *    max : Max Value
	 *    target : 'field' or ['field1', 'field2'] or function(data) { return data.name + data.value +_data.test; }
	 * }
	 *
	 * @param {Object} orient
	 * @param {Object} grid
	 */
	var Grid = function(orient, grid) {
		var self = this;

		this.drawRange = function (chart, orient, g, domain, range, step, format, nice) {
			step = step || 10;

			var scale = util.scale.linear().domain(domain).range(range);
			
			var ticks = scale.ticks(step, nice || false);
			var values = []

			var max = scale.max();
			var min = scale.min();

			if (orient == 'left') {

				var width = chart.widget.size('left');
				var bar = 6;
				var barX = width - bar;

				if (grid.line) {
					g.append(chart.svg.line({
						x1 : width,
						y1 : 0,
						x2 : width,
						y2 : scale(Math.min(max, min)),
						stroke : "black",
						"stroke-width" : 1
					}));
					
				}

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var color = "black";
					var strokeWidth = 0.5; 
					var fontWeight = "normal";
					if (ticks[i] == 0 && ticks[i] != scale.min()) {
						color = "#ff7800";
						strokeWidth = 2;
						fontWeight = 'bold';
					} 
					
					var axis = chart.svg.group({
						"transform" : "translate(0, " + values[i] + ")"
					})
					
					axis.append(chart.svg.line({
							x1 : barX,
							y1 : 0.5,
							x2 : width + chart.area('width'),
							y2 : 0.5,
							stroke : color,
							"stroke-width" : strokeWidth
						}));

					axis.append(chart.text({
							x : barX - bar,
							y : bar,
							'text-anchor' : 'end',
							fill : color
						}, (format) ? format(ticks[i]) : ticks[i] + ""));
					
					
					g.append(axis);
						
					

				}

			} else if (orient == 'bottom') {
				var height = chart.widget.size('bottom');
				var bar = 6;
				var barY = bar;

				if (grid.line) {
					g.append(chart.svg.line({
						x1 : 0,
						y1 : 0.5,
						x2 : scale(scale.max()),
						y2 : 0.5,
						stroke : "black",
						"stroke-width" : 0.5
					}));
				}

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var color = "black";
					var strokeWidth = 0.5; 
					var fontWeight = "normal";
					if (ticks[i] == 0 && ticks[i] != scale.min()) {
						color = "#ff7800";
						strokeWidth = 2;
						fontWeight = 'bold';
					} 

					var axis = chart.svg.group({
						"transform" : "translate(" + values[i] + ", 0)"
					})
					
					axis.append(chart.svg.line({
							x1 : 0.5,
							y1 : -chart.area('height'),
							x2 : 0.5,
							y2 : 0 ,
							stroke : color,
							"stroke-width" : strokeWidth,
						}));

					axis.append(chart.text({
							x : 0,
							y : bar * 4,
							'text-anchor' : 'middle',
							fill : color,
							'font-weight' : fontWeight 
						}, (format) ? format(ticks[i]) : ticks[i] + ""))					

					g.append(axis);
				}

			} else if (orient == 'top') {
				var height = chart.widget.size('top');
				var bar = 6;
				var barY = height - bar;

				if (grid.line) {
					g.append(chart.svg.line({
						x1 : 0,
						y1 : height,
						x2 : scale(scale.max()),
						y2 : height,
						stroke : "black",
						"stroke-width" : 0.5
					}));
				}

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var color = "black";
					var strokeWidth = 0.5; 
					var fontWeight = "normal";
					
					var isZero = ticks[i] == 0 && ticks[i] != scale.min();
					
					if (isZero) {
						color = "#ff7800";
						strokeWidth = 2;
						fontWeight = 'bold';
					} 

					var axis = chart.svg.group({
						"transform" : "translate(" + values[i] + ", " + barY + ")"
					})
					
					axis.append(						chart.svg.line({
							x1 : 0,
							y1 : 6,
							x2 : 0,
							y2 : 6 + chart.area('height'),
							stroke : color,
							"stroke-width" : strokeWidth
						}));

					axis.append(chart.text({
							x : 0,
							y : -4,
							'text-anchor' : 'middle',
							fill : color,
							'font-weight' : fontWeight 
						}, (format) ? format(ticks[i]) : ticks[i] + ""));							

 					axis.append(text);					

					g.append(axis);
				}

			} else if (orient == 'right') {

				var width = chart.widget.size('right');
				var bar = 6;
				var barX = width - bar;

				if (grid.line) {
					g.append(chart.svg.line({
						x1 : 0,
						y1 : 0,
						x2 : 0,
						y2 : scale(scale.min()),
						stroke : "black",
						"stroke-width" : 0.5
					}));
				}

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var color = "rgba(0, 0, 0, 0.5)";
					var strokeWidth = 0.5; 
					var fontWeight = "normal";
					if (ticks[i] == 0 && ticks[i] != scale.min()) {
						color = "#ff7800";
						strokeWidth = 2;
						fontWeight = 'bold';
					} 

					var axis = chart.svg.group({
						"transform" : "translate(0, " + values[i] + ")"
					})
					
					axis.append(chart.svg.line({
							x1 : 0,
							y1 : 0,
							x2 : bar,
							y2 : 6,
							stroke : color,
							"stroke-width" : strokeWidth
						}));

					axis.append(chart.text({
							x : bar + 2,
							y : bar,
							'text-anchor' : 'start',
							fill : color,
							'font-weight' : fontWeight 
						}, (format) ? format(ticks[i]) : ticks[i] + ""));					

					g.append(axis);
				}
			}

			return this.wrapper(chart, scale, grid.key);
		}


		this.drawBefore = function(chart) {
			grid = this.setRangeDomain(chart, grid);
		}

		this.draw = function(chart) {
			
			var root = chart.svg.group({
				'class' : 'grid range',
			})
						
			var width = chart.area('width'), height = chart.area('height');

			if (orient == 'left' || orient == 'right') {
				var scale = this.drawRange(chart, orient, root, grid.domain, [height, 0], grid.step, grid.format, grid.nice);
			} else {
				var scale = this.drawRange(chart, orient, root, grid.domain, [0, width], grid.step, grid.format, grid.nice);
			}

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
