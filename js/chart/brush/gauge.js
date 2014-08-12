jui.define("chart.brush.gauge", [], function() {

	var Brush = function(brush) {
		this.drawBefore = function(chart) {
			this.empty = chart.get('empty') || 80; 

			
			var width = chart.area('width'), height = chart.area('height');
			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			this.rate = chart.get('rate') || 100; 
			this.w = min / 2;
			this.centerX = width/2;
			this.centerY = height/2;
			this.startY = -this.w / 1.5;
			this.startX = 0;
			this.outerRadius = Math.abs(this.startY);
			this.innerRadius = (this.rate == 0) ? 0 : (this.outerRadius/this.rate) * this.empty;
			
			
			this.startAngle = chart.get('startAngle') || -120;
			this.endAngle = chart.get('endAngle') || 240;
			
			this.min = chart.get('min') || 0;
			this.max = chart.get('max') || 100; 
			
			this.value = chart.get('value') || 0;			
			
		}
		
		this.drawText = function(chart, startAngle, endAngle, min, max, value) {
			var g = chart.svg.group({
				'class' : 'gauge text'
			})
			
			g.translate(this.centerX, this.centerY);
			
			// current Value 
			g.append(chart.svg.text({
				x : 0,
				y : 70,
				"text-anchor" : "middle",
				'font-family' : 'Verdana',
				'font-size' : '2.5em',
				'font-weight' : 1000 
				
			}, value+""))
			
			// 바깥 지름 부터 그림 
			var startX = 0;
			var startY = -(this.outerRadius);			
			
			// min 
			var obj = this.rotate(startX, startY, this.radian(startAngle));
			
			startX = obj.x;
			startY = obj.y;
			
			g.append(chart.svg.text({
				x : obj.x+20,
				y : obj.y+10,
				"text-anchor" : "middle",
				'font-family' : 'Verdana'
			}, min+""))

			// max
			// outer arc 에 대한 지점 설정 
		
			obj = this.rotate(startX, startY, this.radian(endAngle));

			g.append(chart.svg.text({
				x : obj.x-20,
				y : obj.y+10,
				"text-anchor" : "middle",
				'font-family' : 'Verdana'
			}, max+""))
			 
			
			return g; 
		}
		
		this.drawArrow = function(chart, startAngle, endAngle) {
			var g = chart.svg.group({
				'class' : 'gauge block'
			})

			g.translate(this.centerX, this.centerY);			
			
			// 바깥 지름 부터 그림 
			var startX = 0;
			var startY = -(this.outerRadius+5);
			
			
			var path = chart.svg.path({
				stroke : 'black',
				"stroke-width" : 0.2,
				'fill' : 'black'
			})
			
			path.MoveTo(startX, startY);
			path.LineTo(2, 0);
			path.LineTo(-2, 0);
			path.ClosePath();
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
				fill: 'black'
			}))
			
			g.append(chart.svg.circle({
				cx : 0,
				cy : 0,
				r : 2,
				fill: 'white'
			}))			

			
			return g; 			
		}
		
		this.drawDonut = function(chart, startAngle, endAngle, attr) {
			var g = chart.svg.group({
				'class' : 'gauge block'
			})
			
			
			g.translate(this.centerX, this.centerY);			
			
			var path = chart.svg.path(attr)
			
			// 바깥 지름 부터 그림 
			var startX = 0;
			var startY = -this.outerRadius;
			var rate = (this.innerRadius/this.outerRadius);
			
			var obj = this.rotate(startX, startY, this.radian(startAngle));
			
			startX = obj.x;
			startY = obj.y;
			
			// 시작 하는 위치로 옮김 
			path.MoveTo(startX, startY);
			
			// outer arc 에 대한 지점 설정 
			obj = this.rotate(startX, startY, this.radian(endAngle));
			
			// arc 그림
			path.Arc(this.outerRadius, this.outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y);
			
			var innerX, innerY;
			// inner arc 로 이어지는 직선 그림			
			if (obj.x >= 0 && obj.y >= 0) {
				innerX = Math.abs(obj.x) * rate;
				innerY = Math.abs(obj.y) * rate;				
			} else if (obj.x < 0 && obj.y >= 0) {
				innerX = -Math.abs(obj.x) * rate;
				innerY = Math.abs(obj.y) * rate;				  
			} else if (obj.x >= 0 && obj.y < 0) {
				innerX = Math.abs(obj.x) * rate;
				innerY = -Math.abs(obj.y) * rate;				  
			} else if (obj.x < 0 && obj.y < 0) {
				innerX = -Math.abs(obj.x) * rate;
				innerY = -Math.abs(obj.y) * rate;				  
			}
			 
			path.LineTo(innerX, innerY);
			
			// inner arc 도착점 그림 
			obj = this.rotate(innerX, innerY, this.radian(-endAngle));

			
			path.Arc(this.innerRadius, this.innerRadius, 0, (endAngle > 180) ? 1 : 0, 0, obj.x, obj.y);
			
			// 패스 종료 
			path.ClosePath();
			
			
			g.append(path);
			
			return g; 
		}
		
		this.radian = function(degree) {
			return degree * Math.PI / 180;
		}

		this.draw = function(chart) {
			
			var s = chart.series(brush.target[0]);
			var group = chart.svg.group({ 
				'class' : 'brush donut'
			})
			
			group.translate(chart.area('x'), chart.area('y'))
			
			
			var rate = this.value / (this.max - this.min);
			
			var currentAngle = (this.endAngle) * rate;

			var g = this.drawDonut(chart, this.startAngle, this.endAngle, {
				fill : this.color(6)
			})
			
			group.append(g);
			
			g = this.drawDonut(chart, this.startAngle, currentAngle, {
				fill : this.color(3)
			})							
			
			group.append(g);
			
			g = this.drawArrow(chart, this.startAngle, currentAngle)							
			
			group.append(g);
			
			g = this.drawText(chart, this.startAngle, this.endAngle, this.min, this.max, this.value);				
			
			group.append(g);		
		}
	}

	return Brush;
}, "chart.brush");
