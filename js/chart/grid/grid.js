jui.define("chart.grid", [ "util" ], function(_) {
	var Grid = function() {

		this.setBlockDomain = function(chart, grid) {
			if (grid.type == 'radar' || grid.type == 'block') {

				if (grid.target && !grid.domain) {
					var domain = [];
					var data = chart.data();
					for (var i = 0; i < data.length; i++) {
						domain.push(data[i][grid.target]);
					}

					grid.domain = domain;
					grid.step = grid.step || 10;
					grid.max = grid.max || 100;
				}
			}
			
			return grid; 			
		}
		
		this.setRangeDomain = function(chart, grid) {
			if ( typeof grid.target == 'string' || typeof grid.target == 'function') {
				grid.target = [grid.target];
			}

			if (grid.target && grid.target.length) {
				var max = 0;
				var min = 0;
				var data = chart.data();
				for (var i = 0; i < grid.target.length; i++) {
					var s = grid.target[i];

					if ( typeof s == 'function') {
						for (var index = 0; index < data.length; index++) {
							var row = data[index];

							var value = s(row);

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
				grid.step = grid.step || 10;

				var unit = Math.ceil((max - min) / grid.step);
				
				var start = 0;
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


			}			
			
			return grid; 
		}
		
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
			
			return new_scale;
		}
		
		
		this.axisLine = function(chart, attr) {
			return chart.svg.line(_.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,
				stroke : chart.theme("gridAxisBorderColor"),
				"stroke-width" : chart.theme("gridAxisBorderWidth"),
				"stroke-opacity" : 1
			}, attr));
		}

		this.line = function(chart, attr) {
			return chart.svg.line(_.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,				
				stroke : chart.theme("gridAxisBorderColor"),
				"stroke-width" : chart.theme("gridBorderWidth"),
				"stroke-opacity" : 1
			}, attr));
		}		
		
		this.drawGrid = function(chart, orient, cls, grid) {
			// create group
			var root = chart.svg.group({
				'class' : ['grid', cls].join(" "),
			})

			// render axis
			this[orient].call(this, chart, root);

			// wrapped scale
			this.scale = this.wrapper(chart, this.scale, grid.key);

			// hide
			if (grid.hide) {
				root.attr({ display : 'none' })
			}

			return {
				root : root,
				scale : this.scale
			};
		}
		
	}

	return Grid;
}, "chart.draw"); 