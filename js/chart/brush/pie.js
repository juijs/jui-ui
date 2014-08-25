jui.define("chart.brush.pie", [], function() {

	var Brush = function(brush) {
		this.drawBefore = function(chart) {
			this.innerCut = brush.innerCut || 1;

			var width = chart.area('width'), height = chart.area('height');
			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			this.rate = brush.rate || 100;
			this.w = min / 2;
			this.centerX = width / 2;
			this.centerY = height / 2;
			this.startY = -this.w;
			this.startX = 0;
			this.outerRadius = brush.outerRadius || Math.abs(this.startY);
			this.innerRadius = 0;
		}

		this.drawDonut = function(chart, centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, innerCut, attr) {
			var g = chart.svg.group({
				'class' : 'donut'
			});

			var path = chart.svg.path(attr);

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

			var cobj = this.rotate(startX, startY, this.radian(endAngle / 2));

			g.translate(centerX, centerY);

			// arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y);

			// inner arc 로 이어지는 직선 그림
			if (obj.x >= 0 && obj.y >= 0) {
				var innerX = Math.abs(obj.x) * rate;
				var innerY = Math.abs(obj.y) * rate;
			} else if (obj.x < 0 && obj.y > 0) {
				var innerX = -Math.abs(obj.x) * rate;
				var innerY = Math.abs(obj.y) * rate;
			} else if (obj.x > 0 && obj.y < 0) {
				var innerX = Math.abs(obj.x) * rate;
				var innerY = -Math.abs(obj.y) * rate;
			} else if (obj.x < 0 && obj.y < 0) {
				var innerX = -Math.abs(obj.x) * rate;
				var innerY = -Math.abs(obj.y) * rate;
			}

			path.LineTo(innerX, innerY);

			// inner arc 도착점 그림
			obj = this.rotate(innerX, innerY, this.radian(-endAngle));

			path.Arc(innerRadius, innerRadius, 0, (endAngle > 180) ? 1 : 0, 0, obj.x, obj.y);

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
				var data = s.data[i];
				var endAngle = all * (data / max);

				var cut = this.innerCut;

				var g = this.drawDonut(chart, this.centerX, this.centerY, this.innerRadius, this.outerRadius, startAngle, endAngle, cut, {
					fill : chart.theme.color(i),
					stroke : chart.theme('pieBorderColor'),
					"stroke-width" : chart.theme('gridActiveBorderWidth') 
				});

				group.append(g);

				startAngle += endAngle;
			}
		}
	}

	return Brush;
}, "chart.brush");
