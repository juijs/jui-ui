jui.define("chart.brush.donut", [ "util.math" ], function(math) {

	var DonutBrush = function() {
        var w, centerX, centerY, startY, startX, outerRadius, innerRadius;

		this.drawDonut = function(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, attr, hasCircle) {
		    
		    hasCircle = hasCircle || false; 
		    
		    var dist = Math.abs(outerRadius - innerRadius);
		    
			var g = this.chart.svg.group({
				"class" : "donut"
			});

			var path = this.chart.svg.path(attr);

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle));

			var startX = obj.x;
			var startY = obj.y;
			
			var innerCircle = math.rotate(0, -innerRadius, math.radian(startAngle));
			
			var startInnerX = innerCircle.x;
			var startInnerY = innerCircle.y;
			
			
			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			// inner arc 에 대한 지점 설정 			
			innerCircle = math.rotate(startInnerX, startInnerY, math.radian(endAngle));

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

            if (hasCircle) {
                var centerCircle = math.rotate(0, -innerRadius - dist/2, math.radian(startAngle)),
					cX = centerCircle.x,
					cY = centerCircle.y,
					centerCircleLine = math.rotate(cX, cY, math.radian(endAngle));
    
                var circle = this.chart.svg.circle({
                    cx : centerCircleLine.x,
                    cy : centerCircleLine.y,
                    r : dist/2,
                    fill  : attr.fill
                });
                
                g.append(circle);
    
                var circle2 = this.chart.svg.circle({
                    cx : centerCircleLine.x,
                    cy : centerCircleLine.y,
                    r : 3,
                    fill  : "white"
                });
                
                g.append(circle2);
            }

			return g;
		}

        this.drawBefore = function() {
            var width = this.chart.width(),
                height = this.chart.height(),
                min = width;

            if (height < min) {
                min = height;
            }

            // center
            w = min / 2;
            centerX = width / 2;
            centerY = height / 2;
            startY = -w;
            startX = 0;
            outerRadius = Math.abs(startY);
            innerRadius = outerRadius - this.brush.size;
        }

		this.draw = function() {
			var group = this.chart.svg.group({
				"class" : "brush donut"
			});

			var target = this.brush.target,
				data = this.chart.data(0);

			var all = 360,
				startAngle = 0,
				max = 0;

			for (var i = 0; i < target.length; i++) {
				max += data[target[i]];
			}

			for (var i = 0; i < target.length; i++) {
				var value = data[target[i]],
					endAngle = all * (value / max);

				var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, {
					fill : this.chart.color(i, this.brush),
					stroke : this.chart.theme("donutBorderColor"),
					"stroke-width" : this.chart.theme("donutBorderWidth")
				});

                this.addEvent(g, i, 0);
				group.append(g);

				startAngle += endAngle;
			}

            return group;
		}

        this.drawSetup = function() {
            return {
                size: 50
            }
        }
	}

	return DonutBrush;
}, "chart.brush.core");
