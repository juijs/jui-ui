jui.define("chart.brush.circlegauge", [], function() {

    /**
     * @class chart.brush.circlegauge 
     * 
     * implements circle gauge  
     *
     * @extends chart.brush.core 
     */
	var CircleGaugeBrush = function(chart, axis, brush) {
        var group;
        var w, centerX, centerY, outerRadius;

        this.drawUnit = function(i, data) {
            var obj = axis.c(i),
                value = this.getValue(data, "value", 0),
                max = this.getValue(data, "max", 100),
                min = this.getValue(data, "min", 0);

            var rate = (value - min) / (max - min),
                width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y;

            // center
            w = Math.min(width, height) / 2;
            centerX = width / 2 + x;
            centerY = height / 2 + y;
            outerRadius = w;

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
        }
        
		this.draw = function() {
            group = chart.svg.group();

            this.eachData(function(i, data) {
                this.drawUnit(i, data);
            });

            return group;
		}
	}

    CircleGaugeBrush.setup = function() {
        return {
            /** @cfg {Boolean} [clip=false] If the brush is drawn outside of the chart, cut the area. */
            clip: false
        }
    }

	return CircleGaugeBrush;
}, "chart.brush.core");
