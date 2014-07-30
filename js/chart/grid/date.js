jui.define("chart.grid.date", [  ], function() {


    var Grid = function(orient, opt) {
    	
    	var self = this; 
    	
        this._draw = function(chart) {
        	
        	var height = chart.area.chart.height;
        	var width = chart.area.chart.width; 
            
        	var max = (orient == 'left' || orient == 'right') ? chart.area.chart.height : chart.area.chart.width;
        	
        	var obj = this.drawBlock(chart, orient, opt.domain, [0, chart.area.chart.height]);
    


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
