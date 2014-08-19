jui.define("chart.brush.rline", [], function() {

	var RangeLineBrush = function(brush) {

		this.drawBefore = function(chart) {
			var defs = chart.svg.defs(),
                clip = chart.svg.clipPath({
				id : 'clip'
			});

			defs.append(clip)
			clip.append(chart.svg.rect({
				x : 0,
				y : 0,
				width : chart.area('width'),
				height : chart.area('height')
			}));
		}

		this.draw = function(chart) {
			var path = [],
                raw = chart.series(brush.x.key).data,
                count = chart.series(brush.target[0]).data.length;

            var g = chart.svg.group({
                "clip-path" : "url(#clip)"
            }).translate(chart.area('x'), chart.area('y'));

			for (var i = 0; i < count; i++) {
				var startX = brush.x(raw[i]);

				for (var j = 0; j < brush.target.length; j++) {
					var startY = brush.y(chart.series(brush.target[j]).data[i]);

					if (!path[j]) {
						path[j] = {
							x : [],
							y : []
						};
					}

					path[j].x.push(startX);
					path[j].y.push(startY);
				}
			}

            // chart.brush.line의 부모 메소드 호출
            this.drawLine(brush, chart, path, g);
		}
	}

	return RangeLineBrush;
}, "chart.brush.line");
