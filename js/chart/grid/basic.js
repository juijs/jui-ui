jui.define("chart.grid.basic", [  "util.graphics" ], function(Graphics) {
    var GraphicsUtil = Graphics.util;

    var Grid = function(opt) {
    	
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
			 
			/*
            var obj = this.drawRange(chart, 'right', [500, 0], [0, 100], 10);
            this._yScale = obj.scale;
            //console.log(this.drawRange(chart, domain, range, step, format));
            
            obj.g.attr({
				transform : "translate(590, 60)"
			})
						 
            var obj = this.drawRange(chart, 'top', [0, 500], [0, 50], 5);
            this._yScale = obj.scale;
            //console.log(this.drawRange(chart, domain, range, step, format));
            
            obj.g.attr({
				transform : "translate(90, 30)"
			})	
		
			var obj = this.drawRange(chart, 'bottom', [0, 500], [0, 1], 10);
            this._yScale = obj.scale;
            //console.log(this.drawRange(chart, domain, range, step, format));
            
            obj.g.attr({
				transform : "translate(90, 560)"
			})	 
			*/
			
            /*
            var obj = this.drawDate(chart, [new Date(), this.time.add(new Date(), this.time.days, 10)], [0, 1000], [this.time.days, 1], function(value) {
            	
            	var date = new Date(value);
            	
            	return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
            });

			obj.g.attr({
				transform : "translate(50, 100)"
			})   
            
            var obj = this.drawDate(chart, [new Date(), this.time.add(new Date(), this.time.hours, 10)], [0, 1000], [this.time.hours, 1], function(value) {
            	
            	var date = new Date(value);
            	
            	return date.getHours() + "시";
            });

			obj.g.attr({
				transform : "translate(50, 150)"
			})             
			
			var obj = this.drawDate(chart, [new Date(), this.time.add(new Date(), this.time.minutes, 10)], [0, 1000], [this.time.minutes, 1], function(value) {
            	
            	var date = new Date(value);
            	
            	return date.getHours() + ":" + date.getMinutes();
            });

			obj.g.attr({
				transform : "translate(50, 200)"
			})      
			
			console.log(obj.scale(this.time.add(new Date(), this.time.minutes, 2)));
			console.log(obj.scale.invert(200));
            
			var obj = this.drawDate(chart, [new Date(), this.time.add(new Date(), this.time.minutes, 5)], [0, 500], [this.time.minutes, 1], function(value) {
            	
            	var date = new Date(value);
            	
            	return date.getHours() + ":" + date.getMinutes();
            });

			obj.g.attr({
				transform : "translate(50, 250)"
			})      
			
			
			var x = 50;
			
			setInterval(function() {
				 x -= 10;
			 
			 	console.log(x, obj.g);
			 
				obj.g.attr({
					transform : "translate("+ x + ", 250)"
				})
			}, 1000)
			*/

        }
        
        this.y = function(value) {
        	return this._yScale.invert(value);
        }
        
        this.x = function(value) {
        	return this._xScale.invert(value);
        }

        this._draw = function(chart) {
            drawX.call(this, chart);
            drawY.call(this, chart);
        }
    }

    return Grid;
}, "chart.grid");
