jui.define("chart.brush.stackgauge", [ "util.math" ], function(math) {

	var StackGaugeBrush = function(brush) {
		this.drawBefore = function(chart) {
			var width = chart.width(), height = chart.height();
			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			this.w = min / 2;
			this.centerX = width / 2;
			this.centerY = height / 2;
			this.outerRadius = this.w;
			this.cut = brush.cut || 5; 
			this.size = brush.size || 24; 
			this.startAngle = brush.startAngle || -180;
			this.endAngle = brush.endAngle || 360;			


			this.min = typeof brush.min == 'undefined'  ? 0 : parseFloat(brush.min);
			this.max = typeof brush.max == 'undefined' ? 100 : parseFloat(brush.max);
		}

		this.draw = function(chart) {

			var s = chart.series(brush.target[0]);
			var group = chart.svg.group({
				'class' : 'brush donut'
			})

			group.translate(chart.area('x'), chart.area('y'))
			
			var outerRadius = this.outerRadius;
			for(var i = 0, len = chart.data().length; i < len; i++) {
				var rate = (chart.data(i)[brush.target] - this.min) / (this.max - this.min);
				var currentAngle = (this.endAngle) * rate;
				
				var innerRadius = outerRadius - this.size + this.cut;
				
				if (this.endAngle >= 360) {
				    this.endAngle = 359.99999;
				}
				
				// 빈 공간 그리기 
				var g = this.drawDonut(chart, this.centerX, this.centerY, innerRadius, outerRadius, this.startAngle + currentAngle, this.endAngle - currentAngle, {
					fill : chart.theme('gaugeBackgroundColor')
				})
	
				group.append(g);
				
				// 채워진 공간 그리기 
				g = this.drawDonut(chart, this.centerX, this.centerY, innerRadius, outerRadius, this.startAngle, currentAngle,{
					fill : chart.theme.color(i, brush.colors) 
				})
	
				group.append(g);
				
				// draw text 
				group.append(chart.text({
					x : this.centerX + 2,
					y : this.centerY + Math.abs(outerRadius) - 5,
					fill : chart.theme.color(i, brush.colors),
					'font-size' : '12px',
					'font-weight' : 'bold'
				}, chart.data(i)[brush.title]|| chart.data(i).title || ""))
				
				outerRadius -= this.size;
				
			}

		}
	}

	return StackGaugeBrush;
}, "chart.brush.donut");
