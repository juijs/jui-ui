jui.define("chart.brush.circlegauge", [ "util.math" ], function(math) {

	var CircleGaugeBrush = function(chart, brush) {
        var w, centerX, centerY, outerRadius;

		this.drawBefore = function() {
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

		this.draw = function() {
            var rate = (brush.value - brush.min) / (brush.max - brush.min);

			var group = chart.svg.group({
				"class" : "brush circle gauge"
			});

            group.append(chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : outerRadius,
                fill : chart.theme("gaugeBackgroundColor"),
                stroke : chart.color(0, brush),
                "stroke-width" : 2
            }));
            
            group.append(chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : outerRadius * rate,
                fill : chart.color(0, brush)
            }));

            this.addEvent(group, null, null);

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
