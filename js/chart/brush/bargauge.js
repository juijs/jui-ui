jui.define("chart.brush.bargauge", [], function() {

	var BarGaugeBrush = function(chart, axis, brush) {

        this.drawBefore = function() {
            if (!axis.c) {
                axis.c = function() {
                    return {
                        x : 0,
                        y : 0,
                        width : chart.area('width'),
                        height : chart.area('height')
                    };
                }
            }
        }

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
                var g = chart.svg.group({
                    "class" : "bar"
                });
                
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
            cut: 5,
            size: 20,
            split: false,
            align: "left",
            title: "title"
        };
    }

	return BarGaugeBrush;
}, "chart.brush.core");
