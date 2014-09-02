jui.define("chart.brush.bargauge", [ "util.math" ], function(math) {

	var BarGaugeBrush = function(brush) {
<<<<<<< HEAD
		this.drawBefore = function(chart) {
			var width = chart.width(), height = chart.height();

			this.cut = brush.cut || 5; 
			this.align = brush.align || 'left';

		}

		this.draw = function(chart) {
=======
        var cut = brush.cut || 5;
>>>>>>> fd3e1d047a15749e318125ef7268e7ca372f1adb

        this.draw = function(chart) {
			var group = chart.svg.group({
				'class' : 'brush bar gauge'
			})

			group.translate(chart.x(), chart.y())
			
			var len = chart.data().length; 
			
			var unit = brush.size || 20;
			
			if (brush.split) {
				var max = chart.width();	
			} else {
				var max = chart.width();
			}
			
			
			var y = 0; 
			var x = 0; 
			for(var i = 0, len = chart.data().length; i < len; i++) {
                var data = chart.data(i);
                
                var g = chart.svg.group({
                    'class' : 'bar'
                });
                
                g.append(chart.text({
                    x : x,
                    y : y + unit / 2 + cut,
                    "text-anchor" : "end",
                    fill : chart.theme.color(i)
                }, data[brush.title] || data.title || ""))
                
                g.append(chart.svg.rect({
                    x : x + cut,
                    y : y,
                    width: max,
                    height : unit,
                    fill : "#ececec"
                }))
                
                var value = (data.value)  * max / 100;
                var ex = (100 - data.value)  * max / 100;
                
                var startX = x + this.cut; 
                
                if (this.align == 'center') {
                	startX += (max/2 - value/2);
                } else if (this.align == 'right') {
                	startX += max - value; 
                }
                
                g.append(chart.svg.rect({
<<<<<<< HEAD
                    x : startX,
=======
                    x : x + cut + value,
>>>>>>> fd3e1d047a15749e318125ef7268e7ca372f1adb
                    y : y,
                    width: value,
                    height : unit,
                    fill : chart.theme.color(i)
                }))
                
                
                if (brush.split) {
                	var textX = x + value + this.cut*2 + ex;
                	var textAlign = "start";
                	var textColor = chart.theme.color(i);
                } else {
                	
                	var textX = x + this.cut * 2;
                	var textAlign = "start";
                	var textColor = "white";                	
                	
                	if (this.align == 'center') {
                		textX = x + this.cut + max / 2;
                		textAlign = "middle";
                	} else if (this.align == 'right') {
                		textX = x + max;
                		textAlign = "end";                		
                	}

                }
                
                g.append(chart.text({
<<<<<<< HEAD
                    x : textX,
                    y : y + unit/2 + this.cut,
                    "text-anchor" : textAlign,
                    fill : textColor,
                }, brush.format ? brush.format(data.value) : data.value + "%"))
=======
                    x : (brush.split) ? (x + cut + value - 1)  : (x + value + ex + cut * 2),
                    y : y + unit/2 + cut,
                    "text-anchor" : (brush.split) ? "end" : "start",
                    fill : (brush.split) ? 'white' : chart.theme.color(i)
                }, data.value + "%"))
>>>>>>> fd3e1d047a15749e318125ef7268e7ca372f1adb
                
                group.append(g);
                
                y += unit + cut;
			}
		}
	}

	return BarGaugeBrush;
}, "chart.brush.core");
