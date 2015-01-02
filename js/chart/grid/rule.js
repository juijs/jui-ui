jui.define("chart.grid.rule", [ "util.scale" ], function(UtilScale) {

	var RuleGrid = function(chart, axis, grid) {
		var orient = grid.orient;
		var domain = [];

		this.top = function(chart, g) {
			var height = chart.area('height'),
				half_height = height/2;

			g.append(this.axisLine(chart, {
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
					axis = chart.svg.group().translate(values[i], (this.center) ? half_height : 0)

				axis.append(this.line(chart, {
				  y1 : (this.center) ? -bar : 0,
					y2 : bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth")
				}));

				if (!isZero || (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(chart.text({
						x : 0,
						y : bar + bar + 4,
						"text-anchor" : "middle",
						fill : chart.theme("gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.bottom = function(chart, g) {
			var height = chart.area('height'),
				half_height = height/2;
		  
			g.append(this.axisLine(chart, {
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
					axis = chart.svg.group().translate(values[i], (this.center) ? -half_height : 0);

				axis.append(this.line(chart, {
				  y1 : (this.center) ? -bar : 0,
					y2 : (this.center) ? bar : -bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth")
				}));
				
				if (!isZero ||  (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(chart.text({
						x : 0,
						y : -bar * 2,
						"text-anchor" : "middle",
						fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.left = function(chart, g) {
			var width = chart.area('width'),
				height = chart.area('height'),
				half_width = width/2;

			g.append(this.axisLine(chart, {
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
					axis = chart.svg.group().translate((this.center) ? half_width : 0, values[i])

				axis.append(this.line(chart, {
					x1 : (this.center) ? -bar : 0,
					x2 : bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth")					
				}));
				
				if (!isZero ||  (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(chart.text({
					  x : bar/2 + 4,
					  y : bar-2,
					  fill : chart.theme("gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.right = function(chart, g) {
			var width = chart.area('width'),
				half_width = width/2;

			g.append(this.axisLine(chart, {
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
					axis = chart.svg.group().translate((this.center) ? -half_width : 0, values[i]);

				axis.append(this.line(chart, {
					x1 : (this.center) ? -bar : 0,
					x2 : (this.center) ? bar : -bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth")
				}));

				if (!isZero ||  (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(chart.text({
						x : -bar - 4,
						y : bar-2,
						"text-anchor" : "end",
						fill : chart.theme("gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		/**
		 * range grid 의 domain 설정
		 *
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성
		 *
		 */
		this.initDomain = function() {

			var min = this.grid.min || 0,
				max = this.grid.max || 0,
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

			if (min > tempMin) min = tempMin;
			if (max < tempMax) max = tempMax;

			this.grid.max = max;
			this.grid.min = min;

			var unit;

			if (_.typeCheck("function", this.grid.unit)) {
				unit = this.grid.unit.call(this.chart);
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

				var end = 0;
				while (end > min) {
					end -= unit;
				}

				domain = [end, start];
				this.grid.step = Math.abs(start / unit) + Math.abs(end / unit);
			}

			if (this.grid.reverse) {
				domain.reverse();
			}

			return domain;
		}

		this.drawBefore = function() {
			initDomain();

			var obj = this.getGridSize(chart, orient, grid);
			this.scale = UtilScale.linear().domain(domain);

			if (orient == "left" || orient == "right") {
				this.scale.range([obj.end, obj.start]);
			} else {
				this.scale.range([obj.start, obj.end]);
			}

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
			domain: null,
			step: 10,
			min: 0,
			max: 0,
			unit: null,
			reverse: false,
			key: null,
			hideZero: false,
			hideText: false,
			nice: false,
			center: false
		};
	}

	return RuleGrid;
}, "chart.grid.core");
