jui.define("chart.brush.bubble", [], function() {

	var BubbleBrush = function(chart, axis, brush) {
        var self = this;

        function createBubble(chart, brush, pos, index) {
            var radius = self.getScaleValue(pos.value, axis.y.min(), axis.y.max(), brush.min, brush.max),
                circle = chart.svg.group();

            circle.append(
                chart.svg.circle({
                    r: radius,
                    "fill": self.color(index),
                    "fill-opacity": chart.theme("bubbleBackgroundOpacity"),
                    "stroke": self.color(index),
                    "stroke-width": chart.theme("bubbleBorderWidth")
                })
            ).translate(pos.x, pos.y);

            return circle;
        }

        this.drawBubble = function(chart, brush, points) {
            var g = chart.svg.group();
            
            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].x.length; j++) {
                    var b = createBubble(chart, brush, {
                        x: points[i].x[j], y: points[i].y[j], value: points[i].value[j]
                    }, i);

                    this.addEvent(b, j, i);
                    g.append(b);
                }
            }

            return g;
        }

        this.draw = function() {
            return this.drawBubble(chart, brush, this.getXY());
        }

        this.drawAnimate = function(root) {
            root.each(function(i, elem) {
                var c = elem.childrens[0];

                c.append(chart.svg.animateTransform({
                    attributeType: "xml",
                    attributeName: "transform",
                    type: "scale",
                    from: "0",
                    to: "1",
                    dur: "0.7s",
                    fill: "freeze",
                    repeatCount: "1"
                }));

                c.append(chart.svg.animate({
                    attributeType: "xml",
                    attributeName: "fill-opacity",
                    from: "0",
                    to: chart.theme("bubbleBackgroundOpacity"),
                    dur: "1.4s",
                    repeatCount: "1",
                    fill: "freeze"
                }));
            });
        }
	}

    BubbleBrush.setup = function() {
        return {
            min: 5,
            max: 30
        };
    }

	return BubbleBrush;
}, "chart.brush.core");