jui.define("chart.draw", [ "util" ], function(_) {
	var Draw = function() {
		
		this.render = function(chart) {
			if (!_.typeCheck("function", this.draw)) {
				throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
			}

			if (_.typeCheck("function", this.drawBefore)) {
				this.drawBefore(chart);
			}

			return this.draw(chart);
		}

		// 2d rotate
		this.rotate = function(x, y, radian) {
			return {
				x : x * Math.cos(radian) - y * Math.sin(radian),
				y : x * Math.sin(radian) + y * Math.cos(radian)
			}
		}
		
	}

	return Draw;
});
