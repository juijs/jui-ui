jui.define("chart.brush.bargauge", ["util.math"], function(math) {

	var BarGaugeBrush = function(brush) {
		this.drawBefore = function(chart) {
			var width = chart.width(), height = chart.height();

			this.cut = brush.cut || 5; 

		}

		this.draw = function(chart) {

			var group = chart.svg.group({
				'class' : 'brush bar gauge'
			})

			group.translate(chart.x(), chart.y())
			
			var len = chart.data().length; 
			
			var unit = brush.size || 18;
			
			var max = chart.width() - 150;
			
			var y = 0; 
			var x = 0; 
			for(var i = 0, len = chart.data().length; i < len; i++) {
                var data = chart.data(i);
                
                var g = chart.svg.group({
                    'class' : 'bar'
                });
                
                g.append(chart.text({
                    x : x,
                    y : y+unit/2+this.cut,
                    "text-anchor" : "end",
                    fill : chart.theme.color(i)
                }, data[brush.title] || data.title || ""))
                
                var ex = (100 - data.value)  * max / 100;
                var value = (data.value)  * max / 100;
                
                g.append(chart.svg.rect({
                    x : x + this.cut,
                    y : y,
                    width: value,
                    height : unit,
                    fill : chart.theme.color(i)
                }))
                
                g.append(chart.svg.rect({
                    x : x + this.cut + value,
                    y : y,
                    width: ex,
                    height : unit,
                    fill : "#ececec"
                }))

                g.append(chart.text({
                    x : x + value + ex  + this.cut *2 ,
                    y : y + unit/2 + this.cut,
                    "text-anchor" : "start",
                    fill : chart.theme.color(i)
                }, data.value + "%"))
                
                group.append(g);
                
                y += unit + this.cut; 
			}

		}
	}

	return BarGaugeBrush;
}, "chart.brush");
