jui.define("chart.grid.radal", [], function() {

    var Grid = function(orient, opt) {
    	
    	var self = this; 
    	
    	console.log(opt);
    	
        this.drawBefore = function(chart) {

        }
        
        this.drawRadal = function(chart, centerX, centerY, x, y, count, unit) {
        	
          console.log(x, y, count, unit);
        	
          var g = chart.svg.group();
        	
		  var startX = x;
		  var startY = y;
          
          for(var i = 0; i < count; i++) {
            var obj = this.rotate(startX, startY, unit);
            
            g.append(chart.svg.line({
              x1 : centerX + startX,
              y1 : centerY + startY,
              x2 : centerX + obj.x,
              y2 : centerY + obj.y,
              "stroke-width" : 1,
              'stroke' : 'black'
            }))  
            
            startX = obj.x;
            startY = obj.y;            
          }     
        }

        this.draw = function(chart) {
          var width = chart.area.width, height = chart.area.height;
          
          var min = width; 
          
          if (height < min) {
            min = height; 
          }
          
          // center 
          var w = min / 2; 
          var centerX = width / 2;
          var centerY = height / 2;
          
          var startY = -w/1.5; 
          var startX = 0;
          var count = opt.domain.length; 
          var step = opt.step;
          var unit = 2*Math.PI/count;
          
          var h = Math.abs(startY) / step;
          
          var g = chart.svg.group();
          
          // domain line 
          for(var i = 0; i < count; i++) {
          	
          	  var x2 = centerX + startX;
          	  var y2 = centerY + startY;
          	
	          g.append(chart.svg.line({
	            x1 : centerX,
	            y1 : centerY,
	            x2 : x2,
	            y2 : y2,
	            "stroke-width" : 1,
	            'stroke' : 'black'
	          }))       
	          
	          var ty = y2;
	          var tx = x2; 
	          var talign = 'middle';
	          
	          if (y2 > centerY) {
	          	ty = y2 + 20; 
	          } else if (y2 < centerY) {
	          	ty = y2 - 10;
	          }
	          
	          if (x2 > centerX) {
	          	talign = "start";
	          	tx += 10;
	          } else if (x2 < centerX) {
	          	talign = "end";
	          	tx -= 10;
	          }
	          
	          g.append(chart.svg.text({
	            x : tx,
	            y : ty,
	            'text-anchor' : talign
	          }, opt.domain[i]))       	             	
          	
	            var obj = this.rotate(startX, startY, unit);
	            
	            startX = obj.x;
	            startY = obj.y;
	            
	           
          }

		  // area split line 
		  startY = -w/1.5;
		  for(var i = 0; i < step; i++) {
		  	this.drawRadal(chart, centerX, centerY, 0, startY, count, unit);
		  	
		  	startY += h;
		  }
        }
    }

    return Grid;
}, "chart.grid");
