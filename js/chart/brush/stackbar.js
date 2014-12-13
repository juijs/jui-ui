jui.define("chart.brush.stackbar", [], function() {

	var StackBarBrush = function(chart, brush) {
		var g, series, count, height, bar_width;

		this.getBarElement = function(dataIndex, targetIndex) {
			var style = this.getBarStyle(),
				color = this.chart.color(targetIndex, this.brush),
				value = this.chart.data(dataIndex)[this.brush.target[targetIndex]];

			var r = this.chart.svg.rect({
				fill : color,
				stroke : style.borderColor,
				"stroke-width" : style.borderWidth,
				"stroke-opacity" : style.borderOpacity
			});

			if(value != 0) {
				this.addEvent(r, dataIndex, targetIndex);
			}

			return r;
		}

		this.setActiveEffect = function(group) {
			var style = this.getBarStyle(),
				columns = this.barList;

			for(var i = 0; i < columns.length; i++) {
				var opacity = (group == columns[i]) ? 1 : style.disableOpacity;

				columns[i].attr({ opacity: opacity });
			}
		}

		this.setActiveEvent = function(group) {
			var self = this;

			group.on(self.brush.activeEvent, function(e) {
				self.setActiveEffect(group);
			});
		}

		this.drawBefore = function() {
			g = chart.svg.group();

			series = chart.series();
			count = chart.data().length;

			height = brush.y.rangeBand();
			bar_width = height - brush.outerPadding * 2;
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var group = chart.svg.group();
				
				var startY = brush.y(i) - bar_width/ 2,
                    startX = brush.x(0),
                    value = 0;
				
				for (var j = 0; j < brush.target.length; j++) {
					var xValue = chart.data(i, brush.target[j]) + value,
                        endX = brush.x(xValue),
						r = this.getBarElement(i, j);

					r.attr({
						x : (startX < endX) ? startX : endX,
						y : startY,
						width : Math.abs(startX - endX),
						height : bar_width
					});

					group.append(r);

					startX = endX;
					value = xValue;
				}

				// 액티브 엘리먼트 이벤트 설정
				if(brush.activeEvent != null) {
					this.setActiveEvent(group);
					group.attr({ cursor: "pointer" });
				}

				this.addBarElement(group);
				g.append(group);
			}

			// 액티브 엘리먼트 설정
			if(this.barList[brush.active]) {
				this.setActiveEffect(this.barList[brush.active]);
			}

            return g;
		}

        this.drawSetup = function() {
			return this.getOptions({
				outerPadding: 15,
				active: null,
				activeEvent: null // or click, mouseover, ...
            });
        }
	}

	return StackBarBrush;
}, "chart.brush.bar");
