jui.define("chart.core", [ "util.graphics", "util.svg" ], function(Graphics, SVGUtil) {
	var GraphicsUtil = Graphics.util;

    var UIChart = function() {
	
		this.set = function(key, value) {
			this.options[key] = value;
		}
		
		this.get = function(key) {
			return this.options[key];
		}
			
		/**
		 *
		 * Chart.attr('key', 'value');
		 * var value = Chart.attr('key');
		 * Chart.attr({
		 * 	  'key' : 'value',
		 * 	  'key' : 'value',
		 * 	  'key' : 'value'
		 * })
		 * 
		 * var obj = Chart.attr(['key', 'key', 'key']);
		 *  
		 * @param {Object} key
		 * @param {Object} value
		 */
		this.attr = function(key, value) {
			if (GraphicsUtil.isObject(key)) {
				for(var k in key) {
					this.set(k, key[k]);
				}
			} else if (GraphicsUtil.isArray(key) && arguments.length == 1) {
				var obj = {};
				
				for(var i = 0, len = key.length; i < len; i++) {
					obj[key[i]] = this.get(key[i]);
				}
				
				return obj; 
			} else {
				
				if (arguments.length == 1) {
					return this.get(key);
				} else {
					this.set(key, value);	
				}
			}
		}
		
		this.init = function() {
            var self = this;

			//console.log(this.options);
			this.renderer = Graphics.createRenderer(this.root, this.get('type'), {
				width : this.get('width'),
				height : this.get('height')
			});

            this.svg = new SVGUtil(this.root, this.get("width"), this.get("height"));
            /*/
            this.svg.setting({
                x: getX,
                cx: getX,
                x1: getX,
                x2: getX,
                y: getY,
                cy: getY,
                y1: getY,
                y2: getY
            });

            function getX(value) { return value + self.area.chart.x; }
            function getY(value) { return value + self.area.chart.y; }
            /**/
		}
		
		this.render = function() {
			// 비우기 
			this.renderer.clear();
            this.svg.clear();

			this.caculate();
			this.renderChart();     // 추상 메소드
			
			// 최종적으로 그리기 
			this.renderer.render();
            this.svg.render();
		}
		
		this.caculate = function() {
			
			this.area = {};
			
			var padding = this.get('padding');
			var titleYWidth = this.get('titleYWidth');
			var titleXHeight = this.get('titleXHeight');
			var max = this.renderer.size();
			
			var chart = { 
				width : max.width - padding * 2 - titleYWidth, 
				height : max.height - padding * 2 - titleXHeight, 
				x : padding +  titleYWidth, 
				y : padding 
			};
	
			// 메인 title 영역 계산 		
			if (this.get('title')) {
				chart.y += this.get('titleHeight');
				chart.height -= this.get('titleHeight');
				
				this.area.title = {
					x : chart.x,
					y : chart.y,
					width : chart.width,
					height : this.get('titleHeight')
				}  
			}
	
			// legend 영역 계산 		
			if (this.get('legend')) {
				chart.y += this.get('legendHeight');
				chart.height -= this.get('legendHeight');
				
				this.area.legend = {
					x : chart.x,
					y : chart.y,
					width : chart.width,
					height : this.get('legendHeight')
				}  
			}
	
			// Y axis Title 영역 계산		
			if (this.get('titleY')) {
				chart.x += this.get('titleYWidth');
				chart.width -= this.get('titleYWidth');			
				
				this.area.titleY = {
					x : chart.x,
					y : chart.y,
					width : this.get('titleYWidth'),
					height : chart.height
				}  			
			}
			
			// X axis Title 영역 계산		
			if (this.get('titleX')) {
				chart.height -= this.get('titleXHeight');
				
				this.area.titleX = {
					x : chart.x,
					y : chart.y + chart.height,
					width : chart.width,
					height : this.get('titleXHeight')
				}  
			}
			
			// chart 영역 계산
			chart.x2 = chart.x + chart.width;
            chart.y2 = chart.y + chart.height;
			this.area.chart = chart;
		}
		
		/**
		 * chart draw util 
		 * 
		 * chart 기본 x 를 기준으로 그리게 한다. 
		 */
		this.line = function(x1, y1, x2, y2, attr) {
			return this.renderer.line(this.area.chart.x + x1, this.area.chart.y + y1, this.area.chart.x + x2, this.area.chart.y + y2, attr);
		}
		
		this.circle = function(cx, cy, radius, attr) {
			return this.renderer.circle(this.area.chart.x + cx, this.area.chart.y + cy, radius, attr);
		}
		
		this.rect = function(x ,y, width, height, attr) {
			return this.renderer.rect(this.area.chart.x + x ,this.area.chart.y + y, width, height, attr);
		}
		
		this.ellipse = function(cx, cy, rx, ry, attr) {
			return this.renderer.ellipse(this.area.chart.x + cx, this.area.chart.y + cy, rx, ry, attr);
		}
		
		this.text = function(x, y, text, attr) {
			return this.renderer.text(this.area.chart.x + x, this.area.chart.y + y, text, attr);
		}		
		
		this.group = function() {
			return this.renderer.group();
		}
		
		/**
		 * y 좌표 구하기 
		 * 
		 * var y = this.convert(height, max, min , 50);
		 * var x = this.convert(width, max, min, 100, false);
		 * 
		 */
		this.convert = function(dist, max, min, value, isY) {
			isY = isY || true; 
			
			var axis = (dist/(max - min)) * (value - min);
			
			if (isY) {
				return dist - axis;	
			}
			 
			return axis;
			
		}

    }

    return UIChart;
}, "core");