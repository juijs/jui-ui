jui.defineUI("chart.basic", [ "util.base" ], function(_) {

	var UI = function() {
		
		var self = this; 
		var _grid = {}, _padding = [], _brush = [], _data, _series, _scales = {}, _legend;
		
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
		
		this.padding = function(key) {
			if (_padding[key]) {
				return _padding[key];
			}

			return _padding;
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
		
		this.legend = function(key) {
			if (_legend[key]) {
				return _legend[key];
			}

			return _legend;
		}

		this.drawBefore = function() {
		    
            // 데이타 설정
            var data = _.deepClone(this.get('data'));
            var series = _.deepClone(this.get('series'));
            var grid = _.deepClone(this.get('grid'));
            var padding = _.deepClone(this.setPadding(this.get('padding')));
            var brush = _.deepClone(this.get('brush'));
            var legend = _.deepClone(this.get('legend'));
            var series_list = [];

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
            
            // series_list
            for (var key in series) {
                series_list.push(key);
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
			_padding = padding;
			_legend = legend;
			
			if (!_.typeCheck("array", _data)) {
				_data = [_data];
			}
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
		
		this.drawTitle = function() {
			var title = this.get('title');
			
			if (_.typeCheck("string", title)) {
				title = { text : title, top : true, align : 'center' }
			}
			
			if (title.text == "") {
				return; 
			}

			title.top = typeof title.top == 'undefined' ? true : title.top;
			title.bottom = typeof title.bottom == 'undefined' ? false : title.bottom;
			title.align = typeof title.align == 'undefined' ? 'center' : title.align;
			
			var x = 0;
			var y = 0;
			var anchor = 'middle';
			if (title.bottom) {
				y = this.y2() + this.padding('bottom') -20;
			} else if (title.top) {
				y = 20; 
			}
			
			if (title.align == 'center') {
				x = this.x() + this.width()/2;
				anchor = 'middle';
			} else if (title.align == 'left') {
				x = this.x();
				anchor = 'start';
				
			} else {
				x = this.x2();
				anchor = 'end';
			}
			
			this.text({
				x : x + (title.dx || 0),
				y : y + (title.dy || 0),
				'text-anchor' : anchor
			}, title.text).attr(title.attr);
		}
		
		this.drawLegend = function() {
			var legend = this.legend();
			
			if (!legend) return;

			legend.brush = legend.brush || [0];			
			var align = legend.align || "middle";
			var isTop = legend.top || false;
			var isBottom = legend.bottom || false;
			var isLeft = legend.left || false;
			var isRight = legend.right || false;

			
			if (!(isTop || isBottom || isLeft || isRight)) {
				isBottom = true; 
			}			
			
			var group = this.svg.group({ "class" : 'legend'});
			
			var x = 0;
			var y = 0; 

			var total_width = 0;
			var total_height = 0;
			
			var max_width = 0;
			var max_height = 0; 
			
			for(var i = 0; i < legend.brush.length; i++) {
				var index = legend.brush[i];
				var arr = _brush[index].obj.getLegendIcon(this, _brush[index]);
			

				for(var k = 0; k < arr.length; k++) {
					group.append(arr[k].icon);
					
					arr[k].icon.translate(x, y);
					if (isBottom || isTop) {						
						x += arr[k].width;
						total_width += arr[k].width;
						
						if (max_height < arr[k].height) {
							max_height = arr[k].height;
						}
					} else if (isLeft || isRight) {
						y += arr[k].height;
						total_height += arr[k].height;
						
						if (max_width < arr[k].width) {
							max_width = arr[k].width;
						}
					}
				}					

			}
			
			// legend 위치  선정
			if (isBottom || isTop) {
				var y = (isBottom) ? this.y2() + this.padding('bottom') - max_height : this.y()-this.padding('top');
				
				if (align == 'start') {
					x = this.x();
				} else if (align == 'middle') {
					x = this.x() + (this.width()/2- total_width/2);
				} else if (align == 'end') {
					x = this.x2() - total_width;
				}
			} else if (isLeft || isRight) {
				var x = (isLeft) ? this.x() - this.padding('left') : this.x2() + this.padding('right') - max_width;
				
				if (align == 'start') {
					y = this.y();
				} else if (align == 'middle') {
					y = this.y() + (this.height()/2 - total_height/2);
				} else if (align == 'end') {
					y = this.y2() - total_height;
				}
			} 
			
			group.translate(x, y);
		}		
		
		this.drawGrid = function() {
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
		}
		
		this.drawWidget = function(brush) {
			if (!_.typeCheck("array", brush.widget)) {
				brush.widget = [brush.widget];
			}
			
			for(var index = 0; index < brush.widget.length; index++) {
				var widget = brush.widget[index];
				
				var WidgetObj = jui.include("chart.brush." + widget);
				
				var clone = {};
				
				for(var key in brush) {
					clone[key] = brush[key];
				}
				
				clone.type = widget;
				
				
				new WidgetObj(clone).render(this);
			}
		}
		
		this.drawBrush = function() {
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

					_brush[i].obj = new Obj(_brush[i]);
					_brush[i].obj.render(this);
					
					if (_brush[i].widget) {
						this.drawWidget(_brush[i]);
					}
				}
			}
		}

		this.draw = function() {
		    _scale = {};
		          
            this.drawDefs();
            
            this.drawGrid();
		    

			this.drawBrush();
			
            
            this.drawTitle();
            
            this.drawLegend();			
			
			this.emit("draw", []);
		}
	}

	UI.setting = function() {
		return {
			options : {
				"width" : "100%",
				"height" : "100%",

				// style
				"padding" : {
					left : 50 ,
					right : 50,
					bottom : 50,
					top : 50 
				},
				
				// chart
				"theme" : "jennifer",
				"title" : "",
				"legend" : "",
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
