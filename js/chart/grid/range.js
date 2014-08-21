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

		function drawRange(chart, orient, domain, range, step, format, nice) {
			step = step || 10;

			var g = chart.svg.group();
			var scale = util.scale.linear().domain(domain).range(range);

			var ticks = scale.ticks(step, nice || false);
			var values = []

			var max = scale.max();
			var min = scale.min();

			if (orient == 'left') {

				var width = chart.widget('left').size;
				var bar = 6;
				var barX = width - bar;

				g.append(chart.svg.line({
					x1 : width + 0.5,
					y1 : 0,
					x2 : width + 0.5,
					y2 : scale(Math.min(max, min)),
					stroke : "black",
					"stroke-width" : 0.5
				}));

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var color = "black";
					if (ticks[i] == 0 && i < ticks.length-1) {
						color = "#ff7800";
					} 
					
					
					g.append(chart.svg.group({
						"transform" : "translate(0, " + values[i] + ")"
					}, function() {
						chart.svg.line({
							x1 : barX,
							y1 : 0.5,
							x2 : width + chart.area('width'),
							y2 : 0.5,
							stroke : color,
							"stroke-width" : 0.5
						});

						chart.svg.text({
							x : barX - bar,
							y : bar,
							'text-anchor' : 'end',
							fill : color
						}, (format) ? format(ticks[i]) : ticks[i] + "")
					}));
						
					

				}

			} else if (orient == 'bottom') {
				var height = chart.widget('bottom').size;
				var bar = 6;
				var barY = bar;

				g.append(chart.svg.line({
					x1 : 0,
					y1 : 0.5,
					x2 : scale(Math.max(max, min)),
					y2 : 0.5,
					stroke : "black",
					"stroke-width" : 0.5
				}));

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					g.append(chart.svg.group({
						"transform" : "translate(" + values[i] + ", 0)"
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
							x : 0,
							y : bar * 4,
							'text-anchor' : 'middle'
						}, (format) ? format(ticks[i]) : ticks[i] + "")
					}));
				}

			} else if (orient == 'top') {
				var height = chart.widget('top').size;
				var bar = 6;
				var barY = height - bar;

				g.append(chart.svg.line({
					x1 : 0,
					y1 : height,
					x2 : scale(Math.max(max, min)),
					y2 : height,
					stroke : "black",
					"stroke-width" : 0.5
				}));

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					g.append(chart.svg.group({
						"transform" : "translate(" + values[i] + ", " + barY + ")"
					}, function() {
						chart.svg.line({
							x1 : 0,
							y1 : 0,
							x2 : 0,
							y2 : 6,
							stroke : "black",
							"stroke-width" : 0.5
						});

						chart.svg.text({
							x : 0,
							y : -4,
							'text-anchor' : 'middle'
						}, (format) ? format(ticks[i]) : ticks[i] + "")
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
					y2 : scale(Math.min(max, min)),
					stroke : "black",
					"stroke-width" : 0.5
				}));

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					g.append(chart.svg.group({
						"transform" : "translate(0, " + values[i] + ")"
					}, function() {
						chart.svg.line({
							x1 : 0,
							y1 : 0,
							x2 : bar,
							y2 : 6,
							stroke : "black",
							"stroke-width" : 0.5
						});

						chart.svg.text({
							x : bar + 2,
							y : bar,
							'text-anchor' : 'start'
						}, (format) ? format(ticks[i]) : ticks[i] + "")
					}));
				}
			}

			scale.result = {
				g : g,
				ticks : ticks,
				values : values 
			}

			return scale;
		}


		this.drawBefore = function(chart) {
			grid = this.setRangeDomain(chart, grid);
		}

		this.draw = function(chart) {
			var width = chart.area('width'), height = chart.area('height');

			if (orient == 'left' || orient == 'right') {
				var scale = drawRange(chart, orient, grid.domain, [height, 0], grid.step, grid.format, grid.nice);
			} else {
				var scale = drawRange(chart, orient, grid.domain, [0, width], grid.step, grid.format, grid.nice);
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

			

			scale.result.g.translate(x, y);
			scale.key = grid.key;
			
			return scale;
		}
	}

	return Grid;
}, "chart.grid");
