jui.define("chart.core", [ "util.graphics" ], function(Graphics) {
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
			this.renderer = Graphics.createRenderer(this.root, this.get('type'), {
				width : this.get('width'),
				height : this.get('height')
			});
		}
		
		this.render = function() {
			// 비우기 
			this.renderer.clear();

			this.caculate();
			this.renderChart();     // 추상 메소드
			
			// 최종적으로 그리기 
			this.renderer.render();
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
		
		this.niceAxis = function niceAxis (min, max) {
            var factorList = [ 0.0, 1.2, 2.5, 5.0, 10.0 ];
            var scalarList = [ 0.2, 0.2, 0.5, 1.0, 2.0 ];
            var min_, max_;
	      
            if (min == 0) {
	            min_ = 0;
	        }
	        else if (min > 0) {
	            min_ = Math.max( 0, min-(max-min)/100);
	        }
	        else {
	            min_ = min-(max-min)/100;
	        }     

            if (max == 0) {
	            if (min == 0) {
	                max_ = 1;
	            }
	            else {
	                max_ = 0;
	            }
	        }
	        else if (max < 0) {
	            max_ = Math.min(0, max+(max-min)/100);
	        }
	        else {
	            max_ = max+(max-min)/100;
	        }       
	        
            // 3. power
	        var power = Math.log(max_ - min_) / Math.LN10;
	    
	        // 4. factor
	        var factor = Math.pow(10, power - Math.floor(power));
	    
            var tickWidth = "";
	    
	        // 5. nice ticks
	        for (var i = 0; factor > factorList[i] ; i++) {
	            tickWidth = scalarList[i] * Math.pow(10, Math.floor(power));
	        }       
	        
            // 6. min-axisValues
	        var minAxisValue = tickWidth * Math.floor(min_/tickWidth);
	    
	        // 7. min-axisValues
	        var maxAxisValue = tickWidth * Math.floor((max_/tickWidth)+1);        
	        
	        return {
                min: minAxisValue,
                max: maxAxisValue,
                tickWidth : tickWidth
	        };
	    }
    }

    return UIChart;
}, "core");