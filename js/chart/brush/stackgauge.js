jui.define("chart.brush.stackgauge", [ "util.math" ], function(math) {

	var StackGaugeBrush = function(chart, brush) {
        var w, centerX, centerY, outerRadius;

		this.drawBefore = function() {
			var width = chart.width(), height = chart.height();
			var min = width;

			if (height < min) {
				min = height;
			}

			w = min / 2;
			centerX = width / 2;
			centerY = height / 2;
			outerRadius = w;
		}

		this.draw = function() {
			var group = chart.svg.group({
				"class" : "brush donut"
			});
			
			for(var i = 0, len = chart.data().length; i < len; i++) {
				var rate = (chart.data(i)[brush.target] - brush.min) / (brush.max - brush.min),
                    currentAngle = (brush.endAngle) * rate,
                    innerRadius = outerRadius - brush.size + brush.cut;
				
				if (brush.endAngle >= 360) {
                    brush.endAngle = 359.99999;
				}
				
				// 빈 공간 그리기 
				var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle - currentAngle, {
					fill : chart.theme("gaugeBackgroundColor")
				});
	
				group.append(g);
				
				// 채워진 공간 그리기 
				g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle,{
					fill : chart.color(i, brush)
				}, true);
	
				group.append(g);
				
				// draw text 
				group.append(chart.text({
					x : centerX + 2,
					y : centerY + Math.abs(outerRadius) - 5,
					fill : chart.color(i, brush),
					"font-size" : "12px",
					"font-weight" : "bold"
				}, chart.data(i)[brush.title] || ""))
				
				outerRadius -= brush.size;
			}

            return group;
		}

        this.drawSetup = function() {
            return {
                min: 0,
                max: 100,
                cut: 5,
                size: 24,
                startAngle: -180,
                endAngle: 360,
                title: "title"
            }
        }
	}

	return StackGaugeBrush;
}, "chart.brush.donut");
