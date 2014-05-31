jui.define("chart.line", [ "svg", "util" ], function(svg, _) {
	var UI = function() {
		this.init = function() {
			return this;
		}
		
		this.render = function() {
			svg.build();
		}
	}
	
	return UI;
});