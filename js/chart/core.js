jui.define("chart.core", [ "util.base", "util.svg" ], function(_, SVGUtil) {

	var UIChart = function() {
		var _area, _theme;
		
		function calculate(self) {
			_area = {};

			var widget = self.setWidget(self.get('widget'));
			
			var max = self.svg.size();

			var chart = {
				width : max.width - (widget.left.size + widget.right.size),
				height : max.height - (widget.top.size + widget.bottom.size),
				x : widget.left.size,
				y : widget.top.size
			};

			// chart 영역 계산
			chart.x2 = chart.x + chart.width;
			chart.y2 = chart.y + chart.height;

			_area = chart;
		}
		

		this.setWidget = function(widget) {
            if (widget == 'empty') {
            	widget = {
					left : { size : 0 },
					right : { size : 0 },
					bottom : { size : 0 },
					top : { size : 0 }
				};
            }

			return widget;			
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

		    return this;
		}

        this.width = function(value) {
            if (arguments.length == 0) {
                return this.area('width');
            }
            
            _area.width = value;

            return this;
        }


        this.x = function(value) {
            if (arguments.length == 0) {
                return this.area('x');
            }
            
            _area.x = value;

            return this;
        }


        this.y = function(value) {
            if (arguments.length == 0) {
                return this.area('y');
            }
            
            _area.y = value;

            return this;
        }

        this.x2 = function(value) {
            if (arguments.length == 0) {
                return this.area('x2');
            }
            
            _area.x2 = value;

            return this;
        }


        this.y2 = function(value) {
            if (arguments.length == 0) {
                return this.area('y2');
            }
            
            _area.y2 = value;

            return this;
        }


        this.bind = function(bind) {
            var self = this;

            bind.callAfter("update", update);
            bind.callAfter("sort", update);
            bind.callAfter("append", update);
            bind.callAfter("insert", update);
            bind.callAfter("remove", update);

            function update() {
                var data = [];

                for(var i = 0; i < bind.count(); i++) {
                    data.push(bind.get(i).data);
                }

                self.update(data);
            }
        }

		this.init = function() {
            var self = this;

			this.svg = new SVGUtil(this.root, {
				width : this.get("width"),
				height : this.get("height")
			});

            // 차트 테마 설정
            _theme = jui.include("chart.theme." + this.get("theme"));

            // UI 바인딩 설정
            if(this.get("bind") != null) {
                this.bind(this.get("bind"));
            }

            // 테마 컬러 설정
            this.theme.color = function(i) {
                // TODO 시리즈 컬러 적용해야 함
                return _theme["colors"][i];
            }
		}
		
		this.theme = function(key, value, value2) {
			if (arguments.length == 0) {
				return _theme;
			} else if (arguments.length == 1) {
				return _theme[key];
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
