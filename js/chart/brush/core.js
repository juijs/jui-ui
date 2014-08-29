jui.define("chart.brush.core", [], function() {
	var CoreBrush = function() {

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
	}

	return CoreBrush;
}, "chart.draw"); 