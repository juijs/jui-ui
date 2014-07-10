jui.defineUI("chart.bar", [ "svg", "chart.grid.basic" ], function(svg, _) {
	var UI = function() {
		this.init = function() {
			return this;
		}

        this.draw = function() {
            return "barchart";
        }
	}
	
	return UI;
}, "chart.core");