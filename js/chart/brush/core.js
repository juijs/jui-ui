jui.define("chart.brush.core", [], function() {
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
         * 차트 데이터에 대한 좌표 'x', 'y'를 구하는 함수
         *
         * @param brush
         * @param chart
         * @returns {Array}
         */
        this.getXY = function(brush, chart) {
            var xy = [];

            for (var i = 0, len = chart.data().length; i < len; i++) {
                var startX = brush.x(i),
                    data = chart.data(i);

                for (var j = 0; j < brush.target.length; j++) {
                    var value = data[brush.target[j]];

                    if (!xy[j]) {
                        xy[j] = {
                            x: [],
                            y: [],
                            value: []
                        };
                    }

                    xy[j].x.push(startX);
                    xy[j].y.push(brush.y(value));
                    xy[j].value.push(value);
                }
            }

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
        this.getStackXY = function(brush, chart) {
            var xy = [];

            for (var i = 0, len =  chart.data().length; i < len; i++) {
                var startX = brush.x(i),
                    data = chart.data(i),
                    valueSum = 0;

                for (var j = 0; j < brush.target.length; j++) {
                    var value = data[brush.target[j]];

                    if(j > 0) {
                        valueSum += data[brush.target[j - 1]];
                    }

                    if (!xy[j]) {
                        xy[j] = {
                            x: [],
                            y: [],
                            value: []
                        };
                    }

                    xy[j].x.push(startX);
                    xy[j].y.push(brush.y(value + valueSum));
                    xy[j].value.push(value);
                }
            }

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
        this.addEvent = function(brush, chart, element, targetIndex, dataIndex) {
            var obj = {
                key: brush.index,
                target: brush.target[targetIndex],
                data: chart.data(dataIndex)
            };

            element.on("click", function(e) {
                chart.emit("click", [ obj, e ]);
            });
            
            element.on("mouseover", function(e) {
                chart.emit("mouseover", [ obj, e ]);
            });

            element.on("dblclick", function(e) {
                chart.emit("dblclick", [ obj, e ]);
            });

            element.on("contextmenu", function(e) {
                chart.emit("rclick", [ obj, e ]);
                e.preventDefault();
            });
        }
	}

	return CoreBrush;
}, "chart.draw"); 