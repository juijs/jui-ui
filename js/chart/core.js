jui.define("chart.core", [ "util", "util.svg" ], function(_, SVGUtil) {

	var UIChart = function() {
		
		var _area, _theme; 
		
		function calculate(self) {
			_area = {};

			var widget = self.get('widget');
			
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

		this.get = function(key) {
			return this.options[key];
		}

		this.area = function(key) {
			
			if (typeof _area[key] !== "undefined") {
				return _area[key];
			}

			return _area;
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
		
		this.theme.color = function(i) {
			return _theme["colors"][i];
		}

		this.render = function() {
			if (!_.typeCheck("function", this.draw)) {
				throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
			}

			this.svg.reset();
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
