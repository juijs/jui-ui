jui.define("chart.brush.bar", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.bar 
     * implements bar brush 
     * @extends chart.brush.core
     */
	var BarBrush = function(chart, axis, brush) {
		var g;
		var zeroX, height, half_height, bar_height;

        /**
         * bar style 을 얻어온다. 
         *  
         * @return {Object} bar 에 관련된 스타일을 리턴한다. 
         * @return {String} return.borderColor  
         * @return {Number} return.borderWidth  
         * @return {Number} return.borderOpacity  
         * @return {Number} return.borderRadius  
         * @return {Number} return.disableOpacity  
         * @return {String} return.circleColor  
         */
		this.getBarStyle = function() {
			return {
				borderColor: this.chart.theme("barBorderColor"),
				borderWidth: this.chart.theme("barBorderWidth"),
				borderOpacity: this.chart.theme("barBorderOpacity"),
				borderRadius: this.chart.theme("barBorderRadius"),
				disableOpacity: this.chart.theme("barDisableBackgroundOpacity"),
				circleColor: this.chart.theme("barPointBorderColor")
			}
		}

        /**
         * @method getBarElement 
         *  
         * 특정 위치에 맞는 bar element 를 생성한다. 
         *  
         * @param {Number} dataIndex
         * @param {Number} targetIndex
         * @param {Object} info
         * @param {Number} info.width bar 넓이
         * @param {Number} info.height bar 높이
         * @return {util.svg.element}
         */
		this.getBarElement = function(dataIndex, targetIndex, info) {
			var style = this.getBarStyle(),
				color = this.color(targetIndex),
				value = this.getData(dataIndex)[this.brush.target[targetIndex]];

			var r = this.chart.svg.pathRect({
				width: info.width,
				height: info.height,
				fill : color,
				stroke : style.borderColor,
				"stroke-width" : style.borderWidth,
				"stroke-opacity" : style.borderOpacity
			});

			if(value != 0) {
				this.addEvent(r, dataIndex, targetIndex);
			}

			if(this.barList == null) {
				this.barList = [];
			}

			this.barList.push(_.extend({
				element: r,
				color: color
			}, info));

			return r;
		}

        /**
         * @method setActiveEffect 
         * 
         * 활성화(active)된 영역 표시   
         *  
         * @param {Number} r
         */
		this.setActiveEffect = function(r) {
			var style = this.getBarStyle(),
				cols = this.barList;

			for(var i = 0; i < cols.length; i++) {
				var opacity = (cols[i] == r) ? 1 : style.disableOpacity;
				cols[i].element.attr({ opacity: opacity });

				if(cols[i].minmax) {
					cols[i].minmax.style(cols[i].color, style.circleColor, opacity);
				}
			}
		}

        /**
         * @method drawBefore 
         * 
         * @protected 
         */
		this.drawBefore = function() {
			g = chart.svg.group();
			zeroX = axis.x(0);
			height = axis.y.rangeBand();
			half_height = height - (brush.outerPadding * 2);

			bar_height = (half_height - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
            bar_height = (bar_height < 0) ? 0 : bar_height;
		}

        /**
         * @method drawETC
         * 
         * @param {util.svg.element} group
         */
		this.drawETC = function(group) {
			if(!_.typeCheck("array", this.barList)) return;

			var self = this,
				style = this.getBarStyle();

			// 액티브 툴팁 생성
			this.active = this.drawTooltip();
            group.append(this.active.tooltip);

			for(var i = 0; i < this.barList.length; i++) {
				var r = this.barList[i],
					d = this.brush.display;

				// Max & Min 툴팁 생성
				if((d == "max" && r.max) || (d == "min" && r.min) || d == "all") {
					r.minmax = this.drawTooltip(r.color, style.circleColor, 1);
					r.minmax.control(r.position, r.tooltipX, r.tooltipY, this.format(r.value));
                    group.append(r.minmax.tooltip);
				}

				// 컬럼 및 기본 브러쉬 이벤트 설정
				if(r.value != 0 && this.brush.activeEvent != null) {
					(function(bar) {
						self.active.style(bar.color, style.circleColor, 1);

						bar.element.on(self.brush.activeEvent, function(e) {
							self.active.style(bar.color, style.circleColor, 1);
							self.active.control(bar.position, bar.tooltipX, bar.tooltipY, self.format(bar.value));
							self.setActiveEffect(bar);
						});

						bar.element.attr({ cursor: "pointer" });
					})(r);
				}
			}

			// 액티브 툴팁 위치 설정
			var r = this.barList[this.brush.active];
			if(r != null) {
				this.active.style(r.color, style.circleColor, 1);
				this.active.control(r.position, r.tooltipX, r.tooltipY, this.format(r.value));
				this.setActiveEffect(r);
			}
		}

		this.draw = function() {
			var points = this.getXY(),
				style = this.getBarStyle();

			this.eachData(function(i, data) {
				var startY = axis.y(i) - (half_height / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						tooltipX = axis.x(value),
						tooltipY = startY + (bar_height / 2),
						position = (tooltipX >= zeroX) ? "right" : "left";

                    // 최소 크기 설정
                    if(Math.abs(zeroX - tooltipX) < brush.minSize) {
                        tooltipX = (position == "right") ? tooltipX + brush.minSize : tooltipX - brush.minSize;
                    }

					var width = Math.abs(zeroX - tooltipX),
						radius = (width < style.borderRadius || bar_height < style.borderRadius) ? 0 : style.borderRadius,
                        r = this.getBarElement(i, j, {
							width: width,
							height: bar_height,
							value: value,
							tooltipX: tooltipX,
							tooltipY: tooltipY,
							position: position,
							max: points[j].max[i],
							min: points[j].min[i]
						});

					if (tooltipX >= zeroX) {
						r.round(width, bar_height, 0, radius, radius, 0);
						r.translate(zeroX, startY);
					} else {
						r.round(width, bar_height, radius, 0, 0, radius);
						r.translate(zeroX - width, startY);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 다음 컬럼 좌표 설정
					startY += bar_height + brush.innerPadding;
				}
			});

			this.drawETC(g);

            return g;
		}

		this.drawAnimate = function(root) {
			var svg = this.chart.svg,
				type = this.brush.animate;

			root.append(
				svg.animate({
					attributeName: "opacity",
					from: "0",
					to: "1",
					begin: "0s" ,
					dur: "1.4s",
					repeatCount: "1",
					fill: "freeze"
				})
			);

			root.each(function(i, elem) {
				if(elem.is("util.svg.element.path")) {
					var xy = elem.data("translate").split(","),
						x = parseInt(xy[0]),
						y = parseInt(xy[1]),
						w = parseInt(elem.attr("width")),
						start = (type == "right") ? x + w : x - w;

					elem.append(svg.animateTransform({
						attributeName: "transform",
						type: "translate",
						from: start + " " + y,
						to: x + " " + y,
						begin: "0s",
						dur: "0.7s",
						repeatCount: "1",
						fill: "freeze"
					}));
				}
			});
		}
	}

	BarBrush.setup = function() {
		return {
            /** @cfg {Number} [minSize=0] Sets the minimum size as it is not possible to draw a bar when the value is 0. */
            minSize: 0,
            /** @cfg {Number} [outerPadding=2] Determines the outer margin of a bar.  */
			outerPadding: 2,
            /** @cfg {Number} [innerPadding=1] Determines the inner margin of a bar. */
			innerPadding: 1,
            /** @cfg {Number} [active=null] Activates the bar of an applicable index. */
			active: null,
            /** @cfg {String} [activeEvent=null]  Activates the bar in question when a configured event occurs (click, mouseover, etc). */
			activeEvent: null,
            /** @cfg {"max"/"min"} [display=null]  Shows a tool tip on the bar for the minimum/maximum value.  */
			display: null
		};
	}

	return BarBrush;
}, "chart.brush.core");
