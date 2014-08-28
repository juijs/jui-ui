jui.define("chart.widget.text", [], function() {

	var Widget = function(orient, widget) {
		var self = this;

		this.drawBefore = function(chart) {
			
		}

		this.draw = function(chart) {
			var width = chart.width(), height = chart.height();
			
			if (!widget.text) return; 

			if (orient == 'left') {
				var x = 10;
				var y = height/2 + chart.widget.size('top');
				
				chart.svg.text({x : x , y : y}, widget.text||"").rotate(-90, x, y);
				
			} else if (orient == 'right') {
				var x = chart.x2()+10;
				var y = height/2 + chart.widget.size('top');
				
				chart.svg.text({x : x , y : y}, widget.text||"").rotate(90, x, y);
			} else if (orient == 'top') {
				var x = width/2 + chart.widget.size('left');
				var y = 20;
				
				chart.svg.text({x : x , y : y}, widget.text||"");
			} else if (orient == 'bottom') {
				var x = width/2 +  chart.widget.size('left');
				var y = chart.y2() + chart.widget.size(orient);
				
				chart.svg.text({x : x , y : y}, widget.text||"");
			}
		}
	}

	return Widget;
}, "chart.widget");
