jui.defineUI("chart.bar", ["util.graphics"], function(Graphics) {
	var GraphicsUtil = Graphics.util;
	var UI = function() {
		
		this.caculateData = function() {
			
			var xAxis = [];
			var series = this.get('series');
			var labels = this.get('labels');
			var data = this.get('data');
			var min = 0;
			var max = 0; 
			var maxTicks = this.get('maxTicks');
			
			for(var i = 0, len = data.length; i < len; i++) {
				var row = data[i];
				
				xAxis.push(row[labels]);
				
				for(var k in series) {
					series[k].data = series[k].data || [];
			
					
					var value = null;
					
					if (row[k]) {
						value = row[k];	
					} else {
						if (GraphicsUtil.isFunction(series[k].get)) { // custom legend 설정
							value = series[k].get(row); 
						}
					}
					
					series[k].data.push(value);
					
					if (value < min) { min = value; }				
					if (value > max) { max = value; }
				}
			} 
	
			
			this.xAxis = xAxis;
			this.min = min;
			this.max = max; 
			
			this.len = this.xAxis.length;
			this.unit = this.area.chart.width / this.len;		
			
			this.seriesCount = 0;
			for(var i in series) {
				this.seriesCount++;
			}
	
			var obj = this.niceAxis(min, max);
			
			this.range = obj.max - obj.min;
			this.tickSpacing = obj.tickWidth;
			this.niceMin = obj.min;
	    	this.niceMax = obj.max;
	
	 	}
		
		this.drawX = function() {
			// x 축 그리기 
			var pos = this.unit / 2
			
			var xStart = this.area.chart.x + pos;
			var yStart = this.area.chart.y2 + 15;
			
			var xLineStart = this.area.chart.x + this.unit; 
			
			for(var i = 0; i < this.len; i++) {
				this.renderer.text(xStart, yStart, this.xAxis[i], {
					"font-size" : "10pt",
					"text-anchor" : "middle",
					"fill" : "black"
				});
				
				xStart += this.unit;
				
				this.renderer.line(xLineStart, this.area.chart.y, xLineStart, this.area.chart.y2, {
					"stroke-width" : 0.5,
					"stroke" : "rgba(0, 0, 0, 0.2)"
				});
				
				xLineStart += this.unit;
			}
			
		}
		
		this.drawY = function() {
			var style = { "stroke-width" : 1, stroke : '#000'};
			
			// 기본 좌표 
			this.renderer.line(this.area.chart.x, this.area.chart.y, this.area.chart.x, this.area.chart.y2, style);
			
			
			// 구간별 라인 
			var rate = this.tickSpacing / this.range;
			var split2 = this.area.chart.height * rate
			
			var start = this.area.chart.y;
			for(var i = this.niceMax ; i >= this.niceMin; i -= this.tickSpacing) {
				
				if (i == 0) {
					this.zeroBase = start;
					this.renderer.line(this.area.chart.x, start, this.area.chart.x2, start, style);
				}
				
				this.renderer.line(this.area.chart.x, start, this.area.chart.x2, start, {
					"stroke-width" : 0.5,
					"stroke" : "rgba(0, 0, 0, 0.2)"
				});
				
				this.renderer.text(this.area.chart.x - 5, start+5, i+"", {
					"font-size" : "10pt",
					"text-anchor" : "end",
					"fill" : "gray"
				});			
				
				start += split2;
				
			}
			
			
			 
		}
		
		this.drawChart = function() {
			var barPadding = this.get('barPadding');
			var seriesPadding = this.get('seriesPadding');
			
			var width = this.unit - barPadding * 2;
			
			var seriesWidth = (width - (this.seriesCount -1) * seriesPadding) / this.seriesCount;
			var nextWidth = seriesWidth + seriesPadding;
			
			var data = this.get('data');
			var series = this.get('series');
			var theme = this.get('theme');
			var startX = this.area.chart.x;
			var startY = this.area.chart.y;
			var height = this.area.chart.height;
			var heightHigh = this.zeroBase;
			var heightLow = this.area.chart.height - this.zeroBase;
			
			var index = 0;
			var colors = theme.series || ["black", 'red', 'blue'];
	
			for(var key in series) {
				
				var chart = series[key];
				var x = startX + barPadding +  index * (nextWidth);
				
				for(var i = 0, len = chart.data.length; i < len; i++) {
					
					var value = chart.data[i];
					var h = height * (Math.abs(value) / this.range);
					if (value >= 0) {
						this.renderer.rect(x, heightHigh - h, seriesWidth, h, {
							fill : chart.color || colors[index]
						})	
					} else {
						this.renderer.rect(x, this.zeroBase, seriesWidth, h, {
							fill : chart.color || colors[index]
						})
					}
				
					x += this.unit;
					
				}
				
				index++;
				
			}
				
		}
		
		this.renderChart = function() {
			this.caculateData();
			this.drawX();
			this.drawY();
			this.drawChart();
		}
		
		this.delegateEvents = function() {
			
		}
	}
	
	return UI;
}, "chart.core");