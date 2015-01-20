jui.define("chart.grid.dateblock", [ "util.time", "util.scale", "util.base" ], function(UtilTime, UtilScale, _) {

    /**
     * @class chart.grid.dateblock 
     * 
     * implements date block grid
     *
     * @extends chart.grid.date  
     */
	var DateBlockGrid = function(chart, axis, grid) {
		var orient = grid.orient;
		var domain = [];
		var step = [];
		var unit = 0;
		var half_unit;


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
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? this.axis.area('height') : -bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : 0,
					y : -bar - 4,
					"text-anchor" : "middle",
					fill : chart.theme("gridFontColor")
				}, domain)));

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
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var group = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				group.append(this.line(chart, {
					y2 : (grid.line) ? -this.axis.area('height') : bar
				}));

				group.append(this.getTextRotate(chart.text({
					x : 0,
					y : bar * 3,
					"text-anchor" : "middle",
					fill : chart.theme("gridFontColor")
				}, domain)));

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
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? this.axis.area('width') : -bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : -bar-2,
					y : bar-2,
					"text-anchor" : "end",
					fill : chart.theme("gridFontColor")
				}, domain)));

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
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				});

				axis.append(this.line(chart,{
					x2 : (grid.line) ? -this.axis.area('width') : bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : bar + 4,
					y : -bar,
					"text-anchor" : "start",
					fill : chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}

		this.wrapper = function(chart, scale, key) {
			var old_scale = scale;
			var self = this;

			old_scale.rangeBand = function() {
				return unit;
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
			domain = [this.grid.min, this.grid.max];

			if (_.typeCheck("function", this.grid.step)) {
				step = step.call(this.chart, domain);
			} else {
				step = this.grid.step;
			}

			if (this.grid.reverse) {
				domain.reverse();
			}
		}

		this.drawBefore = function() {

			console.log('aaa');

			var self = this;
			this.initDomain();

			var obj = this.getGridSize(chart, orient, grid),
				range = [obj.start, obj.end];

			console.log(domain, range, step);

			var time = UtilScale.time().domain(domain).rangeRound(range);


			unit = Math.abs(range[0] - range[1])/(this.axis.data.length- 1);
			half_unit = unit/2;


			if (this.grid.realtime) {
				this.ticks = time.realTicks(step[0], step[1]);
			} else {
				this.ticks = time.ticks(step[0], step[1]);
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
				this.values[i] = time(this.ticks[i]);
			}

			console.log(this.ticks, this.values);

			this.scale = $.extend((function(i) {
				return  i * unit;
			}), time);

		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "dateblock", grid);
		}
	}


	DateBlockGrid.setup = function() {
		return {
			/** @cfg {Array} [domain=null] */
			domain: null,
			/** @cfg {Array} [step=[]] */
			step: [],
			/** @cfg {Number} [min=0] min timestamp  */
			min: 0,
			/** @cfg {Number} [max=0] max timestamp  */
			max: 0,
			/** @cfg {Boolean} [reverse=false]  */
			reverse: false
		};
	}

	return DateBlockGrid;
}, "chart.grid.core");
