jui.define("chart.brush.bubble", [], function() {
	/**
	 * Bubble Gauge Brush 객체 
	 * 
	 * <code>
	 * {
	 * 	type : "bubble",
	 *  target : "field1",  // 생략하면 모든 series 를 target 으로 설정
	 *  min : 5,	// 최소 bubble 사이즈  
	 *  max : 30,	// 최대 bubble 사이즈 
	 *  colors : []	// custom color 
	 * } 
	 * </code>
	 * 
 	 * @param {Object} brush
	 */
	var BubbleBrush = function(brush) {
        var self = this;

        function createBubble(chart, brush, pos, index) {
            var series = chart.series(brush.target[index]),
                radius = self.getScaleValue(pos.value, series.min, series.max, brush.min, brush.max);

            return chart.svg.circle({
                cx: pos.x,
                cy: pos.y,
                r: radius,
                "fill": chart.color(index, brush.colors),
                "fill-opacity": chart.theme("bubbleOpacity"),
                "stroke": chart.color(index, brush.colors),
                "stroke-width": chart.theme("bubbleBorderWidth")
            });
        }

        this.drawBubble = function(chart, brush, points) {
            var g = chart.svg.group({
                "clip-path" : "url(#" + chart.clipId + ")"
            }).translate(chart.x(), chart.y());

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].x.length; j++) {
                    var b = createBubble(chart, brush, {
                        x: points[i].x[j], y: points[i].y[j], value: points[i].value[j]
                    }, i);

                    this.addEvent(b, i, j);
                    g.append(b);
                }
            }

            return g;
        }

        this.draw = function(chart) {
            return this.drawBubble(chart, brush, this.getXY());
        }

        this.drawSetup = function() {
            return {
                min: 5,
                max: 30
            }
        }
	}

	return BubbleBrush;
}, "chart.brush.core");