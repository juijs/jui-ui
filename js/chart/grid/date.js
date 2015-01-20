jui.define("chart.grid.date", [ "util.time", "util.scale", "util.base" ], function(UtilTime, UtilScale, _) {

    /**
     * @class chart.grid.date
     *
     * implements date grid 
     *  
     * @extends chart.grid.core 
     */
	var DateGrid = function() {

		this.top = function(g) {
			if (!this.grid.line) {
				g.append(this.axisLine({
					x1 : this.start,
					x2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line({
					y2 : (this.grid.line) ? this.axis.area('height') : -bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : 0,
					y : -bar - 4,
					"text-anchor" : "middle",
					fill : this.chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}

		this.bottom = function(g) {
			if (!this.grid.line) {
				g.append(this.axisLine({
					x1 : this.start,
					x2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var group = this.chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				group.append(this.line({
					y2 : (this.grid.line) ? -this.axis.area('height') : bar
				}));

				group.append(this.getTextRotate(this.chart.text({
					x : 0,
					y : bar * 3,
					"text-anchor" : "middle",
					fill : this.chart.theme("gridFontColor")
				}, domain)));

				g.append(group);
			}
		}

		this.left = function(g) {
			if (!this.grid.line) {
				g.append(this.axisLine({
					y1 : this.start,
					y2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				});

				axis.append(this.line({
					x2 : (this.grid.line) ? this.axis.area('width') : -bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : -bar-2,
					y : bar-2,
					"text-anchor" : "end",
					fill : this.chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}

		this.right = function(g) {
			if (!this.grid.line) {
				g.append(this.axisLine({
					y1 : this.start,
					y2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;
			
			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				});

				axis.append(this.line({
					x2 : (this.grid.line) ? -this.axis.area('width') : bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : bar + 4,
					y : -bar,
					"text-anchor" : "start",
					fill : this.chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
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
        

		/**
		 * date grid 의 domain 설정
		 *
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성
		 *
		 */
		this.initDomain = function() {

			var domain = [];
			var step = [];

			var min = this.grid.min || undefined,
				max = this.grid.max || undefined;
			var data = this.data();

            var value_list = [] ;

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
			domain = [this.grid.min, this.grid.max];
			step = this.grid.step;

			if (this.grid.reverse) {
				domain.reverse();
			}

			if (_.typeCheck("function", step)) {
				this.grid.step = step.call(this.chart, domain);
			}

			return domain;
		}

		this.drawBefore = function() {
			var domain = this.initDomain();

			var obj = this.getGridSize(),
				range = [obj.start, obj.end];

			this.scale = UtilScale.time().domain(domain).range(range);

			if (this.grid.realtime) {
				this.ticks = this.scale.realTicks(this.grid.step[0], this.grid.step[1]);
			} else {
				this.ticks = this.scale.ticks(this.grid.step[0], this.grid.step[1]);
			}

			if (this.axis.data.length == 0) {
				this.ticks = [];
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
				this.values[i] = this.scale(this.ticks[i]);
			}
		}

		this.draw = function() {
			return this.drawGrid("date");
		}
	}

	DateGrid.setup = function() {
		return {
            /** @cfg {Array} [domain=null] */
			domain: null,
            /** @cfg {Array} [step=[]] */
			step: [],
            /** @cfg {Number} [min=null] min timestamp  */
			min: null,
            /** @cfg {Number} [max=null] max timestamp  */
			max: null,
            /** @cfg {Boolean} [reverse=false]  */
			reverse: false,
            /** @cfg {String} [key=null] a field for value  */
			key: null,
            /** @cfg {Boolean} [realtime=false]  */
			realtime: false
		};
	}

	return DateGrid;
}, "chart.grid.core");
