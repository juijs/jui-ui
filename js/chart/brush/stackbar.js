jui.define("chart.brush.stackbar", [], function() {

	/**
	 * @class chart.brush.stackbar
	 *
	 * stack 형태의 bar 브러쉬
	 *
	 * @extends chart.brush.bar
	 *
	 */
	var StackBarBrush = function(chart, axis, brush) {
		var g, height, bar_width;

		this.addBarElement = function(elem) {
			if(this.barList == null) {
				this.barList = [];
			}

			this.barList.push(elem);
		}

		this.getBarElement = function(dataIndex, targetIndex) {
			var style = this.getBarStyle(),
				color = this.color(targetIndex),
				value = this.getData(dataIndex)[this.brush.target[targetIndex]];

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

		this.setActiveEffectOption = function() {
			var active = this.brush.active;

			if(this.barList && this.barList[active]) {
				this.setActiveEffect(this.barList[active]);
			}
		}

		this.setActiveEvent = function(group) {
			var self = this;

			group.on(self.brush.activeEvent, function (e) {
				self.setActiveEffect(group);
			});
		}

		this.setActiveEventOption = function(group) {
			if(this.brush.activeEvent != null) {
				this.setActiveEvent(group);
				group.attr({ cursor: "pointer" });
			}
		}

		this.drawBefore = function() {
			g = chart.svg.group();
			height = axis.y.rangeBand();
			bar_width = height - brush.outerPadding * 2;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var group = chart.svg.group();
				
				var startY = axis.y(i) - bar_width/ 2,
                    startX = axis.x(0),
                    value = 0;
				
				for (var j = 0; j < brush.target.length; j++) {
					var xValue = data[brush.target[j]] + value,
                        endX = axis.x(xValue),
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

				this.setActiveEventOption(group); // 액티브 엘리먼트 이벤트 설정
				this.addBarElement(group);
				g.append(group);
			});

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

            return g;
		}
	}

	StackBarBrush.setup = function() {
		return {
			/** @cfg {Number} [outerPadding=15] Determines the outer margin of a stack bar. */
			outerPadding: 15
		};
	}

	return StackBarBrush;
}, "chart.brush.bar");
