jui.define("chart.brush.equalizer", [], function() {

  var BarBrush = function(brush) {
    var g, zeroY, count, width, barWidth;
    var outerPadding = 15, innerPadding = 10;

    this.drawBefore = function(chart) {
      g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

      zeroY = brush.y.scale(0);
      count = chart.series(brush.target[0]).data.length;

      width = chart.x.scale.rangeBand();
      barWidth = (width - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;
    }
    
    this.draw = function(chart) {
      for (var i = 0; i < count; i++) {
        var startX = brush.x.scale(i) + outerPadding;

        for (var j = 0; j < brush.target.length; j++) {
          var startY = brush.y.scale(chart.series(brush.target[j]).data[i]);

          if (startY <= zeroY) {
          	
          	var height = Math.abs(zeroY - startY)
          	var padding = 1;  
          	var unit = 10;

          	var eY = zeroY;
          	var eMin = startY;
          	var eIndex = 0;
          	while(eY > eMin) {
          	
          		var unitHeight = (eY - unit < eMin ) ? Math.abs(eY - eMin) : unit;
          	
	            var r = chart.svg.rect({
	              x : startX,
	              y : eY - unitHeight,
	              width : barWidth,
	              height : unitHeight,
	              rx : 3, 
	              ry : 3,
	              fill : this.color(Math.floor(eIndex/4))
	            });
	            
	            eY -= unitHeight + padding;
	            eIndex++;
	
	            g.append(r);
	        }
          } else {
          	
          	var padding = 1;  
          	var unit = 10;
          	
          	var eY = zeroY;
          	var eMax = startY;
          	var eIndex = 0;
          	while(eY < eMax) {
          		var unitHeight = (eY + unit > eMax ) ? Math.abs(eY - eMax) : unit; 
          		var r = chart.svg.rect({
	              x : startX,
	              y : eY,
	              width : barWidth, 
	              height : unitHeight,
	              rx : 3, 
	              ry : 3,
	              
	              fill : this.color(Math.floor(eIndex/4))
	            });          	
	            
	            eY += unitHeight + padding;
	            eIndex++;
	            
	            
	            g.append(r);
          	}

          }

          startX += barWidth + innerPadding;
        }
      }
    }
  }

  return BarBrush;
}, "chart.brush"); 