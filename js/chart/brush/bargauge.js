jui.define("chart.brush.bargauge", [], function() {

    /**
     * @class chart.brush.bargauge 
     *
     * @extends chart.brush.core
     */
	var BarGaugeBrush = function(chart, axis, brush) {

        /**
         * @method drawBefore
         * 
         * @protected
         */
        this.drawBefore = function() {

        }

        /**
         * @method draw
         * 
         * @protected
         * @return {TransformElement}
         */
		this.draw = function() {
            var obj = axis.c(),
                width = obj.width,
                x = obj.x,
                y = obj.y;

			var group = chart.svg.group();

			if (brush.split) {
				var max = width;
			} else {
				var max = width;
			}

			this.eachData(function(i, data) {
                var g = chart.svg.group();
                
                g.append(chart.text({
                    x : x,
                    y : y + brush.size / 2 + brush.cut,
                    "text-anchor" : "end",
                    fill : this.color(i)
                }, data[brush.title] || ""))
                
                g.append(chart.svg.rect({
                    x : x + brush.cut,
                    y : y,
                    width: max,
                    height : brush.size,
                    fill : chart.theme("gaugeBackgroundColor")
                }));
                
                var value = (data.value)  * max / 100,
                    ex = (100 - data.value)  * max / 100,
                    startX = x + brush.cut;
                
                if (brush.align == "center") {
                	startX += (max/2 - value/2);
                } else if (brush.align == "right") {
                	startX += max - value; 
                }
                
                g.append(chart.svg.rect({
                    x : startX,
                    y : y,
                    width: value,
                    height : brush.size,
                    fill : chart.color(i, brush)
                }));

                if (brush.split) {
                	var textX = x + value + brush.cut * 2 + ex,
                        textAlign = "start",
                        textColor = chart.color(i, brush);
                } else {
                	var textX = x + brush.cut * 2,
                        textAlign = "start",
                        textColor = "white";
                	
                	if (this.align == "center") {
                		textX = x + brush.cut + max / 2;
                		textAlign = "middle";
                	} else if (brush.align == "right") {
                		textX = x + max;
                		textAlign = "end";                		
                	}
                }
                
                g.append(chart.text({
                    x : textX,
                    y : y + brush.size / 2 + brush.cut,
                    "text-anchor" : textAlign,
                    fill : textColor
                }, brush.format ? brush.format(data.value) : data.value + "%"))

                this.addEvent(g, i, null);
                group.append(g);
                
                y += brush.size + brush.cut;
			});

            return group;
		}
	}

    BarGaugeBrush.setup = function() {
        return {
            /** @cfg {Number} [cut=5] bar gauge item padding */
            cut: 5,
            /** @cfg {Number} [size=20]  bar gauge item height */
            size: 20,
            /** @cfg {Boolean} [split=false] */
            split: false,
            /** @cfg {String} [align=left] bar gauge align  */
            align: "left",
            /** @cfg {String} [title=title]  a field for title */
            title: "title"
        };
    }

	return BarGaugeBrush;
}, "chart.brush.core");
