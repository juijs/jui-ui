jui.defineUI("chart.builder", [ "jquery", "util.base", "util.svg" ], function($, _, SVGUtil) {
	/**
	 * Chart Builder 구현
	 *
	 */
	var UI = function() {
        var _initialize = false;
        var _data = [], _page = 1, _start = 0, _end = 0;
        var _grid = {}, _brush = [], _widget = [], _scales = [];
        var _padding, _series, _area, _theme;


		/************************
		 *  Private Method
		 ***********************/

		/**
		 * chart 기본 영역 계산
		 *
		 * padding 을 제외한 영역에서  x,y,x2,y2,width,height 속성을 구함
		 *
		 * 기본적으로 모든 브러쉬와 그리드는 계산된 영역안에서 그려짐
		 *
 		 * @param {Object} self
		 */
		function calculate(self) {
			var max = self.svg.size();

			var chart = {
				width : max.width - (_padding.left + _padding.right),
				height : max.height - (_padding.top + _padding.bottom),
				x : _padding.left,
				y : _padding.top
			};

			// chart 영역 계산
			chart.x2 = chart.x + chart.width;
			chart.y2 = chart.y + chart.height;

			_area = chart;
		}

        /**
         * draw 이전에 환경 셋팅
         *
         */
        function drawBefore(self) {
            // 데이타 설정 , deepClone 으로 기존 옵션 값에 영향을 주지 않음
            var series = _.deepClone(self.options.series),
                grid = _.deepClone(self.options.grid),
                brush = _.deepClone(self.options.brush),
                widget = _.deepClone(self.options.widget),
                series_list = [];

            // series 데이타 구성
            for (var i = 0, len = _data.length; i < len; i++) {
                var row = _data[i];

                for (var key in row) {
                    var obj = series[key] || {};
                    var value = +row[key];

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
            _series = series;
            _grid = grid;
        }

		/**
		 * svg 기본 defs element 생성
		 *
		 */
		function drawDefs(self) {
            // draw defs
            var defs = self.svg.defs();

			// default clip path
			self.clipId = self.createId('clip-id');

            var clip = self.svg.clipPath({ id : self.clipId });

            clip.append(self.svg.rect({  x : 0, y : 0, width : self.width(), height : self.height() }));
            defs.append(clip);

            self.defs = defs;
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
		function drawGrid(self) {
			var grid = self.grid();

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
						var obj = new Grid(orient, grid[k][keyIndex]).render(self);

						var dist = grid[k][keyIndex].dist || 0;

						// grid 별 dist 로 위치선정하기
						if (k == 'y') {
							obj.root.translate(self.x() - dist, self.y());
						} else if (k == 'y1') {
							obj.root.translate(self.x2() + dist, self.y());
						} else if (k == 'x') {
							obj.root.translate(self.x(), self.y2() + dist);
						} else if (k == 'x1') {
							obj.root.translate(self.x(), self.y() - dist);
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
		function drawBrush(self, type) {
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
					if (_scales.c) {
						if (!_.typeCheck("function", draws[i].c)) {
                            draws[i].c = _scales.c[draws[i].c || 0];
						}
					}

                    draws[i].index = i;
                    draws[i].obj = new Obj(draws[i]);

                    drawBrushAfter(self, type, draws[i].obj.render(self));
				}
			}
		}

        /**
         * 브러쉬(or 위젯) 엘리먼트 생성 이후에 호출되는 함수
         *
         * @param elem
         * @param type
         */
        function drawBrushAfter(self, type, elem) {
            if(type == "widget") {
                self.svg.autoRender(elem, false);
            }
        }

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

        function setChartEvent(self) {
            var elem = self.svg.root,
                isMouseOver = false;

            elem.on("click", function(e) {
                if(!checkPosition(e)) return;
                self.emit("bg.click", [ e ]);
            });

            elem.on("dblclick", function(e) {
                if(!checkPosition(e)) return;
                self.emit("bg.dblclick", [ e ]);
            });

            elem.on("contextmenu", function(e) {
                if(!checkPosition(e)) return;

                self.emit("bg.rclick", [ e ]);
                e.preventDefault();
            });

            elem.on("mousemove", function(e) {
                if(!checkPosition(e)) {
                    if(isMouseOver) {
                        self.emit("bg.mouseout", [ e ]);
                        isMouseOver = false;
                    }

                    return;
                }

                if(isMouseOver) {
                    self.emit("bg.mousemove", [ e ]);
                } else {
                    self.emit("bg.mouseover", [ e ]);
                    isMouseOver = true;
                }
            });

            elem.on("mousedown", function(e) {
                if(!checkPosition(e)) return;
                self.emit("bg.mousedown", [ e ]);
            });

            elem.on("mouseup", function(e) {
                if(!checkPosition(e)) return;
                self.emit("bg.mouseup", [ e ]);
            });

            function checkPosition(e) {
                var pos = $(self.root).offset();

                if(pos.left + self.padding("left") > e.x) return;
                if(pos.left + self.padding("left") + self.width() < e.x) return;
                if(pos.top + self.padding("top") > e.y) return;
                if(pos.top + self.padding("top") + self.height() < e.y) return;

                return true;
            }
        }

        this.init = function() {
            var opts = this.options;

            // 패딩 옵션 설정
            if(opts.padding == "empty") {
                _padding = {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0
                };
            } else {
                _padding = opts.padding;
            }

            // UI 바인딩 설정
            if(opts.bind != null) {
                this.bindUI(opts.bind);
            }

            // 드래그 이벤트 막기
            $(this.root).on("selectstart", function(e) {
                e.preventDefault();
            });

            // 차트 테마 설정
            this.setTheme(opts.theme);

            // svg 기본 객체 생성
            this.svg = new SVGUtil(this.root, {
                width : opts.width,
                height : opts.height,
                background : this.theme("backgroundColor")
            });

            // 데이터 업데이트 및 커스텀 이벤트 발생
            this.update();
            this.emit("load", []);

            // 차트 배경 이벤트
            setChartEvent(this);

            // 차트 초기화 설정
            _initialize = true;
        }
		
		/************************
		 *  Public Method
		 ***********************/

		/**
		 * 계산된 차트 영역에 대한 값 리턴 
		 * 
		 * <code>
		 * ex) 
		 * chart.area('x');
		 * chart.area('width');
		 * </code>
		 * 
		 * @param {string} key
		 */
		this.area = function(key) {
			if (typeof _area[key] !== "undefined") {
				return _area[key];
			}

			return _area;
		}

		this.height = function(value) {
		    if (arguments.length == 0) {
		        return this.area('height');
		    }
		    
		    _area.height = value;
		}

        this.width = function(value) {
            if (arguments.length == 0) {
                return this.area('width');
            }
            
            _area.width = value;
        }

        this.x = function(value) {
            if (arguments.length == 0) {
                return this.area('x');
            }
            
            _area.x = value;
        }

        this.y = function(value) {
            if (arguments.length == 0) {
                return this.area('y');
            }
            
            _area.y = value;
        }

        this.x2 = function(value) {
            if (arguments.length == 0) {
                return this.area('x2');
            }
            
            _area.x2 = value;
        }

        this.y2 = function(value) {
            if (arguments.length == 0) {
                return this.area('y2');
            }
            
            _area.y2 = value;
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

        this.color = function(i, colors) {
            var color;

            if (_.typeCheck("array", colors)) {
                color = colors[i];
            }

            return color || _theme["colors"][i];
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
         * chart 의 theme 설정
         *
         * @param {string} theme   chart.theme.xxx 의 클래스를 읽어들임
         */
        this.setTheme = function(theme) {
            _theme = jui.include("chart.theme." + theme);
        }

		/**
		 * theme 의 요소에 대한 값 구하기 
		 * 
		 * <code>
		 * 
		 * // theme 전체 객체 얻어오기 
		 * var theme = chart.theme();
		 * 
		 * // 부분 속성 얻어오기 
		 * var fontColor = chart.theme("fontColor");
		 * 
		 * // 속성 설정하기 
		 * chart.theme("fontColor", "red");  // fontColor 를 red 로 설정 
		 * 
		 * // 값 비교해서 얻어오기 
		 * chart.theme(isSelected, "selectedFontColor", "fontColor");  // isSelected 가 true 이면 selectedFontColor, 아니면 fontColor 리턴  
		 * 
		 * 
		 * </code>
		 * 
		 * 
		 */
		this.theme = function(key, value, value2) {
			if (arguments.length == 0) {
				return _theme;
			} else if (arguments.length == 1) {
				
				if (_theme[key]) {
					return _theme[key];
				}
			} else if (arguments.length == 2) {
				_theme[key] = value;
				
				return _theme[key];
			} else if (arguments.length == 3) {
				return (key) ? _theme[value] : _theme[value2];
			}
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
		 * chart 내에서 사용될 유일한 키 생성 
		 * 
		 * @param {string} key 
		 */
		this.createId = function(key) {
			return [key || "chart-id", (+new Date), Math.round(Math.random()*100)%100].join("-")
		}

        /**
         * jui component binding
         *
         * uix.table, uix.xtable 객체를 바인딩 해서 사용할 수 있음.
         *
         * 테이블 요소를 수정하면 chart의 data 속성으로 자동으로 설정
         *
         * @param {object} bind   uix.table, uix.xtable 객체 사용
         */
        this.bindUI = function(uiObj) {
            var self = this;

            if(uiObj.module.type == "uix.table") {
                uiObj.callAfter("update", updateTable);
                uiObj.callAfter("sort", updateTable);
                uiObj.callAfter("append", updateTable);
                uiObj.callAfter("insert", updateTable);
                uiObj.callAfter("remove", updateTable);
            } else if(uiObj.module.type == "uix.xtable") {
                uiObj.callAfter("update", updateXTable);
                uiObj.callAfter("sort", updateXTable);
            }

            function updateTable() {
                var data = [];

                for(var i = 0; i < uiObj.count(); i++) {
                    data.push(uiObj.get(i).data);
                }

                self.update(data);
            }

            function updateXTable() {
                self.update(uiObj.listData());
            }
        }
		
		/**
		 * chart render 함수 재정의 
		 * 
		 */
		this.render = function() {
            // SVG 메인 리셋
            this.svg.reset();

			// chart 영역 계산
			calculate(this);
						
			// chart 관련된 요소 draw
            drawBefore(this);
            drawDefs(this);
            drawGrid(this);
            drawBrush(this, "brush");

            // 위젯은 한번만 draw
            if(!_initialize) {
                drawBrush(this, "widget");
            }

			// 커스텀 이벤트 발생 및 렌더링
			this.svg.render();
		}

		/**
		 * data 업데이트 후 차트 다시 생성 
		 * 
		 * @param {array} data 
		 */
		this.update = function(data) {
            if(data) { // 데이터가 있을 경우...
                this.options.data = data;
            }

            this.page(1);
		}
		
        this.page = function(pNo) {
            if(arguments.length == 0) {
                return _page - 1;
            }

            var dataList = this.options.data,
                limit = this.options.bufferCount,
                maxPage = Math.ceil(dataList.length / limit);

            // 최소 & 최대 페이지 설정
            if(pNo < 1) {
                _page = 1;
            } else {
                _page = (pNo > maxPage) ? maxPage : pNo;
            }

            _start = (_page - 1) * limit,
            _end = _start + limit;

            // 마지막 페이지 처리
            if(_end > dataList.length) {
                _start = dataList.length - limit;
                _end = dataList.length;
            }

            if(_end <= dataList.length) {
                _start = (_start < 0) ? 0 : _start;
                _data = dataList.slice(_start, _end);

                this.render();
                if(dataList.length > 0) _page++;
            }
        }

        this.next = function() {
            var dataList = this.options.data,
                limit = this.options.bufferCount,
                step = this.options.shiftCount;

            _start += step;

            var isLimit = (_start + limit > dataList.length);

            _end = (isLimit) ? dataList.length : _start + limit;
            _start = (isLimit) ? dataList.length - limit : _start;
            _start = (_start < 0) ? 0 : _start;
            _data = dataList.slice(_start, _end);

            this.render();
        }

        this.prev = function() {
            var dataList = this.options.data,
                limit = this.options.bufferCount,
                step = this.options.shiftCount;

            _start -= step;

            var isLimit = (_start < 0);

            _end = (isLimit) ? limit : _start + limit;
            _start = (isLimit) ? 0 : _start;
            _data = dataList.slice(_start, _end);

            this.render();
        }

        this.zoom = function(start, end) {
            if(arguments.length == 0) {
                return {
                    start: _start,
                    end: _end
                }
            }

            if(start == end) return;

            var dataList = this.options.data;

            _end = (end > dataList.length) ? dataList.length : end;
            _start = (start < 0) ? 0 : start;
            _data = dataList.slice(_start, _end);

            this.render();
        }

		/**
		 * chart 사이즈 조정 
		 * 
		 * @param {integer} width
		 * @param {integer} height
		 */
		this.size = function(width, height) {
			this.svg.size(width, height);
			this.render();
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
                "bind" : null,

                // buffer
                "bufferCount" : 100,
                "shiftCount" : 1
			},
            valid: {
                area : [ "string" ],
                width : [ "integer" ],
                height : [ "integer" ],
                x : [ "integer" ],
                y : [ "integer" ],
                x2 : [ "integer" ],
                y2 : [ "integer" ],
                padding : [ "string" ],
                color : [ "integer", [ "undefined", "array" ] ], // undefined 제거 요망
                text : [ "object", [ "string", "function" ] ],
                setTheme : [ "string" ],
                theme : [ [ "string", "boolean" ], "string", "string" ],
                series : [ [ "undefined", "string" ] ], // undefined 제거 요망
                grid : [ "string" ],
                brush : [ "integer" ],
                data : [ [ "null", "integer" ], "string" ],  // null 제거 요망
                createId : [ "string" ],
                bindUI : [ "object" ],
                update : [ "array" ],
                page : [ "integer" ],
                size : [ "integer", "integer" ],
                zoom : [ "integer", "integer" ]
            }
		}
	}

	return UI;
}, "core");
