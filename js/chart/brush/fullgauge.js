jui.define("chart.brush.fullgauge", ["util.math"], function(math) {

	/**
	 * @class chart.brush.fullgage
	 * implements full gauge brush
	 * @param chart
	 * @param axis
	 * @param brush
	 * @constructor
	 */
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
					"font-size" : "1.5em",
					"font-weight" : 1000,
					"fill" : self.color(0)
				}, value + brush.unitText));
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

        }

		this.drawUnit = function(index, data, group) {
			var obj = axis.c(index);
			var value = data[this.brush.target];
			var max = data[this.brush.max];
			var min = data[this.brush.min];

			var rate = (value - min) / (max - min),
				currentAngle = Math.abs(brush.startAngle - brush.endAngle) * rate;

			if (brush.endAngle >= 360) {
				brush.endAngle = 359.99999;
			}

			var width = obj.width, height = obj.height;
			var x = obj.x, y = obj.y;

			// center
			w = Math.min(width, height) / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w;
			innerRadius = outerRadius - brush.size;

			var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle, {
				fill : chart.theme("gaugeBackgroundColor")
			});

			group.append(g);

			g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle, {
				fill : this.color(0)
			});

			group.append(g);

			// startAngle, endAngle 에 따른 Text 위치를 선정해야함
			g = createText(brush.startAngle, brush.endAngle, min, max, value);
			group.append(g);

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
