jui.define("chart.brush.circlegauge", [ "util.math" ], function(math) {

	/**
	 * Circle Gauge Brush 객체  
	 * 
	 * {
	 * 	type : "circlegauge",
	 *  min : 0,
	 *  max : 100,
	 *  value : 30 
	 * }
	 * 
 	 * @param {Object} brush
	 */
	var CircleGaugeBrush = function(brush) {
        var w, centerX, centerY, outerRadius;

		this.drawBefore = function(chart) {
            var width = chart.width(), height = chart.height();
            var min = width;

            if (height < min) {
                min = height;
            }

            w = min / 2;
            centerX = width / 2;
            centerY = height / 2;
            outerRadius = w;
		}

		this.draw = function(chart) {
            var rate = (brush.value - brush.min) / (brush.max - brush.min);

			var group = chart.svg.group({
				"class" : "brush circle gauge"
			}).translate(chart.x(), chart.y());

            group.append(chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : outerRadius,
                fill : "#ececec",
                stroke : chart.color(0, brush.colors),
                "stroke-width" : 2 
            }));
            
            group.append(chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : outerRadius * rate,
                fill : chart.color(0, brush.colors)
            }));

            return group;
		}

        this.drawSetup = function() {
            return {
                min: 0,
                max: 100,
                value: 0
            };
        }
	}

	return CircleGaugeBrush;
}, "chart.brush.core");
