jui.define("util.scale", [ "util.math", "util.time" ], function(math, _time) {

	/**
	 * 범위(scale)에 대한 계산 
	 * 
	 */
	var self = {

		/**
		 * 원형 좌표에 대한 scale 
		 * 
		 */
		circle : function() {// 원형 radar

			var that = this;

			var _domain = [];
			var _range = [];
			var _rangeBand = 0;

			function func(t) {

			}


			func.domain = function(values) {

				if ( typeof values == 'undefined') {
					return _domain;
				}

				for (var i = 0; i < values.length; i++) {
					_domain[i] = values[i];
				}

				return this;
			}

			func.range = function(values) {

				if ( typeof values == 'undefined') {
					return _range;
				}

				for (var i = 0; i < values.length; i++) {
					_range[i] = values[i];
				}

				return this;
			}

			func.rangePoints = function(interval, padding) {

				padding = padding || 0;

				var step = _domain.length;
				var unit = (interval[1] - interval[0] - padding) / step;

				var range = [];
				for (var i = 0; i < _domain.length; i++) {
					if (i == 0) {
						range[i] = interval[0] + padding / 2 + unit / 2;
					} else {
						range[i] = range[i - 1] + unit;
					}
				}

				_range = range;
				_rangeBand = unit;

				return func;
			}

			func.rangeBands = function(interval, padding, outerPadding) {

				padding = padding || 0;
				outerPadding = outerPadding || 0;

				var count = _domain.length;
				var step = count - 1;
				var band = (interval[1] - interval[0]) / step;

				var range = [];
				for (var i = 0; i < _domain.length; i++) {
					if (i == 0) {
						range[i] = interval[0];
					} else {
						range[i] = band + range[i - 1];
					}
				}

				_rangeBand = band;
				_range = range;

				return func;
			}

			func.rangeBand = function() {
				return _rangeBand;
			}

			return func;

		},

		/**
		 * 
		 * 순서를 가지는 리스트에 대한 scale 
		 * 
		 */
		ordinal : function() {// 순서
			var that = this;

			var _domain = [];
			var _range = [];
			var _rangeBand = 0;

			function func(t) {

				var index = -1;
				for (var i = 0; i < _domain.length; i++) {
					if (_domain[i] == t) {
						index = i;
						break;
					}
				}

				if (index > -1) {
					return _range[index];
				} else {
					if ( typeof _range[t] != 'undefined') {
						_domain[t] = t;
						return _range[t];
					}

					return null;
				}

			}


			func.domain = function(values) {

				if ( typeof values == 'undefined') {
					return _domain;
				}

				for (var i = 0; i < values.length; i++) {
					_domain[i] = values[i];
				}

				return this;
			}

			func.range = function(values) {

				if ( typeof values == 'undefined') {
					return _range;
				}

				for (var i = 0; i < values.length; i++) {
					_range[i] = values[i];
				}

				return this;
			}

			func.rangePoints = function(interval, padding) {

				padding = padding || 0;

				var step = _domain.length;
				var unit = (interval[1] - interval[0] - padding) / step;

				var range = [];
				for (var i = 0; i < _domain.length; i++) {
					if (i == 0) {
						range[i] = interval[0] + padding / 2 + unit / 2;
					} else {
						range[i] = range[i - 1] + unit;
					}
				}

				_range = range;
				_rangeBand = unit;

				return func;
			}

			func.rangeBands = function(interval, padding, outerPadding) {

				padding = padding || 0;
				outerPadding = outerPadding || 0;

				var count = _domain.length;
				var step = count - 1;
				var band = (interval[1] - interval[0]) / step;

				var range = [];
				for (var i = 0; i < _domain.length; i++) {
					if (i == 0) {
						range[i] = interval[0];
					} else {
						range[i] = band + range[i - 1];
					}
				}

				_rangeBand = band;
				_range = range;

				return func;
			}

			func.rangeBand = function() {
				return _rangeBand;
			}

			return func;
		},

		/**
		 * 시간에 대한 scale 
		 * 
		 */
		time : function() {// 시간

			var that = this;

			var _domain = [];
			var _range = [];
			var _rangeBand;

			var func = self.linear();

			var df = func.domain;

			func.domain = function(domain) {

				if (!arguments.length)
					return df.call(func);

				for (var i = 0; i < domain.length; i++) {
					_domain[i] = +domain[i];
				}

				return df.call(func, _domain);
			}

			func.min = function() {
				return Math.min(_domain[0], _domain[_domain.length - 1]);
			}

			func.max = function() {
				return Math.max(_domain[0], _domain[_domain.length - 1]);
			}

			func.rate = function(value, max) {
				return func(func.max() * (value / max));
			}

			func.ticks = function(type, step) {
				var start = func.min();
				var end = func.max();

				var times = [];
				while (start < end) {
					times.push(new Date(+start));

					start = _time.add(start, type, step);

					//;console.log(start)
				}

				times.push(new Date(+start));
				
				var first = func(times[0]);
				var second = func(times[1]);
				
				_rangeBand = second - first; 
				

				return times;

			}

			func.realTicks = function(type, step) {
				var start = _domain[0];
				var end = _domain[1];

				var times = [];
				var date = new Date(+start)
				var realStart = null;
				if (type == _time.years) {
					realStart = new Date(date.getFullYear(), 0, 1);
				} else if (type == _time.months) {
					realStart = new Date(date.getFullYear(), date.getMonth(), 1);
				} else if (type == _time.days || type == _time.weeks) {
					realStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
				} else if (type == _time.hours) {
					realStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0, 0);
				} else if (type == _time.minutes) {
					realStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0, 0);
				} else if (type == _time.seconds) {
					realStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);
				} else if (type == _time.milliseconds) {
					realStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

				}

				realStart = _time.add(realStart, type, step);
				while (+realStart < +end) {
					times.push(new Date(+realStart));
					realStart = _time.add(realStart, type, step);
				}
				
				var first = func(times[1]);
				var second = func(times[2]);
				
				_rangeBand = second - first; 				

				return times;
			}

			func.rangeBand = function() {
				return _rangeBand;
			}

			func.invert = function(y) {
				var f = self.linear().domain(func.range()).range(func.domain());

				return new Date(f(y));
			}

			return func;
		},
		
		/**
		 * 범위에 대한 scale 
		 * 
		 */
		linear : function() {// 선형

			var that = this;

			var _domain = [0, 1];
			var _range = [0, 1];
			var _isRound = false;
			var _isClamp = false; 

			function func(x) {
				var index = -1;
				var target;
				

				
				for (var i = 0, len = _domain.length; i < len; i++) {

					if (i == len - 1) {
              if (x == _domain[i]) {
                index = i;
                break;
              }
					} else {
						if (_domain[i] < _domain[i + 1]) {
							if (x >= _domain[i] && x < _domain[i + 1]) {
								index = i;
								break;
							}
						} else if (_domain[i] >= _domain[i + 1]) {
							if (x <= _domain[i] && _domain[i + 1] < x) {
								index = i;
								break;
							}
						}
					}

				}

				if (!_range) {
					if (index == 0) {
						return 0;
					} else if (index == -1) {
						return 1;
					} else {
						var min = _domain[index - 1];
						var max = _domain[index];

						var pos = (x - min) / (max - min);

						return pos;
					}
				} else {

          // 최대 최소 체크
					if (_domain.length - 1 == index) {
						return _range[index];
					} else if (index == -1) {    // 값의 범위를 넘어갔을 때 
					  
					  var max = func.max();
					  var min = func.min();
					  
					  if (max < x) {
					    
              if (_isClamp) return max;					    
					    
					    var last = _domain[_domain.length -1];
					    var last2 = _domain[_domain.length -2];
					    
					    var rlast = _range[_range.length -1];
					    var rlast2 = _range[_range.length -2];
					    
					    var distLast = Math.abs(last - last2);
					    var distRLast = Math.abs(rlast - rlast2);
					    
					    return rlast + Math.abs(x - max) * distRLast / distLast; 
					    
					  } else if (min > x) {
					    
					    if (_isClamp) return min;
					    
              var first = _domain[0];
              var first2 = _domain[1];
              
              var rfirst = _range[0];
              var rfirst2 = _range[1];
              
              var distFirst = Math.abs(first - first2);
              var distRFirst = Math.abs(rfirst - rfirst2);
              
              return rfirst - Math.abs(x - min) * distRFirst / distFirst;					    
					  }
					  
						return _range[_range.length - 1];
					} else {

						var min = _domain[index];
						var max = _domain[index+1];

						var minR = _range[index]; 
						var maxR = _range[index + 1];

						var pos = (x - min) / (max - min);

						var scale = _isRound ? math.interpolateRound(minR, maxR) : math.interpolateNumber(minR, maxR);

						return scale(pos);

					}
				}

			}


			func.min = function() {
				return Math.min(_domain[0], _domain[_domain.length - 1]);
			}

			func.max = function() {
				return Math.max(_domain[0], _domain[_domain.length - 1]);
			}

			func.rate = function(value, max) {
				return func(func.max() * (value / max));
			}
			
			func.clamp = function(isClamp) {
			  _isClamp = isClamp || false; 
			}

			func.domain = function(values) {

				if (!arguments.length) {
					return _domain;
				}

				for (var i = 0; i < values.length; i++) {
					_domain[i] = values[i];
				}

				return this;
			}

			func.range = function(values) {

				if (!arguments.length) {
					return _range;
				}

				for (var i = 0; i < values.length; i++) {
					_range[i] = values[i];
				}

				return this;
			}

			func.rangeRound = function(values) {
				_isRound = true;
				return func.range(values);
			}

			func.invert = function(y) {

				var f = self.linear().domain(_range).range(_domain);
				return f(y);
			}

			func.ticks = function(count, isNice, intNumber) {
				intNumber = intNumber || 10000;
				
				if (_domain[0] == 0 && _domain[1] == 0) {
					return [];
				}
				
				var obj = math.nice(_domain[0], _domain[1], count || 10, isNice || false);

				var arr = [];

				var start = obj.min * intNumber;
				var end = obj.max * intNumber;
				while (start <= end) {
					arr.push(start / intNumber);
					start += obj.spacing * intNumber;
				}

				if (arr[arr.length - 1] * intNumber != end && start > end) {
					arr.push(end / intNumber);
				}

				return arr;
			}

			return func;
		}
	}

	return self;
});
