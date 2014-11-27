jui.define("chart.grid.core", [ "util.base" ], function(_) {
	/**
	 * Grid Core 객체 
	 * 
	 */
	var CoreGrid = function() {

		/**
		 * block,radar grid 에 대한 domain 설정
		 *  
		 */
		this.setBlockDomain = function(chart, grid) {
			if (grid.type == "radar" || grid.type == "block") {
				if (grid.target && !grid.domain) {
					var domain = [],
						data = chart.data();
					
                    if (grid.reverse) {
                        var start = data.length - 1,
							end = 0,
							step = -1;
                    } else {
                        var start = 0,
							end = data.length - 1,
							step = 1;
                    }
					
					for (var i = start; ((grid.reverse) ? i >= end : i <=end); i += step) {
						domain.push(data[i][grid.target]);
					}

					grid.domain = domain;

					if (grid.reverse) {
						grid.domain.reverse();
					}
				}
			}
			
			return grid; 			
		}
		
		/**
		 * range grid 의 domain 설정 
		 * 
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성 
		 * 
		 */
		this.setRangeDomain = function(chart, grid) {
			if ( typeof grid.target == "string" || typeof grid.target == "function") {
				grid.target = [grid.target];
			}

			if (grid.target && grid.target.length && !grid.domain) {
				var max = grid.max,
					min = grid.min;
				var data = chart.data();

				for (var i = 0; i < grid.target.length; i++) {
					var s = grid.target[i];

					if ( typeof s == "function") {
						for (var index = 0; index < data.length; index++) {
							var row = data[index];

							var value = +s(row);

							if (max < value)
								max = value;
							if (min > value)
								min = value;

						}
					} else {
						var _max = chart.series(s).max;
						var _min = chart.series(s).min;
						if (max < _max)
							max = _max;
						if (min > _min)
							min = _min;
					}

				}
				
				grid.max = max;
				grid.min = min;

				var unit = grid.unit || Math.ceil((max - min) / grid.step),
					start = 0;

				while (start < max) {
					start += unit;
				}

				var end = 0;
				while (end > min) {
					end -= unit;
				}

				if (unit == 0) {
					grid.domain = [0, 0];
				} else {
					grid.domain = [end, start];					
					if (grid.reverse) {
						grid.domain.reverse();
					}
					grid.step = Math.abs(start / unit) + Math.abs(end / unit);					
					
				}
			}
			
			return grid; 
		}
		
		/**
		 * date grid 의 domain 설정 
		 * 
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성 
		 * 
		 */
		this.setDateDomain = function(chart, grid) {
			if ( typeof grid.target == "string" || typeof grid.target == "function") {
				grid.target = [grid.target];
			}

			if (grid.target && grid.target.length) {
				var min = grid.min || undefined,
					max = grid.max || undefined;
				var data = chart.data();
				
				for (var i = 0; i < grid.target.length; i++) {
					var s = grid.target[i];
					
					for(var index = 0; index < data.length; index++) {
						var value = +data[index][s];
						if (typeof min == "undefined") min = value;
						else if (min > value) min = value;
						
						if (typeof max == "undefined") max = value;
						else if (max < value) max = value;						
					}
				}
				
				grid.max = max;
				grid.min = min;
				grid.domain = [grid.min, grid.max];
				
				if (grid.reverse) {
					grid.domain.reverse();
				}				
			}
			
			return grid; 
		}		
		
		/**
		 * scale wrapper 
		 * 
		 * grid 의 x 좌표 값을 같은 형태로 가지고 오기 위한 wrapper 함수 
		 * 
		 * grid 속성에 key 가 있다면  key 의 속성값으로 실제 값을 처리 
		 * 
		 * ex) 
		 * 
		 * // 그리드 속성에 키가 없을 때 
		 * scale(0);		// 0 인덱스에 대한 값  (block, radar)
		 * 
		 * // grid 속성에 key 가 있을 때  
		 * grid { key : "field" }
		 * scale(0)			// field 값으로 scale 설정 (range, date)
		 * 
		 */
		this.wrapper = function(chart, scale, key) {
			var old_scale = scale; 
			
			function new_scale(i) {
				
				if (key) {
					i = chart.data(i)[key];
				}
				
				return old_scale(i);
			}	
			
			new_scale.max = function() {
				return old_scale.max.apply(old_scale, arguments);
			}
			
			new_scale.min = function() {
				return old_scale.min.apply(old_scale, arguments);
			}
			
			new_scale.rangeBand = function() {
				return old_scale.rangeBand.apply(old_scale, arguments);
			}
			
			new_scale.rate = function() {
				return old_scale.rate.apply(old_scale, arguments);
			}
			
			new_scale.invert = function() {
				return old_scale.invert.apply(old_scale, arguments);
			}
			
			new_scale.clamp = function() {
				return old_scale.clamp.apply(old_scale, arguments);
			}
			
			new_scale.key = key;
			
			return new_scale;
		}
		
		/**
		 * theme 이 적용된  axis line 리턴 
		 * 
		 */
		this.axisLine = function(chart, attr) {
			return chart.svg.line(_.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,
				stroke : this.color("gridAxisBorderColor"),
				"stroke-width" : chart.theme("gridAxisBorderWidth"),
				"stroke-opacity" : 1
			}, attr));
		}

		/**
		 * theme 이 적용된  line 리턴 
		 * 
		 */
		this.line = function(chart, attr) {
			return chart.svg.line(_.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,				
				stroke : this.color("gridBorderColor"),
				"stroke-width" : chart.theme("gridBorderWidth"),
				"stroke-dasharray" : chart.theme("gridBorderDashArray"),
				"stroke-opacity" : 1
			}, attr));
		}

		this.color  = function(theme) {

			if (arguments.length == 3) {
				return (this.grid.color) ? this.chart.color(0, { colors: [ this.grid.color ] }) : this.chart.theme.apply(this.chart, arguments);
			}

			return (this.grid.color) ? this.chart.color(0, { colors: [ this.grid.color ] }) : this.chart.theme(theme);
		}

		/**
		 * grid 그리기  
		 * 
		 */		
		this.drawGrid = function(chart, orient, cls, grid) {
			// create group
			var root = chart.svg.group({
				"class" : ["grid", cls].join(" ")
			})

			// render axis
			this[orient].call(this, chart, root);

			// wrapped scale
			this.scale = this.wrapper(chart, this.scale, grid.key);

			// hide grid 
			if (grid.hide) {
				root.attr({ display : "none" })
			}

			return {
				root : root,
				scale : this.scale
			};
		}

		/**
		 * grid 의 실제 위치와 size 를 구함
		 *
		 * @param chart
		 * @param orient
		 * @param grid
		 * @returns {{start: number, size: *}}
		 */
		this.getGridSize = function(chart, orient, grid) {
			var width = chart.width();
			var height = chart.height();
			var max = (orient == "left" || orient == "right") ? height : width;

			var start = 0;
			if (grid.start) {
				if (typeof grid.start == 'string' && grid.start.indexOf("%") > -1){
					start = max * parseFloat(grid.start.replace("%", ""))/100
				} else {
					start = grid.start
				}
			}

			var size = max ;
			if (grid.size) {
				if (typeof grid.size == 'string' && grid.size.indexOf("%") > -1){
					size = max * parseFloat(grid.size.replace("%", ""))/100
				} else {
					size = grid.size
				}
			}

			if (start == 'center') {
				start = max / 2 - size / 2;
			}

			return {
				start  : start,
				size : size,
				end : start + size
			}
		}

		this.drawSetup = function() {
			var self = this;

			var callback = function(value) {
				return self.chart.format(value);
			}

			return {
				domain: null,
				step: 10,
				min: 0,
				max: 0,
				reverse: false,
				key: null,
				hide: false,
				unit: 0,
				color: null,
				title: null,
				start: null,
				size: null,
				line: false,
				format: callback
			}
		}
	}

	return CoreGrid;
}, "chart.draw"); 