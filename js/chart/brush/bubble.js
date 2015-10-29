jui.define("chart.brush.bubble", [ "util.math" ], function(math) {

    /**
     * @class chart.brush.bubble 
     *
     * @extends chart.brush.core
     */
	var BubbleBrush = function() {
        var self = this;

        this.createBubble = function(pos, color) {
            var radius = math.scaleValue(pos.value, this.axis.y.min(), this.axis.y.max(), this.brush.min, this.brush.max),
                circle = this.chart.svg.group();

            circle.append(
                this.chart.svg.circle({
                    r: radius,
                    "fill": color,
                    "fill-opacity": this.chart.theme("bubbleBackgroundOpacity"),
                    "stroke": color,
                    "stroke-width": this.chart.theme("bubbleBorderWidth")
                })
            ).translate(pos.x, pos.y);

            return circle;
        }

        this.drawBubble = function(points) {
            var g = this.chart.svg.group();
            
            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].x.length; j++) {
                    var b = this.createBubble({
                        x: points[i].x[j], y: points[i].y[j], value: points[i].value[j]
                    }, this.color(j, i));

                    this.addEvent(b, j, i);
                    g.append(b);
                }
            }

            return g;
        }

        this.draw = function() {
            return this.drawBubble(this.getXY());
        }

        this.drawAnimate = function(root) {
            root.each(function(i, elem) {
                var c = elem.children[0];

                c.append(self.chart.svg.animateTransform({
                    attributeType: "xml",
                    attributeName: "transform",
                    type: "scale",
                    from: "0",
                    to: "1",
                    dur: "0.7s",
                    fill: "freeze",
                    repeatCount: "1"
                }));

                c.append(self.chart.svg.animate({
                    attributeType: "xml",
                    attributeName: "fill-opacity",
                    from: "0",
                    to: self.chart.theme("bubbleBackgroundOpacity"),
                    dur: "1.4s",
                    repeatCount: "1",
                    fill: "freeze"
                }));
            });
        }
	}

    BubbleBrush.setup = function() {
        return {
            /** @cfg {Number} [min=5] Determines the minimum size of a bubble. */
            min: 5,
            /** @cfg {Number} [max=30] Determines the maximum size of a bubble.*/
            max: 30
        };
    }

	return BubbleBrush;
}, "chart.brush.core");