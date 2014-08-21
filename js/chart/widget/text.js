jui.define("chart.widget.text", ["chart.util"], function(util) {

	var Widget = function(orient, widget) {
		var self = this;

		this.drawBefore = function(chart) {
			
		}

		this.draw = function(chart) {
			var width = chart.area('width'), height = chart.area('height');
			
			if (!widget.text) return; 

			if (orient == 'left') {
				var x = 10;
				var y = height/2 + chart.widget.size('top');
				
				chart.svg.text({x : x , y : y}, widget.text||"").rotate(-90, x, y);
				
			} else if (orient == 'right') {
				var x = chart.area('x2')+10;
				var y = height/2 + chart.widget.size('top');
				
				chart.svg.text({x : x , y : y}, widget.text||"").rotate(90, x, y);
			} else if (orient == 'top') {
				var x = width/2 + chart.widget.size('left');
				var y = 20;
				
				chart.svg.text({x : x , y : y}, widget.text||"");
			} else if (orient == 'bottom') {
				var x = width/2 +  chart.widget.size('left');
				var y = chart.area('y2') + chart.widget.size(orient);
				
				chart.svg.text({x : x , y : y}, widget.text||"");
			}
		}
	}

	return Widget;
}, "chart.widget");
