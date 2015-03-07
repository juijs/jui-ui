jui.define("chart.brush.gauge", [ "util.math" ], function(math) {

    /**
     * @class chart.brush.gauge 
     * 
     * implements gauge brush 
     *  
     * @extends chart.brush.donut
     */
	var GaugeBrush = function() {
		var self = this;
        var w, centerX, centerY, outerRadius, innerRadius;

        function createText(startAngle, endAngle, min, max, value, unit) {
			var g = self.chart.svg.group({
				"class" : "gauge text"
			}).translate(centerX, centerY);

			g.append(self.chart.svg.text({
				x : 0,
				y : (self.brush.arrow) ? 70 : 10,
				"text-anchor" : "middle",
				"font-size" : "3em",
				"font-weight" : 1000,
				"fill" : self.color(0)
			}, value + ""));

			if (unit != "") {
				g.append(self.chart.text({
					x : 0,
					y : 100,
					"text-anchor" : "middle",
					"font-size" : "1.5em",
					"font-weight" : 500,
					"fill" : self.chart.theme("gaugeFontColor")
				}, unit))
			}

			// 바깥 지름 부터 그림
			var startX = 0;
			var startY = -outerRadius;

            // min
            var obj = math.rotate(startX, startY, math.radian(startAngle));

            startX = obj.x;
            startY = obj.y;

            g.append(self.chart.text({
                x : obj.x + 30,
                y : obj.y + 20,
                "text-anchor" : "middle",
				"fill" : self.chart.theme("gaugeFontColor")
            }, min + ""));

			// max
			// outer arc 에 대한 지점 설정
            var obj = math.rotate(startX, startY, math.radian(endAngle));
    
            g.append(self.chart.text({
                x : obj.x - 20,
                y : obj.y + 20,
                "text-anchor" : "middle",
				"fill" : self.chart.theme("gaugeFontColor")
            }, max + ""));

			return g;
		}

        this.drawBefore = function() {

        }

        /**
         * @method drawUnit 
         * 
         * data 별 gague 를 그린다.
         *  
         * @param {Number} index
         * @param {Object} data
         * @param {util.svg.element} group
         * @return {util.svg.element}
         */
		this.drawUnit = function(index, data, group) {
			var obj = this.axis.c(index),
				value = this.getValue(data, "value", 0),
				max = this.getValue(data, "max", 100),
				min = this.getValue(data, "min", 0),
				unit = this.getValue(data, "unit");

			var startAngle = this.brush.startAngle;
			var endAngle = this.brush.endAngle;

			if (endAngle >= 360) {
				endAngle = 359.99999;
			}

			var rate = (value - min) / (max - min),
				currentAngle = endAngle * rate;

			if (currentAngle > endAngle) {
				currentAngle = endAngle;
			}

			var width = obj.width,
				height = obj.height,
				x = obj.x,
				y = obj.y;

			// center
			w = Math.min(width, height) / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w - this.brush.size/2;
			innerRadius = outerRadius - this.brush.size;

			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, startAngle + currentAngle, endAngle - currentAngle, {
				fill : "transparent",
				stroke : this.chart.theme("gaugeBackgroundColor")
			}));


			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, startAngle, currentAngle, {
				fill : "transparent",
				stroke : this.color(index)
			}));


			// startAngle, endAngle 에 따른 Text 위치를 선정해야함
			group.append(createText(startAngle, endAngle, min, max, value, unit));

			return group;
		}

		this.draw = function() {

			var group = this.chart.svg.group();

			this.eachData(function(i, data) {
				this.drawUnit(i, data, group);
			});

			return group;

		}
	}

	GaugeBrush.setup = function() {
		return {
            /** @cfg {Number} [size=30] Determines the stroke width of a gauge.  */
			size: 30,
            /** @cfg {Number} [startAngle=0] Determines the start angle(as start point) of a gauge. */
			startAngle: 0,
            /** @cfg {Number} [endAngle=360] Determines the end angle(as draw point) of a gauge. */
			endAngle: 360
		};
	}

	return GaugeBrush;
}, "chart.brush.donut");
