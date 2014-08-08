jui.defineUI("chart.chart", [], function() {

	var UI = function() {
		var _grid = [], _brush = [];

		this.init = function() {
			this.parent.init.call(this);

			// 데이타 설정
			var data = this.get('data');
			var series = this.get('series');
			var grid = this.get('grid');
			var brush = this.get('brush');
			var series_list = [];

			// series_list
			for (var key in series) {
				series_list.push(key);
			}

			// series 데이타 구성
			for (var i = 0, len = data.length; i < len; i++) {
				var row = data[i];

				for (var key in series) {
					var obj = series[key];
					var value = row[key];

					obj.data = obj.data || [];
					obj.min = obj.min || 0;
					obj.max = obj.max || 0;
					obj.data.push(value);

					if (value < obj.min) {
						obj.min = value;
					} else if (value > obj.max) {
						obj.max = value;
					}
				}
			}

			// grid 최소, 최대 구성
			if (brush != null) {
				if ( typeof brush == 'string') {
					brush = [{
						type : brush
					}];
				} else if ( typeof brush == 'object' && !brush.length) {
					brush = [brush];
				}

				for (var i = 0, len = brush.length; i < len; i++) {
					var b = brush[i];

					if (!b.series) {
						b.series = series_list;
					} else if ( typeof b.series == 'string') {
						b.series = [b.series];
					}
				}
			}

			_grid = grid;
			_brush = brush;
		}

		this.drawBefore = function() {
		}

		this.draw = function() {
			var grid = this.get('grid');
			
			if (grid != null) {
				if (grid.type)  grid = { c : grid };
	
				for (var k in grid) {
					var orient = 'custom';
	
					if (k == 'x')
						orient = 'bottom';
					else if (k == 'x1')
						orient = 'top';
					else if (k == 'y')
						orient = 'left';
					else if (k == 'y1')
						orient = 'right';
	
					this.setDomain(grid[k]);
					var Grid = jui.include("chart.grid." + (grid[k].type || "block"))
					this[k] = new Grid(orient, grid[k]).render(this);
				}
			}


			if (_brush != null) {
				for (var i = 0; i < _brush.length; i++) {
					var Obj = jui.include("chart.brush." + _brush[i].type);

					if (this.x || this.x1)
						_brush[i].x = (_brush[i].x1) ? this.x1 : this.x;
					if (this.y || this.y1)
						_brush[i].y = (_brush[i].y1) ? this.y1 : this.y;
					if (this.c)
						_brush[i].c = this.c;

					_brush[i].index = i;

					new Obj(_brush[i]).render(this);
				}

			}
		}

		this.setDomain = function(axis) {

			var series = this.get('series');
			var data = this.get('data');

			if (axis.type == 'radar') {

				if (axis.series && !axis.domain) {
					var domain = [];
					for (var i = 0; i < data.length; i++) {
						domain.push(data[i][axis.series]);
					}

					axis.domain = domain;
					axis.step = axis.step || 10;
					axis.max = axis.max || 100; 
				}

				return;
			}

			if ( typeof axis.series == 'string' || typeof axis.series == 'function') {
				axis.series = [axis.series];
			}

			if (axis.series && axis.series.length) {
				var max = 0;
				var min = 0;

				for (var i = 0; i < axis.series.length; i++) {
					var s = axis.series[i];

					if (typeof s == 'function') {
						for (var index = 0; index < data.length; index++) {
							var row = data[index];

							var value = s(row);

							if (max < value)
								max = value;
							if (min > value)
								min = value;

						}						
					} else {
						var _max = series[s].max;
						var _min = series[s].min;
						if (max < _max)
							max = _max;
						if (min > _min)
							min = _min;						
					}


				}
				
				axis.max = max;
				axis.min = min;
				axis.step = axis.step || 10; 

				var unit = Math.ceil((max - min) / axis.step);

				var start = 0;
				while (start < max) {
					start += unit;
				}

				var end = 0;
				while (end > min) {
					end -= unit;
				}

				axis.domain = [end, start];
				axis.step = Math.abs(start / unit) + Math.abs(end / unit);	
				
			}
		}
	}

	UI.setting = function() {
		return {
			options : {
				"type" : "svg",
				"width" : "100%",
				"height" : "100%",

				// style
				"padding" : 30,
				"barPadding" : 10,
				"seriesPadding" : 1,
				"titleHeight" : 50,
				"titleYWidth" : 50,
				"titleXHeight" : 50,

				// chart
				"tick" : 5,
				"title" : "",
				"titleY" : "",
				"titleX" : "",
				"theme" : {},
				"labels" : [],
				"series" : {},
				"grid" : null,
				"brush" : null,
				"data" : []
			}
		}
	}

	return UI;
}, "chart.core"); 