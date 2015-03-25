jui.define("chart.brush.bubble", [], function() {

    /**
     * @class chart.brush.bubble 
     *
     * @extends chart.brush.core
     */
	var BubbleBrush = function(chart, axis, brush) {
        var self = this;

        /**
         * @method createBubble 
         *  
         *  util method for craete bubble
         *   
         * @private
         * @param {chart.builder} chart
         * @param {Object} brush
         * @param {Object} pos
         * @param {Number} index
         * @return {GroupElement}
         */
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

        /**
         * @method drawBubble 
         * 
         * @protected  
         * @param {chart.builder} chart
         * @param {Object} brush
         * @param {Array} points
         * @return {GroupElement}
         */
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

        /**
         * @method draw 
         * 
         * @protected 
         * @return {GroupElement}
         */
        this.draw = function() {
            return this.drawBubble(chart, brush, this.getXY());
        }

        /**
         * @method drawAnimate
         *
         * @protected
         */
        this.drawAnimate = function(root) {
            root.each(function(i, elem) {
                var c = elem.children[0];

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
            /** @cfg {Number} [min=5] Determines the minimum size of a bubble. */
            min: 5,
            /** @cfg {Number} [max=30] Determines the maximum size of a bubble.*/
            max: 30
        };
    }

	return BubbleBrush;
}, "chart.brush.core");