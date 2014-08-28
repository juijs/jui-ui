jui.define("chart.brush.pie", ["util.math"], function(math) {

	var PieBrush = function(brush) {
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
			this.outerRadius = brush.outerRadius || this.w;
		}

		this.drawDonut = function(chart, centerX, centerY, outerRadius, startAngle, endAngle, attr) {
			var g = chart.svg.group({
				'class' : 'donut'
			});

			var path = chart.svg.path(attr);

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle));

			var startX = obj.x;
			var startY = obj.y;
			
			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			g.translate(centerX, centerY);

			// arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y);

			path.LineTo(0, 0);

			// 패스 종료
			path.ClosePath();

			g.append(path);

			return g;
		}

		this.draw = function(chart) {

			var s = chart.series(brush.target[0]);
			var group = chart.svg.group({
				'class' : 'brush donut'
			})

			group.translate(chart.x(), chart.y())

			var all = 360;
			var startAngle = 0;

			var max = 0;
			for (var i = 0; i < s.data.length; i++) {
				max += s.data[i];
			}

			for (var i = 0; i < s.data.length; i++) {
				var data = s.data[i];
				var endAngle = all * (data / max);

				var g = this.drawDonut(chart, this.centerX, this.centerY, this.outerRadius, startAngle, endAngle, {
					fill : chart.theme.color(i),
					stroke : chart.theme('pieBorderColor'),
					"stroke-width" : chart.theme('pieBorderWidth')
				});

				group.append(g);

				startAngle += endAngle;
			}
		}
	}

	return PieBrush;
}, "chart.brush");
