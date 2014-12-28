jui.define("chart.brush.core", [ "jquery", "util.base" ], function($, _) {
	var CoreBrush = function() {

        /**
         * 좌표 배열 'K'에 대한 커브 좌표 'P1', 'P2'를 구하는 함수
         *
         * @param K
         * @returns {{p1: Array, p2: Array}}
         */
		this.curvePoints = function(K) {
			var p1 = [];
			var p2 = [];
			var n = K.length - 1;

			/*rhs vector*/
			var a = [];
			var b = [];
			var c = [];
			var r = [];

			/*left most segment*/
			a[0] = 0;
			b[0] = 2;
			c[0] = 1;
			r[0] = K[0] + 2 * K[1];

			/*internal segments*/
			for ( i = 1; i < n - 1; i++) {
				a[i] = 1;
				b[i] = 4;
				c[i] = 1;
				r[i] = 4 * K[i] + 2 * K[i + 1];
			}

			/*right segment*/
			a[n - 1] = 2;
			b[n - 1] = 7;
			c[n - 1] = 0;
			r[n - 1] = 8 * K[n - 1] + K[n];

			/*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
			for (var i = 1; i < n; i++) {
				var m = a[i] / b[i - 1];
				b[i] = b[i] - m * c[i - 1];
				r[i] = r[i] - m * r[i - 1];
			}

			p1[n - 1] = r[n - 1] / b[n - 1];
			for (var i = n - 2; i >= 0; --i)
				p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];

			/*we have p1, now compute p2*/
			for (var i = 0; i < n - 1; i++)
				p2[i] = 2 * K[i + 1] - p1[i + 1];

			p2[n - 1] = 0.5 * (K[n] + p1[n - 1]);

			return {
				p1 : p1,
				p2 : p2
			};
		}

        /**
         * 값에 비례하여 반지름을 구하는 함수
         *
         * @param value
         * @param minValue
         * @param maxValue
         * @param minRadius
         * @param maxRadius
         * @returns {*}
         */
        this.getScaleValue = function(value, minValue, maxValue, minRadius, maxRadius) {
            var range = maxRadius - minRadius,
                tg = range * getPer();

            function getPer() {
                var range = maxValue - minValue,
                    tg = value - minValue,
                    per = tg / range;

                return per;
            }

            return tg + minRadius;
        }

        /**
         * 차트 데이터 핸들링 함수
         *
         */
        this.eachData = function(callback) {
            if(typeof callback != 'function') return;
            var list = this.listData();

            for(var i = 0; i < list.length; i++) {
                callback.apply(this, [ i, list[i] ]);
            }
        }
        this.listData = function() {
            return this.axis.data;
        }
        this.getData = function(index) {
            return this.listData()[index];
        }

        /**
         * 차트 데이터에 대한 좌표 'x', 'y'를 구하는 함수
         *
         * @param brush
         * @param chart
         * @returns {Array}
         */
        this.getXY = function(isCheckMinMax) {
            var xy = [];
            isCheckMinMax = typeof isCheckMinMax == 'undefined' ? true : false;

            var series = {};

            if (isCheckMinMax) {
                series = $.extend(true, this.chart.series(), this.axis.series);
            }

            this.eachData(function(i, data) {
                var startX = this.brush.x(i);

                for (var j = 0; j < this.brush.target.length; j++) {
                    var key = this.brush.target[j],
                        value = data[key];

                    if (!xy[j]) {
                        xy[j] = {
                            x: [],
                            y: [],
                            value: [],
                            min: [],
                            max: []
                        };
                    }

                    xy[j].x.push(startX);
                    xy[j].y.push(this.brush.y(value));
                    xy[j].value.push(value);

                    if (isCheckMinMax) {
                        xy[j].min.push(value == series[key].min);
                        xy[j].max.push(value == series[key].max);
                    }

                }
            });

            return xy;
        }

        /**
         * 차트 데이터에 대한 좌표 'x', 'y'를 구하는 함수
         * 단, 'y' 좌표는 다음 데이터 보다 높게 구해진다.
         *
         * @param brush
         * @param chart
         * @returns {Array}
         */

        this.getStackXY = function() {
            var xy = this.getXY();

            this.eachData(function(i, data) {
                var valueSum = 0;

                for (var j = 0; j < this.brush.target.length; j++) {
                    var key = this.brush.target[j],
                        value = data[key];

                    if(j > 0) {
                        valueSum += data[this.brush.target[j - 1]];
                    }

                    xy[j].y[i] = this.brush.y(value + valueSum);
                }
            });

            return xy;
        }
        
        /**
         * 브러쉬 엘리먼트에 대한 공통 이벤트 정의
         *
         * @param brush
         * @param chart
         * @param element
         * @param targetIndex
         * @param dataIndex
         */
        this.addEvent = function(elem, dataIndex, targetIndex) {
            var chart = this.chart,
                obj = {
                brush: this.brush,
                dataIndex: dataIndex,
                dataKey: (targetIndex != null) ? this.brush.target[targetIndex] : null,
                data: (dataIndex != null) ? this.getData(dataIndex) : null
            };

            elem.on("click", function(e) {
                setMouseEvent(e);
                chart.emit("click", [ obj, e ]);
            });

            elem.on("dblclick", function(e) {
                setMouseEvent(e);
                chart.emit("dblclick", [ obj, e ]);
            });

            elem.on("contextmenu", function(e) {
                setMouseEvent(e);
                chart.emit("rclick", [ obj, e ]);
                e.preventDefault();
            });

            elem.on("mouseover", function(e) {
                setMouseEvent(e);
                chart.emit("mouseover", [ obj, e ]);
            });

            elem.on("mouseout", function(e) {
                setMouseEvent(e);
                chart.emit("mouseout", [ obj, e ]);
            });

            elem.on("mousemove", function(e) {
                setMouseEvent(e);
                chart.emit("mousemove", [ obj, e ]);
            });

            elem.on("mousedown", function(e) {
                setMouseEvent(e);
                chart.emit("mousedown", [ obj, e ]);
            });

            elem.on("mouseup", function(e) {
                setMouseEvent(e);
                chart.emit("mouseup", [ obj, e ]);
            });

            function setMouseEvent(e) {
                var pos = $(chart.root).offset(),
                    offsetX = e.pageX - pos.left,
                    offsetY = e.pageY - pos.top;

                e.bgX = offsetX;
                e.bgY = offsetY;
                e.chartX = offsetX - chart.padding("left");
                e.chartY = offsetY - chart.padding("top");
            }
        }

        this.createTooltip = function(fill, stroke) {
            var chart = this.chart;

            return this.chart.svg.group({ "visibility" : "hidden" }, function() {
                chart.text({
                    "text-anchor" : "middle",
                    "font-weight" : chart.theme("tooltipPointFontWeight")
                });

                chart.svg.circle({
                    r: chart.theme("tooltipPointRadius"),
                    fill: fill,
                    stroke: stroke,
                    "stroke-width": chart.theme("tooltipPointBorderWidth")
                });
            });
        }

        this.showTooltip = function(tooltip, x, y, value, position) {
            var text = tooltip.get(0);
            text.element.textContent = this.format(value);

            if(position == "left") {
                text.attr({ x: -7, y: 4, "text-anchor": "end" });
            } else if(position == "right") {
                text.attr({ x: 7, y: 4, "text-anchor": "start" });
            } else if(position == "bottom") {
                text.attr({ y: 16 });
            } else {
                text.attr({ y: -7 });
            }

            tooltip.attr({ visibility: (value != 0) ? "visible" : "hidden" });
            tooltip.translate(x, y);
        }

        this.color = function(key) {
            return this.chart.color(key, this.brush);
        }

        this.getOptions = function(options) {
            return $.extend({
                // 공통 옵션 추가 영역
            }, options);
        }
	}

	return CoreBrush;
}, "chart.draw"); 