jui.define("chart.brush.circlegauge", ["util.math"], function(math) {

	var BarGaugeBrush = function(brush) {
		this.drawBefore = function(chart) {
            var width = chart.width(), height = chart.height();
            var min = width;

            if (height < min) {
                min = height;
            }


            this.w = min / 2;
            this.centerX = width / 2;
            this.centerY = height / 2;
            this.outerRadius = this.w;

            this.min = typeof brush.min == 'undefined'  ? 0 : parseFloat(brush.min);
            this.max = typeof brush.max == 'undefined' ? 100 : parseFloat(brush.max);

            this.value = typeof brush.value == 'undefined' ? 0 : brush.value;

		}

		this.draw = function(chart) {

			var group = chart.svg.group({
				'class' : 'brush circle gauge'
			})

			group.translate(chart.x(), chart.y())

            group.append(chart.svg.circle({
                cx : this.centerX,
                cy : this.centerY,
                r : this.outerRadius,
                fill : "#ececec",
                stroke : chart.theme.color(0),
                "stroke-width" : 2 
            }))	
            
            var rate = (this.value - this.min) / (this.max - this.min);
            
            group.append(chart.svg.circle({
                cx : this.centerX,
                cy : this.centerY,
                r : this.outerRadius * rate,
                fill : chart.theme.color(0)
            }))            		
		}
	}

	return BarGaugeBrush;
}, "chart.brush.core");
