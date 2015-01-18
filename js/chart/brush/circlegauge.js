jui.define("chart.brush.circlegauge", [], function() {

    /**
     * @class chart.brush.circlegauge 
     * 
     * implements circle gauge  
     *
     * @extends chart.brush.core 
     */
	var CircleGaugeBrush = function(chart, axis, brush) {
        var w, centerX, centerY, outerRadius;

		this.drawBefore = function() {

		}

        this.drawUnit = function(i, data, group) {

            var obj = axis.c(index),
                value = (data[this.brush.target] || data.value) || 0,
                max = (data[this.brush.max] || data.max) || 100,
                min = (data[this.brush.min] || data.min) || 0;


            var rate = (value - min) / (max - min);

            var width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y;

            // center
            w = Math.min(width, height) / 2;
            centerX = width / 2 + x;
            centerY = height / 2 + y;
            outerRadius = w;

            var group = chart.svg.group();

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

            var group = chart.svg.group();

            this.eachData(function(i, data) {
                this.drawUnit(i, data, group);
            });

            return group;


		}
	}

    CircleGaugeBrush.setup = function() {
        return {
            /** @cfg {String} [min=min] a field for min */
            min: 'min',
            /** @cfg {String} [max=max] a field for max */
            max: 'max',
            /** @cfg {String} [value=value] a field for value */
            value: 'value'
        };
    }

	return CircleGaugeBrush;
}, "chart.brush.core");
