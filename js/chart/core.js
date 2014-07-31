jui.define("chart.core", [ "util.svg" ], function(SVGUtil) {

    var UIChart = function() {

		this.get = function(key) {
			return this.options[key];
		}

		this.init = function() {
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
            this.svg.clear();

			this.caculate();
			this.renderChart();     // 추상 메소드
			
			// 최종적으로 그리기 
            this.svg.render();
		}
		
		this.caculate = function() {
			this.area = {};
			
			var padding = this.get('padding');
			var titleYWidth = this.get('titleYWidth');
			var titleXHeight = this.get('titleXHeight');
			var max = this.svg.size();
			
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