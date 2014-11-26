jui.define("chart.grid.date", [ "util.time", "util.scale" ], function(UtilTime, UtilScale) {

	var DateGrid = function(orient, chart, grid) {

		this.top = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {

				var domain = grid.format(ticks[i]);

				if (domain == "") {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? chart.height() : -bar
				}));

				axis.append(chart.text({
					x : 0,
					y : -bar - 4,
					"text-anchor" : "middle",
					fill : chart.theme("gridFontColor")
				}, domain));

				g.append(axis);
			}
		}

		this.bottom = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {

				var domain = grid.format(ticks[i]);

				if (domain == "") {
					continue;
				}

				var group = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				group.append(this.line(chart, {
					y2 : (grid.line) ? -chart.height() : bar
				}));

				group.append(chart.text({
					x : 0,
					y : bar * 3,
					"text-anchor" : "middle",
					fill : chart.theme("gridFontColor")
				}, domain));

				g.append(group);
			}
		}

		this.left = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}));

			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {

				var domain = grid.format(ticks[i]);

				if (domain == "") {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? chart.width() : -bar
				}));

				axis.append(chart.text({
					x : -bar-2,
					y : bar-2,
					"text-anchor" : "end",
					fill : chart.theme("gridFontColor")
				}, domain));

				g.append(axis);
			}
		}

		this.right = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;
			
			for (var i = 0; i < ticks.length; i++) {

				var domain = grid.format(ticks[i]);

				if (domain == "") {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				})

				axis.append(this.line(chart,{
					x2 : (grid.line) ? -chart.width() : bar
				}));

				axis.append(chart.text({
					x : bar + 4,
					y : -bar,
					"text-anchor" : "start",
					fill : chart.theme("gridFontColor")
				}, domain));

				g.append(axis);
			}
		}


		this.drawBefore = function() {
			grid = this.setDateDomain(chart, grid);


			var obj = this.getGridSize(chart, orient, grid);

			var range = [obj.start, obj.end];
			this.scale = UtilScale.time().domain(grid.domain).rangeRound(range);

			if (grid.realtime) {
				this.ticks = this.scale.realTicks(grid.step[0], grid.step[1]);
			} else {
				this.ticks = this.scale.ticks(grid.step[0], grid.step[1]);
			}

			if ( typeof grid.format == "string") {
				(function(grid, str) {
					grid.format = function(value) {
						return UtilTime.format(value, str);
					}	
				})(grid, grid.format)
			}

			// step = [this.time.days, 1];
			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.bar = 6;
			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = this.scale(this.ticks[i]);
			}
		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "date", grid);
		}

		this.drawSetup = function() {
			return $.extend(this.parent.drawSetup(), {
				// date options
				realtime: false
			});
		}
	}

	return DateGrid;
}, "chart.grid.core");
