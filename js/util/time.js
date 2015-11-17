jui.define("util.time", [ "util.base" ], function(_) {

	/**
	 * time 객체 
	 * 
	 */
	var self = {

		//constant
		MILLISECOND : 1000,
		MINUTE : 1000 * 60,
		HOUR : 1000 * 60 * 60,
		DAY : 1000 * 60 * 60 * 24,

		// unit
		years : "years",
		months : "months",
		days : "days",
		hours : "hours",
		minutes : "minutes",
		seconds : "seconds",
		milliseconds : "milliseconds",
		weeks : "weeks",

		diff : function (type, a, b) {
			var milliseconds =  (+a) - (+b);

			if (type == 'seconds') {
				return Math.abs(Math.floor(milliseconds / self.MILLISECOND));
			} else if (type == 'minutes') {
				return Math.abs(Math.floor(milliseconds / self.MINUTE));
			} else if (type == 'hours') {
				return Math.abs(Math.floor(milliseconds / self.HOUR));
			} else if (type == 'days') {
				return Math.abs(Math.floor(milliseconds / self.DAY));
			}

			return milliseconds;
		},

		/**
		 * 시간 더하기 
		 * var date = new Date(); 
		 * 
		 * time.add(date, time.hours, 1); 		// 현재시간에서 1시간 추가  
		 * time.add(date, time.hours, 1, time.minutes, 2); 		// 현재시간에서 1시간 2분 추가   
		 * 
 		 * @param {Object} date
		 */
		add : function(date) {

			if (arguments.length <= 2) {
				return date;
			}

			if (arguments.length > 2) {
				var d = new Date(+date);

				for (var i = 1; i < arguments.length; i += 2) {

					var split = typeof arguments[i] == 'string' ? this[arguments[i]] : arguments[i];
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
					} else if (this.milliseconds == split) {
						d.setMilliseconds(d.getMilliseconds() + time);
					} else if (this.weeks == split) {
						d.setDate(d.getDate() + time * 7);
					}
				}

				return d;
			}
		},
		
		/**
		 * jui.util.dateFormat 의 alias 
		 * 
		 * @param {Object} date
		 * @param {Object} format
		 * @param {Object} utc
		 */
		format: function(date, format, utc) {
			return _.dateFormat(date, format, utc);
        }		
	}

	return self;
});
