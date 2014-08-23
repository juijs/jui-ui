jui.define("chart.grid.date", ["util", "chart.util"], function(_, util) {

	var Grid = function(orient, grid) {
		var self = this;

		this.drawDate = function (chart, orient, g, domain, range, step, format) {

			var scale = util.scale.time().domain(domain).rangeRound(range);
			
			var max = range[0];
			var min = range[0];

			for (var i = 0; i < range.length; i++) {
				if (range[i] > max)
					max = range[i];
				else if (range[i] < min)
					min = range[i];
			}

			if ( typeof format == 'string') {
				var str = format;
				format = function(value) {
					return _.dateFormat(value, str);
				}
			}

			if (grid.realtime) {
				var ticks = scale.realTicks(step[0], step[1]);
			} else {
				var ticks = scale.ticks(step[0], step[1]);
			}

			// step = [this.time.days, 1];
			var values = [];

			if (orient == 'top') {
				var height = chart.widget.size('top');
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

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var axis = chart.svg.group({
						"transform" : "translate(" + values[i] + ", 0)"
					})
					
					axis.append(chart.svg.line({
							x1 : 0,
							y1 : barY,
							x2 : 0,
							y2 : height,
							stroke : "black",
							"stroke-width" : 1
						}));

					axis.append(chart.text({
							x : 0,
							y : bar * 3,
							'text-anchor' : 'middle'
						}, format ? format(ticks[i]) : ticks[i]))

					g.append(axis);
				}
			} else if (orient == 'bottom') {
				var height = chart.widget('bottom').size;
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

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var group = chart.svg.group({
						"transform" : "translate(" + values[i] + ", 0)"
					})

					group.append(chart.svg.line({
						x1 : 0.5,
						y1 : 0,
						x2 : 0.5,
						y2 : bar,
						stroke : "black",
						"stroke-width" : 0.5
					}));

					group.append(chart.text({
						x : 0,
						y : bar * 4,
						'text-anchor' : 'middle'
					}, format ? format(ticks[i]) : ticks[i] + ""));

					g.append(group);
				}

			} else if (orient == 'left') {
				var width = chart.widget('left').size;
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

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var axis = chart.svg.group({
						"transform" : "translate(0," + values[i] + ")"
					})
					
					axis.append(chart.svg.line({
						x1 : barX,
						y1 : 0.5,
						x2 : width,
						y2 : 0.5,
						stroke : "black",
						"stroke-width" : 0.5
					}));

					axis.append(chart.text({
							x : bar,
							y : bar,
							'text-anchor' : 'end'
						}, format ? format(ticks[i]) : ticks[i])
					);					

					g.append(axis);
				}

			} else if (orient == 'right') {
				var width = chart.widget('right').size;
				var bar = 6;
				var barX = width - bar;

				g.append(chart.svg.line({
					x1 : 0.5,
					y1 : 0,
					x2 : 0.5,
					y2 : max,
					stroke : "black",
					"stroke-width" : 0.5
				}));

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var axis = chart.svg.group({
						"transform" : "translate(0," + values[i] + ")"
					})
					
					axis.append(chart.svg.line({
							x1 : 0,
							y1 : 0.5,
							x2 : bar,
							y2 : 0.5,
							stroke : "black",
							"stroke-width" : 0.5
						}));

					axis.append(chart.text({
							x : bar * 2,
							y : bar,
							'text-anchor' : 'start'
						}, format ? format(ticks[i]) : ticks[i]))					

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
				'class' : 'grid date',
			})
			var max = chart.area('height');

			if (orient == 'top' || orient == 'bottom') {
				max = chart.area('width');
			}

			var domain = grid.domain;
			var scale = this.drawDate(chart, orient, root, grid.domain, [0, max], grid.step, grid.format);

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
