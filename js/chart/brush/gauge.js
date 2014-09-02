jui.define("chart.brush.gauge", [ "util.math" ], function(math) {

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
			g.append(chart.svg.text({
				x : 0,
				y : (brush.arrow) ? 70 : 10,
				"text-anchor" : "middle",
				'font-family' : 'Verdana',
				'font-size' : '3em',
				'font-weight' : 1000

			}, value + ""))
			
			if (brush.unitText) {
				// current Value
				g.append(chart.text({
					x : 0,
					y : 100,
					"text-anchor" : "middle",
					'font-size' : '1.5em',
					'font-weight' : 500
				}, brush.unitText))
	
			}			

			// 바깥 지름 부터 그림
			var startX = 0;
			var startY = -(this.outerRadius);


            // min
            var obj = math.rotate(startX, startY, math.radian(startAngle));

            startX = obj.x;
            startY = obj.y;

            g.append(chart.text({
                x : obj.x + 30,
                y : obj.y + 20,
                "text-anchor" : "middle",
                'font-family' : 'Verdana'
            }, min + ""))

			// max
			// outer arc 에 대한 지점 설정

            var obj = math.rotate(startX, startY, math.radian(endAngle));
    
            g.append(chart.text({
                x : obj.x - 20,
                y : obj.y + 20,
                "text-anchor" : "middle",
                'font-family' : 'Verdana'
            }, max + ""))


			return g;
		}

		this.drawArrow = function(chart, startAngle, endAngle) {
			var g = chart.svg.group({
				'class' : 'gauge block'
			})

			g.translate(this.centerX, this.centerY);

			// 바깥 지름 부터 그림
			var startX = 0;
			var startY = -(this.outerRadius + 5);

			var path = chart.svg.path({
				stroke : 'black',
				"stroke-width" : 0.2,
				'fill' : 'black'
			})

			path.MoveTo(startX, startY);
			path.LineTo(5, 0);
			path.LineTo(-5, 0);
			path.ClosePath();

			// start angle
			path.rotate(startAngle);
			g.append(path)

			//console.log(startAngle, endAngle + startAngle);
			path.rotate(endAngle + startAngle);

			g.append(chart.svg.circle({
				cx : 0,
				cy : 0,
				r : 5,
				fill : 'black'
			}))

			g.append(chart.svg.circle({
				cx : 0,
				cy : 0,
				r : 2,
				fill : 'black'
			}))

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
				fill : chart.theme.color(0, brush.colors) 
			})

			group.append(g);

            if (brush.arrow) {
                g = this.drawArrow(chart, this.startAngle, currentAngle)
    
                group.append(g);
                
            }

            // startAngle, endAngle 에 따른 Text 위치를 선정해야함
            g = this.drawText(chart, this.startAngle, this.endAngle, this.min, this.max, this.value);
            group.append(g);                

		}
	}

	return GaugeBrush;
}, "chart.brush.donut");
