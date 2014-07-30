jui.define("chart.grid.basic", [  "util.graphics" ], function(Graphics) {
    var GraphicsUtil = Graphics.util;

    var Grid = function(orient, opt) {
    	
    	var self = this; 
    	
        function drawX(chart) {
            
            /*
			//var obj = this.drawRange(chart, [0, 500], [0, 10], 5);
			var obj = this.drawBlock(chart, ['apple', 'orange', 'banana', 'gruit'], [0, 500]);
            this._xScale = obj.scale;            

			obj.g.attr({
				transform : "translate(50, 50)"
			}) */
        }

        function drawY(chart) {
        	
        	//console.log(this);
        	
        	// range 패턴 
        	
        	
            var obj = this.drawRange(chart, 'left', [400, 0], [0, 10], 10);
            this._yScale = obj.scale;
            //console.log(this.drawRange(chart, domain, range, step, format));
            
            obj.g.attr({
				transform : "translate(60, 60)"
			})
			 
            var obj = this.drawRange(chart, 'right', [400, 0], [0, 100], 10);
            this._yScale = obj.scale;
            //console.log(this.drawRange(chart, domain, range, step, format));
            
            obj.g.attr({
				transform : "translate(490, 60)"
			})
						 
            var obj = this.drawRange(chart, 'top', [0, 400], [0, 50], 5);
            this._yScale = obj.scale;
            //console.log(this.drawRange(chart, domain, range, step, format));
            
            obj.g.attr({
				transform : "translate(90, 30)"
			})	
		
			var obj = this.drawRange(chart, 'bottom', [0, 400], [0, 1], 10);
            this._yScale = obj.scale;
            //console.log(this.drawRange(chart, domain, range, step, format));
            
            obj.g.attr({
				transform : "translate(90, 460)"
			})	 
			 
			// block 패턴 
			
            var obj = this.drawBlock(chart, 'top', ['apple', 'orange', 'banana', 'gruit', 'float'], [0, 400]);
            this._yScale = obj.scale;
            //console.log(this.drawRange(chart, domain, range, step, format));
            
            obj.g.attr({
				transform : "translate(600, 30)"
			})
			
            var obj = this.drawBlock(chart, 'bottom', ['apple', 'orange', 'banana', 'gruit', 'double'], [0, 400]);
            this._yScale = obj.scale;
            //console.log(this.drawRange(chart, domain, range, step, format));
            
            obj.g.attr({
				transform : "translate(600, 460)"
			})			
			 
            var obj = this.drawBlock(chart, 'left', ['apple', 'orange', 'banana', 'gruit', 'success', 'single'], [0, 400]);
            this._yScale = obj.scale;
            //console.log(this.drawRange(chart, domain, range, step, format));
            
            obj.g.attr({
				transform : "translate(570, 60)"
			})
						
            var obj = this.drawBlock(chart, 'right', ['apple', 'orange', 'banana', 'gruit', 'fail'], [0, 400]);
            this._yScale = obj.scale;
            //console.log(this.drawRange(chart, domain, range, step, format));
            
            obj.g.attr({
				transform : "translate(1000, 60)"
			})			
			 
			 
			// date 좌표 
			
            var obj = this.drawDate(chart, 'top', [new Date(), this.time.add(new Date(), this.time.days, 10)], [0, 500], [this.time.days, 1], "MM-dd");
            
            obj.g.attr({
				transform : "translate(1150, 30)"
			})
						
            var obj = this.drawDate(chart, 'bottom', [new Date(), this.time.add(new Date(), this.time.days, 10)], [0, 500], [this.time.days, 1], "MM-dd");
            
            obj.g.attr({
				transform : "translate(1150, 560)"
			})
						
            var obj = this.drawDate(chart, 'left', [new Date(), this.time.add(new Date(), this.time.days, 10)], [500, 0], [this.time.days, 1], "MM-dd");
            
            obj.g.attr({
				transform : "translate(1120, 60)"
			})
						
            var obj = this.drawDate(chart, 'right', [new Date(), this.time.add(new Date(), this.time.seconds, 10)], [500, 0], [this.time.seconds, 1], "hh:mm:ss");
            
            obj.g.attr({
				transform : "translate(1650, 60)"
			})		
			
        }
        
        this._draw = function(chart) {
        	
        	opt.type = opt.type || "block";
        	
        	var height = chart.area.chart.height;
        	var width = chart.area.chart.width; 
            
            if (opt.type == "block") {
            	var max = (orient == 'left' || orient == 'right') ? height : width;
            	
            	var obj = this.drawBlock(chart, orient, opt.domain, [0, max]);
            } else if (opt.type == "range") {
            	
            	if (orient == 'left' || orient == 'right') {
            		var obj = this.drawRange(chart, orient, opt.domain, [height, 0], opt.step);	
            	} else {
            		var obj = this.drawRange(chart, orient, opt.domain, [0, width], opt.step);
            	}
            } else if (opt.type == "date") {
            	var max = (orient == 'left' || orient == 'right') ? chart.area.chart.height : chart.area.chart.width;
            	
            	var obj = this.drawBlock(chart, orient, opt.domain, [0, chart.area.chart.height]);
            }


			if (orient == 'left') {
				var x = chart.area.chart.x - 30;
				var y = chart.area.chart.y;
			} else if (orient == 'right') {
				var x = chart.area.chart.x2;
				var y = chart.area.chart.y;
			} else if (orient == 'top') {
				var x = chart.area.chart.x;
				var y = chart.area.chart.y - 30;
			} else if (orient == 'bottom') {
				var x = chart.area.chart.x;
				var y = chart.area.chart.y2;
			}            
            
			obj.g.attr({
				transform : "translate(" + x + ", " + y + ")"
			})	            

			return obj;
        }
    }

    return Grid;
}, "chart.grid");
