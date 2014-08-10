jui.define("chart.grid.range", [], function() {

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
			var scale = self.scale.linear().domain(domain).range(range);

			var ticks = scale.ticks(step, nice || false);
			var values = []

			var max = domain[0];
			var min = domain[0];

			for (var i = 0; i < domain.length; i++) {
				if (domain[i] > max)
					max = domain[i];
				else if (domain[i] < min)
					min = domain[i];
			}

			if (orient == 'left') {

				var width = 30;
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

					if (format) {
						values[i] = format(values[i]);
					}

					g.append(chart.svg.group({
						"transform" : "translate(0, " + values[i] + ")"
					}, function() {
						chart.svg.line({
							x1 : barX,
							y1 : 0.5,
							x2 : width + chart.area('width'),
							y2 : 0.5,
							stroke : "black",
							"stroke-width" : 0.2
						});

						chart.svg.text({
							x : barX - bar,
							y : bar,
							'text-anchor' : 'end'
						}, ticks[i] + "")
					}));
				}

			} else if (orient == 'bottom') {
				var height = 30;
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

					if (format) {
						values[i] = format(values[i]);
					}

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
						}, ticks[i] + "")
					}));
				}

			} else if (orient == 'top') {
				var height = 30;
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

					if (format) {
						values[i] = format(values[i]);
					}

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
						}, ticks[i] + "")
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
					y2 : scale(Math.min(max, min)),
					stroke : "black",
					"stroke-width" : 0.5
				}));

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					if (format) {
						values[i] = format(values[i]);
					}

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
						}, ticks[i] + "")
					}));
				}
			}

			return {
				g : g,
				scale : scale,
				ticks : ticks,
				values : values
			};
		}


		this.drawBefore = function(chart) {
		}

		this.draw = function(chart) {
			var width = chart.area('width'), height = chart.area('height');

			if (orient == 'left' || orient == 'right') {
				var obj = drawRange(chart, orient, grid.domain, [height, 0], grid.step, grid.format, grid.nice);
			} else {
				var obj = drawRange(chart, orient, grid.domain, [0, width], grid.step, grid.format, grid.nice);
			}

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

			return obj;
		}
	}

	return Grid;
}, "chart.grid");
