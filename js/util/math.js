jui.define("util.math", [ "util.base" ], function(_) {

	/**
	 * @class util.math
	 *
	 * Math Utility
	 *
	 * @singleton
	 */
	var self = {

		/**
		 * @method rotate
		 *
		 * 2d rotate
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} radian	roate 할 radian
		 * @return {Object}
		 * @return {Number} return.x  변환된 x
		 * @return {Number} return.y  변환된 y
		 *
 		 */
		rotate : function(x, y, radian) {
			return {
				x : x * Math.cos(radian) - y * Math.sin(radian),
				y : x * Math.sin(radian) + y * Math.cos(radian)
			}
		},

		resize : function(maxWidth, maxHeight, objectWidth, objectHeight) {
			var ratio = objectHeight / objectWidth;

			if (objectWidth >= maxWidth && ratio <= 1) {
				objectWidth = maxWidth;
				objectHeight = maxHeight * ratio;
			} else if (objectHeight >= maxHeight) {
				objectHeight = maxHeight;
				objectWidth = maxWidth / ratio;
			}

			return { width : objectWidth, height : objectHeight};
		},

		/**
		 * @method radian
		 *
		 * convert degree to radian
		 *
		 * @param {Number} degree
		 * @return {Number} radian
		 */
		radian : function(degree) {
			return degree * Math.PI / 180;
		},

		/**
		 * @method degree
		 *
		 * convert radian to degree
		 *
		 * @param {Number} radian
		 * @return {Number} degree
		 */
		degree : function(radian) {
			return radian * 180 / Math.PI;
		},

        angle : function(x1, y1, x2, y2) {
            var dx = x2 - x1,
                dy = y2 - y1;

            return Math.atan2(dy, dx);
        },

		/**
		 * @method interpolateNumber
		 *
		 * a, b 의 중간값 계산을 위한 callback 함수 만들기
		 *
		 * @param {Number} a	first value
		 * @param {Number} b 	second value
		 * @return {Function}
		 */
		interpolateNumber : function(a, b) {
            var dist = (b - a);
			return function(t) {
				return a + dist * t;
			}
		},

		// 중간값 round 해서 계산하기
		interpolateRound : function(a, b) {

            var dist = (b - a);
            return function(t) {
                return Math.round(a + dist * t);
            }
		},

		getFixed : function (a, b) {
			var aArr = (a+"").split(".");
			var aLen = (aArr.length < 2) ? 0 : aArr[1].length;

			var bArr = (b+"").split(".");
			var bLen = (bArr.length < 2) ? 0 : bArr[1].length;

			return (aLen > bLen) ? aLen : bLen;

		},

		fixed : function (fixed) {


			var fixedNumber = this.getFixed(fixed, 0);
			var pow = Math.pow(10, fixedNumber);

			var func = function (value) {
				return Math.round(value * pow) / pow;
			};

			func.plus = function (a, b) {
				return Math.round(a * pow + b * pow) / pow;
			};

			func.minus = function (a, b) {
				return Math.round(a * pow - b * pow) / pow;
			};

			func.multi = function (a, b) {
				return Math.round(a * pow * b * pow) / pow;
			};

			func.div = function (a, b) {
				return Math.round(a * pow / b * pow) / pow;
			};

			return func;
		},

		round: function (num, fixed) {
			var fixedNumber = Math.pow(10, fixed);

			return Math.round(num * fixedNumber) / fixedNumber;
		},

		plus : function (a, b) {
			return this.round(a + b, this.getFixed(a, b));
		},

		minus : function (a, b) {
			return this.round(a - b, this.getFixed(a, b));
		},

		multi : function (a, b) {
			return this.round(a * b, this.getFixed(a, b));
		},

		div : function (a, b) {
			return this.round(a / b, this.getFixed(a, b));
		},

		/**
		 * 특정 구간의 값을 자동으로 계산 
		 * 
		 * @param {Object} min
		 * @param {Object} max
		 * @param {Object} ticks
		 * @param {Object} isNice
		 */
		nice : function(min, max, ticks, isNice) {
			isNice = isNice || false;

			if (min > max) {
				var _max = min;
				var _min = max;
			} else {
				var _min = min;
				var _max = max;
			}

			var _ticks = ticks;
			var _tickSpacing = 0;
			var _range = [];
			var _niceMin;
			var _niceMax;

			function niceNum(range, round) {
				var exponent = Math.floor(Math.log(range) / Math.LN10);
				var fraction = range / Math.pow(10, exponent);
				var nickFraction;

				if (round) {
					if (fraction < 1.5)
						niceFraction = 1;
					else if (fraction < 3)
						niceFraction = 2;
					else if (fraction < 7)
						niceFraction = 5;
					else
						niceFraction = 10;
				} else {
					if (fraction <= 1)
						niceFraction = 1;
					else if (fraction <= 2)
						niceFraction = 2;
					else if (fraction <= 5)
						niceFraction = 5;
					else
						niceFraction = 10;

					//console.log(niceFraction)
				}

				return niceFraction * Math.pow(10, exponent);

			}

			function caculate() {
				_range = (isNice) ? niceNum(_max - _min, false) : _max - _min;
				_tickSpacing = (isNice) ? niceNum(_range / _ticks, true) : _range / _ticks;
				_niceMin = (isNice) ? Math.floor(_min / _tickSpacing) * _tickSpacing : _min;
				_niceMax = (isNice) ? Math.floor(_max / _tickSpacing) * _tickSpacing : _max;

			}

			caculate();

			return {
				min : _niceMin,
				max : _niceMax,
				range : _range,
				spacing : _tickSpacing
			}
		},

		matrix: function(a, b) {
			// 2x1 or 3x1 or ?x1 형태의 매트릭스 연산
			function matrix(a, b) {
				var m = [];

				for(var i = 0, len = a.length; i < len; i++) {
					var sum = 0;

					for(var j = 0, len2 = a[i].length; j < len2; j++) {
						sum += a[i][j] * b[j];
					}

					m.push(sum);
				}

				return m;
			}


			// 2x2 or 3x3 형태의 매트릭스 연산
			function deepMatrix(a, b) {
				var m = [], nm = [];

				for(var i = 0, len = b.length; i < len; i++) {
					m[i] = [];
					nm[i] = [];
				}

				for(var i = 0, len = b.length; i < len; i++) {
					for(var j = 0, len2 = b[i].length; j < len2; j++) {
						m[j].push(b[i][j]);
					}
				}

				for(var i = 0, len = m.length; i < len; i++) {
					var mm = matrix(a, m[i]);

					for(var j = 0, len2 = mm.length; j < len2; j++) {
						nm[j].push(mm[j]);
					}
				}

				return nm;
			}

			if(_.typeCheck("array", b[0])) {
				return deepMatrix(a, b);
			}

			return matrix(a, b);
		}
	}

	return self;
});
