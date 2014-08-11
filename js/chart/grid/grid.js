jui.define("chart.grid", [ "util" ], function(_) {
    var Grid = function() {
        var self = this;

        this.scale = {
            ordinal : function() {  // 순서 
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
                        if (_range[t]) {
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

                    _domain = values;

                    return this;
                }

                func.range = function(values) {

                    if ( typeof values == 'undefined') {
                        return _range;
                    }

                    _range = values;

                    return this;
                }

				/**
				 * 
				 * 
				 */
                func.rangePoints = function(interval, padding) {

                    padding = padding || 0;

                    var step = _domain.length;
                    var unit = (interval[1] - interval[0] - padding) / step;

                    var range = [];
                    for (var i = 0; i < _domain.length; i++) {
                        if (i == 0) {
                            range[i] = interval[0] + padding / 2;
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
                    var step = count -1;
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

            time : function() {	// 시간 

                var that = this;

                var _domain = [];
                var _range = [];

                var func = self.scale.linear();

                var df = func.domain;

                func.domain = function(domain) {

                    if (!arguments.length)
                        return df.call(func);

                    for (var i = 0; i < domain.length; i++) {
                        _domain[i] = +domain[i];
                    }

                    return df.call(func, _domain);
                }

                func.ticks = function(type, step) {
                    var start = _domain[0];
                    var end = _domain[1];

                    var times = [];
                    while (start < end) {
                        times.push(new Date(+start));

                        start = self.time.add(start, type, step);

                        //;console.log(start)
                    }

                    times.push(new Date(+start));

                    return times;

                }

                func.tickFormat = function(count, format) {

                }

                func.invert = function(y) {
                    var f = self.scale.linear().domain(func.range()).range(func.domain());

                    return new Date(f(y));
                }

                return func;
            },
            /**
             *
             *
             */
            linear : function() {			// 선형 

                var that = this;

                var _domain = [0, 1];
                var _range = [0, 1];
                var _isRound = false;

                function func(x) {
                    var index = -1;
                    var target;
                    for (var i = 0, len = _domain.length; i < len; i++) {

                        if (i == len - 1) {
                            if (_domain[i - 1] < _domain[i]) {
                                if (x > _domain[i]) {
                                    index = i;
                                    break;
                                }
                            } else if (_domain[i - 1] >= _domain[i]) {
                                if (x <= _domain[i]) {
                                    index = i;
                                    break;
                                }
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

                        if (_domain.length - 1 == index) {
                            return _range[index];
                        } else if (index == -1) {
                            return _range[_range.length - 1];
                        } else {

                            var min = _domain[index];
                            var max = _domain[index + 1];

                            var minR = _range[index]
                            var maxR = _range[index + 1];

                            var pos = (x - min) / (max - min);

                            var scale = _isRound ? self.interpolateRound(minR, maxR) : self.interpolateNumber(minR, maxR);

                            return Math.round(scale(pos));

                        }
                    }

                }


                func.domain = function(values) {

                    if (!arguments.length) {
                        return _domain;
                    }

                    _domain = values;

                    return this;
                }

                func.range = function(values) {

                    if (!arguments.length) {
                        return _range;
                    }

                    _range = values;

                    return this;
                }

                func.rangeRound = function(values) {
                    _isRound = true;
                    return func.range(values);
                }

                func.invert = function(y) {

                    var f = self.scale.linear().domain(_range).range(_domain);
                    return f(y);
                }

                func.ticks = function(count, isNice, intNumber) {
                    intNumber = intNumber || 10000;
                    var obj = self.nice(_domain[0], _domain[1], count || 10, isNice || false);

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

        this.time = {

            // unit
            years : 0x01,
            months : 0x02,
            days : 0x03,
            hours : 0x04,
            minutes : 0x05,
            seconds : 0x06,
            weeks : 0x07,

            // add
            add : function(date) {

                if (arguments.length <= 2) {
                    return date;
                }

                if (arguments.length > 2) {
                    var d = new Date(+date);

                    for (var i = 1; i < arguments.length; i += 2) {

                        var split = arguments[i];
                        var time = arguments[i + 1];

                        if (this.years == split) {
                            d.setFullYear(d.getFullYear() + time);
                        } else if (this.months == split) {
                            d.setMonth(d.getMonth() + time);
                        } else if (this.days == split) {
                            d.setDate(d.getDate() + time);
                        } else if (this.hours == split) {
                            d.setHours(d.getHours() + time);
                        } else if (this.minutes == split) {
                            d.setMinutes(d.getMinutes() + time);
                        } else if (this.seconds == split) {
                            d.setSeconds(d.getSeconds() + time);
                        } else if (this.weeks == split) {
                            d.setDate(d.getDate() + time * 7);
                        }
                    }

                    return d;
                }
            }
        }

        this.nice = function niceAxis(min, max, ticks, isNice) {
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

                //console.log(range, exponent, fraction, _ticks);

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
        }

        this.interpolateNumber = function(a, b) {
            return function(t) {
                return a + (b - a) * t;
            }
        }

        this.interpolateRound = function(a, b) {
            var f = this.interpolateNumber(a, b);

            return function(t) {
                return Math.round(f(t));
            }
        }
    }

    return Grid;
}, "chart.draw");