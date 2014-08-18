jui.define("chart.widget", ["util"], function(_) {
	var Widget = function() {

		this.render = function(chart) {
			if (!_.typeCheck("function", this.draw)) {
				throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
			}

			if (_.typeCheck("function", this.drawBefore)) {
				this.drawBefore(chart);
			}

			return this.draw(chart);
		}
	}

	return Widget;
}, "chart.draw"); 