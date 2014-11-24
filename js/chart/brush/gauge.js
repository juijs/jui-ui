jui.define("chart.brush.gauge", [ "util.math" ], function(math) {

	var GaugeBrush = function(chart, brush) {
        var w, centerX, centerY, outerRadius, innerRadius;

        function createText(startAngle, endAngle, min, max, value) {
			var g = chart.svg.group({
				"class" : "gauge text"
			}).translate(centerX, centerY);

			g.append(chart.svg.text({
				x : 0,
				y : (brush.arrow) ? 70 : 10,
				"text-anchor" : "middle",
				"font-family" : chart.theme("fontFamily"),
				"font-size" : "3em",
				"font-weight" : 1000,
				"fill" : chart.color(0, brush)
			}, value + ""));

			if (brush.unitText != "") {
				g.append(chart.text({
					x : 0,
					y : 100,
					"text-anchor" : "middle",
                    "font-family" : chart.theme("fontFamily"),
					"font-size" : "1.5em",
					"font-weight" : 500,
					"fill" : chart.theme("gaugeFontColor")
				}, brush.unitText))
			}

			// 바깥 지름 부터 그림
			var startX = 0;
			var startY = -outerRadius;

            // min
            var obj = math.rotate(startX, startY, math.radian(startAngle));

            startX = obj.x;
            startY = obj.y;

            g.append(chart.text({
                x : obj.x + 30,
                y : obj.y + 20,
                "text-anchor" : "middle",
                "font-family" : chart.theme("fontFamily"),
				"fill" : chart.theme("gaugeFontColor")
            }, min + ""));

			// max
			// outer arc 에 대한 지점 설정
            var obj = math.rotate(startX, startY, math.radian(endAngle));
    
            g.append(chart.text({
                x : obj.x - 20,
                y : obj.y + 20,
                "text-anchor" : "middle",
                "font-family" : chart.theme("fontFamily"),
				"fill" : chart.theme("gaugeFontColor")
            }, max + ""));

			return g;
		}

        function createArrow(startAngle, endAngle) {
			var g = chart.svg.group({
				"class" : "gauge block"
			}).translate(centerX, centerY);

			// 바깥 지름 부터 그림
			var startX = 0;
			var startY = -(outerRadius + 5);

			var path = chart.svg.path({
				stroke : chart.theme("gaugeArrowColor"),
				"stroke-width" : 0.2,
				"fill" : chart.theme("gaugeArrowColor")
			});

			path.MoveTo(startX, startY);
			path.LineTo(5, 0);
			path.LineTo(-5, 0);
			path.ClosePath();

			// start angle
			path.rotate(startAngle);
			g.append(path)
			path.rotate(endAngle + startAngle);

			g.append(chart.svg.circle({
				cx : 0,
				cy : 0,
				r : 5,
				fill : chart.theme("gaugeArrowColor")
			}));

			g.append(chart.svg.circle({
				cx : 0,
				cy : 0,
				r : 2,
				fill : chart.theme("gaugeArrowColor")
			}));

			return g;
		}

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
            innerRadius = outerRadius - brush.size;
        }

		this.draw = function() {
			var group = chart.svg.group({
				"class" : "brush gauge"
			});

			var rate = (brush.value - brush.min) / (brush.max - brush.min),
                currentAngle = (brush.endAngle) * rate;
			
			if (brush.endAngle >= 360) {
                brush.endAngle = 359.99999;
			}
			
			var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle - currentAngle, {
				fill : chart.theme("gaugeBackgroundColor")
			});

			group.append(g);

			g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle, {
				fill : chart.color(0, brush)
			});

			group.append(g);

            if (brush.arrow) {
                g = createArrow(brush.startAngle, currentAngle);
                group.append(g);
            }

            // startAngle, endAngle 에 따른 Text 위치를 선정해야함
            g = createText(brush.startAngle, brush.endAngle, brush.min, brush.max, brush.value);
            group.append(g);

            return group;
		}

        this.drawSetup = function() {
            return {
                min: 0,
                max: 100,
                value: 0,
                size: 60,
                startAngle: 0,
                endAngle: 360,
                arrow: true,
                unitText: ""
            }
        }
	}

	return GaugeBrush;
}, "chart.brush.donut");
