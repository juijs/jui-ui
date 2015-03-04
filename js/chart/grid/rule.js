jui.define("chart.grid.rule", [ "util.scale", "util.base" ], function(UtilScale, _) {

	/**
	 * @class chart.grid.rule
	 *
	 * implements rule grid
	 *
	 * @extends chart.grid.core
	 */
	var RuleGrid = function() {

		this.top = function(g) {
			var height = this.axis.area('height'),
				half_height = height/2;

			g.append(this.axisLine({
				y1 : this.center ? half_height : 0,
				y2 : this.center ? half_height : 0,
				x1 : this.start,
				x2 : this.end
			}));

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0),
					axis = this.chart.svg.group().translate(values[i], (this.center) ? half_height : 0)

				axis.append(this.line({
				  y1 : (this.center) ? -bar : 0,
					y2 : bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridBorderWidth")
				}));

				if (!isZero || (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(this.chart.text({
						x : 0,
						y : bar + bar + 4,
						"text-anchor" : "middle",
						fill : this.chart.theme("gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.bottom = function(g) {
			var height = this.axis.area('height'),
				half_height = height/2;
		  
			g.append(this.axisLine({
				y1 : this.center ? -half_height : 0,
				y2 : this.center ? -half_height : 0,
				x1 : this.start,
				x2 : this.end
			}));

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0),
					axis = this.chart.svg.group().translate(values[i], (this.center) ? -half_height : 0);

				axis.append(this.line({
				  y1 : (this.center) ? -bar : 0,
					y2 : (this.center) ? bar : -bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridBorderWidth")
				}));
				
				if (!isZero ||  (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(this.chart.text({
						x : 0,
						y : -bar * 2,
						"text-anchor" : "middle",
						fill : this.chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.left = function(g) {
			var width = this.axis.area('width'),
				height = this.axis.area('height'),
				half_width = width/2;

			g.append(this.axisLine({
				x1 : this.center ? half_width : 0,
				x2 : this.center ? half_width : 0,
				y1 : this.start ,
				y2 : this.end
			}));

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0),
					axis = this.chart.svg.group().translate((this.center) ? half_width : 0, values[i])

				axis.append(this.line({
					x1 : (this.center) ? -bar : 0,
					x2 : bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridBorderWidth")
				}));
				
				if (!isZero ||  (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(this.chart.text({
					  x : bar/2 + 4,
					  y : bar-2,
					  fill : this.chart.theme("gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.right = function(g) {
			var width = this.axis.area('width'),
				half_width = width/2;

			g.append(this.axisLine({
				x1 : this.center ? -half_width : 0,
				x2 : this.center ? -half_width : 0,
				y1 : this.start ,
				y2 : this.end
			}));

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0),
					axis = this.chart.svg.group().translate((this.center) ? -half_width : 0, values[i]);

				axis.append(this.line({
					x1 : (this.center) ? -bar : 0,
					x2 : (this.center) ? bar : -bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridBorderWidth")
				}));

				if (!isZero ||  (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(this.chart.text({
						x : -bar - 4,
						y : bar-2,
						"text-anchor" : "end",
						fill : this.chart.theme("gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

        this.wrapper = function(scale, key) {
            var old_scale = scale;
            var self = this;

            function new_scale(i) {
                return old_scale(self.axis.data[i][key]);
            }

            return (key) ? $.extend(new_scale, old_scale) : old_scale;
        }
        
		/**
		 * range grid 의 domain 설정
		 *
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성
		 *
		 */
        this.initDomain = function() {

			var domain = [];
            var min = this.grid.min || undefined,
                max = this.grid.max || undefined,
                data = this.data();
            var value_list = [];

            if (_.typeCheck("string", this.grid.domain)) {
                var field = this.grid.domain;

                value_list = new Array(data.length);
                for (var index = 0, len = data.length; index < len; index++) {

                    var value = data[index][field];

                    if (_.typeCheck("array", value)) {
                        value_list[index] = Math.max(value);
                        value_list.push(Math.min(value));
                    } else {
                        value_list[index]  = value;
                    }

                }
            } else if (_.typeCheck("function", this.grid.domain)) {
                value_list = new Array(data.length);

                for (var index = 0, len = data.length; index < len; index++) {

                    var value = this.grid.domain.call(this.chart, data[index]);

                    if (_.typeCheck("array", value)) {

                        value_list[index] = Math.max.apply(Math, value);
                        value_list.push(Math.min.apply(Math, value));
                    } else {
                        value_list[index]  = value;
                    }
                }
            } else {
                value_list = grid.domain;
            }

            var tempMin = Math.min.apply(Math, value_list);
            var tempMax = Math.max.apply(Math, value_list);

            if (typeof min == 'undefined') min = tempMin;
            if (typeof max == 'undefined') max = tempMax;

            this.grid.max = max;
            this.grid.min = min;

            var unit;

            if (_.typeCheck("function", this.grid.unit)) {
                unit = this.grid.unit.call(this.chart, this.grid);
            } else if (_.typeCheck("number", this.grid.unit)) {
                unit = this.grid.unit;
            } else {
                unit = Math.ceil((max - min) / this.grid.step);
            }

            if (unit == 0) {
                domain = [0, 0];
            } else {

                var start = 0;

                while (start < max) {
                    start += unit;
                }

                var end = start;
                while (end > min) {
                    end -= unit;
                }

                domain = [end, start];
                //this.grid.step = Math.abs(start / unit) + Math.abs(end / unit);
            }

            if (this.grid.reverse) {
                domain.reverse();
            }

            return domain;
        }

		this.drawBefore = function() {
			var domain = this.initDomain();

			var obj = this.getGridSize();
			this.scale = UtilScale.linear().domain(domain);

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
			this.bar = 6;
			this.hideZero = this.grid.hideZero;
			this.center = this.grid.center;
			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = this.scale(this.ticks[i]);
			}
		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "rule", grid);
		}
	}

	RuleGrid.setup = function() {
		return {
			/** @cfg {String/Array/Function} [domain=null] Sets the value displayed on an axis.*/
			domain: null,
			/** @cfg {Array} [step=10] Sets the interval of the scale displayed on a grid. */
			step: 10,
			/** @cfg {Number} [min=0] Sets the minimum value of a grid.  */
			min: 0,
			/** @cfg {Number} [max=0] Sets the maximum value of a grid. */
			max: 0,
			/** @cfg {Number} [unit=null] Multiplies the axis value to be displayed.  */
			unit: null,
			/**
			 * @cfg {Boolean} [clamp=true]
			 *
			 * max 나 min 을 넘어가는 값에 대한 체크,
			 * true 이면 넘어가는 값도 min, max 에서 조정, false 이면  비율로 계산해서 넘어가는 값 적용
			 */
			clamp : true,
			/** @cfg {Boolean} [reverse=false] Reverses the value on domain values*/
			reverse: false,
			/** @cfg {String} [key=null] Sets the value on the grid to the value for the specified key. */
			key: null,
			/** @cfg {Boolean} [hideText=false] Determines whether to show text across the grid. */
			hideText: false,
			/** @cfg {Boolean} [hideZero=false] Determines whether to show '0' displayed on the grid. */
			hideZero: false,
			/** @cfg {Boolean} [nice=false] Automatically sets the value of a specific section.  */
			nice: false,
			/** @cfg {Boolean} [center=false] Place the reference axis in the middle.  */
			center: false

		};
	}

	return RuleGrid;
}, "chart.grid.core");
