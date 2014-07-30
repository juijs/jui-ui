jui.define("chart.grid", ["util"], function(_) {
    var Grid = function() {
    	
    	this.drawRange = function(chart, orient, domain, range, step, format, nice) {
    		step = step || 10;
    		
    		//console.log(domain, range);

    		var scale = this.scale.linear().domain(domain).range(range);
    		var ticks = scale.ticks(step, nice || false);
    		var values = []
    		
    		var max = domain[0];
    		var min = domain[0];
    		
    		for(var i = 0; i < domain.length; i++) {
    			if (domain[i] > max) max = domain[i];
    			else if (domain[i] < min) min = domain[i];
    		}
    		
    		var g = chart.svg.group();

			if (orient == 'left') {
				
				var width = 30;
				var bar = 6; 
				var barX = width - bar; 
				
				var line = chart.svg.line({
					x1 : width,
					y1 : 0,
					x2 : width,
					y2 : scale(Math.min(max, min)),
					stroke : 'black',
					'stroke-width' : 0.5
				});
				
				g.append(line);
				//g.line(width, 0, width, scale(Math.min(max, min)), { stroke : "black", "stroke-width" : 0.5});
				
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]); 
	    			
	    			//console.log(values[i], ticks[i]);
	    			
	    			if (format) {
	    				values[i] = format(values[i]);
	    			}
	    			
	    			var axis = chart.svg.group({ 
	    				"transform" : "translate(0, " + values[i] + ")"
	    			});
	    			
	    			var l = chart.svg.line({
	    				x1 : barX, 
	    				y1 : 0, 
	    				x2 : width+chart.area.chart.width, 
	    				y2 : 0, 
	    				'stroke-width' : 0.2,
	    				'stroke' : 'black'});
	    			var t = chart.svg.text({
	    				x : barX-bar, 
	    				y : bar, 
	    				text : ticks[i]+"",
	    				'text-anchor' : 'end'});
	    			
	    			axis.append(l);
	    			axis.append(t);
	    			
	    			g.append(axis);
	    			
	    			//console.log(g);
	    		}									
				
			} else if (orient == 'bottom') {
				var height = 30;
				var bar = 6; 
				var barY = bar; 				
				
				g.line(0, 0, scale(Math.max(max, min)), 0, { stroke : "black", "stroke-width" : 0.5});	
				
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]); 
	    			
	    			if (format) {
	    				values[i] = format(values[i]);
	    			}
	    			
	    			var axis = g.group();
	    			axis.attr({ 
	    				"transform" : "translate("+ values[i] + ", 0)"
	    			});
	    			
	    			axis.line(0, 0, 0, bar, { 'stroke-width' : 0.5, 'stroke' : 'black'});
	    			axis.text(0, bar*4, ticks[i]+"", {'text-anchor' : 'middle'});
	    			
	    			//console.log(g);
	    		}
				
				
			} else if (orient == 'top' ) {
				var height = 30;
				var bar = 6; 
				var barY = height - bar; 
				
				g.line(0, height, scale(Math.max(max, min)), height, { stroke : "black", "stroke-width" : 0.5});	
				
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]); 
	    			
	    			if (format) {
	    				values[i] = format(values[i]);
	    			}
	    			
	    			var axis = g.group();
	    			axis.attr({ 
	    				"transform" : "translate("+ values[i] + ", " + barY + ")"
	    			});
	    			
	    			axis.line(0, 0, 0, 6, { 'stroke-width' : 0.5, 'stroke' : 'black'});
	    			axis.text(0, -4, ticks[i]+"", {'text-anchor' : 'middle'});
	    			
	    			//console.log(g);
	    		}				
				
			} else if (orient == 'right') {
				
				var width = 30;
				var bar = 6; 
				var barX = width - bar; 
				
				g.line(0, 0, 0, scale(Math.min(max, min)), { stroke : "black", "stroke-width" : 0.5});
				
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]); 
	    			
	    			if (format) {
	    				values[i] = format(values[i]);
	    			}
	    			
	    			var axis = g.group();
	    			axis.attr({ 
	    				"transform" : "translate(0, " + values[i] + ")"
	    			});
	    			
	    			axis.line(0, 0, bar, 0, { 'stroke-width' : 0.5, 'stroke' : 'black'});
	    			axis.text(bar +2, bar, ticks[i]+"", {'text-anchor' : 'start'});
	    			
	    			//console.log(g);
	    		}					
				
				
			}
    		
    		
    		
    		return {g : g, scale : scale, ticks : ticks, values : values};
    	}
    	
    	/*
    	 * this.drawBlock(['apple', 'orange', 'banana', 'gruit'], [0, width]));
    	 * 
    	 */
    	this.drawBlock = function(chart, orient, domain, range) {

    		var g = chart.group();
    		
    		var scale = this.scale.ordinal().domain(domain);
    		
    		//console.log(scale);

   			var max = range[0];
    		var min = range[0];
    		
    		for(var i = 0; i < range.length; i++) {
    			if (range[i] > max) max = range[i];
    			else if (range[i] < min) min = range[i];
    		}

    		var points = scale.rangePoints(range).range();
    		var band = scale.rangeBand();
    		var values = [];
    		
    		if (orient == 'top') {
    			
				var height = 30;
				var bar = 6; 
				var barY = height - bar; 
				
				g.line(0, height, max, height, { stroke : "black", "stroke-width" : 0.5});	    			
    			
				for(var i = 0; i < points.length; i++) {
	    			values[i] = { point : points[i], band : band }; 
	    			
	    			var axis = g.group();
	    			axis.attr({
	    				"transform" : "translate("+ points[i] + ", 0)"	
	    			});
	    			
	    			axis.line(0, barY, 0, height, { 'stroke-width' : 0.5, 'stroke' : 'black'});
	    			axis.text(band/2, 20, domain[i], {'text-anchor' : 'middle'});
	    		}
	    		
	    		
				var axis = g.group();
				axis.attr({
					"transform" : "translate(" + max + ", 0)"	
				});
				
				axis.line(0, barY, 0, height, { 'stroke-width' : 0.5, 'stroke' : 'black'});
				axis.text(band/2, 20, "", {'text-anchor' : 'middle'});
				
    		} else if (orient == 'bottom') {
				var height = 30;
				var bar = 6; 
				var barY = height - bar; 
				
				g.line(0, 0, max, 0, { stroke : "black", "stroke-width" : 0.5});	    			
    			
				for(var i = 0; i < points.length; i++) {
	    			values[i] = { point : points[i], band : band }; 
	    			
	    			var axis = g.group();
	    			axis.attr({
	    				"transform" : "translate("+ points[i] + ", 0)"	
	    			});
	    			
	    			axis.line(0, 0, 0, bar, { 'stroke-width' : 0.5, 'stroke' : 'black'});
	    			axis.text(band/2, 20, domain[i], {'text-anchor' : 'middle'});
	    		}
	    		
	    		
				var axis = g.group();
				axis.attr({
					"transform" : "translate(" + max + ", 0)"	
				});
				
				axis.line(0, 0, 0, bar, { 'stroke-width' : 0.5, 'stroke' : 'black'});
				axis.text(band/2, 20, "", {'text-anchor' : 'middle'});
    		} else if (orient == 'left') {
				var width = 30;
				var bar = 6; 
				var barX = width - bar; 
				
				g.line(width, 0, width, max, { stroke : "black", "stroke-width" : 0.5});	    			
    			
				for(var i = 0; i < points.length; i++) {
	    			values[i] = { point : points[i], band : band }; 
	    			
	    			var axis = g.group();
	    			axis.attr({
	    				"transform" : "translate(0, "+ points[i] + ")"	
	    			});
	    			
	    			axis.line(barX, 0, width, 0, { 'stroke-width' : 0.5, 'stroke' : 'black'});
	    			axis.text(bar*4, band/2, domain[i], {'text-anchor' : 'end'});
	    		}
	    		
	    		
				var axis = g.group();
				axis.attr({
					"transform" : "translate(0, " + max + ")"	
				});
				
				axis.line(barX, 0, width, 0, { 'stroke-width' : 0.5, 'stroke' : 'black'});
				axis.text(20, band/2, "", {'text-anchor' : 'end'});
    		} else if (orient == 'right') {
				var width = 30;
				var bar = 6; 
				var barX = width - bar; 
				
				g.line(0, 0, 0, max, { stroke : "black", "stroke-width" : 0.5});	    			
    			
				for(var i = 0; i < points.length; i++) {
	    			values[i] = { point : points[i], band : band }; 
	    			
	    			var axis = g.group();
	    			axis.attr({
	    				"transform" : "translate(0, "+ points[i] + ")"	
	    			});
	    			
	    			axis.line(0, 0, bar, 0, { 'stroke-width' : 0.5, 'stroke' : 'black'});
	    			axis.text(bar, band/2, domain[i], {'text-anchor' : 'start'});
	    		}
	    		
	    		
				var axis = g.group();
				axis.attr({
					"transform" : "translate(0, " + max + ")"	
				});
				
				axis.line(0, 0, bar, 0, { 'stroke-width' : 0.5, 'stroke' : 'black'});
				axis.text(20, band/2, "", {'text-anchor' : 'start'});
    		}
    		
    		
    		
    		return {g : g, scale : scale, values : values};
    	}
    	
    	this.drawDate = function(chart, orient, domain, range, step, format) {
    		var g = chart.group();
    		var scale = this.scale.time().domain(domain).rangeRound(range);
    		
   			var max = range[0];
    		var min = range[0];
    		
    		for(var i = 0; i < range.length; i++) {
    			if (range[i] > max) max = range[i];
    			else if (range[i] < min) min = range[i];
    		}    		
    		
    		if (typeof format  == 'string') {
    			var str = format; 
    			format = function(value) {
    				return _.dateFormat(value, str);
    			}
    		}
    		
    		var ticks = scale.ticks(step[0], step[1]); // step = [this.time.days, 1];
    		var values = [];

    		
    		if (orient == 'top') {
    			var height = 30;
				var bar = 6; 
				var barY = height - bar; 
				
				g.line(0, height, max, height, { stroke : "black", "stroke-width" : 0.5});	
    			
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]); 
	    			
	    			var axis = g.group();
	    			axis.attr({
	    				"transform" : "translate("+ values[i] + ", 0)"	
	    			});
	    			
	    			axis.line(0, barY, 0, height, { 'stroke-width' : .5, 'stroke' : 'black'});
	    			axis.text(0, bar*3, format ? format(ticks[i]) : ticks[i], {'text-anchor' : 'middle'});
	    		}
    		} else if (orient == 'bottom') {
    			var height = 30;
				var bar = 6; 
				var barY = height - bar; 
				
				g.line(0, 0, max, 0, { stroke : "black", "stroke-width" : 0.5});	
    			
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]); 
	    			
	    			var axis = g.group();
	    			axis.attr({
	    				"transform" : "translate("+ values[i] + ", 0)"	
	    			});
	    			
	    			axis.line(0, 0, 0, bar, { 'stroke-width' : .5, 'stroke' : 'black'});
	    			axis.text(0, bar*3, format ? format(ticks[i]) : ticks[i], {'text-anchor' : 'middle'});
	    		}    			
    			
    			
    		} else if (orient == 'left') {
    			var width = 30;
				var bar = 6; 
				var barX = width - bar; 
				
				g.line(width, 0, width, max, { stroke : "black", "stroke-width" : 0.5});	    			
    			
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]); 
	    			
	    			var axis = g.group();
	    			axis.attr({
	    				"transform" : "translate(0,"+ values[i] + ")"	
	    			});
	    			
	    			axis.line(barX, 0, width, 0, { 'stroke-width' : .5, 'stroke' : 'black'});
	    			axis.text(bar, bar, format ? format(ticks[i]) : ticks[i], {'text-anchor' : 'end'});
	    		}    
    			
    		} else if (orient == 'right') {
    			var width = 30;
				var bar = 6; 
				var barX = width - bar; 
				
				g.line(0, 0, 0, max, { stroke : "black", "stroke-width" : 0.5});	    			
    			
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]); 
	    			
	    			var axis = g.group();
	    			axis.attr({
	    				"transform" : "translate(0,"+ values[i] + ")"	
	    			});
	    			
	    			axis.line(0, 0, bar, 0, { 'stroke-width' : .5, 'stroke' : 'black'});
	    			axis.text(bar*2, bar, format ? format(ticks[i]) : ticks[i], {'text-anchor' : 'start'});
	    		}    
    		}
    		

    		
    		return {g : g, scale : scale, ticks : ticks, values : values};    		
    	}
    	
    }

    return Grid;
}, "chart.draw");