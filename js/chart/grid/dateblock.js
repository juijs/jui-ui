jui.define("chart.grid.dateblock", [ "util.time", "util.scale", "util.base" ], function(UtilTime, UtilScale, _) {

	/**
	 * @class chart.grid.dateblock
	 * @extends chart.grid.date
	 */
	var DateBlockGrid = function() {

		this.wrapper = function(scale, key) {
			var old_scale = scale;
			var self = this;

			old_scale.rangeBand = function() {
				return self.grid.unit;
			}

			return old_scale;
		}

		this.initDomain = function() {
			var domain = [],
				interval = [];
			var min = this.grid.min || undefined,
				max = this.grid.max || undefined;
			var data = this.data(),
				value_list = [] ;

			if (_.typeCheck("string", this.grid.domain)) {
				var field = this.grid.domain;
				value_list.push(+data[0][field]);
				value_list.push(+data[data.length-1][field]);
			} else if (_.typeCheck("function", this.grid.domain)) {
				var index = data.length;

				while(index--) {
					var value = this.grid.domain.call(this.chart, data[index]);

					if (_.typeCheck("array", value)) {
						value_list[index] = +Math.max.apply(Math, value);
						value_list.push(+Math.min.apply(Math, value));
					} else {
						value_list[index]  = +value;
					}
				}
			} else {
				value_list = this.grid.domain;
			}

			if (_.typeCheck("undefined", min)) min = Math.min.apply(Math, value_list);
			if (_.typeCheck("undefined", max)) max = Math.max.apply(Math, value_list);

			this.grid.max = max;
			this.grid.min = min;
			domain = [ this.grid.min, this.grid.max ];
			interval = this.grid.interval;

			if (this.grid.reverse) {
				domain.reverse();
			}

			if (_.typeCheck("function", interval)) {
				domain.interval = interval.call(this.chart, domain);
			} else {
				domain.interval = interval;
			}

			return domain;
		}

		this.drawBefore = function() {
			var domain = this.initDomain(),
				obj = this.getGridSize(), range = [obj.start, obj.end],
				time = UtilScale.time().domain(domain).rangeRound(range);

			if (this.grid.realtime != null && UtilTime[this.grid.realtime] == this.grid.realtime) {
				this.ticks = time.realTicks(this.grid.realtime, domain.interval);
			} else {
				this.ticks = time.ticks("milliseconds", domain.interval);
			}

			var len = this.axis.data.length - 1;
			var unit = this.grid.unit = Math.abs(range[0] - range[1])/(len);

			if ( typeof this.grid.format == "string") {
				(function(grid, str) {
					grid.format = function(value) {
						return UtilTime.format(value, str);
					}
				})(this.grid, this.grid.format)
			}

			// interval = [this.time.days, 1];
			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.bar = 6;
			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = time(this.ticks[i]);
			}

			this.scale = $.extend((function(i) {
				return  i * unit;
			}), time);

		}

		this.draw = function() {
			return this.drawGrid("dateblock");
		}
	}

	return DateBlockGrid;
}, "chart.grid.date");
