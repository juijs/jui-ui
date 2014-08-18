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
	}

	return Grid;
}, "chart.draw"); 