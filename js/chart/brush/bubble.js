jui.define("chart.brush.bubble", [], function() {

	var BubbleBrush = function(brush) {
        var points = [];

        this.drawBefore = function(chart) {
            var posX = (brush.full) ? 0 : chart.x.rangeBand() / 2;

            for (var i = 0; i < chart.data().length; i++) {
                points[i] = brush.x(i) + posX;
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

                    var r_min = (brush.min) ? brush.min : 5,
                        r_max = (brush.max) ? brush.max : 30,
                        radius = Math.round(this.getScaleValue(value, target.min, target.max, r_min, r_max));

                    var bubble = chart.svg.circle({
                        cx: Math.round(points[i]),
                        cy: Math.round(brush.y(value)),
                        r: radius,
                        "fill": this.color(j),
                        "fill-opacity": 0.5,
                        "stroke": this.color(j),
                        "stroke-width": 1
                    });

                    bubble.attr(chart.attr(brush.type, brush.target[j]));
                    g.append(bubble);
                }
            }
        }
	}

	return BubbleBrush;
}, "chart.brush"); 