jui.define("chart.brush.fullstackbar", [], function() {

    /**
     * @class chart.brush.fullstackbar 
     * 
     * implements fullstack bar brush 
     *  
     * @extends chart.brush.stackbar 
     */
	var FullStackBarBrush = function(chart, axis, brush) {
		var g, zeroX, height, bar_height;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroX = axis.x(0);
			height = axis.y.rangeBand();
			bar_height = height - brush.outerPadding * 2;
		}

		this.drawText = function(percent, x, y) {
			var text = this.chart.text({
				x : x,
				y : y,
				"text-anchor" : "middle"
			}, percent + "%");

			return text;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var group = chart.svg.group();

				var startY = axis.y(i) - bar_height / 2,
					sum = 0,
					list = [];

				for (var j = 0; j < brush.target.length; j++) {
					var width = data[brush.target[j]];

					sum += width;
					list.push(width);
				}

				var startX = 0,
					max = axis.x.max();

				for (var j = list.length - 1; j >= 0; j--) {
					var width = axis.x.rate(list[j], sum),
						r = this.getBarElement(i, j);

					r.attr({
						x : startX,
						y : startY,
						width: width,
						height: bar_height
					});

					group.append(r);

					// 퍼센트 노출 옵션 설정
					if(brush.showText) {
						var p = Math.round((list[j] / sum) * max),
							x = startX + width / 2,
							y = startY + bar_height / 2 + 5;

						group.append(this.drawText(p, x, y));
					}

					// 액티브 엘리먼트 이벤트 설정
					this.setActiveEventOption(group);

					startX += width;
				}

				this.addBarElement(group);
				g.append(group);
			});

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

			return g;
		}
	}

	FullStackBarBrush.setup = function() {
		return {
            /** @cfg {Number} [outerPadding=15] */
			outerPadding: 15,
            /** @cfg {Boolean} [showText=false] Configures settings to let the percent text of a full stack bar revealed. */
			showText: false
		};
	}

	return FullStackBarBrush;
}, "chart.brush.stackbar");
