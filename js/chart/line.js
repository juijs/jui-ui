jui.defineUI("chart.line", [ "svg", "chart.grid.basic" ], function(svg, grid) {
    var UI = function() {
		this.init = function() {
			return this;
		}

        this.draw = function() {
            return "linechart";
        }

        this.render = function() {
            alert(this.merge(new grid));
        }
	}
	
	return UI;
}, "chart.core");