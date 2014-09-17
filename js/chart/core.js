jui.define("chart.core", [ "util.base", "util.svg" ], function(_, SVGUtil) {

	/**
	 * Chart 기본 클래스 
	 * 
	 */
	var UIChart = function() {
		var _area, _theme;
		
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
			var padding = self.setPadding(self.options.padding),
                max = self.svg.size();

			var chart = {
				width : max.width - (padding.left + padding.right),
				height : max.height - (padding.top + padding.bottom),
				x : padding.left,
				y : padding.top
			};

			// chart 영역 계산
			chart.x2 = chart.x + chart.width;
			chart.y2 = chart.y + chart.height;

			_area = chart;
		}
		
		/**
		 * 기본 padding 설정 
		 * 
		 * @param {object|string}  padding  default 값은  모든 방향 50, empty 를 쓰면  padding 영역이 사라짐  
		 */
		this.setPadding = function(padding) {
            if (padding == 'empty') {
            	padding = {
					left : 0 ,
					right : 0 ,
					bottom : 0 ,
					top : 0 
				};
            }

			return padding;			
		}

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
		
		/**
		 * chart 높이 얻어오기 
		 * 
		 * <code>
		 * // 매개변수가 없을 때는 chart 높이 
		 * var height = chart.height();
		 * 
		 * // 매개변수가 있을 때는 chart 높이 설정 
		 * chart.height(150); // chart 높이를 150 으로 설정 
		 * </code> 
		 * 
		 * @param {integer} value 
		 */
		this.height = function(value) {
		    if (arguments.length == 0) {
		        return this.area('height');
		    }
		    
		    _area.height = value;
		}

		/**
		 * chart 넓이 얻어오기 
		 * 
		 * <code>
		 * // 매개변수가 없을 때는 chart 넓이 
		 * var width = chart.width();
		 * 
		 * // 매개변수가 있을 때는 chart 넓이 설정 
		 * chart.width(150); // chart 넓이를 150 으로 설정 
		 * </code> 
		 * 
		 * @param {integer} value  
		 */
        this.width = function(value) {
            if (arguments.length == 0) {
                return this.area('width');
            }
            
            _area.width = value;
        }

		/**
		 * chart 의 시작 x 좌표 얻기  
		 * 
		 * <code>
		 * // 매개변수가 없을 때는 chart x좌표
		 * var x = chart.x();
		 * 
		 * // 매개변수가 있을 때는 chart x좌표 설정 
		 * chart.x(150); // chart x좌표를 150 으로 설정 
		 * </code> 
		 * 
		 * @param {integer} value  
		 */
        this.x = function(value) {
            if (arguments.length == 0) {
                return this.area('x');
            }
            
            _area.x = value;
        }

		/**
		 * chart 의 시작 y 좌표 얻기  
		 * 
		 * <code>
		 * // 매개변수가 없을 때는 chart y좌표
		 * var y = chart.y();
		 * 
		 * // 매개변수가 있을 때는 chart y좌표 설정 
		 * chart.y(150); // chart y좌표를 150 으로 설정 
		 * </code> 
		 * 
		 * @param {integer} value  
		 */
        this.y = function(value) {
            if (arguments.length == 0) {
                return this.area('y');
            }
            
            _area.y = value;
        }

		/**
		 * chart 의 끝 x 좌표 얻기(x2)  
		 * 
		 * <code>
		 * // 매개변수가 없을 때는 chart x2좌표
		 * var x2 = chart.x2();
		 * 
		 * // 매개변수가 있을 때는 chart x2좌표 설정 
		 * chart.x2(150); // chart x2좌표를 150 으로 설정 
		 * </code> 
		 * 
		 * @param {integer} value  
		 */
        this.x2 = function(value) {
            if (arguments.length == 0) {
                return this.area('x2');
            }
            
            _area.x2 = value;
        }

		/**
		 * chart 의 끝 y 좌표 얻기(y2)  
		 * 
		 * <code>
		 * // 매개변수가 없을 때는 chart y2좌표
		 * var y2 = chart.y2();
		 * 
		 * // 매개변수가 있을 때는 chart y2좌표 설정 
		 * chart.y2(150); // chart y2좌표를 150 으로 설정 
		 * </code> 
		 * 
		 * @param {integer} value  
		 */
        this.y2 = function(value) {
            if (arguments.length == 0) {
                return this.area('y2');
            }
            
            _area.y2 = value;
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
		 * chart 초기화 함수 
		 * 
		 */
		this.init = function() {

			// svg 기본 객체 생성 
			this.svg = new SVGUtil(this.root, {
				width : this.options.width,
				height : this.options.height
			});

            // 차트 테마 설정
            this.setTheme(this.options.theme)

            // UI 바인딩 설정
            if(this.options.bind != null) {
                this.bindUI(this.options.bind);
            }

            // 테마 컬러 설정
            this.theme.color = function(i, colors) {
                var color;

                if (_.typeCheck("array", colors)) {
                	color = colors[i];	
                }

                return color || _theme["colors"][i];
            }
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
		 * chart render 함수 재정의 
		 * 
		 */
		this.render = function() {
			
			// draw 함수 체크 
			if (!_.typeCheck("function", this.draw)) {
				throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
			}

			// svg rest 
			this.svg.reset();
			
			this.svg.css({
				'background' : this.theme("backgroundColor")
			})

			// chart 영역 계산 			
			calculate(this);
						
			if (_.typeCheck("function", this.drawBefore)) {
				this.drawBefore();
			}
			
			// chart 관련된 요소 draw  
			this.draw();
			
			// svg 태그 rendering 
			this.svg.render();
		}

		/**
		 * data 업데이트 후 차트 다시 생성 
		 * 
		 * @param {array} data 
		 */
		this.update = function(data) {
			if (!_.typeCheck("array", data))
				return;

			this.options.data = data;
			this.render();
		}

		/**
		 * chart 사이즈 조정 
		 * 
		 * @param {integer} width
		 * @param {integer} height
		 */
		this.size = function(width, height) {
			if (!_.typeCheck("integer", width) || !_.typeCheck("integer", height))
				return;

			this.svg.size(width, height);
			this.render();
		}
	}

	return UIChart;
}, "core");
