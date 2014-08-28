jui.define("util.time", ["util"], function(_) {

	var self = {

		// unit
		years : 0x01,
		months : 0x02,
		days : 0x03,
		hours : 0x04,
		minutes : 0x05,
		seconds : 0x06,
		milliseconds : 0x07,
		weeks : 0x08,

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
					} else if (this.milliseconds == split) {
						d.setMilliseconds(d.getMilliseconds() + time);
					} else if (this.weeks == split) {
						d.setDate(d.getDate() + time * 7);
					}
				}

				return d;
			}
		},
		
		format: function(date, format, utc) {
			return _.dateFormat(date, format, utc);
        }		
	}

	return self;
});
