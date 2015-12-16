jui.define("chart.grid.log", [ "util.scale", "util.base" ], function(UtilScale, _) {

	/**
	 * @class chart.grid.log
	 * @extends chart.grid.range
	 */
	var LogGrid = function() {

		this.drawBefore = function() {
			this.grid.unit = false;

			var domain = this.initDomain();

			var obj = this.getGridSize();

			this.scale = UtilScale.log(this.grid.base).domain(domain);

			if (this.grid.orient == "left" || this.grid.orient == "right") {
                var arr = [obj.end, obj.start];
			} else {
                var arr = [obj.start, obj.end]
			}
            this.scale.range(arr);

			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.step = this.grid.step;
			this.nice = this.grid.nice;
			this.ticks = this.scale.ticks(this.step, this.nice);

			if (this.grid.orient == 'left' || this.grid.orient == 'right') {
				this.ticks.reverse();
			}

			this.bar = 6;

			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = this.scale(this.ticks[i]);
			}

		}

		this.draw = function() {
			return this.drawGrid("log");
		}
	}

	LogGrid.setup = function() {
		return {
			/** @cfg {Number} [base=10] log's base */
			base : 10,
			step : 4,
			nice : false,
			/** @cfg {Boolean} [hideText=false] Determines whether to show text across the grid. */
			hideText: false
		};
	}

	return LogGrid;
}, "chart.grid.range");
