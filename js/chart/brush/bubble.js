jui.define("chart.brush.bubble", [], function() {

	var BubbleBrush = function(brush) {
        var points = [];

        this.drawBefore = function(chart) {
            for (var i = 0, len = chart.data().length; i < len; i++) {
                points[i] = brush.x(i);
            }
        }

        this.draw = function(chart) {
            var g = chart.svg.group({
            	'clip-path' : 'url(#clip)'
            	
            }).translate(chart.area('x'), chart.area('y'));

            for (var i = 0; i < points.length; i++) {
                for (var j = 0; j < brush.target.length; j++) {
                    var target = chart.series(brush.target[j]),
                        value = target.data[i];

                    var r_min = (typeof brush.min != "undefined") ? brush.min : 5,
                        r_max = (typeof brush.min != "undefined") ? brush.max : 30,
                        radius = this.getScaleValue(value, target.min, target.max, r_min, r_max);

                    var bubble = chart.svg.circle({
                        cx: points[i],
                        cy: brush.y(value),
                        r: radius,
                        "fill": this.color(j),
                        "fill-opacity": 0.5,
                        "stroke": this.color(j),
                        "stroke-width": 1
                    });

                    g.append(bubble);
                }
            }
        }
	}

	return BubbleBrush;
}, "chart.brush"); 