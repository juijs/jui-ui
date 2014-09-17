jui.defineUI("chart.basic", [ "util.base" ], function(_) {
	/**
	 * Chart 구현 
	 * 
	 */
	var UI = function() {
		var _grid = {}, _brush = [], _widget = [];
		var _padding = [], _scales = {};
        var _data, _series;

        /**
         * Brush 옵션을 가공하여, 실제 사용되는 객체를 만든다.
         * Widget도 같이 사용한다.
         *
         * @param draws
         * @param series_list
         * @returns {*}
         */
        function createBrushData(draws, series_list) {
            var result = null;

            if (draws != null) {
                if ( typeof draws == 'string') {
                    result = [{
                        type : draws
                    }];
                } else if ( typeof draws == 'object' && !draws.length) {
                    result = [ draws ];
                } else {
                    result = draws;
                }

                for (var i = 0, len = result.length; i < len; i++) {
                    var b = result[i];

                    if (!b.target) {
                        b.target = series_list;
                    } else if ( typeof b.target == 'string') {
                        b.target = [ b.target ];
                    }
                }
            }

            return result;
        }

        /**
		 * 현재 text 관련 theme 가 정해진 text element 생성 
		 * 
		 * @param {object} attr
		 * @param {string|function} textOrCallback
		 */
		this.text = function(attr, textOrCallback) {
			var el = this.svg.text(_.extend({
				"font-family" : this.theme("fontFamily"),
				"font-size" : this.theme("fontSize"),
				"fill" : this.theme("fontColor")
			}, attr), textOrCallback);
			
			return el; 
		}

		/**
		 * 생성자 재정의 
		 * 
		 */
		this.init = function() {
			this.parent.init.call(this);
			this.emit("load", []);
		}

		/**
		 * grid 옵션 리턴 
		 * 
		 * @param {string} key
		 * 
		 */
		this.grid = function(key) {
			if (_grid[key]) {
				return _grid[key];
			}

			return _grid;
		}
		
		/**
		 * padding 옵션 리턴 
		 * 
		 * @param {string} key
		 * 
		 */
		this.padding = function(key) {
			if (_padding[key]) {
				return _padding[key];
			}

			return _padding;
		}
		
		/**
		 * brush 옵션 리턴 
		 * 
		 * @param {string} key
		 * 
		 */
		this.brush = function(key) {
			if (_brush[key]) {
				return _brush[key];
			}

			return _brush;
		}
		
		/**
		 * data 옵션 리턴 
		 * 
		 * @param {integer} index
		 * 
		 */
		this.data = function(index, field) {
			if (_data[index]) {
				
				if (typeof field != 'undefined') {
					return _data[index][field];	
				} 
				
				return _data[index];
			}

			return _data;
		}
		
		/**
		 * series 옵션 리턴 
		 * 
		 * @param {string} key
		 * 
		 */
		this.series = function(key) {
			if (_series[key]) {
				return _series[key];
			}

			return _series;
		}
		
		
		/**
		 * draw 이전에 환경 셋팅 
		 * 
		 */
		this.drawBefore = function() {
            // 데이타 설정 , deepClone 으로 기존 옵션 값에 영향을 주지 않음
            var data = _.deepClone(this.options.data),
                series = _.deepClone(this.options.series),
                grid = _.deepClone(this.options.grid),
                padding = _.deepClone(this.setPadding(this.options.padding)),
                brush = _.deepClone(this.options.brush),
                widget = _.deepClone(this.options.widget),
                series_list = [];

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

            _brush = createBrushData(brush, series_list);
            _widget = createBrushData(widget, series_list);
            _data = data;
            _series = series;
			_grid = grid;
			_padding = padding;
			
			if (!_.typeCheck("array", _data)) {
				_data = [_data];
			}
		}
		
		/**
		 * chart 내에서 사용될 유일한 키 생성 
		 * 
		 * @param {string} key 
		 */
		this.createId = function(key) {
			return [key || "chart-id", (+new Date), Math.round(Math.random()*100)%100].join("-")
		}
		
		/**
		 * svg 기본 defs element 생성  
		 * 
		 */
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

		
		/**
		 * grid 그리기 
		 * 
		 * 설정된 grid 객체를 통해서 
		 * 
		 * x(bottom), y(left), x1(top), y1(right) 
		 * 
		 * 의 방향으로 grid 를 생성  
		 * 
		 */
		this.drawGrid = function() {
			var grid = this.grid();
			
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
		
		/**
		 * brush 그리기 
		 * 
		 * brush 에 맞는 x, y 축(grid) 설정 
		 * 
		 */
		this.drawBrush = function(type) {
            var draws = (type == "brush") ? _brush : _widget;

			if (draws != null) {
				for (var i = 0; i < draws.length; i++) {
					
					delete draws[i].x;
					delete draws[i].y;
					
					var Obj = jui.include("chart." + type + "." + draws[i].type);

					if (_scales.x || _scales.x1) {
						if (!_.typeCheck("function", draws[i].x)) {
                            draws[i].x = (typeof draws[i].x1 !== 'undefined') ? _scales.x1[draws[i].x1 || 0] : _scales.x[draws[i].x || 0];
						}
					}
					if (_scales.y || _scales.y1) {
						if (!_.typeCheck("function", draws[i].y)) {
                            draws[i].y = (typeof draws[i].y1 !== 'undefined') ? _scales.y1[draws[i].y1 || 0] : _scales.y[draws[i].y || 0];
						}
					}						
					if (_scales.c){
						if (!_.typeCheck("function", draws[i].c)) {
                            draws[i].c = _scales.c[draws[i].c || 0];
						}
					}

                    draws[i].index = i;

                    draws[i].obj = new Obj(draws[i]);
                    draws[i].obj.render(this);
				}
			}
		}

		/**
		 * draw 재정의 
		 * 
		 */
		this.draw = function() {
            this.drawDefs();
            this.drawGrid();
			this.drawBrush("brush");
            this.drawBrush("widget");
			
			this.emit("draw");
		}
	}

	UI.setting = function() {
		return {
			options : {
				"width" : "100%",		// chart 기본 넓이 
				"height" : "100%",		// chart 기본 높이 

				// style
				"padding" : {
					left : 50 ,
					right : 50,
					bottom : 50,
					top : 50 
				},
				
				// chart
				"theme" : "jennifer",	// 기본 테마 jennifer
				"series" : {},
				"grid" : {},
				"brush" : null,
                "widget" : null,
				"data" : [],
                "bind" : null
			}
		}
	}

	return UI;
}, "chart.core");
