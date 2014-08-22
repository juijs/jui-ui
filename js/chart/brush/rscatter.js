jui.define("chart.brush.rscatter", [], function() {

	var RangeScatterBrush = function(brush) {
        var g;

        this.drawBefore = function(chart) {
            var defs = chart.svg.defs(),
                clip = chart.svg.clipPath({
                    id : 'clip'
                });

            defs.append(clip);
            clip.append(chart.svg.rect({
                x : 0,
                y : 0,
                width : chart.area('width'),
                height : chart.area('height')
            }));

            g = chart.svg.group({
                "clip-path" : "url(#clip)"
            }).translate(chart.area('x'), chart.area('y'));
        }

        this.draw = function(chart) {
            var points = [],
                raw = chart.series(brush.x.key).data;

            for (var i = 0; i < chart.data().length; i++) {
                points[i] = brush.x(raw[i]);
            }

            this.drawScatter(brush, chart, points, g);
        }
	}

	return RangeScatterBrush;
}, "chart.brush.scatter");