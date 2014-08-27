jui.define("chart.grid.date", ["util", "chart.util"], function(_, util) {

	var Grid = function(orient, grid) {
		var self = this;

		this.drawDate = function(chart, orient, g, scale, ticks, step, format) {

            if ( typeof format == 'string') {
                var str = format;
                format = function(value) {
                    return _.dateFormat(value, str);
                }
            }


			// step = [this.time.days, 1];
			var values = [];
            var bar = 6; 
            
			if (orient == 'top') {

                if (grid.line) {
                    g.append(chart.svg.line({
                        x1 : 0,
                        y1 : 0,
                        x2 : chart.width(),
                        y2 : 0,
                        stroke : chart.theme("gridBorderColor"),
                        "stroke-width" : chart.theme("gridBorderWidth"),
                        "stroke-opacity" : 1
                    }));
                    
                }

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var axis = chart.svg.group({
						"transform" : "translate(" + values[i] + ", 0)"
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
						x : 0,
						y : -bar - 4,
						'text-anchor' : 'middle',
						fill : chart.theme("gridFontColor")
					}, format ? format(ticks[i]) : ticks[i]))

					g.append(axis);
				}
			} else if (orient == 'bottom') {

				g.append(chart.svg.line({
					x1 : 0,
					y1 : 0,
					x2 : chart.width(),
					y2 : 0,
					stroke : chart.theme("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridAxisBorderWidth"),
					"stroke-opacity" : 1
				}));

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var group = chart.svg.group({
						"transform" : "translate(" + values[i] + ", 0)"
					})

					group.append(chart.svg.line({
						x1 : 0,
						y1 : 0,
						x2 : 0,
						y2 : (grid.line) ? -chart.height() : bar,
						stroke : chart.theme("gridAxisBorderColor"),
						"stroke-width" : chart.theme("gridBorderWidth"),
						"stroke-opacity" : 1
					}));

					group.append(chart.text({
						x : 0,
						y : bar *3,
						'text-anchor' : 'middle',
						fill : chart.theme("gridFontColor")
					}, format ? format(ticks[i]) : ticks[i] + ""));

					g.append(group);
				}

			} else if (orient == 'left') {

				g.append(chart.svg.line({
					x1 : 0,
					y1 : 0,
					x2 : 0,
					y2 : chart.height(),
					stroke : chart.theme("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridAxisBorderWidth"),
					"stroke-opacity" : 1

				}));

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var axis = chart.svg.group({
						"transform" : "translate(0," + values[i] + ")"
					})

					axis.append(chart.svg.line({
						x1 : 0,
						y1 : 0,
						x2 : (grid.line) ? chart.width() : -bar,
						y2 : 0,
						stroke : chart.theme("gridAxisBorderColor"),
						"stroke-width" : chart.theme("gridBorderWidth"),
						"stroke-opacity" : 1

					}));

					axis.append(chart.text({
						x : -bar,
						y : -bar,
						'text-anchor' : 'end',
						fill : chart.theme("gridFontColor")
					}, format ? format(ticks[i]) : ticks[i]));

					g.append(axis);
				}

			} else if (orient == 'right') {

				g.append(chart.svg.line({
					x1 : 0,
					y1 : 0,
					x2 : 0,
					y2 : chart.height(),
					stroke : chart.theme("gridBorderColor"),
					"stroke-width" : chart.theme("gridAxisBorderWidth"),
					"stroke-opacity" : 1

				}));

				for (var i = 0; i < ticks.length; i++) {
					values[i] = scale(ticks[i]);

					var axis = chart.svg.group({
						"transform" : "translate(0," + values[i] + ")"
					})

					axis.append(chart.svg.line({
						x1 : 0,
						y1 : 0,
						x2 : bar,
						y2 : 0,
						stroke : chart.theme("gridAxisBorderColor"),
						"stroke-width" : chart.theme("gridBorderWidth"),
						"stroke-opacity" : 1

					}));

					axis.append(chart.text({
						x : bar + 4,
						y : -bar,
						'text-anchor' : 'start',
						fill : chart.theme("gridFontColor")
					}, format ? format(ticks[i]) : ticks[i]))

					g.append(axis);
				}
			}

			return this.wrapper(chart, scale, grid.key);
		}

		this.drawBefore = function(chart) {
			grid = this.setRangeDomain(chart, grid);

            var max = chart.height();

            if (orient == 'top' || orient == 'bottom') {
                max = chart.width();
            }
			
			var range = [0, max];
            this.scale = util.scale.time().domain(grid.domain).rangeRound([0, max]);


            if (grid.realtime) {
                this.ticks = this.scale.realTicks(grid.step[0], grid.step[1]);
            } else {
                this.ticks = this.scale.ticks(grid.step[0], grid.step[1]);
            }			
			
		}

		this.draw = function(chart) {

			var root = chart.svg.group({
				'class' : 'grid date',
			})

			var scale = this.drawDate(chart, orient, root, this.scale, this.ticks, grid.step, grid.format);

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
			    root.attr({ display : 'none'});
			}

			return scale;
		}
	}

	return Grid;
}, "chart.grid");
