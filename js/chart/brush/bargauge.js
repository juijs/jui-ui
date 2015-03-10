jui.define("chart.brush.bargauge", [], function() {

    /**
     * @class chart.brush.bargauge 
     *
     * @extends chart.brush.core
     */
	var BarGaugeBrush = function(chart, axis, brush) {

        /**
         * @method draw
         * 
         * @protected
         * @return {TransformElement}
         */
		this.draw = function() {
            var group = chart.svg.group();

            var obj = axis.c(0),
                width = obj.width,
                x = obj.x,
                y = obj.y;

			this.eachData(function(i, data) {
                var g = chart.svg.group(),
                    v = this.getValue(data, "value", 0),
                    t = this.getValue(data, "title", ""),
                    max = this.getValue(data, "max", 100),
                    min = this.getValue(data, "min", 0);

                var value = (width / (max - min)) * v,
                    textY = (y + brush.size / 2 + brush.cut) - 1;

                g.append(chart.svg.rect({
                    x : x + brush.cut,
                    y : y,
                    width: width,
                    height : brush.size,
                    fill : chart.theme("bargaugeBackgroundColor")
                }));
                
                g.append(chart.svg.rect({
                    x : x,
                    y : y,
                    width: value,
                    height : brush.size,
                    fill : chart.color(i, brush)
                }));

                g.append(chart.text({
                    x : x + brush.cut,
                    y : textY,
                    "text-anchor" : "start",
                    "font-size" : chart.theme("bargaugeFontSize"),
                    fill : chart.theme("bargaugeFontColor")
                }, t));
                
                g.append(chart.text({
                    x : width - brush.cut,
                    y : textY,
                    "text-anchor" : "end",
                    "font-size" : chart.theme("bargaugeFontSize"),
                    fill : chart.theme("bargaugeFontColor")
                }, this.format(v, i)));

                this.addEvent(g, i, null);
                group.append(g);

                y += brush.size + brush.cut;
			});

            return group;
		}
	}

    BarGaugeBrush.setup = function() {
        return {
            /** @cfg {Number} [cut=5] Determines the spacing of a bar gauge. */
            cut: 5,
            /** @cfg {Number} [size=20] Determines the size of a bar gauge. */
            size: 20,
            /** @cfg {Function} [format=null] bar gauge format callback */
            format: null,

            max : 100,

            min : 0
        };
    }

	return BarGaugeBrush;
}, "chart.brush.core");
