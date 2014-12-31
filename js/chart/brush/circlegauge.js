jui.define("chart.brush.circlegauge", [], function() {

	var CircleGaugeBrush = function(chart, axis, brush) {
        var w, centerX, centerY, outerRadius;

		this.drawBefore = function() {
            var axis = axis || {};

            if (!axis.c) {
                axis.c = function() {
                    return {
                        x : 0,
                        y : 0,
                        width : chart.area('width'),
                        height : chart.area('height')
                    };
                }
            }

            var obj = axis.c(),
                width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y,
                min = width;

            if (height < min) {
                min = height;
            }

            w = min / 2;
            centerX = width / 2 + x;
            centerY = height / 2 + y;
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
                stroke : this.color(0),
                "stroke-width" : 2
            }));
            
            group.append(chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : outerRadius * rate,
                fill : this.color(0)
            }));

            this.addEvent(group, null, null);

            return group;
		}
	}

    CircleGaugeBrush.setup = function() {
        return {
            min: 0,
            max: 100,
            value: 0
        };
    }

	return CircleGaugeBrush;
}, "chart.brush.core");
