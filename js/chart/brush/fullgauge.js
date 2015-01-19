jui.define("chart.brush.fullgauge", ["util.math"], function(math) {

	/**
	 * @class chart.brush.fullgage
	 * implements full gauge brush
	 * @extends chart.brush.fullgauge
	 */
	var FullGaugeBrush = function(chart, axis, brush) {
		var self = this;
        var w, centerX, centerY, outerRadius, innerRadius;

		function createText(value, unit) {
			var g = chart.svg.group().translate(centerX, centerY);

			if (brush.showText) {
				g.append(chart.svg.text({
					x : 0,
					y : 10,
					"text-anchor" : "middle",
					"font-family" : chart.theme("fontFamily"),
					"font-size" : "1.5em",
					"font-weight" : 1000,
					"fill" : self.color(0)
				}, value + unit));
			}

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
				currentAngle = Math.abs(brush.startAngle - brush.endAngle) * rate;

			if (brush.endAngle >= 360) {
				brush.endAngle = 359.99999;
			}

			var width = obj.width,
				height = obj.height,
				x = obj.x,
				y = obj.y;

			// center
			w = Math.min(width, height) / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w - brush.size;
			innerRadius = outerRadius - brush.size;

			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle, {
				stroke : chart.theme("gaugeBackgroundColor"),
				fill : 'transparent'
			}));

			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle, {
				stroke : this.color(0),
				fill : 'transparent'
			}));

			group.append(createText(value, unit));

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
			min: "min",
			max: "max",
			value: "value",
			size: 60,
			startAngle: 0,
			endAngle: 300,
			showText: true
		};
	}

	return FullGaugeBrush;
}, "chart.brush.donut");
