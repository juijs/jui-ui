(function ($, window, nodeGlobal) {
	var global = {jquery: $}, globalFunc = {}, globalClass = {};
	var navigator = window.navigator;

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
	 * @class QuickSort
	 *
	 * 퀵 정렬
	 *
	 * @param {Array} array
	 * @param {Boolean} isClone  isClone 이 true 이면, 해당 배열을 참조하지 않고 복사해서 처리
	 * @constructor
	 * @private
	 */
	var QuickSort = function (array, isClone) { //
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

	/**
	 * @class IndexParser
	 *
	 * 0.0.1 형식의 키 문자열을 제어하는 클래스
	 *
	 * @private
	 * @constructor
	 */
	var IndexParser = function () {
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
		this.getIndexList = function (index) { // 트리 구조의 모든 키를 배열 형태로 반환
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
		this.getNextIndex = function (index) { // 현재 인덱스에서 +1
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

			// BOM 코드 적용 (UTF-8 관련)
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

	/**
	 * Private Functions
	 *
	 */
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
			settings = _.defaults(settings || {}, globalOpts.template);

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
			msie: (navigator.userAgent.indexOf("Trident") != -1) ? true : false
		},
		/**
		 * @property {Boolean} isTouch
		 * check touch device
		 */
		isTouch: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

		//-- Functions
		/**
		 * @method scrollWidth
		 * returns scroll width for body
		 * @return {Number}
		 */
		scrollWidth: function () {
			var isJUI = ($(".jui").size() > 0 && this.browser.webkit) ? true : false;

			var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div></div>');
			$('body').append(div);
			var w1 = $('div', div).innerWidth();
			div.css('overflow-y', 'auto');
			var w2 = $('div', div).innerWidth();
			$(div).remove();

			return (isJUI) ? 10 : (w1 - w2);
		},
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
			if (!this.typeCheck("object", origin)) origin = {};
			if (!this.typeCheck("object", add)) return origin;

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
			if (typeof(px) == "string" && px.indexOf("px") != -1) {
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
			var clone = ($.isArray(obj)) ? [] : {};

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
			if (!obj) return template(html);
			else return template(html, obj);
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

			$(window).resize(function () {
				after_resize();
			});
		},
		/**
		 * @method index
		 *
		 * IndexParser 객체 생성
		 *
		 * @return {IndexParser}
		 */
		index: function () {
			return new IndexParser();
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
			var opts = $.extend({
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
				if (typeof(callback) == "function") {
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

						if ($.inArray(keys[j], csvNumber) != -1) {
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
		btoa: Base64.encode,
		/**
		 * @method atob
		 *
		 * Base64 디코딩
		 *
		 * @return {String}
		 */
		atob: Base64.decode,

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

			if (!utility.typeCheck(["function", "object"], module)) {
				var modules = getModules(depends[i]);

				if (modules == null) {
					throw new Error("JUI_CRITICAL_ERR: '" + depends[i] + "' is not loaded");
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
				if (utility.typeCheck(["function", "object"], global[key])) {
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

			if (!utility.typeCheck(["array", "null"], depends) || !utility.typeCheck("function", callback)) {

				throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
			}

			$(function () {
				if (depends) {
					args = getDepends(depends);
				} else {
					args = [getModules("ui"), getModules("uix"), utility];
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
		 * @param {String} parent 'depends'와 달리 'define'으로 정의된 클래스만 상속받을 수 있다.
		 */
		defineUI: function (name, depends, callback, parent) {
			if (!utility.typeCheck("string", name) || !utility.typeCheck("array", depends) || !utility.typeCheck("function", callback) || !utility.typeCheck(["string", "undefined"], parent)) {

				throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
			}

			if (utility.typeCheck("function", globalClass[name])) {
				throw new Error("JUI_CRITICAL_ERR: '" + name + "' is already exist");
			}

			if (utility.typeCheck("undefined", parent)) { // 기본적으로 'core' 클래스를 상속함
				parent = "core";
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
			global[name] = globalClass["core"].init({
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

				if ($.inArray(name, defOptKeys) == -1 && $.inArray(name, exceptOpts) == -1) {
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
					throw new Error("JUI_CRITICAL_ERR: '" + name + "' is not loaded");
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
})(jQuery || $, window, (typeof global !== "undefined") ? global : window);
