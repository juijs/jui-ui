jui.define("chart.grid.range", [], function() {

    var Grid = function(orient, opt) {
        this.drawBefore = function(chart) {

        }

        this.draw = function(chart) {
        	var width = chart.area.width,
                height = chart.area.height;
            
        	if (orient == 'left' || orient == 'right') {
        		var obj = this.drawRange(chart, orient, opt.domain, [height, 0], opt.step);	
        	} else {
        		var obj = this.drawRange(chart, orient, opt.domain, [0, width], opt.step);
        	}

			if (orient == 'left') {
				var x = chart.area.x - 30;
				var y = chart.area.y;
			} else if (orient == 'right') {
				var x = chart.area.x2;
				var y = chart.area.y;
			} else if (orient == 'top') {
				var x = chart.area.x;
				var y = chart.area.y - 30;
			} else if (orient == 'bottom') {
				var x = chart.area.x;
				var y = chart.area.y2;
			}            
            
			obj.g.attr({
				transform : "translate(" + x + ", " + y + ")"
			})	            

			return obj;
        }
    }

    return Grid;
}, "chart.grid");
