jui.define("chart.brush.stackcolumn", [], function() {

	var ColumnStackBrush = function(chart, brush) {
		var g, zeroY, count, width, barWidth;
		var borderColor, borderWidth, borderOpacity;
		var columns = [];

		function setActiveEffect(self, elem) {
			for(var i = 0; i < columns.length; i++) {
				var opacity = (elem == columns[i].element) ? 1 : self.chart.theme("columnDisableBackgroundOpacity");

				columns[i].element.attr({ opacity: opacity });
			}
		}

		function setActiveEvent(self, elem) {
			elem.on(self.brush.activeEvent, function(e) {
				setActiveEffect(self, elem);
			});
		}

		this.drawBefore = function() {
			g = chart.svg.group();

			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			barWidth = width - brush.outerPadding * 2;

			borderColor = chart.theme("columnBorderColor");
			borderWidth = chart.theme("columnBorderWidth");
			borderOpacity = chart.theme("columnBorderOpacity");
		}

		this.draw = function() {
			var self = this;

			for (var i = 0; i < count; i++) {
				var group = chart.svg.group();
				
				var startX = brush.x(i) - barWidth / 2,
                    startY = brush.y(0),
                    value = 0;

				for(var j = 0; j < brush.target.length; j++) {
					var yValue = chart.data(i, brush.target[j]) + value,
                        endY = brush.y(yValue);
					
					var r = chart.svg.rect({
						x : startX,
						y : (startY > endY) ? endY : startY,
						width : barWidth,
						height : Math.abs(startY - endY),
						fill : chart.color(j, brush),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, j, i);
					group.append(r);					
					
					startY = endY;
					value = yValue;
				}

				// 스택컬럼 상태 설정
				columns[i] = {
					element: group
				};

				// 액티브 엘리먼트 이벤트 설정
				if(brush.activeEvent != null) {
					setActiveEvent(this, group);
					group.attr({ cursor: "pointer" });
				}

				g.append(group);
			}

			// 액티브 엘리먼트 설정
			g.each(function(i, group) {
				if (brush.active == i) {
					setActiveEffect(self, group);
				}
			});

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

	return ColumnStackBrush;
}, "chart.brush.core");
