jui.define("chart.brush.fullgauge", ["util.math"], function(math) {

	var FullGaugeBrush = function(chart, axis, brush) {
		var self = this;
        var w, centerX, centerY, outerRadius, innerRadius;

		function createText(startAngle, endAngle, min, max, value) {
			var g = chart.svg.group({
				"class" : "gauge text"
			});

			g.translate(centerX, centerY);

			if (brush.text != "") {
				g.append(chart.svg.text({
					x : 0,
					y : 10,
					"text-anchor" : "middle",
					"font-family" : chart.theme("fontFamily"),
					"font-size" : "3.5em",
					"font-weight" : 1000,
					"fill" : self.color(0)
				}, value + ""));
			}
			
			if (brush.unitText != "") {
				g.append(chart.text({
					x : 0,
					y : 40,
					"text-anchor" : "middle",
                    "font-family" : chart.theme("fontFamily"),
					"font-size" : "2em",
					"font-weight" : 500,
					"fill" : chart.theme("gaugeFontColor")
				}, brush.unitText));
			}

			return g;
		}

        this.drawBefore = function() {
			var axis = axis || {};

			if (!axis.c) {
				axis.c = function() {
					return {
						x : 0,
						y : 0,
						width : chart.area('width'),
						height : chart.area('height')
					};
				}
			}

			var obj = axis.c(),
				width = obj.width,
				height = obj.height,
				x = obj.x,
				y = obj.y,
				min = width;

			if (height < min) {
				min = height;
			}

			w = min / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
            outerRadius = w;
            innerRadius = outerRadius - brush.size;
        }

		this.draw = function() {
			var group = chart.svg.group({
				"class" : "brush donut"
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
				fill : this.color(0)
			});

			group.append(g);

            // startAngle, endAngle 에 따른 Text 위치를 선정해야함
            g = createText(brush.startAngle, brush.endAngle, brush.min, brush.max, brush.value);
            group.append(g);

            return group;
		}
	}

	FullGaugeBrush.setup = function() {
		return {
			min: 0,
			max: 100,
			value: 0,
			size: 60,
			startAngle: 0,
			endAngle: 300,
			text: "",
			unitText: ""
		};
	}

	return FullGaugeBrush;
}, "chart.brush.donut");
