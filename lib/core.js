(function (window, nodeGlobal) {
	var global = {
			jquery: (typeof(jQuery) != "undefined") ? jQuery : null
		},
		globalFunc = {},
		globalClass = {};

	// JUI의 기본 설정 값 (향후 더 추가될 수 있음)
	var globalOpts = {
		template: {
			evaluate: /<\!([\s\S]+?)\!>/g,
			interpolate: /<\!=([\s\S]+?)\!>/g,
			escape: /<\!-([\s\S]+?)\!>/g
		},
		logUrl: "tool/debug.html"
	};


	/**
	 * @class util.base
	 *
	 * jui 에서 공통적으로 사용하는 유틸리티 함수 모음
	 *
	 * ```
	 * var _ = jui.include("util.base");
	 *
	 * console.log(_.browser.webkit);
	 * ```
	 *
	 * @singleton
	 */
	var utility = global["util.base"] = {

		/**
		 * @property browser check browser agent
		 * @property {Boolean} browser.webkit  Webkit 브라우저 체크
		 * @property {Boolean} browser.mozilla  Mozilla 브라우저 체크
		 * @property {Boolean} browser.msie  IE 브라우저 체크 */
		browser: {
			webkit: ('WebkitAppearance' in document.documentElement.style) ? true : false,
			mozilla: (typeof window.mozInnerScreenX != "undefined") ? true : false,
			msie: (window.navigator.userAgent.indexOf("Trident") != -1) ? true : false
		},

		/**
		 * @property {Boolean} isTouch
		 * check touch device
		 */
		isTouch: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent),

		/**
		 * @method inherit
		 *
		 * 프로토타입 기반의 상속 제공
		 *
		 * @param {Function} ctor base Class
		 * @param {Function} superCtor super Class
		 */
		inherit: function (ctor, superCtor) {
			if (!this.typeCheck("function", ctor) || !this.typeCheck("function", superCtor)) return;

			ctor.parent = superCtor;
			ctor.prototype = new superCtor;
			ctor.prototype.constructor = ctor;
			ctor.prototype.parent = ctor.prototype;

			/**
			 * @method super
			 * call parent method
			 * @param {String} method  parent method name
			 * @param {Array} args
			 * @returns {Mixed}
			 */
			ctor.prototype.super = function (method, args) {
				return this.constructor.prototype[method].apply(this, args);
			}
		},

		/**
		 * @method extend
		 * implements object extend
		 * @param origin
		 * @param add
		 * @param skip
		 * @return {Object}
		 */
		extend: function (origin, add, skip) {
			if (!this.typeCheck([ "object", "function" ], origin)) origin = {};
			if (!this.typeCheck([ "object", "function" ], add)) return origin;

			for (var key in add) {
				if (skip === true) {
					if (isRecursive(origin[key])) {
						this.extend(origin[key], add[key], skip);
					} else if (this.typeCheck("undefined", origin[key])) {
						origin[key] = add[key];
					}
				} else {
					if (isRecursive(origin[key])) {
						this.extend(origin[key], add[key], skip);
					} else {
						origin[key] = add[key];
					}
				}
			}

			function isRecursive(value) {
				return utility.typeCheck("object", value);
			}

			return origin;
		},

		/**
		 * convert px to integer
		 * @param {String or Number} px
		 * @return {Number}
		 */
		pxToInt: function (px) {
			if (this.typeCheck("string", px) && px.indexOf("px") != -1) {
				return parseInt(px.split("px").join(""));
			}

			return px;
		},

		/**
		 * @method clone
		 * implements object clone
		 * @param {Array/Object} obj 복사할 객체
		 * @return {Array}
		 */
		clone: function (obj) {
			var clone = (this.typeCheck("array", obj)) ? [] : {};

			for (var i in obj) {
				if (this.typeCheck("object", obj[i]))
					clone[i] = this.clone(obj[i]);
				else
					clone[i] = obj[i];
			}

			return clone;
		},

		/**
		 * @method deepClone
		 * implements object deep clone
		 * @param obj
		 * @param emit
		 * @return {*}
		 */
		deepClone: function (obj, emit) {
			var value = null;
			emit = emit || {};

			if (this.typeCheck("array", obj)) {
				value = new Array(obj.length);

				for (var i = 0, len = obj.length; i < len; i++) {
					value[i] = this.deepClone(obj[i], emit);
				}
			} else if (this.typeCheck("date", obj)) {
				value = obj;
			} else if (this.typeCheck("object", obj)) {
				value = {};

				for (var key in obj) {
					if (emit[key]) {
						value[key] = obj[key];
					} else {
						value[key] = this.deepClone(obj[key], emit);
					}
				}
			} else {
				value = obj;
			}

			return value;
		},

		/**
		 * @method sort
		 * use QuickSort
		 * @param {Array} array
		 * @return {QuickSort}
		 */
		sort: function (array) {
			var QuickSort = jui.include("util.sort");
			return new QuickSort(array);
		},

		/**
		 * @method runtime
		 *
		 * caculate callback runtime
		 *
		 * @param {String} name
		 * @param {Function} callback
		 */
		runtime: function (name, callback) {
			var nStart = new Date().getTime();
			callback();
			var nEnd = new Date().getTime();

			console.log(name + " : " + (nEnd - nStart) + "ms");
		},

		/**
		 * @method template
		 * parsing template string
		 * @param html
		 * @param obj
		 */
		template: function (html, obj) {
			var tpl = jui.include("util.template");

			if (!obj) return tpl(html, null, globalOpts.template);
			else return tpl(html, obj, globalOpts.template);
		},

		/**
		 * @method resize
		 * add event in window resize event
		 * @param {Function} callback
		 * @param {Number} ms delay time
		 */
		resize: function (callback, ms) {
			var after_resize = (function () {
				var timer = 0;

				return function () {
					clearTimeout(timer);
					timer = setTimeout(callback, ms);
				}
			})();

			window.onresize = after_resize;
		},

		/**
		 * @method index
		 *
		 * IndexParser 객체 생성
		 *
		 * @return {IndexParser}
		 */
		index: function () {
			var KeyParser = jui.include("util.keyparser");
			return new KeyParser();
		},

		/**
		 * @method chunk
		 * split array by length
		 * @param {Array} arr
		 * @param {Number} len
		 * @return {Array}
		 */
		chunk: function (arr, len) {
			var chunks = [],
				i = 0,
				n = arr.length;

			while (i < n) {
				chunks.push(arr.slice(i, i += len));
			}

			return chunks;
		},

		/**
		 * @method typeCheck
		 * check data  type
		 * @param {String} t  type string
		 * @param {Object} v value object
		 * @return {Boolean}
		 */
		typeCheck: function (t, v) {
			function check(type, value) {
				if (typeof(type) != "string") return false;

				if (type == "string") {
					return (typeof(value) == "string");
				}
				else if (type == "integer") {
					return (typeof(value) == "number" && value % 1 == 0);
				}
				else if (type == "float") {
					return (typeof(value) == "number" && value % 1 != 0);
				}
				else if (type == "number") {
					return (typeof(value) == "number");
				}
				else if (type == "boolean") {
					return (typeof(value) == "boolean");
				}
				else if (type == "undefined") {
					return (typeof(value) == "undefined");
				}
				else if (type == "null") {
					return (value === null);
				}
				else if (type == "array") {
					return (value instanceof Array);
				}
				else if (type == "date") {
					return (value instanceof Date);
				}
				else if (type == "function") {
					return (typeof(value) == "function");
				}
				else if (type == "object") {
					// typeCheck에 정의된 타입일 경우에는 object 체크시 false를 반환 (date, array, null)
					return (
					typeof(value) == "object" &&
					value !== null && !(value instanceof Array) && !(value instanceof Date) && !(value instanceof RegExp)
					);
				}

				return false;
			}

			if (typeof(t) == "object" && t.length) {
				var typeList = t;

				for (var i = 0; i < typeList.length; i++) {
					if (check(typeList[i], v)) return true;
				}

				return false;
			} else {
				return check(t, v);
			}
		},
		typeCheckObj: function (uiObj, list) {
			if (typeof(uiObj) != "object") return;
			var self = this;

			for (var key in uiObj) {
				var func = uiObj[key];

				if (typeof(func) == "function") {
					(function (funcName, funcObj) {
						uiObj[funcName] = function () {
							var args = arguments,
								params = list[funcName];

							for (var i = 0; i < args.length; i++) {
								if (!self.typeCheck(params[i], args[i])) {
									throw new Error("JUI_CRITICAL_ERR: the " + i + "th parameter is not a " + params[i] + " (" + name + ")");
								}
							}

							return funcObj.apply(this, args);
						}
					})(key, func);
				}
			}
		},

		/**
		 * @method dataToCsv
		 *
		 * data 를 csv 로 변환한다.
		 *
		 * @param {Array} keys
		 * @param {Array} dataList
		 * @param {Number} dataSize
		 * @return {String}  변환된 csv 문자열
		 */
		dataToCsv: function (keys, dataList, dataSize) {
			var csv = "", len = (!dataSize) ? dataList.length : dataSize;

			for (var i = -1; i < len; i++) {
				var tmpArr = [];

				for (var j = 0; j < keys.length; j++) {
					if (keys[j]) {
						if (i == -1) {
							tmpArr.push('"' + keys[j] + '"');
						} else {
							var value = dataList[i][keys[j]];
							tmpArr.push(isNaN(value) ? '"' + value + '"' : value);
						}
					}
				}

				csv += tmpArr.join(",") + "\n";
			}

			return csv;
		},

		/**
		 * @method dataToCsv2
		 *
		 * @param {Object} options
		 * @return {String}
		 */
		dataToCsv2: function (options) {
			var csv = "";
			var opts = this.extend({
				fields: null, // required
				rows: null, // required
				names: null,
				count: (this.typeCheck("integer", options.count)) ? options.count : options.rows.length
			}, options);

			for (var i = -1; i < opts.count; i++) {
				var tmpArr = [];

				for (var j = 0; j < opts.fields.length; j++) {
					if (opts.fields[j]) {
						if (i == -1) {
							if (opts.names && opts.names[j]) {
								tmpArr.push('"' + opts.names[j] + '"');
							} else {
								tmpArr.push('"' + opts.fields[j] + '"');
							}
						} else {
							var value = opts.rows[i][opts.fields[j]];
							tmpArr.push(isNaN(value) ? '"' + value + '"' : value);
						}
					}
				}

				csv += tmpArr.join(",") + "\n";
			}

			return csv;
		},

		/**
		 * @method fileToCsv
		 *
		 * file 에서 csv 컨텐츠 로드
		 *
		 * @param {File} file
		 * @param {Function} callback
		 */
		fileToCsv: function (file, callback) {
			var reader = new FileReader();

			reader.onload = function (readerEvt) {
				if (utility.typeCheck("function", callback)) {
					callback(readerEvt.target.result);
				}
			};

			reader.readAsText(file);
		},
		/**
		 * @method csvToBase64
		 *
		 * csv 다운로드 링크로 변환
		 *
		 * @param {String} csv
		 * @return {String}
		 */
		csvToBase64: function (csv) {
			var Base64 = jui.include("util.base64");
			return "data:application/octet-stream;base64," + Base64.encode(csv);
		},
		/**
		 * @method csvToData
		 *
		 * @param {Array} keys
		 * @param {String} csv
		 * @param {Number} csvNumber
		 * @return {Array}
		 */
		csvToData: function (keys, csv, csvNumber) {
			var dataList = [],
				tmpRowArr = csv.split("\n")

			for (var i = 1; i < tmpRowArr.length; i++) {
				if (tmpRowArr[i] != "") {
					var tmpArr = tmpRowArr[i].split(","), // TODO: 값 안에 콤마(,)가 있을 경우에 별도로 처리해야 함
						data = {};

					for (var j = 0; j < keys.length; j++) {
						data[keys[j]] = tmpArr[j];

						// '"' 로 감싸져있는 문자열은 '"' 제거
						if (this.startsWith(tmpArr[j], '"') && this.endsWith(tmpArr[j], '"')) {
							data[keys[j]] = tmpArr[j].split('"').join('');
						} else {
							data[keys[j]] = tmpArr[j];
						}

						if (this.inArray(keys[j], csvNumber) != -1) {
							data[keys[j]] = parseFloat(tmpArr[j]);
						}
					}

					dataList.push(data);
				}
			}

			return dataList;
		},
		/**
		 * @method getCsvFields
		 *
		 * csv 에서 필드 얻어오기
		 *
		 * @param {Array} fields
		 * @param {Array} csvFields
		 * @return {Array}
		 */
		getCsvFields: function (fields, csvFields) {
			var tmpFields = (this.typeCheck("array", csvFields)) ? csvFields : fields;

			for (var i = 0; i < tmpFields.length; i++) {
				if (!isNaN(tmpFields[i])) {
					tmpFields[i] = fields[tmpFields[i]];
				}
			}

			return tmpFields;
		},

		/**
		 * @method svgToBase64
		 *
		 * xml 문자열로 svg datauri 생성
		 *
		 * @param {String} xml
		 * @return {String} 변환된 data uri 링크
		 */
		svgToBase64: function (xml) {
			var Base64 = jui.include("util.base64");
			return "data:image/svg+xml;base64," + Base64.encode(xml);
		},

		/**
		 * @method dateFormat
		 *
		 * implements date format function
		 *
		 * yyyy : 4 digits year
		 * yy : 2 digits year
		 * y : 1 digit year
		 *
		 * @param {Date} date
		 * @param {String} format   date format string
		 * @param utc
		 * @return {string}
		 */
		dateFormat: function (date, format, utc) {
			var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

			function ii(i, len) {
				var s = i + "";
				len = len || 2;
				while (s.length < len) s = "0" + s;
				return s;
			}

			var y = utc ? date.getUTCFullYear() : date.getFullYear();
			format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
			format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
			format = format.replace(/(^|[^\\])y/g, "$1" + y);

			var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
			format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
			format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
			format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
			format = format.replace(/(^|[^\\])M/g, "$1" + M);

			var d = utc ? date.getUTCDate() : date.getDate();
			format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
			format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
			format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
			format = format.replace(/(^|[^\\])d/g, "$1" + d);

			var H = utc ? date.getUTCHours() : date.getHours();
			format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
			format = format.replace(/(^|[^\\])H/g, "$1" + H);

			var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
			format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
			format = format.replace(/(^|[^\\])h/g, "$1" + h);

			var m = utc ? date.getUTCMinutes() : date.getMinutes();
			format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
			format = format.replace(/(^|[^\\])m/g, "$1" + m);

			var s = utc ? date.getUTCSeconds() : date.getSeconds();
			format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
			format = format.replace(/(^|[^\\])s/g, "$1" + s);

			var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
			format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
			f = Math.round(f / 10);
			format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
			f = Math.round(f / 10);
			format = format.replace(/(^|[^\\])f/g, "$1" + f);

			var T = H < 12 ? "AM" : "PM";
			format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
			format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

			var t = T.toLowerCase();
			format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
			format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

			var tz = -date.getTimezoneOffset();
			var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
			if (!utc) {
				tz = Math.abs(tz);
				var tzHrs = Math.floor(tz / 60);
				var tzMin = tz % 60;
				K += ii(tzHrs) + ":" + ii(tzMin);
			}
			format = format.replace(/(^|[^\\])K/g, "$1" + K);

			var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
			format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
			format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

			format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
			format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

			format = format.replace(/\\(.)/g, "$1");

			return format;
		},
		/**
		 * @method createId
		 *
		 * 유니크 아이디 생성
		 *
		 * @param {String} key  prefix string
		 * @return {String} 생성된 아이디 문자열
		 */
		createId: function (key) {
			return [key || "id", (+new Date), Math.round(Math.random() * 100) % 100].join("-");
		},
		/**
		 * @method btoa
		 *
		 * Base64 인코딩
		 *
		 * @return {String}
		 */
		btoa: function(input) {
			var Base64 = jui.include("util.base64");
			return Base64.encode(input);
		},
		/**
		 * @method atob
		 *
		 * Base64 디코딩
		 *
		 * @return {String}
		 */
		atob: function(input) {
			var Base64 = jui.include("util.base64");
			return Base64.decode(input);
		},

		/**
		 * implement async loop without blocking ui
		 *
		 * @param total
		 * @param context
		 * @returns {Function}
		 */
		timeLoop : function(total, context) {

			return function(callback, lastCallback) {
				function TimeLoopCallback (i) {

					if (i < 1) return;

					if (i == 1) {
						callback.call(context, i)
						lastCallback.call(context);
					} else {
						setTimeout(function() {
							if (i > -1) callback.call(context, i--);
							if (i > -1) TimeLoopCallback(i);
						}, 1);
					}
				}

				TimeLoopCallback(total);
			};
		},
		/**
		 * @method loop
		 *
		 * 최적화된 루프 생성 (5단계로 나눔)
		 *
		 * @param {Number} total
		 * @param {Object} [context=null]
		 * @return {Function} 최적화된 루프 콜백 (index, groupIndex 2가지 파라미터를 받는다.)
		 */
		loop: function (total, context) {
			var start = 0,
				end = total,
				unit = Math.ceil(total / 5);

			return function (callback) {
				var first = start, second = unit * 1, third = unit * 2, fourth = unit * 3, fifth = unit * 4,
					firstMax = second, secondMax = third, thirdMax = fourth, fourthMax = fifth, fifthMax = end;

				while (first < firstMax && first < end) {
					callback.call(context, first, 1);
					first++;

					if (second < secondMax && second < end) {
						callback.call(context, second, 2);
						second++;
					}
					if (third < thirdMax && third < end) {
						callback.call(context, third, 3);
						third++;
					}
					if (fourth < fourthMax && fourth < end) {
						callback.call(context, fourth, 4);
						fourth++;
					}
					if (fifth < fifthMax && fifth < end) {
						callback.call(context, fifth, 5);
						fifth++;
					}
				}
			};
		},

		/**
		 * @method loopArray
		 *
		 * 배열을 사용해서 최적화된 루프로 생성한다.
		 *
		 *
		 * @param {Array} data 루프로 생성될 배열
		 * @param {Object} [context=null]
		 * @return {Function} 최적화된 루프 콜백 (data, index, groupIndex 3가지 파라미터를 받는다.)
		 */
		loopArray: function (data, context) {
			var total = data.length,
				start = 0,
				end = total,
				unit = Math.ceil(total / 5);

			return function (callback) {
				var first = start, second = unit * 1, third = unit * 2, fourth = unit * 3, fifth = unit * 4,
					firstMax = second, secondMax = third, thirdMax = fourth, fourthMax = fifth, fifthMax = end;

				while (first < firstMax && first < end) {
					callback.call(context, data[first], first, 1);
					first++;
					if (second < secondMax && second < end) {
						callback.call(context, data[second], second, 2);
						second++;
					}
					if (third < thirdMax && third < end) {
						callback.call(context, data[third], third, 3);
						third++;
					}
					if (fourth < fourthMax && fourth < end) {
						callback.call(context, data[fourth], fourth, 4);
						fourth++;
					}
					if (fifth < fifthMax && fifth < end) {
						callback.call(context, data[fifth], fifth, 5);
						fifth++;
					}
				}
			};

		},

		/**
		 * @method makeIndex
		 *
		 * 배열의 키 기반 인덱스를 생성한다.
		 *
		 * 개별 값 별로 멀티 인덱스를 생성한다.
		 *
		 * @param {Array} data
		 * @param {String} keyField
		 * @return {Object} 생성된 인덱스
		 */
		makeIndex: function (data, keyField) {
			var list = {},
				func = this.loopArray(data);

			func(function (d, i) {
				var value = d[keyField];

				if (typeof list[value] == 'undefined') {
					list[value] = [];
				}

				list[value].push(i);
			});

			return list;
		},

		/**
		 * @method startsWith
		 * Check that it matches the starting string search string.
		 *
		 * @param {String} string
		 * @param {String} searchString
		 * @return {Integer} position
		 */
		startsWith: function (string, searchString, position) {
			position = position || 0;

			return string.lastIndexOf(searchString, position) === position;
		},

		/**
		 * @method endsWith
		 * Check that it matches the end of a string search string.
		 *
		 * @param {String} string
		 * @param {String} searchString
		 * @return {Integer} position
		 */
		endsWith: function (string, searchString, position) {
			var subjectString = string;

			if (position === undefined || position > subjectString.length) {
				position = subjectString.length;
			}

			position -= searchString.length;
			var lastIndex = subjectString.indexOf(searchString, position);

			return lastIndex !== -1 && lastIndex === position;
		},

		inArray: function (target, list) {
			if(!target || !list) return -1;

			for(var i = 0, len = list.length; i < len; i++) {
				if(list[i] == target)
					return i;
			}

			return -1;
		},

		trim: function(text) {
			var whitespace = "[\\x20\\t\\r\\n\\f]",
				rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" );

			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

		ready: (function() {
			var readyList,
				DOMContentLoaded,
				class2type = {};

			class2type["[object Boolean]"] = "boolean";
			class2type["[object Number]"] = "number";
			class2type["[object String]"] = "string";
			class2type["[object Function]"] = "function";
			class2type["[object Array]"] = "array";
			class2type["[object Date]"] = "date";
			class2type["[object RegExp]"] = "regexp";
			class2type["[object Object]"] = "object";

			var ReadyObj = {
				// Is the DOM ready to be used? Set to true once it occurs.
				isReady: false,
				// A counter to track how many items to wait for before
				// the ready event fires. See #6781
				readyWait: 1,
				// Hold (or release) the ready event
				holdReady: function( hold ) {
					if ( hold ) {
						ReadyObj.readyWait++;
					} else {
						ReadyObj.ready( true );
					}
				},
				// Handle when the DOM is ready
				ready: function( wait ) {
					// Either a released hold or an DOMready/load event and not yet ready
					if ( (wait === true && !--ReadyObj.readyWait) || (wait !== true && !ReadyObj.isReady) ) {
						// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
						if ( !document.body ) {
							return setTimeout( ReadyObj.ready, 1 );
						}

						// Remember that the DOM is ready
						ReadyObj.isReady = true;
						// If a normal DOM Ready event fired, decrement, and wait if need be
						if ( wait !== true && --ReadyObj.readyWait > 0 ) {
							return;
						}
						// If there are functions bound, to execute
						readyList.resolveWith( document, [ ReadyObj ] );

						// Trigger any bound ready events
						//if ( ReadyObj.fn.trigger ) {
						//  ReadyObj( document ).trigger( "ready" ).unbind( "ready" );
						//}
					}
				},
				bindReady: function() {
					if ( readyList ) {
						return;
					}
					readyList = ReadyObj._Deferred();

					// Catch cases where $(document).ready() is called after the
					// browser event has already occurred.
					if ( document.readyState === "complete" ) {
						// Handle it asynchronously to allow scripts the opportunity to delay ready
						return setTimeout( ReadyObj.ready, 1 );
					}

					// Mozilla, Opera and webkit nightlies currently support this event
					if ( document.addEventListener ) {
						// Use the handy event callback
						document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
						// A fallback to window.onload, that will always work
						window.addEventListener( "load", ReadyObj.ready, false );

						// If IE event model is used
					} else if ( document.attachEvent ) {
						// ensure firing before onload,
						// maybe late but safe also for iframes
						document.attachEvent( "onreadystatechange", DOMContentLoaded );

						// A fallback to window.onload, that will always work
						window.attachEvent( "onload", ReadyObj.ready );

						// If IE and not a frame
						// continually check to see if the document is ready
						var toplevel = false;

						try {
							toplevel = window.frameElement == null;
						} catch(e) {}

						if ( document.documentElement.doScroll && toplevel ) {
							doScrollCheck();
						}
					}
				},
				_Deferred: function() {
					var // callbacks list
						callbacks = [],
					// stored [ context , args ]
						fired,
					// to avoid firing when already doing so
						firing,
					// flag to know if the deferred has been cancelled
						cancelled,
					// the deferred itself
						deferred  = {

							// done( f1, f2, ...)
							done: function() {
								if ( !cancelled ) {
									var args = arguments,
										i,
										length,
										elem,
										type,
										_fired;
									if ( fired ) {
										_fired = fired;
										fired = 0;
									}
									for ( i = 0, length = args.length; i < length; i++ ) {
										elem = args[ i ];
										type = ReadyObj.type( elem );
										if ( type === "array" ) {
											deferred.done.apply( deferred, elem );
										} else if ( type === "function" ) {
											callbacks.push( elem );
										}
									}
									if ( _fired ) {
										deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
									}
								}
								return this;
							},

							// resolve with given context and args
							resolveWith: function( context, args ) {
								if ( !cancelled && !fired && !firing ) {
									// make sure args are available (#8421)
									args = args || [];
									firing = 1;
									try {
										while( callbacks[ 0 ] ) {
											callbacks.shift().apply( context, args );//shifts a callback, and applies it to document
										}
									}
									finally {
										fired = [ context, args ];
										firing = 0;
									}
								}
								return this;
							},

							// resolve with this as context and given arguments
							resolve: function() {
								deferred.resolveWith( this, arguments );
								return this;
							},

							// Has this deferred been resolved?
							isResolved: function() {
								return !!( firing || fired );
							},

							// Cancel
							cancel: function() {
								cancelled = 1;
								callbacks = [];
								return this;
							}
						};

					return deferred;
				},
				type: function( obj ) {
					return obj == null ?
						String( obj ) :
					class2type[ Object.prototype.toString.call(obj) ] || "object";
				}
			}
			// The DOM ready check for Internet Explorer
			function doScrollCheck() {
				if ( ReadyObj.isReady ) {
					return;
				}

				try {
					// If IE is used, use the trick by Diego Perini
					// http://javascript.nwbox.com/IEContentLoaded/
					document.documentElement.doScroll("left");
				} catch(e) {
					setTimeout( doScrollCheck, 1 );
					return;
				}

				// and execute any waiting functions
				ReadyObj.ready();
			}
			// Cleanup functions for the document ready method
			if ( document.addEventListener ) {
				DOMContentLoaded = function() {
					document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
					ReadyObj.ready();
				};

			} else if ( document.attachEvent ) {
				DOMContentLoaded = function() {
					// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
					if ( document.readyState === "complete" ) {
						document.detachEvent( "onreadystatechange", DOMContentLoaded );
						ReadyObj.ready();
					}
				};
			}
			function ready( fn ) {
				// Attach the listeners
				ReadyObj.bindReady();

				var type = ReadyObj.type( fn );

				// Add the callback
				readyList.done( fn );//readyList is result of _Deferred()
			}

			return ready;
		})(),

		param: function(data) {
			var r20 = /%20/g,
				s = [],
				add = function(key, value) {
					// If value is a function, invoke it and return its value
					value = utility.typeCheck("function", value) ? value() : (value == null ? "" : value);
					s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
				};

			for(var key in data) {
				add(key, data[key]);
			}

			return s.join("&").replace(r20, "+");
		},

		ajax: function(data) {
			var xhr = null, paramStr = "", callback = null;

			var opts = utility.extend({
				url: null,
				type: "GET",
				data: null,
				async: true,
				success: null,
				fail: null
			}, data);

			if(!this.typeCheck("string", opts.url) || !this.typeCheck("function", opts.success))
				return;

			if(this.typeCheck("object", opts.data))
				paramStr = this.param(opts.data);

			if(!this.typeCheck("undefined", XMLHttpRequest)) {
				xhr = new XMLHttpRequest();
			} else {
				var versions = [
					"MSXML2.XmlHttp.5.0",
					"MSXML2.XmlHttp.4.0",
					"MSXML2.XmlHttp.3.0",
					"MSXML2.XmlHttp.2.0",
					"Microsoft.XmlHttp"
				];

				for(var i = 0, len = versions.length; i < len; i++) {
					try {
						xhr = new ActiveXObject(versions[i]);
						break;
					}
					catch(e) {}
				}
			}

			if(xhr != null) {
				xhr.open(opts.type, opts.url, opts.async);
				xhr.send(paramStr);

				callback = function() {
					if (xhr.readyState === 4 && xhr.status == 200) {
						opts.success(xhr);
					} else {
						if (utility.typeCheck("function", opts.fail)) {
							opts.fail(xhr);
						}
					}
				}

				if (!opts.async) {
					callback();
				} else {
					xhr.onreadystatechange = callback;
				}
			}
		},

		scrollWidth: function() {
			var inner = document.createElement("p");
			inner.style.width = "100%";
			inner.style.height = "200px";

			var outer = document.createElement("div");
			outer.style.position = "absolute";
			outer.style.top = "0px";
			outer.style.left = "0px";
			outer.style.visibility = "hidden";
			outer.style.width = "200px";
			outer.style.height = "150px";
			outer.style.overflow = "hidden";
			outer.appendChild(inner);

			document.body.appendChild(outer);
			var w1 = inner.offsetWidth;
			outer.style.overflow = "scroll";
			var w2 = inner.offsetWidth;
			if (w1 == w2) w2 = outer.clientWidth;
			document.body.removeChild(outer);

			return (w1 - w2);
		}
	}


	/*
	 * Module related functions
	 *
	 */
	var getDepends = function (depends) {
		var args = [];

		for (var i = 0; i < depends.length; i++) {
			var module = global[depends[i]];

			if (!utility.typeCheck([ "function", "object" ], module)) {
				var modules = getModules(depends[i]);

				if (modules == null) {
					console.log("JUI_WARNING_MSG: '" + depends[i] + "' is not loaded");
					args.push(null);
				} else {
					args.push(modules);
				}

			} else {
				args.push(module);
			}
		}

		return args;
	}

	var getModules = function (parent) {
		var modules = null,
			parent = parent + ".";

		for (var key in global) {
			if (key.indexOf(parent) != -1) {
				if (utility.typeCheck([ "function", "object" ], global[key])) {
					var child = key.split(parent).join("");

					if (child.indexOf(".") == -1) {
						if (modules == null) {
							modules = {};
						}

						modules[child] = global[key];
					}
				}
			}
		}

		return modules;
	}

	/**
	 * @class jui
	 *
	 * Global Object
	 *
	 * @singleton
	 */
	window.jui = nodeGlobal.jui = {

		/**
		 * @method ready
		 *
		 * ready 타임에 실행될 callback 정의
		 *
		 * @param {Function} callback
		 */
		ready: function () {
			var args = [],
				callback = (arguments.length == 2) ? arguments[1] : arguments[0],
				depends = (arguments.length == 2) ? arguments[0] : null;

			if (!utility.typeCheck([ "array", "null" ], depends) || !utility.typeCheck("function", callback)) {
				throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
			}

			utility.ready(function() {
				if (depends) {
					args = getDepends(depends);
				} else {
					// @Deprecated 기존의 레거시를 위한 코드
					var ui = getModules("ui"),
						uix = {};

					utility.extend(uix, ui);
					utility.extend(uix, getModules("grid"));

					args = [ ui, uix, utility ];
				}

				callback.apply(null, args);
			});
		},

		/**
		 * @method defineUI
		 *
		 * 사용자가 실제로 사용할 수 있는 UI 클래스를 정의
		 *
		 * @param {String} name 모듈 로드와 상속에 사용될 이름을 정한다.
		 * @param {Array} depends 'define'이나 'defineUI'로 정의된 클래스나 객체를 인자로 받을 수 있다.
		 * @param {Function} callback UI 클래스를 해당 콜백 함수 내에서 클래스 형태로 구현하고 리턴해야 한다.
		 */
		defineUI: function (name, depends, callback, parent) {
			if (!utility.typeCheck("string", name) || !utility.typeCheck("array", depends) ||
				!utility.typeCheck("function", callback) || !utility.typeCheck(["string", "undefined"], parent)) {
				throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
			}

			if (utility.typeCheck("function", globalClass[name])) {
				throw new Error("JUI_CRITICAL_ERR: '" + name + "' is already exist");
			}

			if (utility.typeCheck("undefined", parent)) { // 기본적으로 'event' 클래스를 상속함
				parent = "event";
			}

			if (!utility.typeCheck("function", globalClass[parent])) {
				throw new Error("JUI_CRITICAL_ERR: Parents are the only function");
			} else {
				if (globalFunc[parent] !== true) {
					throw new Error("JUI_CRITICAL_ERR: UI function can not be inherited");
				}
			}

			var args = getDepends(depends),
				uiFunc = callback.apply(null, args);

			// 상속
			utility.inherit(uiFunc, globalClass[parent]);

			// UI 고유 설정
			global[name] = globalClass[parent].init({
				type: name,
				"class": uiFunc
			});

			globalClass[name] = uiFunc;
			globalFunc[name] = true;

			// support AMD module
			if (typeof define == "function" && define.amd) {
				define(name, function () {
					return global[name]
				});
			}
		},

		createUIObject: function (UI, selector, index, elem, options, afterHook) {
			var mainObj = new UI["class"]();

			// Check Options
			var opts = jui.defineOptions(UI["class"], options || {});

			// Public Properties
			mainObj.init.prototype = mainObj;
			/** @property {String/HTMLElement} selector */
			mainObj.init.prototype.selector = selector;
			/** @property {HTMLElement} root */
			mainObj.init.prototype.root = elem;
			/** @property {Object} options */
			mainObj.init.prototype.options = opts;
			/** @property {Object} tpl Templates */
			mainObj.init.prototype.tpl = {};
			/** @property {Array} event Custom events */
			mainObj.init.prototype.event = new Array(); // Custom Event
			/** @property {Integer} timestamp UI Instance creation time*/
			mainObj.init.prototype.timestamp = new Date().getTime();
			/** @property {Integer} index Index of UI instance*/
			mainObj.init.prototype.index = index;
			/** @property {Class} module Module class */
			mainObj.init.prototype.module = UI;

			// UI 객체 프로퍼티를 외부에서 정의할 수 있음 (jQuery 의존성 제거를 위한 코드)
			if(utility.typeCheck("function", afterHook)) {
				afterHook(mainObj, opts);
			}

			// Script-based Template Settings
			for (var name in opts.tpl) {
				var tplHtml = opts.tpl[name];

				if (utility.typeCheck("string", tplHtml) && tplHtml != "") {
					mainObj.init.prototype.tpl[name] = utility.template(tplHtml);
				}
			}

			var uiObj = new mainObj.init();

			// Custom Event Setting
			for(var key in opts.event) {
				uiObj.on(key, opts.event[key]);
			}

			// 엘리먼트 객체에 jui 속성 추가
			elem.jui = uiObj;

			return uiObj;
		},

		/**
		 * @method define
		 *
		 * UI 클래스에서 사용될 클래스를 정의하고, 자유롭게 상속할 수 있는 클래스를 정의
		 *
		 * @param {String} name 모듈 로드와 상속에 사용될 이름을 정한다.
		 * @param {Array} depends 'define'이나 'defineUI'로 정의된 클래스나 객체를 인자로 받을 수 있다.
		 * @param {Function} callback UI 클래스를 해당 콜백 함수 내에서 클래스 형태로 구현하고 리턴해야 한다.
		 * @param {String} parent 상속받을 클래스
		 */
		define: function (name, depends, callback, parent) {
			if (!utility.typeCheck("string", name) || !utility.typeCheck("array", depends) || !utility.typeCheck("function", callback) || !utility.typeCheck(["string", "undefined"], parent)) {

				throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
			}

			if (utility.typeCheck("function", globalClass[name])) {
				throw new Error("JUI_CRITICAL_ERR: '" + name + "' is already exist");
			}

			var args = getDepends(depends),
				uiFunc = callback.apply(null, args);

			if (utility.typeCheck("function", globalClass[parent])) {
				if (globalFunc[parent] !== true) {
					throw new Error("JUI_CRITICAL_ERR: UI function can not be inherited");
				} else {
					utility.inherit(uiFunc, globalClass[parent]);
				}
			}

			// 함수 고유 설정
			global[name] = uiFunc;
			globalClass[name] = uiFunc; // original function
			globalFunc[name] = true;

			// support AMD module
			if (typeof define == "function" && define.amd) {
				define(name, function () {
					return global[name]
				});
			}
		},

		/**
		 * @method defineOptions
		 *
		 * 모듈 기본 옵션 정의
		 *
		 * @param {Object} Module
		 * @param {Object} options
		 * @param {Object} exceptOpts
		 * @return {Object}
		 */
		defineOptions: function (Module, options, exceptOpts) {
			var defOpts = getOptions(Module, {});
			var defOptKeys = Object.keys(defOpts),
				optKeys = Object.keys(options);

			// 정의되지 않은 옵션 사용 유무 체크
			for (var i = 0; i < optKeys.length; i++) {
				var name = optKeys[i];

				if (utility.inArray(name, defOptKeys) == -1 && utility.inArray(name, exceptOpts) == -1) {
					throw new Error("JUI_CRITICAL_ERR: '" + name + "' is not an option");
				}
			}

			// 사용자 옵션 + 기본 옵션
			utility.extend(options, defOpts, true);

			// 상위 모듈의 옵션까지 모두 얻어오는 함수
			function getOptions(Module, options) {
				if (utility.typeCheck("function", Module)) {
					if (utility.typeCheck("function", Module.setup)) {
						var opts = Module.setup();

						for (var key in opts) {
							if (utility.typeCheck("undefined", options[key])) {
								options[key] = opts[key];
							}
						}
					}

					getOptions(Module.parent, options);
				}

				return options;
			}

			return options;
		},

		/**
		 * define과 defineUI로 정의된 클래스 또는 객체를 가져온다.
		 *
		 * @param name 가져온 클래스 또는 객체의 이름
		 * @return {*}
		 */
		include: function (name) {
			if (!utility.typeCheck("string", name)) {
				throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
			}

			var module = global[name];

			if (utility.typeCheck(["function", "object"], module)) {
				return module;
			} else {
				var modules = getModules(name);

				if (modules == null) {
					console.log("JUI_WARNING_MSG: '" + name + "' is not loaded");
					return null;
				} else {
					return modules;
				}
			}
		},

		/**
		 * define과 defineUI로 정의된 모든 클래스와 객체를 가져온다.
		 *
		 * @return {Array}
		 */
		includeAll: function () {
			var result = [];

			for (var key in global) {
				result.push(global[key]);
			}

			return result;
		},

		/**
		 * 설정된 jui 관리 화면을 윈도우 팝업으로 띄운다.
		 *
		 * @param logUrl
		 * @return {Window}
		 */
		log: function (logUrl) {
			var jui_mng = window.open(
				logUrl || globalOpts.logUrl,
				"JUIM",
				"width=1024, height=768, toolbar=no, menubar=no, resizable=yes"
			);

			jui.debugAll(function (log, str) {
				jui_mng.log(log, str);
			});

			return jui_mng;
		},

		setup: function (options) {
			if (utility.typeCheck("object", options)) {
				globalOpts = utility.extend(globalOpts, options);
			}

			return globalOpts;
		}
	};
})(window, (typeof(global) !== "undefined") ? global : window);

jui.define("util.dom", [ "util.base" ], function(_) {
    return {
        find: function() {
            var args = arguments;

            if(args.length == 1) {
                if(_.typeCheck("string", args[0])) {
                    return document.querySelectorAll(args[0]);
                }
            } else if(args.length == 2) {
                if(_.typeCheck("object", args[0]) && _.typeCheck("string", args[1])) {
                    return args[0].querySelectorAll(args[1]);
                }
            }

            return [];
        },

        each: function(selectorOrElements, callback) {
            if(!_.typeCheck("function", callback)) return;

            var elements = null;

            if(_.typeCheck("string", selectorOrElements)) {
                elements = document.querySelectorAll(selectorOrElements);
            } else if(_.typeCheck("array", selectorOrElements)) {
                elements = selectorOrElements;
            }

            if(elements != null) {
                Array.prototype.forEach.call(elements, function(el, i) {
                    callback.apply(el, [ i, el ]);
                });
            }
        },

        attr: function(selectorOrElements, keyOrAttributes) {
            if(!_.typeCheck([ "string", "array" ], selectorOrElements))
                return;

            var elements = document.querySelectorAll(selectorOrElements);

            if(_.typeCheck("object", keyOrAttributes)) { // set
                for(var i = 0; i < elements.length; i++) {
                    for(var key in keyOrAttributes) {
                        elements[i].setAttribute(key, keyOrAttributes[key]);
                    }
                }
            } else if(_.typeCheck("string", keyOrAttributes)) { // get
                if(elements.length > 0) {
                    return elements[0].getAttribute(keyOrAttributes);
                }
            }
        },

        remove: function(selectorOrElements) {
            this.each(selectorOrElements, function() {
                this.parentNode.removeChild(this);
            });
        },

        offset: function(elem) {
            function isWindow(obj) {
                /* jshint eqeqeq: false */
                return obj != null && obj == obj.window;
            }

            function getWindow(elem) {
                return isWindow(elem) ?
                    elem :
                    elem.nodeType === 9 ?
                    elem.defaultView || elem.parentWindow :
                        false;
            }

            var docElem, win,
                box = { top: 0, left: 0 },
                doc = elem && elem.ownerDocument;

            if ( !doc ) {
                return;
            }

            docElem = doc.documentElement;

            // Make sure it's not a disconnected DOM node
            /*/
             if ( !global.jquery.contains( docElem, elem ) ) {
             return box;
             }
             /**/

            // If we don't have gBCR, just use 0,0 rather than error
            // BlackBerry 5, iOS 3 (original iPhone)
            var strundefined = typeof undefined;
            if ( typeof elem.getBoundingClientRect !== strundefined ) {
                box = elem.getBoundingClientRect();
            }
            win = getWindow( doc );

            return {
                top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
                left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
            };
        }
    }
});
jui.define("util.sort", [], function() {

    /**
     * @class QuickSort
     *
     * �� ����
     *
     * @param {Array} array
     * @param {Boolean} isClone  isClone �� true �̸�, �ش� �迭�� �������� �ʰ� �����ؼ� ó��
     * @constructor
     * @private
     */
    var QuickSort = function (array, isClone) {
        var compareFunc = null,
            array = (isClone) ? array.slice(0) : array;

        function swap(indexA, indexB) {
            var temp = array[indexA];

            array[indexA] = array[indexB];
            array[indexB] = temp;
        }

        function partition(pivot, left, right) {
            var storeIndex = left, pivotValue = array[pivot];
            swap(pivot, right);

            for (var v = left; v < right; v++) {
                if (compareFunc(array[v], pivotValue) || !compareFunc(pivotValue, array[v]) && v % 2 == 1) {
                    swap(v, storeIndex);
                    storeIndex++;
                }
            }

            swap(right, storeIndex);

            return storeIndex;
        }

        this.setCompare = function (func) {
            compareFunc = func;
        }

        this.run = function (left, right) {
            var pivot = null;

            if (typeof left !== 'number') {
                left = 0;
            }

            if (typeof right !== 'number') {
                right = array.length - 1;
            }

            if (left < right) {
                pivot = left + Math.ceil((right - left) * 0.5);
                newPivot = partition(pivot, left, right);

                this.run(left, newPivot - 1);
                this.run(newPivot + 1, right);
            }

            return array;
        }
    }

    return QuickSort;
});
jui.define("util.keyparser", [], function() {

    /**
     * @class KeyParser
     *
     * 0.0.1 ������ Ű ���ڿ��� �����ϴ� Ŭ����
     *
     * @private
     * @constructor
     */
    var KeyParser = function () {
        /**
         * @method isIndexDepth
         *
         * @param {String} index
         * @return {Boolean}
         */
        this.isIndexDepth = function (index) {
            if (typeof(index) == "string" && index.indexOf(".") != -1) {
                return true;
            }

            return false;
        }

        /**
         * @method getIndexList
         *
         * @param {String} index
         * @return {Array}
         */
        this.getIndexList = function (index) { // Ʈ�� ������ ���� Ű�� �迭 ���·� ��ȯ
            var resIndex = [], strIndex = "" + index;

            if (strIndex.length == 1) {
                resIndex[0] = parseInt(index);
            } else {
                var keys = strIndex.split(".");

                for (var i = 0; i < keys.length; i++) {
                    resIndex[i] = parseInt(keys[i]);
                }
            }

            return resIndex;
        }


        /**
         * @method changeIndex
         *
         *
         * @param {String} index
         * @param {String} targetIndex
         * @param {String} rootIndex
         * @return {String}
         */
        this.changeIndex = function (index, targetIndex, rootIndex) {
            var rootIndexLen = this.getIndexList(rootIndex).length,
                indexList = this.getIndexList(index),
                tIndexList = this.getIndexList(targetIndex);

            for (var i = 0; i < rootIndexLen; i++) {
                indexList.shift();
            }

            return tIndexList.concat(indexList).join(".");
        }

        /**
         * @method getNextIndex
         *
         * @param {String} index
         * @return {String}
         */
        this.getNextIndex = function (index) { // ���� �ε������� +1
            var indexList = this.getIndexList(index),
                no = indexList.pop() + 1;

            indexList.push(no);
            return indexList.join(".");
        }

        /**
         * @method getParentIndex
         *
         *
         * @param {String} index
         * @returns {*}
         */
        this.getParentIndex = function (index) {
            if (!this.isIndexDepth(index)) return null;
            var keys = this.getIndexList(index);

            if (keys.length == 2) {
                return "" + keys[0];
            } else if (keys.length > 2) {
                keys.pop();
                return keys.join(".");
            }
        }
    }

    return KeyParser;
});
jui.define("util.base64", [], function() {
    /**
     * Private Static Classes
     *
     */
    var Base64 = {

        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                    Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = Base64._keyStr.indexOf(input.charAt(i++));
                enc2 = Base64._keyStr.indexOf(input.charAt(i++));
                enc3 = Base64._keyStr.indexOf(input.charAt(i++));
                enc4 = Base64._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");

            // BOM �ڵ� ���� (UTF-8 ����)
            var utftext = String.fromCharCode(239) + String.fromCharCode(187) + String.fromCharCode(191);

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }
    }

    return Base64;
});
jui.define("util.template", [], function() {
    var template = function (text, data, settings) {
        var _ = {},
            breaker = {};

        var ArrayProto = Array.prototype,
            slice = ArrayProto.slice,
            nativeForEach = ArrayProto.forEach;

        var escapes = {
            '\\': '\\',
            "'": "'",
            'r': '\r',
            'n': '\n',
            't': '\t',
            'u2028': '\u2028',
            'u2029': '\u2029'
        };

        for (var p in escapes)
            escapes[escapes[p]] = p;

        var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g,
            unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g,
            noMatch = /.^/;

        var unescape = function (code) {
            return code.replace(unescaper, function (match, escape) {
                return escapes[escape];
            });
        };

        var each = _.each = _.forEach = function (obj, iterator, context) {
            if (obj == null)
                return;
            if (nativeForEach && obj.forEach === nativeForEach) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (i in obj && iterator.call(context, obj[i], i, obj) === breaker)
                        return;
                }
            } else {
                for (var key in obj) {
                    if (_.has(obj, key)) {
                        if (iterator.call(context, obj[key], key, obj) === breaker)
                            return;
                    }
                }
            }
        };

        _.has = function (obj, key) {
            return hasOwnProperty.call(obj, key);
        };

        _.defaults = function (obj) {
            each(slice.call(arguments, 1), function (source) {
                for (var prop in source) {
                    if (obj[prop] == null)
                        obj[prop] = source[prop];
                }
            });
            return obj;
        };

        _.template = function (text, data, settings) {
            settings = _.defaults(settings || {});

            var source = "__p+='" + text.replace(escaper, function (match) {
                    return '\\' + escapes[match];
                }).replace(settings.escape || noMatch, function (match, code) {
                    return "'+\n_.escape(" + unescape(code) + ")+\n'";
                }).replace(settings.interpolate || noMatch, function (match, code) {
                    return "'+\n(" + unescape(code) + ")+\n'";
                }).replace(settings.evaluate || noMatch, function (match, code) {
                    return "';\n" + unescape(code) + "\n;__p+='";
                }) + "';\n";

            if (!settings.variable)
                source = 'with(obj||{}){\n' + source + '}\n';

            source = "var __p='';" + "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + source + "return __p;\n";

            var render = new Function(settings.variable || 'obj', '_', source);
            if (data)
                return render(data, _);
            var template = function (data) {
                return render.call(this, data, _);
            };

            template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

            return template;
        };

        return _.template(text, data, settings);
    }

    return template;
});
jui.define("util.math", [ "util.base" ], function(_) {

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

	// 2x2 or 3x3 or ?x? 형태의 매트릭스 연산
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

	function matrix3d(a, b) {
		var m = new Float32Array(4);

		m[0] = a[0][0] * b[0] + a[0][1] * b[1] + a[0][2] * b[2]  + a[0][3] * b[3];
		m[1] = a[1][0] * b[0] + a[1][1] * b[1] + a[1][2] * b[2]  + a[1][3] * b[3];
		m[2] = a[2][0] * b[0] + a[2][1] * b[1] + a[2][2] * b[2]  + a[2][3] * b[3];
		m[3] = a[3][0] * b[0] + a[3][1] * b[1] + a[3][2] * b[2]  + a[3][3] * b[3];

		return m;
	}

	function deepMatrix3d(a, b) {
		var nm = [
			new Float32Array(4),
			new Float32Array(4),
			new Float32Array(4),
			new Float32Array(4)
		];

		var m = [
			new Float32Array([b[0][0],b[1][0],b[2][0],b[3][0]]),
			new Float32Array([b[0][1],b[1][1],b[2][1],b[3][1]]),
			new Float32Array([b[0][2],b[1][2],b[2][2],b[3][2]]),
			new Float32Array([b[0][3],b[1][3],b[2][3],b[3][3]])
		];

		nm[0][0] = a[0][0] * m[0][0] + a[0][1] * m[0][1] + a[0][2] * m[0][2]  + a[0][3] * m[0][3];
		nm[1][0] = a[1][0] * m[0][0] + a[1][1] * m[0][1] + a[1][2] * m[0][2]  + a[1][3] * m[0][3];
		nm[2][0] = a[2][0] * m[0][0] + a[2][1] * m[0][1] + a[2][2] * m[0][2]  + a[2][3] * m[0][3];
		nm[3][0] = a[3][0] * m[0][0] + a[3][1] * m[0][1] + a[3][2] * m[0][2]  + a[3][3] * m[0][3];

		nm[0][1] = a[0][0] * m[1][0] + a[0][1] * m[1][1] + a[0][2] * m[1][2]  + a[0][3] * m[1][3];
		nm[1][1] = a[1][0] * m[1][0] + a[1][1] * m[1][1] + a[1][2] * m[1][2]  + a[1][3] * m[1][3];
		nm[2][1] = a[2][0] * m[1][0] + a[2][1] * m[1][1] + a[2][2] * m[1][2]  + a[2][3] * m[1][3];
		nm[3][1] = a[3][0] * m[1][0] + a[3][1] * m[1][1] + a[3][2] * m[1][2]  + a[3][3] * m[1][3];

		nm[0][2] = a[0][0] * m[2][0] + a[0][1] * m[2][1] + a[0][2] * m[2][2]  + a[0][3] * m[2][3];
		nm[1][2] = a[1][0] * m[2][0] + a[1][1] * m[2][1] + a[1][2] * m[2][2]  + a[1][3] * m[2][3];
		nm[2][2] = a[2][0] * m[2][0] + a[2][1] * m[2][1] + a[2][2] * m[2][2]  + a[2][3] * m[2][3];
		nm[3][2] = a[3][0] * m[2][0] + a[3][1] * m[2][1] + a[3][2] * m[2][2]  + a[3][3] * m[2][3];

		nm[0][3] = a[0][0] * m[3][0] + a[0][1] * m[3][1] + a[0][2] * m[3][2]  + a[0][3] * m[3][3];
		nm[1][3] = a[1][0] * m[3][0] + a[1][1] * m[3][1] + a[1][2] * m[3][2]  + a[1][3] * m[3][3];
		nm[2][3] = a[2][0] * m[3][0] + a[2][1] * m[3][1] + a[2][2] * m[3][2]  + a[2][3] * m[3][3];
		nm[3][3] = a[3][0] * m[3][0] + a[3][1] * m[3][1] + a[3][2] * m[3][2]  + a[3][3] * m[3][3];

		return nm;
	}


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
				return Math.round((a * pow) + (b * pow)) / pow;
			};

			func.minus = function (a, b) {
				return Math.round((a * pow) - (b * pow)) / pow;
			};

			func.multi = function (a, b) {
				return Math.round((a * pow) * (b * pow)) / (pow*pow);
			};

			func.div = function (a, b) {
				var result = (a * pow) / (b * pow);
				var pow2 = Math.pow(10, this.getFixed(result, 0));
				return Math.round(result*pow2) / pow2;
			};

			func.remain = function (a, b) {
				return Math.round((a * pow) % (b * pow)) / pow;
			};

			return func;
		},

		round: function (num, fixed) {
			var fixedNumber = Math.pow(10, fixed);

			return Math.round(num * fixedNumber) / fixedNumber;
		},

		plus : function (a, b) {
			var pow = Math.pow(10, this.getFixed(a, b));

			return Math.round((a * pow) + (b * pow)) / pow;
		},

		minus : function (a, b) {
			var pow = Math.pow(10, this.getFixed(a, b));
			return Math.round((a * pow) - (b * pow)) / pow;
		},

		multi : function (a, b) {
			var pow = Math.pow(10, this.getFixed(a, b));
			return Math.round((a * pow) * (b * pow)) / (pow*pow);
		},

		div : function (a, b) {
			var pow = Math.pow(10, this.getFixed(a, b));

			var result = (a * pow) / (b * pow);
			var pow2 = Math.pow(10, this.getFixed(result, 0));
			return Math.round(result*pow2) / pow2;
		},

		remain : function (a, b) {
			var pow = Math.pow(10, this.getFixed(a, b));
			return Math.round((a * pow) % (b * pow)) / pow;
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
			if(_.typeCheck("array", b[0])) {
				return deepMatrix(a, b);
			}

			return matrix(a, b);
		},

		matrix3d: function(a, b) {
			if(b[0] instanceof Array || b[0] instanceof Float32Array) {
				return deepMatrix3d(a, b);
			}

			return matrix3d(a, b);
		},

		scaleValue: function(value, minValue, maxValue, minScale, maxScale) {
			// 최소/최대 값이 같을 경우 처리
			minValue = (minValue == maxValue) ? 0 : minValue;

			var range = maxScale - minScale,
				tg = range * getPer();

			function getPer() {
				var range = maxValue - minValue,
					tg = value - minValue,
					per = tg / range;

				return per;
			}

			return tg + minScale;
		}
	}

	return self;
});

jui.define("util.transform", [ "util.math" ], function(math) {
    var Transform = function(points) {
        function calculate(m) {
            for(var i = 0, count = points.length; i < count; i++) {
                points[i] = math.matrix(m, points[i]);
            }

            return points;
        }

        // 매트릭스 맵
        this.matrix = function() {
            var a = arguments,
                type = a[0];

            if(type == "move") {
                return [
                    new Float32Array([1, 0, a[1]]),
                    new Float32Array([0, 1, a[2]]),
                    new Float32Array([0, 0, 1])
                ];
            } else if(type == "scale") {
                return [
                    new Float32Array([ a[1], 0, 0 ]),
                    new Float32Array([ 0, a[2], 0 ]),
                    new Float32Array([ 0, 0, 1 ])
                ];
            } else if(type == "rotate") {
                return [
                    new Float32Array([ Math.cos(math.radian(a[1])), -Math.sin(math.radian(a[1])), 0 ]),
                    new Float32Array([ Math.sin(math.radian(a[1])), Math.cos(math.radian(a[1])), 0 ]),
                    new Float32Array([ 0, 0, 1 ])
                ];
            } else if(type == "move3d") {
                return [
                    new Float32Array([ 1, 0, 0, a[1] ]),
                    new Float32Array([ 0, 1, 0, a[2] ]),
                    new Float32Array([ 0, 0, 1, a[3] ]),
                    new Float32Array([ 0, 0, 0, 1 ])
                ];
            } else if(type == "scale3d") {
                return [
                    new Float32Array([ a[1], 0, 0, 0 ]),
                    new Float32Array([ 0, a[2], 0, 0 ]),
                    new Float32Array([ 0, 0, a[3], 0 ]),
                    new Float32Array([ 0, 0, 0, 1 ])
                ];
            } else if(type == "rotate3dz") {
                return [
                    new Float32Array([ Math.cos(math.radian(a[1])), -Math.sin(math.radian(a[1])), 0, 0 ]),
                    new Float32Array([ Math.sin(math.radian(a[1])), Math.cos(math.radian(a[1])), 0, 0 ]),
                    new Float32Array([ 0, 0, 1, 0 ]),
                    new Float32Array([ 0, 0, 0, 1 ])
                ];
            } else if(type == "rotate3dx") {
                return [
                    new Float32Array([ 1, 0, 0, 0 ]),
                    new Float32Array([ 0, Math.cos(math.radian(a[1])), -Math.sin(math.radian(a[1])), 0 ]),
                    new Float32Array([ 0, Math.sin(math.radian(a[1])), Math.cos(math.radian(a[1])), 0 ]),
                    new Float32Array([ 0, 0, 0, 1 ])
                ];
            } else if(type == "rotate3dy") {
                return [
                    new Float32Array([ Math.cos(math.radian(a[1])), 0, Math.sin(math.radian(a[1])), 0 ]),
                    new Float32Array([ 0, 1, 0, 0 ]),
                    new Float32Array([ -Math.sin(math.radian(a[1])), 0, Math.cos(math.radian(a[1])), 0 ]),
                    new Float32Array([ 0, 0, 0, 1 ])
                ];
            }
        }

        // 2차원 이동
        this.move = function(dx, dy) {
            return calculate(this.matrix("move", dx, dy));
        }

        // 3차원 이동
        this.move3d = function(dx, dy, dz) {
            return calculate(this.matrix("move3d", dx, dy, dz));
        }

        // 2차원 스케일
        this.scale = function(sx, sy) {
            return calculate(this.matrix("scale", sx, sy));
        }

        // 3차원 스케일
        this.scale3d = function(sx, sy, sz) {
            return calculate(this.matrix("scale3d", sx, sy, sz));
        }

        // 2차원 회전
        this.rotate = function(angle) {
            return calculate(this.matrix("rotate", angle));
        }

        // Z축 중심 3차원 회전 - 롤(ROLL)
        this.rotate3dz = function(angle) {
            return calculate(this.matrix("rotate3dz", angle));
        }

        // X축 중심 3차원 회전 - 롤(PITCH)
        this.rotate3dx = function(angle) {
            return calculate(this.matrix("rotate3dx", angle));
        }

        // Y축 중심 3차원 회전 - 요(YAW)
        this.rotate3dy = function(angle) {
            return calculate(this.matrix("rotate3dy", angle));
        }

        // 임의의 행렬 처리
        this.custom = function(m) {
            return calculate(m);
        }

        // 행렬의 병합
        this.merge = function() {
            var a = arguments,
                m = this.matrix.apply(this, a[0]);

            for(var i = 1; i < a.length; i++) {
                m = math.matrix(m, this.matrix.apply(this, a[i]));
            }

            return calculate(m);
        }

        // 행렬의 병합 (콜백 형태)
        this.merge2 = function(callback) {
            for(var i = 0, count = points.length; i < count; i++) {
                var a = callback.apply(null, points[i]),
                    m = this.matrix.apply(this, a[0]);

                for(var j = 1; j < a.length; j++) {
                    m = math.matrix(m, this.matrix.apply(this, a[j]));
                }

                points[i] = math.matrix(m, points[i]);
            }
        }
    }

    return Transform;
});
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
			var rate = 0;

			var callFunction = null;
			var _rangeBand = null;

			function func(x) {

				if (domainMax < x) {
					if (_isClamp) {
						return func(domainMax);
					}

					return _range[0] + Math.abs(x - _domain[0]) * rate;
				} else if (domainMin > x) {
					if (_isClamp) {
						return func(domainMin);
					}

					return _range[0] - Math.abs(x - _domain[0]) * rate;
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

				rate = distRange / distDomain;

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

jui.define("util.color", [ "util.math" ], function(math) {

	/**
	 *  @class util.color
	 * color parser for chart
	 * @singleton
	 */
	var self = {

		regex  : /(linear|radial)\((.*)\)(.*)/i,

		format : function(obj, type) {
			if (type == 'hex') {
				var r = obj.r.toString(16);
				if (obj.r < 16) r = "0" + r;

				var g = obj.g.toString(16);
				if (obj.g < 16) g = "0" + g;

				var b = obj.b.toString(16);
				if (obj.b < 16) b = "0" + b;

				return "#" + [r,g,b].join("").toUpperCase();
			} else if (type == 'rgb') {
				if (typeof obj.a == 'undefined') {
					return "rgb(" + [obj.r, obj.g, obj.b].join(",") + ")";
				} else {
					return "rgba(" + [obj.r, obj.g, obj.b, obj.a].join(",") + ")";
				}
			}

			return obj;
		},

		scale : function() {
			var startColor, endColor;

			function func(t, type) {

				var obj = {
					r : parseInt(startColor.r + (endColor.r - startColor.r) * t, 10) ,
					g : parseInt(startColor.g + (endColor.g - startColor.g) * t, 10),
					b : parseInt(startColor.b + (endColor.b - startColor.b) * t, 10)
				};

				return self.format(obj, type);
			}

			func.domain = function(start, end) {
				startColor = self.rgb(start);
				endColor = self.rgb(end);

				return func;
			}

			func.ticks = function (n) {
				var unit = (1/n);

				var start = 0;
				var colors = [];
				while(start <= 1) {
					var c = func(start, 'hex');
					colors.push(c);
					start = math.plus(start, unit);
				}

				return colors;

			}

			return func;
		},

		map : function (color_list, count) {

			var colors = [];
			count = count || 5;
			var scale = self.scale();
			for(var i = 0, len = color_list.length-1; i < len; i++) {
				if (i == 0) {
					colors = scale.domain(color_list[i], color_list[i + 1]).ticks(count);
				} else {
					var colors2 = scale.domain(color_list[i], color_list[i + 1]).ticks(count);
					colors2.shift();
					colors = colors.concat(colors2);
				}
			}

			return colors;
		},

		rgb : function (str) {

			if (typeof str == 'string') {
				if (str.indexOf("rgb(") > -1) {
					var arr = str.replace("rgb(", "").replace(")","").split(",");

					for(var i = 0, len = arr.length; i < len; i++) {
						arr[i] = parseInt(_.trim(arr[i]), 10);
					}

					return { r : arr[0], g : arr[1], b : arr[2], a : 1	};
				} else if (str.indexOf("rgba(") > -1) {
					var arr = str.replace("rgba(", "").replace(")","").split(",");

					for(var i = 0, len = arr.length; i < len; i++) {

						if (len - 1 == i) {
							arr[i] = parseFloat(_.trim(arr[i]));
						} else {
							arr[i] = parseInt(_.trim(arr[i]), 10);
						}
					}

					return { r : arr[0], g : arr[1], b : arr[2], a : arr[3]};
				} else if (str.indexOf("#") == 0) {

					str = str.replace("#", "");

					var arr = [];
					if (str.length == 3) {
						for(var i = 0, len = str.length; i < len; i++) {
							var char = str.substr(i, 1);
							arr.push(parseInt(char+char, 16));
						}
					} else {
						for(var i = 0, len = str.length; i < len; i+=2) {
							arr.push(parseInt(str.substr(i, 2), 16));
						}
					}

					return { r : arr[0], g : arr[1], b : arr[2], a : 1	};
				}
			}

			return str;

		},

		HSVtoRGB : function (H, S, V) {

			if (H == 360) {
				H = 0;
			}

			var C = S * V;
			var X = C * (1 -  Math.abs((H/60) % 2 -1)  );
			var m = V - C;

			var temp = [];

			if (0 <= H && H < 60) { temp = [C, X, 0]; }
			else if (60 <= H && H < 120) { temp = [X, C, 0]; }
			else if (120 <= H && H < 180) { temp = [0, C, X]; }
			else if (180 <= H && H < 240) { temp = [0, X, C]; }
			else if (240 <= H && H < 300) { temp = [X, 0, C]; }
			else if (300 <= H && H < 360) { temp = [C, 0, X]; }

			return {
				r : Math.ceil((temp[0] + m) * 255),
				g : Math.ceil((temp[1] + m) * 255),
				b : Math.ceil((temp[2] + m) * 255)
			};
		},

		RGBtoHSV : function (R, G, B) {

			var R1 = R / 255;
			var G1 = G / 255;
			var B1 = B / 255;

			var MaxC = Math.max(R1, G1, B1);
			var MinC = Math.min(R1, G1, B1);

			var DeltaC = MaxC - MinC;

			var H = 0;

			if (DeltaC == 0) { H = 0; }
			else if (MaxC == R1) {
				H = 60 * (( (G1 - B1) / DeltaC) % 6);
			} else if (MaxC == G1) {
				H  = 60 * (( (B1 - R1) / DeltaC) + 2);
			} else if (MaxC == B1) {
				H  = 60 * (( (R1 - G1) / DeltaC) + 4);
			}

			if (H < 0) {
				H = 360 + H;
			}

			var S = 0;

			if (MaxC == 0) S = 0;
			else S = DeltaC / MaxC;

			var V = MaxC;

			return { h : H, s : S, v :  V };
		},

		trim : function (str) {
			return (str || "").replace(/^\s+|\s+$/g, '');
		},

		/**
		 * @method lighten
		 *
		 * rgb 컬러 밝은 농도로 변환
		 *
		 * @param {String} color   RGB color code
		 * @param {Number} rate 밝은 농도
		 * @return {String}
		 */
		lighten : function(color, rate) {
			color = color.replace(/[^0-9a-f]/gi, '');
			rate = rate || 0;

			var rgb = [], c, i;
			for (i = 0; i < 6; i += 2) {
				c = parseInt(color.substr(i,2), 16);
				c = Math.round(Math.min(Math.max(0, c + (c * rate)), 255)).toString(16);
				rgb.push(("00"+c).substr(c.length));
			}

			return "#" + rgb.join("");
		},

		/**
		 * @method darken
		 *
		 * rgb 컬러 어두운 농도로 변환
		 *
		 * @param {String} color   RGB color code
		 * @param {Number} rate 어두운 농도
		 * @return {String}
		 */
		darken : function(color, rate) {
			return this.lighten(color, -rate)
		},

		/**
		 * @method parse
		 *
		 * color 파싱
		 *
		 * @param color
		 * @returns {*}
		 */
		parse : function(color) {
			return this.parseGradient(color);
		},

		/**
		 * @method parseGrident
		 *
		 * gradient parser
		 *
		 *      @example
		 *      linear(left) #fff,#000
		 *      linear(right) #fff,50 yellow,black
		 *      radial(50%,50%,50%,50,50)
		 *
		 * @param {String} color
		 */
		parseGradient : function(color) {
			var matches = color.match(this.regex);

			if (!matches) return color;

			var type = this.trim(matches[1]);
			var attr = this.parseAttr(type, this.trim(matches[2]));
			var stops = this.parseStop(this.trim(matches[3]));

			var obj = { type : type + "Gradient", attr : attr, children : stops };

			return obj;

		},

		parseStop : function(stop) {
			var stop_list = stop.split(",");

			var stops = [];

			for(var i = 0, len = stop_list.length; i < len; i++) {
				var stop = stop_list[i];

				var arr = stop.split(" ");

				if (arr.length == 0) continue;

				if (arr.length == 1) {
					stops.push({ type : "stop", attr : {"stop-color" : arr[0] } })
				} else if (arr.length == 2) {
					stops.push({ type : "stop", attr : {"offset" : arr[0], "stop-color" : arr[1] } })
				} else if (arr.length == 3) {
					stops.push({ type : "stop", attr : {"offset" : arr[0], "stop-color" : arr[1], "stop-opacity" : arr[2] } })
				}
			}

			var start = -1;
			var end = -1;
			for(var i = 0, len = stops.length; i < len; i++) {
				var stop = stops[i];

				if (i == 0) {
					if (!stop.offset) stop.offset = 0;
				} else if (i == len - 1) {
					if (!stop.offset) stop.offset = 1;
				}

				if (start == -1 && typeof stop.offset == 'undefined') {
					start = i;
				} else if (end == -1 && typeof stop.offset == 'undefined') {
					end = i;

					var count = end - start;

					var endOffset = stops[end].offset.indexOf("%") > -1 ? parseFloat(stops[end].offset)/100 : stops[end].offset;
					var startOffset = stops[start].offset.indexOf("%") > -1 ? parseFloat(stops[start].offset)/100 : stops[start].offset;

					var dist = endOffset - startOffset
					var value = dist/ count;

					var offset = startOffset + value;
					for(var index = start + 1; index < end; index++) {
						stops[index].offset = offset;

						offset += value;
					}

					start = end;
					end = -1;
				}
			}

			return stops;
		},

		parseAttr : function(type, str) {


			if (type == 'linear') {
				switch(str) {
					case "":
					case "left": return { x1 : 0, y1 : 0, x2 : 1, y2 : 0, direction : str || "left" };
					case "right": return { x1 : 1, y1 : 0, x2 : 0, y2 : 0, direction : str };
					case "top": return { x1 : 0, y1 : 0, x2 : 0, y2 : 1, direction : str };
					case "bottom": return { x1 : 0, y1 : 1, x2 : 0, y2 : 0, direction : str };
					case "top left": return { x1 : 0, y1 : 0, x2 : 1, y2 : 1, direction : str };
					case "top right": return { x1 : 1, y1 : 0, x2 : 0, y2 : 1, direction : str };
					case "bottom left": return { x1 : 0, y1 : 1, x2 : 1, y2 : 0, direction : str };
					case "bottom right": return { x1 : 1, y1 : 1, x2 : 0, y2 : 0, direction : str };
					default :
						var arr = str.split(",");
						for(var i = 0, len = arr.length; i < len; i++) {
							if (arr[i].indexOf("%") == -1)
								arr[i] = parseFloat(arr[i]);
						}

						return { x1 : arr[0], y1 : arr[1],x2 : arr[2], y2 : arr[3] };
				}
			} else {
				var arr = str.split(",");
				for(var i = 0, len = arr.length; i < len; i++) {

					if (arr[i].indexOf("%") == -1)
						arr[i] = parseFloat(arr[i]);
				}

				return { cx : arr[0], cy : arr[1],r : arr[2], fx : arr[3], fy : arr[4] };
			}

		}

	};

	self.map.parula = function (count) {  return self.map(['#352a87', '#0f5cdd', '#00b5a6', '#ffc337', '#fdff00'], count); }
	self.map.jet = function (count) {  return self.map(['#00008f', '#0020ff', '#00ffff', '#51ff77', '#fdff00', '#ff0000', '#800000'], count); }
	self.map.hsv = function (count) {  return self.map(['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'], count); }
	self.map.hot = function (count) {  return self.map(['#0b0000', '#ff0000', '#ffff00', '#ffffff'], count); }
	self.map.pink = function (count) {  return self.map(['#1e0000', '#bd7b7b', '#e7e5b2', '#ffffff'], count); }
	self.map.bone = function (count) {  return self.map(['#000000', '#4a4a68', '#a6c6c6', '#ffffff'], count); }
	self.map.copper = function (count) {  return self.map(['#000000', '#3d2618', '#9d623e', '#ffa167', '#ffc77f'], count); }

	return self;
});
jui.define("util.svg.element", [], function() {
    /**
     * @class util.svg.element
     * Create SVG Element
     * @constructor
     */
    var Element = function() {
        var events = [];

        /**
         * 엘리먼트 생성 및 조회 메소드
         *
         */

        this.create = function(type, attr) {
            // 퍼블릭 프로퍼티
            this.element = document.createElementNS("http://www.w3.org/2000/svg", type);
            this.children = [];
            this.parent = null;
            this.styles = {};
            this.attributes = {};
            this.order = 0;

            // 기본 속성 설정
            this.attr(attr);
        };

        this.each = function(callback) {
            if(typeof(callback) != "function") return;

            for(var i = 0, len = this.children.length; i < len; i++) {
                var self = this.children[i];
                callback.apply(self, [ i, self ]);
            }

            return this.children;
        };

        this.get = function(index) {
            if(this.children[index]) {
                return this.children[index];
            }

            return null;
        }

        this.index = function(obj) {
            for(var i = 0; i < this.children.length; i++) {
                if(obj == this.children[i]) {
                    return i;
                }
            }

            return -1;
        }

        /**
         * 엘리먼트 관계 메소드
         *
         */

        this.append = function(elem) {
            if(elem instanceof Element) {
                if (elem.parent) {
                    elem.remove();
                }

                this.children.push(elem);
                elem.parent = this;
            }

            return this;
        }

        this.prepend = function(elem) {
            return this.insert(0, elem);
        }

        this.insert = function(index, elem) {
            if(elem.parent) {
                elem.remove();
            }

            this.children.splice(index, 0, elem);
            elem.parent = this;

            return this;
        }

        this.remove = function() {
            var index = 0,
                nChild = [],
                pChild = this.parent.children;

            for(var i = 0; i < pChild.length; i++) {
                if (pChild[i] == this) {
                    index = i;
                    break;
                }

                nChild.push(pChild[i]);
            }

            this.parent.children = nChild;

            return this;
        }

        /**
         * 엘리먼트 DOM 조작 메소드
         *
         */

        this.attr = function(attr) {
            if(typeof attr == "undefined" || !attr) return;

            if(typeof attr == "string") {
                return this.attributes[attr] || this.element.getAttribute(attr);
            }

            for(var k in attr) {
                this.attributes[k] = attr[k];

                if(k.indexOf("xlink:") != -1) {
                    this.element.setAttributeNS("http://www.w3.org/1999/xlink", k, attr[k]);
                } else {
                    this.element.setAttribute(k, attr[k]);
                }
            }

            return this;
        }

        this.css = function(css) {
            var list = [];

            for(var k in css) {
                this.styles[k] = css[k];
            }

            for(var k in css) {
                list.push(k + ":" + css[k]);
            }

            this.attr({ style: list.join(";") });

            return this;
        }

        this.html = function(html) { // @deprecated
            this.element.innerHTML = html;

            return this;
        }

        this.text = function(text) {
            var children = this.element.childNodes;

            for(var i = 0; i < children.length; i++) {
                this.element.removeChild(children[i]);
            }

            this.element.appendChild(document.createTextNode(text));
            return this;
        }

        /**
         * 엘리먼트 DOM 이벤트 메소드
         *
         */

        this.on = function(type, handler) {
            var callback = function(e) {
                if(typeof(handler) == "function") {
                    handler.call(this, e);
                }
            }

            this.element.addEventListener(type, callback, false);
            events.push({ type: type, callback: callback });

            return this;
        }

        this.off = function(type) {
            var newEvents = [];

            for(var i = 0, len = events.length; i < len; i++) {
                var event = events[i];

                if(event.type != type) {
                    newEvents.push(event);
                } else {
                    this.element.removeEventListener(type, event.callback, false);
                }
            }

            events = newEvents;
            return this;
        }

        this.hover = function(overHandler, outHandler) {
            var callback1 = function(e) {
                if(typeof(overHandler) == "function") {
                    overHandler.call(this, e);
                }
            }

            var callback2 = function(e) {
                if(typeof(outHandler) == "function") {
                    outHandler.call(this, e);
                }
            }

            this.element.addEventListener("mouseover", callback1, false);
            this.element.addEventListener("mouseout", callback2, false);
            events.push({ type: "mouseover", callback: callback1 });
            events.push({ type: "mouseout", callback: callback2 });

            return this;
        }

        /**
         * 그 외 메소드
         *
         */
        this.size = function() {
            var size = { width: 0, height: 0 },
                rect = this.element.getBoundingClientRect();

            if(!rect || (rect.width == 0 && rect.height == 0)) {
                var height_list = [ "height", "paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth" ],
                    width_list = [ "width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth" ];

                var computedStyle = window.getComputedStyle(this.element);

                for (var i = 0; i < height_list.length; i++) {
                    size.height += parseFloat(computedStyle[height_list[i]]);
                }

                for (var i = 0; i < width_list.length; i++) {
                    size.width += parseFloat(computedStyle[width_list[i]]);
                }

                size.width = size.width || this.element.getAttribute('width');
                size.height = size.height || this.element.getAttribute('height');
            } else {
                size.width = rect.width;
                size.height = rect.height;
            }

            if(isNaN(size.width)) size.width = 0;
            if(isNaN(size.height)) size.height = 0;

            return size;
        }

        this.is = function(moduleId) {
            return this instanceof jui.include(moduleId);
        }
    }

    return Element;
});

jui.define("util.svg.element.transform", [ "util.base" ], function(_) { // polygon, polyline

    /**
     * @class util.svg.element.transform
     *
     * implement Transform Element
     *
     * @extends util.svg.element
     * @constructor
     */
    var TransElement = function() {
        var orders = {
            translate: null,
            scale: null,
            rotate: null,
            skew: null,
            matrix: null
        };

        function applyOrders(self) {
            var orderArr = [];

            for(var key in orders) {
                if(orders[key]) orderArr.push(orders[key]);
            }

            self.attr({ transform: orderArr.join(" ") });
        }

        function getStringArgs(args) {
            var result = [];

            for(var i = 0; i < args.length; i++) {
                result.push(args[i]);
            }

            return result.join(",");
        }

        this.translate = function() {
            orders["translate"] = "translate(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }

        this.rotate = function(angle, x, y) {
            if(arguments.length == 1) {
                var str = angle;
            } else if(arguments.length == 3) {
                var str = angle + " " + x + "," + y;
            }

            orders["rotate"] = "rotate(" + str + ")";
            applyOrders(this);

            return this;
        }

        this.scale = function() {
            orders["scale"] = "scale(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }

        this.skew = function() {
            orders["skew"] = "skew(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }

        this.matrix = function() {
            orders["matrix"] = "matrix(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }

        this.data = function(type) {
            var text = this.attr("transform"),
                regex = {
                    translate: /[^translate()]+/g,
                    rotate: /[^rotate()]+/g,
                    scale: /[^scale()]+/g,
                    skew: /[^skew()]+/g,
                    matrix: /[^matrix()]+/g
                };

            if(_.typeCheck("string", text)) {
                return text.match(regex[type])[0];
            }

            return null;
        }
    }

    return TransElement;
}, "util.svg.element");

jui.define("util.svg.element.path", [ "util.base" ], function(_) { // path
    var PathElement = function() {
        var orders = [];

        this.moveTo = function(x, y, type) {
            orders.push( (type || "m") + x + "," + y );
            return this;
        }
        this.MoveTo = function(x, y) {
            return this.moveTo(x, y, "M");
        }

        this.lineTo = function(x, y, type) {
            orders.push( (type || "l") + x + "," + y );
            return this;
        }
        this.LineTo = function(x, y) {
            return this.lineTo(x, y, "L");
        }

        this.hLineTo = function(x, type) {
            orders.push( (type || "h") + x );
            return this;
        }
        this.HLineTo = function(x) {
            return this.hLineTo(x, "H");
        }

        this.vLineTo = function(y, type) {
            orders.push( (type || "v") + y );
            return this;
        }
        this.VLineTo = function(y) {
            return this.vLineTo(y, "V");
        }

        this.curveTo = function(x1, y1, x2, y2, x, y, type) {
            orders.push( (type || "c") + x1 + "," + y1 + " " + x2 + "," + y2 + " " + x + "," + y );
            return this;
        }
        this.CurveTo = function(x1, y1, x2, y2, x, y) {
            return this.curveTo(x1, y1, x2, y2, x, y, "C");
        }

        this.sCurveTo = function(x2, y2, x, y, type) {
            orders.push( (type || "s") + x2 + "," + y2 + " " + x + "," + y );
            return this;
        }
        this.SCurveTo = function(x2, y2, x, y) {
            return this.sCurveTo(x2, y2, x, y, "S");
        }

        this.qCurveTo = function(x1, y1, x, y, type) {
            orders.push( (type || "q") + x1 + "," + y1 + " " + x + "," + y );
            return this;
        }
        this.QCurveTo = function(x1, y1, x, y) {
            return this.qCurveTo(x1, y1, x, y, "Q");
        }

        this.tCurveTo = function(x1, y1, x, y, type) {
            orders.push( (type || "t") + x1 + "," + y1 + " " + x + "," + y );
            return this;
        }
        this.TCurveTo = function(x1, y1, x, y) {
            return this.tCurveTo(x1, y1, x, y, "T");
        }

        this.arc = function(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y, type) {
            large_arc_flag = (large_arc_flag) ? 1 : 0;
            sweep_flag = (sweep_flag) ? 1 : 0;

            orders.push( (type || "a") + rx + "," + ry + " " + x_axis_rotation + " " + large_arc_flag + "," + sweep_flag + " " + x + "," + y );
            return this;
        }
        this.Arc = function(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y) {
            return this.arc(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y, "A");
        }

        this.closePath = function(type) {
            orders.push( (type || "z") );
            return this;
        }
        this.ClosePath = function() {
            return this.closePath("Z");
        }

        this.join = function() {
            if(orders.length > 0) {
                this.attr({ d: orders.join(" ") });
                orders = [];
            }
        }

        this.length = function() {
            var id = _.createId(),
                d = orders.join(" ");

            var svg = document.createElement("svg"),
                path = document.createElementNS("http://www.w3.org/2000/svg", "path");

            path.setAttributeNS(null, "id", id);
            path.setAttributeNS(null, "d", d);
            svg.appendChild(path);

            document.body.appendChild(svg);
            var length = document.getElementById(id).getTotalLength();
            document.body.removeChild(svg);

            return length;
        }
    }

    return PathElement;
}, "util.svg.element.transform");

jui.define("util.svg.element.path.symbol", [ "util.base" ], function(_) { // symbol
    var PathSymbolElement = function() {
        var ordersString = "";

        /**
         * 심볼 템플릿
         *
         */
        this.template = function(width, height) {
            var r = width,
                half_width = half_r =  width / 2,
                half_height = height / 2;

            var start = "a" + half_r + "," + half_r + " 0 1,1 " + r + ",0",
                end = "a" + half_r + "," + half_r + " 0 1,1 " + -r + ",0";

            var obj = {
                triangle : ["m0," + -half_height, "l" + (half_width) + "," + height, "l" + (-width) + ",0", "l" + (half_width) + "," + (-height)].join(" "),
                rect : ["m" + (-half_width) + "," + (-half_height), "l" + (width) + ",0", "l0," + (height) , "l" + (-width) + ',0', "l0," + (-height)].join(" "),
                cross : ["m" + (-half_width) + ',' + (-half_height), "l" + (width) + "," + (height), "m0," + (-height), "l" + (-width) + "," + (height)].join(" "),
                circle : ["m" + (-r) + ",0", start, end  ].join(" ")
            }

            obj.rectangle = obj.rect;

            return obj;
        }

        this.join = function() {
            if(ordersString.length > 0) {
                this.attr({ d: ordersString });
                ordersString = "";
            }
        }

        /**
         * 심볼 추가 하기 (튜닝)
         */
        this.add = function(cx, cy, tpl) {
            ordersString += " M" + (cx) + "," + (cy) + tpl;
        }

        /**
         * path 내 심볼 생성
         *
         */
        this.triangle = function(cx, cy, width, height) {
            return this.MoveTo(cx, cy).moveTo(0, -height/2).lineTo(width/2,height).lineTo(-width, 0).lineTo(width/2, -height);
        }

        this.rect = this.rectangle = function(cx, cy, width, height) {
            return this.MoveTo(cx, cy).moveTo(-width/2, -height/2).lineTo(width,0).lineTo(0, height).lineTo(-width, 0).lineTo(0, -height);
        }

        this.cross = function(cx, cy, width, height) {
            return this.MoveTo(cx, cy).moveTo(-width/2, -height/2).lineTo(width, height).moveTo(0, -height).lineTo(-width, height);
        }

        this.circle = function(cx, cy, r) {
            return this.MoveTo(cx, cy).moveTo(-r, 0).arc(r/2, r/2, 0, 1, 1, r, 0).arc(r/2, r/2, 0, 1, 1, -r, 0);
        }
    }

    return PathSymbolElement;
}, "util.svg.element.path");

jui.define("util.svg.element.path.rect", [ "util.math" ], function(math) {
    var PathRectElement = function() {
        this.round = function(width, height, tl, tr, br, bl) {
            tl = (!tl) ? 0 : tl;
            tr = (!tr) ? 0 : tr;
            br = (!br) ? 0 : br;
            bl = (!bl) ? 0 : bl;

            this.MoveTo(0, tl)
                .Arc(tl, tl, 0, 0, 1, tl, 0)
                .HLineTo(width - tr)
                .Arc(tr, tr, 0, 0, 1, width, tr)
                .VLineTo(height - br)
                .Arc(br, br, 0, 0, 1, width - br, height)
                .HLineTo(bl)
                .Arc(bl, bl, 0, 0, 1, 0, height - bl)
                .ClosePath()
                .join();
        }
    }

    return PathRectElement;
}, "util.svg.element.path");

jui.define("util.svg.element.poly", [], function() { // polygon, polyline
    var PolyElement = function() {
        var orders = [];

        this.point = function(x, y) {
            orders.push(x + "," + y);
            return this;
        }

        this.join = function() {
            if(orders.length > 0) {
                // Firefox 처리
                var start = orders[0];
                orders.push(start);

                // 폴리곤 그리기
                this.attr({ points: orders.join(" ") });
                orders = [];
            }
        }
    }

    return PolyElement;
}, "util.svg.element.transform");

jui.define("util.svg.base",
    [ "util.base", "util.math", "util.color", "util.svg.element", "util.svg.element.transform",
        "util.svg.element.path", "util.svg.element.path.symbol", "util.svg.element.path.rect", "util.svg.element.poly" ],
    function(_, math, color, Element, TransElement, PathElement, PathSymbolElement, PathRectElement, PolyElement) {

    var globalObj = null;

    var SVGBase = function() {
        this.create = function(obj, type, attr, callback) {
            obj.create(type, attr);
            return obj;
        }

        this.createChild = function(obj, type, attr, callback) {
            return this.create(obj, type, attr, callback);
        }

        /**
         * @method custom
         *
         * return custom element
         *
         * @param {String} name
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element}
         */
        this.custom = function(name, attr, callback) {
            return this.create(new Element(), name, attr, callback);
        }

        /**
         * @method defs
         *
         * return defs element
         *
         * @param {Function} callback
         * @return {util.svg.element}
         */
        this.defs = function(callback) {
            return this.create(new Element(), "defs", null, callback);
        }

        /**
         * @method symbol
         *
         * return symbol element
         *
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element}
         */
        this.symbol = function(attr, callback) {
            return this.create(new Element(), "symbol", attr, callback);
        }

        /**
         * @method g
         *
         * return defs element
         *
         * @alias group
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element.transform}
         */
        this.g = this.group = function(attr, callback) {
            return this.create(new TransElement(), "g", attr, callback);
        }

        /**
         * @method marker
         *
         * return marker element
         *
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element}
         */
        this.marker = function(attr, callback) {
            return this.create(new Element(), "marker", attr, callback);
        }

        /**
         * @method a
         *
         * return a element
         *
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element.transform}
         */
        this.a = function(attr, callback) {
            return this.create(new TransElement(), "a", attr, callback);
        }

        /**
         * @method switch
         *
         * return switch element
         *
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element}
         */
        this.switch = function(attr, callback) {
            return this.create(new Element(), "switch", attr, callback);
        }

        /**
         * @method use
         *
         * return use element
         *
         * @param {Object} attr
         * @return {util.svg.element}
         */
        this.use = function(attr) {
            return this.create(new Element(), "use", attr);
        }

        /**
         * @method rect
         *
         * return rect element
         *
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element.transform}
         */
        this.rect = function(attr, callback) {
            return this.create(new TransElement(), "rect", attr, callback);
        }

        /**
         * @method line
         *
         * return line element
         *
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element.transform}
         */
        this.line = function(attr, callback) {
            return this.create(new TransElement(), "line", attr, callback);
        }

        this.circle = function(attr, callback) {
            return this.create(new TransElement(), "circle", attr, callback);
        }

        this.text = function(attr, textOrCallback) {
            if(arguments.length == 2) {
                if (_.typeCheck("function", textOrCallback)) {
                    return this.create(new TransElement(), "text", attr, textOrCallback);
                }

                return this.create(new TransElement(), "text", attr).text(textOrCallback);
            }

            return this.create(new TransElement(), "text", attr);
        }

        this.textPath = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return this.create(new Element(), "textPath", attr).text(text);
            }

            return this.create(new Element(), "textPath", attr);
        }

        this.tref = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return this.create(new Element(), "tref", attr).text(text);
            }

            return this.create(new Element(), "tref", attr);
        }

        this.tspan = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return this.create(new Element(), "tspan", attr).text(text);
            }

            return this.create(new Element(), "tspan", attr);
        }

        this.ellipse = function(attr, callback) {
            return this.create(new TransElement(), "ellipse", attr, callback);
        }

        this.image = function(attr, callback) {
            return this.create(new TransElement(), "image", attr, callback);
        }

        this.path = function(attr, callback) {
            return this.create(new PathElement(), "path", attr, callback);
        }

        this.pathSymbol = function(attr, callback) {
            return this.create(new PathSymbolElement(), "path", attr, callback);
        }

        this.pathRect = function(attr, callback) {
            return this.create(new PathRectElement(), "path", attr, callback);
        }

        this.polyline = function(attr, callback) {
            return this.create(new PolyElement(), "polyline", attr, callback);
        }

        this.polygon = function(attr, callback) {
            return this.create(new PolyElement(), "polygon", attr, callback);
        }

        this.pattern = function(attr, callback) {
            return this.create(new Element(), "pattern", attr, callback);
        }

        this.mask = function(attr, callback) {
            return this.create(new Element(), "mask", attr, callback);
        }

        this.clipPath = function(attr, callback) {
            return this.create(new Element(), "clipPath", attr, callback);
        }

        this.linearGradient = function(attr, callback) {
            return this.create(new Element(), "linearGradient", attr, callback);
        }

        this.radialGradient = function(attr, callback) {
            return this.create(new Element(), "radialGradient", attr, callback);
        }

        this.filter = function(attr, callback) {
            return this.create(new Element(), "filter", attr, callback);
        }

        this.foreignObject = function(attr, callback) {
            return this.create(new TransElement(), "foreignObject", attr, callback);
        }

        /**
         * 엘리먼트 관련 메소드 (그라데이션)
         *
         */

        this.stop = function(attr) {
            return this.createChild(new Element(), "stop", attr);
        }

        /**
         * 엘리먼트 관련 메소드 (애니메이션)
         *
         */

        this.animate = function(attr) {
            return this.createChild(new Element(), "animate", attr);
        }

        this.animateColor = function(attr) {
            return this.createChild(new Element(), "animateColor", attr);
        }

        this.animateMotion = function(attr) {
            return this.createChild(new Element(), "animateMotion", attr);
        }

        this.animateTransform = function(attr) {
            return this.createChild(new Element(), "animateTransform", attr);
        }

        this.mpath = function(attr) {
            return this.createChild(new Element(), "mpath", attr);
        }

        this.set = function(attr) {
            return this.createChild(new Element(), "set", attr);
        }

        /**
         * 엘리먼트 관련 메소드 (필터)
         *
         */

        this.feBlend = function(attr) {
            return this.createChild(new Element(), "feBlend", attr);
        }

        this.feColorMatrix = function(attr) {
            return this.createChild(new Element(), "feColorMatrix", attr);
        }

        this.feComponentTransfer = function(attr) {
            return this.createChild(new Element(), "feComponentTransfer", attr);
        }

        this.feComposite = function(attr) {
            return this.createChild(new Element(), "feComposite", attr);
        }

        this.feConvolveMatrix = function(attr) {
            return this.createChild(new Element(), "feConvolveMatrix", attr);
        }

        this.feDiffuseLighting = function(attr) {
            return this.createChild(new Element(), "feDiffuseLighting", attr);
        }

        this.feDisplacementMap = function(attr) {
            return this.createChild(new Element(), "feDisplacementMap", attr);
        }

        this.feFlood = function(attr) {
            return this.createChild(new Element(), "feFlood", attr);
        }

        this.feGaussianBlur = function(attr) {
            return this.createChild(new Element(), "feGaussianBlur", attr);
        }

        this.feImage = function(attr) {
            return this.createChild(new Element(), "feImage", attr);
        }

        this.feMerge = function(attr, callback) {
            return this.createChild(new Element(), "feMerge", attr, callback);
        }

        this.feMergeNode = function(attr) {
            return this.createChild(new Element(), "feMergeNode", attr);
        }

        this.feMorphology = function(attr) {
            return this.createChild(new Element(), "feMorphology", attr);
        }

        this.feOffset = function(attr) {
            return this.createChild(new Element(), "feOffset", attr);
        }

        this.feSpecularLighting = function(attr) {
            return this.createChild(new Element(), "feSpecularLighting", attr);
        }

        this.feTile = function(attr) {
            return this.createChild(new Element(), "feTile", attr);
        }

        this.feTurbulence = function(attr) {
            return this.createChild(new Element(), "feTurbulence", attr);
        }
    }

    SVGBase.create = function(name, attr, callback) {
        if(globalObj == null) {
            globalObj = new SVGBase();
        }

        return globalObj.custom(name, attr, callback);
    }

    return SVGBase;
});
jui.define("util.svg.3d", [ "util.base", "util.math", "util.color" ], function(_, math, color) {
    var SVG3d = function() {

        // 3D 사각형 그리기
        this.rect3d = function(fill, width, height, degree, depth) {
            var self = this;

            var radian = math.radian(degree),
                x1 = 0,
                y1 = 0,
                w1 = width,
                h1 = height;

            var x2 = Math.cos(radian) * depth,
                y2 = Math.sin(radian) * depth,
                w2 = width + x2,
                h2 = height + y2;

            var g = self.group({}, function() {
                self.path({
                    fill: color.lighten(fill, 0.15),
                    stroke: color.lighten(fill, 0.15)
                }).MoveTo(x2, x1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2)
                    .LineTo(x1, y2);

                self.path({
                    fill: fill,
                    stroke: fill
                }).MoveTo(x1, y2)
                    .LineTo(x1, h2)
                    .LineTo(w1, h2)
                    .LineTo(w1, y2);

                self.path({
                    fill: color.darken(fill, 0.2),
                    stroke: color.darken(fill, 0.2)
                }).MoveTo(w1, h2)
                    .LineTo(w2, h1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2);
            });

            return g;
        }

        // 3D 타원 그리기
        this.cylinder3d = function(fill, width, height, degree, depth, rate) {
            var self = this;

            var radian = math.radian(degree),
                rate = (rate == undefined) ? 1 : (rate == 0) ? 0.01 : rate,
                r = width / 2,
                tr = r * rate,
                l = (Math.cos(radian) * depth) / 2,
                d = (Math.sin(radian) * depth) / 2,
                key = _.createId("cylinder3d");

            var g = self.group({}, function() {
                self.ellipse({
                    fill: color.darken(fill, 0.05),
                    "fill-opacity": 0.85,
                    stroke: color.darken(fill, 0.05),
                    rx: r,
                    ry: d,
                    cx: r,
                    cy: height
                }).translate(l, d);

                self.path({
                    fill: "url(#" + key + ")",
                    "fill-opacity": 0.85,
                    stroke: fill
                }).MoveTo(r - tr, d)
                    .LineTo(0, height)
                    .Arc(r, d, 0, 0, 0, width, height)
                    .LineTo(r + tr, d)
                    .Arc(r + tr, d, 0, 0, 1, r - tr, d)
                    .translate(l, d);

                self.ellipse({
                    fill: color.lighten(fill, 0.2),
                    "fill-opacity": 0.95,
                    stroke: color.lighten(fill, 0.2),
                    rx: r * rate,
                    ry: d * rate,
                    cx: r,
                    cy: d
                }).translate(l, d);

                self.linearGradient({
                    id: key,
                    x1: "100%",
                    x2: "0%",
                    y1: "0%",
                    y2: "0%"
                }, function() {
                    self.stop({
                        offset: "0%",
                        "stop-color": color.lighten(fill, 0.15)
                    });
                    self.stop({
                        offset: "33.333333333333336%",
                        "stop-color": color.darken(fill, 0.2)
                    });
                    self.stop({
                        offset: "66.66666666666667%",
                        "stop-color": color.darken(fill, 0.2)
                    });
                    self.stop({
                        offset: "100%",
                        "stop-color": color.lighten(fill, 0.15)
                    });
                });
            });

            return g;
        }
    }

    return SVG3d;
}, "util.svg.base");

jui.define("util.svg",
    [ "util.base", "util.math", "util.color", "util.svg.element", "util.svg.element.transform",
        "util.svg.element.path", "util.svg.element.path.symbol", "util.svg.element.path.rect", "util.svg.element.poly" ],
    function(_, math, color, Element, TransElement, PathElement, PathSymbolElement, PathRectElement, PolyElement) {

    /**
     * @class util.svg
     *
     * SVG Util
     *
     * @param {jQuery/Element} rootElem
     * @param {Object} rootAttr
     * @constructor
     * @alias SVG
     */
    var SVG = function(rootElem, rootAttr) {
        var self = this,
            root = null,
            main = null,
            sub = null,
            parent = {},
            depth = 0;
        var isFirst = false; // 첫번째 렌더링 체크

        function init() {
            self.root = root = new Element();
            main = new TransElement();
            sub = new TransElement();

            root.create("svg", rootAttr);
            main.create("g");
            sub.create("g");

            main.translate(0.5, 0.5);
            sub.translate(0.5, 0.5);

            rootElem.appendChild(root.element);
            root.append(main);
            root.append(sub);
        }
        
        function appendAll(target) {
            var childs = target.children;

            // 엘리먼트 렌더링 순서 정하기
            if(isOrderingChild(childs)) {
                childs.sort(function (a, b) {
                    return a.order - b.order;
                });
            }

            for(var i = 0, len = childs.length; i < len; i++) {
                var child = childs[i];

                if(child) {
                    if(child.children.length > 0) {
                        appendAll(child);
                    }
                    
                    // PathElement & PathSymbolElement & PathRectElement & PolyElement auto join
                    if(child instanceof PathElement || child instanceof PolyElement) {
                        child.join();
                    }

                    if(child.parent == target) {
                        target.element.appendChild(child.element);
                    }
                }
            }
        }

        function isOrderingChild(childs) { // order가 0 이상인 엘리먼트가 하나라도 있을 경우
            for(var i = 0, len = childs.length; i < len; i++) {
                if(childs[i].order > 0) {
                    return true;
                }
            }

            return false;
        }

        this.create = function(obj, type, attr, callback) {
            obj.create(type, attr);

            if(depth == 0) {
                main.append(obj);
            } else {
                parent[depth].append(obj);
            }

            if(_.typeCheck("function", callback)) {
                depth++;
                parent[depth] = obj;

                callback.call(obj);
                depth--;
            }

            return obj;
        }

        this.createChild = function(obj, type, attr, callback) {
            if(obj.parent == main) {
                throw new Error("JUI_CRITICAL_ERR: Parents are required elements of the '" + type + "'");
            }

            return this.create(obj, type, attr, callback);
        }

        /**
         * @method size
         *
         * if arguments.length is 2, set attribute width, height to root element
         * if arguments.length is zero, return svg size
         *
         * @return {Object}
         * @return {Integer} width
         * @return {Integer} height
         */
        this.size = function() {
            if(arguments.length == 2) {
                var w = arguments[0],
                    h = arguments[1];

                root.attr({ width: w, height: h });
            } else {
                return root.size();
            }
        }

        /**
         * @method clear
         * @param isAll
         */
        this.clear = function(isAll) {
            main.each(function() {
                if(this.element.parentNode) {
                    main.element.removeChild(this.element);
                }
            });

            if(isAll === true) {
                sub.each(function() {
                    if(this.element.parentNode) {
                        sub.element.removeChild(this.element);
                    }
                });
            }
        }

        /**
         * @method reset
         * @param isAll
         */
        this.reset = function(isAll) {
            this.clear(isAll);
            main.children = [];

            if(isAll === true) {
                sub.children = [];
            }
        }

        /**
         * @method render
         * @param isAll
         */
        this.render = function(isAll) {
            this.clear();

            if(isFirst === false || isAll === true) {
                appendAll(root);
            } else {
                appendAll(main);
            }

            isFirst = true;
        }

        /**
         * @method
         * implements svg image file download used by canvas
         * @param name
         */
        this.download = function(name) {
            if(_.typeCheck("string", name)) {
                name = name.split(".")[0];
            }

            var a = document.createElement("a");
            a.download = (name) ? name + ".svg" : "svg.svg";
            a.href = this.toDataURI()//;_.svgToBase64(rootElem.innerHTML);

            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }
        
        this.downloadImage = function(name, type) {
            type = type || "image/png";

            var img = new Image();
            var size = this.size();
            var uri = this.toDataURI()
                            .replace('width="100%"', 'width="' + size.width + '"')
                            .replace('height="100%"', 'height="' + size.height + '"');
            img.onload = function(){
              var canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              
              var context = canvas.getContext('2d');
              context.drawImage(img, 0, 0);
              
              var png = canvas.toDataURL(type);
              
              if(_.typeCheck("string", name)) {
                  name = name.split(".")[0];
              }              
              
              var a = document.createElement('a');
              a.download = (name) ? name + ".png" : "svg.png";
              a.href = png;
  
              document.body.appendChild(a);
              a.click();
              a.parentNode.removeChild(a);
            }

            img.src = uri;   
      
        }

        /**
         * @method exportCanvas
         *
         * convert svg image to canvas
         *
         * @param {Canvas} canvas
         */
        this.exportCanvas = function(canvas) {
            var img = new Image(),
                size = this.size();

            var uri = this.toDataURI()
                .replace('width="100%"', 'width="' + size.width + '"')
                .replace('height="100%"', 'height="' + size.height + '"');

            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;

                var context = canvas.getContext('2d');
                context.drawImage(img, 0, 0);
            }

            img.src = uri;
        }

        /**
         * @method toXML
         *
         * convert xml string
         *
         * @return {String} xml
         */
        this.toXML = function() {
            var text = rootElem.innerHTML;

            text = text.replace('xmlns="http://www.w3.org/2000/svg"', '');

            return [
                '<?xml version="1.0" encoding="utf-8"?>',
                text.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
            ].join("\n");
        }

        /**
         * @method toDataURI
         *
         * convert svg to datauri format
         *
         * @return {String}
         */
        this.toDataURI = function() {
            var xml = this.toXML();

            if (_.browser.mozilla || _.browser.msie) {
                xml = encodeURIComponent(xml);
            }

            if (_.browser.msie) {
                return "data:image/svg+xml," + xml;
            } else {
                return "data:image/svg+xml;utf8," + xml;
            }
        }

        /**
         * @method autoRender
         *
         * @param {util.svg.element} elem
         * @param {Boolean} isAuto
         */
        this.autoRender = function(elem, isAuto) {
            if(depth > 0) return;

            if(!isAuto) {
                sub.append(elem);
            } else {
                main.append(elem);
            }
        }

        /**
         * @method getTextSize
         *
         * caculate real pixel size of text element
         *
         * @param {String} text target text
         * @return {Object}
         * @return {Integer} return.width  text element's width (px)
         * @return {Integer} return.height text element's height(px)
         */
        this.getTextSize = function(text) {
            if (text == "") {
                return { width : 0, height : 0 };
            }

            var el = document.createElementNS("http://www.w3.org/2000/svg", "text");
            el.setAttributeNS(null, "x", -200);
            el.setAttributeNS(null, "y", -200);
            el.appendChild(document.createTextNode(text));

        	root.element.appendChild(el);
        	var rect = el.getBoundingClientRect();
            root.element.removeChild(el);

        	return { width : rect.width, height : rect.height }; 
        }

        init();
    }

    /**
     * @method create
     *
     * create nested elements by json
     *
     *      @example
     *      SVG.create({
     *          tag : "pattern",
     *          attr : { x : 0, y : 0, width : 20, height : 20  },
     *          children : [
     *              { tag : 'rect', attr : {width : 20, height : 20, fill : 'black', stroke : 'blue', 'stroke-width' : 2 } ,
     *              { tag : 'rect', attr : {width : 20, height : 20, fill : 'black', stroke : 'blue', 'stroke-width' : 2 } ,
     *              { tag : 'rect', attr : {width : 20, height : 20, fill : 'black', stroke : 'blue', 'stroke-width' : 2 } ,
     *              { tag : 'rect', attr : {width : 20, height : 20, fill : 'black', stroke : 'blue', 'stroke-width' : 2 }
     *          ]
     *      });
     *
     * is equals to
     *
     *      @example
     *      <pattern x="0" y="0" width="20" height="20">
     *          <rect width="20" height="20" fill="black" stroke="blue" stroke-width="2" />
     *          <rect width="20" height="20" fill="black" stroke="blue" stroke-width="2" />
     *          <rect width="20" height="20" fill="black" stroke="blue" stroke-width="2" />
     *          <rect width="20" height="20" fill="black" stroke="blue" stroke-width="2" />
     *      </pattern>
     *
     * @param {Object} obj json literal
     * @param {String} obj.type  svg element name
     * @param {Object} obj.attr  svg element's attributes
     * @param {Array} [obj.children=null] svg element's children
     * @static
     * @return {util.svg.element}
     *
     */
    SVG.createObject = function(obj) {
        var el = new Element();

        el.create(obj.type, obj.attr);

        if (obj.children instanceof Array) {
            for(var i = 0, len = obj.children.length; i < len; i++) {
                el.append(SVG.createObject(obj.children[i]));
            }
        }

        return el;
    }

    return SVG;
}, "util.svg.3d");

jui.define("manager", [ "util.base" ], function(_) {

    /**
     * @class core.UIManager
     * @private
     * @singleton
     */
    var UIManager = new function() {
        var instances = [], classes = [];


        /**
         * @method add
         * Adds a component object created
         *
         * @param {Object} ui UI instance
         */
        this.add = function(uiIns) {
            instances.push(uiIns);
        }

        /**
         * @method emit
         * Generates a custom event to an applicable component
         *
         * @param {String} key Selector or UI type
         * @param {String} type Event type
         * @param {Array} args Event arguments
         */
        this.emit = function(key, type, args) {
            var targets = [];

            for(var i = 0; i < instances.length; i++) {
                var uiSet = instances[i];

                if(key == uiSet.selector || key == uiSet.type) {
                    targets.push(uiSet);
                }
            }

            for(var i = 0; i < targets.length; i++) {
                var uiSet = targets[i];

                for(var j = 0; j < uiSet.length; j++) {
                    uiSet[j].emit(type, args);
                }
            }
        }

        /**
         * @method get
         * Gets a component currently created
         *
         * @param {Integer/String} key
         * @returns {Object/Array} UI instance
         */
        this.get = function(key) {
            if(_.typeCheck("integer", key)) {
                return instances[key];
            } else if(_.typeCheck("string", key)) {
                // ������ ��ü �˻�
                for(var i = 0; i < instances.length; i++) {
                    var uiSet = instances[i];

                    if(key == uiSet.selector) {
                        return (uiSet.length == 1) ? uiSet[0] : uiSet;
                    }
                }

                // ���� ��ü �˻�
                var result = [];
                for(var i = 0; i < instances.length; i++) {
                    var uiSet = instances[i];

                    if(key == uiSet.type) {
                        result.push(uiSet);
                    }
                }

                return result;
            }
        }

        /**
         * @method getAll
         * Gets all components currently created
         *
         * @return {Array} UI instances
         */
        this.getAll = function() {
            return instances;
        }

        /**
         * @method remove
         * Removes a component object in an applicable index from the list
         *
         * @param {Integer} index
         * @return {Object} Removed instance
         */
        this.remove = function(index) {
            if(_.typeCheck("integer", index)) { // UI ��ü �ε���
                return instances.splice(index, 1)[0];
            }
        }

        /**
         * @method shift
         * Removes the last component object from the list
         *
         * @return {Object} Removed instance
         */
        this.shift = function() {
            return instances.shift();
        }

        /**
         * @method pop
         * Removes the first component object from the list
         *
         * @return {Object} Removed instance
         */
        this.pop = function() {
            return instances.pop();
        }

        /**
         * @method size
         * Gets the number of objects currently created
         *
         * @return {Number}
         */
        this.size = function() {
            return instances.length;
        }

        /**
         * @method debug
         *
         * @param {Object} uiObj UI instance
         * @param {Number} i
         * @param {Number} j
         * @param {Function} callback
         */
        this.debug = function(uiObj, i, j, callback) {
            if(!uiObj.__proto__) return;
            var exFuncList = [ "emit", "on", "addEvent", "addValid", "callBefore",
                "callAfter", "callDelay", "setTpl", "setVo", "setOption" ];

            for(var key in uiObj) {
                var func = uiObj[key];

                if(typeof(func) == "function" && _.inArray(key, exFuncList) == -1) {
                    (function(funcName, funcObj, funcIndex, funcChildIndex) {
                        uiObj.__proto__[funcName] = function() {
                            var nStart = Date.now();
                            var resultObj = funcObj.apply(this, arguments);
                            var nEnd = Date.now();

                            if(typeof(callback) == "function") {
                                callback({
                                    type: jui.get(i).type,
                                    name: funcName,
                                    c_index: funcIndex,
                                    u_index: funcChildIndex,
                                    time: nEnd - nStart
                                }, arguments);
                            } else {
                                if(!isNaN(funcIndex) && !isNaN(funcChildIndex)) {
                                    console.log(
                                        "TYPE(" + jui.get(i).type + "), " +
                                        "NAME(" + funcName + "), " +
                                        "INDEX(" + funcIndex + ":" + funcChildIndex + "), " +
                                        "TIME(" + (nEnd - nStart) + "ms), " +
                                        "ARGUMENTS..."
                                    );
                                } else {
                                    console.log(
                                        "NAME(" + funcName + "), " +
                                        "TIME(" + (nEnd - nStart) + "ms), " +
                                        "ARGUMENTS..."
                                    );
                                }

                                console.log(arguments);
                                console.log("");
                            }


                            return resultObj;
                        }
                    })(key, func, i, j);
                }
            }
        }

        /**
         * @method debugAll
         * debugs all component objects currently existing
         *
         * @param {Function} callback
         */
        this.debugAll = function(callback) {
            for(var i = 0; i < instances.length; i++) {
                var uiList = instances[i];

                for(var j = 0; j < uiList.length; j++) {
                    this.debug(uiList[j], i, j, callback);
                }
            }
        }

        /**
         * @method addClass
         * Adds a component class
         *
         * @param {Object} uiCls UI Class
         */
        this.addClass = function(uiCls) {
            classes.push(uiCls);
        }

        /**
         * @method getClass
         * Gets a component class
         *
         * @param {String/Integer} key
         * @return {Object}
         */
        this.getClass = function(key) {
            if(_.typeCheck("integer", key)) {
                return classes[key];
            } else if(_.typeCheck("string", key)) {
                for(var i = 0; i < classes.length; i++) {
                    if(key == classes[i].type) {
                        return classes[i];
                    }
                }
            }

            return null;
        }

        /**
         * @method getClassAll
         * Gets all component classes
         *
         * @return {Array}
         */
        this.getClassAll = function() {
            return classes;
        }

        /**
         * @method create
         * It is possible to create a component dynamically after the ready point
         *
         * @param {String} type UI type
         * @param {String/DOMElement} selector
         * @param {Object} options
         * @return {Object}
         */
        this.create = function(type, selector, options) {
            var cls = UIManager.getClass(type);

            if(_.typeCheck("null", cls)) {
                throw new Error("JUI_CRITICAL_ERR: '" + type + "' does not exist");
            }

            return cls["class"](selector, options);
        }
    }

    return UIManager;
});
jui.define("collection", [], function() {

    var UICollection = function (type, selector, options, list) {
        this.type = type;
        this.selector = selector;
        this.options = options;

        this.destroy = function () {
            for (var i = 0; i < list.length; i++) {
                list[i].destroy();
            }
        }

        for (var i = 0; i < list.length; i++) {
            this.push(list[i]);
        }
    }

    // �迭 Ŭ���� ����
    UICollection.prototype = Object.create(Array.prototype);

    return UICollection;
});
jui.define("core", [ "util.base", "util.dom", "manager", "collection" ],
    function(_, $, UIManager, UICollection) {

	/** 
	 * @class core
     * Core classes for all of the components
     *
     * @alias UICore
	 */
	var UICore = function() {

        /**
         * @method emit
         * Generates a custom event. The first parameter is the type of a custom event. A function defined as an option or on method is called
         *
         * @param {String} type Event type
         * @param {Function} args Event Arguments
         * @return {Mixed}
         */
        this.emit = function(type, args) {
            if(!_.typeCheck("string", type)) return;
            var result;

            for(var i = 0; i < this.event.length; i++) {
                var e = this.event[i];

                if(e.type == type.toLowerCase()) {
                    var arrArgs = _.typeCheck("array", args) ? args : [ args ];
                    result = e.callback.apply(this, arrArgs);
                }
            }

            return result;
        }

        /**
         * @method on
         * A callback function defined as an on method is run when an emit method is called
         *
         * @param {String} type Event type
         * @param {Function} callback
         */
        this.on = function(type, callback) {
            if(!_.typeCheck("string", type) || !_.typeCheck("function", callback)) return;
            this.event.push({ type: type.toLowerCase(), callback: callback, unique: false  });
        }

        /**
         * @method off
         * Removes a custom event of an applicable type or callback handler
         *
         * @param {String} type Event type
         */
        this.off = function(type) {
            var event = [];

            for(var i = 0; i < this.event.length; i++) {
                var e = this.event[i];

                if ((_.typeCheck("function", type) && e.callback != type) ||
                    (_.typeCheck("string", type) && e.type != type.toLowerCase())) {
                    event.push(e);
                }
            }

            this.event = event;
        }

        /**
         * @method addValid
         * Check the parameter type of a UI method and generates an alarm when a wrong value is entered
         *
         * @param {String} name Method name
         * @param {Array} params Parameters
         */
        this.addValid = function(name, params) {
            if(!this.__proto__) return;
            var ui = this.__proto__[name];

            this.__proto__[name] = function() {
                var args = arguments;

                for(var i = 0; i < args.length; i++) {
                    if(!_.typeCheck(params[i], args[i])) {
                        throw new Error("JUI_CRITICAL_ERR: the " + i + "th parameter is not a " + params[i] + " (" + name + ")");
                    }
                }

                return ui.apply(this, args);
            }
        }

        /**
         * @method callBefore
         * Sets a callback function that is called before a UI method is run
         *
         * @param {String} name Method name
         * @param {Function} callback
         * @return {Mixed}
         */
        this.callBefore = function(name, callback) {
            if(!this.__proto__) return;
            var ui = this.__proto__[name];

            this.__proto__[name] = function() {
                var args = arguments;

                if(_.typeCheck("function", callback)) {
                    // before 콜백이 false가 이날 경우에만 실행 한다.
                    if(callback.apply(this, args) !== false) {
                        return ui.apply(this, args);
                    }
                } else {
                    return ui.apply(this, args);
                }
            }
        }

        /**
         * @method callAfter
         * Sets a callback function that is called after a UI method is run
         *
         * @param {String} name Method name
         * @param {Function} callback
         * @return {Mixed}
         */
        this.callAfter = function(name, callback) {
            if(!this.__proto__) return;
            var ui = this.__proto__[name];

            this.__proto__[name] = function() {
                var args = arguments,
                    obj = ui.apply(this, args);

                // 실행 함수의 리턴 값이 false일 경우에는 after 콜백을 실행하지 않는다.
                if(_.typeCheck("function", callback) && obj !== false) {
                    callback.apply(this, args);
                }

                return obj;
            }
        }

        /**
         * @method callDelay
         * Sets a callback function and the delay time before/after a UI method is run
         *
         * @param {String} name Method name
         * @param {Function} callback
         */
        this.callDelay = function(name, callObj) { // void 형의 메소드에서만 사용할 수 있음
            if(!this.__proto__) return;

            var ui = this.__proto__[name],
                delay = (!isNaN(callObj.delay)) ? callObj.delay : 0;

            this.__proto__[name] = function() {
                var self = this,
                    args = arguments;

                if(_.typeCheck("function", callObj.before)) {
                    callObj.before.apply(self, args);
                }

                if(delay > 0) {
                    setTimeout(function() {
                        callFunc(self, args);
                    }, delay);
                } else {
                    callFunc(self, args);
                }
            }

            function callFunc(self, args) {
                var obj = ui.apply(self, args);

                if(_.typeCheck("function", callObj.after) && obj !== false) { // callAfter와 동일
                    callObj.after.apply(self, args);
                }
            }
        }

        /**
         * @method setTpl
         * Dynamically defines the template method of a UI
         *
         * @param {String} name Template name
         * @param {String} html Template markup
         */
        this.setTpl = function(name, html) {
            this.tpl[name] = _.template(html);
        }

        /**
         * @method setOption
         * Dynamically defines the options of a UI
         *
         * @param {String} key
         * @param {Mixed} value
         */
        this.setOption = function(key, value) {
            if(_.typeCheck("object", key)) {
                for(var k in key) {
                    this.options[k] = key[k];
                }
            } else {
                this.options[key] = value;
            }
        }

        /**
         * @method destroy
         * Removes all events set in a UI obejct and the DOM element
         *
         */
        this.destroy = function() {
            if(this.__proto__) {
                for (var key in this.__proto__) {
                    delete this.__proto__[key];
                }
            }
        }
	};

    UICore.build = function(UI) {

        return function(selector, options) {
            var list = [],
                elemList = [];

            if(_.typeCheck("string", selector)) {
                elemList = $.find(selector);
            } else if(_.typeCheck("object", selector)) {
                elemList.push(selector);
            } else {
                elemList.push(document.createElement("div"));
            }

            for(var i = 0, len = elemList.length; i < len; i++) {
                list[i] = jui.createUIObject(UI, selector, i, elemList[i], options);
            }

            // UIManager에 데이터 입력
            UIManager.add(new UICollection(UI.type, selector, options, list));

            // 객체가 없을 경우에는 null을 반환 (기존에는 빈 배열을 반환)
            if(list.length == 0) {
                return null;
            } else if(list.length == 1) {
                return list[0];
            }

            return list;
        }
    }

	UICore.init = function(UI) {
		var uiObj = null;
		
		if(typeof(UI) === "object") {
            uiObj = UICore.build(UI);
			UIManager.addClass({ type: UI.type, "class": uiObj });
		}
		
		return uiObj;
	}

    UICore.setup = function() {
        return {
            /**
             * @cfg {Object} [tpl={}]
             * Defines a template markup to be used in a UI
             */
            tpl: {},

            /**
             * @cfg {Object} [event={}]
             * Defines a DOM event to be used in a UI
             */
            event: {}
        }
    }

    /**
     * @class jui 
     * 
     * @extends core.UIManager
     * @singleton
     */
	window.jui = (typeof(jui) == "object") ? _.extend(jui, UIManager, true) : UIManager;
	
	return UICore;
});
jui.define("event", [ "jquery", "util.base", "manager", "collection" ],
    function($, _, UIManager, UICollection) {

    var DOMEventListener = function() {
        var list = [];

        function settingEventAnimation(e) {
            var pfx = [ "webkit", "moz", "MS", "o", "" ];

            for (var p = 0; p < pfx.length; p++) {
                var type = e.type;

                if (!pfx[p]) type = type.toLowerCase();
                $(e.target).on(pfx[p] + type, e.callback);
            }

            list.push(e);
        }

        function settingEvent(e) {
            if (e.callback && !e.children) {
                $(e.target).on(e.type, e.callback);
            } else {
                $(e.target).on(e.type, e.children, e.callback);
            }

            list.push(e);
        }

        function settingEventTouch(e) {
            if (e.callback && !e.children) {
                $(e.target).on(getEventTouchType(e.type), e.callback);
            } else {
                $(e.target).on(getEventTouchType(e.type), e.children, e.callback);
            }

            list.push(e);
        }

        function getEventTouchType(type) {
            return {
                "click": "touchstart",
                "dblclick": "touchend",
                "mousedown": "touchstart",
                "mousemove": "touchmove",
                "mouseup": "touchend"
            }[type];
        }

        this.add = function (args) {
            var e = { target: args[0], type: args[1] };

            if (_.typeCheck("function", args[2])) {
                e = $.extend(e, { callback: args[2] });
            } else if (_.typeCheck("string", args[2])) {
                e = $.extend(e, { children: args[2], callback: args[3] });
            }

            // �̺�Ʈ ������ �迭�� ����
            var eventTypes = _.typeCheck("array", e.type) ? e.type : [ e.type ];

            // �̺�Ʈ ������ ���� �̺�Ʈ ����
            for (var i = 0; i < eventTypes.length; i++) {
                e.type = eventTypes[i]

                if (e.type.toLowerCase().indexOf("animation") != -1)
                    settingEventAnimation(e);
                else {
                    // body, window, document ���쿡�� �̺�Ʈ ��ø�� ����
                    if (e.target != "body" && e.target != window && e.target != document) {
                        $(e.target).off(e.type);
                    }

                    if (_.isTouch) {
                        settingEventTouch(e);
                    } else {
                        settingEvent(e);
                    }
                }
            }
        }

        this.trigger = function (selector, type) {
            $(selector).trigger((_.isTouch) ? getEventTouchType(type) : type);
        }

        this.get = function (index) {
            return list[index];
        }

        this.getAll = function () {
            return list;
        }

        this.size = function () {
            return list.length;
        }
    }

    var UIEvent = function () {
        var vo = null;

        /**
         * @method find
         * Get the child element of the root element
         *
         * @param {String/HTMLElement} Selector
         * @returns {*|jQuery}
         */
        this.find = function(selector) {
            return $(this.root).find(selector);
        }

        /**
         * @method addEvent
         * Defines a browser event of a DOM element
         *
         * @param {String/HTMLElement} selector
         * @param {String} type Dom event type
         * @param {Function} callback
         */
        this.addEvent = function() {
            this.listen.add(arguments);
        }

        /**
         * @method addTrigger
         * Generates an applicable event to a DOM element
         *
         * @param {String/HTMLElement} Selector
         * @param {String} Dom event type
         */
        this.addTrigger = function(selector, type) {
            this.listen.trigger(selector, type);
        }

        /**
         * @method setVo
         * Dynamically defines the template method of a UI
         *
         * @deprecated
         */
        this.setVo = function() { // @Deprecated
            if(!this.options.vo) return;

            if(vo != null) vo.reload();
            vo = $(this.selector).jbinder();

            this.bind = vo;
        }

        /**
         * @method destroy
         * Removes all events set in a UI obejct and the DOM element
         *
         */
        this.destroy = function() {
            for (var i = 0; i < this.listen.size(); i++) {
                var obj = this.listen.get(i);
                $(obj.target).off(obj.type);
            }

            // ������ �޼ҵ� �޸𸮿��� ����
            if(this.__proto__) {
                for (var key in this.__proto__) {
                    delete this.__proto__[key];
                }
            }
        }
    }

    UIEvent.build = function(UI) {

        return function(selector, options) {
            var list = [],
                $root = $(selector || "<div />");

            $root.each(function (index) {
                list[index] = jui.createUIObject(UI, $root.selector, index, this, options, function(mainObj, opts) {
                    /** @property {Object} listen Dom events */
                    mainObj.init.prototype.listen = new DOMEventListener();

                    $("script").each(function (i) {
                        if (selector == $(this).data("jui") || selector == $(this).data("vo") || selector instanceof HTMLElement) {
                            var tplName = $(this).data("tpl");

                            if (tplName == "") {
                                throw new Error("JUI_CRITICAL_ERR: 'data-tpl' property is required");
                            }

                            opts.tpl[tplName] = $(this).html();
                        }
                    });
                });
            });

            // UIManager�� ������ �Է�
            UIManager.add(new UICollection(UI.type, selector, options, list));

            // ��ü�� ���� ���쿡�� null�� ��ȯ (�������� �� �迭�� ��ȯ)
            if(list.length == 0) {
                return null;
            } else if(list.length == 1) {
                return list[0];
            }

            return list;
        }
    }

    UIEvent.init = function(UI) {
        var uiObj = null;

        if(typeof(UI) === "object") {
            uiObj = UIEvent.build(UI);
            UIManager.addClass({ type: UI.type, "class": uiObj });
        }

        return uiObj;
    }

    UIEvent.setup = function() {
        return {
            /**
             * @cfg {Object} [vo=null]
             * Configures a binding object of a markup
             *
             * @deprecated
             */
            vo: null
        }
    }

    return UIEvent;
}, "core");