jui.define("chart.grid.block", [], function() {

    var Grid = function(orient, opt) {
        this.drawBefore = function(chart) {

        }

        this.draw = function(chart) {
        	var width = chart.area.chart.width,
                height = chart.area.chart.height,
                max = (orient == 'left' || orient == 'right') ? height : width,
                obj = this.drawBlock(chart, orient, opt.domain, [0, max]);

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
