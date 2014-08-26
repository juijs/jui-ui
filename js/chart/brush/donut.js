jui.define("chart.brush.donut", [], function() {

	var DonutBrush = function(brush) {
		this.drawBefore = function(chart) {
			this.size = brush.size || 50;

			var width = chart.area('width'), height = chart.area('height');
			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			this.w = min / 2;
			this.centerX = width / 2;
			this.centerY = height / 2;
			this.startY = -this.w;
			this.startX = 0;
			this.outerRadius = brush.outerRadius || Math.abs(this.startY);
			this.innerRadius = this.outerRadius - this.size;
		}

		this.drawDonut = function(chart, centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, attr) {
			var g = chart.svg.group({
				'class' : 'donut'
			});

			var path = chart.svg.path(attr);

			// 바깥 지름 부터 그림
			var obj = this.rotate(0, -outerRadius, this.radian(startAngle));

			var startX = obj.x;
			var startY = obj.y;
			
			var innerCircle = this.rotate(0, -innerRadius, this.radian(startAngle));
			
			var startInnerX = innerCircle.x;
			var startInnerY = innerCircle.y;
			
			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = this.rotate(startX, startY, this.radian(endAngle));

			// inner arc 에 대한 지점 설정 			
			innerCircle = this.rotate(startInnerX, startInnerY, this.radian(endAngle));
			
			// 중심점 이동 
			g.translate(centerX, centerY);

			// outer arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y);

			// 라인 긋기 
			path.LineTo(innerCircle.x, innerCircle.y);

			// inner arc 그리기 
			path.Arc(innerRadius, innerRadius, 0, (endAngle > 180) ? 1 : 0, 0, startInnerX, startInnerY);
			

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

			var all = 360;
			var startAngle = 0;

			var max = 0;
			for (var i = 0; i < s.data.length; i++) {
				max += s.data[i];
			}

			for (var i = 0; i < s.data.length; i++) {
				
				//if (i != 1) continue;
				
				var data = s.data[i];
				var endAngle = all * (data / max);

				var g = this.drawDonut(chart, this.centerX, this.centerY, this.innerRadius, this.outerRadius, startAngle, endAngle, {
					fill : chart.theme.color(i),
					stroke : chart.theme('pieBorderColor'),
					"stroke-width" : chart.theme('gridActiveBorderWidth') 
				});

				group.append(g);

				startAngle += endAngle;
			}
		}
	}

	return DonutBrush;
}, "chart.brush");
