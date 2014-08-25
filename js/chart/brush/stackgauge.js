jui.define("chart.brush.stackgauge", [], function() {

	var Brush = function(brush) {
		this.drawBefore = function(chart) {
			var width = chart.area('width'), height = chart.area('height');
			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			this.rate = 100;
			this.w = min / 2;
			this.centerX = width / 2;
			this.centerY = height / 2;
			this.startY = -this.w;
			this.startX = 0;
			this.outerRadius = this.w;
			this.cut = 5; 
			this.size = 24; 
			this.startAngle = -180;
			this.endAngle = 360;			


			this.min = typeof brush.min == 'undefined'  ? 0 : parseFloat(brush.min);
			this.max = typeof brush.max == 'undefined' ? 100 : parseFloat(brush.max);
		}

		this.drawDonut = function(chart, startAngle, endAngle, outerRadius, attr) {
			
			var g = chart.svg.group();

			innerRadius = outerRadius - (this.size - this.cut) ;

			g.translate(this.centerX, this.centerY);

			var path = chart.svg.path(attr)
			
			// 바깥 지름 부터 그림
			var startX = 0;
			var startY = -outerRadius;
			var rate = (innerRadius / outerRadius);

			var obj = this.rotate(startX, startY, this.radian(startAngle));

			startX = obj.x;
			startY = obj.y;

			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = this.rotate(startX, startY, this.radian(endAngle));

			// arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle >= 180) ? 1 : 0, 1, obj.x, obj.y);


			var innerX, innerY;
			var r = rate;
			// inner arc 로 이어지는 직선 그림
			if (obj.x >= 0 && obj.y >= 0) {
				innerX = Math.abs(obj.x) * r;  
				innerY = Math.abs(obj.y) * r;
			} else if (obj.x < 0 && obj.y >= 0) {
				innerX = -Math.abs(obj.x) * r;
				innerY = Math.abs(obj.y) * r;
			} else if (obj.x >= 0 && obj.y < 0) {
				innerX = Math.abs(obj.x) * r;
				innerY = -Math.abs(obj.y) * r;
			} else if (obj.x < 0 && obj.y < 0) {
				innerX = -Math.abs(obj.x) * r;
				innerY = -Math.abs(obj.y) * r;
			}

			path.LineTo(innerX, innerY);

			// inner arc 도착점 그림
			obj = this.rotate(innerX, innerY, this.radian(-endAngle));

			path.Arc(innerRadius, innerRadius, 0, (endAngle >= 180) ? 1 : 0, 0, obj.x, obj.y);

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
			
			var outerRadius = this.outerRadius;
			for(var i = 0, len = chart.data().length; i < len; i++) {
				var rate = (chart.data(i)[brush.target] - this.min) / (this.max - this.min);
				var currentAngle = (this.endAngle) * rate;
				
				if (this.endAngle >= 360) {
				    this.endAngle = 359.99999;
				}
				
				var g = this.drawDonut(chart, this.startAngle + currentAngle, this.endAngle - currentAngle, outerRadius, {
					fill : chart.theme('gaugeBackgroundColor')
				})
	
				group.append(g);
				
				g = this.drawDonut(chart, this.startAngle, currentAngle, outerRadius, {
					fill : chart.theme.color(i) 
				})
	
				group.append(g);
				
				// draw text 
				group.append(chart.text({
					x : this.centerX + 2,
					y : this.centerY + Math.abs(outerRadius) - 5,
					fill : chart.theme.color(i),
					'font-size' : '12px',
					'font-weight' : 'bold'
				}, chart.data(i)[brush.title]|| chart.data(i).title || ""))
				
				outerRadius -= this.size;

				
			}

		}
	}

	return Brush;
}, "chart.brush");
