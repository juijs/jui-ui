jui.define("chart.brush.over", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.over 
     * implements over brush 
     * @extends chart.brush.core
     */
	var OverBrush = function() {
		var g;
		var zeroX, height, half_height, over_height;

        /**
         * @method drawBefore 
         * 
         * @protected 
         */
		this.drawBefore = function() {

		}



		this.draw = function() {
			var g = this.chart.svg.group();

			this.axis.map.getMapGroup().each(function(i, path) {
				path.on('mouseover', function() {
					$(this).attr({
						fill : 'blue',
						stroke : 'red',
						'stroke-width' : 5
					});

					console.log(path.size());
				});

				path.on('mouseout', function() {
					$(this).attr({
						fill : '',
						stroke : ''
					});
				})
			})

			return g;
		}

	}

	OverBrush.setup = function() {
		return {

		};
	}

	return OverBrush;
}, "chart.brush.core");
