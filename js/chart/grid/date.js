jui.define("chart.grid.date", [ "util.time", "util.scale", "util.base" ], function(UtilTime, UtilScale, _) {

	/**
	 * @class chart.grid.date
	 * @extends chart.grid.core
	 */
	var DateGrid = function() {

		this.center = function(g) {
			this.drawCenter(g, this.ticks, this.values, null, 0);
			this.drawBaseLine("center", g);
		}

		this.top = function(g) {
			this.drawPattern("top", this.ticks, this.values);
			this.drawTop(g, this.ticks, this.values, null, 0);
			this.drawBaseLine("top", g);
		}

		this.bottom = function(g) {
			this.drawPattern("bottom", this.ticks, this.values);
			this.drawBottom(g, this.ticks, this.values, null, 0);
			this.drawBaseLine("bottom", g);
		}

		this.left = function(g) {
			this.drawPattern("left", this.ticks, this.values);
			this.drawLeft(g, this.ticks, this.values, null, 0);
			this.drawBaseLine("left", g);
		}

		this.right = function(g) {
			this.drawPattern("right", this.ticks, this.values);
			this.drawRight(g, this.ticks, this.values, null, 0);
			this.drawBaseLine("right", g);
		}

		this.wrapper = function(scale, key) {
			var old_scale = scale;
			var self = this;

			function new_scale(i) {
				if (typeof i == 'number') {
					return old_scale(self.axis.data[i][key]);
				} else {
					return old_scale(+i);
				}
			}

			return (key) ? $.extend(new_scale, old_scale) : old_scale;
		}

		this.initDomain = function() {
			var domain = [],
				interval = [];
			var min = this.grid.min || undefined,
				max = this.grid.max || undefined;
			var data = this.data(),
				value_list = [] ;

			if (_.typeCheck("string", this.grid.domain) ) {
				if (data.length > 0) {
					var field = this.grid.domain;
					value_list.push(+data[0][field]);
					value_list.push(+data[data.length-1][field]);
				}
			} else if (_.typeCheck("function", this.grid.domain)) {
				var index = data.length;

				while(index--) {
					var value = this.grid.domain.call(this.chart, data[index]);

					if (_.typeCheck("array", value)) {
						value_list[index] = Math.max.apply(Math, value);
						value_list.push(Math.min.apply(Math, value));
					} else {
						value_list[index]  = value;
					}
				}
			} else {
				value_list = this.grid.domain;
			}

			if (_.typeCheck("undefined", min) && value_list.length > 0 ) min = Math.min.apply(Math, value_list);
			if (_.typeCheck("undefined", max) && value_list.length > 0 ) max = Math.max.apply(Math, value_list);

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
			var domain = this.initDomain();

			var obj = this.getGridSize(),
				range = [obj.start, obj.end];

			this.scale = UtilScale.time().domain(domain).range(range);

			// 기본값 설정
			this.ticks = [];

			if (this.grid.realtime != null && UtilTime[this.grid.realtime] == this.grid.realtime) {
				this.ticks = this.scale.realTicks(this.grid.realtime, domain.interval);
			} else {
				this.ticks = this.scale.ticks("milliseconds", domain.interval);
			}

			/* data 없을 때도 기본 설정만으로 보여야 하기 때문에. 지우겠음
			if (this.axis.data.length == 0) {
				//this.ticks = [];
			} */

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
				this.values[i] = this.scale(this.ticks[i]);
			}
		}

		this.draw = function() {
			return this.drawGrid("date");
		}
	}

	DateGrid.setup = function() {
		return {
			/** @cfg {Array} [domain=null] Sets the value displayed on a grid. */
			domain: null,
			/** @cfg {Number} [interval=1000] Sets the interval of the scale displayed on a grid.*/
			interval : 1000,
			/** @cfg {Number} [min=null] Sets the minimum timestamp of a grid.  */
			min: null,
			/** @cfg {Number} [max=null] Sets the maximum timestamp of a grid. */
			max: null,
			/** @cfg {Boolean} [reverse=false] Reverses the value on domain values*/
			reverse: false,
			/** @cfg {String} [key=null] Sets the value on the grid to the value for the specified key. */
			key: null,
			/** @cfg {"years"/"months"/"days"/"hours"/"minutes"/"seconds"/"milliseconds"} [realtime=""] Determines whether to use as a real-time grid. */
			realtime: null,
			/** @cfg {Boolean} [hideText=false] Determines whether to show text across the grid. */
			hideText: false
		};
	}

	return DateGrid;
}, "chart.grid.core");
