jui.define("chart.core", [ "util", "util.svg" ], function(_, SVGUtil) {

    var UIChart = function() {

        function calculate(self) {
            self.area = {};

            var padding = self.get('padding');
            var titleYWidth = self.get('titleYWidth');
            var titleXHeight = self.get('titleXHeight');
            var max = self.svg.size();

            var chart = {
                width : max.width - padding * 2 - titleYWidth,
                height : max.height - padding * 2 - titleXHeight,
                x : padding +  titleYWidth,
                y : padding
            };

            // 메인 title 영역 계산
            if (self.get('title')) {
                chart.y += self.get('titleHeight');
                chart.height -= self.get('titleHeight');

                self.area.title = {
                    x : chart.x,
                    y : chart.y,
                    width : chart.width,
                    height : self.get('titleHeight')
                }
            }

            // legend 영역 계산
            if (self.get('legend')) {
                chart.y += self.get('legendHeight');
                chart.height -= self.get('legendHeight');

                self.area.legend = {
                    x : chart.x,
                    y : chart.y,
                    width : chart.width,
                    height : self.get('legendHeight')
                }
            }

            // Y axis Title 영역 계산
            if (self.get('titleY')) {
                chart.x += self.get('titleYWidth');
                chart.width -= self.get('titleYWidth');

                self.area.titleY = {
                    x : chart.x,
                    y : chart.y,
                    width : self.get('titleYWidth'),
                    height : chart.height
                }
            }

            // X axis Title 영역 계산
            if (self.get('titleX')) {
                chart.height -= self.get('titleXHeight');

                self.area.titleX = {
                    x : chart.x,
                    y : chart.y + chart.height,
                    width : chart.width,
                    height : self.get('titleXHeight')
                }
            }

            // chart 영역 계산
            chart.x2 = chart.x + chart.width;
            chart.y2 = chart.y + chart.height;

            self.area.chart = chart;
        }

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
            if(!_.typeCheck("function", this.draw)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
            }

            this.svg.clear();
            calculate(this);

            if(_.typeCheck("function", this.drawBefore)) {
                this.drawBefore(chart);
            }

			this.draw();
            this.svg.render();
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