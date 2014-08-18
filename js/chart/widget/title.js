jui.define("chart.widget.title", ["chart.util"], function(util) {

	var Widget = function(orient, widget) {
		var self = this;

		this.drawBefore = function(chart) {
			
		}

		this.draw = function(chart) {
			var width = chart.area('width'), height = chart.area('height');
			var widget = chart.widget(orient);
			
			if (!widget.title) return; 

			if (orient == 'left') {
				var x = 10;
				var y = height/2 + chart.widget('top').size;
				
				chart.svg.text({x : x , y : y}, widget.title||"").rotate(-90, x, y);
				
			} else if (orient == 'right') {
				var x = chart.area('x2')+10;
				var y = height/2 + chart.widget('top').size;
				
				chart.svg.text({x : x , y : y}, widget.title||"").rotate(90, x, y);
			} else if (orient == 'top') {
				var x = width/2 + chart.widget('left').size;
				var y = 20;
				
				chart.svg.text({x : x , y : y}, widget.title||"");
			} else if (orient == 'bottom') {
				var x = width/2 +  chart.widget('left').size;
				var y = chart.area('y2') + widget.size;
				
				chart.svg.text({x : x , y : y}, widget.title||"");
			}
		}
	}

	return Widget;
}, "chart.widget");
