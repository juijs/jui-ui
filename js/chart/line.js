jui.define("chart.line", [ "svg", "util" ], function(svg, _) {
	var UI = function() {
		this.init = function() {
			return this;
		}

        this.draw = function() {
            console.log(svg);

            return "draw";
        }
	}
	
	return UI;
}, "chart");