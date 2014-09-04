jui.defineUI("chart.basic", [ "util.base" ], function(_) {

	var UI = function() {
		
		var self = this; 
		var _grid = {}, _widget = [], _brush = [], _data, _series, _scales = {};
		
		this.text = function(attr, textOrCallback) {
			var el = this.svg.text(_.extend({
				"font-family" : this.theme("fontFamily"),
				"font-size" : this.theme("fontSize"),
				"fill" : this.theme("fontColor")
			}, attr), textOrCallback);
			
			return el; 
		}

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
		
		this.widget.size = function(key) {
			var obj = self.widget(key);
			
			if (!_.typeCheck("array", obj)) {
				obj = [obj];
			}
			
			var size = 0;
			for(var i = 0; i < obj.length; i++) {
				size += obj[i].size;
			}
			
			return size;
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

		this.drawBefore = function() {
		    
            // 데이타 설정
            var data = _.deepClone(this.get('data'));
            var series = _.deepClone(this.get('series'));
            var grid = _.deepClone(this.get('grid'));
            var widget = _.deepClone(this.setWidget(this.get('widget')));
            var brush = _.deepClone(this.get('brush'));
            var series_list = [];

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

                for (var key in row) {
                    var obj = series[key] || {};
                    var value = row[key];
                    
                    series[key] = obj;

                    obj.data = obj.data || [];
                    obj.min = typeof obj.min == 'undefined' ?  0 : obj.min;
                    obj.max = typeof obj.max == 'undefined' ?  0 : obj.max;
                    obj.data[i] = value;

                    if (value < obj.min) {
                        obj.min = value;
                    }
                    
                    if (value > obj.max) {
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
			_grid = grid;
			_widget = widget;
			            
            this.drawDefs();
		}
		
		this.createId = function(key) {
			return [key || "chart-id", (+new Date), Math.round(Math.random()*100)%100].join("-")
		}
		
		this.drawDefs = function() {
			
            // draw defs 
            var defs = this.svg.defs();
            

			// default clip path             
			this.clipId = this.createId('clip-id');
			
            var clip = this.svg.clipPath({ id : this.clipId });
            clip.append(this.svg.rect({  x : 0, y : 0, width : this.width(), height : this.height() }));
                        
            defs.append(clip);
            
            this.defs = defs;
			
		}

		this.draw = function() {
		    _scale = {};
		    
			var grid = this.grid();
			
			var grid_list = {};
			if (grid != null) {
				
				if (grid.type) {
					grid = {
						c : grid
					};
				}

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
						
					if (!_scales[k]) {
						_scales[k] = [];
					}

					
					if (!_.typeCheck("array", grid[k])) {
						grid[k] = [grid[k]];
					}

					
					for(var keyIndex = 0, len = grid[k].length; keyIndex < len; keyIndex++) {
						var Grid = jui.include("chart.grid." + (grid[k][keyIndex].type || "block"))
						var obj = new Grid(orient, grid[k][keyIndex]).render(this);

						var dist = grid[k][keyIndex].dist || 0;
						
						// grid 별 dist 로 위치선정하기 
						if (k == 'y') {
							obj.root.translate(this.x() - dist, this.y());
						} else if (k == 'y1') {
							obj.root.translate(this.x2() + dist, this.y());
						} else if (k == 'x') {
							obj.root.translate(this.x(), this.y2() + dist);
						} else if (k == 'x1') {
							obj.root.translate(this.x(), this.y() - dist);
						}

						 _scales[k][keyIndex] = obj.scale			
					}					
					
				}
			}

			if (_brush != null) {
				for (var i = 0; i < _brush.length; i++) {
					
					delete _brush[i].x;
					delete _brush[i].y;
					
					var Obj = jui.include("chart.brush." + _brush[i].type);

					if (_scales.x || _scales.x1) {
						if (!_.typeCheck("function", _brush[i].x)) {
							_brush[i].x = (typeof _brush[i].x1 !== 'undefined') ? _scales.x1[_brush[i].x1 || 0] : _scales.x[_brush[i].x || 0];
						}
					}
					if (_scales.y || _scales.y1) {
						if (!_.typeCheck("function", _brush[i].y)) {
							_brush[i].y = (typeof _brush[i].y1 !== 'undefined') ? _scales.y1[_brush[i].y1 || 0] : _scales.y[_brush[i].y || 0];
						}
					}						
					if (_scales.c){
						if (!_.typeCheck("function", _brush[i].c)) {
							_brush[i].c = _scales.c[_brush[i].c || 0];
						}
					}
						
					_brush[i].index = i;

					new Obj(_brush[i]).render(this);
				}

			}
			
			var widget = this.widget();
			
			if (widget != null) {
				for(var k in widget) {
					
					if (!_.typeCheck("array", widget[k])) {
						widget[k] = [widget[k]];
					}
					
					for(var i = 0; i < widget[k].length; i++) {
						var w  = widget[k][i];

						if (w.type || w.text) {
							var Obj = jui.include("chart.widget." + (w.type || "text"));
							new Obj(k, w).render(this);						
						}
						
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
				"theme" : "white",
				"labels" : [],
				"series" : {},
				"grid" : {},
				"brush" : [],
				"data" : [],
                "bind" : null
			}
		}
	}

	return UI;
}, "chart.core");
