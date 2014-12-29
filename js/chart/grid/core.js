jui.define("chart.grid.core", [ "jquery", "util.base" ], function($, _) {
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
						data = this.data();
					
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
				}

                if (grid.reverse) {
                    grid.domain.reverse();
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
				var min = grid.min || 0,
					max = grid.max || 0,
					data = this.data();
				var value_list = [];

				for (var i = 0; i < grid.target.length; i++) {
					var s = grid.target[i];

					if ( typeof s == "function") {
						for (var index = 0; index < data.length; index++) {
							var row = data[index];

							var value = +s.call(chart, row);

							value_list.push(value);
						}
					} else {
						for (var index = 0; index < data.length; index++) {

							var value = data[index][s];

							if (value instanceof Array) {
								for(var j = 0; j < value.length; j++) {
									value_list.push(value[j]);
								}
							} else {
								value_list.push(value);
							}

						}
					}

				}

				var tempMin = Math.min.apply(Math, value_list);
				var tempMax = Math.max.apply(Math, value_list);

				if (min > tempMin) min = tempMin;
				if (max < tempMax) max = tempMax;
				
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
					grid.step = Math.abs(start / unit) + Math.abs(end / unit);
					
				}

                if (grid.reverse) {
                    grid.domain.reverse();
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
				var data = this.data();

				var value_list = [] ;
				for (var i = 0; i < grid.target.length; i++) {
					var s = grid.target[i];
					
					for(var index = 0; index < data.length; index++) {
						var value = +new Date(data[index][s]);
						value_list.push(value);
					}
				}

				if (typeof min == 'undefined') min = Math.min.apply(Math, value_list);
				if (typeof max == 'undefined') max = Math.max.apply(Math, value_list);

				grid.max = max;
				grid.min = min;
				grid.domain = [grid.min, grid.max];

			}

            if (grid.reverse) {
                grid.domain.reverse();
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
			var self = this;
			
			function new_scale(i) {
				if (key) {
					i = self.data(i)[key];
				}
				
				return old_scale(i);
			}

			new_scale.update = function(obj) {
				self.grid = $.extend(self.grid, obj);
			}

			new_scale.domain = function() {
				return old_scale.domain.apply(old_scale, arguments);
			}

			new_scale.range = function() {
				return old_scale.range.apply(old_scale, arguments);
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
			new_scale.type = self.grid.type;
			
			return new_scale;
		}
		
		/**
		 * theme 이 적용된  axis line 리턴
		 * 
		 */
		this.axisLine = function(chart, attr) {
			return chart.svg.line($.extend({
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
			return chart.svg.line($.extend({
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

		this.data = function(index, field) {
			if(this.axis.data && this.axis.data[index]) {
				if(typeof field != 'undefined') {
					return this.axis.data[index][field];
				}

				return this.axis.data[index]
			}

			return this.axis.data || [];
		}

		/**
		 * grid 그리기  
		 * 
		 */		
		this.drawGrid = function(chart, orient, cls, grid) {
			// create group
			var root = chart.svg.group({
				"class" : [ "grid", cls ].join(" ")
			});

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

		this.getTextRotate = function(textElement) {
			var rotate = this.grid.textRotate;

			if (rotate == null) {
				return textElement;
			}

			if (typeof rotate == "function") {
				rotate = rotate.apply(this.chart, [ textElement ]);
			}

			var x = textElement.attr("x");
			var y = textElement.attr("y");

			textElement.rotate(rotate, x, y);

			return textElement;
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

            var originArea = chart.area("", true);
			var width = chart.area('width'),
				height = chart.area('height'),
				axis = (orient == "left" || orient == "right") ? chart.area('y') : chart.area('x'),
				max = (orient == "left" || orient == "right") ? height : width,
				start = axis,
				size = max;

			return {
				start: start,
				size: size,
				end: start + size
			}
		}

		this.getOptions = function(options) {
			return $.extend({
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
				line: false,
				format: null,
				textRotate : null
			}, options);
		}
	}

	return CoreGrid;
}, "chart.draw"); 