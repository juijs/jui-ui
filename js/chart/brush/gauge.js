jui.define("chart.brush.gauge", [ "util.math" ], function(math) {

	var GaugeBrush = function(chart, axis, brush) {
		var self = this;
        var w, centerX, centerY, outerRadius, innerRadius;

        function createText(startAngle, endAngle, min, max, value, unit) {
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
				"fill" : self.color(0)
			}, value + ""));

			if (unit != "") {
				g.append(chart.text({
					x : 0,
					y : 100,
					"text-anchor" : "middle",
                    "font-family" : chart.theme("fontFamily"),
					"font-size" : "1.5em",
					"font-weight" : 500,
					"fill" : chart.theme("gaugeFontColor")
				}, unit))
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

        this.drawBefore = function() {

        }

		this.drawUnit = function(index, data, group) {
			var obj = axis.c(index),
				value = (data[this.brush.target] || data.value) || 0,
				max = (data[this.brush.max] || data.max) || 100,
				min = (data[this.brush.min] || data.min) || 0,
				unit = (data[this.brush.unit] || data.unit) || "";


			var rate = (value - min) / (max - min),
				currentAngle = brush.endAngle * rate;

			if (brush.endAngle >= 360) {
				brush.endAngle = 359.99999;
			}

			if (currentAngle > brush.endAngle) {
				currentAngle = brush.endAngle;
			}

			var width = obj.width,
				height = obj.height,
				x = obj.x,
				y = obj.y;

			// center
			w = Math.min(width, height) / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w - brush.size/2;
			innerRadius = outerRadius - brush.size;

			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle - currentAngle, {
				fill : "transparent",
				stroke : chart.theme("gaugeBackgroundColor")
			}));


			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle, {
				fill : "transparent",
				stroke : this.color(0)
			}));


			// startAngle, endAngle 에 따른 Text 위치를 선정해야함
			group.append(createText(brush.startAngle, brush.endAngle, min, max, value, unit));


			this.drawItem(group, data, {
				width : width,
				height : height,
				startAngle : brush.startAngle,
				endAngle : currentAngle,
                outerRadius : outerRadius,
                innerRadius : innerRadius,
                size : brush.size,
				centerX : centerX,
				centerY : centerY
			});


			return group;
		}

		this.draw = function() {

			var group = chart.svg.group();

			this.eachData(function(i, data) {
				this.drawUnit(i, data, group);
			});

			return group;



		}
	}

	GaugeBrush.setup = function() {
		return {
			min: "min",
			max: "max",
			value: "value",
			size: 30,
			startAngle: 0,
			endAngle: 360,
			arrow: true,
			unitText: ""
		};
	}

	return GaugeBrush;
}, "chart.brush.donut");
