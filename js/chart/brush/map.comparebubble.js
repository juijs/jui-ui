jui.define("chart.brush.map.comparebubble", [ "util.base", "util.math" ], function(_, math) {
    var BORDER_WIDTH = 1.5,
        MAX_OPACITY = 0.8,
        MIN_OPACITY = 0.6,
        LINE_ANGLE = 315,
        TITLE_RATE = 0.6;

    /**
     * @class chart.brush.map.bubble
     * @extends chart.brush.core
     */
	var MapCompareBubbleBrush = function(chart, axis, brush) {
        var self = this;
        var g, min, max, minValue, maxValue;

        function getTextInBubble(color, align, size, title, value, x, y) {
            return self.chart.svg.text({
                fill: color,
                "text-anchor": align,
                y: 7
            }, function() {
                self.chart.svg.tspan({
                    "font-size": size
                }, value);
                self.chart.svg.tspan({
                    "font-size": size * TITLE_RATE,
                    x: 0,
                    y: size
                }, title);
            }).translate(x, y);
        }

        this.drawBefore = function() {
            var data = this.listData();
            g = chart.svg.group();

            if(data.length == 2) {
                min = data[0];
                max = data[1];
                minValue = axis.getValue(min, "value");
                maxValue = axis.getValue(max, "value");

                // 맥스 값 설정
                if (minValue > maxValue) {
                    min = data[1];
                    max = data[0];
                    minValue = axis.getValue(min, "value");
                    maxValue = axis.getValue(max, "value");
                }
            }
        }

        this.drawMaxText = function(centerX, centerY, gap) {
            var r = gap * 2.5,
                cx = centerX + Math.cos(math.radian(LINE_ANGLE)),
                cy = centerY + Math.sin(math.radian(LINE_ANGLE)),
                tx = centerX + (Math.cos(math.radian(LINE_ANGLE)) * r),
                ty = centerY + (Math.sin(math.radian(LINE_ANGLE)) * r),
                ex = tx + brush.size,
                title = axis.getValue(max, "title", ""),
                value = axis.getValue(max, "value", 0),
                size = self.chart.theme("mapCompareBubbleMaxFontSize");

            if(_.typeCheck("function", brush.format)) {
                value = this.format(value);
            }

            var group = chart.svg.group({}, function() {
                var path = self.chart.svg.path({
                    fill: "transparent",
                    stroke: self.chart.theme("mapCompareBubbleMaxLineColor"),
                    "stroke-width": BORDER_WIDTH,
                    "stroke-dasharray": self.chart.theme("mapCompareBubbleMaxLineDashArray")
                });

                path.MoveTo(cx, cy)
                    .LineTo(tx, ty)
                    .LineTo(ex, ty);

                self.chart.svg.circle({
                    cx: cx,
                    cy: cy,
                    r: 3,
                    fill: self.chart.theme("mapCompareBubbleMaxLineColor")
                });
            });

            group.append(getTextInBubble(
                self.chart.theme("mapCompareBubbleMaxFontColor"), "start",
                size, title, value, ex + 5, ty
            ));

            return group;
        }

        this.drawMinText = function(centerX, centerY) {
            var title = axis.getValue(min, "title", ""),
                value = axis.getValue(min, "value", 0),
                group = chart.svg.group(),
                size = self.chart.theme("mapCompareBubbleMinFontSize");

            if(_.typeCheck("function", brush.format)) {
                value = this.format(value);
            }

            group.append(getTextInBubble(
                self.chart.theme("mapCompareBubbleMinFontColor"), "middle",
                size, title, value, centerX, centerY - (size * TITLE_RATE / 2)
            ));
        }

		this.draw = function() {
            if(min != null && max != null) {
                var maxSize = brush.size,
                    minSize = brush.size * (minValue / maxValue),
                    gap = maxSize - minSize,
                    cx = axis.area("width") / 2,
                    cy = axis.area("height") / 2;

                var c1 = chart.svg.circle({
                    r: maxSize,
                    fill: this.color(0),
                    "fill-opacity": MAX_OPACITY,
                    stroke: chart.theme("mapCompareBubbleMaxBorderColor"),
                    "stroke-width": BORDER_WIDTH,
                    cx: cx,
                    cy: cy
                });

                var c2 = chart.svg.circle({
                    r: minSize,
                    fill: this.color(1),
                    "fill-opacity": MIN_OPACITY,
                    stroke: chart.theme("mapCompareBubbleMinBorderColor"),
                    "stroke-width": BORDER_WIDTH,
                    cx: cx,
                    cy: cy + gap - BORDER_WIDTH
                });

                g.append(c1);
                g.append(c2);
                g.append(this.drawMaxText(cx, cy - minSize, gap));
                g.append(this.drawMinText(cx, cy + gap - BORDER_WIDTH));
            }

			return g;
		}
	}

    MapCompareBubbleBrush.setup = function() {
        return {
            size: 100,
            format: null
        }
    }

	return MapCompareBubbleBrush;
}, "chart.brush.map.core");
