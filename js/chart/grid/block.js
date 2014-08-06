jui.define("chart.grid.block", [], function() {

    var Grid = function(orient, opt) {
        this.drawBefore = function(chart) {

        }

        this.draw = function(chart) {
        	var width = chart.area.width,
                height = chart.area.height,
                max = (orient == 'left' || orient == 'right') ? height : width,
                obj = this.drawBlock(chart, orient, opt.domain, [0, max]);

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
			  'class' : 'grid block',
				transform : "translate(" + x + ", " + y + ")"
			})	            

			return obj;
        }
    }

    return Grid;
}, "chart.grid");
