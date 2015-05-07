(function($, window, nodeGlobal) {
	var global = { jquery: $ }, globalFunc = {}, globalClass = {} ;
    var navigator = window.navigator;

	// JUI의 기본 설정 값 (향후 더 추가될 수 있음)
	var globalOpts = {
		template: {
			evaluate : /<\!([\s\S]+?)\!>/g,
			interpolate : /<\!=([\s\S]+?)\!>/g,
			escape : /<\!-([\s\S]+?)\!>/g
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
	var QuickSort = function(array, isClone) { //
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

            for(var v = left; v < right; v++) {
            	if(compareFunc(array[v], pivotValue) || !compareFunc(pivotValue, array[v]) && v%2 == 1) {
                	swap(v, storeIndex);
                    storeIndex++;
                }
            }

            swap(right, storeIndex);

            return storeIndex;
        }

        this.setCompare = function(func) {
        	compareFunc = func;
        }

        this.run = function(left, right) {
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
	var IndexParser = function() {
		/**
		 * @method isIndexDepth
		 *
		 * @param {String} index
		 * @return {Boolean}
		 */
		this.isIndexDepth = function(index) {
			if(typeof(index) == "string" && index.indexOf(".") != -1) {
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
		this.getIndexList = function(index) { // 트리 구조의 모든 키를 배열 형태로 반환
			var resIndex = [], strIndex = "" + index;
			
			if(strIndex.length == 1) {
				resIndex[0] = parseInt(index);
			} else {
				var keys = strIndex.split(".");
				
				for(var i = 0; i < keys.length; i++) {
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
		this.changeIndex = function(index, targetIndex, rootIndex) {
			var rootIndexLen = this.getIndexList(rootIndex).length,
				indexList = this.getIndexList(index),
				tIndexList = this.getIndexList(targetIndex);
			
			for(var i = 0; i < rootIndexLen; i++) {
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
		this.getNextIndex = function(index) { // 현재 인덱스에서 +1
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
		this.getParentIndex = function(index) {
			if(!this.isIndexDepth(index)) return null;
			var keys = this.getIndexList(index);
			
			if(keys.length == 2) {
				return "" + keys[0];
			} else if(keys.length > 2) {
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
	    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	 
	    // public method for encoding
	    encode : function (input) {
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
	    decode : function (input) {
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
	    _utf8_encode : function (string) {
	        string = string.replace(/\r\n/g,"\n");
	        
	        // BOM 코드 적용 (UTF-8 관련)
	        var utftext = String.fromCharCode(239) + String.fromCharCode(187) + String.fromCharCode(191);

	        for (var n = 0; n < string.length; n++) {

	            var c = string.charCodeAt(n);
	 
	            if (c < 128) {
	                utftext += String.fromCharCode(c);
	            }
	            else if((c > 127) && (c < 2048)) {
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
	    _utf8_decode : function (utftext) {
	        var string = "";
	        var i = 0;
	        var c = c1 = c2 = 0;
	 
	        while ( i < utftext.length ) {
	 
	            c = utftext.charCodeAt(i);
	 
	            if (c < 128) {
	                string += String.fromCharCode(c);
	                i++;
	            }
	            else if((c > 191) && (c < 224)) {
	                c2 = utftext.charCodeAt(i+1);
	                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	                i += 2;
	            }
	            else {
	                c2 = utftext.charCodeAt(i+1);
	                c3 = utftext.charCodeAt(i+2);
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
	var template = function(text, data, settings) {
		var _ = {},
			breaker = {};
	
		var ArrayProto = Array.prototype,
			slice = ArrayProto.slice,
			nativeForEach = ArrayProto.forEach;
		
		var escapes = {
			'\\' : '\\',
			"'" : "'",
			'r' : '\r',
			'n' : '\n',
			't' : '\t',
			'u2028' : '\u2028',
			'u2029' : '\u2029'
		};
	
		for (var p in escapes)
		escapes[escapes[p]] = p;
		
		var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g,
			unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g,
			noMatch = /.^/;
		
		var unescape = function(code) {
			return code.replace(unescaper, function(match, escape) {
				return escapes[escape];
			});
		};
	
		var each = _.each = _.forEach = function(obj, iterator, context) {
			if (obj == null)
				return;
			if (nativeForEach && obj.forEach === nativeForEach) {
				obj.forEach(iterator, context);
			} else if (obj.length === +obj.length) {
				for (var i = 0, l = obj.length; i < l; i++) {
					if ( i in obj && iterator.call(context, obj[i], i, obj) === breaker)
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
	
		_.has = function(obj, key) {
			return hasOwnProperty.call(obj, key);
		};
	
		_.defaults = function(obj) {
			each(slice.call(arguments, 1), function(source) {
				for (var prop in source) {
					if (obj[prop] == null)
						obj[prop] = source[prop];
				}
			});
			return obj;
		};
	
		_.template = function(text, data, settings) {
			settings = _.defaults(settings || {}, globalOpts.template);
	
			var source = "__p+='" + text.replace(escaper, function(match) {
				return '\\' + escapes[match];
			}).replace(settings.escape || noMatch, function(match, code) {
				return "'+\n_.escape(" + unescape(code) + ")+\n'";
			}).replace(settings.interpolate || noMatch, function(match, code) {
				return "'+\n(" + unescape(code) + ")+\n'";
			}).replace(settings.evaluate || noMatch, function(match, code) {
				return "';\n" + unescape(code) + "\n;__p+='";
			}) + "';\n";
	
			if (!settings.variable)
				source = 'with(obj||{}){\n' + source + '}\n';
	
			source = "var __p='';" + "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + source + "return __p;\n";
	
			var render = new Function(settings.variable || 'obj', '_', source);
			if (data)
				return render(data, _);
			var template = function(data) {
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
			webkit: (typeof window.webkitURL != "undefined") ? true : false,
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
		scrollWidth: function() {
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
		inherit: function(ctor, superCtor) {
			if(!this.typeCheck("function", ctor) || !this.typeCheck("function", superCtor)) return;

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
            ctor.prototype.super = function(method, args) {
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
		extend: function(origin, add, skip) {
			if(!this.typeCheck("object", origin)) origin = {};
			if(!this.typeCheck("object", add)) return origin;

			for(var key in add) {
				if(skip === true) {
					if(isRecursive(origin[key])) {
						this.extend(origin[key], add[key], skip);
					} else if(this.typeCheck("undefined", origin[key])) {
						origin[key] = add[key];
					}
				} else {
					if(isRecursive(origin[key])) {
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
		pxToInt: function(px) {
			if(typeof(px) == "string" && px.indexOf("px") != -1) {
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
		clone: function(obj) {
			var clone = ($.isArray(obj)) ? [] : {};

	        for(var i in obj) {
	            if(this.typeCheck("object", obj[i]))
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
        deepClone: function(obj, emit) {
            var value = null;
            emit = emit  || {};

            if(this.typeCheck("array", obj )) {
                value = new Array(obj.length);

                for(var i = 0, len = obj.length; i < len; i++) {
                    value[i] = this.deepClone(obj[i], emit);
                }
            } else if(this.typeCheck("date", obj)) {
                value = obj;
            } else if(this.typeCheck("object", obj)) {
                value = {};

                for(var key in obj) {
                    if (emit[key]) {
                        value[key] = obj[key];
                    }  else {
                        value[key] = this.deepClone(obj[key], emit);
                    }
                }
            } else {
                value = obj;
            }

            return value ;
        },
		/**
		 * @method sort
		 * use QuickSort
		 * @param {Array} array
		 * @return {QuickSort}
		 */
		sort: function(array) {
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
		runtime: function(name, callback) {
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
		template: function(html, obj) {
			if(!obj) return template(html);
			else return template(html, obj);
		},
		/**
		 * @method resize
		 * add event in window resize event
		 * @param {Function} callback
		 * @param {Number} ms delay time 
		 */
		resize: function(callback, ms) {
			var after_resize = (function(){
				var timer = 0;

				return function() {
				    clearTimeout(timer);
				    timer = setTimeout(callback, ms);
				}
			})();

			$(window).resize(function() {
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
		index: function() {
			return new IndexParser();
		},
		/**
		 * @method chunk 
		 * split array by length
		 * @param {Array} arr
		 * @param {Number} len
		 * @return {Array}
		 */
		chunk: function(arr, len) {
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
		typeCheck: function(t, v) {
			function check(type, value) {
				if(typeof(type) != "string") return false;

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
						value !== null &&
						!(value instanceof Array) &&
						!(value instanceof Date) &&
						!(value instanceof RegExp)
					);
				}

				return false;
			}
			
			if(typeof(t) == "object" && t.length) {
				var typeList = t;
				
				for(var i = 0; i < typeList.length; i++) {
					if(check(typeList[i], v)) return true;
				}
				
				return false;
			} else {
				return check(t, v);
			}
		},
		typeCheckObj: function(uiObj, list) {
			if(typeof(uiObj) != "object") return;
			var self = this;
			
			for(var key in uiObj) {
				var func = uiObj[key];
				
				if(typeof(func) == "function") {
					(function(funcName, funcObj) {
						uiObj[funcName] = function() {
							var args = arguments,
								params = list[funcName];
							
							for(var i = 0; i < args.length; i++) {
								if(!self.typeCheck(params[i], args[i])) {
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
		dataToCsv: function(keys, dataList, dataSize) {
			var csv = "", len = (!dataSize) ? dataList.length : dataSize;
			
			for(var i = -1; i < len; i++) {
				var tmpArr = [];
				
				for(var j = 0; j < keys.length; j++) {
					if(keys[j]) {
						if(i == -1) {
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
		dataToCsv2: function(options) {
			var csv = "";
			var opts = $.extend({
				fields: null, // required
				rows: null, // required
				names: null,
				count: (this.typeCheck("integer", options.count)) ? options.count : options.rows.length
			}, options);
			
			for(var i = -1; i < opts.count; i++) {
				var tmpArr = [];
				
				for(var j = 0; j < opts.fields.length; j++) {
					if(opts.fields[j]) {
						if(i == -1) {
							if(opts.names && opts.names[j]) {
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
		fileToCsv: function(file, callback) {
			var reader = new FileReader();
			
	        reader.onload = function(readerEvt) {
	            if(typeof(callback) == "function") {
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
		csvToBase64: function(csv) {
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
		csvToData: function(keys, csv, csvNumber) {
			var dataList = [],
				tmpRowArr = csv.split("\n")

			for(var i = 1; i < tmpRowArr.length; i++) {
				if(tmpRowArr[i] != "") {
					var tmpArr = tmpRowArr[i].split(","), // TODO: 값 안에 콤마(,)가 있을 경우에 별도로 처리해야 함
						data = {};
					
					for(var j = 0; j < keys.length; j++) {
                        data[keys[j]] = tmpArr[j];

                        // '"' 로 감싸져있는 문자열은 '"' 제거
                        if(this.startsWith(tmpArr[j], '"') && this.endsWith(tmpArr[j], '"')) {
                            data[keys[j]] = tmpArr[j].split('"').join('');
                        } else {
                            data[keys[j]] = tmpArr[j];
                        }

                        if($.inArray(keys[j], csvNumber) != -1) {
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
		getCsvFields: function(fields, csvFields) {
			var tmpFields = (this.typeCheck("array", csvFields)) ? csvFields : fields;
			
			for(var i = 0; i < tmpFields.length; i++) {
				if(!isNaN(tmpFields[i])) {
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
        svgToBase64: function(xml) {
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
        dateFormat: function(date, format, utc) {
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
		createId: function(key) {
			return [ key || "id", (+new Date), Math.round(Math.random() * 100) % 100 ].join("-");
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
		 * @method loop
		 *
		 * 최적화된 루프 생성 (5단계로 나눔)
		 *
		 * @param {Number} total
         * @param {Object} [context=null]
         * @return {Function} 최적화된 루프 콜백 (index, groupIndex 2가지 파라미터를 받는다.)
		 */
		loop : function(total, context) {
			var start = 0,
				end = total,
				unit = Math.ceil(total/5);

			return function(callback) {
				var first = start, second = unit * 1, third = unit * 2, fourth = unit * 3, fifth = unit * 4,
					firstMax = second, secondMax = third, thirdMax = fourth, fourthMax = fifth, fifthMax = end;

				while(first < firstMax && first < end) {
					callback.call(context, first, 1); first++;

					if(second < secondMax && second < end) { callback.call(context, second, 2); second++; }
					if(third < thirdMax && third < end) { callback.call(context, third, 3); third++; }
					if(fourth < fourthMax && fourth < end) { callback.call(context, fourth, 4); fourth++; }
					if(fifth < fifthMax && fifth < end) { callback.call(context, fifth, 5); fifth++; }
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
		loopArray : function(data, context) {
            var total = data.length,
				start = 0,
				end = total,
				unit = Math.ceil(total/5);

			return function(callback) {
				var first = start, second = unit * 1, third = unit * 2, fourth = unit * 3, fifth = unit * 4,
					firstMax = second, secondMax = third, thirdMax = fourth, fourthMax = fifth, fifthMax = end;

				while(first < firstMax && first < end) {
					callback.call(context, data[first], first, 1); first++;
					if (second < secondMax && second < end) { callback.call(context, data[second], second, 2); second++; }
					if (third < thirdMax && third < end) { callback.call(context, data[third], third, 3); third++; }
					if (fourth < fourthMax && fourth < end) { callback.call(context, data[fourth], fourth, 4); fourth++; }
					if (fifth < fifthMax && fifth < end) { callback.call(context, data[fifth], fifth, 5); fifth++; }
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
        makeIndex : function(data, keyField) {
            var list = {},
				func = this.loopArray(data);
            
            func(function(d, i) {
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
		startsWith : function(string, searchString, position) {
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
		endsWith : function(string, searchString, position) {
			var subjectString = string;

			if(position === undefined || position > subjectString.length) {
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
	var getDepends = function(depends) {
		var args = [];
		
		for(var i = 0; i < depends.length; i++) {
            var module = global[depends[i]];
			
			if(!utility.typeCheck([ "function", "object" ], module)) {
                var modules = getModules(depends[i]);

                if(modules == null) {
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

    var getModules = function(parent) {
        var modules = null,
            parent = parent + ".";

        for(var key in global) {
            if(key.indexOf(parent) != -1) {
                if(utility.typeCheck([ "function", "object" ], global[key])) {
                    var child = key.split(parent).join("");

                    if(child.indexOf(".") == -1) {
                        if(modules == null) {
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
		ready: function() {
			var args = [],
				callback = (arguments.length == 2) ? arguments[1] : arguments[0],
				depends = (arguments.length == 2) ? arguments[0] : null;

			if(!utility.typeCheck([ "array", "null" ], depends) ||
					!utility.typeCheck("function", callback)) {
			
				throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
			}

			$(function() { 
				if(depends) {
					args = getDepends(depends);
				} else {
					args = [ getModules("ui"), getModules("uix"), utility ];
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
		defineUI: function(name, depends, callback, parent) {
			if(!utility.typeCheck("string", name) || !utility.typeCheck("array", depends) ||
				!utility.typeCheck("function", callback) || !utility.typeCheck([ "string", "undefined" ], parent)) {

				throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
			}

			if(utility.typeCheck("function", globalClass[name])) {
				throw new Error("JUI_CRITICAL_ERR: '" + name + "' is already exist");
			}

			if(utility.typeCheck("undefined", parent)) { // 기본적으로 'core' 클래스를 상속함
				parent = "core";
			}

			if(!utility.typeCheck("function", globalClass[parent])) {
				throw new Error("JUI_CRITICAL_ERR: Parents are the only function");
			} else {
				if(globalFunc[parent] !== true) {
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
			if(typeof define == "function" && define.amd) {
				define(name, function() { return global[name] });
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
        define: function(name, depends, callback, parent) {
            if(!utility.typeCheck("string", name) || !utility.typeCheck("array", depends) ||
                !utility.typeCheck("function", callback) || !utility.typeCheck([ "string", "undefined" ], parent)) {

                throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
            }

            if(utility.typeCheck("function", globalClass[name])) {
                throw new Error("JUI_CRITICAL_ERR: '" + name + "' is already exist");
            }

            var args = getDepends(depends),
                uiFunc = callback.apply(null, args);

            if(utility.typeCheck("function", globalClass[parent])) {
                if(globalFunc[parent] !== true) {
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
			if(typeof define == "function" && define.amd) {
				define(name, function() { return global[name] });
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
		defineOptions: function(Module, options, exceptOpts) {
			var defOpts = getOptions(Module, {});
			var defOptKeys = Object.keys(defOpts),
				optKeys = Object.keys(options);

			// 정의되지 않은 옵션 사용 유무 체크
			for(var i = 0; i < optKeys.length; i++) {
				var name = optKeys[i];

				if($.inArray(name, defOptKeys) == -1 && $.inArray(name, exceptOpts) == -1) {
					throw new Error("JUI_CRITICAL_ERR: '" + name + "' is not an option");
				}
			}

			// 사용자 옵션 + 기본 옵션
			utility.extend(options, defOpts, true);

			// 상위 모듈의 옵션까지 모두 얻어오는 함수
			function getOptions(Module, options) {
				if(utility.typeCheck("function", Module)) {
					if(utility.typeCheck("function", Module.setup)) {
						var opts = Module.setup();

						for(var key in opts) {
							if(utility.typeCheck("undefined", options[key])) {
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
        include: function(name) {
            if(!utility.typeCheck("string", name)) {
                throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
            }

            var module = global[name];

            if(utility.typeCheck([ "function", "object" ], module)) {
                return module;
            } else {
                var modules = getModules(name);

                if(modules == null) {
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
        includeAll: function() {
            var result = [];

            for(var key in global) {
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
		log: function(logUrl) {
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

		setup: function(options) {
			if(utility.typeCheck("object", options)) {
				globalOpts = utility.extend(globalOpts, options);
			}

			return globalOpts;
		}
	};
})(jQuery || $, window, (typeof global !== "undefined") ? global : window);

jui.define("core", [ "jquery", "util.base" ], function($, _) {

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
                // 셀렉터 객체 검색
				for(var i = 0; i < instances.length; i++) {
                    var uiSet = instances[i];

					if(key == uiSet.selector) {
					    return (uiSet.length == 1) ? uiSet[0] : uiSet;
                    }
				}

                // 모듈 객체 검색
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
            if(_.typeCheck("integer", index)) { // UI 객체 인덱스
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
				
				if(typeof(func) == "function" && $.inArray(key, exFuncList) == -1) {
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
	
	var UIListener = function() {
		var list = [];

		function settingEventAnimation(e) {
			var pfx = [ "webkit", "moz", "MS", "o", "" ];
			
			for(var p = 0; p < pfx.length; p++) {
				var type = e.type;

				if(!pfx[p]) type = type.toLowerCase();
				$(e.target).on(pfx[p] + type, e.callback);
			}
			
			list.push(e);
		}
		
		function settingEvent(e) {
			if(e.callback && !e.children) {
				$(e.target).on(e.type, e.callback);
			} else {
				$(e.target).on(e.type, e.children, e.callback);
			}
			
			list.push(e);
		}
		
		function settingEventTouch(e) {
			if(e.callback && !e.children) {
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
		
		this.add = function(args) {
			var e = { target: args[0], type: args[1] };
			
			if(_.typeCheck("function", args[2])) {
				e = $.extend(e, { callback: args[2] });
			} else if(_.typeCheck("string", args[2])) {
				e = $.extend(e, { children: args[2], callback: args[3] });
			}

            // 이벤트 유형을 배열로 변경
            var eventTypes = _.typeCheck("array", e.type) ? e.type : [ e.type ];

			// 이벤트 유형에 따른 이벤트 설정
            for(var i = 0; i < eventTypes.length; i++) {
                e.type = eventTypes[i]

                if (e.type.toLowerCase().indexOf("animation") != -1)
                    settingEventAnimation(e);
                else {
                    if (e.target != "body" && e.target != window) { // body와 window일 경우에만 이벤트 중첩이 가능
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
		
		this.trigger = function(selector, type) {
			$(selector).trigger((_.isTouch) ? getEventTouchType(type) : type);
		}
		
		this.get = function(index) {
			return list[index];
		}
		
		this.getAll = function() {
			return list;
		}
		
		this.size = function() {
			return list.length;
		}
	}

    var UICoreSet = function(type, selector, options, list) {
        this.type = type;
        this.selector = selector;
        this.options = options;

        this.destroy = function() {
            for(var i = 0; i < list.length; i++) {
                list[i].destroy();
            }
        }

        for(var i = 0; i < list.length; i++) {
            this.push(list[i]);
        }
    }

    // 배열 클래스 상속
    UICoreSet.prototype = Object.create(Array.prototype);
	
	
	/** 
	 * @class core
     * Core classes for all of the components
     *
     * @alias UICore
	 */
	var UICore = function() {
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
         * @method emit
         * Generates a custom event. The first parameter is the type of a custom event. A function defined as an option or on method is called
         *
         * @param {String} type Event type
         * @param {Function} args Event Arguments
         * @return {Mixed}
         */
        this.emit = function(type, args) {
            if(typeof(type) != "string") return;
            var result;

            for(var i = 0; i < this.event.length; i++) {
                var e = this.event[i];

                if(e.type == type.toLowerCase()) {
                    var arrArgs = (typeof(args) == "object" && args.length) ? args : [ args ];
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
            if(typeof(type) != "string" || typeof(callback) != "function") return;
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

                if ((typeof(type) == "function" && e.callback != type) ||
                    (typeof(type) == "string" && e.type != type.toLowerCase())) {
                    event.push(e);
                }
            }

            this.event = event;
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

                if(typeof(callback) == "function") {
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
                if(typeof(callback) == "function" && obj !== false) {
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

                if(typeof(callObj.before) == "function") {
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

                if(typeof(callObj.after) == "function" && obj !== false) { // callAfter와 동일
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
         * @method setOption
         * Dynamically defines the options of a UI
         *
         * @param {String} key
         * @param {Mixed} value
         */
        this.setOption = function(key, value) {
            if(typeof(key) == "object") {
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
            if(!this.__proto__) return;

            for(var i = 0; i < this.listen.size(); i++) {
                var obj = this.listen.get(i);
                $(obj.target).off(obj.type);
            }

            for(var key in this.__proto__) {
                delete this.__proto__[key];
            }
        }
	};

    UICore.build = function(UI) {

        return function(selector, options) {
            var $root = $(selector || "<div />");
            var list = [];

            $root.each(function(index) {
                var mainObj = new UI["class"]();

                // Check Options
                var opts = jui.defineOptions(UI["class"], options || {});

                // Public Properties
                mainObj.init.prototype = mainObj;
                /** @property {String/HTMLElement} selector */
                mainObj.init.prototype.selector = $root.selector;
                /** @property {HTMLElement} root */
                mainObj.init.prototype.root = this;
                /** @property {Object} options */
                mainObj.init.prototype.options = opts;
                /** @property {Object} tpl Templates */
                mainObj.init.prototype.tpl = {};
                /** @property {Array} event Custom events */
                mainObj.init.prototype.event = new Array(); // Custom Event
                /** @property {Object} listen Dom events */
                mainObj.init.prototype.listen = new UIListener(); // DOM Event
                /** @property {Integer} timestamp UI Instance creation time*/
                mainObj.init.prototype.timestamp = new Date().getTime();
                /** @property {Integer} index Index of UI instance*/
                mainObj.init.prototype.index = index;
                /** @property {Class} module Module class */
                mainObj.init.prototype.module = UI;

                // Template Setting (Markup)
                $("script").each(function(i) {
                    if(selector == $(this).data("jui") || selector == $(this).data("vo") || selector instanceof HTMLElement) {
                        var tplName = $(this).data("tpl");

                        if(tplName == "") {
                            throw new Error("JUI_CRITICAL_ERR: 'data-tpl' property is required");
                        }

                        opts.tpl[tplName] = $(this).html();
                    }
                });

                // Template Setting (Script)
                for(var name in opts.tpl) {
                    var tplHtml = opts.tpl[name];

                    if(_.typeCheck("string", tplHtml) && tplHtml != "") {
                        mainObj.init.prototype.tpl[name] = _.template(tplHtml);
                    }
                }

                var uiObj = new mainObj.init();

                // Event Setting
                for(var key in opts.event) {
                    uiObj.on(key, opts.event[key]);
                }

                list[index] = uiObj;

                // 엘리먼트 객체에 jui 속성 추가
                this.jui = uiObj;
            });

            // UIManager에 데이터 입력
            UIManager.add(new UICoreSet(UI.type, selector, options, list));

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
            event: {},

            /**
             * @cfg {Object} [vo=null]
             * Configures a binding object of a markup
             *
             * @deprecated
             */
            vo: null
        }
    }

    /**
     * @class jui 
     * 
     * @extends core.UIManager
     * @singleton
     */
	window.jui = (typeof(jui) == "object") ? $.extend(jui, UIManager) : UIManager;
	
	return UICore;
});
jui.define("util.math", [], function() {

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
	}

	return self;
});

jui.define("util.time", [ "util.base" ], function(_) {

	/**
	 * time 객체 
	 * 
	 */
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

			func.ticks = function(type, step) {
				var start = _domain[0];
				var end = _domain[1];

				var times = [];
				while (start < end) {
					times.push(new Date(+start));

					start = _time.add(start, type, step);

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

			func.ticks = function(count, isNice, intNumber, reverse) {
				intNumber = intNumber || 10000;
				reverse = reverse || false;
				var max = func.max();

				if (_domain[0] == 0 && _domain[1] == 0) {
					return [];
				}

				var obj = math.nice(_domain[0], _domain[1], count || 10, isNice || false);

				var arr = [];

				var start = (reverse ? obj.max : obj.min) * intNumber;
				var end = (reverse ? obj.min : obj.max) * intNumber;
				while ((reverse ? end <= start : start <= end)) {

					arr.push(start / intNumber);

					var unit = obj.spacing * intNumber;

					if (reverse) {
						start -= unit;
					} else {
						start += unit;
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
					if (arr[arr.length - 1] * intNumber != end && start > end) {
						arr.push(end / intNumber);
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

jui.define("util.color", [], function() {

	/**
	 *  @class util.color
     * color parser for chart
	 * @singleton
	 */
	var self = {
		
		regex  : /(linear|radial)\((.*)\)(.*)/i,
		
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
	
	}

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

        this.html = function(html) {
            this.element.innerHTML = html;

            return this;
        }

        this.text = function(text) {
            this.element.innerHTML = "";
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
            var len = target.children.length;
            for(var i = 0; i < len; i++) {
                var child = target.children[i];

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
              
              var png = canvas.toDataURI(type);
              
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
         * @method getTextRect
         *
         * caculate real pixel size of text element
         *
         * @param {String} text target text
         * @return {Object}
         * @return {Integer} return.width  text element's width (px)
         * @return {Integer} return.height text element's height(px)
         */
        this.getTextRect = function(text) {

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

jui.defineUI("ui.button", [ "jquery", "util.base" ], function($, _) {

    var UIRadio = function(ui, element, options) {
		this.data = { index: 0, value: "", elem: null };
		
		this.ui = ui;
		this.element = element;
		this.options = $.extend({ index: 0, value: "" }, options);
		
		// Private
		this._setting = function(type, e, order) {
			var self = this,
				className = "active",
				index = this.options.index,
				value = this.options.value;

			$(self.element).children(".btn").each(function(i) {
				if(type == "event") {
					if(e.currentTarget == this) on(i, this);
					else off(this);
				} else if(type == "init") {
					if(order == "value") {
						if(value == $(this).attr("value")) on(i, this);
						else off(this);
					} else {
						if(index == i) on(i, this);
						else off(this);
					}
				}
			});

			function on(i, elem) {
				var value = $(elem).attr("value"),
					text = $(elem).text();

				self.data = { index: i, value: value, text: text };
				$(elem).addClass(className);
			}

			function off(elem) {
				$(elem).removeClass(className);
			}
		}


		this.init = function() {
			var self = this;

			// Event
			this.ui.addEvent($(self.element).children(".btn"), "click", function(e) {
				self._setting("event", e);

                self.ui.emit("click", [ self.data, e ]);
				self.ui.emit("change", [ self.data, e ]);

				e.preventDefault();
			});

			// Init
			if(this.options.value != "") {
				this._setting("init", this.options.value, "value");
			} else {
				this._setting("init", this.options.index, "index");
			}
		}
	}

	var UICheck = function() {
		this.data = [];
		this.options = $.extend({ index: [], value: [] }, this.options);

		this._setting = function(type, e, order) {
			var self = this,
				className = "active",
				index = this.options.index,
				value = this.options.value;

			$(self.element).children(".btn").each(function(i) {
				if(type == "init") {
					if(order == "value") {
						if(inArray(value, $(this).attr("value"))) on(i, this);
						else off(i, this);
					} else {
						if(inArray(index, i)) on(i, this);
						else off(i, this);
					}
				} else {
					if(e.currentTarget == this) {
						if(!$(this).hasClass("active")) on(i, this);
						else off(i, this);
					}
				}
			});
			
			function on(i, elem) {
				var value = $(elem).attr("value"),
					text = $(elem).text();
			
				self.data[i] = { index: i, value: value, text: text };
				$(elem).addClass(className);
			}
			
			function off(i, elem) {
				self.data[i] = null;
				$(elem).removeClass(className);
			}
			
			function inArray(arr, val) {
				for(var i = 0; i < arr.length; i++) {
					if(arr[i] == val) return true;
				}
				
				return false;
			}
		}
	}

	/**
	 * @class ui.button
	 * @extends core
	 * @alias Button
	 * @requires jquery
	 * @requires util.base
	 */
	var UI = function() {
		var ui_list = {};

		this.init = function() {
            var self = this, opts = this.options;
			
			if(opts.type == "radio") {
				ui_list[opts.type] = new UIRadio(self, this.root, self.options);
				ui_list[opts.type].init();
			} else if(opts.type == "check") {
				UICheck.prototype = new UIRadio(self, this.root, self.options);
				
				ui_list[opts.type] = new UICheck();
				ui_list[opts.type].init();
			}
		}

		/**
		 * @method setIndex
         * Selects a button of a specified index
         *
		 * @param {Array} indexList Index for button check
		 */
		this.setIndex = function(indexList) {
            var btn = ui_list[this.options.type];

			btn.options.index = indexList;
            btn._setting("init", null, "index");

            this.emit("change", [ btn.data ]);
		}

		/**
		 * @method setValue
         * Selects a button with a specified value
         *
		 * @param {Array} valueList Values for button check
		 */
		this.setValue = function(valueList) {
            var btn = ui_list[this.options.type];

            btn.options.value = valueList;
            btn._setting("init", null, "value");

            this.emit("change", [ btn.data ]);
		}

		/**
		 * @method getData
         * Gets the data of the button currently selected
         *
		 * @return {Array}
		 */
		this.getData = function() {
			return ui_list[this.options.type].data;
		}

		/**
		 * @method getValue
         * Gets the value of the button currently selected
         *
		 * @return {Array} Values
		 * @return {Object} Value
		 */
		this.getValue = function() {
            var data = this.getData();

            if(_.typeCheck("array", data)) { // 타입이 체크일 경우
                var values = [];

                for(var i = 0; i < data.length; i++) {
                    values[i] = (data[i] != null) ? data[i].value : data[i];
                }

                return values;
            }

			return data.value;
		}

		/**
		 * @method reload
		 * Re-defines the button UI
		 */
		this.reload = function() {
			ui_list[this.options.type]._setting("init");
		}
	}

    UI.setup = function() {
        return {
			/**
			 * @cfg {String} [type="radio"]
             * Determines whether to use a radio/check button
			 */
			type: "radio",

			/**
			 * @cfg {Integer} [index=0]
			 * Determines an initial selection button with a specified index
			 */
			index: 0,

			/**
			 * @cfg {String} [index=""]
			 * Determines an initial selection button with a specified value
			 */
			value: ""
        }
    }

    /**
     * @event change
     * Event that occurs when clicking on a button
     *
     * @param {Object} data Data of the selected button
     * @param {jQueryEvent} e The event object
     */
	
	return UI;
});
jui.defineUI("ui.combo", [ "jquery", "util.base" ], function($, _) {

	var hideAll = function() {
		var call_list = jui.get("ui.combo");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i];
			
			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "open") ui_list[j].fold();
			}
		}
	}
	
	$(function() { 
		$("body").on("click", function(e) {
			hideAll();
		});
	});
	
	
	/**
	 * @class ui.combo
	 * @extends core
     * @alias Combo Box
	 * @requires jquery
	 * @requires util.base
	 */
	var UI = function() {
		var ui_list = null, ui_data = null;
		var index = -1;


		function load(type, data) {
			var $combo_root = ui_list["root"],
				$combo_text = ui_list["text"],
				$combo_drop = ui_list["drop"],
				$combo_list = $combo_drop.children("li");

			$combo_list.each(function(i) {
				var elem = getElement(this),
					value = $(elem).attr("value"),
					text = $(elem).text();
				
				if(!value) { 
					value = text;
					$(elem).attr("value", value);
				}
				
				if((type == "index" && data == i) || (type == "value" && data == value)) {
					ui_data = { index: i, value: value, text: text };
					
					$combo_root.attr("value", value);
					$combo_text.html(text);
					
					if ($combo_root.select && $combo_root.select[0] ) {
						$combo_root.select[0].selectedIndex = i;
					}
				}
			});
			
			if($combo_list.size() == 0) {
				ui_data = null;
			}
		}
		
		function getElement(target) { // 드롭다운 메뉴 타겟
			return ($(target).children("a").size() > 0) ? $(target).children("a")[0] : target;
		}
		
		function setEventKeydown(self) {
			if(!self.options.keydown) return;

            // 기본 상태 처리
            index = self.options.index;
            selectItem(self);
			
			self.addEvent(window, "keydown", function(e) {
				if(self.type == "fold") return;
				var $list = ui_list["drop"].children("li");
				
				if(e.which == 38) { // up
					if(index < 1) index = $list.size() - 1;
					else index--;
					
					selectItem(self, function() {
						index--;
						selectItem(self);
					});
					
					return false;
				}
				
				if(e.which == 40) { // down
					if(index < $list.size() - 1) index++;
					else index = 0;
					
					selectItem(self, function() {
						index++;
						selectItem(self);
					});
					
					return false;
				}
				
				if(e.which == 13) { // enter
					$list.eq(index).trigger("click");
				}
			});
		}
		
		function selectItem(self, callback) {
			var $list = ui_list["drop"].children("li"),
				$target = $list.eq(index);
			
			$list.removeClass("active");

			if($target.val() != "" || $target.html() != "") {
				$target.addClass("active");
				
				if(self.options.height > 0) {
					ui_list["drop"].scrollTop(index * $target.outerHeight());
				}
			} else {
				if(typeof(callback) == "function") {
					callback();
				}
			}
		}
		
		function makeSelectTouch(self) {
			if(!_.isTouch) return;
			
			var $combo_root = ui_list["root"];
			
			if ($combo_root.select && $combo_root.select[0]) {
				var $select = $combo_root.select;
				$select.empty();
			} else {
				var $select = $("<select></select>").css({
					position: "absolute",
					opacity : 0.01
				});
				
				$combo_root.find("ul").after($select);					
				
				self.addEvent($select, "change", function(e) {
					var elem = $(e.currentTarget).find("option:selected").data("elem");
					self.addTrigger(elem, "touchstart");
				});
				
				$combo_root.select = $select;
			}

			$combo_root.find("ul > li").each(function(i, elem) {
				var value = $(elem).data('value');
				var text = $(elem).text();
				
				$select.append($("<option></option>").val(value).text(text).data("elem", elem));
			});
		}

		this.init = function() {
			var self = this, opts = this.options;
			
			var $combo_root 	= $(this.root),
				$combo_text 	= $combo_root.children(".btn").not(".btn-toggle"),
				$combo_toggle 	= $combo_root.children(".btn-toggle"),
				$combo_click	= $combo_root.children(".btn"),
				$combo_drop 	= $combo_root.children("ul");
			
			//-- 드롭다운은 중앙으로 위치 (그룹 스타일 좌/우 라운드 효과)
			$combo_drop.insertAfter($combo_text);
			
			// Width
			if(opts.width > 0) {
				$combo_text.outerWidth(opts.width - $combo_toggle.outerWidth() + 1);
				$combo_text.css({
					"overflow": "hidden",
					"white-space": "nowrap"
				});
			}
			
			// Height
			if(opts.height > 0) {
				$combo_drop.css({ "maxHeight": opts.height, "overflow": "auto" });
			}

			// Show
			this.addEvent($combo_click, "click", function(e) {
				if (_.isTouch) {
					$combo_root.select.focus();
				} else {
					if(self.type == "open") return;
					
					hideAll();
					self.open(e);					
				}
				
				return false;
			});
			
			// Select
			this.addEvent($combo_drop, "click", "li:not(.divider)", function(e) {
				hideAll();

                var elem = getElement(this),
                    value = $(elem).attr("value"),
                    text = $(elem).text();
					
				ui_data = { value: value, text: text, element: elem };
				$combo_text.html(text);
				$combo_root.attr("value", value);

                self.emit("click", [ ui_data, e ]);
				self.emit("change", [ ui_data, e ]);

				e.preventDefault();
			});
			
			// Init
			ui_list = { root: $combo_root, text: $combo_text, drop: $combo_drop, toggle: $combo_toggle };

			this.type = "fold"; // 기본 타입 설정
			this.reload();
			
			//  Key up/down event
			setEventKeydown(this);
		}

		/**
		 * @method setIndex
		 * Selects a button of a specified index
         *
		 * @param {Number} index
		 */
		this.setIndex = function(index) {
			load("index", index);
			this.emit("change", [ ui_data ]);
		}

        /**
         * @method setValue
         * Selects a button having a specified value
         *
         * @param {Mixed} value
         */
		this.setValue = function(value) {
			load("value", value);
			this.emit("change", [ ui_data ]);
		}

        /**
         * @method getData
         * Gets the data of the button currently selected
         *
         * @return {Object}
         */
		this.getData = function() {
			return ui_data;
		}

        /**
         * @method getValue
         * Gets the value of the button currently selected
         *
         * @return {Mixed}
         */
		this.getValue = function() {
			return (ui_data != null) ? ui_data["value"] : null;
		}

        /**
         * @method getText
         * Gets the markup text of the button currently selected
         *
         * @return {String}
         */
		this.getText = function() {
			return (ui_data != null) ? ui_data["text"] : null;
		}

        /**
         * @method open
         * Shows the element list of a combo box
         */
		this.open = function(e) {
			ui_list["toggle"].addClass("active");
			ui_list["drop"].outerWidth(ui_list["root"].outerWidth() - 1);

			if(this.options.position == "top") {
				var h = ui_list["drop"].outerHeight();
				
				ui_list["drop"].animate({
				    top: "-" + h,
				    height: "toggle"
				}, 100);
			} else {
				ui_list["drop"].slideDown(100);
			}

			this.emit("open", e);
			this.type = "open";
		}

        /**
         * @method fold
         * Hides the element list of a combo box
         */
		this.fold = function() {
			ui_list["drop"].hide();
			ui_list["toggle"].removeClass("active");
			
			if(this.options.position == "top") {
				ui_list["drop"].css("top", 0);
			}
			
			this.emit("fold");
			this.type = "fold";
		}

        /**
         * @method reload
         * Re-defines a combo box
         */
		this.reload = function() {
			if(this.options.value != "") {
				load("value", this.options.value);
			} else {
				load("index", this.options.index);
			}
			
			makeSelectTouch(this);
			
			this.emit("reload", ui_data);
		}
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {Integer} [index=0]
             * Determines an initial selection button with a specified index
             */
			index: 0,

            /**
             * @cfg {String} [value=0]
             * Determines an initial selection button with a specified value
             */
			value: "",

            /**
             * @cfg {Integer} [width=0]
             * Determines the horizontal size of a combo box
             */
			width: 0,

            /**
             * @cfg {Integer} [height=100]
             * Determines an initial selection button with a specified value
             */
			height: 100,

            /**
             * @cfg {Boolean} [keydown=false]
             * It is possible to select a node using the keyboard
             */
			keydown: false,

            /**
             * @cfg {"top"/"bottom"} [position="bottom"]
             * It is possible to determine an initial selection button with a specified value
             */
			position: "bottom"
        }
    }

    /**
     * @event change
     * Event which occurs when selecting a combo box
     *
     * @param {Object} data changed data
     * @param {EventObject} e The event object
     */
	
	return UI;
});
jui.defineUI("ui.datepicker", [ "jquery", "util.base" ], function($, _) {

    function getStartDate(date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        return date;
    }

    /**
     * @class ui.datepicker
     * @extends core
     * @alias Date Picker
     * @requires jquery
     * @requires util.base
     */
    var UI = function() {
    	var year = null, month = null, date = null,
            selDate = null, items = {}; // 헌재 페이지의 요소 엘리먼트 캐싱
        var $head = null, $body = null;


        function setCalendarEvent(self) {
            self.addEvent($head.children(".prev"), "click", function(e) {
                self.prev(e);
            });

            self.addEvent($head.children(".next"), "click", function(e) {
                self.next(e);
            });
        }
        
        function setCalendarDate(self, no) {
        	var opts = self.options;

            if(opts.type == "daily") {
            	var m = (month < 10) ? "0" + month : month,
            		d = (no < 10) ? "0" + no : no;
                selDate = new Date(year + "/" + m + "/" + d);
            } else if(opts.type == "monthly") {
            	var m = (no < 10) ? "0" + no : no;
                selDate = new Date(year + "/" + m + "/01");
            } else if(opts.type == "yearly") {
                selDate = new Date(no + "/01/01");
            }

            // 0시 0분 0초 0밀리 초로 설정
            selDate = getStartDate(selDate);
        }

        function getCalendarDate(self) {
        	var opts = self.options,
        		tmpDate = null;
        	
        	if(opts.type == "daily") {
        		var m = (month < 10) ? "0" + month : month;
        		tmpDate = new Date(year + "/" + m + "/01");
        	} else if(opts.type == "monthly") {
        		tmpDate = new Date(year + "/01/01");
        	} else if(opts.type == "yearly") {
        		tmpDate = new Date();
        	}

        	return getStartDate(tmpDate);
        }

        function getCalendarHtml(self, obj) {
            var opts = self.options;
            var resHtml = "",
            	tmpItems = [];
            
            // 활성화 날짜 캐시 초기화
            items = {};

            for(var i = 0; i < obj.objs.length; i++) {
                tmpItems.push(obj.nums[i]);

                if(isNextBr(i)) {
                    resHtml += self.tpl["dates"]({ dates: tmpItems });
                    tmpItems = [];
                }
            }

            var $list = $(resHtml);
            $list.find("td").each(function(i) {
                $(this).addClass(obj.objs[i].type);

                self.addEvent(this, "click", function(e) {
                    if(obj.objs[i].type == "none") return;

                    $body.find("td").removeClass("active");
                    $(this).addClass("active");
                    
                    setCalendarDate(self, obj.objs[i].no);
                    self.emit("select", [ self.getFormat(), e ]);
                });
                
                if(obj.objs[i].type != "none") {
                	items[obj.objs[i].no] = this;
                }
            });

            function isNextBr(i) {
                return (opts.type == "daily") ? ((i + 1) % 7 == 0) : ((i + 1) % 3 == 0);
            }

            return $list;
        }

        function getLastDate(year, month) {
            if(month == 2) {
                if(year % 100 != 0 && (year % 4 == 0 || year % 400 == 0))
                    return 29;
                else
                    return 28;
            } else {
                var months = [ 31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
                return months[month - 1];
            }
        }

        function getDateList(y, m) {
            var objs = [],
                nums = [],
                no = 1;

            var d = new Date(),
                start = new Date(y + "-" + ((m < 10) ? "0" + m : m)).getDay(),
                ldate = getLastDate(y, m);

            var prevYear = (m == 1) ? y - 1 : y,
                prevMonth = (m == 1) ? 12 : m - 1,
                prevLastDay = getLastDate(prevYear, prevMonth);

            for(var i = 0; i < start; i++) {
                nums[i] = (prevLastDay - start) + (i + 1);
                objs[i] = { type: "none", no: nums[i] };
            }

            for(var i = start; i < 42; i++) {
                if(no <= ldate) {
                    var type = "";

                    if(d.getMonth() + 1 == m && d.getDate() == no) {
                        type = "now";
                    }

                    if(selDate != null) {
                        if(selDate.getFullYear() == y && selDate.getMonth() + 1 == m && selDate.getDate() == no) {
                            type = "active";
                        }
                    }

                    nums[i] = no;
                    objs[i] = { type: type, no: nums[i] };
                    no++;
                } else {
                    nums[i] = no - ldate;
                    objs[i] = { type: "none", no: nums[i] };
                    no++;
                }
            }

            return { objs: objs, nums: nums };
        }

        function getMonthList(y) {
            var objs = [],
                nums = [];

            var d = new Date();

            for(var i = 1; i <= 12; i++) {
                var type = "";

                if(d.getFullYear() == y && d.getMonth() + 1 == i) {
                    type = "now";
                }

                if(selDate != null) {
                    if(selDate.getFullYear() == y && selDate.getMonth() + 1 == i) {
                        type = "active";
                    }
                }

                nums.push(i);
                objs.push({ type: type, no: i });
            }

            return { objs: objs, nums: nums };
        }

        function getYearList(y) {
            var objs = [],
                nums = [],
                startYear = y - 4;

            var d = new Date();

            for(var i = startYear; i < startYear + 12; i++) {
                var type = "";

                if(d.getFullYear() == i) {
                    type = "now";
                }

                if(selDate != null) {
                    if(selDate.getFullYear() == i) {
                        type = "active";
                    }
                }

                nums.push(i);
                objs.push({ type: type, no: i });
            }

            return { objs: objs, nums: nums };
        }

        this.init = function() {
            $head = $(this.root).children(".head");
            $body = $(this.root).children(".body");

            // 이벤트 정의
            setCalendarEvent(this);

            // 기본 날짜 설정
            this.select(this.options.date);
        }

        /**
         * @method page
         * Outputs a calendar that fits the year/month entered
         *
         * @param {Integer} year
         * @param {Integer} month
         */
        this.page = function(y, m) {
            if(arguments.length == 0) return;
            var opts = this.options;

            if(opts.type == "daily") {
                year = y;
                month = m;
                
                $body.find("tr:not(:first-child)").remove();
                $body.append(getCalendarHtml(this, getDateList(year, month)));
            } else if(opts.type == "monthly") {
                year = y;
                
                $body.find("tr").remove();
                $body.append(getCalendarHtml(this, getMonthList(year)));
            } else if(opts.type == "yearly") {
                year = y;

                $body.find("tr").remove();
                $body.append(getCalendarHtml(this, getYearList(year)));
            }
            
            $head.children(".title").html(_.dateFormat(getCalendarDate(this), opts.titleFormat));
        }

        /**
         * @method prev
         * Outputs a calendar that fits the previous year/month
         *
         */
        this.prev = function(e) {
            var opts = this.options;

            if(opts.type == "daily") {
                var y = (month == 1) ? year - 1 : year,
                    m = (month == 1) ? 12 : month - 1;
                
                this.page(y, m);
            } else if(opts.type == "monthly") {
                this.page(year - 1);
            } else if(opts.type == "yearly") {
                this.page(year - 12);
            }
            
            this.emit("prev", [ e ]);
        }

        /**
         * @method next
         * Outputs a calendar that fits the next year/month
         *
         */
        this.next = function(e) {
            var opts = this.options;

            if(opts.type == "daily") {
                var y = (month == 12) ? year + 1 : year,
                    m = (month == 12) ? 1 : month + 1;

                this.page(y, m);
            } else if(opts.type == "monthly") {
                this.page(year + 1);
            } else if(opts.type == "yearly") {
                this.page(year + 12);
            }

            this.emit("next", [ e ]);
        }

        /**
         * @method select
         * Selects today if there is no value, or selects a date applicable to a timestamp or year/month/date
         *
         * @param {"year"/"month"/"date"/"timestamp"/"Date"}
         */
        this.select = function() {
        	var opts = this.options,
        		args = arguments;

        	if(args.length == 0) {
        		y = year;
        		m = month;
        		d = date;
        	} else if(args.length == 3) {
        		y = args[0];
        		m = args[1];
        		d = args[2];
        	} else if(args.length == 1) {
        		var time = (_.typeCheck("date", args[0])) ? args[0] : new Date(args[0]);

        		y = time.getFullYear();
        		m = time.getMonth() + 1;
        		d = time.getDate();
        	}

            if(opts.type == "daily") {
            	this.page(y, m);
            	this.addTrigger(items[d], "click");
            } else if(opts.type == "monthly") {
            	this.page(y);
            	this.addTrigger(items[m], "click");
            } else if(opts.type == "yearly") {
                this.page(y);
                this.addTrigger(items[y], "click");
            }
        }

        /**
         * @method addTime
         * Selects a date corresponding to the time added to the currently selected date
         *
         * @param {"Integer"/"Date"} time Timestamp or Date
         */
        this.addTime = function(time) {
        	selDate = new Date(this.getTime() + time);
        	this.select(this.getTime());
        }

        /**
         * @method getDate
         * Gets the value of the date currently selected
         *
         * @return {Date} Date object
         */
        this.getDate = function() {
            return selDate;
        }

        /**
         * @method getTime
         * Gets the timestamp value of the date currently selected
         *
         * @return {Integer} Timestamp
         */
        this.getTime = function() {
            return selDate.getTime();
        }

        /**
         * @method getFormat
         * Gets a date string that fits the format entered
         *
         * @return {String} format Formatted date string
         */
        this.getFormat = function(format) {
            return _.dateFormat(selDate, (typeof(format) == "string") ? format : this.options.format);
        }
    }

    UI.setup = function() {
        var now = getStartDate(new Date());

        return {
            /**
             * @cfg {"daily"/"monthly"/"yearly"} [type="daily"]
             * Determines the type of a calendar
             */
            type: "daily",

            /**
             * @cfg {String} [titleFormat="yyyy.MM"]
             * Title format of a calendar
             */
            titleFormat: "yyyy.MM",

            /**
             * @cfg {String} [format="yyyy-MM-dd"]
             * Format of the date handed over when selecting a specific date
             */
            format: "yyyy-MM-dd",

            /**
             * @cfg {Date} [date="now"]
             * Selects a specific date as a basic
             */
            date: now,

            /**
             * @cfg {Boolean} [animate=false]
             * @deprecated
             */
            animate: false
        };
    }

    /**
     * @event select
     * Event that occurs when selecting a specific date
     *
     * @param {String} value Formatted date string
     * @param {EventObject} e The event object
     */

    /**
     * @event prev
     * Event that occurs when clicking on the previous button
     *
     * @param {EventObject} e The event object
     */

    /**
     * @event next
     * Event that occurs when clicking on the next button
     *
     * @param {EventObject} e The event object
     */

    return UI;
});
jui.defineUI("ui.dropdown", [ "jquery" ], function($) {

	var hideAll = function() {
		var dd = getDropdown();
		
		if(dd != null) {
			dd.hide();
		}
	}
	
	var getDropdown = function() {
		var call_list = jui.get("ui.dropdown");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i];
			
			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "show") return ui_list[j];
			}
		}
		
		return null;
	}
	
	$(function() { 
		$("body").on("click", function(e) {
			var tn = e.target.tagName;
			
			if(tn != "LI" && tn != "INPUT" && tn != "A" && tn != "BUTTON" && tn != "I") {
				hideAll();
			}
		});
		
		$(window).on("keydown", function(e) {
			var dd = getDropdown();
			
			if(dd != null) {
				dd.wheel(e.which, function() {
					e.preventDefault();
				});
			}
		});
	});


    /**
     * @class ui.dropdown
     * Dropdown is a UI component that is frequently used in multiple UI components such as combo box, navigation, table, ect
     *
     * @extends core
     * @alias Dropdown
     * @requires jquery
     *
     */
	var UI = function() {
		var ui_list = null, index = -1;
		
		function setEventNodes(self) {
			var $list = $(ui_list.menu).find("li");
			
			// 이벤트 걸린거 초기화
			$list.off("click").off("hover");
			
			// 클릭 이벤트 설정
			self.addEvent($list, "click", function(e) {
				if($(this).hasClass("divider")) return;
				
				var index = getTargetIndex(this),
					text = $(this).text(),
					value = $(this).attr("value");
				
				self.emit("change", [ { index: index, value: value, text: text }, e ]);
				
				// close가 true일 경우, 전체 드롭다운 숨기기
				if(self.options.close) hideAll();
				
				// A 태그일 경우에는 이벤트 막기
				if(e.target.tagName == "A") {
					e.preventDefault();
				}
			});
			
			// 마우스 오버시 hover 클래스 제거
			self.addEvent($list, "hover", function(e) {
				$list.removeClass("active");
			});
			
			function getTargetIndex(elem) {
				var result = 0;
				
				$list.each(function(i) {
					if(elem == this) {
						result = i;
					}
				});
				
				return result;
			}
		}

		function selectItem(self, callback) {
			var $list = ui_list.menu.find("li"),
				$target = $list.eq(index);
			
			$list.removeClass("active");
			
			if($target.val() != "" || $target.html() != "") {
				$target.addClass("active");
				
				if(self.options.height > 0) {
					ui_list.menu.scrollTop(index * $target.outerHeight());
				}
			} else {
				if(typeof(callback) == "function") {
					callback();
				}
			}
		}
		
		this.init = function() {
			var opts = this.options;
			
			var $dd_root = $(this.root),
				$dd_menu = $dd_root.find("ul"),
				$dd_anchor = $dd_root.find(".anchor");
			
			// 메인 설정, 없을 경우에는 root가 메인이 됨
			$dd_menu = ($dd_menu.size() == 0) ? $dd_root : $dd_menu;
			
			// UI 객체 추가
			ui_list = { root: $dd_root, menu: $dd_menu, anchor: $dd_anchor };

			// Size
			ui_list.root.outerWidth(ui_list.menu.outerWidth());
			
			// Width
			if(opts.width > 0) {
				$dd_menu.outerWidth(opts.width);
			}
			
			// Height
			if(opts.height > 0) {
				$dd_menu.css({ "maxHeight": opts.height, "overflow": "auto" });
			}
			
			// Left
			if(opts.left > 0) {
				$dd_root.css("left", opts.left);
			}

			// Top
			if(opts.top > 0) {
				$dd_root.css("top", opts.top);
			}
			
			// Default Styles
			$dd_menu.css({ "display": "block" });
			$dd_root.css({ "position": "absolute", "display": "none" });
			
			// 드롭다운 목록 갱신
			if(opts.nodes.length > 0) {
				this.update(opts.nodes);
			} else {
				setEventNodes(this);
			}

			this.type = "hide"; // 기본 타입 설정
		}

        /**
         * @method update
         * Changes the dropdown list
         *
         * @param {Array} nodes Dropdown list
         */
		this.update = function(nodes) {
			if(!this.tpl.node) return;
			
			$(ui_list.menu).empty();
			
			for(var i = 0; i < nodes.length; i++) {
				$(ui_list.menu).append(this.tpl.node(nodes[i]));
			}
			
			setEventNodes(this);
		}

        /**
         * @method hide
         * Hides the dropdown
         */
		this.hide = function() {
			ui_list.root.hide();
			
			this.emit("hide");
			this.type = "hide";
		}

        /**
         * @method show
         * Shows a dropdown at the specified coordinates
         *
         * @param {Integer} x
         * @param {Integer} y
         */
		this.show = function(x, y) {
			hideAll();
			
			ui_list.root.show();
			
			// Anchor 옵션 처리
			if(ui_list.anchor.size() > 0) 
				ui_list.root.css("margin-top", "10px");
			
			// x, y 값이 있을 경우
			if(arguments.length == 2) {
				this.move(x, y);
			}
			
			this.emit("show");
			this.type = "show";
		}

        /**
         * @method move
         * Moves a dropdown to the specified coordinates
         *
         * @param {Integer} x
         * @param {Integer} y
         */
		this.move = function(x, y) {
			ui_list.root.css("left", x);
			ui_list.root.css("top", y);
		}

        /**
         * @method wheel
         * Changes a selected node upwards when the key is set to -1, or downwards when the key is set to 1. If the key is set to 0, the speciified node is selected
         *
         * @param {Integer} key
         * @param {Function} callback
         */
		this.wheel = function(key, callback) {
			if(!this.options.keydown) return;
			
			var self = this,
				$list = ui_list.menu.find("li");
			
			if(key == 38 || key == -1) { // up
				if(index < 1) index = $list.size() - 1;
				else index--;
				
				selectItem(this, function() {
					index--;
					selectItem(self);
				});
				
				if(callback) callback();
			}
			
			if(key == 40 || key == 1) { // down
				if(index < $list.size() - 1) index++;
				else index = 0;
				
				selectItem(self, function() {
					index++;
					selectItem(self);
				});
				
				if(callback) callback();
			}
			
			if(key == 13 || key == 0 || !key) { // enter
				self.addTrigger($list.eq(index), "click");
				index = -1;
				
				if(callback) callback();
			}
		}

        /**
         * @method reload
         * Reloads the dropdown list
         */
		this.reload = function() {
			this.init();
			this.emit("reload");
		}
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {Boolean} [close=true]
             * Closes the Auto when clicking on the dropdown list
             */
			close: true,

            /**
             * @cfg {Boolean} [keydown=false]
             * It is possible to choose anything on the dropdown list with the arrow keys on the keyboard
             */
			keydown: false,

            /**
             * @cfg {Integer} [left=0]
             * Sets the X coordinate of the dropdown list
             */
			left: 0,

            /**
             * @cfg {Integer} [top=0]
             * Sets the Y coordinate of the dropdown list
             */
			top: 0,

            /**
             * @cfg {Integer} [width=0]
             * Determines the horizontal size of a dropdown list
             */
			width: 0,

            /**
             * @cfg {Integer} [height=0]
             * Determines the vertical size of a dropdown list
             */
			height: 0,

            /**
             * @cfg {Array} nodes
             * Sets a dropdown list to data rather than markup
             */
			nodes: []
        }
    }

    /**
     * @event change
     * Event that occurs when anything on the dropdown list is selected
     *
     * @param {Object} data
     * @param {EventObject} e The event object
     */

    /**
     * @event show
     * Event that occurs when a dropdown is shown
     */

    /**
     * @event hide
     * Event that occurs when a dropdown is hidden
     */

    /**
     * @event reload
     * Event that occurs when a dropdown is reloaded
     */
	
	return UI;
});
jui.defineUI("ui.modal", [ "jquery", "util.base" ], function($, _) {

	var win_width = 0;
	
	_.resize(function() {
		if(win_width == $(window).width()) return; 
		
		var call_list = jui.get("ui.modal");
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i];
			
			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "show") {
					ui_list[j].resize();
				}
			}
		}
		
		win_width = $(window).width();
	}, 300);

    /**
     * @class ui.modal
     * Developed as a separate component so that the modal, which is used in UI components such as window or loading, can be used more universally
     *
     * @extends core
     * @alias Modal
     * @requires jquery
     * @requires util.base
     *
     */
	var UI = function() {
		var $modal = null, $clone = null;
		var uiObj = null, uiTarget = null;
		var x = 0, y = 0, z_index = 5000;
		
		function setPrevStatus(self) {
			uiObj = { 
				"position": $(self.root).css("position"),
				"left": $(self.root).css("left"),
				"top": $(self.root).css("top"),
				"z-index": $(self.root).css("z-index"),
				"display": $(self.root).css("display")
			};
			
			uiTarget = {
				"position": $(self.options.target).css("position")
			};
		}
		
		function getModalInfo(self) {
			var target = self.options.target,
				hTarget = (target == "body") ? window : target,
				pos = (target == "body") ? "fixed" : "absolute",
				tPos = (target == "body") ? null : "relative",
                sLeft = $(target).scrollLeft();
			
			var x = (($(hTarget).width() / 2) - ($(self.root).width() / 2)) + $(target).scrollLeft(),
				y = ($(hTarget).height() / 2) - ($(self.root).height() / 2);

			var w = (sLeft > 0) ? $(target).outerWidth() + sLeft : "100%",
				h = $(target).outerHeight();

			// inner modal일 경우
			if(tPos != null) {
				var sh = $(hTarget)[0].scrollHeight;
				
				h = (sh > h) ? sh : h;
				y = y + $(hTarget).scrollTop();

			// global modal일 경우
			} else {
				var sh = $(window).outerHeight();

				h = (h > sh) ? h : sh;
			}
			
			return {
				x: x, y: y, pos: pos, tPos: tPos, w: w, h: h
			}
		}
		
		function createModal(self, w, h) {
			if($modal != null) return;
			
			$modal = $("<div id='MODAL_" + self.timestamp + "'></div>").css({ 
				position: "absolute",
				width: w,
				height: h,
				left: 0,
				top: 0,
				opacity: self.options.opacity, 
				"background-color": self.options.color,
				"z-index": (z_index + self.options.index) - 1
			});
		
			// 모달 추가
			$(self.options.target).append($modal);
			
			// 루트 모달 옆으로 이동
			if(self.options.target != "body") {
				$(self.root).insertAfter($modal);
			}
			
			// 모달 닫기 이벤트 걸기
			self.addEvent($modal, "click", function(e) {
				if(self.options.autoHide) {
					self.hide();
				}
				
				return false;
			});
		}

		this.init = function() {
			setPrevStatus(this); // 이전 상태 저장

			// 대상의 기본 상태는 숨기기
			if(!this.options.clone) {
				$(this.root).hide();
			}

			// 타입 프로퍼티 설정
			this.type = "hide";
		}

        /**
         * @method hide
         * Hides a modal
         */
		this.hide = function() {
			var opts = this.options;

			// 모달 대상 객체가 숨겨진 상태가 아닐 경우..
			if(opts.clone) {
				$clone.remove();
				$clone = null;
			}
			
			$(opts.target).css("position", uiTarget.position);
			$(this.root).css(uiObj);
			
			if($modal) {
				$modal.remove();
				$modal = null;
			}
			
			this.type = "hide";
		}

        /**
         * @method show
         * Shows a modal
         */
		this.show = function() {
			var opts = this.options,
				info = getModalInfo(this);

			// 모달 대상 객체가 숨겨진 상태가 아닐 경우..
			if(opts.clone) {
				$clone = $(this.root).clone();
				$clone.insertAfter($(this.root));
			}

            // 위치 재조정
            this.resize();

			$(opts.target).css("position", info.tPos);
			$(this.root).show();

			createModal(this, info.w, info.h);
			this.type = "show";
		}

        /**
         * @method resize
         * Re-adjust the location of a modal
         */
        this.resize = function() {
            var info = getModalInfo(this);

            $(this.root).css({
                "position": info.pos,
                "left": info.x,
                "top": info.y,
                "z-index": (z_index + this.options.index)
            });

            if($modal != null) {
                $modal.height(info.h);
            }
        }
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {"black"/"gray"} [color="black"]
             * Determines the color of a modal
             */
			color: "black",

            /**
             * @cfg {Float} [opacity=0.4]
             * Sets the transparency of a modal
             */
			opacity: 0.4,

            /**
             * @cfg {String/DOMElement} [target="body"]
             * Sets a selector on which a modal is shown
             */
			target: "body",

            /**
             * @cfg {Integer} [index=0]
             * Determines the sequence (index) of a modal
             */
			index: 0,

            /**
             * @cfg {Boolean} [clone=false]
             * Copies an existing modal and shows it
             */
			clone: false,

            /**
             * @cfg {Boolean} [autoHide=true]
             * Automatically hides a modal when clicking on it
             */
			autoHide: true
        }
    }
	
	return UI;
});
jui.defineUI("ui.notify", [ "jquery" ], function($) {
    var DEF_PADDING = 12;

    /**
     * @class ui.notify
     * Notify component that provides an alarm function for when a serious problem or event occurs
     *
     * @extends core
     * @alias Notify
     * @requires jquery
     *
     */
    var UI = function() {
    	var $container = null,
            paddingPos = null;

        this.init = function() {
            var opts = this.options;
            
            var padding = (typeof(opts.padding) == "object") ? DEF_PADDING : opts.padding;
        	var paddingObj = {
                "top":    		{ top: padding, bottom: null, left: padding, right: padding },
                "top-right":    { top: padding, bottom: null, left: null, right: padding },
                "top-left":     { top: padding, bottom: null, left: padding, right: null },
                "bottom":  		{ top: null, bottom: padding, left: padding, right: padding },
                "bottom-right": { top: null, bottom: padding, left: null, right: padding },
                "bottom-left":  { top: null, bottom: padding, left: padding, right: padding }
            };

            paddingPos = paddingObj[opts.position];
            
            // 패딩 값이 수치가 아니라 객체일 경우
            if(typeof(opts.padding) == "object") {
            	paddingPos = $.extend(paddingPos, opts.padding);
            }

            // 알림 메시지 대상 스타일 설정
            if(this.selector != "body") {
            	$(this.selector).css("position", "relative");
            }
            
            // 기본 스타일 설정
            $container = $("<div></div>").css($.extend({
                position: "absolute",
                "z-index": 3000
            }, paddingPos));
            
            $(this.root).append($container);

            return this;
        }

        /**
         * @method add
         * Adds a notice message. The value passed is the data object shown by the notice template
         *
         * @param {Object} data
         * @param {Integer} timeout
         */
        this.add = function(data, timeout) {
            var self = this, 
            	opts = this.options,
            	delay = (!isNaN(timeout)) ? timeout : opts.timeout,
                scrollTop = $(this.root).scrollTop();

            var $alarm = $(this.tpl.item(data)).css({ "margin-bottom": opts.distance });

            // 포지션 예외 처리
            if(opts.position == "top" || opts.position == "bottom") {
            	$alarm.outerWidth(
        			$container.width() - ((typeof(opts.padding) == "object" && opts.padding.right) ? opts.padding.right : DEF_PADDING) * 3
    			);
            }

            // 추가
            if(isTop()) {
                $container.css("top", scrollTop + paddingPos.top);
            	$container.prepend($alarm);
            } else {
                $container.css("bottom", -(scrollTop - paddingPos.bottom));
            	$container.append($alarm);
            }

            // 보이기 효과
            var alpha = $alarm.css("opacity");
            $alarm
                .css({ opacity:  0 })
                .animate({ opacity: alpha }, opts.showDuration, opts.showEasing, function() {
                	self.emit("show", [ data ]);
                });

            // 선택 이벤트
            this.addEvent($alarm, "click", function(e) {
            	self.emit("select", [ data, e ]);
            	remove();
            	
            	return false;
            });
            
            // 숨기기 효과
            if(delay > 0) {
                setTimeout(remove, delay);
            }
            
            function remove() {
            	if($alarm == null) return;
            	
                $alarm.animate({ opacity: 0 }, opts.hideDuration, opts.hideEasing);
                $alarm.slideUp(opts.hideEasing, function() {
                	self.emit("hide", [ data ]);
                	$alarm.remove();
                    $alarm = null;
                });
            }

            function isTop() {
                return (opts.position.indexOf("top-") != -1) ? true : false;
            }
        }

        /**
         * @method reset
         * Removes all notice messages that are enabled
         */
        this.reset = function() {
        	$container.empty();
        }
    }

    UI.setup = function() {
        return {
            /**
             * @cfg {"top"/"top-lefet"/"top-right"/"bottom"/"bottom-left"/"bottom-right"} [position="top-right"]
             * Designates the location where a notice message is added
             */
            position: "top-right",

            /**
             * @cfg {Integer} [padding=12]
             * Determines the margin value of a notice message (the margin value may be in object form rather than a numeric value)
             */
            padding: DEF_PADDING,

            /**
             * @cfg {Integer} [distance=5]
             * Determines each margin value when there are multiple notice messages
             */
            distance: 5,

            /**
             * @cfg {Integer} [timeout=3000]
             * Determines the duration for which a notice message is displayed (the message does not disappear when the value is 0)
             */
            timeout: 3000,

            /**
             * @cfg {Integer} [showDuration=500]
             * Determines the duration of an effect when a notice message is shown
             */
            showDuration: 500,

            /**
             * @cfg {Integer} [hideDuration=500]
             * Determines the duration of an effect when a notice message disappears
             */
            hideDuration: 500,

            /**
             * @cfg {String} [showEasing="swing"]
             * Determines an effect when a notice message is shown (see CSS3 specifications)
             */
            showEasing: "swing",

            /**
             * @cfg {String} [hideEasing="linear"]
             * Determines an effect when a notice message disappears (see CSS3 specifications)
             */
            hideEasing: "linear"
        };

        /**
         * @event select
         * Event that occurs when a notice message is clicked
         *
         * @param {Object} data
         * @param {EventObject} e The event object
         */

        /**
         * @event show
         * Event that occurs when a notice message is shown
         *
         * @param {Object} data
         */

        /**
         * @event hide
         * Event that occurs when a notice message is hidden
         *
         * @param {Object} data
         */
    }

    return UI;
});
jui.defineUI("ui.paging", [ "jquery" ], function($) {

    /**
     * @class ui.paging
     * Paging component that can be applied to a screen with tables or various other data
     *
     * @extends core
     * @alias Paging
     * @requires jquery
     */
	var UI = function() {
		var activePage = 1, lastPage = 1;
		var $main = null;

		function setEventAction(self) {
			self.addEvent($(self.root).find(".prev"), "click", function(e) {
				self.prev();
				return false;
			});
			
			self.addEvent($(self.root).find(".next"), "click", function(e) {
				self.next();
				return false;
			});
		}
		
		function setEventPage(self) {
			self.addEvent($main.find(".page"), "click", function(e) {
				var page = parseInt($(e.currentTarget).text());
				self.page(page);
				
				return false;
			});
		}
		
		function setPageStyle(self, page) {
			var $list = $main.find(".page");
			
			$list.each(function(i) {
				if($(this).text() == page) {
					$(this).addClass("active");
				} else {
					$(this).removeClass("active");
				}
			});
		}
		
		function changePage(self, pNo) {
			var pages = [], 
				end = (lastPage < self.options.screenCount) ? lastPage : self.options.screenCount,
				start = pNo - Math.ceil(end / 2) + 1,
				start = (start < 1) ? 1 : start;
			
			activePage = (pNo > lastPage) ? lastPage : pNo;
			activePage = (pNo < 1) ? 1 : pNo;
			
			if(lastPage < start + end + 1) {
				for(var i = lastPage - end + 1; i < lastPage + 1; i++) {
					pages.push(i);
				}
				
				if(activePage > lastPage) activePage = lastPage;
			} else {
				for(var i = start; i < start + end; i++) {
					pages.push(i);
				}
			}
			
			// 템플릿 적용
			$main.html(self.tpl["pages"]({ pages: pages, lastPage: lastPage }));
			
			setEventAction(self);
			setEventPage(self);
			setPageStyle(self, activePage);
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 페이징 메인 설정, 없을 경우에는 root가 메인이 됨
			$main = $(self.root).find(".list");
			$main = ($main.size() == 0) ? $(self.root) : $main;
			
			// 페이지 리로드
			this.reload();
			
			return this;
		}

        /**
         * @method reload
         * Reloads the number of specified data records, or reloads the initially configured number of data records if there is no parameter
         *
         * @param {Integer} count Data total count
         */
		this.reload = function(count) {
			var count = (!count) ? this.options.count : count;
			
			activePage = 1;
			lastPage = Math.ceil(count / this.options.pageCount);
			
			changePage(this, activePage);
			this.emit("reload");
		}

        /**
         * @method page
         * Changes to a specified page number, and gets the currently enabled page number if there is no parameter
         *
         * @param {Integer} pNo Page number
         */
		this.page = function(pNo) {
			if(!pNo) return activePage;
			
			changePage(this, pNo);
			this.emit("page", [ activePage ]);
		}

        /**
         * @method next
         * Changes to the next page
         */
		this.next = function() {
			this.page(activePage + 1);
		}

        /**
         * @method prev
         * Changes to the previous page
         */
		this.prev = function() {
			this.page(activePage - 1);
		}

        /**
         * @method first
         * Changes to the first page
         */
		this.first = function() {
			this.page(1);
		}

        /**
         * @method last
         * Changes to the last page
         */
		this.last = function() {
			this.page(lastPage);
		}
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {Integer} [count=0]
             * Total number of data records subject to paging)
             */
			count: 0,

            /**
             * @cfg {Integer} [pageCount=10]
             * Number of data records per page
             */
			pageCount: 10,

            /**
             * @cfg {Integer} [screenCount=5]
             * Number of pages shown on the paging screen
             */
			screenCount: 5
        }
    }

    /**
     * @event page
     * Event that occurs when the page is changed
     *
     * @param {Integer} page Active page number
     */

    /**
     * @event reload
     * Event that occurs when the page is reloaded
     */
	
	return UI;
});
jui.defineUI("ui.tooltip", [ "jquery" ], function($) {

    /**
     * @class ui.tooltip
     * Tooltip component can be applied to 4 locations, namely top/bottom/left/right, and a relate message can be entered in the title properties
     *
     * @extends core
     * @alias Tooltip
     * @requires jquery
     */
	var UI = function() {
		var $tooltip = null;
		var pos = {}, title = "", delay = null;

		function createTooltip(self, msg) {
            // 메시지 템플릿 적용
			$tooltip = $(self.tpl.item({
                timestamp: self.timestamp,
                position: self.options.position,
                color: self.options.color,
                message: msg
            }));
			
			// 스타일 옵션
			if(self.options.width) 
				$tooltip.css("max-width", self.options.width);
			if(self.options.align) 
				$tooltip.css("text-align", self.options.align);
			
			$("body").append($tooltip);
			setPosition(self);
		}
		
		function setPosition(self) {
			var offset = $(self.root).offset(),
				w = $(self.root).outerWidth(),
				h = $(self.root).outerHeight();
			var tw = $tooltip.outerWidth(),
				th = $tooltip.outerHeight();
			var x = 0, y = 0, posCheck = self.options.position;
				
			if(posCheck == "left") {
				x = offset.left - tw
				y = offset.top - ((th - h) / 2);
			} else if(posCheck == "right") {
				x = offset.left + w;
				y = offset.top - ((th - h) / 2);
			} else if(posCheck == "bottom") {
				x = offset.left - (tw / 2) + (w / 2);
				y = offset.top + h;
			} else {
				x = offset.left - (tw / 2) + (w / 2);
				y = offset.top - th;
			}
				
			pos =  {
				x: (x < 1) ? 1 : x,
				y: (y < 1) ? 1 : y
			}
		}

        function hideTooltip(self, e) {
            clearTimeout(delay);

            if($tooltip != null) {
                $tooltip.remove();
                $tooltip = null;

                pos = {};
            }

            if(delay != null) {
                self.emit("hide", [ e ]);
                delay = null;
            }
        }

        function showTooltip(self, e) {
            if($tooltip) hideTooltip(self, e);

            var message = ((self.options.title) ? self.options.title : title);

            if(message != "") {
                createTooltip(self, message);

                $tooltip.css({
                    "left": pos.x,
                    "top": pos.y
                });
            }
        }
		
		this.init = function() {
			var self = this, opts = this.options;
				
			// 타이틀 설정
			title = $(this.root).attr("title");
			$(this.root).removeAttr("title");
			
			// 기존의 설정된 이벤트 제거
			$(this.root).off(opts.showType).off(opts.hideType);
			
			// 보이기 이벤트
			this.addEvent(this.root, opts.showType, function(e) {
                if(delay == null) {
                    delay = setTimeout(function () {
                        showTooltip(self, e);

                        if ($tooltip != null) {
                            self.emit("show", [ $tooltip.get(0), e ]);
                        }
                    }, opts.delay);
                } else {
                    if(opts.showType == opts.hideType) {
                        hideTooltip(self, e);
                    }
                }

				return false;
			});
			
			// 숨기기 이벤트
            if(opts.showType != opts.hideType) {
                this.addEvent(this.root, opts.hideType, function (e) {
                    hideTooltip(self, e);

                    return false;
                });
            }
		}

        /**
         * @method update
         * Changes the content of a tooltip
         *
         * @param {String} text
         */
        this.update = function(newTitle) {
            title = newTitle;
        }
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {"black"/"gray"} [color="black"]
             * Determines the color of a tooltip
             */
            color: "black",

            /**
             * @cfg {"top"/"bottom"/"left"/"right"} [position="top"]
             * Determines the location where a tooltip is shown
             */
            position: "top",

            /**
             * @cfg {Integer} [width=150]
             * Determines the horizontal size of a tooltip
             */
            width: 150,

            /**
             * @cfg {"left"/"right"/"center"} [align="left"]
             * Determines the alignment state inside a tooltip
             */
            align: "left",

            /**
             * @cfg {Integer} [delay=0]
             * Determines the event time when a tooltip is shown
             */
            delay: 0,

            /**
             * @cfg {String} [showType="mouseover"]
             * Determines the type of event that triggers a tooltip
             */
            showType: "mouseover",

            /**
             * @cfg {String} [hideType="mouseout"]
             * Determines the type of event that hides a tooltip
             */
            hideType: "mouseout",

            /**
             * @cfg {String} [title=""]
             * Sets the content of a tooltip (referring to the title properties in markup)
             */
            title: "",

            tpl: {
                item: "<div class='tooltip tooltip-<!= position !> tooltip-<!= color !>'>" +
                "<div class='anchor'></div><div class='message'><!= message !></div>" +
                "</div>"
            }
        }
    }

    /**
     * @event show
     * Event that occurs when a tooltip is shown
     *
     * @param {DOMElement} tooltip
     * @param {EventObject} e The event object
     */

    /**
     * @event hide
     * Event that occurs when a tooltip is hidden
     *
     * @param {EventObject} e The event object
     */
	
	return UI;
});
jui.defineUI("ui.layout", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class ui.layout
     * Layout can split the screen into areas and each area will be resizable
     *
     * @extends core
     * @alias Layout
     * @requires jquery
     * @requires util.base
     *
     */
	var UI = function() {
		var ui_layout = null, 
			ui_options = {}, 
			directions = [ 'top','left','right','bottom','center' ];
		
		var resizerIcons = { 
			top: 'n-resize', 
			bottom: 'n-resize', 
			right: 'e-resize', 
			left: 'e-resize' 
		};
		
		function setEvent($resizer, move, down, up) {
			$resizer.mousedown(function(e) {
				$resizer.data('mousedown', true);
				
				var $shadow = $resizer.clone();
				
				$resizer.data('shadow', $shadow);
				$resizer.after($shadow);
				
				down.call(this, e);
				$shadow.css('opacity', 0.3);
				
				$(document).on('mousemove', move);
				$(document).on('mouseup', function mouseUp(e) {
					$(document).off('mousemove', move);
					$(document).off('mouseup', mouseUp);
						
					up.call(this, e);
          			$resizer.data('mousedown', false);					
          			
					$shadow.remove();
					$("body :not(.resize)").css({ 'user-select' : '' })						
				});
				
				$("body :not(.resize)").css({ 'user-select' : 'none' })
			});
		}
		
		function setPosition(height, first, arr, second) {
			arr = arr || [];
			
			if(ui_layout[height]) {
				ui_layout[height].height(first);
			}
			
			if(typeof arr == 'string') arr = [arr];
			if(arr.length == 0) return;
			
			for(var i = 0, len = arr.length; i < len; i++) {
				var $obj = ui_layout[arr[i]];
				
				if($obj) {
					$obj.css({ top : second })
					if($obj.resizer) $obj.resizer.css({ top : second })					
				}
			}
		}
		
		function setResizer(direction) {
			var $first, $second, $layout, $resizer, options;

			$layout = ui_layout[direction];
			$resizer = $layout.resizer;

			$resizer.css({
				cursor : resizerIcons[direction]
			})			
			
			if($resizer.data('event')) return; 
			
			if(direction == 'top') {
				setEvent($resizer, function(e) {
					if(!$resizer.data('mousedown')) return; 
					
					var top = e.clientY - $resizer.data('current');
					var min = ui_options.top.min;
					var max = ui_options.top.max;
					if(min <= top && top < max) {
						$resizer.css({top : top + 'px'});
					}
					
				}, function(e) {
					var top = $resizer.position().top;										 
					$resizer.data('current', e.clientY - top);
				}, function(e) {

					var top = $resizer.position().top;					
					var height = $resizer.height();					
	
					var first = top;
					var second = (top + $resizer.height()) + 'px';
						
					var pre_height = ui_layout.top.height();
					ui_layout.top.height(first);
					
					var dh = pre_height - first;
					var new_height = ui_layout.center.height() + dh;
					
					ui_layout.center.css({top : second}).height(new_height);			
					ui_layout.left.css({top : second}).height(new_height);			
					ui_layout.left.resizer.css({top : second}).height(new_height);			
					ui_layout.right.css({top : second}).height(new_height);			
					ui_layout.right.resizer.css({top : second}).height(new_height);			
				});
		
			} else if(direction == 'bottom') {
				setEvent($resizer, function(e) {
					if(!$resizer.data('mousedown')) return; 
					
					var top = e.clientY - $resizer.data('current');
					var min = ui_options.bottom.min;
					var max = ui_options.bottom.max;
					
					var dh =  $layout.position().top - (top + ui_options.barSize);
					var real_height = dh + $layout.height();
					
					if(min <= real_height && real_height <= max ) {
						$resizer.css({top : top + 'px'});	
					}
				}, function(e) {
					var top = $resizer.position().top;										 
					$resizer.data('current', e.clientY - top);
				}, function(e) {
					var top = $resizer.position().top + $resizer.height();
					
					var max = ui_layout.root.height();
					var dh = parseFloat(ui_layout.bottom.position().top) - top;
					
					ui_layout.bottom.css({ top : top + "px"});
					ui_layout.bottom.height(ui_layout.bottom.height() + dh);
					
					var new_height = ui_layout.center.height() - dh;
					
					ui_layout.center.height(new_height);			
					ui_layout.left.height(new_height);			
					ui_layout.left.resizer.height(new_height);			
					ui_layout.right.height(new_height);			
					ui_layout.right.resizer.height(new_height);		
				});				
			} else if(direction == 'left') {
				setEvent($resizer, function(e) {
					if(!$resizer.data('mousedown')) return; 
					
					var left = e.clientX - $resizer.data('current');
					var min = ui_options.left.min;
					var max = ui_options.left.max;
					if(min <= left && left < max) {
						$resizer.css({left : left + 'px'});
					}
				}, function(e) {
					var left = $resizer.position().left;										 
					$resizer.data('left', left).data('current', e.clientX - left);
				}, function(e) {
          			if(!$resizer.data('mousedown')) return; 
          					
					var left = $resizer.position().left;
					var pre_left = $resizer.data('left');
					var dw = pre_left - left;
					
					ui_layout.left.css({ width : left + "px"});
					ui_layout.center.css({ left : (left + ui_options.barSize ) + "px" });
          			ui_layout.center.width(ui_layout.center.width() + dw);
				});	
			} else if(direction == 'right') {
        		setEvent($resizer, function(e) {
					if(!$resizer.data('mousedown')) return; 
					  
					var left = e.clientX - $resizer.data('current');
					var min = ui_options.right.min;
					var max = ui_options.right.max;
					  
					var sizeLeft = ui_layout.left.width() + ui_layout.left.resizer.width();
					var sizeCenter = ui_layout.center.width();
					var current = $layout.width() - (left - (sizeLeft + sizeCenter));
					  
					if(min <= current && current < max) {
						$resizer.css({left : left + 'px'});  
					}
		        }, function(e) {
		        	var left = $resizer.position().left;                     
		        	$resizer.data('left', left).data('current', e.clientX - left);
		        }, function(e) {
					if(!$resizer.data('mousedown')) return; 
					
					var left = $resizer.position().left;
					var pre_left = $resizer.data('left');
					var dw = pre_left - left;
					
					ui_layout.right.css({ 
						left : (left + $resizer.width()) + 'px',
						width : (ui_layout.right.width() + dw) + "px"
					});
					ui_layout.center.width(ui_layout.center.width() - dw);		          
		        });			  
			}
			
			$resizer.data('event', true);
		}

        function initLayout(self) {
            for(var i = 0, len = directions.length; i < len; i++) {
                var direct = ui_layout[directions[i]];

                if(direct) {
                    ui_layout.root.append(direct);

                    if(directions[i] != 'center') {
                        if(ui_options[directions[i]].resize) {
                            if(!direct.resizer) {
                                direct.resizer = $("<div class='resize " + directions[i] + "' />");
                            }

                            ui_layout.root.append(direct.resizer);
                            setResizer(directions[i]);
                        }
                    }
                }
            }

            self.resize();
        }
	
		this.init = function() {
			var self = this, opts = this.options;
			var $root, $top, $left, $right, $bottom, $center;
			
			$root = $(this.root).css("position", "relative");
			
			if(opts.width != null) {
				$root.outerWidth(opts.width);
			}

			if(opts.height != null) {
				$root.outerHeight(opts.height);
			}
			
			$top = (opts.top.el) ? $(opts.top.el) : $root.find("> .top");				
			if($top.length == 0) $top = null; 
			
			$left = (opts.left.el) ? $(opts.left.el) : $root.find("> .left");
			if($left.length == 0) $left = null;

			
			$right = (opts.right.el) ? $(opts.right.el) : $root.find("> .right"); 
			if($right.length == 0) $right = null;
			
			$bottom = (opts.bottom.el) ? $(opts.bottom.el) : $root.find("> .bottom"); 
			if($bottom.length == 0) $bottom = null;
			
			$center = (opts.center.el) ? $(opts.center.el) : $root.find("> .center"); 
			if($center.length == 0) $center = null;
			
			ui_layout = { 
				root 	: $root, 
				top 	: $top, 
				left 	: $left,
				right 	: $right, 
				bottom 	: $bottom,
				center	: $center
			};
			
			ui_options = opts;
			initLayout(this);
			
			$(window).on('resize', function(e) {
				self.resize();
			})
 
			return this; 			
		}

        /**
         * @method resize
         * Resets the layout
         */
		this.resize = function() {
			var $obj = null, $option = null;
            var sizeTop = 0, sizeLeft = 0, sizeRight = 0, sizeBottom = 0, sizeCenter = 0 ;
			
			$obj = ui_layout.top;
			$option = this.options.top;

			if($obj) {
				$obj.css({
					'position' : 'absolute',
					'top' : '0px',
					'left' : '0px',
					'width' : '100%',
					'height' : $option.size || $option.min  
				});
				
				sizeTop = $obj.height();
				
				if($option.resize) {
					$obj.resizer.css({
						'position' : 'absolute',
						'top': sizeTop,
						'left' : '0px',
						'width' : '100%',
						"background": this.options.barColor,						
						"height" : this.options.barSize
					})					
					
					sizeTop += this.options.barSize;
				} else {
					if($obj.resizer) {
						$obj.resizer.remove();
					}
				}
			}

			$obj = ui_layout.bottom;
			$option = this.options.bottom;
			
			var max = ui_layout.root.height();			
			
			if($obj) {
				$obj.css({
					'position' : 'absolute',
					'left' : '0px',
					'width' : '100%',
					'height' : $option.size || $option.min  
				});
				
				var bottom_top = (sizeTop -  $obj.height()) + sizeTop;
				
				if($option.resize) {
					$obj.resizer.css({
						'position' 	: 'absolute',
						'top' 		: bottom_top,
						'left' 		: '0px',
						'width' 	: '100%',
						"background": this.options.barColor,
						"height" 	: this.options.barSize
					});					
					
					bottom_top += this.options.barSize;
				} else {
					if($obj.resizer) {
						$obj.resizer.remove();
					}
				}		
					
				$obj.css('top', bottom_top + "px");					
			}			
			
			$obj = ui_layout.left;
			$option = this.options.left;
			
			var content_height = max ;
			
			if(ui_layout.top) {
				content_height -= ui_layout.top.height();
				if(ui_layout.top.resizer) {
					content_height -= ui_layout.top.resizer.height();	
				}
			}
			
			if(ui_layout.bottom) {
				content_height -= ui_layout.bottom.height();
				if(ui_layout.bottom.resizer) {
					content_height -= ui_layout.bottom.resizer.height();	
				}
			}							
			
			if($obj) {
				$obj.css({
					'position' : 'absolute',
					'top' : sizeTop,
					'left' : '0px',
					'height' : content_height,
					'width' : $option.size || $option.min,
					'max-width' : '100%',
					'overflow' : 'auto'
				});
				
				sizeLeft = $obj.width();
				
				if($option.resize) {
					$obj.resizer.css({
						'position' 	: 'absolute',
						'top' 		: sizeTop,
						'height'	: $obj.height(),
						'left' 		: sizeLeft,
						"background": this.options.barColor,
						"width" 	: this.options.barSize
					});			
					
					sizeLeft += this.options.barSize;
				} else {
					if($obj.resizer) {
						$obj.resizer.remove();
					}					
				}					
			}
			
			$obj = ui_layout.right;
			$option = this.options.right;
			
			var max_width = ui_layout.root.width();
		    var content_width = max_width;
		    
		    if(ui_layout.left) {
		    	content_width -= ui_layout.left.width();
		    	if(ui_layout.left.resizer) {
		    		content_width -= ui_layout.left.resizer.width();
		    	}
		    }			
			
			if($obj) {
				$obj.css({
					'position' : 'absolute',
					'top' : sizeTop,
					//'right' : '0px',
					'height' : content_height,
					'width' : $option.size || $option.min  ,
					'max-width' : '100%'
				});
				
				if($option.resize) {
					$obj.resizer.css({
						'position' 	: 'absolute',
						'top' 		: sizeTop,
						'height'	: $obj.height(),
						"background": this.options.barColor,
						"width" 	: this.options.barSize
					})	
					
					sizeRight += this.options.barSize;
				} else {
					if($obj.resizer) {
						$obj.resizer.remove();
					}					
				}		
				
		    	content_width -= ui_layout.right.width();
		    	if(ui_layout.right.resizer) {
		    		content_width -= ui_layout.right.resizer.width();
		    	}
		        
		        $obj.resizer.css({ left : (sizeLeft + content_width) + "px" });
		        $obj.css({left : (sizeLeft + content_width + $obj.resizer.width()) + "px"})
											
			}									
			
			$obj = ui_layout.center;
			$option = this.options.center;
			
			if($obj) {
				$obj.css({
					'position' 	: 'absolute',
					'top' 		: sizeTop,
          			'height'  : content_height,
					'left' 		: sizeLeft,
					'width'   : content_width,
					'overflow' : 'auto'
				});
			}			
		}
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {String} [barColor="#d6d6d6"]
             * Determines the color of the resizing bar
             */
			barColor : '#d6d6d6',

            /**
             * @cfg {Integer} [barSize=3]
             * Determines the size of the resizing bar
             */
			barSize : 3,

            /**
             * @cfg {Integer} [width=null]
             * Determines the container area value
             */
			width	: null,

            /**
             * @cfg {Integer} [height=null]
             * Determines the container height value
             */
			height	: null,

            /**
             * @cfg {Object} top
             * Configures options for the top area
             */
			top		: { el : null, size : null, min : 50, max : 200, resize : true },

            /**
             * @cfg {Object} left
             * Configures options for the left area
             */
			left	: { el : null, size : null, min : 50, max : 200, resize : true },

            /**
             * @cfg {Object} right
             * Configures options for the right area
             */
			right	: { el : null, size : null, min : 50, max : 200, resize : true },

            /**
             * @cfg {Object} bottom
             * Configures options for the bottom area
             */
			bottom	: { el : null, size : null, min : 50, max : 200, resize : true },

            /**
             * @cfg {Object} center
             * Configures options for the center area
             */
			center	: { el : null }
        }
    }
	
	return UI;
	
});

jui.defineUI("ui.accordion", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class ui.accordion
     * @extends core
     * @alias Accordion
     * @requires jquery
     */
    var UI = function() {
        var activeIndex = 0;

        var $title = null,
            $content = null;

        function showTitle(index) {
            $title.each(function(i) {
                if(index == i) {
                    $(this).addClass("active");
                    $content.insertAfter(this).show();
                } else {
                    $(this).removeClass("active");
                }
            });
        }

        function setTitleEvent(self) {
            $title.each(function(i) {
                self.addEvent(this, "click", function(e) {
                    if($(this).hasClass("active") && self.options.autoFold) {
                        $(this).removeClass("active");
                        $content.hide();
                        self.emit("fold", [ i, e ] );
                    } else {
                        showTitle(i);
                        self.emit("open", [ i, e ]);
                    }
                });
            });
        }

        this.init = function() {
            var opts = this.options;

            $title = $(this.root).find(".title");
            $content = $(this.root).find(".content");

            if(_.typeCheck("integer", opts.index)) {
                showTitle(opts.index);
            } else {
                $content.hide();
            }

            setTitleEvent(this);
        }

        /**
         * @method activeIndex
         * Gets the index of the currently enabled node
         *
         * @return {Integer} Index
         */
        this.activeIndex = function() {
            return activeIndex;
        }
    }

    UI.setup = function() {
        return {
            /**
             * @cfg {Integer} [index=null]
             * Sets an enabled node
             */
            index: null,

            /**
             * @cfg {Boolean} [autoFold=false]
             * When you click on a node, the node folding
             */
            autoFold: false
        }
    }

    /**
     * @event open
     * When a node is opened, the events that occur
     *
     * @param {Integer} index Index
     * @param {jQueryEvent} e The event object
     */

    /**
     * @event fold
     * When a node is closed, the events that occur
     *
     * @param {Integer} index Index
     * @param {jQueryEvent} e The event object
     */

    return UI;
});
jui.defineUI("uix.autocomplete", [ "jquery", "util.base", "ui.dropdown" ], function($, _, dropdown) {
	
	/**
	 * @class uix.autocomplete
     * Auto complete component that shows a list of keywords containing the input value when inputting a string in a text box
     *
     * @extends core
     * @requires jquery
     * @requires util.base
     * @requires ui.dropdown
	 */
	var UI = function() {
		var ddUi = null, target = null,
            words = [], list = [];

		function createDropdown(self, words) {
			if(words.length == 0) {
				if(ddUi) ddUi.hide();
				return;
			} else {
				if(ddUi) $(ddUi.root).remove();
			}
			
			var pos = $(self.root).offset(),
				$ddObj = $(self.tpl.words({ words: words }));

			$("body").append($ddObj);
			
			ddUi = dropdown($ddObj, {
				keydown: true,
				width: $(self.root).outerWidth(),
				left: pos.left,
				top: pos.top + $(self.root).outerHeight(),
				event: {
					change: function(data, e) {
						$(target).val(data.text);
						self.emit("change", [ data.text, e ]);
					}
				}
			});
			
			ddUi.show();
		}
		
		function getFilteredWords(word) {
			var result = [];
			
			if(word != "") {
				for(var i = 0; i < words.length; i++) {
					var origin = words[i],
						a = words[i].toLowerCase(),
						b = word.toLowerCase();
					
					if(a.indexOf(b) != -1) {
						result.push(origin);
					}
				}
			}
			
			return result;
		}
		
		function setEventKeyup(self) {
			self.addEvent(target, "keyup", function(e) {
				if(e.which == 38 || e.which == 40 || e.which == 13) return;

                list = getFilteredWords($(this).val());
				createDropdown(self, list);

				return false;
			});
		}

		this.init = function() {
			var opts = this.options;
			
			// 타겟 엘리먼트 설정
			target = (opts.target == null) ? this.root : $(this.root).find(opts.target);

			// 키-업 이벤트 설정
			setEventKeyup(this);

            // 단어 업데이트
            this.update(opts.words);
		}

        /**
         * @method update
         * Updates words subject to autofill
         *
         * @param {Array} words
         */
		this.update = function(newWords) {
			words = newWords;
		}

        /**
         * @method list
         * Gets filtered words subject to autofill
         *
         * @return {Array} words
         */
        this.list = function() {
            return list;
        }
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {String/DOMElement} [target=null]
             * Designates a target selector when an autofill route is not a target
             */
			target: null,

            /**
             * @cfg {Array} words
             * Designates words subject to autofill
             */
			words: []
        }
    }

    /**
     * @event change
     * Event that occurs when you click on a dropdown that shows a word list
     *
     * @param {String} word Changed word
     */
	
	return UI;
});
jui.defineUI("uix.tab", [ "jquery", "util.base", "ui.dropdown" ], function($, _, dropdown) {

    /**
     * @class uix.tab
     * @extends core
     * @alias Tab
     * @requires jquery
     * @requires util.base
     * @requires ui.dropdown
     */
	var UI = function() {
		var ui_menu = null,
			$anchor = null;
			
		var menuIndex = -1, // menu index
			activeIndex = 0;
		
		function hideAll(self) {
			var $list = $(self.root).children("li");
			$list.removeClass("active");
		}
		
		function showMenu(self, elem) {
			var pos = $(elem).offset();
			
			$(elem).parent().addClass("menu-keep");
			ui_menu.show(pos.left, pos.top + $(self.root).height());
		}
		
		function hideMenu(self) {
			var $list = $(self.root).children("li"),
				$menuTab = $list.eq(menuIndex);
			
			$menuTab.removeClass("menu-keep");
		}
		
		function changeTab(self, index) {
			hideAll(self);
			
			var $list = $(self.root).children("li"),
				$tab = $list.eq(index).addClass("active");
			
			$anchor.appendTo($tab);
			showTarget(self.options.target, $tab[0]);
		}
		
		function showTarget(target, elem, isInit) {
			var hash = $(elem).find("[href*=\#]").attr("href");
			
			$(target).children("*").each(function(i) {
				var self = this;
				
				if(("#" + self.id) == hash) {
					$(self).show();
				} else {
					$(self).hide();
				}
			});
		}
		
		function setEventNodes(self) {
			$(self.root).children("li").each(function(i) {
				// 메뉴 설정
				if($(this).hasClass("menu")) {
					menuIndex = i;
				}
			
				// 이벤트 설정
				self.addEvent(this, [ "click", "contextmenu" ], function(e) {
					var text = $.trim($(this).text()),
                        value = $(this).val();

					if(i != menuIndex) {
                        if(i != activeIndex) {
                            var args = [ { index: i, text: text, value: value }, e ];

                            if(e.type == "click") {
                                if(self.options.target != "") {
                                    showTarget(self.options.target, this);
                                }

                                // 엑티브 인덱스 변경
                                activeIndex = i;

                                self.emit("change", args);
                                self.emit("click", args);

                                changeTab(self, i);
                            } else if(e.type == "contextmenu") {
                                self.emit("rclick", args);
                            }
                        }
					} else {
						self.emit("menu", [ { index: i, text: text }, e ]);
						if(ui_menu.type != "show") showMenu(self, this);
					}
					
					return false;
				});
			});
			
			setActiveNode(self);
			setEventDragNodes(self);
		}
		
		function setEventDragNodes(self) {
			if(!self.options.drag) return;
			
			var $tabs = $(self.root).children("li"),
				$origin = null,
				$clone = null;
			
			var index = null,
				targetIndex = null;
			
			$tabs.each(function(i) {
				self.addEvent(this, "mousedown", function(e) {
					$origin = $(this);
					$clone = $origin.clone().css("opacity", "0.5");
					
					index = i;
					self.emit("dragstart", [ index, e ]);
					
					return false;
				});

				self.addEvent(this, "mousemove", function(e) {
					if(index == null) return;
					targetIndex = i;
					
					if(index > targetIndex) { // move 로직과 동일
						if(targetIndex == 0) {
							$clone.insertBefore($tabs.eq(0));
						} else {
							$clone.insertAfter($tabs.eq(targetIndex - 1));
						}
					} else {
						if(targetIndex == $tabs.size() - 1) {
							$clone.insertAfter($tabs.eq(targetIndex));
						} else {
							$clone.insertBefore($tabs.eq(targetIndex + 1));
						}
					}
					
					$origin.hide();
				});
			});
			
			self.addEvent(self.root, "mouseup", function(e) {
				if($origin != null) $origin.show();
				if($clone != null) $clone.remove();
				
				if(index != null && targetIndex != null) {
					self.move(index, targetIndex);
					self.emit("dragend", [ targetIndex, e ]);
				}

				index = null;
				targetIndex =  null;
			});
		}
		
		function setActiveNode(self) {
			var $list = $(self.root).children("li"),
				$markupNode = $list.filter(".active"),
				$indexNode = $list.eq(activeIndex),
				$node = ($indexNode.size() == 1) ? $indexNode : $markupNode;
			
			// 노드가 없을 경우, 맨 첫번째 노드를 활성화
			if($node.size() == 0) {
				$node = $list.eq(0);
			}
			
			$anchor.appendTo($node);
			changeTab(self, $list.index($node));
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 활성화 인덱스 설정
			activeIndex = opts.index;
			
			// 컴포넌트 요소 세팅
			$anchor = $("<div class='anchor'></div>");
			
			// 탭 목록 갱신 및 이벤트 설정
			if(opts.nodes.length > 0) {
				this.update(opts.nodes);
			} else {
				setEventNodes(this);
			}
			
			// 드롭다운 메뉴 
			if(this.tpl.menu) {
				var $menu = $(this.tpl.menu());
				$menu.insertAfter($(self.root));
				
				ui_menu = dropdown($menu, {
					event: {
						change: function(data, e) {
							hideMenu(self);
							self.emit("changemenu", [ data, e ]);
						},
						hide: function() {
							hideMenu(self);
						}
					}
				});
			}
			
			return this;
		}

        /**
         * @method update
         * Changes the tab list
         *
         * @param {Array} nodes
         */
		this.update = function(nodes) {
			if(!this.tpl.node) return;
			
			$(this.root).empty();
			
			for(var i = 0; i < nodes.length; i++) {
				$(this.root).append(this.tpl.node(nodes[i]));
			}

			setEventNodes(this);
		}

        /**
         * @method insert
         * Adds a tab at a specified index
         *
         * @param {Integer} index
         * @param {Object} node
         */
		this.insert = function(index, node) {
			if(!this.tpl.node) return;
			
			var html = this.tpl.node(node),
				$list = $(this.root).children("li");
			
			if(index == $list.size()) {
				$(html).insertAfter($list.eq(index - 1));
			} else {
				$(html).insertBefore($list.eq(index));
			}

			setEventNodes(this);
		}

        /**
         * @method append
         * Adds a tab to the last node
         *
         * @param {Object} node
         */
		this.append = function(node) {
			if(!this.tpl.node) return;

			var html = this.tpl.node(node);
			
			if(menuIndex != -1) {
				$(html).insertBefore($(this.root).find(".menu"));
				menuIndex++;
			} else {
				$(this.root).append(html);
			}
			
			setEventNodes(this);
		}

        /**
         * @method prepend
         * Adds a tab to the first node
         *
         * @param {Object} node
         */
		this.prepend = function(node) {
			if(!this.tpl.node) return;

			$(this.root).prepend(this.tpl.node(node));
			setEventNodes(this);
		}

        /**
         * @method remove
         * Removes a tab at a specified index
         *
         * @param {Integer} index
         */
		this.remove = function(index) {
			$(this.root).children("li").eq(index).remove();
			setEventNodes(this);
		}

        /**
         * @method move
         * Changes a specified tab to a tab at a target index
         *
         * @param {Integer} index
         * @param {Integer} targetIndex
         */
		this.move = function(index, targetIndex) {
			if(index == targetIndex) return;
			
			var $tabs = $(this.root).children("li"),
				$target = $tabs.eq(index);
			
			if(index > targetIndex) {
				if(targetIndex == 0) {
					$target.insertBefore($tabs.eq(0));
				} else {
					$target.insertAfter($tabs.eq(targetIndex - 1));
				}
			} else {
				if(targetIndex == $tabs.size() - 1) {
					$target.insertAfter($tabs.eq(targetIndex));
				} else {
					$target.insertBefore($tabs.eq(targetIndex + 1));
				}
			}
			
			activeIndex = targetIndex;
			setEventNodes(this);
		}

        /**
         * @method show
         * Enables the tab at a specified index
         *
         * @param {Integer} index
         */
		this.show = function(index) {
            if(index == menuIndex || index == activeIndex) return;

			activeIndex = index;
            var $target = $(this.root).children("li").eq(index);

			this.emit("change", [{ 
				index: index, 
				text: $.trim($target.text()),
                value: $target.val()
			}]);

			changeTab(this, index);
		}

        /**
         * @method activeIndex
         * Gets the index of the currently enabled tab
         *
         * @return {Integer}
         */
		this.activeIndex = function() {
			return activeIndex;
		}
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {String/DOMElement} [target=""]
             * Determines a selector in the area to become the content of a tab
             */
			target: "",

            /**
             * @cfg {Integer} [index=0]
             * Sets an enabled tab
             */
			index: 0,

            /**
             * @cfg {Boolean} [drag=false]
             * Changes the tab location through dragging
             */
			drag: false,

            /**
             * @cfg {Array} nodes
             * Sets a tab list to data rather than markup
             */
			nodes: []
        }
    }

    /**
     * @event change
     * Event that occurs when a tab is enabled
     *
     * @param {Object} data changed data
     * @param {EventObject} e The event object
     */

    /**
     * @event click
     * Event that occurs when a tab is mouse clicked
     *
     * @param {Object} data changed data
     * @param {EventObject} e The event object
     */

    /**
     * @event rclick
     * Event that occurs when a tab is mouse right clicked
     *
     * @param {Object} data changed data
     * @param {EventObject} e The event object
     */

    /**
     * @event menu
     * Event which occurs when tab menu shown
     *
     * @param {Object} data changed data
     * @param {EventObject} e The event object
     */

    /**
     * @event changemenu
     * Event that occurs when a dropdown is selected
     *
     * @param {Object} data changed data
     * @param {EventObject} e The event object
     */

    /**
     * @event dragstart
     * Event that occurs when a tab starts to move
     *
     * @param {Integer} index
     * @param {EventObject} e The event object
     */

    /**
     * @event dragend
     * Event that occurs when the movement of a tab is completed
     *
     * @param {Integer} index
     * @param {EventObject} e The event object
     */
	
	return UI;
});
jui.define("uix.table.column", [ "jquery" ], function($) {
    /**
     * @class uix.table.column
     * implements Table's Column Component
     * @extends core
     * @alias TableColumn
     * @requires jquery
     *
     */
    var Column = function(index) {
        this.element = null;
        this.order = "asc";
        this.name = null;
        this.data = []; // 자신의 컬럼 로우의 데이터 목록
        this.list = []; // 자신의 컬럼 로우 TD 태그 목록
        this.index = index;
        this.type = "show";
        this.width = null; // width 값이 마크업에 설정되어 있으면 최초 가로 크기 저장


        /**
         * Public Methods
         *
         */
        this.hide = function() {
            this.type = "hide";
            $(this.element).hide();
        }

        this.show = function() {
            this.type = "show";
            $(this.element).show();
        }
    }

    return Column;
});


jui.define("uix.table.row", [ "jquery" ], function($) {
    /**
     * @class uix.table.row
     * implements Table's Row Component
     * @extends core
     * @alias TableRow
     * @requires jquery
     *
     */    
    var Row = function(data, tplFunc, pRow) {
        var self = this, cellkeys = {}; // 숨겨진 컬럼 인덱스 키

        /**
         * Public Properties
         *
         */
        this.data = data;
        this.rownum = null;		// 현재 뎁스에서의 인덱스 키값
        this.index = null;		// 계층적 구조를 수용할 수 있는 키값
        this.element = null;
        this.list = [];			// 자신의 로우에 포함된 TD 태그 목록

        this.parent = (pRow) ? pRow : null;
        this.children = [];
        this.depth = 0;
        this.type = "fold";


        /**
         * Private Methods
         *
         */
        function setIndex(rownum) {
            self.rownum = (!isNaN(rownum)) ? rownum : self.rownum;

            if(!self.parent) self.index = "" + self.rownum;
            else self.index = self.parent.index + "." + self.rownum;

            // 뎁스 체크
            if(self.parent && typeof(self.index) == "string") {
                self.depth = self.index.split(".").length - 1;
            }

            // 자식 인덱스 체크
            if(!self.isLeaf()) {
                setIndexChild(self);
            }
        }

        function setIndexChild(row) {
            var clist = row.children;

            for(var i = 0; i < clist.length; i++) {
                clist[i].reload(i);

                if(!clist[i].isLeaf()) {
                    setIndexChild(clist[i]);
                }
            }
        }

        function setElementCells() {
            self.list = [];

            $(self.element).find("td").each(function(i) {
                self.list[i] = this;

                if(cellkeys[i]) {
                    this.style.display = "none";
                }
            });
        }

        function getElement() {
            if(!tplFunc) return self.element;

            var element = $(tplFunc(
                    $.extend({ row: { index: self.index, data: self.data, depth: self.depth } }, self.data))
            ).get(0);

            return element;
        }

        function removeChildAll(row) {
            $(row.element).remove();

            for(var i = 0; i < row.children.length; i++) {
                var c_row = row.children[i];

                if(!c_row.isLeaf()) {
                    removeChildAll(c_row);
                } else {
                    $(c_row.element).remove();
                }
            }
        }

        function reloadChildAll() {
            for(var i = 0; i < self.children.length; i++) {
                self.children[i].reload(i);
            }
        }


        /**
         * Public Methods
         *
         */

        this.reload = function(rownum, isUpdate, columns) {
            if(!isUpdate) setIndex(rownum); // 노드 인덱스 설정

            if(this.element != null) {
                var newElem = getElement(),
                    clsValue = $(this.element).attr("class");

                $(newElem).addClass(clsValue).insertAfter(this.element);
                $(this.element).remove();

                this.element = newElem;
            } else {
                this.element = getElement();
            }

            if(columns != null) { // 컬럼 정보가 있을 경우, 숨기기 설정
                this.hideCells(columns);
            }

            setElementCells();
        }

        this.destroy = function() {
            if(this.parent != null) { // 부모가 있을 경우, 연결관계 끊기
                this.parent.removeChild(this.index);
            } else {
                removeChildAll(this);
                $(this.element).remove();
            }
        }

        this.isLeaf = function() {
            return (this.children.length == 0) ? true : false;
        }

        this.fold = function() {
            this.type = "fold";

            for(var i = 0; i < this.children.length; i++) {
                var c_row = this.children[i];
                $(c_row.element).hide();

                if(!c_row.isLeaf()) c_row.fold();
            }
        }

        this.open = function() {
            this.type = "open";

            for(var i = 0; i < this.children.length; i++) {
                var c_row = this.children[i];
                $(c_row.element).show();

                if(!c_row.isLeaf()) c_row.open();
            }
        }

        this.appendChild = function(row) {
            var lastElem = (this.isLeaf()) ? this.element : this.lastChildLeaf().element;
            $(row.element).insertAfter(lastElem);

            this.children.push(row);
        }

        this.insertChild = function(rownum, row, isReload) {
            var lastElem = this.element;

            if(rownum > 0) {
                var cRow = this.children[rownum - 1];

                // 마지막 자식이거나 대상 로우가 자식이 있을 경우
                if(!cRow.isLeaf() || this.children.length == rownum + 1) {
                    lastElem = cRow.lastChildLeaf().element;
                } else {
                    lastElem = cRow.element;
                }

            }

            $(row.element).insertAfter(lastElem);

            var preRows = this.children.splice(0, rownum);
            preRows.push(row);

            this.children = preRows.concat(this.children);
            reloadChildAll();
        }

        this.removeChild = function(index) {
            for(var i = 0; i < this.children.length; i++) {
                var row = this.children[i];

                if(row.index == index) {
                    this.children.splice(i, 1); // 배열에서 제거
                    removeChildAll(row);
                }
            }

            reloadChildAll();
        }

        this.lastChild = function() {
            if(!this.isLeaf())
                return this.children[this.children.length - 1];

            return null;
        }

        this.lastChildLeaf = function(lastRow) {
            var row = (!lastRow) ? this.lastChild() : lastRow;

            if(row.isLeaf()) return row;
            else {
                return this.lastChildLeaf(row.lastChild());
            }
        }

        this.showCell = function(index) {
            cellkeys[index] = false;
            $(this.list[index]).show();
        }

        this.hideCell = function(index) {
            cellkeys[index] = true;
            $(this.list[index]).hide();
        }

        this.hideCells = function(columns) {
            for(var i = 0; i < columns.length; i++) {
                if(columns[i].type == "hide") {
                    this.hideCell(i);
                }
            }
        }
    }

    return Row;
});


jui.define("uix.table.base", [ "jquery", "util.base", "uix.table.column", "uix.table.row" ], function($, _, Column, Row) {
    /**
     * @class uix.table.base
     * implements Table Base
     * @extends core
     * @alias TableBase
     * @requires jquery
     * @requires util.base
     * @requires uix.table.column
     * @requires uix.table.row
     *
     */
    var Base = function(handler, fields) {
        var self = this;

        var $obj = handler.$obj,
            $tpl = handler.$tpl;

        var columns = [],
            rows = [],
            folds = {};

        var isNone = false,
            iParser = _.index();


        /**
         * Private Methods
         *
         */
        function init() {
            toggleRowNone();
            initColumns();
        }

        function initColumns() {
            var tmpColumns = [];

            $obj.thead.find("tr:last > th").each(function(i) {
                tmpColumns.push(this);
            });

            for(var i = 0; i < tmpColumns.length; i++) {
                var column = new Column(i);

                if(columns[i]) { // 기존의 컬럼 정보가 있을 경우에는 리스트만 초기화 한다.
                    column.element = columns[i].element;
                    column.order = columns[i].order;
                    column.name = columns[i].name;
                    column.data = columns[i].data;
                    column.list = columns[i].list;
                    column.type = columns[i].type;
                    column.width = columns[i].width;
                } else {
                    column.element = tmpColumns[i];

                    if($(column.element).attr("width") || (
                        $(column.element).attr("style") &&
                        $(column.element).attr("style").indexOf("width") != -1)) {
                        column.width = $(column.element).outerWidth();
                    }

                    if(fields && fields[i]) {
                        column.name = fields[i];
                    }
                }

                for(var j = 0; j < rows.length; j++) {
                    column.list.push(rows[j].list[i]);
                    column.data.push(rows[j].data[column.name]);
                }

                columns[i] = column;
            }
        }

        function initColumnRows(type, row) {
            if(type == "reload" || type == "append") {
                for(var i = 0; i < columns.length; i++) {
                    columns[i].list[row.index] = row.list[i];
                    columns[i].data[row.index] = row.data[columns[i].name];
                }
            } else if(type == "remove") {
                for(var i = 0; i < columns.length; i++) {
                    columns[i].list.splice(row.index, 1);
                    columns[i].data.splice(row.index, 1);
                }
            } else {
                initColumns();
            }
        }

        function createRow(data, no, pRow) {
            var row = new Row(data, $tpl.row, pRow);
            row.reload(no, false, columns);

            return row;
        }

        function setRowChildAll(dataList, row) {
            var c_rows = row.children;

            if(c_rows.length > 0) {
                for(var i = 0; i < c_rows.length; i++) {
                    dataList.push(c_rows[i]);

                    if(c_rows[i].children.length > 0) {
                        setRowChildAll(dataList, c_rows[i]);
                    }
                }
            }
        }

        function getRowChildLeaf(keys, row) {
            if(!row) return null;
            var tmpKey = keys.shift();

            if(tmpKey == undefined) {
                return row;
            } else {
                return getRowChildLeaf(keys, row.children[tmpKey]);
            }
        }

        function reloadRows() {
            var index = arguments[0], callback = arguments[1];

            if(typeof(index) == "function") {
                callback = index;
                index = 0;
            } else {
                index = (!isNaN(index)) ? index : 0;
            }

            for(var i = index; i < rows.length; i++) {
                rows[i].reload(i);
                initColumnRows("reload", rows[i]);

                if(typeof(callback) == "function") {
                    callback(i);
                }
            }
        }

        function insertRowData(index, data) {
            var row = createRow(data, index), preRows = row;

            if(rows.length == index && !(index == 0 && rows.length == 1)) {
                var tRow = rows[index - 1];
                $(row.element).insertAfter((tRow.children.length == 0) ? tRow.element : tRow.lastChildLeaf().element);
            } else {
                $(row.element).insertBefore(rows[index].element);
            }

            // Rows 데이터 갱신
            preRows = rows.splice(0, index);
            preRows.push(row);
            rows = preRows.concat(rows);

            // Rows UI 갱신
            reloadRows(index);

            return row;
        }

        function insertRowDataChild(index, data) {
            var keys = iParser.getIndexList(index);

            var pRow = self.getRowParent(index),
                rownum = keys[keys.length - 1];
            row = createRow(data, rownum, pRow);

            // 데이터 갱신
            pRow.insertChild(rownum, row);

            return row;
        }

        function appendRowData(data) {
            // Row 배열 세팅
            var row = createRow(data, rows.length);
            rows.push(row);

            // 실제 HTML에 추가
            $obj.tbody.append(row.element);

            // Column 배열 세팅
            initColumnRows("append", row);

            return row;
        }

        function appendRowDataChild(index, data) {
            var pRow = self.getRow(index),
                cRow = createRow(data, pRow.children.length, pRow);

            pRow.appendChild(cRow);

            return cRow;
        }

        function toggleRowNone() {
            if(typeof($tpl.none) != "function") return false;

            if(isNone) {
                if(rows.length > 0) {
                    $obj.tbody.find("tr:first").remove();
                    isNone = false;
                }
            } else {
                if(rows.length == 0) {
                    $obj.tbody.html($tpl.none());
                    isNone = true;
                }
            }

            return true;
        }


        /**
         * Public Methods
         *
         */
        this.appendRow = function() {
            var index = arguments[0], data = arguments[1];
            var result = null;

            if(!data) result = appendRowData(index);
            else result = appendRowDataChild(index, data);

            toggleRowNone();
            return result;
        }

        this.insertRow = function(index, data) {
            var result = null;

            if(iParser.isIndexDepth(index)) {
                result = insertRowDataChild(index, data);
            } else {
                if(rows.length == 0 && parseInt(index) == 0) {
                    result = this.appendRow(data);
                } else {
                    result = insertRowData(index, data);
                }
            }

            toggleRowNone();
            return result;
        }

        this.updateRow = function(index, data) {
            var row = this.getRow(index);

            for(var key in data) {
                row.data[key] = data[key];
            }

            row.reload(null, true);
            initColumnRows("reload", row);

            return row;
        }

        this.moveRow = function(index, targetIndex) {
            if(index == targetIndex) return;

            var rows = this.getRowAll(index),
                row = rows[0],
                data = _.clone(row.data);

            if(rows.length > 1) {
                for(var i = 0; i < rows.length; i++) {
                    var index = iParser.changeIndex(rows[i].index, targetIndex, rows[0].index);
                    this.insertRow(index, rows[i].data);
                }
            } else {
                this.insertRow(targetIndex, data);
            }

            this.removeRow(row.index);
        }

        this.removeRow = function(index) {
            var row = this.getRow(index);		// 자신 객체

            if(!iParser.isIndexDepth(index)) {
                row.destroy();

                initColumnRows("remove", rows[index]);
                rows.splice(index, 1);
                reloadRows(index);
            } else {
                row.destroy();
            }

            toggleRowNone();
        }

        this.openRow = function(index) {
            this.getRow(index).open();
            folds[index] = false;

            for(var key in folds) {
                if(folds[key] !== false) {
                    var foldRow = this.getRow(folds[key]);
                    if(foldRow != null) foldRow.fold();
                }
            }
        }

        this.openRowAll = function() {
            var tmpRows = this.getRowAll();

            for(var i = 0; i < tmpRows.length; i++) {
                if(!tmpRows[i].isLeaf()) {
                    tmpRows[i].open();
                    folds[tmpRows[i].index] = false;
                }
            }
        }

        this.foldRow = function(index) {
            this.getRow(index).fold();
            folds[index] = index;
        }

        this.foldRowAll = function() {
            var tmpRows = this.getRowAll();

            for(var i = 0; i < tmpRows.length; i++) {
                if(!tmpRows[i].isLeaf()) {
                    tmpRows[i].fold();
                    folds[tmpRows[i].index] = tmpRows[i].index;
                }
            }
        }

        this.removeRows = function() {
            rows = [];

            if(!toggleRowNone()) {
                $obj.tbody.html("");
            }

            initColumnRows();
        }

        this.sortRows = function(name, isDesc) {
            var qs = _.sort(rows);

            if(isDesc) {
                qs.setCompare(function(a, b) {
                    return (getValue(a) > getValue(b)) ? true : false;
                });
            } else {
                qs.setCompare(function(a, b) {
                    return (getValue(a) < getValue(b)) ? true : false;
                });
            }

            // 정렬 후, 데이터 갱신
            qs.run();
            $obj.tbody.html("");

            // 정렬 후, 화면 갱신
            reloadRows(function(i) {
                $obj.tbody.append(rows[i].element);
            });

            // 해당 컬럼에 해당하는 값 가져오기
            function getValue(row) {
                var value = row.data[name];

                if(typeof(value) == "string") {
                    return value.toLowerCase();
                } else {
                    if(!isNaN(value) && value != null) {
                        return value;
                    }
                }

                return "";
            }
        }

        this.appendColumn = function(tplType, dataList) {
            var columLength = columns.length,
                $columnRows = $($tpl[tplType]({ rows: dataList }));
            var $theadTrList = $columnRows.filter("thead").find("tr");

            $theadTrList.each(function(i) {
                var $tr = $obj.thead.find("tr").eq(i);

                $(this).find("th").each(function(j) {
                    $tr.append(this);

                    if($theadTrList.size() - 1 == i) {
                        columns.push({ element: this, list: [] });
                    }
                });
            });

            for(var k = 0; k < rows.length; k++) {
                $columnRows.filter("tbody").find("tr").eq(k).find("td").each(function(i) {
                    $(rows[k].element).append(this);

                    columns[columLength + i].list.push(this);
                    rows[k].list.push(this);

                    $.extend(rows[k].data, dataList[k]);
                });
            }
        }

        this.removeColumn = function(index) {
            for(var i = 0; i < columns[index].list.length; i++) {
                $(columns[index].element).remove();
                $(columns[index].list[i]).remove();
            }

            for(var j = 0; j < rows.length; j++) {
                rows[j].list.splice(index, 1);
            }

            columns.splice(index, 1);
        }

        this.hideColumn = function(index) {
            if(columns[index].type == "hide") return;

            var rows = this.getRowAll();
            for(var i = 0; i < rows.length; i++) {
                rows[i].hideCell(index);
            }

            columns[index].hide();
        }

        this.showColumn = function(index) {
            if(columns[index].type == "show") return;

            var rows = this.getRowAll();
            for(var i = 0; i < rows.length; i++) {
                rows[i].showCell(index);
            }

            columns[index].show();
        }

        this.getColumnCount = function() {
            return columns.length;
        }

        this.getRowCount = function() {
            return rows.length;
        }

        this.getColumn = function(index) {
            if(index == null) return columns;
            else return columns[index];
        }

        this.getRow = function(index) {
            if(index == null) return rows;
            else {
                if(iParser.isIndexDepth(index)) {
                    var keys = iParser.getIndexList(index);
                    return getRowChildLeaf(keys, rows[keys.shift()]);
                } else {
                    return (rows[index]) ? rows[index] : null;
                }
            }
        }

        this.getRowAll = function(index) {
            var dataList = [],
                tmpRows = (index == null) ? rows : [ this.getRow(index) ];

            for(var i = 0; i < tmpRows.length; i++) {
                if(tmpRows[i]) {
                    dataList.push(tmpRows[i]);

                    if(tmpRows[i].children.length > 0) {
                        setRowChildAll(dataList, tmpRows[i]);
                    }
                }
            }

            return dataList;
        }

        this.getRowParent = function(index) { // 트리 구조의 키에서 키 로우의 부모를 가져오는 함수
            if(!iParser.isIndexDepth(index)) return null;
            return this.getRow(iParser.getParentIndex(index));
        }

        this.setColumn = function(index, column) {
            columns[index] = column;
        }

        this.setRow = function(index, row) {
            rows[index] = row;
        }

        this.printInfo = function() {
            console.log(columns);
            console.log(rows);
        }

        init();
    }

    return Base;
});


jui.defineUI("uix.table", [ "jquery", "util.base", "ui.dropdown", "uix.table.base" ], function($, _, dropdown, Base) {
	
	/**
	 * Common Logic
	 * 
	 */
	_.resize(function() {
		var call_list = jui.get("table");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i].list;
			
			for(var j = 0; j < ui_list.length; j++) {
				ui_list[j].resize();
			}
		}
	}, 1000);


    /**
     * @class uix.table
     * implements Table Component
     * @extends core
     * @alias Table
     * @requires jquery
     * @requires util.base
     * @requires ui.dropdown
     * @requires uix.table.base
     *
     */
	var UI = function() {
		var $obj = null, ddUi = null; // table/thead/tbody 구성요소, 컬럼 설정 UI (Dropdown)
		var rowIndex = null, checkedList = {};
        var is_resize = false, is_edit = false;
		
		
		/**
		 * Private Methods
		 *
		 */
		function getExpandHtml(self) {
			return "<tr class='expand' style='display: none;'><td id='EXPAND_" + self.timestamp + "'></td></tr>";
		}
		
		function getColumnIndexes(self, colkeys) {
			var indexList = [];
			
			for(var i = 0; i < colkeys.length; i++) {
				if(typeof(colkeys[i]) == "string") {
					var column = self.getColumn(colkeys[i]);
					indexList.push(column.index);
				} else {
					indexList.push(colkeys[i]);
				}
			}
			
			return indexList;
		}
		
		function setColumnStatus(self) {
			var colkeys = self.options.colshow,
				len = self.uit.getColumnCount();
				
			if(colkeys === true) {
				self.options.colshow = colkeys = [];
				
				for(var i = 0; i < len; i++) {
					colkeys.push(i);
				}
			} else {
				colkeys = getColumnIndexes(self, colkeys);
			}
			
			for(var i = 0; i < len; i++) {
				if($.inArray(i, colkeys) == -1) 
					self.uit.hideColumn(i);
				else 
					self.uit.showColumn(i);
			}
		}
		
		function setColumnMenu(self) {
			var $ddObj = null;
			var columns = self.listColumn(),
				columnNames = [];
				
			for(var i = 0; i < columns.length; i++) {
				columnNames.push($(columns[i].element).text());
			}
			
			$ddObj = $(self.tpl.menu({ columns: columnNames }));
			
			$("body").append($ddObj);
			ddUi = dropdown($ddObj, { close: false });
			
			$(ddUi.root).find("input[type=checkbox]").each(function(i) {
				if(columns[i].type == "show") this.checked = true;
				else this.checked = false;
				
				self.addEvent(this, "click", function(e) {
					var ckCount = $(ddUi.root).find("input[type=checkbox]:checked").size();
					
					if(this.checked) {
						self.showColumn(i, e);
					} else {
						if(ckCount > 0) {
							self.hideColumn(i, e);
						} else {
							this.checked = true;
						}
					}
					
					self.hideExpand();
					self.scroll();
				});
			});
		}
		
		function setScrollResize(self) {
			var tableWidth = $obj.table.outerWidth(),
				thCount = self.uit.getColumnCount(),
				isLastCheck = false;
			
			for(var i = thCount - 1; i >= 0; i--) {
				var colInfo = self.getColumn(i),
					thWidth = $(colInfo.element).outerWidth();
				
				// 마지막 TD는 스크롤 사이즈를 차감
				if($(colInfo.element).css("display") == "none") {}
				else {
					if(!isLastCheck) {
						thWidth = thWidth - _.scrollWidth();
						isLastCheck = true;
					}
				}
				
				$(colInfo.list[0]).outerWidth(thWidth);
			}
			
			$obj.tbody.outerWidth(tableWidth);
		}
		
		function setScrollEvent(self) {
			if(!$(self.root).hasClass("table-scroll")) { // 스크롤일 경우, 별도 처리
				self.scroll();
			}
			
			$obj.tbody.off("scroll").scroll(function(e) {
			    if(($obj.tbody.scrollTop() + self.options.scrollHeight) == $obj.tbody.get(0).scrollHeight){
			    	self.emit("scroll", e);
			    	return false;
			    }
			});
		}
		
		function setUpdateInit(self, isInit) {
			if(self.uit.getRowCount() < 1) return;
			
			if(isInit) {
				if(self.options.expand) {
					$obj.tbody.prepend(getExpandHtml(self));
				}
				
				self.scroll();
			}
			
			if(self.options.scroll) { // 스크롤 이벤트 처리
				setScrollEvent(self);
			}
			
			self.setVo();
		}
		
		function setEventRows(self, rows) {
			var rows = (!rows) ? self.uit.getRow() : rows;
			
			for(var i = 0; i < rows.length; i++) {
				(function(row) {
					if(row.children.length > 0) {
						setEventRow(self, row);
						setEventRows(self, row.children);
					} else {
						setEventRow(self, row);
					}
				})(rows[i])
			}
		}
		
		function setEventRow(self, row) {
			self.addEvent(row.element, "click", function(e) {
				// 1. 공통 이벤트 발생
				self.emit("select", [ row, e ]); // deprecated
				self.emit("click", [ row, e ]);

				// 2. 확장영역 자동 이벤트 처리
				if(self.options.expand) {
					if(self.options.expandEvent === false) return;
					
					if(rowIndex === row.index) {
						self.hideExpand(e);
					} else {
						if(rowIndex != null) {
							self.hideExpand(e);
						}
						
						self.showExpand(row.index, undefined, e);
					}
				} 
			});
			
			self.addEvent(row.element, "dblclick", function(e) {
				self.emit("dblclick", [ row, e ]);
			});
			
			self.addEvent(row.element, "contextmenu", function(e) {
				self.emit("rowmenu", [ row, e ]);
				return false;
			});
			
			if(self.options.fields && self.options.editCell) {
				if(self.options.editEvent === false) return;
				
				$(row.element).find("td").each(function(i) {
					var cell = this;
					
					(function(colIndex) { 
						self.addEvent(cell, "dblclick", function(e) {
                            if(is_edit) return;
                            is_edit = true;

							if(e.target.tagName == "TD") {
								setEventEditCell(self, e.currentTarget, row, colIndex);
							}
							
							self.emit("editstart", [ row, e ]);
						});
					})(i);
				});
			}

			if(self.options.fields && self.options.editRow) {
				if(self.options.editEvent === false) return;
				
				self.addEvent(row.element, "dblclick", function(e) {
					if(e.target.tagName == "TD" || e.target.tagName == "TR") {
						self.showEditRow(row.index, e);
					}
				});
			}
		}
		
		function setEventEditCell(self, elem, row, colIndex, event, callback) {
			var column = self.getColumn(colIndex),
				data = (column.name) ? column.data[row.index] : $(elem).html(),
				colkeys = (!callback) ? self.options.editCell : self.options.editRow;
			
			var $input = $("<input type='text' class='edit' />").val(data).css("width", "100%");
			$(elem).html($input);
			
			if(!column.name || (colkeys !== true && $.inArray(colIndex, getColumnIndexes(self, colkeys)) == -1)) {
				$input.attr("disabled", true);
			}
			
			// 클릭 엘리먼트에 포커스 맞추기
			if(event && event.target == elem) $input.focus();

			// 엔터 키 이벤트 발생시 업데이트
			self.addEvent($input, "keypress", function(e) {
				if(e.which == 13) {
					update(e);
				}
			});
			
			// 포커스가 바뀌었을 경우 업데이트
			self.addEvent($obj.tbody.find("tr"), "click", function(e) {
				if(e.target.tagName == "TD" || e.target.tagName == "TR") {
					update(e);
				}
			});
			
			function update(e) {
                if(!is_edit) return;

				if(typeof(callback) == "function") { // editRow일 경우
					callback();
                    is_edit = false;
				} else {
					var data = {};
					data[column.name] = $input.val();

					var res = self.emit("editend", [ data ]);
					
					// 이벤트 리턴 값이 false가 아닐 경우에만 업데이트
					if(res !== false) {
						self.update(row.index, data);
						$input.remove();
                        is_edit = false;
					}
				}
			}
		}

		function setEventColumn(self) {
            var opts = self.options,
                len = self.uit.getColumnCount();

			// 컬럼 컨텍스트 이벤트
            for(var i = 0; i < len; i++) {
                var col = self.getColumn(i);

				(function(index, column) {
                    if(!opts.fields || !opts.sort || opts.sortEvent !== true) {
                        self.addEvent(column.element, "click", function (e) {
                            self.emit("colclick", [ column, e ]);
                        });
                    }

                    self.addEvent(column.element, "dblclick", function(e) {
                        self.emit("coldblclick", [ column, e ]);
                    });

					self.addEvent(column.element, "contextmenu", function(e) {
						self.emit("colmenu", [ column, e ]);
						return false;
					});
				})(i, col);
			}
		}
		
		function setEventSort(self) {
			var sortIndexes = self.options.sort,
				len = (sortIndexes === true) ? self.uit.getColumnCount() : sortIndexes.length;
			
			for(var i = 0; i < len; i++) {
				var colKey = (sortIndexes === true) ? i : sortIndexes[i],
					col = self.getColumn(colKey);
				
				if(col.element != null) {
					(function(index, column) {
						self.addEvent(column.element, "click", function(e) {
							if($(e.target).hasClass("resize")) return;

							self.sort(index, undefined, e);
                            self.emit("colclick", [ column, e ]);
						});
					})(colKey, col);
					
					$(col.element).css("cursor", "pointer");
				}
			}
		}
		
		function setColumnResize(self) {
			var resizeX = 0,
                tablePos = $obj.table.offset();
			var col = null,
				colNext = null,
				colWidth = 0,
				colNextWidth = 0,
				colResize = null;

			// 리사이즈 엘리먼트 삭제
			$obj.thead.find(".resize").remove();
			
			for(var i = 0; i < self.uit.getColumnCount() - 1; i++) {
				var $colElem = $(self.getColumn(i).element),
					$resizeBar = $("<div class='resize'></div>");
				var pos = $colElem.offset(); // ie8 버그로 인해 position에서 offset으로 변경함

				$resizeBar.css({
					position: "absolute",
			        width: "8px",
			        height: $colElem.outerHeight(),
			        left: ($colElem.outerWidth() + (pos.left - tablePos.left) - 1) + "px",
			        top: (pos.top - tablePos.top) + "px",
			        cursor: "w-resize",
			        "z-index": "1"
				});
				
				$colElem.append($resizeBar);
				
				// Event Start
				(function(index) {
					self.addEvent($resizeBar, "mousedown", function(e) {
						if(resizeX == 0) resizeX = e.pageX;
						
						// 컬럼 객체 가져오기
						col = self.getColumn(index);
						colNext = getNextColumn(index);
						colWidth = $(col.element).outerWidth(),
						colNextWidth = $(colNext.element).outerWidth();
						colResize = this;
                        is_resize = true;
						
						return false;
					});
				})(i);
			}
			
			self.addEvent("body", "mousemove", function(e) {
				if(resizeX > 0) {
					colResizeWidth(self, e.pageX - resizeX);
				}
			});
			
			self.addEvent("body", "mouseup", function(e) {
				if(resizeX > 0) {
					resizeX = 0;
                    is_resize = false;
					
					// 리사이징 바, 위치 이동
					var left = $(col.element).offset().left - tablePos.left;
					$(colResize).css("left", $(col.element).outerWidth() + left - 1);

                    self.emit("colresize", [ col, e ]);
					
					return false;
				}
			});
			
			function getNextColumn(index) {
				for(var i = index + 1; i < self.uit.getColumnCount(); i++) {
					var elem = self.getColumn(i).element;
					
					if(!$(elem).is(':hidden')) {
						return self.getColumn(i);
					}
				}
			}
			
			function colResizeWidth(self, disWidth) {
				var colMinWidth = 30;
				
				// 최소 크기 체크
				if(colWidth + disWidth < colMinWidth || colNextWidth - disWidth < colMinWidth)
					return;
				
				$(col.element).outerWidth(colWidth + disWidth);
				$(colNext.element).outerWidth(colNextWidth - disWidth);
				
				// 스크롤 옵션일 경우, 별도 처리
				if(self.options.scroll) {
					var colLastWidth = $(colNext.element).outerWidth() - ((col.index == self.uit.getColumnCount() - 2) ? _.scrollWidth() : 0);
					
					$(col.list[0]).outerWidth($(col.element).outerWidth());
					$(colNext.list[0]).outerWidth(colLastWidth);
				}
			}
		}
		
		
		/**
		 * Public Methods
		 *
		 */
		
		this.init = function() {
			var opts = this.options;

            // @Deprecated, 'rows'는 의미상 맞지 않아 차후 삭제
            opts.data = (opts.rows != null) ? opts.rows : opts.data;

			// UIHandler, 추후 코어에서 처리
			$obj = {
				table: $(this.root).css({ "position": "relative" }),
				thead: $(this.root).find("thead"),
				tbody: $(this.root).find("tbody")
			};

			// UITable 객체 생성
			this.uit = new Base({
				$obj: $obj, $tpl: this.tpl 
			}, opts.fields); // 신규 테이블 클래스 사용
			
			if(opts.fields && opts.colshow) { // 컬럼 보이기 초기값 설정
				setColumnStatus(this);
			}
			
			if(opts.fields && this.tpl.menu) { // 컬럼 보이기/숨기기 메뉴 설정
				setColumnMenu(this);
			}
			
			if(opts.resize) {
				setColumnResize(this);
			}

			if(opts.fields && opts.sort && opts.sortEvent === true) {
                setEventSort(this);
			}
			
			if(opts.data.length > 0) {
				this.update(opts.data);
			} else {
				this.setVo(); // 데이터가 있을 경우에는 VO 세팅을 별도로 함
			}
			
			if(opts.width > 0) {
				$obj.table.outerWidth(opts.width);
			}
			
			if(!opts.fields) {
				if(opts.sort || opts.colshow || opts.editCell || opts.editRow) {
					throw new Error("JUI_CRITICAL_ERR: 'fields' option is required");
				}
			}
			
			setEventColumn(this);
		}
		
		this.update = function() {
			var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
				index = (arguments.length == 2) ? arguments[0] : null;
			
			if(index != null) { // 1. 단일 로우 업데이트
				var tmpRow = this.uit.updateRow(index, dataList);
				setEventRow(this, tmpRow);
				
				// 첫번째 로우일 경우, 스크롤 다시 처리
				if(parseInt(index) == 0) { 
					this.scroll();
				}
			} else { // 2. 로우 목록 업데이트
				this.uit.removeRows();
				this.scroll();
				this.append(dataList);
				
				// 정렬 인덱스가 옵션에 있을 경우, 해당 인덱스의 컬럼 정렬
				if(this.options.sortIndex) {
					this.sort(this.options.sortIndex, this.options.sortOrder, null);
				}
			}
		}
		
		this.updateTree = function(rows) { // index & data 조합의 객체 배열 
			var iParser = _.index();
			
			// 전체 로우 제거
			this.uit.removeRows();
			
			// 트리 로우 추가
			for(var i = 0; i < rows.length; i++) {
				var pIndex = iParser.getParentIndex(rows[i].index);
				
				if(pIndex == null) {
					this.uit.appendRow(rows[i].data);
				} else {
					this.uit.appendRow(pIndex, rows[i].data);
				}
			}
			
			setUpdateInit(this, true);
			setEventRows(this);
		}
		
		this.append = function() {
			var isInit = (this.count() > 0) ? false : true;
			var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
				index = (arguments.length == 2) ? arguments[0] : null;
			
			dataList = (dataList.length == undefined) ? [ dataList ] : dataList;
			
			for(var i = 0; i < dataList.length; i++) {
				var tmpRow = null;
				
				if(index != null) tmpRow = this.uit.appendRow(index, dataList[i]);
				else tmpRow = this.uit.appendRow(dataList[i]);
				
				// 추가 로우 추가시 이벤트 걸기
				if(!isInit) {
					setEventRow(this, tmpRow);
				}
			}
			
			setUpdateInit(this, isInit);
			if(isInit) setEventRows(this); // 최초에 데이터가 없을 경우에만 전체 이벤트 걸기
		}
		
		this.insert = function(index, dataList) {
			var isInit = (this.count() > 0) ? false : true;
			var dataList = (dataList.length == undefined) ? [ dataList ] : dataList;
			
			for(var i = 0; i < dataList.length; i++) {
				this.uit.insertRow(index, dataList[i]);
			}
			
			setUpdateInit(this, isInit);
			setEventRows(this);
		}
		
		this.select = function(index) {
			var row = this.get(index);

			// 초기화
			this.hideExpand();
			this.hideEditRow();
			this.uncheckAll();

			$(row.element).parent().find(".selected").removeClass("selected");
			$(row.element).addClass("selected");
			
			rowIndex = index;
			return row;
		}
		
		this.unselect = function() {
			if(rowIndex == null) return;
			var row = this.get(rowIndex);
			
			$(row.element).removeClass("selected");
			rowIndex = null;
			
			return row;
		}
		
		this.check = function(index) {
			var row = this.get(index);
			
			// 초기화
			this.hideExpand();
			this.hideEditRow();
			this.unselect();
			
			checkedList[index] = row;
			$(row.element).addClass("checked");
		}
		
		this.uncheck = function(index) {
			var row = this.get(index);
			
			checkedList[index] = null;
			$(row.element).removeClass("checked");
		}

		this.uncheckAll = function() {
			checkedList = {};
			$obj.tbody.find(".checked").removeClass("checked");
		}
		
		this.remove = function(index) {
			if(index == null) return null;
			
			this.uit.removeRow(index);
			setEventRows(this);
			this.scroll();
		}
		
		this.reset = function() {
			this.uit.removeRows();
			this.scroll();
		}
		
		this.move = function(index, targetIndex) {
			this.uit.moveRow(index, targetIndex);
			setEventRows(this);
			
			// 첫번째 로우일 경우, 스크롤 다시 처리
			if(parseInt(index) == 0 || parseInt(targetIndex) == 0) {
				this.scroll();
			}
		}
		
		this.sort = function(index, order, e) {  // index는 컬럼 key 또는 컬럼 name
			if(!this.options.fields || !this.options.sort || is_resize) return;
			var column = this.getColumn(index);
			
			if(typeof(column.name) == "string") {
				column.order = (order) ? order : (column.order == "asc") ? "desc" : "asc";
				
				this.uit.setColumn(index, column);
				this.uit.sortRows(column.name, (column.order == "desc") ? true : false);
				this.emit("sort", [ column, e ]);
				
				setUpdateInit(this, true);
				setEventRows(this);
			}
		}
		
		this.scroll = function(height) {
			if(!this.options.scroll) return;
			
			var self = this,
				h = (height && height > 0) ? height : this.options.scrollHeight,
				h = (h > 0) ? h : 200;
			
			this.options.scrollHeight = h;
			$obj.tbody.css("maxHeight", h + "px");
			
			setTimeout(function() {
				if($obj.tbody.outerHeight() < h) {
					$obj.table.css({
						"table-layout": ""
					});
					
					$obj.tbody.css({
						"display": "",
						"overflow": ""
					});
				} else {
					$obj.table.css({
						"table-layout": "fixed"
					});
					
					$obj.tbody.css({
						"display": "block",
						"overflow": "auto"
					});
				}
				
				setScrollResize(self);
			}, 10);
		}
		
		this.open = function(index) { // 로트 제외, 하위 모든 노드 대상
			if(index == null) return;
			
			this.uit.openRow(index);
			this.emit("open", [ this.get(index) ]);
		}
		
		this.fold = function(index) {
			if(index == null) return;

			this.uit.foldRow(index);
			this.emit("fold", [ this.get(index) ]);
		}
		
		this.openAll = function() { // 로트 포함, 하위 모든 노드 대상
			this.uit.openRowAll();
			this.emit("openall");
		}

		this.foldAll = function() {
			this.uit.foldRowAll();
			this.emit("foldall");
		}
		
		this.resize = function() {
			this.scroll();
			
			if(this.options.resize) {
				setColumnResize(this);
			}
		}
		
		this.resizeColumns = function() {
			var columns = this.listColumn();
			
			for(var i = 0; i < columns.length; i++) {
				if(columns[i].width == null) {
					$(columns[i].element).outerWidth("auto");
				}
			}
		}
		
		this.size = function() { // 차후 수정 (컬럼 * 로우 개수 * 바이트)
			return this.uit.getRowCount();
		}

		this.count = function() {
			return this.uit.getRowCount();
		}

		this.list = function() {
			return this.uit.getRow();
		}

        this.listData = function() {
            var rows = this.list(),
                data = [];

            for(var i = 0; i < rows.length; i++) {
                data.push(rows[i].data);
            }

            return data;
        }

		this.listAll = function() {
			return this.uit.getRowAll();
		}
		
		this.listChecked = function() {
			var list = [];
			
			for(var row in checkedList) {
				if(checkedList[row] != null) {
					list.push(checkedList[row]);
				}
			}
			
			return list;
		}
		
		this.listColumn = function() {
			return this.uit.getColumn();
		}
		
		this.get = function(index) {
			if(index == null) return null;
			return this.uit.getRow(index);
		}
		
		this.getAll = function(index) {
			if(index == null) return null;
			return this.uit.getRowAll(index);
		}
		
		this.getColumn = function(index) { // index or columnName
			if(index == null) return null;
			else {
				if(typeof(index) == "string")
					return this.uit.getColumn($.inArray(index, this.options.fields));
				else 
					return this.uit.getColumn(index);
			}
		}
		
		this.showColumn = function(index, e) { // index or columnName
			if(!this.options.fields) return;
			var column = this.getColumn(index);
			
			this.uit.showColumn(column.index);
			this.scroll();
			this.resizeColumns();
			
			if(this.options.resize) {
				setColumnResize(this);
			}
			
			// 커스텀 이벤트 발생
			this.emit("colshow", [ column, e ]);
		}
		
		this.hideColumn = function(index, e) { // index or columnName
			if(!this.options.fields) return;
			var column = this.getColumn(index);
			
			this.uit.hideColumn(column.index);
			this.scroll();
			this.resizeColumns();
			
			if(this.options.resize) {
				setColumnResize(this);
			}

			// 커스텀 이벤트 발생
			this.emit("colhide", [ column, e ]);
		}
		
		this.initColumns = function(keys) {
			if(typeof(keys) != "object") return;
			this.options.colshow = keys;
			
			setColumnStatus(this);
			this.scroll();
			this.resizeColumns();
			
			if(this.options.resize) {
				setColumnResize(this);
			}
		}
		
        this.showColumnMenu = function(x) {
            if(!this.options.fields || !ddUi) return;

            var columns = this.listColumn();
            var offset = $obj.thead.offset(),
                maxX = offset.left + $obj.table.outerWidth() - $(ddUi.root).outerWidth();

            x = (isNaN(x) || (x > maxX + offset.left)) ? maxX : x;
            x = (x < 0) ? 0 : x;

            // 현재 체크박스 상태 설정
            $(ddUi.root).find("input[type=checkbox]").each(function(i) {
                if(columns[i].type == "show") this.checked = true;
                else this.checked = false;
            });

            ddUi.move(x, offset.top + $obj.thead.outerHeight());
            ddUi.show();
        }

        this.hideColumnMenu = function() {
            if(!this.options.fields || !ddUi) return;
            ddUi.hide();
        }

        this.toggleColumnMenu = function(x) {
            if(!this.options.fields || !ddUi) return;

            if(ddUi.type == "show") this.hideColumnMenu();
            else this.showColumnMenu(x);
        }
		
		this.showExpand = function(index, obj, e) {
			if(!this.options.expand) return;
			
			// 초기화
			this.unselect();
			this.hideEditRow();
			
			var expandSel = "#EXPAND_" + this.timestamp,
				row = this.get(index),
				obj = (typeof(obj) != "object") ? $.extend({ row: row }, row.data) : obj,
				$expand = $(expandSel).parent().show();
			
			$obj.tbody.find("tr").removeClass("open");
			$expand.insertAfter($(row.element).addClass("open"));
			
			$(expandSel)
				.attr("colspan", $obj.thead.find("tr:last > th:visible").size())
				.html(this.tpl["expand"](obj));

			// 스크롤 및 VO 적용
			this.scroll();
			this.setVo();
			
			// 커스텀 이벤트 호출
			rowIndex = index;
			this.emit("expand", [ row, e ]);
		}
		
		this.hideExpand = function(e) {
			if(!this.options.expand) return;
			if(rowIndex == null) return;
			
			var row = this.get(rowIndex);
			
			$('#EXPAND_' + this.timestamp).parent().hide();
			$obj.tbody.find("tr").removeClass("open");

			// 스크롤 적용
			this.scroll();
			
			// 커스텀 이벤트 호출
			rowIndex = null;
			this.emit("expandend", [ row, e ]);
		}
		
		this.getExpand = function() {
			if(!this.options.expand) return;

			if(rowIndex == null) return null;
			return this.get(rowIndex);
		}
		
		this.showEditRow = function(index, e) {
			if(!this.options.editRow || is_edit) return;
			
			// 초기화
			this.unselect();
			this.hideExpand();
			
			var self = this,
				row = this.get(index);
			var $cells = $(row.element).find("td");

            // 현재 테이블 수정 상태
            is_edit = true;
			
			$cells.each(function(i) {
				setEventEditCell(self, this, row, i, e, function() {
					var data = {},
                        originData = row.data;

					$cells.each(function(colIndex) {
						var column = self.getColumn(colIndex);
						
						if(column.name != null) {
                            var value = $(this).find(".edit").val();
                            data[column.name] = (!isNaN(value) && value != null) ? parseFloat(value) : value;
						}
					});

                    // 변경된 값으로 데이터 갱신하기
                    row.data = data;

                    // 콜백 결과 가져오기
					var res = self.emit("editend", [ row, e ]);
					
					// 이벤트 리턴 값이 false가 아닐 경우에만 업데이트
					if(res !== false) {
						self.update(row.index, data);
					} else {
                        row.data = originData;
                    }
				});
			});

			rowIndex = index;
			self.emit("editstart", [ row, e ]);
		}
		
		this.hideEditRow = function() {
			if(!this.options.editRow) return;
			if(rowIndex == null) return;
			
			var row = this.get(rowIndex);
			
			// 커스텀 이벤트 호출
			rowIndex = null;
			
			// 수정 상태 이전의 로우 데이터로 변경
			this.emit("editend", [ row.data ]);
			this.update(row.index, row.data);
		}
		
		this.getEditRow = function() {
			if(!this.options.editRow) return;

			if(rowIndex == null) return null;
			return this.get(rowIndex);
		}
		
		this.setCsv = function() {
            var opts = this.options;
			if(!opts.fields && !opts.csv) return;
			
			var csv = (arguments.length == 1) ? arguments[0] : arguments[1],
				key = (arguments.length == 2) ? arguments[0] : null;

            var fields = _.getCsvFields(opts.fields, opts.csv),
                csvNumber = (opts.csvNumber) ? _.getCsvFields(opts.fields, opts.csvNumber) : null,
                dataList = _.csvToData(fields, csv, csvNumber);

			if(key == null) {
				this.update(dataList);
			} else {
				this.reset();
				
				for(var i = 0; i < dataList.length; i++) {
					var index = dataList[i][key];
					
					if(index) {
						this.insert(index, dataList[i]);
					}
				}
			}
		}
		
		this.setCsvFile = function() {
			if(!this.options.fields && !this.options.csv) return;
			
			var self = this,
				file = (arguments.length == 1) ? arguments[0] : arguments[1],
				key = (arguments.length == 2) ? arguments[0] : null;
				
			_.fileToCsv(file, function(csv) {
				if(key == null) self.setCsv(csv);
				else self.setCsv(key, csv);
			});
		}
		
		this.getCsv = function(isTree) {
			if(!this.options.fields && !this.options.csv) return;
			
			var fields = _.getCsvFields(this.options.fields, this.options.csv);
			var dataList = [],
				rows = (isTree) ? this.listAll() : this.list();
				
			for(var i = 0; i < rows.length; i++) {
				dataList.push(rows[i].data);
			}
			
			return _.dataToCsv2({
				fields: fields,
				rows: dataList,
				names: this.options.csvNames
			});
		}
		
		this.getCsvBase64 = function(isTree) {
			if(!this.options.fields && !this.options.csv) return;
			
			return _.csvToBase64(this.getCsv(isTree));
		}

        this.downloadCsv = function(name, isTree) {
            if(_.typeCheck("string", name)) {
                name = name.split(".")[0];
            }

            var a = document.createElement('a');
            a.download = (name) ? name + ".csv" : "table.csv";
            a.href = this.getCsvBase64(isTree);

            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }

		this.activeIndex = function() { // 활성화된 확장/수정/선택 상태의 로우 인덱스를 리턴
			return rowIndex;
		}
	}

    UI.setup = function() {
        return {
            fields: null,
            csv: null,
            csvNames: null,
            csvNumber: null,
            data: [],
            rows: null, // @Deprecated
            colshow: false,
            scroll: false,
            scrollHeight: 200,
            width: 0,
            expand: false,
            expandEvent: true,
            editCell: false,
            editRow: false,
            editEvent: true,
            resize: false,
            sort: false,
            sortIndex: null,
            sortOrder: "asc",
            sortEvent: true,
            animate: false // @Deprecated
        }
    }
	
	return UI;
});
jui.define("uix.tree.node", [ "jquery" ], function($) {
    /**
     * @class uix.tree.node
     * implements Tree's Node
     * @extends core
     * @alias TreeNode
     * @requires jquery
     *
     */
    var Node = function(data, tplFunc) {
        var self = this;

        /**
         * Public Properties
         *
         */
        this.data = data;			// 해당 노드의 데이터
        this.element = null;		// 해당 노드의 엘리먼트
        this.index = null;			// 계층적 구조를 수용할 수 있는 키값
        this.nodenum = null;		// 현재 뎁스에서의 인덱스 키값

        this.parent = null;			// 부모 노드
        this.children = [];		// 자식 노드들
        this.depth = 0;				// 해당 노드의 뎁스

        this.type = "open";


        /**
         * Private Methods
         *
         */
        function setIndex(nodenum) {
            self.nodenum = (!isNaN(nodenum)) ? nodenum : self.nodenum;

            if(self.parent) {
                if(self.parent.index == null) self.index = "" + self.nodenum;
                else self.index = self.parent.index + "." + self.nodenum;
            }

            // 뎁스 체크
            if(self.parent && typeof(self.index) == "string") {
                self.depth = self.index.split(".").length;
            }

            // 자식 인덱스 체크
            if(self.children.length > 0) {
                setIndexChild(self);
            }
        }

        function setIndexChild(node) {
            var clist = node.children;

            for(var i = 0; i < clist.length; i++) {
                clist[i].reload(i);

                if(clist[i].children.length > 0) {
                    setIndexChild(clist[i]);
                }
            }
        }

        function getElement() {
            if(!tplFunc) return self.element;

            try {
                var element = $(tplFunc(
                        $.extend({ node: { index: self.index, data: self.data, depth: self.depth } }, self.data))
                ).get(0);
            } catch(e) {
                console.log(e);
            }

            return element;
        }

        function removeChildAll(node) {
            $(node.element).remove();

            for(var i = 0; i < node.children.length; i++) {
                var cNode = node.children[i];

                if(cNode.children.length > 0) {
                    removeChildAll(cNode);
                } else {
                    $(cNode.element).remove();
                }
            }
        }

        function reloadChildAll(node) {
            for(var i = 0; i < node.children.length; i++) {
                var cNode = node.children[i];
                cNode.reload(i);

                if(cNode.children.length > 0) {
                    reloadChildAll(cNode);
                }
            }
        }


        /**
         * Public Methods
         *
         */
        this.reload = function(nodenum, isUpdate) {
            setIndex(nodenum); // 노드 인덱스 설정

            if(this.element != null) {
                var newElem = getElement();

                if(!isUpdate) {
                    $(this.parent.element).children("ul").append(newElem);
                } else {
                    $(newElem).insertAfter(this.element);
                }

                $(this.element).remove();

                this.element = newElem;
            } else {
                this.element = getElement();
            }
        }


        this.reloadChildrens = function() {
            reloadChildAll(this);
        }

        this.destroy = function() {
            if(this.parent != null) { // 부모가 있을 경우, 연결관계 끊기
                this.parent.removeChild(this.index);
            } else {
                removeChildAll(this);
                $(this.element).remove();
            }
        }

        this.isLeaf = function() {
            return (this.children.length == 0) ? true : false;
        }

        this.fold = function() {
            $(this.element).children("ul").hide();
            this.type = "fold";
        }

        this.open = function() {
            $(this.element).children("ul").show();
            this.type = "open";
        }

        this.appendChild = function(node) {
            $(this.element).children("ul").append(node.element);
            this.children.push(node);
        }

        this.insertChild = function(nodenum, node) {
            if(nodenum == 0) {
                if(this.children.length == 0) {
                    $(this.element).children("ul").append(node.element);
                } else {
                    $(node.element).insertBefore(this.children[0].element);
                }
            } else {
                $(node.element).insertAfter(this.children[nodenum - 1].element);
            }

            var preNodes = this.children.splice(0, nodenum);
            preNodes.push(node);

            this.children = preNodes.concat(this.children);
            reloadChildAll(this);
        }

        this.removeChild = function(index) {
            for(var i = 0; i < this.children.length; i++) {
                var node = this.children[i];

                if(node.index == index) {
                    this.children.splice(i, 1); // 배열에서 제거
                    removeChildAll(node);
                }
            }

            reloadChildAll(this);
        }

        this.lastChild = function() {
            if(this.children.length > 0)
                return this.children[this.children.length - 1];

            return null;
        }

        this.lastChildLeaf = function(lastRow) {
            var row = (!lastRow) ? this.lastChild() : lastRow;

            if(row.isLeaf()) return row;
            else {
                return this.lastChildLeaf(row.lastChild());
            }
        }
    }

    return Node;
});


jui.define("uix.tree.base", [ "jquery", "util.base", "uix.tree.node" ], function($, _, Node) {
    /**
     * @class uix.tree.base
     * implements Tree Base
     * @extends core
     * @alias TreeBase
     * @requires jquery
     * @requires util.base
     * @requires uix.tree.node
     *
     */
    var Base = function(handler) {
        var self = this, root = null;

        var $obj = handler.$obj,
            $tpl = handler.$tpl;

        var iParser = _.index();

        /**
         * Private Methods
         *
         */
        function createNode(data, no, pNode) {
            var node = new Node(data, $tpl.node);

            node.parent = (pNode) ? pNode : null;
            node.reload(no);

            return node;
        }

        function setNodeChildAll(dataList, node) {
            var c_nodes = node.children;

            if(c_nodes.length > 0) {
                for(var i = 0; i < c_nodes.length; i++) {
                    dataList.push(c_nodes[i]);

                    if(c_nodes[i].children.length > 0) {
                        setNodeChildAll(dataList, c_nodes[i]);
                    }
                }
            }
        }

        function getNodeChildLeaf(keys, node) {
            if(!node) return null;
            var tmpKey = keys.shift();

            if(tmpKey == undefined) {
                return node;
            } else {
                return getNodeChildLeaf(keys, node.children[tmpKey]);
            }
        }

        function insertNodeDataChild(index, data) {
            var keys = iParser.getIndexList(index);

            var pNode = self.getNodeParent(index),
                nodenum = keys[keys.length - 1];
            node = createNode(data, nodenum, pNode);

            // 데이터 갱신
            pNode.insertChild(nodenum, node);

            return node;
        }

        function appendNodeData(data) {
            if(root == null) {
                root = createNode(data);;
                $obj.tree.append(root.element);
            } else {
                var node = createNode(data, root.children.length, root);
                root.appendChild(node);
            }

            return node;
        }

        function appendNodeDataChild(index, data) {
            var pNode = self.getNode(index),
                cNode = createNode(data, pNode.children.length, pNode);

            pNode.appendChild(cNode);

            return cNode;
        }

        function isRelative(node, targetNode) {
            var nodeList = [];

            while(true) {
                var tNode = targetNode.parent;

                if(tNode) {
                    nodeList.push(tNode);
                    targetNode = tNode;
                } else {
                    break;
                }
            }

            for(var i = 0; i < nodeList.length; i++) {
                if(node == nodeList[i]) {
                    return true;
                }
            }

            return false;
        }


        /**
         * Public Methods
         *
         */
        this.appendNode = function() {
            var index = arguments[0], data = arguments[1];

            if(!data) {
                return appendNodeData(index);
            } else {
                return appendNodeDataChild(index, data);
            }
        }

        this.insertNode = function(index, data) {
            if(root.children.length == 0 && parseInt(index) == 0) {
                return this.appendNode(data);
            } else {
                return insertNodeDataChild(index, data);
            }
        }

        this.updateNode = function(index, data) {
            var node = this.getNode(index);

            for(var key in data) {
                node.data[key] = data[key];
            }

            node.reload(node.nodenum, true);
            node.reloadChildrens();

            return node;
        }

        this.removeNode = function(index) {
            this.getNode(index).destroy();
        }

        this.removeNodes = function() {
            var nodes = root.children;

            if(nodes.length > 0) {
                var node = nodes.pop();

                node.parent = null;
                node.destroy();

                this.removeNodes();
            }
        }

        this.openNode = function(index) {
            if(index == null) this.getRoot().open();
            else this.getNode(index).open();
        }

        this.foldNode = function(index) {
            if(index == null) this.getRoot().fold();
            else this.getNode(index).fold();
        }

        this.openNodeAll = function(index) {
            var nodeList = this.getNodeAll(index);

            for(var i = 0; i < nodeList.length; i++) {
                nodeList[i].open();
            }

            if(index == null) this.getRoot().open();
        }

        this.foldNodeAll = function(index) {
            var nodeList = this.getNodeAll(index);

            for(var i = 0; i < nodeList.length; i++) {
                nodeList[i].fold();
            }

            if(index == null) this.getRoot().fold();
        }

        this.moveNode = function(index, targetIndex) {
            if(index == targetIndex) return;

            var node = this.getNode(index),
                tpNode = this.getNodeParent(targetIndex);
            var indexList = iParser.getIndexList(targetIndex);
            tNo = indexList[indexList.length - 1];

            if(!isRelative(node, tpNode)) {
                // 기존의 데이터
                node.parent.children.splice(node.nodenum, 1);
                node.parent.reloadChildrens();
                node.parent = tpNode;

                // 이동 대상 데이터 처리
                var preNodes = tpNode.children.splice(0, tNo);
                preNodes.push(node);

                tpNode.children = preNodes.concat(tpNode.children);
                tpNode.reloadChildrens();
            }
        }

        this.getNode = function(index) {
            if(index == null) return root.children;
            else {
                var nodes = root.children;

                if(iParser.isIndexDepth(index)) {
                    var keys = iParser.getIndexList(index);
                    return getNodeChildLeaf(keys, nodes[keys.shift()]);
                } else {
                    return (nodes[index]) ? nodes[index] : null;
                }
            }
        }

        this.getNodeAll = function(index) {
            var dataList = [],
                tmpNodes = (index == null) ? root.children : [ this.getNode(index) ];

            for(var i = 0; i < tmpNodes.length; i++) {
                if(tmpNodes[i]) {
                    dataList.push(tmpNodes[i]);

                    if(tmpNodes[i].children.length > 0) {
                        setNodeChildAll(dataList, tmpNodes[i]);
                    }
                }
            }

            return dataList;
        }

        this.getNodeParent = function(index) { // 해당 인덱스의 부모 노드를 가져옴 (단, 해당 인덱스의 노드가 없을 경우)
            var keys = iParser.getIndexList(index);

            if(keys.length == 1) {
                return root;
            } else if(keys.length == 2) {
                return this.getNode(keys[0]);
            } else if(keys.length > 2) {
                keys.pop();
                return this.getNode(keys.join("."));
            }
        }

        this.getRoot = function() {
            return root;
        }
    }

    return Base;
});


jui.defineUI("uix.tree", [ "util.base", "uix.tree.base" ], function(_, Base) {

    /**
     * @class uix.tree
     * implements Tree Component
     * @extends core
     * @alias Tree
     * @requires util.base
     * @requires uix.tree.base
     *
     */
	var UI = function() {
		var dragIndex = { start: null, end: null },
            nodeIndex = null,
			iParser = _.index();
		
		/**
		 * Private Methods
		 * 
		 */
		function setNodeStatus(self, nodeList) {
			for(var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i];
				$(node.element).removeClass("open fold leaf last");
				
				if(node.parent && node.isLeaf()) {
					$(node.element).addClass("leaf");
				} else {
					if(node.type == "open") {
						$(node.element).addClass("open");
						node.open();
					} else {
						$(node.element).addClass("fold");
						node.fold();
					}
				}
				
				if(!node.parent) {
					$(node.element).addClass("root");
				} else {
					if(node.parent.lastChild() == node) {
						$(node.element).addClass("last");
					}
				}
				
				$(node.element).children("i:first-child").remove();
				$(node.element).prepend($("<i></i>"));
			}
		}
		
		function toggleNode(self, index, callback) {
			if(index == null) {
				if(self.options.rootHide) {
					var childs = self.uit.getRoot().children;
					
					for(var i = 0; i < childs.length; i++) {
						callback(childs[i].index);
					}
					
					reloadUI(self,  false);
				} else {
					callback(index);
					reloadUI(self,  true);
				}
			} else {
				callback(index);
				reloadUI(self,  false);
			}
		}
		
		function setEventNodes(self, nodeList) {
			for(var i = 0; i < nodeList.length; i++) {
				(function(node) {
					var $elem = $(node.element);
					
					self.addEvent($elem.children("i:first-child"), "click", function(e) {
						if(node.type == "open") {
							self.fold(node.index, e);
						} else {
							self.open(node.index, e);
						}
						
						e.stopPropagation();
					});
					
					self.addEvent($elem.children("a,span,div")[0], "click", function(e) {
						self.emit("select", [ node, e ]);
						e.stopPropagation();
					});
				})(nodeList[i]);
			}
		}
		
		function setEventDragNodes(self, nodeList) {
			if(!self.options.drag) return;
			
			var root = self.uit.getRoot();
			$("body").off("mousemove").off("mouseup");

			for(var i = 0; i < nodeList.length; i++) {
				(function(node) {
					$(node.element).off("mousedown").off("mouseup");
					
					self.addEvent(node.element, "mousedown", function(e) {
						if(e.target.tagName == "I") return;
						
						if(dragIndex.start == null) {
							dragIndex.start = node.index;
							self.emit("dragstart", [ node.index, e ]);
						}
						
						return false;
					});

					self.addEvent(node.element, "mouseup", function(e) {
						if(e.target.tagName == "I") return;
						
						if(self.options.dragChild !== false) {
							if(dragIndex.start && dragIndex.start != node.index) {
								var cNode = node.lastChild(),
									endIndex = (cNode) ? iParser.getNextIndex(cNode.index) : node.index + ".0";
								
								self.move(dragIndex.start, endIndex);
								self.emit("dragend", [ endIndex, e ]);
							}
						}
						
						dragIndex.start = null;
						dragIndex.end = null;
						
						return false;
					});

					self.addEvent(root.element, "mouseup", function(e) {
						if(e.target.tagName == "I") return;

						if(self.options.dragChild !== false) {
							if(dragIndex.start) {
								var endIndex = "" + root.children.length;
								
								self.move(dragIndex.start, endIndex);
								self.emit("dragend", [ endIndex, e ]);
							}
						}
						
						dragIndex.start = null;
						dragIndex.end = null;
						
						return false;
					});
				})(nodeList[i]);
			}
			
			self.addEvent("body", "mouseup", function(e) {
				if(dragIndex.start && dragIndex.end) {
					self.move(dragIndex.start, dragIndex.end);
					self.emit("dragend", [ dragIndex.end, e ]);
				}
				
				dragIndex.start = null;
				dragIndex.end = null;
				
				return false;
			});
		}
		
		function setDragNodes(self) {
			if(!self.options.drag) return;
			
			$(self.root).find(".drag").remove();
			var nodeList = self.listAll();
			
			for(var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i],
					pos = $(node.element).position();
				
				if(pos.top > 0) { // top이 0이면, hide된 상태로 간주
					addDragElement(self, node, pos);
				}
			}
		}

		function setDragLastNodes(self) {
			if(!self.options.drag) return;
			var nodeList = self.listAll();
			
			for(var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i],
				pos = $(node.element).position();
				
				if(pos.top > 0 && node.parent) { // top이 0이면, hide된 상태로 간주
					if(node.parent.lastChild() == node) {
						pos.top = pos.top + $(node.element).outerHeight();
						addDragElement(self, node, pos, true);
					}
				}
			}
		}
		
		function addDragElement(self, node, pos, isLast) {
			if(!self.options.drag) return;
			
			var index = (isLast) ? iParser.getNextIndex(node.index) : node.index;
			var $drag = $("<div class='drag'></div>")
				.attr("data-index", index)
				.css(pos)
				.outerWidth($(node.element).outerWidth());

			$(self.root).append($drag);
			
			self.addEvent($drag, "mouseover", function(e) {
				if(dragIndex.start) {
					dragIndex.end = index;
					$drag.addClass("on");
				}
			});

			self.addEvent($drag, "mouseout", function(e) {
				if(dragIndex.start) {
					$drag.removeClass("on");
				}
			});
		}
		
		function reloadUI(self, isRoot) {
			var nodeList = self.listAll();
			
			setNodeStatus(self, nodeList);
			setEventNodes(self, nodeList);
			setEventDragNodes(self, nodeList);
			setDragNodes(self); // 차후에 개선
			setDragLastNodes(self);
			
			if(isRoot) {
				setNodeStatus(self, [ self.uit.getRoot() ]);
				setEventNodes(self, [ self.uit.getRoot() ]);
			}
		}
		
		
		/**
		 * Public Methods
		 *
		 */
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// UITable 객체 생성
			this.uit = new Base({ $obj: { tree: $(this.root) }, $tpl: this.tpl }); // 신규 테이블 클래스 사용
			
			// 루트 데이터 처리
			if(opts.root) {
				this.uit.appendNode(opts.root);
				reloadUI(this, true);
			} else {
				throw new Error("JUI_CRITICAL_ERROR: root data is required");
			}
			
			// 루트 숨기기
			if(opts.rootHide) {
				var root = this.uit.getRoot();
				
				$(root.element).css("padding-left", "0px");
				$(root.element).children("*:not(ul)").hide();
			}
			
			// 루트 접기
			if(opts.rootFold) {
				this.fold();
			}
		}
		
		this.update = function(index, data) {
            var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
                index = (arguments.length == 2) ? arguments[0] : null;

            if(index != null) {
                this.uit.updateNode(index, dataList);
            } else {
                var iParser = _.index();

                // 전체 로우 제거
                this.uit.removeNodes();

                // 트리 로우 추가
                for(var i = 0; i < dataList.length; i++) {
                    var pIndex = iParser.getParentIndex(dataList[i].index);

                    if(pIndex == null) {
                        this.uit.appendNode(dataList[i].data);
                    } else {
                        this.uit.appendNode(pIndex, dataList[i].data);
                    }
                }
            }

            reloadUI(this);
		}

		this.append = function() {
			var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
				index = (arguments.length == 2) ? arguments[0] : null;
				
			dataList = (dataList.length == undefined) ? [ dataList ] : dataList;
			
			for(var i = 0; i < dataList.length; i++) {
				if(index != null) this.uit.appendNode(index, dataList[i]);
				else this.uit.appendNode(dataList[i]);
			}
			
			reloadUI(this); // 차후에 개선
		}
		
		this.insert = function(index, data) {
			var dataList = (data.length == undefined) ? [ data ] : data;
			
			for(var i = 0; i < dataList.length; i++) {
				this.uit.insertNode(index, dataList[i]);
			}
			
			reloadUI(this); // 차후에 개선
		}
		
		this.select = function(index) {
			var node = (index == null) ? this.uit.getRoot() : this.get(index);
			
			$(this.root).find("li").removeClass("active");
			$(node.element).addClass("active");

            nodeIndex = index;
			return node;
		}

        this.unselect = function() {
            if(nodeIndex == null) return;
            var node = this.get(nodeIndex);

            $(node.element).removeClass("active");
            nodeIndex = null;

            return node;
        }
		
		this.remove = function(index) {
			this.uit.removeNode(index);
			reloadUI(this); // 차후에 개선
		}
		
		this.reset = function() {
			this.uit.removeNodes();
			reloadUI(this); // 차후에 개선
		}
		
		this.move = function(index, targetIndex) {
			this.uit.moveNode(index, targetIndex);
			reloadUI(this); // 차후에 개선
		}
		
		this.open = function(index, e) { // 로트 제외, 하위 모든 노드 대상
			if(index == null && this.options.rootHide) return;
			var isRoot = (index == null);
			
			this.uit.openNode(index);
			reloadUI(this, isRoot); // 차후에 개선

			this.emit("open", [ (isRoot) ? this.uit.getRoot() : this.get(index), e ]);
		}
		
		this.fold = function(index, e) {
			if(index == null && this.options.rootHide) return;
			var isRoot = (index == null);

			this.uit.foldNode(index);
			reloadUI(this, isRoot); // 차후에 개선
			
			this.emit("fold", [ (isRoot) ? this.uit.getRoot() : this.get(index), e ]);
		}
		
		this.openAll = function(index) { // 로트 포함, 하위 모든 노드 대상
			var self = this,
				isRoot = (index == null);
			
			toggleNode(this, index, function(i) {
				self.uit.openNodeAll(i);
			});

			this.emit("openall", [ (isRoot) ? this.uit.getRoot() : this.get(index) ]);
		}

		this.foldAll = function(index) {
			var self = this,
				isRoot = (index == null);

			toggleNode(this, index, function(i) {
				self.uit.foldNodeAll(i);
			});

			this.emit("foldall", [ (isRoot) ? this.uit.getRoot() : this.get(index) ]);
		}
		
		this.list = function() {
			return this.uit.getNode();
		}

		this.listAll = function() {
			return this.uit.getNodeAll();
		}
		
		this.listParents = function(index) {
			var node = this.get(index),
				parents = [];
			
			if(node.parent) {
				addParent(node.parent);
			}
			
			function addParent(node) {
				if(node.index != null) {
					parents.push(node);
					
					if(node.parent != null) {
						addParent(node.parent);
					}
				}
			}
			
			return parents.reverse();
		}

		this.get = function(index) {
			if(index == null) return null;
			return this.uit.getNode(index);
		}

		this.getAll = function(index) {
			if(index == null) return null;
			return this.uit.getNodeAll(index);
		}

        this.activeIndex = function() {
            return nodeIndex;
        }
	}

    UI.setup = function() {
        return {
            root: null,
            rootHide: false,
            rootFold: false,
            drag: false,
            dragChild: true
        }
    }
	
	return UI;
});
jui.defineUI("uix.window", [ "jquery", "util.base", "ui.modal" ], function($, _, modal) {

    /**
     * @class uix.window
     * The window is a layer component that can replace pop-ups
     *
     * @extends core
     * @alias Window
     * @requires jquery
     * @requires util.base
     * @requires ui.modal
     *
     */
	var UI = function() {
		var z_index = 2000,
			target = null,
			move = {},
			resize = {},
			info = {},
			ui_modal = null;

		function setBodyResize() {
			var bottom = (info.$foot.length < 1) ? 5 : info.$foot.outerHeight();
			info.$body.outerHeight(info.$root.outerHeight() - info.$head.outerHeight() - bottom);
		}

		this.init = function() {
			var self = this, opts = this.options;
			
			var $win_root = $(this.root),
				$win_head = $(this.root).children(".head"),
				$win_body = $(this.root).children(".body"),
				$win_foot = $(this.root).children(".foot");
				
			// 옵션 예외 처리
			if(opts.modal) {
				opts.move = false;
				opts.resize = false;
			}
				
			// UI 객체 추가
			info = { $root: $win_root, $head: $win_head, $body: $win_body, $foot: $win_foot };
			
			// 기본 스타일 & Modal 스타일 & Body로 강제 이동
			$win_root.css($.extend({ position: "absolute" }, opts)).appendTo($("body"));
			
			// 윈도우 이동
			if(opts.move) {
				this.addEvent($win_head, "mousedown", function(e) {
					target = $win_root;
					
					move.check = true;
					move.disX = e.pageX - target.offset().left;
					move.disY = e.pageY - target.offset().top;
				});
			}
			
			// 윈도우 리사이징
			if(opts.resize) {
				$win_root.append("<i class='icon-resize resize'></i>");
				
				this.addEvent($win_root.children(".resize"), "mousedown", function(e) {
					target = $win_root;
					
					resize.check = true;
					resize.disX = target.width() + target.offset().left;
					resize.disWidth = target.width();
					resize.disY = target.height() + target.offset().top;
					resize.disHeight = target.height();
					
					return false;
				});
			}
			
			// 윈도우 포커스
			if(!opts.modal) {
				self.addEvent($win_root, "mousedown", function(e) {
					$win_root.css("z-index", ++z_index);
					e.stopPropagation();
				});
			}

			// 윈도우 숨기기
			this.addEvent($win_head.find(".close"), "click", function(e) {
				self.hide();
				return false;
			});
			
			this.addEvent("body", "mousemove", function(e) {
				// 윈도우 이동
				if(move.check) {
					var x = e.pageX - move.disX;
					var y = e.pageY - move.disY;
					
					$(target).css({ left: x + "px", top: y + "px" });
				}

				// 윈도우 리사이징
				if(resize.check) {
					var resizeX = e.pageX - resize.disX,
						resizeY = e.pageY - resize.disY;
					
					target.width(resize.disWidth + resizeX);
					target.height(resize.disHeight + resizeY);
					
					setBodyResize();
				}
			});
			
			this.addEvent("body", "mouseup", function(e) {
				if(move.check) self.emit("move", e); 
				if(resize.check) self.emit("resize", e);
				
				move.check = false;
				resize.check = false;
			});
			
			// 기본 타입 설정
			this.type = "hide";
			$win_root.hide();

			// 모달 컴포넌트 설정
			if(opts.modal) {
				var modalOpts = (opts.modalIndex > 0) ? { index: opts.modalIndex } : {};
				ui_modal = modal(self.root, $.extend({ autoHide: false }, modalOpts));
			}
		}

        /**
         * @method hide
         * Hides a window
         */
		this.hide = function() {
			if(ui_modal) ui_modal.hide();
			else info.$root.hide();
			
			this.emit("hide");
			this.type = "hide";
		}

        /**
         * @method show
         * Shows a window at specified coordinates
         *
         * @param {Integer} x
         * @param {Integer} y
         */
		this.show = function(x, y) {
			if(ui_modal) ui_modal.show();
			else info.$root.show();
			
			if(x || y) this.move(x, y);
			
			this.emit("show");
			this.type = "show";

			setBodyResize();
		}

        /**
         * @method move
         * Moves a window at specified coordinates
         *
         * @param {Integer} x
         * @param {Integer} y
         */
		this.move = function(x, y) {
			info.$root.css("left", x);
			info.$root.css("top", y);
		}

        /**
         * @method update
         * Changes the markup in the body area of a window
         *
         * @param {String} html
         */
		this.update = function(html) {
			info.$body.empty().html(html);
		}

        /**
         * @method setTitle
         * Changes the markup of the title tag in the head area of a window
         *
         * @param {String} title
         */
		this.setTitle = function(html) {
			info.$head.find(".title").empty().html(html);
		}

        /**
         * @method setSize
         * Changes the horizontal/vertical size of a window
         *
         * @param {Integer} width
         * @param {Integer} height
         */
		this.setSize = function(w, h) {
			info.$root.width(w);
			info.$root.height(h);
			
			setBodyResize();
		}

        /**
         * @method resize
         * Designates a scroll area if there is a lot of content in the window body area
         */
		this.resize = function() {
			setBodyResize();
		}

        /**
         * @method resizeModal
         * Re-adjust the location of a modal window
         */
        this.resizeModal = function() {
            if(!ui_modal) return;

            ui_modal.resize();
        }
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {Integer} [width=400]
             * Determines the horizontal size of a window
             */
			width: 400,

            /**
             * @cfg {Integer} [height=300]
             * Determines the height of a window
             */
			height: 300,

            /**
             * @cfg {String/Integer} [left="auto"]
             * Determines the X coordinate of a window
             */
			left: "auto",

            /**
             * @cfg {String/Integer} [top="auto"]
             * Determines the Y coordinate of a window
             */
			top: "auto",

            /**
             * @cfg {String/Integer} [right="auto"]
             * Determines the X coordinate based on the right side of a window
             */
			right: "auto",

            /**
             * @cfg {String/Integer} [bottom="auto"]
             * Determines the Y coordinate based on the bottom side of a window
             */
			bottom: "auto",

            /**
             * @cfg {Boolean} [modal=false]
             * Applies a modal UI to a window
             */
			modal: false,

            /**
             * @cfg {Boolean} [move=true]
             * It is possible to move a window
             */
			move: true,

            /**
             * @cfg {Boolean} [resize=true]
             * It is possible to resize a window
             */
			resize: true,

            /**
             * @cfg {Integer} [modalIndex=0]
             * Determines the z-index property of a modal UI
             */
			modalIndex: 0,

            /**
             * @cfg {Boolean} [animate=false]
             * Determines whether to use the animation effect of a UI
             *
             * @deprecated
             */
			animate: false
        }
    }

    /**
     * @event show
     * Event that occurs when a window is shown
     */

    /**
     * @event hide
     * Event that occurs when a window is hidden
     */

    /**
     * @event move
     * Event that occurs when a window is moved
     *
     * @param {EventObject} e The event object
     */

    /**
     * @event resize
     * Event that occurs when a window is resized
     *
     * @param {EventObject} e The event object
     */
	
	return UI;
});
jui.defineUI("uix.xtable", [ "jquery", "util.base", "ui.modal", "uix.table" ], function($, _, modal, table) {
	var p_type = null;

	/**
	 * Common Logic
	 * 
	 */
	_.resize(function() {
		var call_list = jui.get("uix.xtable");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i];
			
			for(var j = 0; j < ui_list.length; j++) {
				ui_list[j].resize();
			}
		}
	}, 1000);

    /**
     * @class uix.xtable
     * implements XTable for Large Data
     * @extends core
     * @alias XTable
     * @requires util.base
     * @requires ui.modal
     * @requires uix.table
     *
     */
	var UI = function() {
		var head = null, body = null;
		var rows = [], o_rows = null;
		var ui_modal = null, page = 1;
        var is_loading = false, is_resize = false;
		
		
		/**
		 * Private Methods
		 * 
		 */
		function createTableList(self) { // 2
			var exceptOpts = [ 
               "buffer", "bufferCount", "csvCount", "sortLoading", "sortCache", "sortIndex", "sortOrder",
               "event", "rows", "scrollWidth", "width"
            ];
			
			body = table($(self.root).children("table"), getExceptOptions(self, exceptOpts.concat("resize"))); // 바디 테이블 생성
			setTableBodyStyle(self, body); // X-Table 생성 및 마크업 설정
			
			head = table($(self.root).children("table.head"), getExceptOptions(self, exceptOpts)); // 헤더 테이블 생성
			setTableAllStyle(self, head, body);
			
			// 테이블 옵션 필터링 함수
			function getExceptOptions(self, exceptOpts) {
				var options = {};
				
				for(var key in self.options) {
					if($.inArray(key, exceptOpts) == -1) {
						options[key] = self.options[key];
					}
				}
				
				return options;
			}
			
			function setTableAllStyle(self, head, body) {
				var opts = self.options;

				$(self.root).css({ "position": "relative" });

				$(head.root).css({
					"position": "absolute",
					"top": "0",
					"border-bottom-width": "0",
					"margin": "0"
				});

				$(body.root).css({
					"margin": "0"
				});
				
				if(opts.width > 0) {
					$(self.root).outerWidth(opts.width);
				}
				
				if(opts.scrollWidth > 0) {
					var rootWidth = $(self.root).outerWidth();
					
					$(self.root).css({
						"max-width": self.options.scrollWidth,
						"overflow-x": "auto",
                        "overflow-y": "hidden"
					});
					
					$(head.root).outerWidth(rootWidth);
					$(body.root).parent().outerWidth(rootWidth);
				}
			}
			
			function setTableBodyStyle(self, body) {
				var $table =  $(body.root).clone(),
					cols = body.listColumn();
				
				// X-Table 바디 영역 스크롤 높이 설정
				if(self.options.buffer != "page") 
					$(body.root).wrap("<div class='body' style='max-height: " + self.options.scrollHeight + "px'></div>");
				else
					$(body.root).wrap("<div class='body'></div>");

                // X-Table 바디 영역의 헤더라인은 마지막 노드를 제외하고 제거
                $(body.root).find("thead > tr").outerHeight(0).not(":last-child").remove();

				// X-Table 헤더 영역 설정
				for(var i = 0; i < cols.length; i++) {
					var $elem = $(cols[i].element);

					$elem.html("").outerHeight(0).attr("style",
							$elem.attr("style") +
							"border-top-width: 0px !important;" +
							"border-bottom-width: 0px !important;" +
							"padding-top: 0px !important;" +
							"padding-bottom: 0px !important"
					);
				}
				
				// 바디 테이블의 tbody 영역 제거
				$table.children("tbody").remove();
				
				// 헤더와 바디 테이블 중간의 간격 정의 (스크롤 관련)
				$(self.root).append($table.addClass("head"));
				$(self.root).css("padding-top", $table.height());
			}
		}
		
		function setCustomEvent(self) {
			head.on("colresize", function(column, e) { // 컬럼 리사이징 관련
				var cols = head.listColumn(),
					bodyCols = body.listColumn(),
					isLast = false;
				
				for(var j = cols.length - 1; j >= 0; j--) {
					var hw = $(cols[j].element).outerWidth();
					
					// 조건 (스크롤, 컬럼보이기, 마지막컬럼)
					// 조건이 명확하지 않으니 차후에 변경
					if(self.options.buffer != "page" && cols[j].type == "show" && !isLast) {
						$(bodyCols[j].element).outerWidth("auto");
						isLast = true;
					} else {
						$(cols[j].element).outerWidth(hw);
						$(bodyCols[j].element).outerWidth(hw);
					}
				}
				
				self.emit("colresize", [ column, e ]);
			});
			
			head.on("colshow", function(column, e) {
				body.uit.showColumn(column.index);
				self.resize();
				self.emit("colshow", [ column, e ]);
			});
			
			head.on("colhide", function(column, e) {
				body.uit.hideColumn(column.index);
				self.resize();
				self.emit("colhide", [ column, e ]);
			});

            head.on("colclick", function(column, e) {
                self.emit("colclick", [ column, e ]);
            });

            head.on("coldblclick", function(column, e) {
                self.emit("coldblclick", [ column, e ]);
            });

			head.on("colmenu", function(column, e) {
				self.emit("colmenu", [ column, e ]);
			});
			
			head.on("sort", function(column, e) {
				self.sort(column.index, column.order, e);
				self.emit("sort", [ column, e ]);
				
				// 소팅 후, 현재 소팅 상태 캐싱 처리 
				if(self.options.sortCache) { 
					self.setOption({ sortIndex: column.index, sortOrder: column.order });
				}
			});
			
			body.on("select", function(obj, e) {
				self.emit("select", [ obj, e ]);
			});
			
			body.on("rowmenu", function(obj, e) {
				self.emit("rowmenu", [ obj, e ]);
			});
			
			body.on("expand", function(obj, e) {
				self.emit("expand", [ obj, e ]);
			});

			body.on("expandend", function(obj, e) {
				self.emit("expandend", [ obj, e ]);
			});
		}
		
		function setScrollEvent(self) {
			var $body = $(self.root).children(".body");
			
			$body.off("scroll").scroll(function(e) {
			    if((this.scrollTop + self.options.scrollHeight) >= $body.get(0).scrollHeight) {
		    		self.next();
			    	self.emit("scroll", e);
			    	
			    	return false;
			    }
			});
		}
		
        function setColumnResizeScroll(self) {
            var column = {},
                width = {},
                resizeX = 0;

            // 리사이즈 엘리먼트 삭제
            $(self.root).find("thead .resize").remove();

            for(var i = 0; i < head.uit.getColumnCount() - 1; i++) {
                var $colElem = $(head.getColumn(i).element),
                    $resizeBar = $("<div class='resize'></div>");
                var pos = $colElem.position();

                $resizeBar.css({
                    position: "absolute",
                    width: "8px",
                    height: $colElem.outerHeight(),
                    left: ($colElem.outerWidth() + (pos.left - 1)) + "px",
                    top: pos.top + "px",
                    cursor: "w-resize",
                    "z-index": "1"
                });

                $colElem.append($resizeBar);

                // Event Start
                (function(index) {
                    self.addEvent($resizeBar, "mousedown", function(e) {
                        if(resizeX == 0) {
                            resizeX = e.pageX;
                        }

                        // 컬럼 객체 가져오기
                        column = {
                            head: head.getColumn(index),
                            body: body.getColumn(index)
                        };

                        width = {
                            column: $(column.head.element).outerWidth(),
                            body: $(body.root).outerWidth()
                        };

                        is_resize = true;

                        return false;
                    });
                })(i);
            }

            self.addEvent("body", "mousemove", function(e) {
                if(resizeX > 0) {
                    colResizeWidth(e.pageX - resizeX);
                }
            });

            self.addEvent("body", "mouseup", function(e) {
                if(resizeX > 0) {
                    resizeX = 0;
                    is_resize = false;

                    // 리사이징 바, 위치 이동
                    colResizeBarLeft();

                    head.emit("colresize", [ column.head, e ]);

                    return false;
                }
            });

            // 리사이징 바 위치 설정
            head.on("colshow", colResizeBarLeft);
            head.on("colhide", colResizeBarLeft);

            function colResizeWidth(disWidth) {
                var colMinWidth = 30;

                // 최소 크기 체크
                if (width.column + disWidth < colMinWidth)
                    return;

                $(column.head.element).outerWidth(width.column + disWidth);
                $(column.body.element).outerWidth(width.column + disWidth);

                if (disWidth > 0) {
                    $(body.root).parent().outerWidth(width.body + disWidth);
                    $(head.root).outerWidth(width.body + disWidth);
                }
            }

            function colResizeBarLeft() {
                for(var i = 0; i < head.uit.getColumnCount() - 1; i++) {
                    var $colElem = $(head.getColumn(i).element);

                    $colElem.find(".resize").css("left", ($colElem.outerWidth() + $colElem.position().left) + "px");
                }
            }
        }
		

		/**
		 * Public Methods
		 * 
		 */
		
		this.init = function() {
			var opts = this.options;

            // @Deprecated, 'rows'는 의미상 맞지 않아 차후 삭제
            opts.data = (opts.rows != null) ? opts.rows : opts.data;

            // 루트가 테이블일 경우, 별도 처리
            if(this.root.tagName == "TABLE") {
                var $root = $(this.root).wrap("<div class='xtable'></div>");
                this.root = $root.parent().get(0);
            }

			// 기본 설정
			createTableList(this);
			setCustomEvent(this);
			
			// 스크롤/페이지-스크롤 옵션
			if(opts.buffer != "page") {
				var $body = $(this.root).children(".body");

				$body.css({
					"overflow-y": "scroll",
					"overflow-x": "hidden"
				});
				
				$body.children("table").css({
					"border-bottom-width": "0"
				});
			}
			
			// 스크롤 버퍼 이벤트
			if(opts.buffer == "scroll") {
				setScrollEvent(this);
			}
			
			// 데이터가 있을 경우
			if(opts.data) {
				this.update(opts.data);
			}
			
			// 로딩 템플릿 체크 (opts.sortLoading으로 체크하지 않음)
			if(opts.tpl.loading) {
				var $loading = $(opts.tpl.loading);
				$(this.root).append($loading);
				
				ui_modal = modal($loading, { 
					target: this.selector,
					opacity: 0.1,
					autoHide: false 
				});
				
				// 기본 로딩 시간 (ms)
				opts.sortLoading = (opts.sortLoading === true) ? 500 : opts.sortLoading; 
			}
			
			// 컬럼 리사이징 (기본)
			if(opts.resize) {
				head.resizeColumns();
				head.resize();
            }

            // 컬럼 리사이징 (가로스크롤)
            if(!opts.resize && opts.scrollWidth > 0) {
                setColumnResizeScroll(this);
            }
		}
		
		this.select = function(index) {
			return body.select(index);
		}
		
		this.update = function(dataList) {
			rows = dataList;
			
			this.clear();
			this.next();
			this.emit("update");
			head.emit("colresize");
			
			// 정렬 인덱스가 옵션에 있을 경우, 해당 인덱스의 컬럼 정렬 (not loading)
			if(this.options.sortIndex) {
				this.sort(this.options.sortIndex, this.options.sortOrder, undefined, true);
			}
		}
		
		this.next = function() {
			var start = (page - 1) * this.options.bufferCount,
				end = start + this.options.bufferCount;
			
			// 마지막 페이지 처리
			end = (end > rows.length) ? rows.length : end;
			
			if(end <= rows.length) { 
				var tmpDataList = [];
				for(var i = start; i < end; i++) {
					tmpDataList.push(rows[i]);
				}
				
				body.append(tmpDataList);
				this.emit("next", [ page ]);

				if(tmpDataList.length > 0) page++;
			}
		}
		
		this.page = function(pNo) {
			if(this.options.buffer == "scroll") return false;
			if(this.getPage() == pNo) return false;
			
			p_type = (page > pNo) ? "prev" : "next";
			this.clear();
			
			page = (pNo < 1) ? 1 : pNo;
			this.next();
		}
		
		this.sort = function(index, order, e, isNotLoading) { // index는 컬럼 key 또는 컬럼 name
			if(!this.options.fields || !this.options.sort || is_resize) return;
			
			var self = this, 
				column = head.getColumn(index);
			
			if(typeof(column.name) == "string") {			
				column.order = (order) ? order : (column.order == "asc") ? "desc" : "asc";
				head.uit.setColumn(index, column);
	
				if(this.options.sortLoading && !isNotLoading) {
					self.showLoading();
					
					setTimeout(function() {
						process();
					}, this.options.sortLoading);
				} else {
					process();
				}
			}
			
			// 정렬 프로세싱 함수
			function process() {
				var qs = _.sort(rows);
				
				if(column.order == "desc") {
					qs.setCompare(function(a, b) {
						return (getValue(a) > getValue(b)) ? true : false;
					});
				} else {
					qs.setCompare(function(a, b) {
						return (getValue(a) < getValue(b)) ? true : false;
					});
				}
				
				// 정렬
				qs.run();
				
				// 데이터 초기화 및 입력, 그리고 로딩
				self.emit("sortend", [ column, e ]);
				self.clear();
				self.next();
				self.hideLoading();
			}
			
		    // 해당 컬럼에 해당하는 값 가져오기
			function getValue(data) {
		    	var value = data[column.name];

                if(typeof(value) == "string") {
                    return value.toLowerCase();
                } else {
                    if(!isNaN(value) && value != null) {
                        return value;
                    }
                }
    			
    			return "";
		    }
		}

        this.filter = function(callback) {
            if(typeof(callback) != "function") return;

            if(o_rows == null) o_rows = rows;
            else rows = o_rows;

            var t_rows = rows.slice(),
                s_rows = [];

            for(var i = 0, len = t_rows.length; i < len; i++) {
                if(callback(t_rows[i]) === true) {
                    s_rows.push(t_rows[i]);
                }
            }

            this.update(s_rows);
            this.emit("filter", [ s_rows ]);
        }

        this.rollback = function() {
            if(o_rows != null) {
                this.update(o_rows);

                o_rows = null;
            }
        }
		
		this.clear = function() {
			page = 1;
			body.uit.removeRows();
			body.scroll();
		}
		
		this.reset = function() {
			this.clear();
			rows = [];
		}
		
		this.resize = function() {
			head.resizeColumns();
			head.resize();
			head.emit("colresize");
		}
		
		this.height = function(h) {
			if(this.options.buffer != "scroll") return;
			
			this.options.scrollHeight = h;
			$(this.root).find(".body").css("max-height", h + "px");
			
			setScrollEvent(this);
		}
		
		this.size = function() { // 차후 수정 (컬럼 * 로우 개수 * 바이트)
			return rows.length;
		}

		this.count = function() {
			return rows.length;
		}
		
		this.list = function() {
			return body.list();
		}
		
		this.listColumn = function() {
			return head.listColumn();
		}
		
		this.listData = function() {
			return rows;
		}
		
		this.get = function(index) {
			if(index == null) return null;
			return body.get(index);
		}
		
		this.getColumn = function(index) {
			return head.getColumn(index);
		}
		
		this.getData = function(index) {
			return rows[index];
		}
		
		this.showColumn = function(index) {
			head.showColumn(index);
		}
		
		this.hideColumn = function(index) {
			head.hideColumn(index);
		}
		
		this.initColumns = function(keys) {
			head.initColumns(keys);
			body.initColumns(keys);
			head.emit("colresize");
		}
		
		this.showColumnMenu = function(x) {
			head.showColumnMenu(x);
		}

        this.hideColumnMenu = function() {
            head.hideColumnMenu();
        }

        this.toggleColumnMenu = function(x) {
            head.toggleColumnMenu(x);
        }

		this.showExpand = function(index, obj) {
			body.showExpand(index, obj);
		}
		
		this.hideExpand = function(index) {
			if(index) body.hideExpand(index);
			else body.hideExpand();
		}
		
		this.getExpand = function() {
			return body.getExpand();
		}
		
		this.showLoading = function(delay) {
			if(!ui_modal || is_loading) return;
			
			ui_modal.show();
			is_loading = true;
			
			if(delay > 0) {
				var self = this;
				
				setTimeout(function() {
					self.hideLoading();
				}, delay);
			}
		}

		this.hideLoading = function() {
			if(!ui_modal || !is_loading) return;
			
			ui_modal.hide();
			is_loading = false;
		}
		
		this.setCsv = function(csv) {
            var opts = this.options;
			if(!opts.fields && !opts.csv) return;
			
			var fields = _.getCsvFields(opts.fields, opts.csv),
                csvNumber = (opts.csvNumber) ? _.getCsvFields(opts.fields, opts.csvNumber) : null;

			this.update(_.csvToData(fields, csv, csvNumber));
		}
		
		this.setCsvFile = function(file) {
			if(!this.options.fields && !this.options.csv) return;
			
			var self = this;
			_.fileToCsv(file, function(csv) {
	            self.setCsv(csv);
			});
		}
		
		this.getCsv = function() {
			if(!this.options.fields && !this.options.csv) return;
			
			var fields = _.getCsvFields(this.options.fields, this.options.csv),
				len = (rows.length > this.options.csvCount) ? this.options.csvCount : rows.length;

			return _.dataToCsv2({
				fields: fields,
				rows: rows,
				count: len,
				names: this.options.csvNames
			});
		}
		
		this.getCsvBase64 = function() {
			if(!this.options.fields && !this.options.csv) return;
			
			return _.csvToBase64(this.getCsv());
		}

        this.downloadCsv = function(name) {
            if(_.typeCheck("string", name)) {
                name = name.split(".")[0];
            }

            var a = document.createElement('a');
            a.download = (name) ? name + ".csv" : "table.csv";
            a.href = this.getCsvBase64();

            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }
		
		this.rowFunc = function(type, index, callback) {
			if(!this.options.fields) return;
			
			var isCallback = (typeof(callback) == "function") ? true : false;
			var result = 0,
				count = (isCallback) ? 0 : rows.length,
				column = head.getColumn(index);
			
			if(column.name) {
				for(var i = 0; i < rows.length; i++) {
					var value = rows[i][column.name];
					
					if(!isNaN(value)) {
						if(isCallback) {
							if(callback(rows[i])) {
								result += value;
								count++;
							}
						} else {
							result += value;
						}
					}
				}
			}
			
			// 현재는 합계와 평균만 지원함
			if(type == "sum") return result;
			else if(type == "avg") return result / count;
			
			return null;
		}
		
		this.getPage = function() {
			return page - 1;
		}
		
		this.activeIndex = function() {
			return body.activeIndex();
		}
	}

    UI.setup = function() {
        return {
			fields: null,
			csv: null,
			csvNames: null,
			csvNumber: null,
			csvCount: 10000,
			data: [],
			rows: null, // @Deprecated
			colshow: false,
			expand: false,
			expandEvent: true,
			resize: false,
			scrollHeight: 200,
			scrollWidth: 0,
			width: 0,
			buffer: "scroll",
			bufferCount: 100,
			sort: false,
			sortLoading: false,
			sortCache: false,
			sortIndex: null,
			sortOrder: "asc",
			sortEvent: true,
			animate: false // @Deprecated
        }
    }

	return UI;
});