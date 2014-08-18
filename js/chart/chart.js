jui.defineUI("chart.chart", [ "util" ], function(_) {

	var UI = function() {
		var _grid = [], _widget = [], _brush = [], _data, _series;

		this.init = function() {
			this.parent.init.call(this);
			this.emit("load", []);
		}

		this.grid = function(key) {
			if (_grid[key]) {
				return _grid[key];
			}

			return _grid;
		}
		
		this.widget = function(key) {
			if (_widget[key]) {
				return _widget[key];
			}

			return _widget;
		}

		this.brush = function(key) {
			if (_brush[key]) {
				return _brush[key];
			}

			return _brush;
		}

		this.data = function(key) {
			if (_data[key]) {
				return _data[key];
			}

			return _data;
		}

		this.series = function(key) {
			if (_series[key]) {
				return _series[key];
			}

			return _series;
		}

		this.attr = function(type, key) {
			var bAttr = {},
                cAttr = (_series[key]) ? _series[key].attr : {};

			for (var k in _brush) {
				var b = _brush[k];

				if (b.type == type) {
					bAttr = _.clone(b.attr);
				}
			}

			return $.extend(bAttr, cAttr);
		}

		this.drawBefore = function() {
            // 데이타 설정
            var data = this.get('data');
            var series = this.get('series');
            var grid = this.get('grid');
            var widget = this.get('widget');
            // 내부적으로 완전히 clone 이 안되네?
            var brush = this.get('brush');
            var series_list = [];

            for (var k in grid) {
                _grid[k] = grid[k];
            }
            
            for (var k in widget) {
                _widget[k] = widget[k];
            }

            // series_list
            for (var key in series) {
                series_list.push(key);
                var obj = series[key];
                
                obj.min = 0;
                obj.max = 0;
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
                    obj.data[i] = value;

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

                    if (!b.target) {
                        b.target = series_list;
                    } else if ( typeof b.target == 'string') {
                        b.target = [b.target];
                    }
                }
            }

            //_grid = grid;
            _brush = brush;
            _data = data;
            _series = series;
		}

		this.draw = function() {
			var grid = this.grid();

			if (grid != null) {
				if (grid.type)
					grid = {
						c : grid
					};

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
			
			var widget = this.widget();
			
			if (widget != null) {
				for(var k in widget) {
					if (widget[k].type || widget[k].title) {
						var Obj = jui.include("chart.widget." + (widget[k].type || "title"));
						new Obj(k, widget[k]).render(this);						
					}

				}
			}
			
			this.emit("draw", []);
		}
	}

	UI.setting = function() {
		return {
			options : {
				"width" : "100%",
				"height" : "100%",

				// style
				"widget" : {
					left : { size : 50 },
					right : { size : 50 },
					bottom : { size : 50 },
					top : { size : 50 }
				},
				
				// chart
				"theme" : {},
				"labels" : [],
				"series" : {},
				"grid" : null,
				"brush" : null,
				"data" : [],
                "bind" : null
			}
		}
	}

	return UI;
}, "chart.core");
