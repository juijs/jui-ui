jui.define("chart.grid.date", [], function() {

    var Grid = function(orient, opt) {
        this.drawBefore = function(chart) {

        }

        this.draw = function(chart) {
        	var obj = this.drawBlock(chart, orient, opt.domain, [0, chart.area.height]);

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
			  'class' : 'grid date',
				transform : "translate(" + x + ", " + y + ")"
			})	            

			return obj;
        }
    }

    return Grid;
}, "chart.grid");
