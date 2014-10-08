jui.define("chart.brush.fullgauge", ["util.math"], function(math) {

	var GaugeBrush = function(brush) {
		this.drawBefore = function(chart) {

			var width = chart.width(), height = chart.height();
			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			this.rate = typeof brush.rate == 'undefined' ? 100 : parseInt(brush.rate);
			this.w = min / 2;
			this.centerX = width / 2;
			this.centerY = height / 2;
			this.size = brush.size || 60;
			//this.startY = -this.w;
			//this.startX = 0;
			this.outerRadius = this.w;
			this.innerRadius = this.outerRadius - this.size;

			this.startAngle = typeof brush.startAngle == 'undefined' ? 0 : parseFloat(brush.startAngle);
			this.endAngle = typeof brush.endAngle == 'undefined' ? 360 : parseFloat(brush.endAngle);

			this.min = typeof brush.min == 'undefined'  ? 0 : parseFloat(brush.min);
			this.max = typeof brush.max == 'undefined' ? 100 : parseFloat(brush.max);

			this.value = typeof brush.value == 'undefined' ? 0 : brush.value;

		}

		this.drawText = function(chart, startAngle, endAngle, min, max, value) {
			var g = chart.svg.group({
				'class' : 'gauge text'
			})

			g.translate(this.centerX, this.centerY);

			// current Value
			if (brush.text) {
				g.append(chart.svg.text({
					x : 0,
					y : 10,
					"text-anchor" : "middle",
					'font-family' : 'Verdana',
					'font-size' : '3.5em',
					'font-weight' : 1000
	
				}, value + ""))
				
			}
			
			if (brush.unitText) {
				// current Value
				g.append(chart.text({
					x : 0,
					y : 40,
					"text-anchor" : "middle",
					'font-size' : '2em',
					'font-weight' : 500
				}, brush.unitText))
	
			}			

			return g;
		}

		this.draw = function(chart) {

			var s = chart.series(brush.target[0]);
			var group = chart.svg.group({
				'class' : 'brush donut'
			})

			group.translate(chart.x(), chart.y())

			var rate = (this.value - this.min) / (this.max - this.min);

			var currentAngle = (this.endAngle) * rate;
			
			if (this.endAngle >= 360) {
			    this.endAngle = 359.99999;
			}
			
			var g = this.drawDonut(chart, this.centerX, this.centerY, this.innerRadius, this.outerRadius, this.startAngle + currentAngle, this.endAngle - currentAngle, {
				fill : chart.theme('gaugeBackgroundColor')
			})

			group.append(g);

			g = this.drawDonut(chart, this.centerX, this.centerY, this.innerRadius, this.outerRadius, this.startAngle, currentAngle, {
				fill : chart.color(0, brush.colors)
			})

			group.append(g);


            // startAngle, endAngle 에 따른 Text 위치를 선정해야함
            g = this.drawText(chart, this.startAngle, this.endAngle, this.min, this.max, this.value);
            group.append(g);                

            return group;
		}
	}

	return GaugeBrush;
}, "chart.brush.donut");
