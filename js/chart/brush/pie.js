jui.define("chart.brush.pie", [ "util.base", "util.math" ], function(_, math) {

	/**
	 * @class chart.brush.pie
	 *
	 * implements pie brush
	 *
     * @extends chart.brush.core
	 */
	var PieBrush = function(chart, axis, brush) {
        var self = this, g;
        var centerX, centerY, outerRadius;

		function createPie(startAngle, endAngle, color) {
			var pie = chart.svg.group(),
				path = chart.svg.path({
                    fill : color,
                    stroke : chart.theme("pieBorderColor") || color,
                    "stroke-width" : chart.theme("pieBorderWidth")
                });

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle)),
				startX = obj.x,
                startY = obj.y;
			
			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			pie.translate(centerX, centerY);

			// arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y)
                .LineTo(0, 0)
                .ClosePath();

            pie.append(path);

			return pie;
		}

		function createUnit(index, data) {
			var obj = axis.c(index);

			var width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y,
                min = width;

			if (height < min) {
				min = height;
			}

			// center
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = min / 2;

			var target = brush.target,
				all = 360,
				startAngle = 0,
				max = 0;

			for (var i = 0; i < target.length; i++) {
				max += data[target[i]];
			}

			for (var i = 0; i < target.length; i++) {
				var value = data[target[i]],
					endAngle = all * (value / max),
                    pie = createPie(startAngle, endAngle, self.color(i));

                if(brush.showText == "outer") {
                    var series = chart.get("series", target[i]),
                        dText = ((series.text != "") ? series.text : target[i]) + ": " + value,
                        cText = _.typeCheck("function", brush.format) ? brush.format(target[i], value) : dText,
                        outer = self.drawTextOuter(startAngle + (endAngle / 2) - 90, cText);

                    self.addEvent(outer, index, i);
                    g.append(outer);
                }

                self.addEvent(pie, index, i);
				g.append(pie);

				startAngle += endAngle;
			}
		}

        this.drawTextOuter = function(centerAngle, text) {
            var c = this.chart,
                dist = c.theme("pieOuterLineSize"),
                r = outerRadius * 1.2,
                x = centerX + (Math.cos(math.radian(centerAngle)) * r),
                y = centerY + (Math.sin(math.radian(centerAngle)) * r),
                isLeft = (centerAngle + 90 > 180) ? true : false,
                ex = (isLeft) ? x - dist : x + dist;

            return c.svg.group({}, function() {
                var path = c.svg.path({
                    fill: "transparent",
                    stroke: c.theme("pieOuterLineColor"),
                    "stroke-width": 0.7
                });

                path.MoveTo(centerX, centerY)
                    .LineTo(x, y)
                    .LineTo(ex, y);

                c.text({
                    "font-size": c.theme("pieOuterFontSize"),
                    "text-anchor": (isLeft) ? "end" : "start",
                    "alignment-baseline": "middle"
                }, text).translate(ex + (isLeft ? -3 : 3), y);
            });
        }

        this.drawBefore = function() {
            g = this.chart.svg.group();
        }

		this.draw = function() {
			this.eachData(function(i, data) {
				createUnit(i, data);
			});

            return g;
		}
	}

    PieBrush.setup = function() {
        return {
            clip: false,
            showText: null // outer, inner
        }
    }

	return PieBrush;
}, "chart.brush.core");
