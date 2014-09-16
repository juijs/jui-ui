jui.define("chart.core", [ "util.base", "util.svg" ], function(_, SVGUtil) {

	var UIChart = function() {
		var _area, _theme;
		
		function calculate(self) {
			var padding = self.setPadding(self.get('padding')),
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
		
		this.get = function(key) {
			return this.options[key];
		}

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


        this.bind = function(bind) {
            var self = this;

            if(bind.module.type == "uix.table") {
                bind.callAfter("update", updateTable);
                bind.callAfter("sort", updateTable);
                bind.callAfter("append", updateTable);
                bind.callAfter("insert", updateTable);
                bind.callAfter("remove", updateTable);
            } else if(bind.module.type == "uix.xtable") {
                bind.callAfter("update", updateXTable);
                bind.callAfter("sort", updateXTable);
            }

            function updateTable() {
                var data = [];

                for(var i = 0; i < bind.count(); i++) {
                    data.push(bind.get(i).data);
                }

                self.update(data);
            }

            function updateXTable() {
                self.update(bind.listData());
            }
        }

		this.init = function() {
			this.svg = new SVGUtil(this.root, {
				width : this.get("width"),
				height : this.get("height")
			});

            // 차트 테마 설정
            this.setTheme(this.get('theme'))

            // UI 바인딩 설정
            if(this.get("bind") != null) {
                this.bind(this.get("bind"));
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
		
		this.setTheme = function(theme) {
			 _theme = jui.include("chart.theme." + theme);

		}
		
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

		this.render = function() {
			if (!_.typeCheck("function", this.draw)) {
				throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
			}

			this.svg.reset();
			this.svg.css({
				'background' : this.theme("backgroundColor")
			})
			
			calculate(this);
						
			if (_.typeCheck("function", this.drawBefore)) {
				this.drawBefore();
			}
			
			this.draw();
			this.svg.render();
		}

		this.update = function(data) {
			if (!_.typeCheck("array", data))
				return;

			this.options.data = data;
			this.render();
		}

		this.size = function(width, height) {
			if (!_.typeCheck("integer", width) || !_.typeCheck("integer", height))
				return;

			this.svg.size(width, height);
			this.render();
		}
	}

	return UIChart;
}, "core");
