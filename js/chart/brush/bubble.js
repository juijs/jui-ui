jui.define("chart.brush.bubble", [], function() {

    /**
     * @class chart.brush.bubble 
     *
     * @extends chart.brush.core
     */
	var BubbleBrush = function() {
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
        this.createBubble = function(pos, color) {
            var radius = this.getScaleValue(pos.value, this.axis.y.min(), this.axis.y.max(), this.brush.min, this.brush.max),
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

        /**
         * @method drawBubble 
         * 
         * @protected  
         * @param {chart.builder} chart
         * @param {Object} brush
         * @param {Array} points
         * @return {GroupElement}
         */
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

        /**
         * @method draw 
         * 
         * @protected 
         * @return {GroupElement}
         */
        this.draw = function() {
            return this.drawBubble(this.getXY());
        }

        /**
         * @method drawAnimate
         *
         * @protected
         */
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