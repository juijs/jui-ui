jui.define("chart.grid.basic", [  "util.graphics" ], function(Graphics) {
    var GraphicsUtil = Graphics.util;

    var Grid = function(opt) {
    	
        function drawX(chart) {
            // x 축 그리기
            var labels = chart.get('labels');
            var height = chart.area.chart.height; 
            var unit = chart.area.chart.width / labels.length;
            var pos = unit / 2;

            var xStart = pos;
            var yStart = height + 15;

            var xLineStart = unit;

            for(var i = 0; i < labels.length; i++) {

                chart.text(xStart, yStart, labels[i], {
                    "font-size" : "10pt",
                    "text-anchor" : "middle",
                    "fill" : "black"
                });

                xStart += unit;

                chart.line(xLineStart, 0, xLineStart, height, {
                    "stroke-width" : 0.5,
                    "stroke" : "rgba(0, 0, 0, 0.2)"
                });

                xLineStart += unit;
            }

        }

        function drawY(chart) {
            var style = { "stroke-width" : 1, stroke : '#000' };


			// tick
			var height = chart.area.chart.height;
			var width = chart.area.chart.width;
			
			var isRight = opt.direction == 'right';
			
			var tickWidth = height / opt.tick;
			var rate = (opt.max - opt.min) / opt.tick;

			var hrate = height / (opt.max - opt.min)  ;
			var zeroBase = hrate * opt.max;
			
            // 기본 좌표
            chart.line(0, 0, 0, height, style);
            
            // draw zero base 
            chart.line(0, zeroBase, width, zeroBase, style);
            
            
			var tx = -5, align = 'end';
			
			if (isRight) {
				tx = width + 5;
				align = 'start';
			}            
            
            chart.text(tx, zeroBase + 5, "0", {
                "font-size" : "10pt",
                "text-anchor" : align,
                "fill" : "gray"
            });	

			var start = height; 
			var startValue = opt.min; 
			for(var i = 0; i <= opt.tick; i++) {
				
				if (startValue != 0) {
					
					var tx = -5, align = 'end';
					
					if (isRight) {
						tx = width + 5;
						align = 'start';
					}
					
					chart.line(0, start, width, start, {
	                    "stroke-width" : 0.5,
	                    "stroke" : opt.color || "rgba(0, 0, 0, 0.2)"
	                });
	
	                chart.text(tx, start+5, (Math.round(startValue))+"", {
	                    "font-size" : "10pt",
	                    "text-anchor" : align,
	                    "fill" : "gray"
	                });
					
				}
				

                start -= tickWidth;
                startValue += rate;
			
			} 
        }

        this.draw = function(chart) {
            drawX(chart);
            drawY(chart);
        }
    }

    return Grid;
}, "chart.grid");
