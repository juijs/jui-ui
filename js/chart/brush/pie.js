jui.define("chart.brush.pie", [ "util.math" ], function(math) {

	var PieBrush = function(chart, brush) {
        var w, centerX, centerY, outerRadius;

		this.drawPie = function(chart, centerX, centerY, outerRadius, startAngle, endAngle, attr) {
			var g = chart.svg.group({
				"class" : "pie"
			});

			var path = chart.svg.path(attr);

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle));

			var startX = obj.x,
                startY = obj.y;
			
			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			g.translate(centerX, centerY);

			// arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y);
			path.LineTo(0, 0);
			path.ClosePath();

			g.append(path);

			return g;
		}

        this.drawBefore = function() {
			if (!brush.c) {
				brush.c = function(i) {
					return {
						x : 0,
						y : 0,
						width : chart.area('width'),
						height : chart.area('height')
					};
				}
			}
        }

		this.drawUnit = function(index, data, group) {
			var obj = brush.c(index);

			var width = obj.width, height = obj.height;
			var x = obj.x, y = obj.y;
			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			w = min / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w;

			var target = brush.target,
				all = 360,
				startAngle = 0,
				max = 0;

			for (var i = 0; i < target.length; i++) {
				max += data[target[i]];
			}

			for (var i = 0; i < target.length; i++) {
				var value = data[target[i]],
					endAngle = all * (value / max);

				var g = this.drawPie(chart, centerX, centerY, outerRadius, startAngle, endAngle, {
					fill : this.getColor(i),
					stroke : chart.theme("pieBorderColor"),
					"stroke-width" : chart.theme("pieBorderWidth")
				});

				this.addEvent(g, index, i);
				group.append(g);

				startAngle += endAngle;
			}
		}

		this.draw = function() {
			var group = chart.svg.group({
				"class" : "brush donut"
			});

			this.eachData(function(i, data) {
				this.drawUnit(i, data, group);
			});

            return group;
		}

        this.drawSetup = function() {
			return this.getOptions();
        }
	}

	return PieBrush;
}, "chart.brush.core");
