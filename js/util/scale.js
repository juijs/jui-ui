jui.define("util.scale", [ "util.math", "util.time" ], function(math, _time) {

	/**
	 * scale utility
	 * @class util.scale
	 * @singleton
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
			var _cache = {};

			function func(t) {

				var key = "" + t;
				if (typeof _cache[key] != 'undefined') {
					return _cache[key];
				}

				var index = -1;
				for (var i = 0; i < _domain.length; i++) {
					if (typeof t == 'string' && _domain[i] === t) {
						index = i;
						break;
					}
				}

				if (index > -1) {
					_cache[key] = _range[index];
					return _range[index];
				} else {
					if ( typeof _range[t] != 'undefined') {
						_domain[t] = t;
						_cache[key] = _range[t];
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

			func.invert = function(x) {
				return Math.ceil(x / _rangeBand);
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

			func.ticks = function(type, interval) {
				var start = _domain[0];
				var end = _domain[1];

				var times = [];
				while (start < end) {
					times.push(new Date(+start));

					start = _time.add(start, type, interval);

				}

				times.push(new Date(+start));

				var first = func(times[1]);
				var second = func(times[2]);

				_rangeBand = second - first;

				return times;

			}

			func.realTicks = function(type, interval) {
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
				realStart = _time.add(realStart, type, interval);

				while (+realStart < +end) {
					times.push(new Date(+realStart));
					realStart = _time.add(realStart, type, interval);
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
		 * log scale
		 *
		 * var log = _.scale.log(10).domain([0, 1000000]).range([0, 300]);
		 *
		 * log(0) == 0
		 * log.ticks(4) == [0, 100, 10000, 1000000]
		 *
		 * @param base
		 */
		log : function(base) {
			var that = this;

			var _base = base || 10;

			var func = self.linear();
			var _domain = [];
			var _domainMax = null;
			var _domainMin = null;

			function log(value) {

				if (value < 0) {
					return -(Math.log(Math.abs(value)) / Math.log(_base));
				} else if (value > 0) {
					return Math.log(value) / Math.log(_base);
				}

				return 0;
			}

			function pow(value) {
				if (value < 0) {
					return - Math.pow(_base, Math.abs(value));
				} else if (value > 0) {
					return Math.pow(_base, value);
				}

				return 0;
			}

			function checkMax(value) {
				return Math.pow(_base, (value+"").length-1) < value;
			}

			function getNextMax(value) {
				return Math.pow(_base, (value+"").length);
			}

			var newFunc = function(x) {

				var value = x;

				if (x > _domainMax) {
					value = _domainMax;
				} else if (x < _domainMin) {
					value = _domainMin;
				}

				return func(log(value));
			}

			$.extend(newFunc, func);

			newFunc.log = function() {
				var newDomain = [];
				for (var i = 0; i < _domain.length; i++) {
					newDomain[i] = log(_domain[i]);
				}

				return newDomain;
			}

			newFunc.domain = function(values) {

				if (!arguments.length) {
					return _domain;
				}

				for (var i = 0; i < values.length; i++) {
					_domain[i] = values[i];
				}

				_domainMax = Math.max.apply(Math, _domain);
				_domainMin = Math.min.apply(Math, _domain);

				if (checkMax(_domainMax)) {
					_domain[1] = _domainMax = getNextMax(_domainMax);
				}

				if (checkMax(Math.abs(_domainMin))) {

					var value = getNextMax(Math.abs(_domainMin));
					_domain[0] = _domainMin = _domainMin < 0  ? -value : value ;
				}

				func.domain(newFunc.log());

				return newFunc;
			}

			newFunc.base = function(base) {
				func.domain(newFunc.log());

				return newFunc;
			}

			newFunc.invert = function(y) {
				return pow(func.invert(y));
			}


			newFunc.ticks = function(count, isNice, intNumber) {

				var arr = func.ticks(count, isNice, intNumber || 100000000000000000000, true);

				if (arr[arr.length-1] < func.max()) {
					arr.push(func.max());
				}

				var newArr = [];
				for(var i = 0, len = arr.length; i < len; i++) {
					newArr[i] = pow(arr[i]);
				}

				return newArr;
			}

			return newFunc;
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
			var _cache = {};

			var roundFunction = null;
			var numberFunction = null;

			var domainMin = null;
			var domainMax = null;

			var rangeMin = null;
			var rangeMax = null;

			var distDomain = null;
			var distRange = null;

			var callFunction = null;
			var _rangeBand = null;

			function func(x) {

				if (domainMax < x) {
					if (_isClamp) {
						return func(domainMax);
					}

					return _range[0] + Math.abs(x - _domain[1]) * distDomain / distRange;
				} else if (domainMin > x) {
					if (_isClamp) {
						return func(domainMin);
					}

					return _range[0] - Math.abs(x - _domain[0]) * distDomain / distRange;
				} else {
					var pos = (x - _domain[0]) / (distDomain);

					return callFunction(pos);
				}

			}

			func.cache = function() {
				return _cache;
			}

			func.min = function() {
				return Math.min.apply(Math, _domain);
			}

			func.max = function() {
				return Math.max.apply(Math, _domain);
			}

			func.rangeMin = function() {
				return Math.min.apply(Math, _range);
			}

			func.rangeMax = function() {
				return Math.max.apply(Math, _range);
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

				domainMin = func.min();
				domainMax = func.max();

				distDomain = _domain[1] - _domain[0];

				return this;
			}

			func.range = function(values) {

				if (!arguments.length) {
					return _range;
				}

				for (var i = 0; i < values.length; i++) {
					_range[i] = values[i];
				}

				roundFunction = math.interpolateRound(_range[0], _range[1]);
				numberFunction = math.interpolateNumber(_range[0], _range[1]);

				rangeMin = func.rangeMin();
				rangeMax = func.rangeMax();

				distRange = Math.abs(rangeMax - rangeMin);

				callFunction = _isRound ? roundFunction : numberFunction;

				return this;
			}

			func.rangeRound = function(values) {
				_isRound = true;

				return func.range(values);
			}

			func.rangeBand = function() {
				return _rangeBand;
			}

			func.invert = function(y) {

				var f = self.linear().domain(_range).range(_domain);
				return f(y);
			}

			func.ticks = function(count, isNice, /** @deprecated */intNumber, reverse) {

				//intNumber = intNumber || 10000;
				reverse = reverse || false;
				var max = func.max();

				if (_domain[0] == 0 && _domain[1] == 0) {
					return [];
				}

				var obj = math.nice(_domain[0], _domain[1], count || 10, isNice || false);

				var arr = [];

				var start = (reverse ? obj.max : obj.min);
				var end = (reverse ? obj.min : obj.max);
				var unit = obj.spacing;
				var fixed = math.fixed(unit);

				while ((reverse ? end <= start : start <= end)) {
					arr.push(start/* / intNumber*/);

					if (reverse) {
						start = fixed.minus(start, unit);
					} else {
						start = fixed.plus(start, unit);
					}

				}

				if (reverse) {
					if (arr[0] != max) {
						arr.unshift(max);
					}

					for(var i = 0, len = arr.length; i < len; i++) {
						arr[i] = Math.abs(arr[i] - max);
					}
					//arr.reverse();

				} else {
					if (arr[arr.length - 1] != end && start > end) {
						arr.push(end);
					}

					if (_domain[0] > _domain[1]) {
						arr.reverse();
					}
				}

				var first = func(arr[0]);
				var second = func(arr[1]);

				_rangeBand = Math.abs(second - first);

				return arr;
			}

			return func;
		}
	}

	return self;
});
