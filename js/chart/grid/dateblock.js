jui.define("chart.grid.dateblock", [ "util.time", "util.scale", "util.base" ], function(UtilTime, UtilScale, _) {

    /**
     * @class chart.grid.dateblock 
     * 
     * implements date block grid
     *
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

		/**
		 * date grid 의 domain 설정
		 *
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성
		 *
		 */
		this.initDomain = function() {

			var min = this.grid.min || undefined,
				max = this.grid.max || undefined;
			var data = this.data();

            var value_list = [] ;

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
			var domain = [this.grid.min, this.grid.max];

			if (_.typeCheck("function", this.grid.step)) {
				this.grid.step = this.grid.call(this.chart, domain);
			}

      if (_.typeCheck("number", this.grid.step)) {
        this.grid.step = ["seconds", this.grid.step];
      }

			if (this.grid.reverse) {
				domain.reverse();
			}

			return domain;
		}

		this.drawBefore = function() {

			var self = this;
			var domain = this.initDomain();

			var obj = this.getGridSize(), range = [obj.start, obj.end];

			var time = UtilScale.time().domain(domain).rangeRound(range);
			var len = this.axis.data.length;

			var unit = this.grid.unit = Math.abs(range[0] - range[1])/(this.grid.full ? len- 1 : len);
			var half_unit = unit/2;


			if (this.grid.realtime) {
				this.ticks = time.realTicks(this.grid.step[0], this.grid.step[1]);
			} else {
				this.ticks = time.ticks(this.grid.step[0], this.grid.step[1]);
			}

			if ( typeof this.grid.format == "string") {
				(function(grid, str) {
					grid.format = function(value) {
						return UtilTime.format(value, str);
					}	
				})(this.grid, this.grid.format)
			}

			// step = [this.time.days, 1];
			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.bar = 6;
			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = time(this.ticks[i]);
			}

			this.scale = $.extend((function(i) {
				return  i * unit + (self.grid.full ? 0 : half_unit);
			}), time);

		}

		this.draw = function() {
			return this.drawGrid("dateblock");
		}
	}

	DateBlockGrid.setup = function() {
		return {
			/** @cfg {Boolean} [full=true] */
			full: true
		};
	}

	return DateBlockGrid;
}, "chart.grid.date");
