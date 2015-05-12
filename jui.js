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
jui.define("chart.draw", [ "jquery", "util.base" ], function($, _) {
    /**
     * @class chart.draw
     *
     * Base Draw Class
     *
     * @alias Draw
     * @requires util.base
     * @requires jquery
     *
     */
	var Draw = function() {

        /**
         * @method drawBefore
         *
         * run before draw object
         *
         */

        /**
         * @method draw
         *
         * draw object
         *
         * @return {Object}
         *
         */

        /**
         * @method drawAfter
         *
         * run after draw object
         */

        /**
         * @method drawAnimate
         *
         * implements animate code after draw object
         */

		/**
		 * @method render
         *
         * 모든 Draw 객체는  render 함수를 통해서 그려진다.
		 * 
		 */
		this.render = function() {
            if(!_.typeCheck("function", this.draw) || !_.typeCheck("function", this.drawAfter)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw & drawAfter' method must be implemented");
            }

            // Call drawBefore method (All)
            if(_.typeCheck("function", this.drawBefore)) {
                this.drawBefore();
            }

            // Call draw method (All)
			var obj = this.draw();

            // Call drawAnimate method (All)
            if(_.typeCheck("function", this.drawAnimate)) {
                var draw = this.grid || this.brush || this.widget || this.map;

                if(draw.animate !== false) {
                    this.drawAnimate(obj);
                }
            }

            if(!_.typeCheck("object", obj)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method should return the object");
            } else {
                this.drawAfter(obj);
            }

            return obj;
		}

        /**
         * @method format
         * Get a default format callback of draw object.
         *
         * @return {Function}
         */
        this.format = function() {
            var draw = this.grid || this.brush || this.widget,
                callback = draw.format || this.chart.format;

            return callback.apply(this.chart, arguments);
        }

        /**
         * @method balloonPoints
         *
         * 말풍선 그리그 메소드
         *
         * @param {String} type
         * @param {Number} w
         * @param {Number} h
         * @param {Number} anchor
         * @return {String}
         */
        this.balloonPoints = function(type, w, h, anchor) {
            var points = [];

            if(type == "top") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, h ].join(","));
                points.push([ (w / 2) + (anchor / 2), h ].join(","));
                points.push([ (w / 2), h + anchor ].join(","));
                points.push([ (w / 2) - (anchor / 2), h ].join(","))
                points.push([ 0, h ].join(","));
                points.push([ 0, 0 ].join(","));
            } else if(type == "bottom") {
                points.push([ 0, anchor ].join(","));
                points.push([ (w / 2) - (anchor / 2), anchor ].join(","));
                points.push([ (w / 2), 0 ].join(","));
                points.push([ (w / 2) + (anchor / 2), anchor ].join(","));
                points.push([ w, anchor ].join(","));
                points.push([ w, anchor + h ].join(","))
                points.push([ 0, anchor + h ].join(","));
                points.push([ 0, anchor ].join(","));
            } else if(type == "left") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, (h / 2) - (anchor / 2) ].join(","));
                points.push([ w + anchor, (h / 2) ].join(","));
                points.push([ w, (h / 2) + (anchor / 2) ].join(","));
                points.push([ w, h ].join(","));
                points.push([ 0, h ].join(","));
                points.push([ 0, 0 ].join(","));
            } else if(type == "right") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, h ].join(","));
                points.push([ 0, h ].join(","));
                points.push([ 0, (h / 2) + (anchor / 2) ].join(","));
                points.push([ 0 - anchor, (h / 2) ].join(","));
                points.push([ 0, (h / 2) - (anchor / 2) ].join(","));
                points.push([ 0, 0 ].join(","));
            }

            return points.join(" ");
        }

        /**
         * @method on
         *
         * chart.on() 을 쉽게 사용 할 수 있게 해주는 유틸리티 함수
         *
         * @param {String} type event name
         * @param {Function} callback
         * @return {*}
         */
        this.on = function(type, callback) {
            var self = this;

            return this.chart.on(type, function() {
                if(_.startsWith(type, "axis.") && _.typeCheck("integer", self.axis.index)) {
                    var axis = self.chart.axis(self.axis.index),
                        e = arguments[0];

                    if (_.typeCheck("object", axis)) {
                        if (arguments[1] == self.axis.index) {
                            callback.apply(self, [ e ]);
                        }
                    }
                } else {
                    callback.apply(self, arguments);
                }
            }, "render");
        }
	}

    Draw.setup = function() {
        return {
            /** @cfg {String} [type=null] Specifies the type of a widget/brush/grid to be added.*/
            type: null,
            /** @cfg {Boolean} [animate=false] Run the animation effect.*/
            animate: false
        }
    }

	return Draw;
});

jui.define("chart.axis", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class chart.axis
     *
     * Axis 를 관리하는 클래스
     *
     * * x 축
     * * y 축
     * * area { x, y, width, height}
     * * data Axis 에 적용될 데이타
     *
     */
    var Axis = function(chart, originAxis, cloneAxis) {
        var self = this,
            map = null;
        var _area = {},
            _padding = {},
            _clipId = "",
            _clipPath = null,
            _clipRectId = "",
            _clipRect = null;

        function caculatePanel(a, padding) {

            a.x = getRate(a.x, chart.area('width'));
            a.y = getRate(a.y, chart.area('height'));
            a.width = getRate(a.width, chart.area('width'));
            a.height = getRate(a.height, chart.area('height'));

            a.x2 = a.x + a.width;
            a.y2 = a.y + a.height;
            
            // 패딩 개념 추가 
            a.x += padding.left || 0;
            a.y += padding.top || 0;
            
            a.x2 -= padding.right || 0;
            a.y2 -= padding.bottom || 0;
            
            a.width = a.x2 - a.x;
            a.height = a.y2 - a.y;

            return a;
        }

        function getRate(value, max) {
            if(_.typeCheck("string", value) && value.indexOf("%") > -1) {
                return max * (parseFloat(value.replace("%", "")) /100);
            }

            return value;
        }

        function drawGridType(axis, k) {
            if((k == "x" || k == "y") && !_.typeCheck("object", axis[k])) return null;

            // 축 위치 설정
            axis[k] = axis[k]  || {};

            if (k == "x") {
                axis[k].orient = axis[k].orient == "top" ? "top" : "bottom";
            } else if (k == "y") {
                axis[k].orient = axis[k].orient == "right" ? "right" : "left";
            } else if (k == "c") {
                axis[k].type = axis[k].type || "panel";
                axis[k].orient = "custom";
            }

            axis[k].type = axis[k].type || "block";
            var Grid = jui.include("chart.grid." + axis[k].type);

            // 그리드 기본 옵션과 사용자 옵션을 합침
            jui.defineOptions(Grid, axis[k]);

            // 엑시스 기본 프로퍼티 정의
            var obj = new Grid(chart, axis, axis[k]);
            obj.chart = chart;
            obj.axis = axis;
            obj.grid = axis[k];

            var elem = obj.render();

            // 그리드 별 위치 선정하기
            if(axis[k].orient == "left") {
                 elem.root.translate(chart.area("x") + self.area("x") - axis[k].dist, chart.area("y"));
            } else if(axis[k].orient == "right") {
                elem.root.translate(chart.area("x") + self.area("x2") + axis[k].dist, chart.area("y"));
            } else if(axis[k].orient == "bottom") {
                elem.root.translate(chart.area("x") , chart.area("y") + self.area("y2") + axis[k].dist);
            } else if(axis[k].orient == "top") {
                elem.root.translate(chart.area("x") , chart.area("y") + self.area("y") - axis[k].dist);
            } else {
                // custom
                if(elem.root) elem.root.translate(chart.area("x") + self.area("x"), chart.area("y") + self.area("y"));
            }

            elem.scale.type = axis[k].type;
            elem.scale.root = elem.root;

            return elem.scale;
        }

        var mapObj = null;

        function drawMapType(axis, k) {
            if(k == "map" && !_.typeCheck("object", axis[k])) return null;

            // 축 위치 설정
            axis[k] = axis[k]  || {};

            var Map = jui.include("chart.map");

            // 맵 기본 옵션과 사용자 옵션을 합침
            jui.defineOptions(Map, axis[k]);

            // 맵 객체는 한번만 생성함
            if(map == null) {
                map = new Map(chart, axis, axis[k]);
            }

            // 맵 기본 프로퍼티 설정
            map.chart = chart;
            map.axis = axis;
            map.map = axis[k];

            // 그리드 별 위치 선정하기
            var elem = map.render();
            elem.root.translate(chart.area("x") + self.area("x"), chart.area("y") + self.area("y"));
            elem.scale.type = axis[k].type;
            elem.scale.root = elem.root;
            
            return elem.scale;
        }
        
        function setScreen(pNo) {
            var dataList = self.origin,
                limit = self.buffer,
                maxPage = Math.ceil(dataList.length / limit);

            // 최소 & 최대 페이지 설정
            if(pNo < 1) {
                self.page = 1;
            } else {
                self.page = (pNo > maxPage) ? maxPage : pNo;
            }

            self.start = (self.page - 1) * limit, self.end = self.start + limit;

            // 마지막 페이지 처리
            if(self.end > dataList.length) {
                self.start = dataList.length - limit;
                self.end = dataList.length;
            }

            if(self.end <= dataList.length) {
                self.start = (self.start < 0) ? 0 : self.start;
                self.data = dataList.slice(self.start, self.end);

                if(dataList.length > 0) self.page++;
            }
        }

        function setZoom(start, end) {
            var dataList = self.origin;

            self.end = (end > dataList.length) ? dataList.length : end;
            self.start = (start < 0) ? 0 : start;
            self.data = dataList.slice(self.start, self.end);
        }

        function createClipPath() {
            // clippath with x, y
            if (_clipPath) {
                _clipPath.remove();
                _clipPath = null;
            }

            _clipId = _.createId("clip-id-");

            _clipPath = chart.svg.clipPath({
                id: _clipId
            }, function() {
                chart.svg.rect({
                    x: _area.x,
                    y: _area.y,
                    width: _area.width,
                    height: _area.height
                });
            });
            chart.appendDefs(_clipPath);

            // clippath without x, y
            if (_clipRect) {
                _clipRect.remove();
                _clipRect = null;
            }

            _clipRectId = _.createId("clip-rect-id-");

            _clipRect = chart.svg.clipPath({
                id: _clipRectId
            }, function() {
                chart.svg.rect({
                    x: 0,
                    y: 0,
                    width: _area.width,
                    height: _area.height
                });
            });

            chart.appendDefs(_clipRect);
        }

        function checkAxisPoint(e) {
            var top = self.area("y"),
                left = self.area("x");

            if((e.chartY > top && e.chartY < top + self.area("height")) &&
                (e.chartX > left && e.chartX < left + self.area("width"))) {

                e.axisX = e.chartX - left;
                e.axisY = e.chartY - top;

                return true;
            }

            return false;
        }

        function setAxisMouseEvent() {
            var isMouseOver = false,
                index = cloneAxis.index;

            chart.on("chart.mousemove", function(e) {
                if(checkAxisPoint(e)) {
                    if(!isMouseOver) {
                        chart.emit("axis.mouseover", [ e, index ]);
                        isMouseOver = true;
                    }
                } else {
                    if(isMouseOver) {
                        chart.emit("axis.mouseout", [ e, index ]);
                        isMouseOver = false;
                    }
                }

                chart.emit("axis.mousemove", [ e, index ]);
            });

            chart.on("bg.mousemove", function(e) {
                if(!checkAxisPoint(e) && isMouseOver) {
                    chart.emit("axis.mouseout", [ e, index ]);
                    isMouseOver = false;
                }
            });

            chart.on("chart.mousedown", function(e) {
                if(!checkAxisPoint(e)) return;
                chart.emit("axis.mousedown", [ e, index ]);
            });

            chart.on("chart.mouseup", function(e) {
                if(!checkAxisPoint(e)) return;
                chart.emit("axis.mouseup", [ e, index ]);
            });

            chart.on("chart.click", function(e) {
                if(!checkAxisPoint(e)) return;
                chart.emit("axis.click", [ e, index ]);
            });

            chart.on("chart.dbclick", function(e) {
                if(!checkAxisPoint(e)) return;
                chart.emit("axis.dbclick", [ e, index ]);
            });

            chart.on("chart.rclick", function(e) {
                if(!checkAxisPoint(e)) return;
                chart.emit("axis.rclick", [ e, index ]);
            });
        }

        function init() {
            _.extend(self, {
                data : cloneAxis.data,
                origin : cloneAxis.origin,
                buffer : cloneAxis.buffer,
                shift : cloneAxis.shift,
                index : cloneAxis.index,
                page : cloneAxis.page,
                start : cloneAxis.start,
                end : cloneAxis.end
            });

            // 원본 데이터 설정
            self.origin = self.data;

            // 페이지 초기화
            if(self.start > 0 || self.end > 0) {
                setZoom(self.start, self.end);
            } else {
                setScreen(self.page);
            }

            // 엑시스 이벤트 설정
            setAxisMouseEvent();

            // Grid 및 Area 설정
            self.reload(cloneAxis);
        }
        
        /**
         * @method getValue
         *
         * 특정 필드의 값을 맵핑해서 가지고 온다.
         *
         * @param {Object} data row data
         * @param {String} fieldString 필드 이름
         * @param {String/Number/Boolean/Object} [defaultValue=''] 기본값
         * @return {Mixed}
         */
        this.getValue = function(data, fieldString, defaultValue) {
            var value = data[cloneAxis.keymap[fieldString]];
            if (!_.typeCheck("undefined", value)) {
                return value;
            }

            value = data[fieldString];
            if (!_.typeCheck("undefined", value)) {
                return value;
            }
            
            return defaultValue;
        }

        /**
         * @method reload
         * 
         * Axis 의 x,y,z 축을 다시 생성한다. 
         * * * 
         * @param {Object} options
         */
        this.reload = function(options) {
            var area = chart.area();

            _.extend(this, {
                x : options.x,
                y : options.y,
                c : options.c,
                map : options.map
            });

            // 패딩 옵션 설정
            if(_.typeCheck("integer", options.padding)) {
                _padding = { left: options.padding, right: options.padding, bottom: options.padding, top: options.padding };
            } else {
                _padding = options.padding;
            }

            _area = caculatePanel(_.extend(options.area, {
                x: 0, y: 0 , width: area.width, height: area.height
            }, true), _padding);


            createClipPath();

            this.x = drawGridType(this, "x");
            this.y = drawGridType(this, "y");
            this.c = drawGridType(this, "c");
            this.map = drawMapType(this, "map");
        }

        /**
         * @method area
         *
         * Axis 의 표시 영역을 리턴한다. 
         *  
         * @param {"x"/"y"/"width"/'height"/null} key  area's key
         * @return {Number/Object} key 가 있으면 해당 key 의 value 를 리턴한다. 없으면 전체 area 객체를 리턴한다.
         */
        this.area = function(key) {
            return _.typeCheck("undefined", _area[key]) ? _area : _area[key];
        }

        /**
         * Gets the top, bottom, left and right margin values.
         *
         * @param {"top"/"left"/"bottom"/"right"} key
         * @return {Number/Object}
         */
        this.padding = function(key) {
            return _.typeCheck("undefined", _padding[key]) ? _padding : _padding[key];
        }

        /**
         * @method get
         *
         * Axis 의 옵션 정보를 리턴한다.
         *
         * @param key
         */
        this.get = function(type) {
            var obj = {
                area: _area,
                padding: _padding,
                clipId: _clipId,
                clipRectId : _clipRectId
            };

            return obj[type] || cloneAxis[type];
        }

        /**
         * @method updateGrid 
         * 
         * grid 정보를 업데이트 한다.  
         *  
         * @param {"x"/"y"/"c"} type
         * @param {Object} grid
         */
        this.updateGrid = function(type, grid) {
            _.extend(originAxis[type], grid);
            if(chart.isRender()) chart.render();
        }

        /**
         * @method updateMap
         *
         * map 정보를 업데이트 한다.
         *
         * @param {Object} map
         * @param {Array} data
         */
        this.updateMap = function(map, data) {
            _.extend(originAxis["map"], map);

            if(_.typeCheck("array", data)) {
                this.update(data);
            } else {
                if(chart.isRender()) chart.render();
            }
        }

        /**
         * @method update 
         * 
         * data 를 업데이트 한다.
         *  
         * @param {Array} data
         */
        this.update = function(data) {
            this.origin = data;
            this.page = 1;
            this.start = 0;
            this.end = 0;

            this.screen(1);
        }

        /**
         * @method screen 
         * 
         * 화면상에 보여줄 데이타를 페이징한다.  
         *  
         * @param {Number} pNo 페이지 번호 
         */
        this.screen = function(pNo) {
            setScreen(pNo);

            if(this.end <= this.origin.length) {
                if(chart.isRender()) chart.render();
            }
        }

        /**
         * @method next 
         * 
         */
        this.next = function() {
            var dataList = this.origin,
                limit = this.buffer,
                step = this.shift;

            this.start += step;

            var isLimit = (this.start + limit > dataList.length);

            this.end = (isLimit) ? dataList.length : this.start + limit;
            this.start = (isLimit) ? dataList.length - limit : this.start;
            this.start = (this.start < 0) ? 0 : this.start;
            this.data = dataList.slice(this.start, this.end);

            if(chart.isRender()) chart.render();
        }

        /**
         * @method prev  
         */
        this.prev = function() {
            var dataList = this.origin,
                limit = this.buffer,
                step = this.shift;

            this.start -= step;

            var isLimit = (this.start < 0);

            this.end = (isLimit) ? limit : this.start + limit;
            this.start = (isLimit) ? 0 : this.start;
            this.data = dataList.slice(this.start, this.end);

            if(chart.isRender()) chart.render();
        }

        /**
         * @method zoom 
         * 
         * 특정 인덱스의 영역으로 데이타를 다시 맞춘다.
         *
         * @param {Number} start
         * @param {Number} end
         */
        this.zoom = function(start, end) {
            if(start == end) return;

            setZoom(start, end);
            if(chart.isRender()) chart.render();
        }

        init();
    }

    Axis.setup = function() {

        return {
            /** @cfg {Integer} [extend=null]  Configures the index of an applicable grid group when intending to use already configured axis options. */
            extend: null,

            /** @cfg {chart.grid.core} [x=null] Sets a grid on the X axis (see the grid tab). */
            x: null,
            /** @cfg {chart.grid.core} [y=null]  Sets a grid on the Y axis (see the grid tab). */
            y: null,
            /** @cfg {chart.grid.core} [c=null] Sets a grid on the C axis (see the grid tab). */
            c: null,
            /** @cfg {chart.map.core} [map=null] Sets a map on the Map axis */
            map : null,
            /** @cfg {Array} [data=[]]  Sets the row set data which constitute a chart.  */
            data: [],
            /** @cfg {Array} [origin=[]]  [Fore read only] Original data initially set. */
            origin: [],
            /** @cfg {Object} [keymap={}] grid's data key map  */
            keymap: {},
            /** @cfg {Object} [area={}]  set area(x, y, width, height) of axis */
            area: {},
            /**
             * @cfg  {Object} padding axis padding
             * @cfg  {Number} [padding.top=0] axis's top padding
             * @cfg  {Number} [padding.bottom=0] axis's bottom padding
             * @cfg  {Number} [padding.left=0] axis's left padding
             * @cfg  {Number} [padding.right=0] axis's right padding
             */
            padding : {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            /** @cfg {Number} [buffer=10000] Limits the number of elements shown on a chart.  */
            buffer: 10000,
            /** @cfg {Number} [shift=1]  Data shift count for the 'prev' or 'next' method of the chart builder.  */
            shift: 1,

            /** @cfg {Number} [page=1]  Page number of the data currently drawn. */
            page: 1,
            /** @cfg {Number} [start=0] */
            start: 0,
            /** @cfg {Number} [end=0] */
            end: 0,

            /** @cfg {Number} [degree=0]  Set degree of 3d chart */
            degree: 0,
            /** @cfg {Number} [depth=0]  Set depth of 3d chart  */
            depth: 0
        }
    }

    return Axis;
});

jui.define("chart.map", [ "jquery", "util.base", "util.math", "util.svg" ], function($, _, math, SVG) {
    /**
     * @class chart.grid.core
     * Grid Core 객체
     * @extends chart.draw
     * @abstract
     */
    var Map = function() {
        var self = this;
        var pathURI = null,
            pathGroup = null,
            pathIndex = {},
            pathScale = 1,
            pathX = 0,
            pathY = 0;

        function loadArray(data) {
            var children = [];

            for(var i = 0, len = data.length; i < len; i++) {
                if(_.typeCheck("object", data[i])) {
                    var style = {};

                    if(_.typeCheck("string", data[i].style)) {
                        style = getStyleObj(data[i].style);
                        delete data[i].style;
                    }

                    var elem = SVG.createObject({ type: "path", attr: data[i] });

                    // Set theme styles
                    elem.attr({
                        fill: self.chart.theme("mapPathBackgroundColor"),
                        "fill-opacity": self.chart.theme("mapPathBackgroundOpacity"),
                        stroke: self.chart.theme("mapPathBorderColor"),
                        "stroke-width": self.chart.theme("mapPathBorderWidth"),
                        "stroke-opacity": self.chart.theme("mapPathBorderOpacity")
                    });

                    // Set resource styles
                    elem.css(style);

                    children.push({
                        path: elem,
                        data: data[i]
                    });
                }
            }

            function getStyleObj(str) {
                var style = {},
                    list = str.split(";");

                for(var i = 0; i < list.length; i++) {
                    if(list[i].indexOf(":") != -1) {
                        var obj = list[i].split(":");

                        style[$.trim(obj[0])] = $.trim(obj[1]);
                    }
                }

                return style;
            }

            return children;
        }

        function loadPath(uri) {
            var pathData = [];

            $.ajax({
                url: uri,
                async: false,
                success: function (xml) {
                    var $path = $(xml).find("path"),
                        $style = $(xml).find("style");

                    $path.each(function () {
                        var obj = {};

                        $.each(this.attributes, function () {
                            if(this.specified && isLoadAttribute(this.name)) {
                                obj[this.name] = this.value;
                            }
                        });

                        if(_.typeCheck("string", obj.id)) {
                            _.extend(obj, getDataById(obj.id));
                            pathData.push(obj);
                        }
                    });

                    $style.each(function () {
                        self.chart.svg.root.element.appendChild(this);
                    });
                }
            });

            function isLoadAttribute(name) {
                return (name == "id" || name == "title" || name == "x" || name == "y" || name == "d" || name == "class" || name == "style");
            }

            return loadArray(pathData);
        }

        function getDataById(id) {
            var list = self.axis.data;

            for(var i = 0; i < list.length; i++) {
                var dataId = self.axis.getValue(list[i], "id", null);

                if(dataId == id) {
                    return list[i];
                }
            }

            return null;
        }

        function makePathGroup() {
            var group = self.chart.svg.group(),
                list = loadPath(self.map.path);

            for(var i = 0, len = list.length; i < len; i++) {
                var path = list[i].path,
                    data = list[i].data;

                addEvent(path, list[i]);
                group.append(path);

                if(_.typeCheck("string", data.id)) {
                    pathIndex[data.id] = list[i];
                }
            }

            return group;
        }

        function getScaleXY() {
            // 현재 스케일에 따른 계산이 필요함
            var w = self.map.width,
                h = self.map.height,
                px = ((w * pathScale) - w) / 2,
                py = ((h * pathScale) - h) / 2;

            return {
                x: px + pathX,
                y: py + pathY
            }
        }

        /**
         * @method addEvent
         * 맵 패스 엘리먼트에 대한 공통 이벤트 정의
         *
         * @param {Element} element
         * @param {Object} obj
         */
        function addEvent(elem, obj) {
            var chart = self.chart;

            elem.on("click", function(e) {
                setMouseEvent(e);
                chart.emit("map.click", [ obj, e ]);
            });

            elem.on("dblclick", function(e) {
                setMouseEvent(e);
                chart.emit("map.dblclick", [ obj, e ]);
            });

            elem.on("contextmenu", function(e) {
                setMouseEvent(e);
                chart.emit("map.rclick", [ obj, e ]);
                e.preventDefault();
            });

            elem.on("mouseover", function(e) {
                setMouseEvent(e);
                chart.emit("map.mouseover", [ obj, e ]);
            });

            elem.on("mouseout", function(e) {
                setMouseEvent(e);
                chart.emit("map.mouseout", [ obj, e ]);
            });

            elem.on("mousemove", function(e) {
                setMouseEvent(e);
                chart.emit("map.mousemove", [ obj, e ]);
            });

            elem.on("mousedown", function(e) {
                setMouseEvent(e);
                chart.emit("map.mousedown", [ obj, e ]);
            });

            elem.on("mouseup", function(e) {
                setMouseEvent(e);
                chart.emit("map.mouseup", [ obj, e ]);
            });

            function setMouseEvent(e) {
                var pos = $(chart.root).offset(),
                    offsetX = e.pageX - pos.left,
                    offsetY = e.pageY - pos.top;

                e.bgX = offsetX;
                e.bgY = offsetY;
                e.chartX = offsetX - chart.padding("left");
                e.chartY = offsetY - chart.padding("top");
            }
        }

        this.scale = function(id) {
            if(!_.typeCheck("string", id)) return;

            var x = null,
                y = null,
                path = null,
                data = null,
                pxy = getScaleXY();

            if(_.typeCheck("object", pathIndex[id])) {
                path = pathIndex[id].path;
                data = pathIndex[id].data;

                if(data.x != null) {
                    var cx = parseFloat(data.x);
                    x = (cx * pathScale) - pxy.x;
                }

                if(data.y != null) {
                    var cy = parseFloat(data.y);
                    y = (cy * pathScale) - pxy.y;
                }
            }

            return {
                x: x,
                y: y,
                path: path,
                data: data
            }
        }

        this.scale.each = function(callback) {
            var self = this;

            for(var id in pathIndex) {
                callback.apply(self, [ id, pathIndex[id] ]);
            }
        }

        this.scale.size = function() {
            return {
                width: self.map.width,
                height: self.map.height
            }
        }

        this.scale.scale = function(scale) {
            if(!scale || scale < 0) return pathScale;

            pathScale = scale;
            pathGroup.scale(pathScale);
            this.view(pathX, pathY);

            return pathScale;
        }

        this.scale.view = function(x, y) {
            var xy = { x: pathX, y: pathY };

            if(!_.typeCheck("number", x) || !_.typeCheck("number", y))
                return xy;

            pathX = x;
            pathY = y;

            var pxy = getScaleXY();
            pathGroup.translate(-pxy.x, -pxy.y);

            return {
                x: pathX,
                y: pathY
            }
        }

        /**
         * @method drawGrid
         * draw base grid structure
         * @protected
         * @param {chart.builder} chart
         * @param {String} orient
         * @param {String} cls
         * @param {Map} map
         */
        this.draw = function() {
            var root = this.chart.svg.group();

            pathScale = this.map.scale;
            pathX = this.map.viewX;
            pathY = this.map.viewY;

            // pathURI가 다를 경우에만 pathGroup을 생성함
            if(pathURI != this.map.path) {
                pathGroup = makePathGroup();
                pathURI = this.map.path;
            }

            // pathGroup 루트에 추가
            root.append(pathGroup);

            if(this.map.scale != 1) {
                this.scale.scale(pathScale);
            }

            if(this.map.viewX != 0 || this.map.viewY != 0) {
                this.scale.view(pathX, pathY);
            }

            if(this.map.hide) {
                root.attr({ visibility: "hidden" });
            }

            return {
                root: root,
                scale: this.scale
            };
        }

        /**
         * @method drawAfter
         *
         *
         *
         * @param {Object} obj
         * @protected
         */
        this.drawAfter = function(obj) {
            obj.root.attr({ "clip-path": "url(#" + this.axis.get("clipRectId") + ")" });
        }
    }

    Map.setup = function() {
        /** @property {chart.builder} chart */
        /** @property {chart.axis} axis */
        /** @property {Object} map */

        return {
            scale: 1,
            viewX: 0,
            viewY: 0,

            /** @cfg {Boolean} [hide=false] Determines whether to display an applicable grid.  */
            hide: false,
            /** @cfg {String} [map=''] Set a map file's name */
            path: "",
            /** @cfg {Number} [width=-1] Set map's width */
            width: -1,
            /** @cfg {Number} [height=-1] Set map's height */
            height: -1
        };
    }

    return Map;
}, "chart.draw"); 
jui.defineUI("chart.builder", [ "jquery", "util.base", "util.svg", "util.color", "chart.axis" ],
    function($, _, SVGUtil, ColorUtil, Axis) {

    /**
     * Common Logic
     *
     */
    var win_width = 0;

    _.resize(function() {
        if(win_width == $(window).width()) return;

        var call_list = jui.get("chart.builder");
        for(var i = 0; i < call_list.length; i++) {
            var ui_list = call_list[i];

            for(var j = 0; j < ui_list.length; j++) {
                if(ui_list[j].isFullSize()) {
                    ui_list[j].setSize();
                }

                if(!ui_list[j].isRender()) {
                    ui_list[j].render(true);
                }
            }
        }

        win_width = $(window).width();
    }, 300);


    /**
     * @class chart.builder
     *
     * Implements chart builder
     *
     * @extends core
     * @alias ChartBuilder
     * @requires util.base
     * @requires util.svg
     * @requires util.color
     * @requires chart.axis
     * @requires jquery
     *
     */
    var UI = function() {
        var _axis = [], _brush = [], _widget = [], _defs = null;
        var _padding, _series, _area,  _theme, _hash = {};
        var _initialize = false, _options = null, _handler = { render: [], renderAll: [] }; // 리셋 대상 커스텀 이벤트 핸들러
        var _scale = 1, _xbox = 0, _ybox = 0; // 줌인/아웃, 뷰박스X/Y 관련 변수

        /**
         * @method caculate
         * 
         * caculate chart's default area
         *
         * padding 을 제외한 영역에서  x,y,x2,y2,width,height 속성을 구함
         *
         * 기본적으로 모든 브러쉬와 그리드는 계산된 영역안에서 그려짐
         *
         * @param {chart.builder} self
         * @private  
         */
        function calculate(self) {
            var max = self.svg.size();

            var _chart = {
                width: max.width - (_padding.left + _padding.right),
                height: max.height - (_padding.top + _padding.bottom),
                x: _padding.left,
                y: _padding.top
            };

            // chart 크기가 마이너스일 경우 (엘리먼트가 hidden 상태)
            if(_chart.width < 0) _chart.width = 0;
            if(_chart.height < 0) _chart.height = 0;

            // _chart 영역 계산
            _chart.x2 = _chart.x + _chart.width;
            _chart.y2 = _chart.y + _chart.height;

            _area = _chart;
        }

        /**
         * @method drawBefore 
         * 
         * option copy (series, brush, widget)
         *  
         * @param {chart.builder} self
         * @private  
         */
        function drawBefore(self) {
            _series = _.deepClone(_options.series);
            _brush = _.deepClone(_options.brush);
            _widget = _.deepClone(_options.widget);

            // defs 엘리먼트 생성
            _defs = self.svg.defs();

            // 해쉬 코드 초기화
            _hash = {};
        }

        /**
         * @method drawAxis 
         * implements axis draw 
         * @param {chart.builder} self 
         * @private
         */
        function drawAxis(self) {
            
            // 엑시스 리스트 얻어오기
            var axisList = _.deepClone(_options.axis, { data : true, origin : true });

            for(var i = 0; i < axisList.length; i++) {
                jui.defineOptions(Axis, axisList[i]);

                // 엑시스 인덱스 설정
                axisList[i].index = i;

                if(!_axis[i]) {
                    _axis[i] = new Axis(self, _options.axis[i], axisList[i]);
                } else {
                    _axis[i].reload(axisList[i]);
                }
            }
        }

        /**
         * @method drawBrush
         * brush 그리기
         *
         * brush 에 맞는 x, y 축(grid) 설정
         * @private
         */
        function drawBrush(self) {
            var draws = _brush;

            if(draws != null) {
                for(var i = 0; i < draws.length; i++) {
                    var Obj = jui.include("chart.brush." + draws[i].type);

                    // 브러쉬 기본 옵션과 사용자 옵션을 합침
                    jui.defineOptions(Obj, draws[i]);
                    var axis = _axis[draws[i].axis];

                    // 타겟 프로퍼티 설정
                    if(!draws[i].target) {
                        var target = [];

                        if(axis) {
                            for(var key in axis.data[0]) {
                                target.push(key);
                            }
                        }

                        draws[i].target = target;
                    } else if(_.typeCheck("string", draws[i].target)) {
                        draws[i].target = [ draws[i].target ];
                    }

                    // 브러쉬 인덱스 설정
                    draws[i].index = i;

                    // 브러쉬 기본 프로퍼티 정의
                    var draw = new Obj(self, axis, draws[i]);
                    draw.chart = self;
                    draw.axis = axis;
                    draw.brush = draws[i];

                    // 브러쉬 렌더링
                    draw.render();
                }
            }
        }

        /**
         * @method drawWidget 
         * implements widget draw 
         *  
         * @param {chart.builder} self
         * @param {Boolean} isAll  Whether redraw widget
         * @private  
         */
        function drawWidget(self, isAll) {
            var draws = _widget;

            if(draws != null) {
                for(var i = 0; i < draws.length; i++) {
                    var Obj = jui.include("chart.widget." + draws[i].type);

                    // 위젯 기본 옵션과 사용자 옵션을 합침
                    jui.defineOptions(Obj, draws[i]);

                    // 위젯 인덱스 설정
                    draws[i].index = i;

                    // 위젯 기본 프로퍼티 정의
                    var draw = new Obj(self, _axis[0], draws[i]);
                    draw.chart = self;
                    draw.axis = _axis[0];
                    draw.widget = draws[i];

                    // 위젯은 렌더 옵션이 false일 때, 최초 한번만 로드함 (연산 + 드로잉)
                    // 하지만 isAll이 true이면, 강제로 연산 및 드로잉을 함 (테마 변경 및 리사이징 시)
                    if(_initialize && !draw.isRender() && isAll !== true) {
                        return;
                    }

                    var elem = draw.render();
                    if(!draw.isRender()) {
                        self.svg.autoRender(elem, false);
                    }
                }
            }
        }

        /**
         * @method setChartEvent
         * define chart custom event
         * @param {chart.builder} self
         * @private
         */
        function setChartEvent(self) {
            var elem = self.svg.root,
                isMouseOver = false;

            elem.on("click", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.click", [ e ]);
                } else {
                    self.emit("chart.click", [ e ]);
                }
            });

            elem.on("dblclick", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.dblclick", [ e ]);
                } else {
                    self.emit("chart.dblclick", [ e ]);
                }
            });

            elem.on("contextmenu", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.rclick", [ e ]);
                } else {
                    self.emit("chart.rclick", [ e ]);
                }

                e.preventDefault();
            });

            elem.on("mousemove", function(e) {
                if (!checkPosition(e)) {
                    if (isMouseOver) {
                        self.emit("chart.mouseout", [ e ]);
                        isMouseOver = false;
                    }

                    self.emit("bg.mousemove", [ e ]);
                } else {
                    if (isMouseOver) {
                        self.emit("chart.mousemove", [ e ]);
                    } else {
                        self.emit("chart.mouseover", [ e ]);
                        isMouseOver = true;
                    }
                }
            });

            elem.on("mousedown", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.mousedown", [ e ]);
                } else {
                    self.emit("chart.mousedown", [ e ]);
                }
            });

            elem.on("mouseup", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.mouseup", [ e ]);
                } else {
                    self.emit("chart.mouseup", [ e ]);
                }
            });

            elem.on("mouseover", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.mouseover", [ e ]);
                }
            });

            elem.on("mouseout", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.mouseout", [ e ]);
                }
            });

            // 드래그 이벤트 막기
            self.addEvent(self.root, "selectstart", function(e) {
                e.preventDefault();
                return false;
            });

            function checkPosition(e) {
                var pos = $(self.root).offset(),
                    offsetX = e.pageX - pos.left,
                    offsetY = e.pageY - pos.top;

                e.bgX = (offsetX + _xbox) / _scale;
                e.bgY = (offsetY + _ybox) / _scale;
                e.chartX = (offsetX - self.padding("left") + _xbox) / _scale;
                e.chartY = (offsetY - self.padding("top") + _ybox) / _scale;

                if(e.chartX < 0) return;
                if(e.chartX > self.area("width")) return;
                if(e.chartY < 0) return;
                if(e.chartY > self.area("height")) return;

                return true;
            }
        }

        function resetCustomEvent(self, isAll) {
            for(var i = 0; i < _handler.render.length; i++) {
                self.off(_handler.render[i]);
            }
            _handler.render = [];

            if(isAll === true) {
                for(var i = 0; i < _handler.renderAll.length; i++) {
                    self.off(_handler.renderAll[i]);
                }
                _handler.renderAll = [];
            }
        }

        function createGradient(obj, hashKey) {
            if(!_.typeCheck("undefined", hashKey) && _hash[hashKey]) {
                return "url(#" + _hash[hashKey] + ")";
            }

            var g = null,
                id = _.createId("gradient");

            obj.attr.id = id;

            g = SVGUtil.createObject(obj);

            _defs.append(g);

            if(!_.typeCheck("undefined", hashKey)) {
                _hash[hashKey] = id;
            }

            return "url(#" + id + ")";
        }
        
        function createPattern(obj) {
            if (_.typeCheck("string", obj)) {
                obj = obj.replace("url(#", "").replace(")", "");

                if(_hash[obj]) {
                    return "url(#" + obj + ")";
                }
                
                // already pattern id 
                if (obj.indexOf('pattern-') == -1) {
                    return false
                }

                var arr = obj.split("-"),
                    method = arr.pop();

                var pattern = jui.include("chart." + arr.join("."));
                
                if (!pattern) {
                    return false;
                }

                var patternElement = pattern[method];
                
                if (typeof patternElement == 'function') {
                    patternElement = patternElement.call(patternElement);
                }

                // json 객체를 svg element 로 변환
                if (patternElement.attr && !patternElement.attr.id) {
                    patternElement.attr.id = obj;
                }

                patternElement = SVGUtil.createObject(patternElement);

                _defs.append(patternElement);
                
                _hash[obj] = obj;
                
                return "url(#" + obj + ")";
                
            } else {
                obj.attr.id = obj.attr.id || _.createId('pattern-');

                if (_hash[obj.attr.id]) {
                    return "url(#" + obj.attr.id + ")";
                }                
                
                var patternElement = SVGUtil.createObject(obj);
                
                _defs.append(patternElement);
                
                _hash[obj.attr.id] = obj.attr.id;
                
                return "url(#" + obj.attr.id + ")";
            }
        }

        function createColor(color) {
            if(_.typeCheck("undefined", color)) {
                return "none";
            }

            if(_.typeCheck("object", color)) {
                
                if (color.type == "pattern") {
                    return createPattern(color);
                } else {
                    return createGradient(color);
                }
            }
            
            if (typeof color == "string") {
                var url = createPattern(color);
                if (url) {
                    return url; 
                }
            }

            var parsedColor = ColorUtil.parse(color);
            if(parsedColor == color)
                return color;

            return createGradient(parsedColor, color);
        }

        function setThemeStyle(theme) {
            var style = {};

            // 테마를 하나의 객체로 Merge
            if(_.typeCheck("string", theme)) {
                _.extend(style, jui.include("chart.theme." + theme));
                _.extend(style, _options.style);
            } else if(_.typeCheck("object", theme)) {
                _.extend(_theme, _options.style);
                _.extend(_theme, theme);
                _.extend(style, _theme);
            }

            // 최종 렌더링에 적용되는 객체
            _theme = style;
        }

        function setDefaultOptions(self) {
            // 일부 옵션을 제외하고 클론
            _options = _.deepClone(self.options, { data: true, bind: true });

            var padding = _options.padding;

            // 패딩 옵션 설정
            if(_.typeCheck("integer", padding)) {
                _padding = { left: padding, right: padding, bottom: padding, top: padding };
            } else {
                _padding = padding;
            }

            // UI 바인딩 설정 (차후에 변경, 현재는 첫번째 엑시스로 고정)
            if(_.typeCheck("object", _options.bind)) {
                self.bindUI(0, _options.bind);
            }

            // Draw 옵션 설정
            if(!_.typeCheck("array", _options.axis)) {
                _options.axis = [ _options.axis ];
            }

            if(!_.typeCheck("array", _options.brush)) {
                _options.brush = [ _options.brush ];
            }

            if(!_.typeCheck("array", _options.widget)) {
                _options.widget = [ _options.widget ];
            }

            // Axis 확장 설정
            for(var i = 0; i < _options.axis.length; i++) {
                var axis = _options.axis[i];
                _.extend(axis, _options.axis[axis.extend], true);
            }
        }

        function setChartIcons() {
            var icon = _options.icon;
            if(!_.typeCheck([ "string", "array" ], icon.path)) return;

            var pathList = (_.typeCheck("string", icon.path)) ? [ icon.path ] : icon.path,
                urlList = [];

            for(var i = 0; i < pathList.length; i++) {
                var path = pathList[i],
                    url = "url(" + path + ") ";

                if (path.indexOf(".eot") != -1) {
                    url += "format('embedded-opentype')";
                } else if (path.indexOf(".woff") != -1) {
                    url += "format('woff')";
                } else if (path.indexOf(".ttf") != -1) {
                    url += "format('truetype')";
                } else if (path.indexOf(".svg") != -1) {
                    url += "format('svg')";
                }

                urlList.push(url);
            }

            var fontFace = "font-family: " + icon.type + "; font-weight: normal; font-style: normal; src: " + urlList.join(",");

            (function(rule) {
                var sheet = (function() {
                    var style = document.createElement("style");

                    style.appendChild(document.createTextNode(""));
                    document.head.appendChild(style);

                    return style.sheet;
                })();

                sheet.insertRule(rule, 0);
            })("@font-face {" + fontFace + "}");
        }

        this.init = function() {
            // 기본 옵션 설정
            setDefaultOptions(this);

            // 차트 테마 설정 (+옵션 스타일)
            setThemeStyle(_options.theme);

            // svg 기본 객체 생성
            /** @property {chart.svg} svg Refers to an SVG utility object. */
            this.svg = new SVGUtil(this.root, {
                width: _options.width,
                height: _options.height,
                "buffered-rendering" : "dynamic"
            });

            // 차트 기본 렌더링
            this.render();

            // 차트 이벤트 설정
            setChartEvent(this);

            // 아이콘 폰트 설정
            setChartIcons();
        }
        
        /**
         * @method get  
         *
         * Gets a named axis, brush, widget or series (type: axis, brush, widget, series, padding, area)
         *
         * @param {"axis"/"brush"/"widget"/"series"/"padding"/"area"} type
         * @param {String} key  Property name
         * @return {Mixed/Object}
         */
        this.get = function(type, key) {
            var obj = {
                axis: _axis,
                brush: _brush,
                widget: _widget,
                series: _series,
                padding: _padding,
                area: _area
            };

            if(obj[type][key]) {
                return obj[type][key];
            }

            return obj[type] || obj;
        }

        /**
         * Gets the axis object of that index.
         *
         * @param {Number} key
         * @returns {Array/Object}
         */
        this.axis = function(key) {
            return _.typeCheck("undefined", _axis[key]) ? _axis : _axis[key];
        }

        /**
         * Gets a calculated value for a chart area (type: width, height, x, y, x2, y2)).
         *
         * @param {String} key
         * @return {Number/Object}
         */
        this.area = function(key) {
            return _.typeCheck("undefined", _area[key]) ? _area : _area[key];
        }

        /**
         * Gets the top, bottom, left and right margin values.
         *
         * @param {"top"/"left"/"bottom"/"right"} key
         * @return {Number/Object}
         */
        this.padding = function(key) {
            return _.typeCheck("undefined", _padding[key]) ? _padding : _padding[key];
        }

        /**
         * Gets a color defined in the theme or the color set.
         *
         * @param {Number} i
         * @param {chart.brush.core} brush
         * @return {String} Selected color string
         */
        this.color = function(i, brush) {
            var color = null;

            // 직접 색상을 추가할 경우 (+그라데이션, +필터)
            if(_.typeCheck("string", i)) {
                color = i;
            } else {
                // 테마 & 브러쉬 옵션 컬러 설정
                if(_.typeCheck("array", brush.colors)) {
                    color = brush.colors[i];

                    if(_.typeCheck("integer", color)) {
                        color = nextColor(color);
                    }
                } else {
                    color = nextColor();
                }

                // 시리즈 컬러 설정
                if(_.typeCheck("array", brush.target)) {
                    var series = _series[brush.target[i]];

                    if(series && series.color) {
                        color = series.color;

                        if(_.typeCheck("integer", color)) {
                            color = nextColor(color);
                        }
                    }
                }
            }

            if(_hash[color]) {
                return "url(#" + _hash[color] + ")";
            }

            function nextColor(newIndex) {
                var c = _theme["colors"],
                    index = newIndex || i;

                return (index > c.length - 1) ? c[c.length - 1] : c[index];
            }

            return createColor(color);
        }

        /**
         * Gets the unicode string of the icon.
         *
         * @param {String} key  icon's alias
         */
        this.icon = function(key) {
            return jui.include("chart.icon." + _options.icon.type)[key];
        }

        /**
         * Creates a text element to which a theme is applied.
         *
         * Also it support icon string
         *
         * @param {Object} attr
         * @param {String|Function} textOrCallback
         */
        this.text = function(attr, textOrCallback) {
            if(_.typeCheck("string", textOrCallback)) {
                var regex = /{([^{}]+)}/g,
                    result = textOrCallback.match(regex);

                if(result != null) {
                    for(var i = 0; i < result.length; i++) {
                        var key = result[i].substring(1, result[i].length - 1);
                        textOrCallback = textOrCallback.replace(result[i], this.icon(key));
                    }
                }
            } else if(_.typeCheck("undefined", textOrCallback)) {
                textOrCallback = "";
            }

            return this.svg.text(attr, textOrCallback);
        }

        /**
         * @method theme
         *
         * Gets a value for the theme element applied to the current chart.
         *
         * ```
         *      // get all theme property
         *      var theme = chart.theme();
         *      // get a part of theme
         *      var fontColor = chart.theme("fontColor");
         *      // get selected value of theme
         *      chart.theme(isSelected, "selectedFontColor", "fontColor");  // if isSelected is true, return 'selectedFontColor' else return 'fontColor'
         * ```
         */
        this.theme = function(key, value, value2) {
            if(arguments.length == 0) {
                return _theme;
            } else if(arguments.length == 1) {
                if(key.indexOf("Color") > -1 && _theme[key] != null) {
                    return createColor(_theme[key]);
                }

                return _theme[key];
            } else if(arguments.length == 3) {
                var val = (key) ? value : value2;

                if(val.indexOf("Color") > -1 && _theme[val] != null) {
                    return createColor(_theme[val]);
                }

                return _theme[val];
            }
        }

        /**
         * Returns a value from the format callback function of a defined option.
         *
         * @param {Function} format
         * @return {Mixed}
         */
        this.format = function() {
            if(arguments.length == 0) return;
            var callback = _options.format;

            if(_.typeCheck("function", callback)) {
                return callback.apply(this, arguments);
            }

            return arguments[0];
        }

        /**
         * @method bindUI 
         * 
         * Binds data used in a uix.table or the uix.xtable.
         *
         * @param {Number} axisIndex
         * @param {Object} uiObj
         */
        this.bindUI = function(axisIndex, uiObj) {
            var self = this;

            if(uiObj.module.type == "uix.table") {
                uiObj.callAfter("update", updateTable);
                uiObj.callAfter("sort", updateTable);
                uiObj.callAfter("append", updateTable);
                uiObj.callAfter("insert", updateTable);
                uiObj.callAfter("remove", updateTable);
            } else if(uiObj.module.type == "uix.xtable") {
                uiObj.callAfter("update", updateTable);
                uiObj.callAfter("sort", updateTable);
            }

            function updateTable() {
                self.axis(axisIndex).update(uiObj.listData());
            }
        }

        /**
         * @method on
         * 
         * A callback function defined as an on method is run when an emit method is called.
         *
         * @param {String} type Event's name
         * @param {Function} callback
         * @param {"render"/"renderAll"/undefined} resetType
         */
        this.on = function(type, callback, resetType) {
            if(!_.typeCheck("string", type)  || !_.typeCheck("function", callback)) return;

            this.event.push({ type: type.toLowerCase(), callback: callback  });

            // 브러쉬나 위젯에서 설정한 이벤트 핸들러만 추가
            if(resetType == "render" || resetType == "renderAll") {
                _handler[resetType].push(callback);
            }
        }

        /**
         * Change the scale of the chart.
         *
         * @param {Number} scale
         * @return {Number}
         */
        this.scale = function(scale) {
            if(!scale || scale < 0) return _scale;

            _scale = scale;
            this.svg.root.each(function(i, elem) {
                elem.scale(_scale);
            });

            return _scale;
        }

        /**
         * Change the view of the chart.
         *
         * @param {Number} x
         * @param {Number} y
         * @return {Object}
         * @return {Number} return.x
         * @return {Number} return.y
         */
        this.view = function(x, y) {
            var area = this.area(),
                xy = {
                    x: _xbox,
                    y: _ybox
                };

            if(Math.abs(x) > area.width || !_.typeCheck("number", x)) return xy;
            if(Math.abs(y) > area.height || !_.typeCheck("number", y)) return xy;

            _xbox = x;
            _ybox = y;

            this.svg.root.attr({
                viewBox: _xbox + " " + _ybox + " " + area.width + " " + area.height
            });

            return {
                x: _xbox,
                y: _ybox
            }
        }

        /**
         * @method render 
         *
         * Renders all draw objects.
         *
         * @param {Boolean} isAll
         */
        this.render = function(isAll) {
            // SVG 메인 리셋
            this.svg.reset(isAll);

            // chart 이벤트 초기화 (삭제 대상)
            resetCustomEvent(this, isAll);

            // chart 영역 계산
            calculate(this);

            // chart 관련된 요소 draw
            drawBefore(this);
            drawAxis(this);
            drawBrush(this);
            drawWidget(this, isAll);

            // SVG 기본 테마 설정
            this.svg.root.css({
                "font-family": this.theme("fontFamily") + "," + _options.icon.type,
                "font-size": this.theme("fontSize"),
                fill: this.theme("fontColor"),
                background: this.theme("backgroundColor")
            });

            // SVG 메인/서브 렌더링
            this.svg.render(isAll);

            // 커스텀 이벤트 발생
            this.emit("render", [ _initialize ]);

            // 초기화 설정
            _initialize = true;
        }

        /**
         * @method appendDefs
         *
         * Add the child element in defs tag.
         *
         * @param {chart.svg.element} elem
         */
        this.appendDefs = function(elem) {
            _defs.append(elem);
        }

        /*
         * Brush & Widget 관련 메소드
         *
         */

        /**
         * @method addBrush 
         * 
         * Adds a brush and performs rendering again.
         *  
         * @param {Object} brush
         */
        this.addBrush = function(brush) {
            _options.brush.push(brush);
            if(this.isRender()) this.render();
        }

        /**
         * @method removeBrush 
         * 
         * Deletes the brush of a specified index and performs rendering again.
         * @param {Number} index
         */
        this.removeBrush = function(index) {
            _options.brush.splice(index, 1);
            if(this.isRender()) this.render();
        }
        /**
         * @method updateBrush 
         * Updates the brush of a specified index and performs rendering again.
         * @param {Number} index
         * @param {Object} brush
         */
        this.updateBrush = function(index, brush) {
            _.extend(_options.brush[index], brush);
            if(this.isRender()) this.render();
        }

        /**
         * @method addWidget 
         * Adds a widget and performs rendering again.
         * 
         * @param {Object} widget
         */
        this.addWidget = function(widget) {
            _options.widget.push(widget);
            if(this.isRender()) this.render();
        }

        /**
         * @method removeWidget 
         * Deletes the widget of a specified index and performs rendering again.
         * @param {Number} index
         */
        this.removeWidget = function(index) {
            _options.widget.splice(index, 1);
            if(this.isRender()) this.render();
        }

        /**
         * @method updateWidget
         * Updates the widget of a specified index and performs rendering again
         * @param {Number} index
         * @param {Object} widget
         */
        this.updateWidget = function(index, widget) {
            _.extend(_options.widget[index], widget);
            if(this.isRender()) this.render();
        }


        /**
         * Changes a chart to a specified theme and renders the chart again.
         *
         * @param {String/Object} theme
         */
        this.setTheme = function(theme) {
            setThemeStyle(theme);
            if(this.isRender()) this.render(true);
        }

        /**
         * Changes the size of a chart to the specified area and height then performs rendering.
         *
         * @param {Number} width
         * @param {Number} height
         */
        this.setSize = function(width, height) {
            if(arguments.length == 2) {
                _options.width = width;
                _options.height = height;
            }

            this.svg.size(_options.width, _options.height);
            if(this.isRender()) this.render(true);
        }

        /**
         * Returns true if the horizontal or vertical size of the chart is 100%.
         *
         * @return {Boolean}
         */
        this.isFullSize = function() {
            if(_options.width == "100%" || _options.height == "100%")
                return true;

            return true;
        }

        /**
         * Returns the values of rendering options and, if the rendering option is false, does not render the chart again when a method is called.
         *
         * @return {Boolean}
         */
        this.isRender = function() {
            return (!_initialize) ? true : _options.render;
        }
    }

    UI.setup = function() {
        return {
            
            /** @cfg  {String/Number} [width="100%"] chart width */ 
            width: "100%", // chart 기본 넓이
            /** @cfg  {String/Number} [height="100%"] chart height */
            height: "100%", // chart 기본 높이
            /** 
             * @cfg  {Object} padding chart padding 
             * @cfg  {Number} [padding.top=50] chart padding 
             * @cfg  {Number} [padding.bottom=50] chart padding
             * @cfg  {Number} [padding.left=50] chart padding
             * @cfg  {Number} [padding.right=50] chart padding
             */
            padding: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            },

            /** @cfg  {String} [theme=jennifer] chart theme  */
            theme: "jennifer",
            /** @cfg  {Object} style chart custom theme  */
            style: {},
            /** @cfg {Object} series Sets additional information for a specific data property. */
            series: {},
            /** @cfg {Array} brush Determines a brush to be added to a chart. */
            brush: [],
            /** @cfg {Array} widget Determines a widget to be added to a chart. */
            widget: [],
            /** @cfg {Array} [axis=[]] Determines a axis to be added to a chart. */
            axis: [],

            /** @cfg {Object} [bind=null] Sets a component objects to be bind.*/
            bind: null,
            /** @cfg {Function} [format=null] Sets a format callback function to be used in a grid/brush/widget. */
            format: null,
            /** @cfg {Boolean} [render=true] Does not render a chart when a rendering-related method is called with false (although the render method is not included). */
            render: true,

            /**
             * @cfg {Object} icon Icon-related settings available in the chart.
             * @cfg {String} [icon.type="jennifer"]
             * @cfg {String} [icon.path=null]
             */
            icon: {
                type: "jennifer",
                path: null
            }
        }
    }

    /**
     * @event bg_click
     * Real name ``` bg.click ```
     * Event that occurs when clicking on the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_click
     * Real name ``` chart.click ```
     * Event that occurs when clicking on the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_rclick
     * Real name ``` bg.rclick ```
     * Event that occurs when right clicking on a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_rclick
     * Real name ``` chart.rclick ```
     * Event that occurs when right clicking on the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_dblclick
     * Real name ``` bg.dblclick ```
     * Event that occurs when clicking on a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_dblclick
     * Real name ``` chart.dblclick ```
     * Event that occurs when double clicking on the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mousemove
     * Real name ``` bg.mousemove```
     * Event that occurs when moving the mouse over a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mousemove
     * Real name ``` chart.mousemove ```
     * Event that occurs when moving the mouse over the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mousedown
     * Real name ``` bg.mousedown ```
     * Event that occurs when left clicking on a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mousedown
     * Real name ``` chart.mousedown ```
     * Event that occurs when left clicking on the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mouseup
     * Real name ``` bg.mouseup ```
     * Event that occurs after left clicking on a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mouseup
     * Real name ``` chart.mouseup ```
     * Event that occurs after left clicking on the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mouseover
     * Real name ``` bg.mouseover ```
     * Event that occurs when placing the mouse over a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mouseover
     * Real name ``` chart.mouseover ```
     * Event that occurs when placing the mouse over the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mouseout
     * Real name ``` bg.mouseout ```
     * Event that occurs when moving the mouse out of a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mouseout
     * Real name ``` chart.mouseout ```
     * Event that occurs when placing the mouse over the chart area.
     * @param {jQueryEvent} e The event object.
     */

    return UI;
});

jui.define("chart.theme.jennifer", [], function() {

    /**
     * @class chart.theme.jennifer
     * Jennifer Theme
     * @singleton
     */
    var themeColors = [
        "#7977C2",
        "#7BBAE7",
        "#FFC000",
        "#FF7800",
        "#87BB66",
        "#1DA8A0",
        "#929292",
        "#555D69",
        "#0298D5",
        "#FA5559",
        "#F5A397",
        "#06D9B6",
        "#C6A9D9",
        "#6E6AFC",
        "#E3E766",
        "#C57BC3",
        "#DF328B",
        "#96D7EB",
        "#839CB5",
        "#9228E4"
    ];

    return {
        /** @cfg  */
    	backgroundColor : "white",
        /** @cfg  */
    	fontSize : "11px",
        /** @cfg   */
    	fontColor : "#333333",
        /** @cfg  */
		fontFamily : "arial,Tahoma,verdana",
        /** @cfg   */
        colors : themeColors,

        /** @cfg Grid Font Color */
    	gridFontColor : "#333333",
        /** @cfg Grid Active Font color */
    	gridActiveFontColor : "#ff7800",

        /** @cfg Grid Rect Color */
        gridRectColor : "#ababab",

        /** @cfg Grid Border Color */
        gridBorderColor : "#ebebeb",
        /** @cfg Grid Border Width */
    	gridBorderWidth : 1,

        /** @cfg */
        gridActiveBorderColor : "#ff7800",

        /** @cfg */
        gridAxisBorderColor : "#bfbfbf",
        /** @cfg */
        gridAxisBorderWidth : 2,

        /** @cfg  Grid Bar Size */
        gridTickSize : 3,
        gridTickBorderWidth : 1.5,
        gridTickPadding : 5,

        /** @cfg Grid Border Dash Array */
        gridBorderDashArray : "none",

        // brush-item styles
        /** @cfg */
        tooltipPointRadius : 5, // common
        /** @cfg */
        tooltipPointBorderWidth : 1, // common
        /** @cfg */        
        tooltipPointFontWeight : "bold", // common

        /** @cfg */
        barBorderColor : "none",
        /** @cfg */        
        barBorderWidth : 0,
        /** @cfg */
        barBorderOpacity : 0,
        /** @cfg */
        barBorderRadius : 3,
        /** @cfg */        
        barPointBorderColor : "white",
        /** @cfg */
        barDisableBackgroundOpacity : 0.4,
        /** @cfg */        
    	gaugeBackgroundColor : "#ececec",
        /** @cfg */        
        gaugeArrowColor : "#666666",
        /** @cfg */        
        gaugeFontColor : "#666666",
        /** @cfg */
        gaugeFontSize : "20px",
        /** @cfg */
        gaugeFontWeight : "bold",
        /** @cfg */
        gaugeTitleFontSize : "12px",
        /** @cfg */
        gaugeTitleFontWeight : "normal",
        /** @cfg */
        gaugeTitleFontColor : "#333",
        /** @cfg */
        bargaugeBackgroundColor : "#ececec",
        /** @cfg */
        bargaugeFontSize : "11px",
        /** @cfg */
        bargaugeFontColor : "#333333",

        /** @cfg */
    	pieBorderColor : "#ececec",
        /** @cfg */        
        pieBorderWidth : 1,
        /** @cfg */
        pieOuterFontSize : "11px",
        /** @cfg */
        pieOuterLineColor : "#a9a9a9",
        /** @cfg */
        pieOuterLineSize : 8,
        /** @cfg */
        pieOuterLineRate : 1.3,
        /** @cfg */
        pieActiveDistance : 5,
        /** @cfg */
    	areaBackgroundOpacity : 0.5,
        /** @cfg */
        areaSplitBackgroundColor : "#929292",
        /** @cfg */
        bubbleBackgroundOpacity : 0.5,
        /** @cfg */
        bubbleBorderWidth : 1,
        /** @cfg */
        candlestickBorderColor : "black",
        /** @cfg */
        candlestickBackgroundColor : "white",
        /** @cfg */
        candlestickInvertBorderColor : "red",
        /** @cfg */
        candlestickInvertBackgroundColor : "red",
        /** @cfg */
        ohlcBorderColor : "black",
        /** @cfg */
        ohlcInvertBorderColor : "red",
        /** @cfg */
        ohlcBorderRadius : 5,
        /** @cfg */
        lineBorderWidth : 2,
        /** @cfg */
        lineBorderDashArray : "none",
        /** @cfg */
        lineDisableBorderOpacity : 0.3,
        /** @cfg */
        linePointBorderColor : "white",
        /** @cfg */
        lineSplitBorderColor : null,
        /** @cfg */
        lineSplitBorderOpacity : 0.5,
        /** @cfg */
        pathBackgroundOpacity : 0.5,
        /** @cfg */
        pathBorderWidth : 1,
        /** @cfg */
        scatterBorderColor : "white",
        /** @cfg */
        scatterBorderWidth : 1,
        /** @cfg */
        scatterHoverColor : "white",
        /** @cfg */
        waterfallBackgroundColor : "#87BB66",
        /** @cfg */
        waterfallInvertBackgroundColor : "#FF7800",
        /** @cfg */
        waterfallEdgeBackgroundColor : "#7BBAE7",
        /** @cfg */
        waterfallLineColor : "#a9a9a9",
        /** @cfg */
        waterfallLineDashArray : "0.9",
        /** @cfg */
        focusBorderColor : "#FF7800",
        /** @cfg */
        focusBorderWidth : 1,
        /** @cfg */
        focusBackgroundColor : "#FF7800",
        /** @cfg */
        focusBackgroundOpacity : 0.1,
        /** @cfg */
        pinFontColor : "#FF7800",
        /** @cfg */
        pinFontSize : "10px",
        /** @cfg */
        pinBorderColor : "#FF7800",
        /** @cfg */
        pinBorderWidth : 0.7,

        /** @cfg */
        topologyNodeRadius : 12.5,
        /** @cfg */
        topologyNodeFontSize : "14px",
        /** @cfg */
        topologyNodeFontColor : "white",
        /** @cfg */
        topologyNodeTitleFontSize : "11px",
        /** @cfg */
        topologyNodeTitleFontColor : "#333",
        /** @cfg */
        topologyEdgeColor : "#b2b2b2",
        /** @cfg */
        topologyActiveEdgeColor : "#905ed1",
        /** @cfg */
        topologyEdgeFontSize : "10px",
        /** @cfg */
        topologyEdgeFontColor : "#666",
        /** @cfg */
        topologyEdgePointRadius : 3,
        /** @cfg */
        topologyTooltipBackgroundColor : "white",
        /** @cfg */
        topologyTooltipBorderColor : "#ccc",
        /** @cfg */
        topologyTooltipFontSize : "11px",
        /** @cfg */
        topologyTooltipFontColor : "#333",

        /** @cfg */
        titleFontColor : "#333",
        /** @cfg */
        titleFontSize : "13px",
        /** @cfg */
        titleFontWeight : "normal",
        /** @cfg */
        legendFontColor : "#333",
        /** @cfg */
        legendFontSize : "12px",
        /** @cfg */
        legendIconRadius : 6,
        /** @cfg */
        tooltipFontColor : "#333",
        /** @cfg */
        tooltipFontSize : "12px",
        /** @cfg */
        tooltipBackgroundColor : "white",
        /** @cfg */
        tooltipBorderColor : "#aaaaaa",
        /** @cfg */
        tooltipBackgroundOpacity : 0.7,
        /** @cfg */
        scrollBackgroundSize : 7,
        /** @cfg */
        scrollBackgroundColor : "#dcdcdc",
        /** @cfg */
        scrollThumbBackgroundColor : "#b2b2b2",
        /** @cfg */
        scrollThumbBorderColor : "#9f9fa4",
        /** @cfg */
        zoomBackgroundColor : "red",
        /** @cfg */
        zoomFocusColor : "gray",
        /** @cfg */
        zoomScrollBackgroundSize : 50,
        /** @cfg */
        zoomScrollBackgroundColor : "#000",
        /** @cfg */
        zoomScrollFocusColor : "#fff",
        /** @cfg */
        zoomScrollBrushColor : "#000",
        /** @cfg */
        crossBorderColor : "#a9a9a9",
        /** @cfg */
        crossBorderWidth : 1,
        /** @cfg */
        crossBorderOpacity : 0.8,
        /** @cfg */
        crossBalloonFontSize : "11px",
        /** @cfg */
        crossBalloonFontColor : "white",
        /** @cfg */
        crossBalloonBackgroundColor : "black",
        /** @cfg */
        crossBalloonBackgroundOpacity : 0.5,

        // Map Common
        mapPathBackgroundColor : "#67B7DC",
        mapPathBackgroundOpacity : 1,
        mapPathBorderColor : "white",
        mapPathBorderWidth : 0,
        mapPathBorderOpacity : 0,
        // Map Brushes
        mapBubbleBackgroundOpacity : 0.5,
        mapBubbleBorderWidth : 1,
        mapSelectorColor : "#5a73db",
        mapSelectorActiveColor : "#CC0000",
        mapFlightRouteAirportSmallColor : "#CC0000",
        mapFlightRouteAirportLargeColor : "#000",
        mapFlightRouteAirportBorderWidth : 2,
        mapFlightRouteAirportRadius : 8,
        mapFlightRouteLineBorderColor : "red",
        mapFlightRouteLineBorderWidth : 1,
        // Map Widgets
        mapControlButtonColor : "#3994e2",
        mapControlScrollColor : "#000",
        mapControlScrollLineColor : "#fff"
    }
});
jui.define("chart.theme.gradient", [], function() {
    var themeColors = [
        "linear(top) #9694e0,0.9 #7977C2",
        "linear(top) #a1d6fc,0.9 #7BBAE7",
        "linear(top) #ffd556,0.9 #ffc000",
        "linear(top) #ff9d46,0.9 #ff7800",
        "linear(top) #9cd37a,0.9 #87bb66",
        "linear(top) #3bb9b2,0.9 #1da8a0",
        "linear(top) #b3b3b3,0.9 #929292",
        "linear(top) #67717f,0.9 #555d69",
        "linear(top) #16b5f6,0.9 #0298d5",
        "linear(top) #ff686c,0.9 #fa5559",
        "linear(top) #fbbbb1,0.9 #f5a397",
        "linear(top) #3aedcf,0.9 #06d9b6",
        "linear(top) #d8c2e7,0.9 #c6a9d9",
        "linear(top) #8a87ff,0.9 #6e6afc",
        "linear(top) #eef18c,0.9 #e3e768",
        "linear(top) #ee52a2,0.9 #df328b",
        "linear(top) #b6e5f4,0.9 #96d7eb",
        "linear(top) #93aec8,0.9 #839cb5",
        "linear(top) #b76fef,0.9 #9228e4"
    ];

    return {
        // common styles
        backgroundColor : "white",
        fontSize : "11px",
        fontColor : "#666",
        fontFamily : "arial,Tahoma,verdana",
        colors : themeColors,

        // grid styles
        gridFontColor : "#666",
        gridActiveFontColor : "#ff7800",
        gridBorderColor : "#efefef",
        gridBorderWidth : 1,
        /** @cfg Grid Border Dash Array */
        gridBorderDashArray : "none",
        /** @cfg  Grid Bar Size */
        gridTickSize : 3,
        /** @cfg Grid Rect Color */
        gridRectColor : "#ababab",
        gridAxisBorderColor : "#efefef",
        gridAxisBorderWidth : 2,
        gridActiveBorderColor : "#ff7800",

        gridTickBorderWidth : 1.5,

        gridTickPadding : 5,


        // brush styles
        tooltipPointRadius : 5, // common
        tooltipPointBorderWidth : 1, // common
        tooltipPointFontWeight : "bold", // common
        barBorderColor : "none",
        barBorderWidth : 0,
        barBorderOpacity : 0,
        barBorderRadius : 3,
        barActiveBackgroundColor : "linear(top) #3aedcf,0.9 #06d9b6",
        barPointBorderColor : "white",
        barDisableBackgroundOpacity : 0.4,
        gaugeBackgroundColor : "#ececec",
        gaugeArrowColor : "#666666",
        gaugeFontColor : "#666666",
        gaugeFontSize : "20px",
        gaugeFontWeight : "bold",
        gaugeTitleFontSize : "12px",
        gaugeTitleFontWeight : "normal",
        gaugeTitleFontColor : "#333",
        bargaugeBackgroundColor : "#ececec",
        bargaugeFontSize : "11px",
        bargaugeFontColor : "#333333",
        pieBorderColor : "white",
        pieBorderWidth : 1,
        pieOuterFontSize : "11px",
        pieOuterLineColor : "#a9a9a9",
        pieOuterLineSize : 8,
        pieOuterLineRate : 1.3,
        pieActiveDistance : 5,
        areaBackgroundOpacity : 0.4,
        areaSplitBackgroundColor : "linear(top) #b3b3b3,0.9 #929292",
        bubbleBackgroundOpacity : 0.5,
        bubbleBorderWidth : 1,
        candlestickBorderColor : "black",
        candlestickBackgroundColor : "linear(top) white",
        candlestickInvertBorderColor : "red",
        candlestickInvertBackgroundColor : "linear(top) red",
        ohlcBorderColor : "#14be9d",
        ohlcInvertBorderColor : "#ff4848",
        ohlcBorderRadius : 5,
        lineBorderWidth : 2,
        lineBorderDashArray : "none",
        lineDisableBorderOpacity : 0.3,
        linePointBorderColor : "white",
        lineSplitBorderColor : null,
        lineSplitBorderOpacity : 0.5,
        pathBackgroundOpacity : 0.5,
        pathBorderWidth : 1,
        scatterBorderColor : "white",
        scatterBorderWidth : 2,
        scatterHoverColor : "white",
        waterfallBackgroundColor : "linear(top) #9cd37a,0.9 #87bb66",
        waterfallInvertBackgroundColor : "linear(top) #ff9d46,0.9 #ff7800",
        waterfallEdgeBackgroundColor : "linear(top) #a1d6fc,0.9 #7BBAE7",
        waterfallLineColor : "#a9a9a9",
        waterfallLineDashArray : "0.9",
        focusBorderColor : "#FF7800",
        focusBorderWidth : 1,
        focusBackgroundColor : "#FF7800",
        focusBackgroundOpacity : 0.1,
        pinFontColor : "#FF7800",
        pinFontSize : "10px",
        pinBorderColor : "#FF7800",
        pinBorderWidth : 0.7,

        topologyNodeRadius : 12.5,
        topologyNodeFontSize : "14px",
        topologyNodeFontColor : "white",
        topologyNodeTitleFontSize : "11px",
        topologyNodeTitleFontColor : "#333",
        topologyEdgeColor : "#b2b2b2",
        topologyActiveEdgeColor : "#905ed1",
        topologyEdgeFontSize : "10px",
        topologyEdgeFontColor : "#666",
        topologyEdgePointRadius : 3,
        topologyTooltipBackgroundColor : "white",
        topologyTooltipBorderColor : "#ccc",
        topologyTooltipFontSize : "11px",
        topologyTooltipFontColor : "#333",

        // widget styles
        titleFontColor : "#333",
        titleFontSize : "13px",
        titleFontWeight : "normal",
        legendFontColor : "#666",
        legendFontSize : "12px",
        legendIconRadius : 6,
        tooltipFontColor : "#fff",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "black",
        tooltipBorderColor : "none",
        tooltipBackgroundOpacity : 1,
        scrollBackgroundSize : 7,
        scrollBackgroundColor : "#dcdcdc",
        scrollThumbBackgroundColor : "#b2b2b2",
        scrollThumbBorderColor : "#9f9fa4",
        zoomBackgroundColor : "red",
        zoomFocusColor : "gray",
        zoomScrollBackgroundSize : 50,
        zoomScrollBackgroundColor : "#000",
        zoomScrollFocusColor : "#fff",
        zoomScrollBrushColor : "#000",
        crossBorderColor : "#a9a9a9",
        crossBorderWidth : 1,
        crossBorderOpacity : 0.8,
        crossBalloonFontSize : "11px",
        crossBalloonFontColor : "white",
        crossBalloonBackgroundColor : "black",
        crossBalloonBackgroundOpacity : 0.8,

        // Map Common
        mapPathBackgroundColor : "#67B7DC",
        mapPathBackgroundOpacity : 1,
        mapPathBorderColor : "white",
        mapPathBorderWidth : 0,
        mapPathBorderOpacity : 0,
        // Map Brushes
        mapBubbleBackgroundOpacity : 0.5,
        mapBubbleBorderWidth : 1,
        mapSelectorColor : "#5a73db",
        mapSelectorActiveColor : "#CC0000",
        mapFlightRouteAirportSmallColor : "#CC0000",
        mapFlightRouteAirportLargeColor : "#000",
        mapFlightRouteAirportBorderWidth : 2,
        mapFlightRouteAirportRadius : 8,
        mapFlightRouteLineBorderColor : "red",
        mapFlightRouteLineBorderWidth : 1,
        // Map Widgets
        mapControlButtonColor : "#3994e2",
        mapControlScrollColor : "#000",
        mapControlScrollLineColor : "#fff"
    }
});
jui.define("chart.theme.dark", [], function() {

    var themeColors = [
        "#12f2e8",
        "#26f67c",
        "#e9f819",
        "#b78bf9",
        "#f94590",
        "#8bccf9",
        "#9228e4",
        "#06d9b6",
        "#fc6d65",
        "#f199ff",
        "#c8f21d",
        "#16a6e5",
        "#00ba60",
        "#91f2a1",
        "#fc9765",
        "#f21d4f"
    ];

    return {
        // common styles
    	backgroundColor : "#222222",
    	fontSize : "12px",
    	fontColor : "#c5c5c5",
		fontFamily : "arial,Tahoma,verdana",
        colors : themeColors,

        // grid styles
    	gridFontColor : "#868686",
    	gridActiveFontColor : "#ff762d",
        gridBorderColor : "#464646",
        gridBorderWidth : 1,
        /** @cfg Grid Border Dash Array */
        gridBorderDashArray : "none",
        /** @cfg  Grid Bar Size */
        gridTickSize : 3,

        gridTickPadding : 5,

        /** @cfg Grid Rect Color */
        gridRectColor : "#ababab",
		gridAxisBorderColor : "#464646",
		gridAxisBorderWidth : 2,
    	gridActiveBorderColor : "#ff7800",

        gridTickBorderWidth : 1.5,

        // brush styles
        tooltipPointRadius : 5, // common
        tooltipPointBorderWidth : 1, // common
        tooltipPointFontWeight : "bold", // common
        barBorderColor : "none",
        barBorderWidth : 0,
        barBorderOpacity : 0,
        barBorderRadius : 3,
        barActiveBackgroundColor : "#fc6d65",
        barPointBorderColor : "white",
        barDisableBackgroundOpacity : 0.4,
    	gaugeBackgroundColor : "#3e3e3e",
        gaugeArrowColor : "#a6a6a6",
        gaugeFontColor : "#c5c5c5",
        gaugeFontSize : "20px",
        gaugeFontWeight : "bold",
        gaugeTitleFontSize : "12px",
        gaugeTitleFontWeight : "normal",
        gaugeTitleFontColor : "#c5c5c5",
        bargaugeBackgroundColor : "#3e3e3e",
        bargaugeFontSize : "11px",
        bargaugeFontColor : "#c5c5c5",
    	pieBorderColor : "#232323",
        pieBorderWidth : 1,
        pieOuterFontSize : "11px",
        pieOuterLineColor : "#a9a9a9",
        pieOuterLineSize : 8,
        pieOuterLineRate : 1.3,
        pieActiveDistance : 5,
        areaBackgroundOpacity : 0.5,
        areaSplitBackgroundColor : "#ebebeb",
        bubbleBackgroundOpacity : 0.5,
        bubbleBorderWidth : 1,
        candlestickBorderColor : "#14be9d",
        candlestickBackgroundColor : "#14be9d",
        candlestickInvertBorderColor : "#ff4848",
        candlestickInvertBackgroundColor : "#ff4848",
        ohlcBorderColor : "#14be9d",
        ohlcInvertBorderColor : "#ff4848",
        ohlcBorderRadius : 5,
        lineBorderWidth : 2,
        lineBorderDashArray : "none",
        lineDisableBorderOpacity : 0.3,
        linePointBorderColor : "white",
        lineSplitBorderColor : null,
        lineSplitBorderOpacity : 0.5,
        pathBackgroundOpacity : 0.2,
        pathBorderWidth : 1,
        scatterBorderColor : "none",
        scatterBorderWidth : 1,
        scatterHoverColor : "#222222",
        waterfallBackgroundColor : "#26f67c",
        waterfallInvertBackgroundColor : "#f94590",
        waterfallEdgeBackgroundColor : "#8bccf9",
        waterfallLineColor : "#a9a9a9",
        waterfallLineDashArray : "0.9",
        focusBorderColor : "#FF7800",
        focusBorderWidth : 1,
        focusBackgroundColor : "#FF7800",
        focusBackgroundOpacity : 0.1,
        pinFontColor : "#FF7800",
        pinFontSize : "10px",
        pinBorderColor : "#FF7800",
        pinBorderWidth : 0.7,

        topologyNodeRadius : 12.5,
        topologyNodeFontSize : "14px",
        topologyNodeFontColor : "#c5c5c5",
        topologyNodeTitleFontSize : "11px",
        topologyNodeTitleFontColor : "#c5c5c5",
        topologyEdgeColor : "#b2b2b2",
        topologyActiveEdgeColor : "#905ed1",
        topologyEdgeFontSize : "10px",
        topologyEdgeFontColor : "#c5c5c5",
        topologyEdgePointRadius : 3,
        topologyTooltipBackgroundColor : "#222222",
        topologyTooltipBorderColor : "#ccc",
        topologyTooltipFontSize : "11px",
        topologyTooltipFontColor : "#c5c5c5",

        // widget styles
        titleFontColor : "#ffffff",
        titleFontSize : "14px",
        titleFontWeight : "normal",
        legendFontColor : "#ffffff",
        legendFontSize : "11px",
        legendIconRadius : 5.5,
        tooltipFontColor : "#333333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "white",
        tooltipBackgroundOpacity : 1,
        scrollBackgroundSize : 7,
        scrollBackgroundColor : "#3e3e3e",
        scrollThumbBackgroundColor : "#666666",
        scrollThumbBorderColor : "#686868",
        zoomBackgroundColor : "red",
        zoomFocusColor : "gray",
        zoomScrollBackgroundSize : 50,
        zoomScrollBackgroundColor : "#000",
        zoomScrollFocusColor : "#fff",
        zoomScrollBrushColor : "#000",
        crossBorderColor : "#a9a9a9",
        crossBorderWidth : 1,
        crossBorderOpacity : 0.8,
        crossBalloonFontSize : "11px",
        crossBalloonFontColor : "#333",
        crossBalloonBackgroundColor : "white",
        crossBalloonBackgroundOpacity : 1,

        // Map Common
        mapPathBackgroundColor : "#67B7DC",
        mapPathBackgroundOpacity : 1,
        mapPathBorderColor : "white",
        mapPathBorderWidth : 0,
        mapPathBorderOpacity : 0,
        // Map Brushes
        mapBubbleBackgroundOpacity : 0.5,
        mapBubbleBorderWidth : 1,
        mapSelectorColor : "#5a73db",
        mapSelectorActiveColor : "#CC0000",
        mapFlightRouteAirportSmallColor : "#CC0000",
        mapFlightRouteAirportLargeColor : "#000",
        mapFlightRouteAirportBorderWidth : 2,
        mapFlightRouteAirportRadius : 8,
        mapFlightRouteLineBorderColor : "red",
        mapFlightRouteLineBorderWidth : 1,
        // Map Widgets
        mapControlButtonColor : "#3994e2",
        mapControlScrollColor : "#000",
        mapControlScrollLineColor : "#fff"
    }
});
jui.define("chart.theme.pastel", [], function() {
	var themeColors = [
		"#73e9d2",
		"#fef92c",
		"#ff9248",
		"#b7eef6",
		"#08c4e0",
		"#ffb9ce",
		"#ffd4ba",
		"#14be9d",
		"#ebebeb",
		"#666666",
		"#cdbfe3",
		"#bee982",
		"#c22269"
	];

	return {
		// common styles
		backgroundColor : "white",
		fontSize : "11px",
		fontColor : "#333333",
		fontFamily : "Caslon540BT-Regular,Times,New Roman,serif",
		colors : themeColors,

		// grid styles
		gridFontColor : "#333333",
		gridActiveFontColor : "#ff7800",
		gridBorderColor : "#bfbfbf",
		gridBorderWidth : 1,

		/** @cfg Grid Rect Color */
		gridRectColor : "#ababab",
		gridBorderDashArray : "1, 3",
		gridAxisBorderColor : "#bfbfbf",
		gridAxisBorderWidth : 2,
		gridActiveBorderColor : "#ff7800",

		/** @cfg  Grid Bar Size */
		gridTickSize : 3,

		gridTickPadding : 5,
		gridTickBorderWidth : 1.5,

		// brush styles
		tooltipPointRadius : 5, // common
		tooltipPointBorderWidth : 1, // common
		tooltipPointFontWeight : "bold", // common
		barBorderColor : "none",
		barBorderWidth : 0,
		barBorderOpacity : 0,
		barBorderRadius : 3,
		barActiveBackgroundColor : "#ffb9ce",
		barPointBorderColor : "#ebebeb",
		barDisableBackgroundOpacity : 0.4,
		gaugeBackgroundColor : "#f5f5f5",
        gaugeArrowColor : "gray",
		gaugeFontColor : "#666666",
        gaugeFontSize : "20px",
        gaugeFontWeight : "bold",
        gaugeTitleFontSize : "12px",
        gaugeTitleFontWeight : "normal",
        gaugeTitleFontColor : "#333",
        bargaugeBackgroundColor : "#f5f5f5",
        bargaugeFontSize : "11px",
        bargaugeFontColor : "#333333",
		pieBorderColor : "white",
		pieBorderWidth : 1,
        pieOuterFontSize : "11px",
        pieOuterLineColor : "#a9a9a9",
        pieOuterLineSize : 8,
        pieOuterLineRate : 1.3,
        pieActiveDistance : 5,
		areaBackgroundOpacity : 0.4,
		areaSplitBackgroundColor : "#ebebeb",
		bubbleBackgroundOpacity : 0.5,
		bubbleBorderWidth : 1,
		candlestickBorderColor : "#14be9d",
		candlestickBackgroundColor : "#14be9d",
		candlestickInvertBorderColor : "#ff4848",
		candlestickInvertBackgroundColor : "#ff4848",
        ohlcBorderColor : "#14be9d",
        ohlcInvertBorderColor : "#ff4848",
        ohlcBorderRadius : 5,
		lineBorderWidth : 2,
        lineBorderDashArray : "none",
		lineDisableBorderOpacity : 0.3,
		linePointBorderColor : "white",
		lineSplitBorderColor : null,
		lineSplitBorderOpacity : 0.5,
		pathBackgroundOpacity : 0.5,
		pathBorderWidth : 1,
		scatterBorderColor : "white",
		scatterBorderWidth : 1,
		scatterHoverColor : "white",
		waterfallBackgroundColor : "#73e9d2",
		waterfallInvertBackgroundColor : "#ffb9ce",
		waterfallEdgeBackgroundColor : "#08c4e0",
		waterfallLineColor : "#a9a9a9",
		waterfallLineDashArray : "0.9",
		focusBorderColor : "#FF7800",
		focusBorderWidth : 1,
		focusBackgroundColor : "#FF7800",
		focusBackgroundOpacity : 0.1,
		pinFontColor : "#FF7800",
		pinFontSize : "10px",
		pinBorderColor : "#FF7800",
		pinBorderWidth : 0.7,

        topologyNodeRadius : 12.5,
        topologyNodeFontSize : "14px",
        topologyNodeFontColor : "white",
        topologyNodeTitleFontSize : "11px",
        topologyNodeTitleFontColor : "#333",
        topologyEdgeColor : "#b2b2b2",
        topologyActiveEdgeColor : "#905ed1",
        topologyEdgeFontSize : "10px",
        topologyEdgeFontColor : "#666",
        topologyEdgePointRadius : 3,
        topologyTooltipBackgroundColor : "white",
        topologyTooltipBorderColor : "#ccc",
        topologyTooltipFontSize : "11px",
        topologyTooltipFontColor : "#333",

        // widget styles
        titleFontColor : "#333",
        titleFontSize : "18px",
		titleFontWeight : "normal",
        legendFontColor : "#333",
        legendFontSize : "11px",
        legendIconRadius : 5.5,
        tooltipFontColor : "#fff",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "black",
        tooltipBorderColor : "black",
		tooltipBackgroundOpacity : 0.7,
        scrollBackgroundSize : 7,
		scrollBackgroundColor :	"#f5f5f5",
		scrollThumbBackgroundColor : "#b2b2b2",
		scrollThumbBorderColor : "#9f9fa4",
		zoomBackgroundColor : "red",
		zoomFocusColor : "gray",
        zoomScrollBackgroundSize : 50,
        zoomScrollBackgroundColor : "#000",
        zoomScrollFocusColor : "#fff",
        zoomScrollBrushColor : "#000",
		crossBorderColor : "#a9a9a9",
		crossBorderWidth : 1,
		crossBorderOpacity : 0.8,
		crossBalloonFontSize : "11px",
		crossBalloonFontColor :	"white",
		crossBalloonBackgroundColor : "black",
		crossBalloonBackgroundOpacity : 0.7,

		// Map Common
		mapPathBackgroundColor : "#67B7DC",
		mapPathBackgroundOpacity : 1,
		mapPathBorderColor : "white",
		mapPathBorderWidth : 0,
		mapPathBorderOpacity : 0,
		// Map Brushes
		mapBubbleBackgroundOpacity : 0.5,
		mapBubbleBorderWidth : 1,
		mapSelectorColor : "#5a73db",
		mapSelectorActiveColor : "#CC0000",
		mapFlightRouteAirportSmallColor : "#CC0000",
		mapFlightRouteAirportLargeColor : "#000",
		mapFlightRouteAirportBorderWidth : 2,
		mapFlightRouteAirportRadius : 8,
		mapFlightRouteLineBorderColor : "red",
		mapFlightRouteLineBorderWidth : 1,
		// Map Widgets
		mapControlButtonColor : "#3994e2",
		mapControlScrollColor : "#000",
		mapControlScrollLineColor : "#fff"
	}
}); 
jui.define("chart.theme.pattern", [], function() {

    /**
     * @class chart.theme.pattern
     * Pattern Theme
     * @singleton
     */
    var themeColors = [
        "pattern-jennifer-01",
        "pattern-jennifer-02",
        "pattern-jennifer-03",
        "pattern-jennifer-04",
        "pattern-jennifer-05",
        "pattern-jennifer-06",
        "pattern-jennifer-07",
        "pattern-jennifer-08",
        "pattern-jennifer-09",
        "pattern-jennifer-10",
        "pattern-jennifer-11",
        "pattern-jennifer-12"
    ];

    return {
        /** Chart Background Color */
        backgroundColor : "white",
        /** Base Font Size */
        fontSize : "11px",
        /** Base Font Color  */
        fontColor : "#333333",
        /** Base Font Family */
        fontFamily : "arial,Tahoma,verdana",
        /** Color List  */
        colors : themeColors,

        // grid styles
        /** Grid Font Color */
        gridFontColor : "#333333",
        /** Grid Active Font color */
        gridActiveFontColor : "#ff7800",

        /** @cfg Grid Border Dash Array */
        gridBorderDashArray : "none",


        /** @cfg Grid Rect Color */
        gridRectColor : "#ababab",

        /** */
        gridAxisBorderColor : "#ebebeb",
        /** */
        gridAxisBorderWidth : 2,

        /** */
        gridActiveBorderColor : "#ff7800",

        /** Grid Border Color */
        gridBorderColor : "#ebebeb",

        /** Grid Border Width */
        gridBorderWidth : 1,

        /** @cfg  Grid Bar Size */
        gridTickSize : 3,

        gridTickPadding : 5,

        gridTickBorderWidth : 1.5,

        // brush styles
        /** */
        tooltipPointRadius : 5, // common
        /** */
        tooltipPointBorderWidth : 1, // common
        /** */
        tooltipPointFontWeight : "bold", // common
        /** */
        barBorderColor : "black",
        /** */
        barBorderWidth : 1,
        /** */
        barBorderOpacity : 1,
        /** */
        barBorderRadius : 5,
        /** */
        barActiveBackgroundColor : "#06d9b6",
        /** */
        barPointBorderColor : "white",
        /** */
        barDisableBackgroundOpacity : 0.4,
        /** */
        gaugeBackgroundColor : "#ececec",
        /** */
        gaugeArrowColor : "#666666",
        /** */
        gaugeFontColor : "#666666",
        /** */
        gaugeFontSize : "20px",
        /** */
        gaugeFontWeight : "bold",
        /** */
        gaugeTitleFontSize : "12px",
        /** */
        gaugeTitleFontWeight : "normal",
        /** */
        gaugeTitleFontColor : "#333",
        /** */
        pieBorderColor : "white",
        /** */
        bargaugeBackgroundColor : "#ececec",
        /** */
        bargaugeFontSize : "11px",
        /** */
        bargaugeFontColor : "#333333",
        /** */
        pieBorderWidth : 1,
        /** */
        pieOuterFontSize : "11px",
        /** */
        pieOuterLineColor : "#a9a9a9",
        /** */
        pieOuterLineSize : 8,
        /** */
        pieOuterLineRate : 1.3,
        /** */
        pieActiveDistance : 5,
        /** */
        areaBackgroundOpacity : 0.5,
        /** */
        areaSplitBackgroundColor : "#929292",
        /** */
        bubbleBackgroundOpacity : 0.5,
        /** */
        bubbleBorderWidth : 1,
        /** */
        candlestickBorderColor : "black",
        /** */
        candlestickBackgroundColor : "white",
        /** */
        candlestickInvertBorderColor : "red",
        /** */
        candlestickInvertBackgroundColor : "red",
        /** */
        ohlcBorderColor : "black",
        /** */
        ohlcInvertBorderColor : "red",
        /** */
        ohlcBorderRadius : 5,
        /** */
        lineBorderWidth : 2,
        /** */
        lineBorderDashArray : "none",
        /** */
        lineDisableBorderOpacity : 0.3,
        /** */
        linePointBorderColor : "white",
        /** */
        lineSplitBorderColor : null,
        /** */
        lineSplitBorderOpacity : 0.5,
        /** */
        pathBackgroundOpacity : 0.5,
        /** */
        pathBorderWidth : 1,
        /** */
        scatterBorderColor : "white",
        /** */
        scatterBorderWidth : 1,
        /** */
        scatterHoverColor : "white",
        /** */
        waterfallBackgroundColor : "#87BB66",
        /** */
        waterfallInvertBackgroundColor : "#FF7800",
        /** */
        waterfallEdgeBackgroundColor : "#7BBAE7",
        /** */
        waterfallLineColor : "#a9a9a9",
        /** */
        waterfallLineDashArray : "0.9",
        /** */
        focusBorderColor : "#FF7800",
        /** */
        focusBorderWidth : 1,
        /** */
        focusBackgroundColor : "#FF7800",
        /** */
        focusBackgroundOpacity : 0.1,
        /** */
        pinFontColor : "#FF7800",
        /** */
        pinFontSize : "10px",
        /** */
        pinBorderColor : "#FF7800",
        /** */
        pinBorderWidth : 0.7,
        /** */

        topologyNodeRadius : 12.5,
        topologyNodeFontSize : "14px",
        topologyNodeFontColor : "white",
        topologyNodeTitleFontSize : "11px",
        topologyNodeTitleFontColor : "#333",
        topologyEdgeColor : "#b2b2b2",
        topologyActiveEdgeColor : "#905ed1",
        topologyEdgeFontSize : "10px",
        topologyEdgeFontColor : "#666",
        topologyEdgePointRadius : 3,
        topologyTooltipBackgroundColor : "white",
        topologyTooltipBorderColor : "#ccc",
        topologyTooltipFontSize : "11px",
        topologyTooltipFontColor : "#333",

        // widget styles

        titleFontColor : "#333",
        titleFontSize : "13px",
        titleFontWeight : "normal",
        legendFontColor : "#333",
        legendFontSize : "12px",
        legendIconRadius : 6,
        tooltipFontColor : "#333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "#aaaaaa",
        tooltipBackgroundOpacity : 0.7,
        scrollBackgroundSize : 7,
        scrollBackgroundColor : "#dcdcdc",
        scrollThumbBackgroundColor : "#b2b2b2",
        scrollThumbBorderColor : "#9f9fa4",
        zoomBackgroundColor : "red",
        zoomFocusColor : "gray",
        zoomScrollBackgroundSize : 50,
        zoomScrollBackgroundColor : "#000",
        zoomScrollFocusColor : "#fff",
        zoomScrollBrushColor : "#000",
        crossBorderColor : "#a9a9a9",
        crossBorderWidth : 1,
        crossBorderOpacity : 0.8,
        crossBalloonFontSize : "11px",
        crossBalloonFontColor : "white",
        crossBalloonBackgroundColor : "black",
        crossBalloonBackgroundOpacity : 0.5,

        // Map Common
        mapPathBackgroundColor : "#67B7DC",
        mapPathBackgroundOpacity : 1,
        mapPathBorderColor : "white",
        mapPathBorderWidth : 0,
        mapPathBorderOpacity : 0,
        // Map Brushes
        mapBubbleBackgroundOpacity : 0.5,
        mapBubbleBorderWidth : 1,
        mapSelectorColor : "#5a73db",
        mapSelectorActiveColor : "#CC0000",
        mapFlightRouteAirportSmallColor : "#CC0000",
        mapFlightRouteAirportLargeColor : "#000",
        mapFlightRouteAirportBorderWidth : 2,
        mapFlightRouteAirportRadius : 8,
        mapFlightRouteLineBorderColor : "red",
        mapFlightRouteLineBorderWidth : 1,
        // Map Widgets
        mapControlButtonColor : "#3994e2",
        mapControlScrollColor : "#000",
        mapControlScrollLineColor : "#fff"
    }
});
jui.define("chart.pattern.jennifer", [], function() {
	return {
    "10": {
        "type": "pattern",
        "attr": {
            "id": "pattern-jennifer-10",
            "width": 12,
            "height": 12,
            "patternUnits": "userSpaceOnUse"
        },
        "children": [
            {
                "type": "image",
                "attr": {
                    "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAABZJREFUCNdjEBRg6GhgcHFgUFLAxQYAaTkFzlvDQuIAAAAASUVORK5CYII=",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    },
    "11": {
        "type": "pattern",
        "attr": {
            "id": "pattern-jennifer-11",
            "width": 12,
            "height": 12,
            "patternUnits": "userSpaceOnUse"
        },
        "children": [
            {
                "type": "image",
                "attr": {
                    "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAABJJREFUCNdjMDZgOHOAAQxwsQF00wXOMquS/QAAAABJRU5ErkJggg==",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    },
    "12": {
        "type": "pattern",
        "attr": {
            "id": "pattern-jennifer-12",
            "width": 12,
            "height": 12,
            "patternUnits": "userSpaceOnUse"
        },
        "children": [
            {
                "type": "image",
                "attr": {
                    "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAABBJREFUCNdj+P8BioAABxsAU88RaA20zg0AAAAASUVORK5CYII=",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    },
    "01": {
        "type": "pattern",
        "attr": {
            "id": "pattern-jennifer-01",
            "width": 12,
            "height": 12,
            "patternUnits": "userSpaceOnUse"
        },
        "children": [
            {
                "type": "image",
                "attr": {
                    "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAABVJREFUCNdjKC9g+P+B4e4FIImLDQBPxxNXosybYgAAAABJRU5ErkJggg==",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    },
    "02": {
        "type": "pattern",
        "attr": {
            "id": "pattern-jennifer-02",
            "width": 12,
            "height": 12,
            "patternUnits": "userSpaceOnUse"
        },
        "children": [
            {
                "type": "image",
                "attr": {
                    "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAABNJREFUCNdj6GhgAAIlBSCBiw0AUpID3xszyekAAAAASUVORK5CYII=",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    },
    "03": {
        "type": "pattern",
        "attr": {
            "id": "pattern-jennifer-03",
            "width": 12,
            "height": 12,
            "patternUnits": "userSpaceOnUse"
        },
        "children": [
            {
                "type": "image",
                "attr": {
                    "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAA9JREFUCNdj+P+BAQzwMACirge9PFNsFQAAAABJRU5ErkJggg==",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    },
    "04": {
        "type": "pattern",
        "attr": {
            "id": "pattern-jennifer-04",
            "width": 12,
            "height": 12,
            "patternUnits": "userSpaceOnUse"
        },
        "children": [
            {
                "type": "image",
                "attr": {
                    "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAACVBMVEUAAAAaGRkWFhUIIaslAAAAAXRSTlMAQObYZgAAACFJREFUCNdj6HBpYQABjw4wDeS7QPgtENrFxQNCe3SAKAC36AapdMh8ewAAAABJRU5ErkJggg==",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    },
    "05": {
        "type": "pattern",
        "attr": {
            "id": "pattern-jennifer-05",
            "width": 12,
            "height": 12,
            "patternUnits": "userSpaceOnUse"
        },
        "children": [
            {
                "type": "image",
                "attr": {
                    "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEUAAAALCwvdFFZtAAAAAXRSTlMAQObYZgAAAA1JREFUCNdjWLWAIAIAFt8Ped1+QPcAAAAASUVORK5CYII=",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    },
    "06": {
        "type": "pattern",
        "attr": {
            "id": "pattern-jennifer-06",
            "width": 12,
            "height": 12,
            "patternUnits": "userSpaceOnUse"
        },
        "children": [
            {
                "type": "image",
                "attr": {
                    "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEUAAAALCwvdFFZtAAAAAXRSTlMAQObYZgAAAA9JREFUCNdj+P+BAQjwkgDijAubMqjSSAAAAABJRU5ErkJggg==",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    },
    "07": {
        "type": "pattern",
        "attr": {
            "id": "pattern-jennifer-07",
            "width": 12,
            "height": 12,
            "patternUnits": "userSpaceOnUse"
        },
        "children": [
            {
                "type": "image",
                "attr": {
                    "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAACVBMVEUAAAAAAAAMDAwvehODAAAAAXRSTlMAQObYZgAAAA5JREFUCNdjmDJlCikYAPO/FNGPw+TMAAAAAElFTkSuQmCC",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    },
    "08": {
        "type": "pattern",
        "attr": {
            "id": "pattern-jennifer-08",
            "width": 12,
            "height": 12,
            "patternUnits": "userSpaceOnUse"
        },
        "children": [
            {
                "type": "image",
                "attr": {
                    "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAABZJREFUCNdjKC9gePeA4e4Fht0bcLEBM1MRaPwhp7AAAAAASUVORK5CYII=",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    },
    "09": {
        "type": "pattern",
        "attr": {
            "id": "pattern-jennifer-09",
            "width": 12,
            "height": 12,
            "patternUnits": "userSpaceOnUse"
        },
        "children": [
            {
                "type": "image",
                "attr": {
                    "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAABZJREFUCNdjePeAobyAYfcGhrsXcLEBOSARaPIjMTsAAAAASUVORK5CYII=",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    }
}
});
jui.define("chart.icon.jennifer", [], function() {
	return {
		"add-dir" : "\ue600",
		"add-dir2" : "\ue601",
		"align-center" : "\ue602",
		"align-left" : "\ue603",
		"align-right" : "\ue604",
		"analysis" : "\ue605",
		"analysis2" : "\ue606",
		"arrow1" : "\ue607",
		"arrow2" : "\ue608",
		"arrow3" : "\ue609",
		"bold" : "\ue60a",
		"calendar" : "\ue60b",
		"caution" : "\ue60c",
		"caution2" : "\ue60d",
		"chart-area" : "\ue60e",
		"chart-bar" : "\ue60f",
		"chart-candle" : "\ue610",
		"chart-column" : "\ue611",
		"chart-gauge" : "\ue612",
		"chart-line" : "\ue613",
		"chart-radar" : "\ue614",
		"chart-scatter" : "\ue615",
		"chart" : "\ue616",
		"check" : "\ue617",
		"checkmark" : "\ue618",
		"chevron-left" : "\ue619",
		"chevron-right" : "\ue61a",
		"close" : "\ue61b",
		"dashboard" : "\ue61c",
		"dashboardlist" : "\ue61d",
		"db" : "\ue61e",
		"device" : "\ue61f",
		"document" : "\ue620",
		"download" : "\ue621",
		"edit" : "\ue622",
		"etc" : "\ue623",
		"exit" : "\ue624",
		"gear" : "\ue625",
		"help" : "\ue626",
		"hide" : "\ue627",
		"home" : "\ue628",
		"html" : "\ue629",
		"image" : "\ue62a",
		"info-message" : "\ue62b",
		"info" : "\ue62c",
		"italic" : "\ue62d",
		"jennifer-server" : "\ue62e",
		"label" : "\ue62f",
		"left" : "\ue630",
		"link" : "\ue631",
		"loading" : "\ue632",
		"menu" : "\ue633",
		"message" : "\ue634",
		"minus" : "\ue635",
		"monitoring" : "\ue636",
		"more" : "\ue637",
		"new-window" : "\ue638",
		"orderedlist" : "\ue639",
		"pause" : "\ue63a",
		"play" : "\ue63b",
		"plus" : "\ue63c",
		"preview" : "\ue63d",
		"printer" : "\ue63e",
		"profile" : "\ue63f",
		"realtime" : "\ue640",
		"refresh" : "\ue641",
		"refresh2" : "\ue642",
		"report-build" : "\ue643",
		"report-link" : "\ue644",
		"report" : "\ue645",
		"resize" : "\ue646",
		"return" : "\ue647",
		"right" : "\ue648",
		"rule" : "\ue649",
		"save" : "\ue64a",
		"search" : "\ue64b",
		"server" : "\ue64c",
		"statistics" : "\ue64d",
		"stop" : "\ue64e",
		"stoppage" : "\ue64f",
		"table" : "\ue650",
		"text" : "\ue651",
		"textcolor" : "\ue652",
		"tool" : "\ue653",
		"trashcan" : "\ue654",
		"underline" : "\ue655",
		"unorderedlist" : "\ue656",
		"upload" : "\ue657",
		"user" : "\ue658",
		"was" : "\ue659",
		"ws" : "\ue65a"
	}
});
jui.define("chart.grid.core", [ "jquery", "util.base", "util.math" ], function($, _, math) {
	/**
	 * @class chart.grid.core
     * Grid Core 객체
	 * @extends chart.draw
     * @abstract
	 */
	var CoreGrid = function() {

		this.getLineOption = function() {
			var line = this.grid.line;

			if (typeof line === 'string') {
				line = { type : line || 'solid'}
			} else if (typeof line === 'number') {
				line = { type : 'solid', 'stroke-width' : line }
			} else if (typeof line !== 'object') {
				line = !!line;

				if (line) {
					line = { type : 'solid' }
				}
			}

			if (line && !line.type == 'string') {
				line.type = line.type.split(/ /g);
			}

			return line;
		}

		this.drawBaseLine = function(position, g) {

			var obj = this.getGridSize();
			var pos = {};

			if (position == 'bottom' || position == 'top') {
				pos = { x1 : obj.start, x2 : obj.end };
			} else if (position == 'left' || position == 'right') {
				pos = { y1 : obj.start, y2 : obj.end };
			} else {
				// TODO: custom base line
			}

			g.append(this.axisLine(pos));
		}

		this.makeColor = function(color) {
			return this.chart.color(0, { colors: [ color ] })
		}

		this.drawValueLine = function(position, axis, isActive, line, index, isLast) {

			if (isLast && this.grid.type != 'block') return;

			var area = { };
			if (position == 'top') {
				area = {x1: 0, x2: 0, y1: 0, y2: this.axis.area('height')};
			} else if (position == 'bottom' ) {
				area = {x1: 0, x2: 0, y1: 0, y2: -this.axis.area('height') };
			} else if (position == 'left') {
				area = {x1: 0, x2: this.axis.area('width'), y1: 0, y2: 0};
			} else if (position == 'right' ) {
				area = {x1: 0, x2: -this.axis.area('width'), y1: 0, y2: 0};
			}

			var lineObject = this.line($.extend({
				stroke : this.chart.theme(isActive, "gridActiveBorderColor", "gridBorderColor"),
				"stroke-width" : this.chart.theme(isActive, "gridActiveBorderWidth", "gridBorderWidth")
			}, area));


			if (line.type.indexOf("dashed") > -1) {
				lineObject.attr({ 'stroke-dasharray' : '5,5' });
			}

			var x = 0;
			var y = 0;
			var width = (position == 'left' || position == 'right') ? this.axis.area('width') : this.scale.rangeBand();
			var height = (position == 'top' || position == 'bottom') ? this.axis.area('height') : this.scale.rangeBand();


			if (position == 'bottom') y = -height;
			if (position == 'right') x = -width;

			if (index % 2== 0) {
				if (line.type.indexOf("gradient") > -1) {
					axis.append(this.chart.svg.rect({  x : x, y : y, height : height, width : width,
						fill : this.makeColor(( line.fill ? line.fill : 'linear(' + position + ') ' + this.chart.theme('gridRectColor') + ',0.5 ' + this.chart.theme('backgroundColor') )),
						'fill-opacity' : 0.1
					}));
				} else if (line.type.indexOf("rect") > -1) {
					axis.append(this.chart.svg.rect({x : x, y : y, height : height, width : width,
						fill : this.makeColor( line.fill ? line.fill : this.chart.theme('gridRectColor') ),
						'fill-opacity' : 0.1
					}));
				}
			}



			// TODO: add customize?

			axis.append(lineObject);
		}

		/**
		 * @method top
		 *
		 * draw top
		 *
		 * @param {chart.util.svg} g
		 * @param {Array} ticks
		 * @param {Array} values
		 * @param {Number} min
		 * @param {Function} checkActive
		 */
		this.drawTop = function(g, ticks, values, checkActive, moveX) {
			moveX = moveX || 0;
			var line = this.getLineOption();

			for (var i = 0, len = ticks.length; i < len; i++) {

				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isActive = false;
				if (typeof checkActive == 'function') {
					isActive = checkActive(ticks[i], i);
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(" + (values[i] + moveX) + ", 0)"
				});

				axis.append(this.line({
					y2 : -this.chart.theme('gridTickSize'),
					stroke : this.color(isActive, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridTickBorderWidth")
				}));


				if (line) this.drawValueLine( "top", axis, isActive, line, i, (i == len -1));

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x: (this.grid.type == 'block' && !this.grid.full) ? this.scale.rangeBand() / 2 : 0,
						y: -this.chart.theme('gridTickSize') - this.chart.theme("gridTickPadding") * 2,
						"text-anchor": "middle",
						fill: this.chart.theme(isActive, "gridActiveFontColor", "gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}

		}

		this.drawBottom = function(g, ticks, values, checkActive, moveX){
			moveX = moveX || 0;
			var line = this.getLineOption();

			for (var i = 0, len = ticks.length; i < len; i++) {

				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isActive = false;
				if (typeof checkActive == 'function') {
					isActive = checkActive(ticks[i], i);
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(" + (values[i] + moveX) + ", 0)"
				});

				axis.append(this.line({
					y2 : this.chart.theme('gridTickSize'),
					stroke : this.color(isActive, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridTickBorderWidth")
				}));


				if (line) this.drawValueLine( "bottom", axis, isActive, line, i, (i == len -1));

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x : (this.grid.type == 'block' && !this.grid.full) ? this.scale.rangeBand()/2 : 0,
						y : this.chart.theme('gridTickSize') + this.chart.theme("gridTickPadding") * 2,
						"text-anchor" : "middle",
						fill : this.chart.theme(isActive, "gridActiveFontColor", "gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.drawLeft = function(g, ticks, values, checkActive, moveY){
			moveY = moveY || 0;
			var line = this.getLineOption();

			//ticks.reverse();
			//values.reverse();

			for (var i = 0, len = ticks.length; i < len; i++) {

				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isActive = false;
				if (typeof checkActive == 'function') {
					isActive = checkActive(ticks[i], i);
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + (values[i] + moveY) + ")"
				})

				axis.append(this.line({
					x2 : -this.chart.theme('gridTickSize'),
					stroke : this.color(isActive, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridTickBorderWidth")
				}));


				if (line) this.drawValueLine( "left", axis, isActive, line, i, (i == len -1));

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x : -this.chart.theme('gridTickSize') - this.chart.theme("gridTickPadding"),
						y : (this.grid.type == 'block' && !this.grid.full) ? this.scale.rangeBand()/2 : this.chart.theme('gridTickSize'),
						"text-anchor" : "end",
						fill : this.chart.theme(isActive, "gridActiveFontColor", "gridFontColor")
					}, domain)));
				}

				g.append(axis);

			}
		}

		this.drawRight = function(g, ticks, values, checkActive, moveY){
			moveY = moveY || 0;
			var line = this.getLineOption();

			//ticks.reverse();
			//values.reverse();

			for (var i = 0, len = ticks.length; i < len; i++) {

				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isActive = false;
				if (typeof checkActive == 'function') {
					isActive = checkActive(ticks[i], i);
				}

				var axis = this.chart.svg.group({ "transform" : "translate(0, " + (values[i] + moveY) + ")" });

				axis.append(this.line({
					x2 : this.chart.theme('gridTickSize'),
					stroke : this.color(isActive, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridTickBorderWidth")
				}));


				if (line) this.drawValueLine( "right", axis, isActive, line, i, (i == len -1));

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x: this.chart.theme('gridTickSize') + this.chart.theme("gridTickPadding"),
						y: (this.grid.type == 'block' && !this.grid.full) ? this.scale.rangeBand() / 2 : this.chart.theme('gridTickSize'),
						"text-anchor": "start",
						fill: this.chart.theme(isActive, "gridActiveFontColor", "gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

        /**
         * @method drawAfter
         *
         *
         *
         * @param {Object} obj
         * @protected
         */
		this.drawAfter = function(obj) {
			obj.root.attr({ "class": "grid grid-" + this.grid.type});
		}

		/**
		 * @method wrapper
         * scale wrapper
		 *
		 * grid 의 x 좌표 값을 같은 형태로 가지고 오기 위한 wrapper 함수
		 *
		 * grid 속성에 key 가 있다면  key 의 속성값으로 실제 값을 처리
		 *
		 *      @example
		 *      // 그리드 속성에 키가 없을 때
		 *      scale(0);		// 0 인덱스에 대한 값  (block, radar)
		 *      // grid 속성에 key 가 있을 때
		 *      grid { key : "field" }
		 *      scale(0)			// field 값으로 scale 설정 (range, date)
         *
		 * @protected
		 */
		this.wrapper = function(scale, key) {
			return scale;
		}

		/**
         * @method axisLine
		 * theme 이 적용된  axis line 리턴
		 * @param {ChartBuilder} chart
         * @param {Object} attr
		 */
		this.axisLine = function(attr) {
			return this.chart.svg.line($.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,
				stroke : this.color("gridAxisBorderColor"),
				"stroke-width" : this.chart.theme("gridAxisBorderWidth"),
				"stroke-opacity" : 1
			}, attr));
		}

		/**
		 * @method line
         * theme 이 적용된  line 리턴
         * @protected
         * @param {ChartBuilder} chart
         * @param {Object} attr
		 */
		this.line = function(attr) {
			return this.chart.svg.line($.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,
				stroke : this.color("gridBorderColor"),
				"stroke-width" : this.chart.theme("gridBorderWidth"),
				"stroke-dasharray" : this.chart.theme("gridBorderDashArray"),
				"stroke-opacity" : 1
			}, attr));
		}

        /**
         * @method color
         * grid 에서 color 를 위한 유틸리티 함수
         * @param theme
         * @return {Mixed}
         */
		this.color  = function(theme) {
			if (arguments.length == 3) {
				return (this.grid.color) ? this.makeColor(this.grid.color) : this.chart.theme.apply(this.chart, arguments);
			}

			return (this.grid.color) ? this.makeColor(this.grid.color) : this.chart.theme(theme);
		}

        /**
         * @method data
         * get data for axis
         * @protected
         * @param {Number} index
         * @param {String} field
         */
        this.data = function(index, field) {
			if(this.axis.data && this.axis.data[index]) {
                return this.axis.data[index][field] || this.axis.data[index];
			}

			return this.axis.data || [];
		}

        /**
         * @method drawGrid
         * draw base grid structure
         * @protected
         * @param {chart.builder} chart
         * @param {String} orient
         * @param {String} cls
         * @param {Grid} grid
         */
		this.drawGrid = function() {
			// create group
			var root = this.chart.svg.group(),
                func = this[this.grid.orient];

			// wrapped scale
			this.scale = this.wrapper(this.scale, this.grid.key);

			// render axis
            if(_.typeCheck("function", func)) {
                func.call(this, root);
            }

			// hide grid
			if(this.grid.hide) {
				root.attr({ display : "none" })
			}

			return {
				root : root,
				scale : this.scale
			};
		}

        /**
         * @method getTextRotate
         * implement text rotate in grid text
         * @protected
         * @param {SVGElement} textElement
         */
		this.getTextRotate = function(textElement) {
			var rotate = this.grid.textRotate;

			if (rotate == null) {
				return textElement;
			}

			if (_.typeCheck("function", rotate)) {
				rotate = rotate.apply(this.chart, [ textElement ]);
			}

			var x = textElement.attr("x");
			var y = textElement.attr("y");

			textElement.rotate(rotate, x, y);

			return textElement;
		}

		/**
		 * @method getGridSize
         *
         * get real size of grid
		 *
		 * @param {chart.builder} chart
		 * @param {Strng} orient
		 * @param {Object} grid             그리드 옵션
		 * @return {Object}
         * @return {Number} return.start    시작 지점
         * @return {Number} return.size     그리드 넓이 또는 높이
         * @return {Number} return.end      마지막 지점
		 */
		this.getGridSize = function() {
            var orient = this.grid.orient,
                area = this.axis.area();

			var width = area.width,
				height = area.height,
				axis = (orient == "left" || orient == "right") ? area.y : area.x,
				max = (orient == "left" || orient == "right") ? height : width,
                depth = this.axis.get("depth"),
                degree = this.axis.get("degree"),
				start = axis,
				size = max,
                end = start + size;

            var result = {
                start: start,
                size: size,
                end: end
            };

            if(depth > 0 || degree > 0) {
                var radian = math.radian(360 - degree),
                    x2 = Math.cos(radian) * depth,
                    y2 = Math.sin(radian) * depth;

                if(orient == "left") {
                    result.start = result.start - y2;
                    result.size = result.size - y2;
                } else if(orient == "bottom") {
                    result.end = result.end - x2;
                    result.size = result.size - x2;
                }
            }

            return result;
		}
	}

	CoreGrid.setup = function() {

        /** @property {chart.builder} chart */
        /** @property {chart.axis} axis */
        /** @property {Object} grid */

		return {
            /**  @cfg {Number} [dist=0] Able to change the locatn of an axis.  */
			dist: 0,
			/**  @cfg {"top"/"left"/"bottom"/"right"} [orient=null] Specifies the direction in which an axis is shown (top, bottom, left or right). */
			orient: null,
            /** @cfg {Boolean} [hide=false] Determines whether to display an applicable grid.  */
			hide: false,
            /** @cfg {String/Object/Number} [color=null] Specifies the color of a grid. */
			color: null,
            /** @cfg {String} [title=null] Specifies the text shown on a grid.*/
			title: null,
            /** @cfg {Boolean} [hide=false] Determines whether to display a line on the axis background. */
			line: false,
			/** @cfg {Boolean} [hide=false] Determines whether to display the base line on the axis background. */
            baseline : true,
            /** @cfg {Function} [format=null]  Determines whether to format the value on an axis. */
			format: null,
            /** @cfg {Number} [textRotate=null] Specifies the slope of text displayed on a grid. */
			textRotate : null
		};
	}

	return CoreGrid;
}, "chart.draw"); 
jui.define("chart.grid.block", [ "util.scale", "util.base" ], function(UtilScale, _) {

    /**
     * @class chart.grid.block
     * Implements Block Grid
     * 
     *  { type : "block", domain : [ 'week1', 'week2', 'week3' ] } 
     * 
     * @extends chart.grid.core
     */
	var BlockGrid = function() {
        /**
         * @method top
         *
         * @protected
         */

		this.top = function(g) {
			this.drawTop(g, this.domain, this.points, null, -this.half_band);
			this.drawBaseLine("top", g);

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				});

				axis.append(this.line({
					y2 : -this.chart.theme("gridTickSize")
				}));

				g.append(axis);
			}
		}

        /**
         * @method bottom
         *
         * @protected
         */
		this.bottom = function(g) {
			this.drawBottom(g, this.domain, this.points, null, -this.half_band);
			this.drawBaseLine("bottom", g);

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				})

				axis.append(this.line({
					y2 : this.chart.theme("gridTickSize")
				}));

				g.append(axis);
			}

		}

        /**
         * @method left
         *
         * @protected
         */
		this.left = function(g) {
			this.drawLeft(g, this.domain, this.points, null, -this.half_band);
			this.drawBaseLine("left", g);

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				})

				axis.append(this.line({
					x2 : -this.chart.theme("gridTickSize")
				}));

				g.append(axis);
			}
		}
        
        /**
         * @method right
         *
         * @protected
         */
		this.right = function(g) {
			this.drawRight(g, this.domain, this.points, null, -this.half_band);
			this.drawBaseLine("right", g);

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				});

				axis.append(this.line({
					x2 : this.chart.theme("gridTickSize")
				}));

				g.append(axis);
			}

		}



		/**
		 * @method initDomain
         * block grid 에 대한 domain 설정
		 * @private 
		 */
		this.initDomain = function() {

			var domain = [];

			if (_.typeCheck("string", this.grid.domain)) {
				var field = this.grid.domain;
				var data = this.data();

				if (this.grid.reverse) {
					var start = data.length - 1,
						end = 0,
						step = -1;
				} else {
					var start = 0,
						end = data.length - 1,
						step = 1;
				}

				for (var i = start; ((this.grid.reverse) ? i >= end : i <=end); i += step) {
					domain.push(data[i][field]);
				}

				//grid.domain = domain;
			} else if (_.typeCheck("function", this.grid.domain)) {	// block 은 배열을 통째로 리턴함
				domain = this.grid.domain.call(this.chart);
			} else {
				domain = this.grid.domain;
			}

			if (this.grid.reverse) {
				domain.reverse();
			}

			return domain;

		}

        /**
         * @method drawBefore
         *
         * @protected
         */
		this.drawBefore = function() {
			var domain = this.initDomain();

			var obj = this.getGridSize();

			// scale 설정
			this.scale = UtilScale.ordinal().domain(domain);
			var range = [obj.start, obj.end];

			if (this.grid.full) {
				this.scale.rangeBands(range);
			} else {
				this.scale.rangePoints(range);
			}

			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.points = this.scale.range();
			this.domain = this.scale.domain();

			this.band = this.scale.rangeBand();
			this.half_band = (this.grid.full) ? 0 : this.band / 2;
			this.bar = 6;
			this.reverse = this.grid.reverse;
		}

        /**
         * @method draw 
         * 
         * @protected 
         * @return {Mixed}
         */
		this.draw = function() {
			return this.drawGrid("block");
		}
	}


	BlockGrid.setup = function() {
		return {
            /** @cfg {String/Array/Function} [domain=null] Sets the value displayed on an axis.*/
			domain: null,
            /** @cfg {Boolean} [reverse=false] Reverses the value on domain values*/
			reverse: false,
            /** @cfg {Number} [max=10] Sets the maximum value of a grid. */
			max: 10,
            /** @cfg {Boolean} [full=false] Determines whether to expand the reference coordinates to the entire range.*/
			full: false
		};
	}

	return BlockGrid;
}, "chart.grid.core");

jui.define("chart.grid.date", [ "util.time", "util.scale", "util.base" ], function(UtilTime, UtilScale, _) {

    /**
     * @class chart.grid.date
     *
     * implements date grid 
     *  
     * @extends chart.grid.core 
     */
	var DateGrid = function() {

		this.top = function(g) {
			this.drawTop(g, this.ticks, this.values);
			this.drawBaseLine("top", g);
		}

		this.bottom = function(g) {
			this.drawBottom(g, this.ticks, this.values);
			this.drawBaseLine("bottom", g);
		}

		this.left = function(g) {
			this.drawLeft(g, this.ticks, this.values);
			this.drawBaseLine("left", g);
		}

		this.right = function(g) {
			this.drawRight(g, this.ticks, this.values);
			this.drawBaseLine("right", g);
		}

        this.wrapper = function(scale, key) {
            var old_scale = scale;
            var self = this;

            function new_scale(i) {
                if (typeof i == 'number') {
                    return old_scale(self.axis.data[i][key]);
                } else {
                    return old_scale(+i);
                }
            }

            return (key) ? $.extend(new_scale, old_scale) : old_scale;
        }
        

		/**
		 * date grid 의 domain 설정
		 *
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성
		 *
		 */
		this.initDomain = function() {

			var domain = [];
			var step = [];

			var min = this.grid.min || undefined,
				max = this.grid.max || undefined;
			var data = this.data();

            var value_list = [] ;

			if (_.typeCheck("string", this.grid.domain) ) {
				if (data.length > 0) {
					var field = this.grid.domain;
					value_list.push(+data[0][field]);
					value_list.push(+data[data.length-1][field]);
				}
			} else if (_.typeCheck("function", this.grid.domain)) {
				var index = data.length;
				while(index--) {

            var value = this.grid.domain.call(this.chart, data[index]);

            if (_.typeCheck("array", value)) {
                value_list[index] = Math.max.apply(Math, value);
                value_list.push(Math.min.apply(Math, value));
            } else {
                value_list[index]  = value;
            }
        }

			} else {
				value_list = this.grid.domain;
			}

			if (_.typeCheck("undefined", min) && value_list.length > 0 ) min = Math.min.apply(Math, value_list);
			if (_.typeCheck("undefined", max) && value_list.length > 0 ) max = Math.max.apply(Math, value_list);

			this.grid.max = max;
			this.grid.min = min;
			domain = [this.grid.min, this.grid.max];
			step = this.grid.step;

			if (this.grid.reverse) {
				domain.reverse();
			}

			if (_.typeCheck("function", step)) {
				this.grid.step = step.call(this.chart, domain);
			} 
      
      // default second
      if (_.typeCheck("number", this.grid.step)) {
        this.grid.step = ["seconds", this.grid.step];
      }

			return domain;
		}

		this.drawBefore = function() {
			var domain = this.initDomain();

			var obj = this.getGridSize(),
				range = [obj.start, obj.end];

			this.scale = UtilScale.time().domain(domain).range(range);

			if (this.grid.realtime) {
				this.ticks = this.scale.realTicks(this.grid.step[0], this.grid.step[1]);
			} else {
				this.ticks = this.scale.ticks(this.grid.step[0], this.grid.step[1]);
			}

			if (this.axis.data.length == 0) {
				this.ticks = [];
			}

			if ( typeof this.grid.format == "string") {
				(function(grid, str) {
					grid.format = function(value) {
						return UtilTime.format(value, str);
					}	
				})(this.grid, this.grid.format)
			}

			// step = [this.time.days, 1];
			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.bar = 6;
			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = this.scale(this.ticks[i]);
			}
		}

		this.draw = function() {
			return this.drawGrid("date");
		}
	}

	DateGrid.setup = function() {
		return {
            /** @cfg {Array} [domain=null] Sets the value displayed on a grid. */
			domain: null,
            /** @cfg {Array} [step=[]] Sets the interval of the scale displayed on a grid.*/
			step: [],
            /** @cfg {Number} [min=null] Sets the minimum timestamp of a grid.  */
			min: null,
            /** @cfg {Number} [max=null] Sets the maximum timestamp of a grid. */
			max: null,
			/** @cfg {Boolean} [reverse=false] Reverses the value on domain values*/
			reverse: false,
            /** @cfg {String} [key=null] Sets the value on the grid to the value for the specified key. */
			key: null,
            /** @cfg {Boolean} [realtime=false] Determines whether to use as a real-time grid. */
			realtime: false
		};
	}

	return DateGrid;
}, "chart.grid.core");

jui.define("chart.grid.dateblock", [ "util.time", "util.scale", "util.base" ], function(UtilTime, UtilScale, _) {

    /**
     * @class chart.grid.dateblock 
     * 
     * implements date block grid
     *
     * @extends chart.grid.date  
     */
	var DateBlockGrid = function() {

		this.wrapper = function(scale, key) {
			var old_scale = scale;
			var self = this;

			old_scale.rangeBand = function() {
				return self.grid.unit;
			}

			return old_scale;
		}

		/**
		 * date grid 의 domain 설정
		 *
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성
		 *
		 */
		this.initDomain = function() {

			var min = this.grid.min || undefined,
				max = this.grid.max || undefined;
			var data = this.data();

            var value_list = [] ;

			if (_.typeCheck("string", this.grid.domain)) {
				var field = this.grid.domain;
				value_list.push(+data[0][field]);
				value_list.push(+data[data.length-1][field]);
			} else if (_.typeCheck("function", this.grid.domain)) {
				var index = data.length;
				while(index--) {

            var value = this.grid.domain.call(this.chart, data[index]);

            if (_.typeCheck("array", value)) {
                value_list[index] = +Math.max.apply(Math, value);
                value_list.push(+Math.min.apply(Math, value));
            } else {
                value_list[index]  = +value;
            }
        }


			} else {
				value_list = this.grid.domain;
			}

			if (_.typeCheck("undefined", min)) min = Math.min.apply(Math, value_list);
			if (_.typeCheck("undefined", max)) max = Math.max.apply(Math, value_list);

			this.grid.max = max;
			this.grid.min = min;
			var domain = [this.grid.min, this.grid.max];

			if (_.typeCheck("function", this.grid.step)) {
				this.grid.step = this.grid.call(this.chart, domain);
			}

      if (_.typeCheck("number", this.grid.step)) {
        this.grid.step = ["seconds", this.grid.step];
      }

			if (this.grid.reverse) {
				domain.reverse();
			}

			return domain;
		}

		this.drawBefore = function() {

			var self = this;
			var domain = this.initDomain();

			var obj = this.getGridSize(), range = [obj.start, obj.end];

			var time = UtilScale.time().domain(domain).rangeRound(range);
			var len = this.axis.data.length;

			var unit = this.grid.unit = Math.abs(range[0] - range[1])/(this.grid.full ? len- 1 : len);
			var half_unit = unit/2;


			if (this.grid.realtime) {
				this.ticks = time.realTicks(this.grid.step[0], this.grid.step[1]);
			} else {
				this.ticks = time.ticks(this.grid.step[0], this.grid.step[1]);
			}

			if ( typeof this.grid.format == "string") {
				(function(grid, str) {
					grid.format = function(value) {
						return UtilTime.format(value, str);
					}	
				})(this.grid, this.grid.format)
			}

			// step = [this.time.days, 1];
			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.bar = 6;
			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = time(this.ticks[i]);
			}

			this.scale = $.extend((function(i) {
				return  i * unit + (self.grid.full ? 0 : half_unit);
			}), time);

		}

		this.draw = function() {
			return this.drawGrid("dateblock");
		}
	}

	DateBlockGrid.setup = function() {
		return {
			/** @cfg {Boolean} [full=true] */
			full: true
		};
	}

	return DateBlockGrid;
}, "chart.grid.date");

jui.define("chart.grid.radar", [ "util.math", "util.base" ], function(math, _) {

	/**
	 * @class chart.grid.radar
	 *
	 * Radar 형태의 그리드
	 *
	 * @extends chart.grid.core
	 */
	var RadarGrid = function() {
		var self = this,
			position = [];

		function drawCircle(root, centerX, centerY, x, y, count) {
			var r = Math.abs(y),
				cx = centerX,
				cy = centerY;

			root.append(self.chart.svg.circle({
				cx : cx,
				cy : cy,
				r : r,
				"fill-opacity" : 0,
				stroke : self.color("gridAxisBorderColor"),
				"stroke-width" : self.chart.theme("gridBorderWidth")
			}));
		}

		function drawRadial(root, centerX, centerY, x, y, count, unit) {
			var g = self.chart.svg.group();
			var points = [];

			points.push([centerX + x, centerY + y]);

			var startX = x,
				startY = y;

			for (var i = 0; i < count; i++) {
				var obj = math.rotate(startX, startY, unit);

				startX = obj.x;
				startY = obj.y;

				points.push([centerX + obj.x, centerY + obj.y]);
			}

			var path = self.chart.svg.path({
				"fill" : "none",
				stroke : self.color("gridAxisBorderColor"),
				"stroke-width" : self.chart.theme("gridBorderWidth")
			});

			for (var i = 0; i < points.length; i++) {
				var point = points[i];

				if (i == 0) {
					path.MoveTo(point[0], point[1])
				} else {
					path.LineTo(point[0], point[1]);
				}
			}

			path.LineTo(points[0][0], points[0][1]);
			//path.ClosePath();

			g.append(path);
			root.append(g);
		}

        function scale(obj) {
            var max = self.grid.max;

            var dx = self.chart.padding('left');
            var dy = self.chart.padding('top');

            return function(index, value) {
                var rate = value / max;

				var height = Math.abs(obj.y1) - Math.abs(obj.y2),
					pos = height * rate,
					unit = 2 * Math.PI / self.domain.length;

				var cx = obj.x1,
					cy = obj.y1,
					y = -pos,
					x = 0;

                var o = math.rotate(x, y, unit * index);
                
                var result = {
                    x : dx + cx + o.x,
                    y : dy + cy + o.y
                }

                return result;
            }
        }


		/**
		 * block,radar grid 에 대한 domain 설정
		 *
		 */
		this.initDomain = function() {
			var domain = [];
			if (_.typeCheck("string", this.grid.domain)) {
				var field = this.grid.domain;
				var data = this.data();

				if (this.grid.reverse) {
					var start = data.length - 1,
						end = 0,
						step = -1;
				} else {
					var start = 0,
						end = data.length - 1,
						step = 1;
				}

				for (var i = start; ((this.grid.reverse) ? i >= end : i <=end); i += step) {
					domain.push(data[i][field]);
				}

				//grid.domain = domain;
			} else if (_.typeCheck("function", this.grid.domain)) {	// block 은 배열을 통째로 리턴함
				domain = this.grid.domain(this.chart, this.grid);
			} else {
				domain = this.grid.domain;
			}

			if (this.grid.reverse) {
				domain.reverse();
			}

			return domain;

		}

		this.drawBefore = function() {
			this.domain = this.initDomain();
		}

		this.draw = function() {
			var width = this.axis.area('width'), height = this.axis.area('height');
			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			var w = min / 2,
				centerX = this.axis.area('x') + width / 2,
				centerY = this.axis.area('y') + height / 2;

			var startY = -w,
				startX = 0,
				count = this.domain.length,
				step = this.grid.step,
				unit = 2 * Math.PI / count,
				h = Math.abs(startY) / step;

			var g = this.chart.svg.group(),
				root = this.chart.svg.group();

			g.append(root);

			// domain line
			position = [];

			for (var i = 0; i < count; i++) {
				var x2 = centerX + startX,
					y2 = centerY + startY;

				root.append(this.chart.svg.line({
					x1 : centerX,
					y1 : centerY,
					x2 : x2,
					y2 : y2,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridBorderWidth")
				}));

				position[i] = {
					x1 : centerX,
					y1 : centerY,
					x2 : x2,
					y2 : y2
				};

				var ty = y2,
					tx = x2,
					talign = "middle";

				if (y2 > centerY) {
					ty = y2 + 20;
				} else if (y2 < centerY) {
					ty = y2 - 10;
				}

				if (x2 > centerX) {
					talign = "start";
					tx += 10;
				} else if (x2 < centerX) {
					talign = "end";
					tx -= 10;
				}

				if (!this.grid.hideText) {
					root.append(this.chart.text({
						x : tx,
						y : ty,
						"text-anchor" : talign,
						fill : this.chart.theme("gridFontColor")
					}, this.domain[i]))
				}
				
				var obj = math.rotate(startX, startY, unit);

				startX = obj.x;
				startY = obj.y;
			}

			if (!this.grid.line) {
				return {
					root : root , 
					scale : scale(position[0])
				};
			}

			// area split line
			startY = -w;
			var stepBase = 0,
				stepValue = this.grid.max / this.grid.step;

			for (var i = 0; i < step; i++) {
				if (i == 0 && this.grid.extra) {
					startY += h;
					continue;
				}

				if (this.grid.shape == "circle") {
					drawCircle(root, centerX, centerY, 0, startY, count);
				} else {
					drawRadial(root, centerX, centerY, 0, startY, count, unit);
				}

				if (!this.grid.hideText) {
					root.append(this.chart.text({
						x : centerX,
						y : centerY + (startY + h - 5),
						fill : this.chart.theme("gridFontColor")
					}, (this.grid.max - stepBase) + ""))
				}

				startY += h;
				stepBase += stepValue;
			}
			
			// hide
			if (this.grid.hide) {
				root.attr({ display : "none" })
			}			

			return {
				root : root, 
				scale : scale(position[0])
			};
		}
	}

	RadarGrid.setup = function() {
		return {
			/** @cfg {String/Array/Function} [domain=null] Sets the value displayed on an axis.*/
			domain: null,
			/** @cfg {Boolean} [reverse=false] Reverses the value on domain values*/
			reverse: false,
			/** @cfg {Number} [max=null] Sets the maximum value of a grid. */
			max: 100,
			/** @cfg {Array} [step=10] Sets the interval of the scale displayed on a grid. */
            step : 10,
			/** @cfg {Boolean} [line=true] Determines whether to display a line on the axis background. */
			line: true,
			/** @cfg {Boolean} [hideText=false] Determines whether to show text across the grid. */
			hideText: false,
			/** @cfg {Boolean} [extra=false] Leaves a certain spacing distance from the grid start point and displays a line where the spacing ends. */
			extra: false,
			/** @cfg {"radial"/"circle"} [shape="radial"] Determines the shape of a grid (radial, circle). */
			shape: "radial" // or circle
		};
	}

	return RadarGrid;
}, "chart.grid.core");

jui.define("chart.grid.range", [ "util.scale", "util.base" ], function(UtilScale, _) {

	/**
	 * @class chart.grid.range
	 *
	 * implements range grid
	 *
	 * @extends chart.grid.core
	 */
	var RangeGrid = function() {
		this.top = function(g) {
			var min = this.scale.min();
			var max = this.scale.max();
			this.drawTop(g, this.ticks, this.values, function(tick, index) {
				return tick == 0 && tick != min && tick != max;
			});
			this.drawBaseLine("top", g);
		}

		this.bottom = function(g) {
			var min = this.scale.min();
			var max = this.scale.max();
			this.drawBottom(g, this.ticks, this.values, function(tick, index) {
				return tick == 0 && tick != min && tick != max;
			});
			this.drawBaseLine("bottom", g);
		}

		this.left = function(g) {
			var min = this.scale.min();
			var max = this.scale.max();

			this.drawLeft(g, this.ticks, this.values, function(tick, index) {
				return tick == 0 && tick != min && tick != max;
			});

			this.drawBaseLine("left", g);
		}

		this.right = function(g) {
			var min = this.scale.min();
			var max = this.scale.max();
			this.drawRight(g, this.ticks, this.values, function(tick, index) {
				return tick == 0 && tick != min && tick != max;
			});

			this.drawBaseLine("right", g);
		}

        this.wrapper = function(scale, key) {
            var old_scale = scale;
            var self = this;

            function new_scale(i) {
                return old_scale(self.axis.data[i][key]);
            }

            return (key) ? $.extend(new_scale, old_scale) : old_scale;
        }

		/**
		 * range grid 의 domain 설정
		 *
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성
		 *
		 */
		this.initDomain = function() {

			var domain = [];
			var min = this.grid.min || undefined,
				max = this.grid.max || undefined,
				data = this.data();
			var value_list = [];
			var isArray = false;

			if (_.typeCheck("string", this.grid.domain)) {
				var field = this.grid.domain;

				value_list = new Array(data.length);
				var index = data.length;
				while(index--) {
					var value = data[index][field];

					if (_.typeCheck("array", value)) {
						value_list[index] = Math.max(value);
						value_list.push(Math.min(value));
					} else {
						value_list[index]  = value;
						value_list.push(0);
					}
				}
			} else if (_.typeCheck("function", this.grid.domain)) {
				value_list = new Array(data.length);

                var isCheck = false;
				var index = data.length;
				while(index--) {

					var value = this.grid.domain.call(this.chart, data[index]);

					if (_.typeCheck("array", value)) {

						value_list[index] = Math.max.apply(Math, value);
						value_list.push(Math.min.apply(Math, value));
					} else {
						value_list[index]  = value;

                        if (!isCheck) {
                            value_list.push(0);
                            isCheck = true;
                        }

					}
				}
			} else {
				value_list = this.grid.domain;
				isArray = true;
			}

			var tempMin = Math.min.apply(Math, value_list);
			var tempMax = Math.max.apply(Math, value_list);

			if (isArray) {
				min = tempMin;
				max = tempMax;
			} else {
				if (typeof min == 'undefined' || min > tempMin) min = tempMin;
				if (typeof max == 'undefined' || max < tempMax) max = tempMax;
			}

			this.grid.max = max;
			this.grid.min = min;

			var unit;

			if (_.typeCheck("function", this.grid.unit)) {
				unit = this.grid.unit.call(this.chart, this.grid);
			} else if (_.typeCheck("number", this.grid.unit)) {
				unit = this.grid.unit;
			} else {
				unit = Math.ceil((max - min) / this.grid.step);
			}

			if (unit == 0) {
				domain = [0, 0];
			} else {

				var start = 0;

				while (start < max) {
					start += unit;
				}

        var end = start;
        while (end > min) {
          end -= unit;
        }
        
				domain = [end, start];

				this.grid.step = (Math.abs(end - start) / unit);
			}

			if (this.grid.reverse) {
				domain.reverse();
			}
            
			return domain;
		}

		this.drawBefore = function() {
			var domain = this.initDomain();

			var obj = this.getGridSize();

			this.scale = UtilScale.linear().domain(domain);

			if (this.grid.orient == "left" || this.grid.orient == "right") {
                var arr = [obj.end, obj.start];
			} else {
                var arr = [obj.start, obj.end]
			}
            this.scale.range(arr);
			this.scale.clamp(this.grid.clamp)

			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.step = this.grid.step;
			this.nice = this.grid.nice;
			this.ticks = this.scale.ticks(this.step, this.nice);

			this.bar = 6;

			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = this.scale(this.ticks[i]);
			}

		}

		this.draw = function() {
			return this.drawGrid("range");
		}
	}

	RangeGrid.setup = function() {
		return {
			/** @cfg {String/Array/Function} [domain=null] Sets the value displayed on an axis.*/
			domain: null,
			/** @cfg {Array} [step=10] Sets the interval of the scale displayed on a grid. */
			step: 10,
			/** @cfg {Number} [min=0] Sets the minimum value of a grid.  */
			min: 0,
			/** @cfg {Number} [max=0] Sets the maximum value of a grid. */
			max: 0,
			/** @cfg {Number} [unit=null] Multiplies the axis value to be displayed.  */
			unit: null,
			/**
			 * @cfg {Boolean} [clamp=true]
			 *
			 * max 나 min 을 넘어가는 값에 대한 체크,
			 * true 이면 넘어가는 값도 min, max 에서 조정, false 이면  비율로 계산해서 넘어가는 값 적용
			 */
			clamp : true,
			/** @cfg {Boolean} [reverse=false] Reverses the value on domain values*/
			reverse: false,
			/** @cfg {String} [key=null] Sets the value on the grid to the value for the specified key. */
			key: null,
			/** @cfg {Boolean} [hideText=false] Determines whether to show text across the grid. */
			hideText: false,
			/** @cfg {Boolean} [nice=false] Automatically sets the value of a specific section.  */
			nice: false
		};
	}

	return RangeGrid;
}, "chart.grid.core");

jui.define("chart.grid.log", [ "util.scale", "util.base" ], function(UtilScale, _) {

	/**
	 * @class chart.grid.log
	 *
	 * implements log grid
	 *
	 * @extends chart.grid.range
	 */
	var LogGrid = function() {

		this.drawBefore = function() {
			this.grid.unit = false;

			var domain = this.initDomain();

			var obj = this.getGridSize();

			this.scale = UtilScale.log(this.grid.base).domain(domain);

			if (this.grid.orient == "left" || this.grid.orient == "right") {
                var arr = [obj.end, obj.start];
			} else {
                var arr = [obj.start, obj.end]
			}
            this.scale.range(arr);

			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.step = this.grid.step;
			this.nice = this.grid.nice;
			this.ticks = this.scale.ticks(this.step, this.nice);

			this.bar = 6;

			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = this.scale(this.ticks[i]);
			}

		}

		this.draw = function() {
			return this.drawGrid("log");
		}
	}

	LogGrid.setup = function() {
		return {
			/** @cfg {Number} [base=10] log's base */
			base : 10,

			step : 4,

			nice : false
		};
	}

	return LogGrid;
}, "chart.grid.range");

jui.define("chart.grid.rule", [ "util.scale", "util.base" ], function(UtilScale, _) {

	/**
	 * @class chart.grid.rule
	 *
	 * implements rule grid
	 *
	 * @extends chart.grid.core
	 */
	var RuleGrid = function() {

		this.top = function(g) {
			var height = this.axis.area('height'),
				half_height = height/2;

			g.append(this.axisLine({
				y1 : this.center ? half_height : 0,
				y2 : this.center ? half_height : 0,
				x1 : this.start,
				x2 : this.end
			}));

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0),
					axis = this.chart.svg.group().translate(values[i], (this.center) ? half_height : 0)

				axis.append(this.line({
				  y1 : (this.center) ? -bar : 0,
					y2 : bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridBorderWidth")
				}));

				if (!isZero || (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(this.chart.text({
						x : 0,
						y : bar + bar + 4,
						"text-anchor" : "middle",
						fill : this.chart.theme("gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.bottom = function(g) {
			var height = this.axis.area('height'),
				half_height = height/2;
		  
			g.append(this.axisLine({
				y1 : this.center ? -half_height : 0,
				y2 : this.center ? -half_height : 0,
				x1 : this.start,
				x2 : this.end
			}));

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0),
					axis = this.chart.svg.group().translate(values[i], (this.center) ? -half_height : 0);

				axis.append(this.line({
				  y1 : (this.center) ? -bar : 0,
					y2 : (this.center) ? bar : -bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridBorderWidth")
				}));
				
				if (!isZero ||  (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(this.chart.text({
						x : 0,
						y : -bar * 2,
						"text-anchor" : "middle",
						fill : this.chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.left = function(g) {
			var width = this.axis.area('width'),
				height = this.axis.area('height'),
				half_width = width/2;

			g.append(this.axisLine({
				x1 : this.center ? half_width : 0,
				x2 : this.center ? half_width : 0,
				y1 : this.start ,
				y2 : this.end
			}));

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0),
					axis = this.chart.svg.group().translate((this.center) ? half_width : 0, values[i])

				axis.append(this.line({
					x1 : (this.center) ? -bar : 0,
					x2 : bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridBorderWidth")
				}));
				
				if (!isZero ||  (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(this.chart.text({
					  x : bar/2 + 4,
					  y : bar-2,
					  fill : this.chart.theme("gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.right = function(g) {
			var width = this.axis.area('width'),
				half_width = width/2;

			g.append(this.axisLine({
				x1 : this.center ? -half_width : 0,
				x2 : this.center ? -half_width : 0,
				y1 : this.start ,
				y2 : this.end
			}));

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0),
					axis = this.chart.svg.group().translate((this.center) ? -half_width : 0, values[i]);

				axis.append(this.line({
					x1 : (this.center) ? -bar : 0,
					x2 : (this.center) ? bar : -bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridBorderWidth")
				}));

				if (!isZero ||  (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(this.chart.text({
						x : -bar - 4,
						y : bar-2,
						"text-anchor" : "end",
						fill : this.chart.theme("gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

        this.wrapper = function(scale, key) {
            var old_scale = scale;
            var self = this;

            function new_scale(i) {
                return old_scale(self.axis.data[i][key]);
            }

            return (key) ? $.extend(new_scale, old_scale) : old_scale;
        }
        
		/**
		 * range grid 의 domain 설정
		 *
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성
		 *
		 */
        this.initDomain = function() {

			var domain = [];
            var min = this.grid.min || undefined,
                max = this.grid.max || undefined,
                data = this.data();
            var value_list = [];

            if (_.typeCheck("string", this.grid.domain)) {
                var field = this.grid.domain;

                value_list = new Array(data.length);
                for (var index = 0, len = data.length; index < len; index++) {

                    var value = data[index][field];

                    if (_.typeCheck("array", value)) {
                        value_list[index] = Math.max(value);
                        value_list.push(Math.min(value));
                    } else {
                        value_list[index]  = value;
                    }

                }
            } else if (_.typeCheck("function", this.grid.domain)) {
                value_list = new Array(data.length);

                for (var index = 0, len = data.length; index < len; index++) {

                    var value = this.grid.domain.call(this.chart, data[index]);

                    if (_.typeCheck("array", value)) {

                        value_list[index] = Math.max.apply(Math, value);
                        value_list.push(Math.min.apply(Math, value));
                    } else {
                        value_list[index]  = value;
                    }
                }
            } else {
                value_list = grid.domain;
            }

            var tempMin = Math.min.apply(Math, value_list);
            var tempMax = Math.max.apply(Math, value_list);

            if (typeof min == 'undefined') min = tempMin;
            if (typeof max == 'undefined') max = tempMax;

            this.grid.max = max;
            this.grid.min = min;

            var unit;

            if (_.typeCheck("function", this.grid.unit)) {
                unit = this.grid.unit.call(this.chart, this.grid);
            } else if (_.typeCheck("number", this.grid.unit)) {
                unit = this.grid.unit;
            } else {
                unit = Math.ceil((max - min) / this.grid.step);
            }

            if (unit == 0) {
                domain = [0, 0];
            } else {

                var start = 0;

                while (start < max) {
                    start += unit;
                }

                var end = start;
                while (end > min) {
                    end -= unit;
                }

                domain = [end, start];
                //this.grid.step = Math.abs(start / unit) + Math.abs(end / unit);
            }

            if (this.grid.reverse) {
                domain.reverse();
            }

            return domain;
        }

		this.drawBefore = function() {
			var domain = this.initDomain();

			var obj = this.getGridSize();
			this.scale = UtilScale.linear().domain(domain);

            if (this.grid.orient == "left" || this.grid.orient == "right") {
                var arr = [obj.end, obj.start];
            } else {
                var arr = [obj.start, obj.end]
            }
            this.scale.range(arr);

			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.step = this.grid.step;
			this.nice = this.grid.nice;
			this.ticks = this.scale.ticks(this.step, this.nice);
			this.bar = 6;
			this.hideZero = this.grid.hideZero;
			this.center = this.grid.center;
			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = this.scale(this.ticks[i]);
			}
		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "rule", grid);
		}
	}

	RuleGrid.setup = function() {
		return {
			/** @cfg {String/Array/Function} [domain=null] Sets the value displayed on an axis.*/
			domain: null,
			/** @cfg {Array} [step=10] Sets the interval of the scale displayed on a grid. */
			step: 10,
			/** @cfg {Number} [min=0] Sets the minimum value of a grid.  */
			min: 0,
			/** @cfg {Number} [max=0] Sets the maximum value of a grid. */
			max: 0,
			/** @cfg {Number} [unit=null] Multiplies the axis value to be displayed.  */
			unit: null,
			/**
			 * @cfg {Boolean} [clamp=true]
			 *
			 * max 나 min 을 넘어가는 값에 대한 체크,
			 * true 이면 넘어가는 값도 min, max 에서 조정, false 이면  비율로 계산해서 넘어가는 값 적용
			 */
			clamp : true,
			/** @cfg {Boolean} [reverse=false] Reverses the value on domain values*/
			reverse: false,
			/** @cfg {String} [key=null] Sets the value on the grid to the value for the specified key. */
			key: null,
			/** @cfg {Boolean} [hideText=false] Determines whether to show text across the grid. */
			hideText: false,
			/** @cfg {Boolean} [hideZero=false] Determines whether to show '0' displayed on the grid. */
			hideZero: false,
			/** @cfg {Boolean} [nice=false] Automatically sets the value of a specific section.  */
			nice: false,
			/** @cfg {Boolean} [center=false] Place the reference axis in the middle.  */
			center: false

		};
	}

	return RuleGrid;
}, "chart.grid.core");

jui.define("chart.grid.panel", [  ], function() {

    /**
     * @class chart.grid.panel
     *
     * implements default panel grid
     *
     * @extends chart.grid.core
     */
    var PanelGrid = function() {

        /**
         * @method custom
         *
         * draw sample panel area
         *
         * @param {ChartBuilder} chart
         * @param {SVGElement} g
         * @protected
         */
        this.custom = function(g) {
            var obj = this.scale(0);

            obj.x -= this.axis.area('x');
            obj.y -= this.axis.area('y');

            var rect = this.chart.svg.rect($.extend(obj, {
                fill : 'tranparent',
                stroke : "white"
            }));

            g.append(rect);
        }

        /**
         * @method drawBefore
         *
         * initialize grid option before draw grid
         *
         */
        this.drawBefore = function() {

            /**
             * @method scale
             *
             * get scale function
             *
             */
            this.scale = (function(axis) {
                return function(i) {

                    return {
                        x : axis.area('x'),
                        y : axis.area('y'),
                        width : axis.area('width'),
                        height : axis.area('height')
                    }
                }
            })(this.axis);

        }

        /**
         * @method draw
         *
         *
         * @returns {Object}
         * @returns {util.scale} scale  return scale be used in grid
         * @returns {SVGElement} root grid root element
         * @protected
         */
        this.draw = function() {
            this.grid.hide = true;
            return this.drawGrid("panel");
        }
    }
    
    return PanelGrid;
}, "chart.grid.core");

jui.define("chart.grid.table", [  ], function() {

    /**
     * @class chart.grid.table
     *
     * implements table grid 
     *
     * @extends chart.grid.core
     */
    var TableGrid = function(chart, axis, grid) {
        var rowUnit, columnUnit, outerPadding, row, column ;

        this.custom = function(g) {
            for(var r = 0; r < row; r++) {
                for (var c = 0; c < column; c++) {
                    var index = r * column + c;

                    var obj = this.scale(index);
                    
                    obj.x -= this.axis.area('x');
                    obj.y -= this.axis.area('y');

                    var rect = this.chart.svg.rect($.extend(obj, {
                        fill : 'tranparent',
                        stroke : "black"
                    }));

                    //g.append(rect);
                }
            }
        }

        this.drawBefore = function() {

            var row = this.grid.rows;
            var column = this.grid.columns;
            
            padding = this.grid.padding;
            
            var columnUnit = (this.axis.area('width') -  (column - 1) * padding) / column;
            var rowUnit = (this.axis.area('height') - (row - 1) * padding ) / row;

            // create scale
            this.scale = (function(axis, row, column, rowUnit, columnUnit) {
                return function(i) {

                    var r = Math.floor(i  / column) ;
                    var c = i % column;

                    var x = c * columnUnit;
                    var y = r * rowUnit;

                    var space = padding * c;
                    var rspace = padding * r;

                    return {
                        x : axis.area('x') + x +  space,
                        y : axis.area('y') + y + rspace,
                        width : columnUnit,
                        height : rowUnit
                    }
                }
            })(this.axis, row, column, rowUnit, columnUnit);
        }

        /**
         * @method draw
         *
         *
         * @return {Object}
         * @return {util.scale} return.scale  return scale be used in grid
         * @return {SVGElement} return.root grid root element
         * @protected
         */
        this.draw = function() {
            this.grid.hide = true;
            return this.drawGrid("table");
        }
    }

    TableGrid.setup = function() {
        return {
            /** @cfg {Number} [rows=1] row count in table  */
            rows: 1,
            /** @cfg {Number} [column=1] column count in table  */
            columns: 1,
            /** @cfg {Number} [padding=1] padding in table  */
            padding: 10
        };
    }
    
    return TableGrid;
}, "chart.grid.core");

jui.define("chart.grid.overlap", [  ], function() {

    /**
     * @class chart.grid.overlap
     *
     * implements overlap grid be used in multiple pie or donut chart
     *
     * @param chart
     * @param axis
     * @param grid
     * @extends chart.grid.core
     */
    var OverlapGrid = function() {
        var size, widthUnit, heightUnit, width, height ;

        this.custom = function() {
            for(var i = 0, len = this.axis.data.length; i < len; i++) {
                var obj = this.scale(i);

                obj.x -= this.axis.area("x");
                obj.y -= this.axis.area("y");

                this.chart.svg.rect($.extend(obj, {
                    fill : "transparent",
                    stroke : "transparent"
                }));
            }
        }

        this.drawBefore = function() {
            size = this.grid.count || this.axis.data.length ||  1;

            widthUnit = (this.axis.area('width') / 2) / size;
            heightUnit = (this.axis.area('height') / 2) / size;

            width = this.axis.area('width');
            height = this.axis.area('height');

            // create scale
            this.scale = (function(axis) {
                return function(i) {

                    var x = i * widthUnit;
                    var y = i * heightUnit;

                    return {
                        x : axis.area('x') + x,
                        y : axis.area('y') + y,
                        width : Math.abs(width/2 - x)*2,
                        height : Math.abs(height/2 - y)*2
                    }

                }
            })(this.axis);

        }

        /**
         * @method draw
         *
         *
         * @returns {Object}
         * @returns {util.scale} scale  return scale be used in grid
         * @returns {SVGElement} root grid root element
         * @protected
         */
        this.draw = function() {
            this.grid.hide = true;
            return this.drawGrid("overlap");
        }

    }

    OverlapGrid.setup = function() {
        return {
            /** @cfg {Number} [count=null] Splited count  */
            count : null
        }
    }
    
    return OverlapGrid;
}, "chart.grid.core");

jui.define("chart.grid.topologytable", [ "util.base" ], function(_) {

    /**
     * @class chart.grid.topologytable
     *
     * 토폴로지 배치를 위한 grid
     *
     * @extends chart.grid.core
     */
    var TopologyTableGrid = function() {
        var self = this,
            area, size, data_cnt,
            cache = {};

        function getDataIndex(key) {
            var index = null,
                data = self.axis.data;

            for(var i = 0, len = data.length; i < len; i++) {
                if(self.axis.getValue(data[i], "key") == key) {
                    index = i;
                    break;
                }
            }

            return index;
        }

        function initDefaultXY() {
            var row_cnt = Math.floor(area.height / size),
                col_cnt = Math.floor(area.width / size),
                col_step = Math.floor(col_cnt / data_cnt),
                col_index = 0;

            var left = -1,
                right = data_cnt;

            for(var i = 0; i < data_cnt; i++) {
                var x = 0, y = 0, index = 0;

                if(i % 2 == 0) {
                    x = col_index * size;
                    y = getRandomRowIndex(row_cnt) * size;
                    col_index += col_step;

                    left += 1;
                    index = left;
                } else {
                    x = (col_cnt - col_index) * size + size;
                    y = getRandomRowIndex(row_cnt) * size;

                    right -=1;
                    index = right;
                }

                self.axis.cacheXY[index] = {
                    x: x + size,
                    y: y + (size / 2)
                };
            }

            function getRandomRowIndex() {
                var row_index = Math.floor(Math.random() * row_cnt);

                if(cache[row_index]) {
                    var cnt = 0;
                    for(var k in cache) { cnt++; }

                    if(cnt < row_cnt) {
                        return getRandomRowIndex(row_cnt);
                    } else {
                        cache = {};
                    }
                } else {
                    cache[row_index] = true;
                }

                return row_index;
            }
        }

        function initRandomXY() {
            for(var i = 0; i < data_cnt; i++) {
                var x = Math.floor(Math.random() * (area.width - size)),
                    y = Math.floor(Math.random() * (area.height - size));

                self.axis.cacheXY[i] = {
                    x: x,
                    y: y
                };
            }
        }

        /**
         * @method drawBefore
         *
         * initialize grid option before draw grid
         *
         */
        this.drawBefore = function() {
            area = this.chart.area();
            size = this.grid.space;
            data_cnt = this.axis.data.length;

            // 최초 한번만 데이터 생성
            if(!this.axis.cacheXY) {
                this.axis.cacheXY = [];

                if(this.grid.sort == "random") {
                    initRandomXY();
                } else {
                    initDefaultXY();
                }
            }

            /**
             * @method scale
             *
             * get scale function
             *
             */
            this.scale = (function() {
                return function(index) {
                    var index = (_.typeCheck("string", index)) ? getDataIndex(index) : index;

                    var func = {
                        setX: function(value) {
                            self.axis.cacheXY[index].x = value;
                        },
                        setY: function(value) {
                            self.axis.cacheXY[index].y = value;
                        },
                        moveLast: function() {
                            var target1 = self.axis.cacheXY.splice(index, 1);
                            self.axis.cacheXY.push(target1[0]);

                            var target2 = self.axis.data.splice(index, 1);
                            self.axis.data.push(target2[0]);
                        }
                    }

                    return _.extend(func, self.axis.cacheXY[index]);
                }
            })(this.axis);
        }

        /**
         * @method draw
         *
         *
         * @returns {Object}
         * @returns {util.scale} return.scale  return scale be used in grid
         * @returns {SVGElement} return.root grid root element
         * @protected
         */
        this.draw = function() {
            this.grid.hide = true;
            return this.drawGrid();
        }
    }

    TopologyTableGrid.setup = function() {
        return {
            /** @cfg {String} [sort=null]  */
            sort: null, // or random
            /** @cfg {Number} [space=50]  */
            space: 50
        }
    }
    
    return TopologyTableGrid;
}, "chart.grid.core");

jui.define("chart.grid.grid3d", [ "util.base", "util.math" ], function(_, math) {

    /**
     * @class chart.grid.grid3d
     *
     * 토폴로지 배치를 위한 grid
     *
     * @extends chart.grid.core
     */
    var Grid3D = function() {
        var self = this,
            depth = 0,
            degree = 0,
            radian = 0;

        function getElementAttr(root) {
            var attr = null;

            root.each(function(i, elem) {
                if(elem.element.nodeName == "line") {
                    attr = elem.attributes;
                }
            });

            return attr;
        }

        /**
         * @method drawBefore
         *
         * initialize grid option before draw grid
         *
         */
        this.drawBefore = function() {
            depth = this.axis.get("depth");
            degree = this.axis.get("degree");
            radian = math.radian(360 - degree);

            /**
             * @method scale
             *
             * get scale function
             *
             */
            this.scale = (function() {
                return function(x, y, z, count) {
                    var step = _.typeCheck("integer", count) ? count : 1,
                        split = depth / step;

                    if(z == undefined || step == 1) {
                        return {
                            x: self.axis.x(x),
                            y: self.axis.y(y),
                            depth: split
                        }
                    } else {
                        var z = (z == undefined) ? 0 : z,
                            c = split * z,
                            top = Math.sin(radian) * split;

                        return {
                            x: self.axis.x(x) + Math.cos(radian) * c,
                            y: (self.axis.y(y) + Math.sin(radian) * c) + top,
                            depth: split
                        }
                    }
                }
            })(this.axis);

            this.scale.depth = depth;
            this.scale.degree = degree;
            this.scale.radian = radian;
        }

        /**
         * @method draw
         *
         *
         * @returns {Object}
         * @returns {util.scale} return.scale  return scale be used in grid
         * @returns {SVGElement} return.root grid root element
         * @protected
         */
        this.draw = function() {
            var xRoot = this.axis.x.root,
                yRoot = this.axis.y.root;

            var y2 = Math.sin(radian) * depth,
                x2 = Math.cos(radian) * depth;

            yRoot.each(function(i, elem) {
                if(elem.element.nodeName == "line") {
                    yRoot.append(self.line({
                        x1 : x2,
                        y1 : 0,
                        x2 : x2,
                        y2 : y2 + elem.attributes.y2
                    }));
                } else {
                    // X축 라인 속성 가져오기
                    var xAttr = getElementAttr(xRoot);

                    elem.append(self.line({
                        x1 : 0,
                        y1 : 0,
                        x2 : x2,
                        y2 : y2
                    }));

                    elem.append(self.line({
                        x1 : x2,
                        y1 : y2,
                        x2 : x2 + xAttr.x2,
                        y2 : y2
                    }));
                }
            });

            xRoot.each(function(i, elem) {
                var attr = (elem.element.nodeName == "line") ? elem.attributes : elem.get(0).attributes,
                    y2 = attr.y1 + Math.sin(radian) * depth,
                    x2 = attr.x1 + Math.cos(radian) * depth;

                if(i > 0) {
                    // Y축 라인 속성 가져오기
                    var yAttr = getElementAttr(yRoot);

                    elem.append(self.line({
                        x1 : attr.x1,
                        y1 : attr.y1,
                        x2 : x2,
                        y2 : y2
                    }));

                    elem.append(self.line({
                        x1 : x2,
                        y1 : y2,
                        x2 : x2,
                        y2 : -(yAttr.y2 - y2)
                    }));
                }
            });

            return this.drawGrid();
        }
    }

    Grid3D.setup = function() {
        return {
            /** @cfg {Array} [domain=null] */
            domain: null
        }
    }
    
    return Grid3D;
}, "chart.grid.core");

jui.define("chart.brush.core", [ "jquery", "util.base" ], function($, _) {
    /**
     * @class chart.brush.core
     *
     * implements core method for brush
     *
     * @abstract
     * @extends chart.draw
     * @requires jquery
     * @requires util.base
     */
	var CoreBrush = function() {

        function getMinMaxValue(data, target) {
            var seriesList = {},
                targetList = {};

            for(var i = 0; i < target.length; i++) {
                if (!seriesList[target[i]]) {
                    targetList[target[i]] = [];
                }
            }

            // 시리즈 데이터 구성
            for(var i = 0, len = data.length; i < len; i++) {
                var row = data[i];

                for(var k in targetList) {
                    targetList[k].push(row[k]);
                }
            }

            for(var key in targetList) {
                seriesList[key] = {
                    min : Math.min.apply(Math, targetList[key]),
                    max : Math.max.apply(Math, targetList[key])
                }
            }

            return seriesList;
        }

        this.drawAfter = function(obj) {
            if(this.brush.clip !== false) {
                obj.attr({ "clip-path" : "url(#" + this.axis.get("clipId") + ")" });
            }

            obj.attr({ "class": "brush brush-" + this.brush.type });
            obj.translate(this.chart.area("x"), this.chart.area("y")); // 브러쉬일 경우, 기본 좌표 설정
        }

        this.drawTooltip = function(fill, stroke, opacity) {
            var self = this,
                tooltip = null;

            function draw() {
                return self.chart.svg.group({ "visibility" : "hidden" }, function() {
                    self.chart.text({
                        "text-anchor" : "middle",
                        "font-weight" : self.chart.theme("tooltipPointFontWeight"),
                        opacity: opacity
                    });

                    self.chart.svg.circle({
                        r: self.chart.theme("tooltipPointRadius"),
                        fill: fill,
                        stroke: stroke,
                        opacity: opacity,
                        "stroke-width": self.chart.theme("tooltipPointBorderWidth")
                    });
                });
            }

            function show(orient, x, y, value) {
                var text = tooltip.get(0);
                text.element.textContent = value;

                if(orient == "left") {
                    text.attr({ x: -7, y: 4, "text-anchor": "end" });
                } else if(orient == "right") {
                    text.attr({ x: 7, y: 4, "text-anchor": "start" });
                } else if(orient == "bottom") {
                    text.attr({ y: 16 });
                } else {
                    text.attr({ y: -7 });
                }

                tooltip.attr({ visibility: (value != 0) ? "visible" : "hidden" });
                tooltip.translate(x, y);
            }

            // 툴팁 생성
            tooltip = draw();

            return {
                tooltip: tooltip,
                control: show,
                style: function(fill, stroke, opacity) {
                    tooltip.get(0).attr({
                        opacity: opacity
                    });

                    tooltip.get(1).attr({
                        fill: fill,
                        stroke: stroke,
                        opacity: opacity
                    })
                }
            }
        }

        /**
         * 
         * @method curvePoints
         *
         * 좌표 배열 'K'에 대한 커브 좌표 'P1', 'P2'를 구하는 함수
         *
         * TODO: min, max 에 대한 처리도 같이 필요함.
         *
         * @param {Array} K
         * @return {Object}
         * @return {Array} return.p1
         * @return {Array} return.p2
         *
         */
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

        /**
         * 
         * @method getScaleValue
         *
         * 값에 비례하여 반지름을 구하는 함수
         *
         * @param value
         * @param minValue
         * @param maxValue
         * @param minRadius
         * @param maxRadius
         * @return {*}
         */
        this.getScaleValue = function(value, minValue, maxValue, minRadius, maxRadius) {
            // 최소/최대 값이 같을 경우 처리
            minValue = (minValue == maxValue) ? 0 : minValue;

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

        /*
         * 차트 데이터 핸들링 함수
         *
         */

        /**
         * 
         * @method eachData
         *
         * loop axis data
         *
         * @param {Function} callback
         */
        this.eachData = function(callback, reverse) {
            if(!_.typeCheck("function", callback)) return;
            var list = this.listData();

            if(reverse === true) {
                for(var len = list.length - 1; len >= 0; len--) {
                    callback.call(this, len, list[len]);
                }
            } else {
                for(var index = 0, len = list.length; index < len; index++) {
                    callback.call(this, index, list[index]);
                }
            }
        }

        /**
         * 
         * @method listData
         *
         * get axis.data
         *
         * @returns {Array} axis.data
         */
        this.listData = function() {
            return this.axis.data;
        }

        /**
         * 
         * @method getData
         *
         * get record by index in axis.data
         *
         * @param {Integer} index
         * @returns {Object} record in axis.data
         */
        this.getData = function(index) {
            return this.listData()[index];
        }

        /**
         * @method getValue
         *
         * chart.axis.getValue alias
         *
         * @param {Object} data row data
         * @param {String} fieldString 필드 이름
         * @param {String/Number/Boolean/Object} [defaultValue=''] 기본값
         * @return {Mixed}
         */
        this.getValue = function(data, fieldString, defaultValue) {
            return this.axis.getValue(data, fieldString, defaultValue);
        }

        /**
         * 
         * @method getXY
         *
         * 차트 데이터에 대한 좌표 'x', 'y'를 구하는 함수
         *
         * @param {Boolean} [isCheckMinMax=true]
         * @return {Array}
         */
        this.getXY = function(isCheckMinMax) {
            var xy = [],
                series = {},
                length = this.listData().length,
                i = length,
                target = this.brush.target,
                targetLength = target.length;

            if(isCheckMinMax !== false) {
                series = getMinMaxValue(this.axis.data, target);
            }

            for(var j = 0; j < targetLength; j++) {
                xy[j] = {
                    x: new Array(length),
                    y: new Array(length),
                    value: new Array(length),
                    min: [],
                    max: [],
                    length: length
                };
            }
            
            var axisData = this.axis.data;
            var x = this.axis.x;
            var y = this.axis.y;

            var func = _.loop(i);

            func(function(i, group) {
                var data = axisData[i],
                    startX = x(i);

                for(var j = 0; j < targetLength ; j++) {
                    var key = target[j],
                        value = data[key],
                        startY = y(value);

                    xy[j].x[i] = startX;
                    xy[j].y[i] = startY;
                    xy[j].value[i] = value;

                    if(isCheckMinMax !== false) {
                        xy[j].min[i] = (value == series[key].min);
                        xy[j].max[i] = (value == series[key].max);
                    }
                }
            })

            return xy;
        }

        /**
         * 
         * @method getStackXY
         *
         * 차트 데이터에 대한 좌표 'x', 'y'를 구하는 함수
         * 단, 'y' 좌표는 다음 데이터 보다 높게 구해진다.
         *
         * @param {Boolean} [isCheckMinMax=true]
         * @return {Array}
         */
        this.getStackXY = function(isCheckMinMax) {
            var xy = this.getXY(isCheckMinMax);

            this.eachData(function(i, data) {
                var valueSum = 0;

                for(var j = 0; j < this.brush.target.length; j++) {
                    var key = this.brush.target[j],
                        value = data[key];

                    if(j > 0) {
                        valueSum += data[this.brush.target[j - 1]];
                    }

                    xy[j].y[i] = this.axis.y(value + valueSum);
                }
            });

            return xy;
        }
        
        /**
         * @method addEvent 
         * 브러쉬 엘리먼트에 대한 공통 이벤트 정의
         *
         * @param {Element} element
         * @param {Integer} dataIndex
         * @param {Integer} targetIndex
         */
        this.addEvent = function(elem, dataIndex, targetIndex) {
            var chart = this.chart,
                obj = {
                brush: this.brush,
                dataIndex: dataIndex,
                dataKey: (targetIndex != null) ? this.brush.target[targetIndex] : null,
                data: (dataIndex != null) ? this.getData(dataIndex) : null
            };

            elem.on("click", function(e) {
                setMouseEvent(e);
                chart.emit("click", [ obj, e ]);
            });

            elem.on("dblclick", function(e) {
                setMouseEvent(e);
                chart.emit("dblclick", [ obj, e ]);
            });

            elem.on("contextmenu", function(e) {
                setMouseEvent(e);
                chart.emit("rclick", [ obj, e ]);
                e.preventDefault();
            });

            elem.on("mouseover", function(e) {
                setMouseEvent(e);
                chart.emit("mouseover", [ obj, e ]);
            });

            elem.on("mouseout", function(e) {
                setMouseEvent(e);
                chart.emit("mouseout", [ obj, e ]);
            });

            elem.on("mousemove", function(e) {
                setMouseEvent(e);
                chart.emit("mousemove", [ obj, e ]);
            });

            elem.on("mousedown", function(e) {
                setMouseEvent(e);
                chart.emit("mousedown", [ obj, e ]);
            });

            elem.on("mouseup", function(e) {
                setMouseEvent(e);
                chart.emit("mouseup", [ obj, e ]);
            });

            function setMouseEvent(e) {
                var pos = $(chart.root).offset(),
                    offsetX = e.pageX - pos.left,
                    offsetY = e.pageY - pos.top;

                e.bgX = offsetX;
                e.bgY = offsetY;
                e.chartX = offsetX - chart.padding("left");
                e.chartY = offsetY - chart.padding("top");
            }
        }

        /**
         * @method color
         *  
         * chart.color() 를 쉽게 사용할 수 있게 만든 유틸리티 함수 
         *  
         * @param {String/Number} key  문자열일 경우 컬러 코드, Number 일 경우 브러쉬에서 사용될 컬러 Index 
         * @returns {*}
         */
        this.color = function(key) {
            if(_.typeCheck("string", key)) {
                return this.chart.color(0, { colors : [ key ] });
            }

            return this.chart.color(key, this.brush);
        }
	}


    CoreBrush.setup = function() {
        return {

            /** @property {chart.builder} chart */
            /** @property {chart.axis} axis */
            /** @property {Object} brush */

            /** @cfg {Array} [target=null] Specifies the key value of data displayed on a brush.  */
            target: null,
            /** @cfg {Array} [colors=null] Able to specify color codes according to the target order (basically, refers to the color codes of a theme) */
            colors: null,
            /** @cfg {Integer} [axis=0] Specifies the index of a grid group which acts as the reference axis of a brush. */
            axis: 0,
            /** @cfg {Integer} [index=null] [Read Only] Sequence index on which brush is drawn. */
            index: null,
            /** @cfg {boolean} [clip=true] If the brush is drawn outside of the chart, cut the area. */
            clip: true
        }
    }

	return CoreBrush;
}, "chart.draw"); 
jui.define("chart.brush.imagebar", [], function() {

    /**
     * @class chart.brush.imagebar
     *
     * implements column brush
     *
     * @extends chart.brush.column
     */
	var ImageBarBrush = function(chart, axis, brush) {
		var g;
		var zeroX, height, half_height, bar_height;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroX = axis.x(0);
			height = axis.y.rangeBand();
			half_height = height - (brush.outerPadding * 2);

			bar_height = (half_height - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
			bar_height = (bar_height < 0) ? 0 : bar_height;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var startY = axis.y(i) - (half_height / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						tooltipX = axis.x(value),
						position = (tooltipX >= zeroX) ? "right" : "left";

					// 최소 크기 설정
					if(Math.abs(zeroX - tooltipX) < brush.minSize) {
						tooltipX = (position == "right") ? tooltipX + brush.minSize : tooltipX - brush.minSize;
					}

					var width = Math.abs(zeroX - tooltipX),
						r = this.chart.svg.image({
							width : bar_height,
							height : bar_height,
							"xlink:href" : brush.uri
						});

					if(value != 0) {
						this.addEvent(r, i, j);
					}

					if (tooltipX >= zeroX) {
						r.translate(zeroX, startY);
					} else {
						r.translate(zeroX - width, startY);
					}

					if(width > 0) {
						r.scale((width > bar_height) ? width / bar_height : bar_height / width, 1);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 다음 컬럼 좌표 설정
					startY += bar_height + brush.innerPadding;
				}
			});

            return g;
		}
	}

	ImageBarBrush.setup = function() {
		return {
			/** @cfg {Number} [minSize=0] Sets the minimum size as it is not possible to draw a bar when the value is 0. */
			minSize: 0,
			/** @cfg {Number} [outerPadding=2] Determines the outer margin of a bar.  */
			outerPadding: 2,
			/** @cfg {Number} [innerPadding=1] Determines the inner margin of a bar. */
			innerPadding: 1,
			/** @cfg {Number} [uri=null] */
			uri : null
		}
	}

	return ImageBarBrush;
}, "chart.brush.core");

jui.define("chart.brush.imagecolumn", [], function() {

    /**
     * @class chart.brush.imagecolumn
     *
     * implements column brush
     *
     * @extends chart.brush.column
     */
	var ImageColumnBrush = function(chart, axis, brush) {
		var g;
		var zeroY, width, col_width, half_width;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroY = axis.y(0);
			width = axis.x.rangeBand();
			half_width = (width - brush.outerPadding * 2);

			col_width = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
            col_width = (col_width < 0) ? 0 : col_width;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var startX = axis.x(i) - (half_width / 2);

				for(var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						tooltipY = axis.y(value),
						position = (tooltipY <= zeroY) ? "top" : "bottom";

                    // 최소 크기 설정
                    if(Math.abs(zeroY - tooltipY) < brush.minSize) {
                        tooltipY = (position == "top") ? tooltipY - brush.minSize : tooltipY + brush.minSize;
                    }

					var	height = Math.abs(zeroY - tooltipY),
						r = this.chart.svg.image({
							width : col_width,
							height : col_width,
							"xlink:href" : brush.uri
						});

					if(value != 0) {
						this.addEvent(r, i, j);
					}

					if (tooltipY <= zeroY) {
						r.translate(startX, tooltipY);
					} else {
						r.translate(startX, zeroY);
					}

					if(height > 0) {
						r.scale(1, (height > col_width) ? height / col_width : col_width / height);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 다음 컬럼 좌표 설정
					startX += col_width + brush.innerPadding;
				}
			});

            return g;
		}
	}

	return ImageColumnBrush;
}, "chart.brush.imagebar");

jui.define("chart.brush.bar", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.bar 
     * implements bar brush 
     * @extends chart.brush.core
     */
	var BarBrush = function(chart, axis, brush) {
		var g;
		var zeroX, height, half_height, bar_height;

        /**
         * bar style 을 얻어온다. 
         *  
         * @return {Object} bar 에 관련된 스타일을 리턴한다. 
         * @return {String} return.borderColor  
         * @return {Number} return.borderWidth  
         * @return {Number} return.borderOpacity  
         * @return {Number} return.borderRadius  
         * @return {Number} return.disableOpacity  
         * @return {String} return.circleColor  
         */
		this.getBarStyle = function() {
			return {
				borderColor: this.chart.theme("barBorderColor"),
				borderWidth: this.chart.theme("barBorderWidth"),
				borderOpacity: this.chart.theme("barBorderOpacity"),
				borderRadius: this.chart.theme("barBorderRadius"),
				disableOpacity: this.chart.theme("barDisableBackgroundOpacity"),
				circleColor: this.chart.theme("barPointBorderColor")
			}
		}

        /**
         * @method getBarElement 
         *  
         * 특정 위치에 맞는 bar element 를 생성한다. 
         *  
         * @param {Number} dataIndex
         * @param {Number} targetIndex
         * @param {Object} info
         * @param {Number} info.width bar 넓이
         * @param {Number} info.height bar 높이
         * @return {util.svg.element}
         */
		this.getBarElement = function(dataIndex, targetIndex, info) {
			var style = this.getBarStyle(),
				color = this.color(targetIndex),
				value = this.getData(dataIndex)[this.brush.target[targetIndex]];

			var r = this.chart.svg.pathRect({
				width: info.width,
				height: info.height,
				fill : color,
				stroke : style.borderColor,
				"stroke-width" : style.borderWidth,
				"stroke-opacity" : style.borderOpacity
			});

			if(value != 0) {
				this.addEvent(r, dataIndex, targetIndex);
			}

			if(this.barList == null) {
				this.barList = [];
			}

			this.barList.push(_.extend({
				element: r,
				color: color
			}, info));

			return r;
		}

        /**
         * @method setActiveEffect 
         * 
         * 활성화(active)된 영역 표시   
         *  
         * @param {Number} r
         */
		this.setActiveEffect = function(r) {
			var style = this.getBarStyle(),
				cols = this.barList;

			for(var i = 0; i < cols.length; i++) {
				var opacity = (cols[i] == r) ? 1 : style.disableOpacity;
				cols[i].element.attr({ opacity: opacity });

				if(cols[i].minmax) {
					cols[i].minmax.style(cols[i].color, style.circleColor, opacity);
				}
			}
		}

        /**
         * @method drawBefore 
         * 
         * @protected 
         */
		this.drawBefore = function() {
			g = chart.svg.group();
			zeroX = axis.x(0);
			height = axis.y.rangeBand();
			half_height = height - (brush.outerPadding * 2);

			bar_height = (half_height - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
            bar_height = (bar_height < 0) ? 0 : bar_height;
		}

        /**
         * @method drawETC
         * 
         * @param {util.svg.element} group
         */
		this.drawETC = function(group) {
			if(!_.typeCheck("array", this.barList)) return;

			var self = this,
				style = this.getBarStyle();

			// 액티브 툴팁 생성
			this.active = this.drawTooltip();
            group.append(this.active.tooltip);

			for(var i = 0; i < this.barList.length; i++) {
				var r = this.barList[i],
					d = this.brush.display;

				// Max & Min 툴팁 생성
				if((d == "max" && r.max) || (d == "min" && r.min) || d == "all") {
					r.minmax = this.drawTooltip(r.color, style.circleColor, 1);
					r.minmax.control(r.position, r.tooltipX, r.tooltipY, this.format(r.value));
                    group.append(r.minmax.tooltip);
				}

				// 컬럼 및 기본 브러쉬 이벤트 설정
				if(r.value != 0 && this.brush.activeEvent != null) {
					(function(bar) {
						self.active.style(bar.color, style.circleColor, 1);

						bar.element.on(self.brush.activeEvent, function(e) {
							self.active.style(bar.color, style.circleColor, 1);
							self.active.control(bar.position, bar.tooltipX, bar.tooltipY, self.format(bar.value));
							self.setActiveEffect(bar);
						});

						bar.element.attr({ cursor: "pointer" });
					})(r);
				}
			}

			// 액티브 툴팁 위치 설정
			var r = this.barList[this.brush.active];
			if(r != null) {
				this.active.style(r.color, style.circleColor, 1);
				this.active.control(r.position, r.tooltipX, r.tooltipY, this.format(r.value));
				this.setActiveEffect(r);
			}
		}

		this.draw = function() {
			var points = this.getXY(),
				style = this.getBarStyle();

			this.eachData(function(i, data) {
				var startY = axis.y(i) - (half_height / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						tooltipX = axis.x(value),
						tooltipY = startY + (bar_height / 2),
						position = (tooltipX >= zeroX) ? "right" : "left";

                    // 최소 크기 설정
                    if(Math.abs(zeroX - tooltipX) < brush.minSize) {
                        tooltipX = (position == "right") ? tooltipX + brush.minSize : tooltipX - brush.minSize;
                    }

					var width = Math.abs(zeroX - tooltipX),
						radius = (width < style.borderRadius || bar_height < style.borderRadius) ? 0 : style.borderRadius,
                        r = this.getBarElement(i, j, {
							width: width,
							height: bar_height,
							value: value,
							tooltipX: tooltipX,
							tooltipY: tooltipY,
							position: position,
							max: points[j].max[i],
							min: points[j].min[i]
						});

					if (tooltipX >= zeroX) {
						r.round(width, bar_height, 0, radius, radius, 0);
						r.translate(zeroX, startY);
					} else {
						r.round(width, bar_height, radius, 0, 0, radius);
						r.translate(zeroX - width, startY);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 다음 컬럼 좌표 설정
					startY += bar_height + brush.innerPadding;
				}
			});

			this.drawETC(g);

            return g;
		}

		this.drawAnimate = function(root) {
			var svg = this.chart.svg,
				type = this.brush.animate;

			root.append(
				svg.animate({
					attributeName: "opacity",
					from: "0",
					to: "1",
					begin: "0s" ,
					dur: "1.4s",
					repeatCount: "1",
					fill: "freeze"
				})
			);

			root.each(function(i, elem) {
				if(elem.is("util.svg.element.path")) {
					var xy = elem.data("translate").split(","),
						x = parseInt(xy[0]),
						y = parseInt(xy[1]),
						w = parseInt(elem.attr("width")),
						start = (type == "right") ? x + w : x - w;

					elem.append(svg.animateTransform({
						attributeName: "transform",
						type: "translate",
						from: start + " " + y,
						to: x + " " + y,
						begin: "0s",
						dur: "0.7s",
						repeatCount: "1",
						fill: "freeze"
					}));
				}
			});
		}
	}

	BarBrush.setup = function() {
		return {
            /** @cfg {Number} [minSize=0] Sets the minimum size as it is not possible to draw a bar when the value is 0. */
            minSize: 0,
            /** @cfg {Number} [outerPadding=2] Determines the outer margin of a bar.  */
			outerPadding: 2,
            /** @cfg {Number} [innerPadding=1] Determines the inner margin of a bar. */
			innerPadding: 1,
            /** @cfg {Number} [active=null] Activates the bar of an applicable index. */
			active: null,
            /** @cfg {String} [activeEvent=null]  Activates the bar in question when a configured event occurs (click, mouseover, etc). */
			activeEvent: null,
            /** @cfg {"max"/"min"} [display=null]  Shows a tool tip on the bar for the minimum/maximum value.  */
			display: null
		};
	}

	return BarBrush;
}, "chart.brush.core");

jui.define("chart.brush.column", [], function() {

    /**
     * @class chart.brush.column 
     *
     * implements column brush
     *
     * @extends chart.brush.bar
     */
	var ColumnBrush = function(chart, axis, brush) {
		var g;
		var zeroY, width, col_width, half_width;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroY = axis.y(0);
			width = axis.x.rangeBand();
			half_width = (width - brush.outerPadding * 2);

			col_width = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
            col_width = (col_width < 0) ? 0 : col_width;
		}

		this.draw = function() {
			var points = this.getXY(),
				style = this.getBarStyle();

			this.eachData(function(i, data) {
				var startX = axis.x(i) - (half_width / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						tooltipX = startX + (col_width / 2),
						tooltipY = axis.y(value),
						position = (tooltipY <= zeroY) ? "top" : "bottom";

                    // 최소 크기 설정
                    if(Math.abs(zeroY - tooltipY) < brush.minSize) {
                        tooltipY = (position == "top") ? tooltipY - brush.minSize : tooltipY + brush.minSize;
                    }

					var	height = Math.abs(zeroY - tooltipY),
						radius = (col_width < style.borderRadius || height < style.borderRadius) ? 0 : style.borderRadius,
						r = this.getBarElement(i, j, {
							width: col_width,
							height: height,
							value: value,
							tooltipX: tooltipX,
							tooltipY: tooltipY,
							position: position,
							max: points[j].max[i],
							min: points[j].min[i]
						});

					if (tooltipY <= zeroY) {
						r.round(col_width, height, radius, radius, 0, 0);
						r.translate(startX, tooltipY);
					} else {
						r.round(col_width, height, 0, 0, radius, radius);
						r.translate(startX, zeroY);
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 다음 컬럼 좌표 설정
					startX += col_width + brush.innerPadding;
				}
			});

			this.drawETC(g);

            return g;
		}

		this.drawAnimate = function(root) {
			var svg = this.chart.svg,
				type = this.brush.animate;

			root.append(
				svg.animate({
					attributeName: "opacity",
					from: "0",
					to: "1",
					begin: "0s" ,
					dur: "1.4s",
					repeatCount: "1",
					fill: "freeze"
				})
			);

			root.each(function(i, elem) {
				if(elem.is("util.svg.element.path")) {
					var xy = elem.data("translate").split(","),
						x = parseInt(xy[0]),
						y = parseInt(xy[1]),
						h = parseInt(elem.attr("height")),
						start = (type == "top") ? y - h : y + h;

					elem.append(svg.animateTransform({
						attributeName: "transform",
						type: "translate",
						from: x + " " + start,
						to: x + " " + y,
						begin: "0s",
						dur: "0.7s",
						repeatCount: "1",
						fill: "freeze"
					}));
				}
			});
		}
	}

	return ColumnBrush;
}, "chart.brush.bar");

jui.define("chart.brush.bar3d", [], function() {

    /**
     * @class chart.brush.bar3d
     * @extends chart.brush.core
     */
	var Bar3DBrush = function(chart, axis, brush) {
		var g;
        var height, col_height;

		this.drawBefore = function() {
			g = chart.svg.group();
            height = axis.y.rangeBand();
            col_height = (height - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
            col_height = (col_height < 0) ? 0 : col_height;
		}

		this.draw = function() {
            var count = brush.target.length;

            this.eachData(function(i, data) {
                var zeroXY = axis.c(0, i),
                    startY = zeroXY.y - (height - brush.outerPadding * 2) / 2;

                for(var j = 0; j < count; j++) {
                    var value = data[brush.target[j]],
                        xy = axis.c(value, i),
                        top = Math.sin(axis.c.radian) * xy.depth,
                        width = Math.abs(zeroXY.x - xy.x),
                        r = chart.svg.rect3d(this.color(j), width, col_height, axis.c.degree, xy.depth);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(zeroXY.x, startY + top);

                    // 그룹에 컬럼 엘리먼트 추가
                    g.prepend(r);

                    startY += col_height + brush.innerPadding;
                }
            });

            return g;
		}
	}

    Bar3DBrush.setup = function() {
        return {
            outerPadding: 10,
            innerPadding: 5
        };
    }

	return Bar3DBrush;
}, "chart.brush.core");

jui.define("chart.brush.column3d", [], function() {

    /**
     * @class chart.brush.column3d
     * @extends chart.brush.core
     */
	var Column3DBrush = function() {
		var g;
        var width, col_width;

		this.drawBefore = function() {
			g = this.chart.svg.group();
            width = this.axis.x.rangeBand();
            col_width = (width - this.brush.outerPadding * 2 - (this.brush.target.length - 1) * this.brush.innerPadding) / this.brush.target.length;
            col_width = (col_width < 0) ? 0 : col_width;
		}

        this.drawMain = function(color, width, height, degree, depth) {
            return this.chart.svg.rect3d(color, width, height, degree, depth);
        }

		this.draw = function() {
            var count = this.brush.target.length;

            this.eachData(function(i, data) {
                var zeroXY = this.axis.c(i, 0),
                    startX = zeroXY.x - (width - this.brush.outerPadding * 2) / 2;

                for(var j = 0; j < count; j++) {
                    var value = data[this.brush.target[j]],
                        xy = this.axis.c(i, value);

                    var startY = xy.y + (Math.sin(this.axis.c.radian) * xy.depth),
                        height = Math.abs(zeroXY.y - xy.y),
                        r = this.drawMain(this.color(j), col_width, height, this.axis.c.degree, xy.depth);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(startX, startY);

                    // 그룹에 컬럼 엘리먼트 추가
                    g.append(r);

                    startX += col_width + this.brush.innerPadding;
                }
            });

            return g;
		}
	}

    Column3DBrush.setup = function() {
        return {
            outerPadding: 10,
            innerPadding: 5
        };
    }

	return Column3DBrush;
}, "chart.brush.core");

jui.define("chart.brush.cylinder3d", [], function() {

    /**
     * @class chart.brush.cylinder3d
     * @extends chart.brush.core
     */
	var Cylinder3DBrush = function() {
        this.drawMain = function(color, width, height, degree, depth) {
            return this.chart.svg.cylinder3d(color, width, height, degree, depth, this.brush.topRate);
        }
	}

    Cylinder3DBrush.setup = function() {
        return {
            topRate: 1,
            outerPadding: 10,
            innerPadding: 5
        };
    }

	return Cylinder3DBrush;
}, "chart.brush.column3d");

jui.define("chart.brush.clusterbar3d", [ "util.math" ], function(math) {

    /**
     * @class chart.brush.clusterbar3d
     * @extends chart.brush.bar
     */
    var ClusterBar3DBrush = function(chart, axis, brush) {
        var g;
        var height;

        this.drawBefore = function() {
            g = chart.svg.group();
            height = axis.y.rangeBand() - brush.outerPadding * 2;
        }

        this.draw = function() {
            var count = brush.target.length,
                dataList = this.listData();

            for(var i = dataList.length - 1; i >= 0; i--) {
                var data = dataList[i];

                for(var j = 0; j < count; j++) {
                    var value = data[brush.target[j]],
                        xy = axis.c(value, i, j, count),
                        zeroXY = axis.c(0, i, j, count),
                        padding = (brush.innerPadding > xy.depth) ? xy.depth : brush.innerPadding;

                    var startY = xy.y - (height / 2) + (padding / 2),
                        width = Math.abs(zeroXY.x - xy.x),
                        r = chart.svg.rect3d(this.color(j), width, height, axis.c.degree, xy.depth - padding);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(zeroXY.x, startY);

                    // 그룹에 컬럼 엘리먼트 추가
                    g.prepend(r);
                }
            }

            return g;
        }
    }

    ClusterBar3DBrush.setup = function() {
        return {
            outerPadding: 5,
            innerPadding: 5
        };
    }

    return ClusterBar3DBrush;
}, "chart.brush.core");

jui.define("chart.brush.clustercolumn3d", [], function() {

    /**
     * @class chart.brush.clustercolumn3d
     * @extends chart.brush.bar
     */
    var ClusterColumn3DBrush = function() {
        var g;
        var width;

        this.drawBefore = function() {
            g = this.chart.svg.group();
            width = this.axis.x.rangeBand() - this.brush.outerPadding * 2;
        }

        this.drawMain = function(color, width, height, degree, depth) {
            return this.chart.svg.rect3d(color, width, height, degree, depth);
        }

        this.draw = function() {
            var count = this.brush.target.length;

            this.eachData(function(i, data) {
                for(var j = 0; j < count; j++) {
                    var value = data[this.brush.target[j]],
                        xy = this.axis.c(i, value, j, count),
                        zeroXY = this.axis.c(i, 0, j, count),
                        padding = (this.brush.innerPadding > xy.depth) ? xy.depth : this.brush.innerPadding;

                    var startX = xy.x - (width / 2),
                        startY = xy.y - (Math.sin(this.axis.c.radian) * padding),
                        height = Math.abs(zeroXY.y - xy.y),
                        r = this.drawMain(this.color(j), width, height, this.axis.c.degree, xy.depth - padding);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(startX, startY);

                    // 그룹에 컬럼 엘리먼트 추가
                    g.prepend(r);
                }
            }, true);

            return g;
        }
    }

    ClusterColumn3DBrush.setup = function() {
        return {
            outerPadding: 5,
            innerPadding: 5
        };
    }

    return ClusterColumn3DBrush;
}, "chart.brush.core");

jui.define("chart.brush.clustercylinder3d", [], function() {

    /**
     * @class chart.brush.clustercylinder3d
     * @extends chart.brush.bar
     */
    var ClusterCylinder3DBrush = function() {
        this.drawMain = function(color, width, height, degree, depth) {
            return this.chart.svg.cylinder3d(color, width, height, degree, depth, this.brush.topRate);
        }
    }

    ClusterCylinder3DBrush.setup = function() {
        return {
            topRate: 1,
            outerPadding: 5,
            innerPadding: 5
        };
    }

    return ClusterCylinder3DBrush;
}, "chart.brush.clustercolumn3d");

jui.define("chart.brush.stackbar", [], function() {

	/**
	 * @class chart.brush.stackbar
	 *
	 * stack 형태의 bar 브러쉬
	 *
	 * @extends chart.brush.bar
	 *
	 */
	var StackBarBrush = function(chart, axis, brush) {
		var g, height, bar_width;

		this.addBarElement = function(elem) {
			if(this.barList == null) {
				this.barList = [];
			}

			this.barList.push(elem);
		}

		this.getBarElement = function(dataIndex, targetIndex) {
			var style = this.getBarStyle(),
				color = this.color(targetIndex),
				value = this.getData(dataIndex)[this.brush.target[targetIndex]];

			var r = this.chart.svg.rect({
				fill : color,
				stroke : style.borderColor,
				"stroke-width" : style.borderWidth,
				"stroke-opacity" : style.borderOpacity
			});

			if(value != 0) {
				this.addEvent(r, dataIndex, targetIndex);
			}

			return r;
		}

		this.setActiveEffect = function(group) {
			var style = this.getBarStyle(),
				columns = this.barList;

			for(var i = 0; i < columns.length; i++) {
				var opacity = (group == columns[i]) ? 1 : style.disableOpacity;

				columns[i].attr({ opacity: opacity });
			}
		}

		this.setActiveEffectOption = function() {
			var active = this.brush.active;

			if(this.barList && this.barList[active]) {
				this.setActiveEffect(this.barList[active]);
			}
		}

		this.setActiveEvent = function(group) {
			var self = this;

			group.on(self.brush.activeEvent, function (e) {
				self.setActiveEffect(group);
			});
		}

		this.setActiveEventOption = function(group) {
			if(this.brush.activeEvent != null) {
				this.setActiveEvent(group);
				group.attr({ cursor: "pointer" });
			}
		}

		this.drawBefore = function() {
			g = chart.svg.group();
			height = axis.y.rangeBand();
			bar_width = height - brush.outerPadding * 2;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var group = chart.svg.group();
				
				var startY = axis.y(i) - bar_width/ 2,
                    startX = axis.x(0),
                    value = 0;
				
				for (var j = 0; j < brush.target.length; j++) {
					var xValue = data[brush.target[j]] + value,
                        endX = axis.x(xValue),
						r = this.getBarElement(i, j);

					r.attr({
						x : (startX < endX) ? startX : endX,
						y : startY,
						width : Math.abs(startX - endX),
						height : bar_width
					});

					group.append(r);

					startX = endX;
					value = xValue;
				}

				this.setActiveEventOption(group); // 액티브 엘리먼트 이벤트 설정
				this.addBarElement(group);
				g.append(group);
			});

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

            return g;
		}
	}

	StackBarBrush.setup = function() {
		return {
			/** @cfg {Number} [outerPadding=15] Determines the outer margin of a stack bar. */
			outerPadding: 15
		};
	}

	return StackBarBrush;
}, "chart.brush.bar");

jui.define("chart.brush.stackcolumn", [], function() {

	/**
	 * @class chart.brush.stackcolumn
	 *
	 * stack 형태의 column 브러쉬
	 *
	 * @extends chart.brush.stackbar
	 */
	var ColumnStackBrush = function(chart, axis, brush) {
		var g, zeroY, width, bar_width;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroY = axis.y(0);
			width = axis.x.rangeBand();
			bar_width = width - brush.outerPadding * 2;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var group = chart.svg.group();
				
				var startX = axis.x(i) - bar_width / 2,
                    startY = axis.y(0),
                    value = 0;

				for(var j = 0; j < brush.target.length; j++) {
					var yValue = data[brush.target[j]] + value,
                        endY = axis.y(yValue),
						r = this.getBarElement(i, j);

					r.attr({
						x : startX,
						y : (startY > endY) ? endY : startY,
						width : bar_width,
						height : Math.abs(startY - endY)
					});

					group.append(r);
					
					startY = endY;
					value = yValue;
				}

				this.setActiveEventOption(group); // 액티브 엘리먼트 이벤트 설정
				this.addBarElement(group);
				g.append(group);
			});

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

            return g;
		}
	}

	return ColumnStackBrush;
}, "chart.brush.stackbar");

jui.define("chart.brush.stackbar3d", [], function() {

    /**
     * @class chart.brush.stackbar3d
     * @extends chart.brush.core
     */
	var StackBar3DBrush = function(chart, axis, brush) {
		var g;
        var height, bar_height;
        var zeroXY;

		this.drawBefore = function() {
			g = chart.svg.group();
            height = axis.y.rangeBand();
            bar_height = height - brush.outerPadding * 2;
            zeroXY = axis.c(0, 0);
		}

		this.draw = function() {
            this.eachData(function(i, data) {
                var group = chart.svg.group(),
                    startY = axis.c(0, i).y - bar_height / 2,
                    col_width = 0;

                for(var j = 0; j < brush.target.length; j++) {
                    var value = data[brush.target[j]],
                        xy = axis.c(value, i),
                        top = Math.sin(axis.c.radian) * xy.depth,
                        width = Math.abs(zeroXY.x - xy.x),
                        r = chart.svg.rect3d(this.color(j), width, bar_height, axis.c.degree, xy.depth);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(zeroXY.x + col_width, startY + top);

                    // 그룹에 컬럼 엘리먼트 추가
                    g.append(r);

                    col_width += width;
                }

                if(value != 0) {
                    this.addEvent(group, i, j);
                }

                g.append(group);
            });

            return g;
		}
	}

    StackBar3DBrush.setup = function() {
        return {
            outerPadding: 10
        };
    }

	return StackBar3DBrush;
}, "chart.brush.core");

jui.define("chart.brush.stackcolumn3d", [], function() {

    /**
     * @class chart.brush.stackcolumn3d
     * @extends chart.brush.core
     */
	var StackColumn3DBrush = function() {
		var g;
        var width, bar_width;
        var zeroXY;

		this.drawBefore = function() {
			g = this.chart.svg.group();
            width = this.axis.x.rangeBand();
            bar_width = width - this.brush.outerPadding * 2;
            zeroXY = this.axis.c(0, 0);
		}

        this.drawMain = function(index, width, height, degree, depth) {
            return this.chart.svg.rect3d(this.color(index), width, height, degree, depth);
        }

		this.draw = function() {
            this.eachData(function(i, data) {
                var group = this.chart.svg.group(),
                    startX = this.axis.c(i, 0).x - bar_width / 2,
                    col_height = 0;

                for(var j = 0; j < this.brush.target.length; j++) {
                    var value = data[this.brush.target[j]],
                        xy = this.axis.c(i, value),
                        top = Math.sin(this.axis.c.radian) * xy.depth;

                    var startY = xy.y + top,
                        height = Math.abs(zeroXY.y - xy.y),
                        r = this.drawMain(j, bar_width, height, this.axis.c.degree, xy.depth);

                    r.translate(startX, startY - col_height);
                    group.append(r);

                    col_height += height;
                }

                if(value != 0) {
                    this.addEvent(group, i, j);
                }

                g.append(group);
            });

            return g;
		}
	}

    StackColumn3DBrush.setup = function() {
        return {
            outerPadding: 10
        };
    }

	return StackColumn3DBrush;
}, "chart.brush.core");

jui.define("chart.brush.stackcylinder3d", [], function() {

    /**
     * @class chart.brush.stackcylinder3d
     * @extends chart.brush.core
     */
	var StackCylinder3DBrush = function() {
        this.drawMain = function(index, width, height, degree, depth) {
            var top = Math.sin(this.axis.c.radian) * depth,
                h = (index > 0) ? height - top : height;

            return this.chart.svg.cylinder3d(this.color(index), width, h, degree, depth);
        }
	}

	return StackCylinder3DBrush;
}, "chart.brush.stackcolumn3d");

jui.define("chart.brush.fullstackbar", [], function() {

    /**
     * @class chart.brush.fullstackbar 
     * 
     * implements fullstack bar brush 
     *  
     * @extends chart.brush.stackbar 
     */
	var FullStackBarBrush = function(chart, axis, brush) {
		var g, zeroX, height, bar_height;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroX = axis.x(0);
			height = axis.y.rangeBand();
			bar_height = height - brush.outerPadding * 2;
		}

		this.drawText = function(percent, x, y) {
			var text = this.chart.text({
				x : x,
				y : y,
				"text-anchor" : "middle"
			}, percent + "%");

			return text;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var group = chart.svg.group();

				var startY = axis.y(i) - bar_height / 2,
					sum = 0,
					list = [];

				for (var j = 0; j < brush.target.length; j++) {
					var width = data[brush.target[j]];

					sum += width;
					list.push(width);
				}

				var startX = 0,
					max = axis.x.max();

				for (var j = list.length - 1; j >= 0; j--) {
					var width = axis.x.rate(list[j], sum),
						r = this.getBarElement(i, j);

					r.attr({
						x : startX,
						y : startY,
						width: width,
						height: bar_height
					});

					group.append(r);

					// 퍼센트 노출 옵션 설정
					if(brush.showText) {
						var p = Math.round((list[j] / sum) * max),
							x = startX + width / 2,
							y = startY + bar_height / 2 + 5;

						group.append(this.drawText(p, x, y));
					}

					// 액티브 엘리먼트 이벤트 설정
					this.setActiveEventOption(group);

					startX += width;
				}

				this.addBarElement(group);
				g.append(group);
			});

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

			return g;
		}
	}

	FullStackBarBrush.setup = function() {
		return {
            /** @cfg {Number} [outerPadding=15] */
			outerPadding: 15,
            /** @cfg {Boolean} [showText=false] Configures settings to let the percent text of a full stack bar revealed. */
			showText: false
		};
	}

	return FullStackBarBrush;
}, "chart.brush.stackbar");

jui.define("chart.brush.fullstackcolumn", [], function() {

    /**
     * @class chart.brush.fullstackcolumn 
     * 
     * implements fullstack column  
     *  
     * @extends chart.brush.fullstackbar
     */
	var FullStackColumnBrush = function(chart, axis, brush) {
		var g, zeroY, width, bar_width;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroY = axis.y(0);
			width = axis.x.rangeBand();
			bar_width = width - brush.outerPadding * 2;
		}

		this.draw = function() {
			var chart_height = axis.area("height");

			this.eachData(function(i, data) {
				var group = chart.svg.group();

				var startX = axis.x(i) - bar_width / 2,
                    sum = 0,
                    list = [];

				for (var j = 0; j < brush.target.length; j++) {
					var height = data[brush.target[j]];

					sum += height;
					list.push(height);
				}

				var startY = 0,
                    max = axis.y.max();
				
				for (var j = list.length - 1; j >= 0; j--) {
					var height = chart_height - axis.y.rate(list[j], sum),
						r = this.getBarElement(i, j);

					r.attr({
						x: startX,
						y: startY,
						width: bar_width,
						height: height
					});

					group.append(r);

					// 퍼센트 노출 옵션 설정
					if(brush.showText) {
						var p = Math.round((list[j] / sum) * max),
							x = startX + bar_width / 2,
							y = startY + height / 2 + 8;

						group.append(this.drawText(p, x, y));
					}

					// 액티브 엘리먼트 이벤트 설정
					this.setActiveEventOption(group);

					startY += height;										
				}

				this.addBarElement(group);
				g.append(group);
			});

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

            return g;
		}
	}

	return FullStackColumnBrush;
}, "chart.brush.fullstackbar");

jui.define("chart.brush.fullstackbar3d", [], function() {

    /**
     * @class chart.brush.fullstackbar3d
     * @extends chart.brush.core
     */
	var FullStackBar3DBrush = function(chart, axis, brush) {
		var g;
        var height, bar_height;
        var zeroXY;

		this.drawBefore = function() {
			g = chart.svg.group();
            height = axis.y.rangeBand();
            bar_height = height - brush.outerPadding * 2;
            zeroXY = axis.c(0, 0);
		}

        this.drawText = function(percent, x, y) {
            var text = this.chart.text({
                x : x,
                y : y,
                "text-anchor" : "middle"
            }, percent + "%");

            return text;
        }

		this.draw = function() {
            this.eachData(function(i, data) {
                var group = chart.svg.group(),
                    startY = axis.c(0, i).y - bar_height / 2,
                    col_width = 0,
                    sum = 0,
                    list = [];

                for(var j = 0; j < brush.target.length; j++) {
                    var width = data[brush.target[j]];

                    sum += width;
                    list.push(width);
                }

                for(var j = 0; j < brush.target.length; j++) {
                    var value = data[brush.target[j]],
                        xy = axis.c(value, i),
                        top = Math.sin(axis.c.radian) * xy.depth,
                        width = axis.x.rate(list[j], sum),
                        r = chart.svg.rect3d(this.color(j), width, bar_height, axis.c.degree, xy.depth);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(zeroXY.x + col_width, startY + top);

                    // 그룹에 컬럼 엘리먼트 추가
                    group.append(r);

                    // 퍼센트 노출 옵션 설정
                    if(brush.showText) {
                        var p = Math.round((list[j] / sum) * axis.x.max()),
                            x = col_width + width / 2,
                            y = startY + bar_height / 2 + 5;

                        group.append(this.drawText(p, x, y));
                    }

                    col_width += width;
                }

                this.addEvent(group, i, j);
                g.append(group);
            });

            return g;
		}
	}

    FullStackBar3DBrush.setup = function() {
        return {
            outerPadding: 10,
            showText: false
        };
    }

	return FullStackBar3DBrush;
}, "chart.brush.core");

jui.define("chart.brush.fullstackcolumn3d", [], function() {

    /**
     * @class chart.brush.fullstackcolumn3d
     * @extends chart.brush.core
     */
	var FullStackColumn3DBrush = function() {
		var g;
        var width, bar_width;
        var zeroXY;

		this.drawBefore = function() {
			g = this.chart.svg.group();
            width = this.axis.x.rangeBand();
            bar_width = width - this.brush.outerPadding * 2;
            zeroXY = this.axis.c(0, 0);
		}

        this.drawMain = function(index, width, height, degree, depth) {
            return this.chart.svg.rect3d(this.color(index), width, height, degree, depth);
        }

        this.getTextXY = function(index, x, y, depth) {
            return {
                x: x,
                y: y
            }
        }

		this.draw = function() {
            this.eachData(function(i, data) {
                var group = this.chart.svg.group(),
                    startX = this.axis.c(i, 0).x - bar_width / 2,
                    startY = zeroXY.y,
                    sum = 0,
                    list = [];

                for(var j = 0; j < this.brush.target.length; j++) {
                    var height = data[this.brush.target[j]];

                    sum += height;
                    list.push(height);
                }

                for(var j = 0; j < this.brush.target.length; j++) {
                    var value = data[this.brush.target[j]],
                        xy = this.axis.c(i, value),
                        top = Math.sin(this.axis.c.radian) * xy.depth,
                        height = zeroXY.y - this.axis.y.rate(list[j], sum),
                        r = this.drawMain(j, bar_width, height, this.axis.c.degree, xy.depth);

                    r.translate(startX, startY - height + top);
                    group.append(r);

                    // 퍼센트 노출 옵션 설정
                    if(this.brush.showText) {
                        var p = Math.round((list[j] / sum) * this.axis.y.max()),
                            x = startX + bar_width / 2,
                            y = startY - height / 2 + 6,
                            xy = this.getTextXY(j, x, y, xy.depth)

                        group.append(this.drawText(p, xy.x, xy.y));
                    }

                    startY -= height;
                }

                this.addEvent(group, i, j);
                g.append(group);
            });

            return g;
		}
	}

    FullStackColumn3DBrush.setup = function() {
        return {
            outerPadding: 10,
            showText: false
        };
    }

	return FullStackColumn3DBrush;
}, "chart.brush.fullstackbar3d");

jui.define("chart.brush.fullstackcylinder3d", [], function() {

    /**
     * @class chart.brush.fullstackcylinder3d
     * @extends chart.brush.core
     */
	var FullStackCylinder3DBrush = function() {
        this.drawMain = function(index, width, height, degree, depth) {
            var top = Math.sin(this.axis.c.radian) * depth,
                h = (index > 0) ? height - top : height;

            return this.chart.svg.cylinder3d(this.color(index), width, h, degree, depth);
        }

        this.getTextXY = function(index, x, y, depth) {
            var top = Math.sin(this.axis.c.radian) * depth;

            return {
                x: x + ((Math.cos(this.axis.c.radian) * depth) / 2),
                y: y - ((index > 0) ? top : 0)
            }
        }
	}

	return FullStackCylinder3DBrush;
}, "chart.brush.fullstackcolumn3d");

jui.define("chart.brush.bubble", [], function() {

    /**
     * @class chart.brush.bubble 
     *
     * @extends chart.brush.core
     */
	var BubbleBrush = function(chart, axis, brush) {
        var self = this;

        /**
         * @method createBubble 
         *  
         *  util method for craete bubble
         *   
         * @private
         * @param {chart.builder} chart
         * @param {Object} brush
         * @param {Object} pos
         * @param {Number} index
         * @return {GroupElement}
         */
        function createBubble(chart, brush, pos, index) {
            var radius = self.getScaleValue(pos.value, axis.y.min(), axis.y.max(), brush.min, brush.max),
                circle = chart.svg.group();

            circle.append(
                chart.svg.circle({
                    r: radius,
                    "fill": self.color(index),
                    "fill-opacity": chart.theme("bubbleBackgroundOpacity"),
                    "stroke": self.color(index),
                    "stroke-width": chart.theme("bubbleBorderWidth")
                })
            ).translate(pos.x, pos.y);

            return circle;
        }

        /**
         * @method drawBubble 
         * 
         * @protected  
         * @param {chart.builder} chart
         * @param {Object} brush
         * @param {Array} points
         * @return {GroupElement}
         */
        this.drawBubble = function(chart, brush, points) {
            var g = chart.svg.group();
            
            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].x.length; j++) {
                    var b = createBubble(chart, brush, {
                        x: points[i].x[j], y: points[i].y[j], value: points[i].value[j]
                    }, i);

                    this.addEvent(b, j, i);
                    g.append(b);
                }
            }

            return g;
        }

        /**
         * @method draw 
         * 
         * @protected 
         * @return {GroupElement}
         */
        this.draw = function() {
            return this.drawBubble(chart, brush, this.getXY());
        }

        /**
         * @method drawAnimate
         *
         * @protected
         */
        this.drawAnimate = function(root) {
            root.each(function(i, elem) {
                var c = elem.children[0];

                c.append(chart.svg.animateTransform({
                    attributeType: "xml",
                    attributeName: "transform",
                    type: "scale",
                    from: "0",
                    to: "1",
                    dur: "0.7s",
                    fill: "freeze",
                    repeatCount: "1"
                }));

                c.append(chart.svg.animate({
                    attributeType: "xml",
                    attributeName: "fill-opacity",
                    from: "0",
                    to: chart.theme("bubbleBackgroundOpacity"),
                    dur: "1.4s",
                    repeatCount: "1",
                    fill: "freeze"
                }));
            });
        }
	}

    BubbleBrush.setup = function() {
        return {
            /** @cfg {Number} [min=5] Determines the minimum size of a bubble. */
            min: 5,
            /** @cfg {Number} [max=30] Determines the maximum size of a bubble.*/
            max: 30
        };
    }

	return BubbleBrush;
}, "chart.brush.core");
jui.define("chart.brush.candlestick", [], function() {

    /**
     * @class chart.brush.candlestick 
     * 
     * implements candlestick brush
     *
     * @extends chart.brush.core
     */
    var CandleStickBrush = function() {
        var g, width = 0, barWidth = 0, barPadding = 0;

        this.drawBefore = function() {
            g = this.chart.svg.group();
            width = this.axis.x.rangeBand();
            barWidth = width * 0.7;
            barPadding = barWidth / 2;
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var startX = this.axis.x(i),
                    r = null,
                    l = null;

                var high = this.getValue(data, "high", 0),
                    low = this.getValue(data, "low", 0),
                    open = this.getValue(data, "open", 0),
                    close = this.getValue(data, "close", 0);

                if(open > close) { // 시가가 종가보다 높을 때 (Red)
                    var y = this.axis.y(open);

                    l = this.chart.svg.line({
                        x1: startX,
                        y1: this.axis.y(high),
                        x2: startX,
                        y2: this.axis.y(low),
                        stroke: this.chart.theme("candlestickInvertBorderColor"),
                        "stroke-width": 1
                    });

                    r = this.chart.svg.rect({
                        x : startX - barPadding,
                        y : y,
                        width : barWidth,
                        height : Math.abs(this.axis.y(close) - y),
                        fill : this.chart.theme("candlestickInvertBackgroundColor"),
                        stroke: this.chart.theme("candlestickInvertBorderColor"),
                        "stroke-width": 1
                    });

                } else {
                    var y = this.axis.y(close);

                    l = this.chart.svg.line({
                        x1: startX,
                        y1: this.axis.y(high),
                        x2: startX,
                        y2: this.axis.y(low),
                        stroke: this.chart.theme("candlestickBorderColor"),
                        "stroke-width":1
                    });

                    r = this.chart.svg.rect({
                        x : startX - barPadding,
                        y : y,
                        width : barWidth,
                        height : Math.abs(this.axis.y(open) - y),
                        fill : this.chart.theme("candlestickBackgroundColor"),
                        stroke: this.chart.theme("candlestickBorderColor"),
                        "stroke-width": 1
                    });
                }

                this.addEvent(r, i, null);

                g.append(l);
                g.append(r);
            });

            return g;
        }
    }

    return CandleStickBrush;
}, "chart.brush.core");

jui.define("chart.brush.ohlc", [], function() {

    /**
     * @class chart.brush.ohlc 
     * 
     * implments ohlc brush 
     *  
     * @extends chart.brush.candlestick
     */
    var OHLCBrush = function(chart, axis, brush) {
        var g;

        this.drawBefore = function() {
            g = chart.svg.group();
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var startX = axis.x(i);

                var high = this.getValue(data, "high", 0),
                    low = this.getValue(data, "low", 0),
                    open = this.getValue(data, "open", 0),
                    close = this.getValue(data, "close", 0);

                var color = (open > close) ? chart.theme("ohlcInvertBorderColor") : chart.theme("ohlcBorderColor");

                var lowHigh = chart.svg.line({
                    x1: startX,
                    y1: axis.y(high),
                    x2: startX,
                    y2: axis.y(low),
                    stroke: color,
                    "stroke-width": 1
                });

                var close = chart.svg.line({
                    x1: startX,
                    y1: axis.y(close),
                    x2: startX + chart.theme("ohlcBorderRadius"),
                    y2: axis.y(close),
                    stroke: color,
                    "stroke-width": 1
                });

                var open = chart.svg.line({
                    x1: startX,
                    y1: axis.y(open),
                    x2: startX - chart.theme("ohlcBorderRadius"),
                    y2: axis.y(open),
                    stroke: color,
                    "stroke-width": 1
                });

                this.addEvent(lowHigh, i, null);

                g.append(lowHigh);
                g.append(close);
                g.append(open);
            });

            return g;
        }
    }

    return OHLCBrush;
}, "chart.brush.candlestick");

jui.define("chart.brush.equalizer", [], function() {

    /**
     * @class chart.brush.equalizer 
     *  
     * implements equalizer brush 
     *  
     * @extends chart.brush.core   
     */
    var EqualizerBrush = function(chart, axis, brush) {
        var g, zeroY, width, barWidth, half_width;

        this.drawBefore = function() {
            g = chart.svg.group();
            zeroY = axis.y(0);
            width = axis.x.rangeBand();
            half_width = (width - brush.outerPadding * 2) / 2;
            barWidth = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var startX = axis.x(i) - half_width;

                for (var j = 0; j < brush.target.length; j++) {
                    var barGroup = chart.svg.group();
                    var startY = axis.y(data[brush.target[j]]),
                        padding = 1.5,
                        eY = zeroY,
                        eIndex = 0;

                    if (startY <= zeroY) {
                        while (eY > startY) {
                            var unitHeight = (eY - brush.unit < startY) ? Math.abs(eY - startY) : brush.unit;
                            var r = chart.svg.rect({
                                x : startX,
                                y : eY - unitHeight,
                                width : barWidth,
                                height : unitHeight,
                                fill : this.color(Math.floor(eIndex / brush.gap))
                            });

                            eY -= unitHeight + padding;
                            eIndex++;

                            barGroup.append(r);
                        }
                    } else {
                        while (eY < startY) {
                            var unitHeight = (eY + brush.unit > startY) ? Math.abs(eY - startY) : brush.unit;
                            var r = chart.svg.rect({
                                x : startX,
                                y : eY,
                                width : barWidth,
                                height : unitHeight,
                                fill : this.color(Math.floor(eIndex / brush.gap))
                            });

                            eY += unitHeight + padding;
                            eIndex++;

                            barGroup.append(r);
                        }
                    }

                    this.addEvent(barGroup, i, j);
                    g.append(barGroup);

                    startX += barWidth + brush.innerPadding;
                }
            });

            return g;
        }
    }

    EqualizerBrush.setup = function() {
        return {
            /** @cfg {Number} [innerPadding=10] Determines the inner margin of an equalizer.*/
            innerPadding: 10,
            /** @cfg {Number} [outerPadding=15] Determines the outer margin of an equalizer. */
            outerPadding: 15,
            /** @cfg {Number} [unit=5] Determines the reference value that represents the color.*/
            unit: 5,
            /** @cfg {Number} [gap=5] Determines the number of columns in an equalizer - expressed as a color.*/
            gap: 5
        };
    }

    return EqualizerBrush;
}, "chart.brush.core");

jui.define("chart.brush.line", [], function() {

    /**
     * @class chart.brush.line
     * implements line brush
     * @extends chart.brush.core
     */
	var LineBrush = function() {
        var g;
        var circleColor, disableOpacity, lineBorderWidth, lineBorderDashArray;

        this.setActiveEffect = function(elem) {
            var lines = this.lineList;

            for(var i = 0; i < lines.length; i++) {
                var opacity = (elem == lines[i].element) ? 1 : disableOpacity,
                    color = lines[i].element.attr("stroke");

                if(lines[i].tooltip != null) {
                    lines[i].tooltip.style(color, circleColor, opacity);
                }

                lines[i].element.attr({ opacity: opacity });
            }
        }

        this.addLineElement = function(elem) {
            if(!this.lineList) {
                this.lineList = [];
            }

            this.lineList.push(elem);
        }

        this.createLine = function(pos, index) {
            var x = pos.x,
                y = pos.y;

            var p = this.chart.svg.path({
                stroke : this.color(index),
                "stroke-width" : lineBorderWidth,
                "stroke-dasharray" : lineBorderDashArray,
                fill : "transparent",
                "cursor" : (this.brush.activeEvent != null) ? "pointer" : "normal"
            });

            if(pos.length > 0) {
                p.MoveTo(x[0], y[0]);

                if (this.brush.symbol == "curve") {
                    var px = this.curvePoints(x),
                        py = this.curvePoints(y);

                    for (var i = 0; i < x.length - 1; i++) {
                        p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                    }
                } else {
                    for (var i = 0; i < x.length - 1; i++) {
                        if (this.brush.symbol == "step") {
                            var sx = x[i] + ((x[i + 1] - x[i]) / 2);

                            p.LineTo(sx, y[i]);
                            p.LineTo(sx, y[i + 1]);
                        }

                        p.LineTo(x[i + 1], y[i + 1]);
                    }
                }
            }

            return p;
        }

        this.createTooltip = function(g, pos, index) {
            var display = this.brush.display;

            for (var i = 0; i < pos.x.length; i++) {
                if(display == "max" && pos.max[i] || display == "min" && pos.min[i]) {
                    var orient = (display == "max" && pos.max[i]) ? "top" : "bottom";

                    var minmax = this.drawTooltip(this.color(index), circleColor, 1);
                    minmax.control(orient, pos.x[i], pos.y[i], this.format(pos.value[i]));

                    g.append(minmax.tooltip);

                    // 컬럼 상태 설정 (툴팁)
                    this.lineList[index].tooltip = minmax;
                }
            }
        }

        this.drawLine = function(path) {
            var self = this;

            for(var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k);

                this.addEvent(p, null, k);
                g.append(p);

                // 컬럼 상태 설정
                this.addLineElement({
                    element: p,
                    tooltip: null
                });

                // Max & Min 툴팁 추가
                if(this.brush.display != null) {
                    this.createTooltip(g, path[k], k);
                }

                // 액티브 이벤트 설정
                if(this.brush.activeEvent != null) {
                    (function(elem) {
                        elem.on(self.brush.activeEvent, function(e) {
                            self.setActiveEffect(elem);
                        });
                    })(p);
                }
            }

            // 액티브 라인 설정
            for(var k = 0; k < path.length; k++) {
                if(this.brush.active == this.brush.target[k]) {
                    this.setActiveEffect(this.lineList[k].element);
                }
            }

            return g;
        }

        this.drawBefore = function() {
            g = this.chart.svg.group();
            circleColor = this.chart.theme("linePointBorderColor");
            disableOpacity = this.chart.theme("lineDisableBorderOpacity");
            lineBorderWidth = this.chart.theme("lineBorderWidth");
            lineBorderDashArray = this.chart.theme("lineBorderDashArray");
        }

        this.draw = function() {
            return this.drawLine(this.getXY());
        }

        this.drawAnimate = function(root) {
            var svg = this.chart.svg;

            root.each(function(i, elem) {
                if(elem.is("util.svg.element.path")) {
                    var dash = elem.attributes["stroke-dasharray"],
                        len = elem.length();

                    if(dash == "none") {
                        elem.attr({
                            "stroke-dasharray": len
                        });

                        elem.append(svg.animate({
                            attributeName: "stroke-dashoffset",
                            from: len,
                            to: "0",
                            begin: "0s",
                            dur: "1s",
                            repeatCount: "1"
                        }));
                    } else {
                        elem.append(svg.animate({
                            attributeName: "opacity",
                            from: "0",
                            to: "1",
                            begin: "0s" ,
                            dur: "1.5s",
                            repeatCount: "1",
                            fill: "freeze"
                        }));
                    }
                }
            });
        }
	}

    LineBrush.setup = function() {
        return {
            /** @cfg {"normal"/"curve"/"step"} [symbol="normal"] Sets the shape of a line (normal, curve, step). */
            symbol: "normal", // normal, curve, step
            /** @cfg {Number} [active=null] Activates the bar of an applicable index. */
            active: null,
            /** @cfg {String} [activeEvent=null]  Activates the bar in question when a configured event occurs (click, mouseover, etc). */
            activeEvent: null,
            /** @cfg {"max"/"min"} [display=null]  Shows a tool tip on the bar for the minimum/maximum value.  */
            display: null
        };
    }

	return LineBrush;
}, "chart.brush.core");
jui.define("chart.brush.path", [], function() {

    /**
     * @class chart.brush.path 
     * 
     * implements path brush  
     *  
     * @extends chart.brush.core
     */
	var PathBrush = function(chart, axis, brush) {

		this.draw = function() {
			var g = this.chart.svg.group();
			
			for(var ti = 0, len = this.brush.target.length; ti < len; ti++) {
				var color = this.color(ti);

				var path = chart.svg.path({
					fill : color,
					"fill-opacity" : chart.theme("pathBackgroundOpacity"),
					stroke : color,
					"stroke-width" : chart.theme("pathBorderWidth")
				});
	
				g.append(path);
	
				this.eachData(function(i, data) {
					var obj = this.axis.c(i, data[brush.target[ti]]),
						x = obj.x - chart.area("x"),
						y = obj.y - chart.area("y");

					if (i == 0) {
						path.MoveTo(x, y);
					} else {
						path.LineTo(x, y);
					}
				});
	
				path.ClosePath();
			}

			return g;
		}
	}

	return PathBrush;
}, "chart.brush.core");

jui.define("chart.brush.pie", [ "util.base", "util.math", "util.color" ], function(_, math, ColorUtil) {

	/**
	 * @class chart.brush.pie
	 *
	 * implements pie brush
	 *
     * @extends chart.brush.core
	 */
	var PieBrush = function() {
        var self = this, textY = 3;
        var g;
        var cache_active = {};

        this.setActiveEvent = function(pie, centerX, centerY, centerAngle) {
            var dist = this.chart.theme("pieActiveDistance"),
                tx = Math.cos(math.radian(centerAngle)) * dist,
                ty = Math.sin(math.radian(centerAngle)) * dist;

            pie.translate(centerX + tx, centerY + ty);
        }

        this.getFormatText = function(target, value) {
            var series = this.chart.get("series", target),
                key = (series.text) ? series.text : target;

            if(typeof(this.brush.format) == "function") {
                return this.format(key, value);
            } else {
                if (!value) {
                    return key;
                }

                return key + ": " + this.format(value);
            }
        }

		this.drawPie = function(centerX, centerY, outerRadius, startAngle, endAngle, color) {
			var pie = this.chart.svg.group();

            if (endAngle == 360) { // if pie is full size, draw a circle as pie brush
                var circle = this.chart.svg.circle({
                    cx : centerX,
                    cy : centerY,
                    r : outerRadius,
                    fill : color,
                    stroke : this.chart.theme("pieBorderColor") || color,
                    "stroke-width" : this.chart.theme("pieBorderWidth")
                });

                pie.append(circle);

                return pie;
            }
            
            var path = this.chart.svg.path({
                fill : color,
                stroke : this.chart.theme("pieBorderColor") || color,
                "stroke-width" : this.chart.theme("pieBorderWidth")
            });

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle)),
				startX = obj.x,
                startY = obj.y;
			
			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			pie.translate(centerX, centerY);

			// arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y)
                .LineTo(0, 0)
                .ClosePath();

            pie.append(path);

			return pie;
		}

		this.drawPie3d = function(centerX, centerY, outerRadius, startAngle, endAngle, color) {
			var pie = this.chart.svg.group(),
				path = this.chart.svg.path({
                    fill : color,
                    stroke : this.chart.theme("pieBorderColor") || color,
                    "stroke-width" : this.chart.theme("pieBorderWidth")
                });

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle)),
				startX = obj.x,
                startY = obj.y;

			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			pie.translate(centerX, centerY);

			// arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y)

            var y = obj.y + 10,
                x = obj.x + 5,
                targetX = startX + 5,
                targetY = startY + 10;

            path.LineTo(x, y);
            path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 0, targetX, targetY)
            path.ClosePath();
            pie.append(path);

			return pie;
		}

        this.drawText = function(centerX, centerY, centerAngle, outerRadius, text) {
            var c = this.chart,
                dist = c.theme("pieOuterLineSize"),
                r = outerRadius * c.theme("pieOuterLineRate"),
                cx = centerX + (Math.cos(math.radian(centerAngle)) * outerRadius),
                cy = centerY + (Math.sin(math.radian(centerAngle)) * outerRadius),
                tx = centerX + (Math.cos(math.radian(centerAngle)) * r),
                ty = centerY + (Math.sin(math.radian(centerAngle)) * r),
                isLeft = (centerAngle + 90 > 180) ? true : false,
                ex = (isLeft) ? tx - dist : tx + dist;

            return c.svg.group({}, function() {
                var path = c.svg.path({
                    fill: "transparent",
                    stroke: c.theme("pieOuterLineColor"),
                    "stroke-width": 0.7
                });

                path.MoveTo(cx, cy)
                    .LineTo(tx, ty)
                    .LineTo(ex, ty);

                c.text({
                    "font-size": c.theme("pieOuterFontSize"),
                    "text-anchor": (isLeft) ? "end" : "start",
                    y: textY
                }, text).translate(ex + (isLeft ? -3 : 3), ty);
            });
        }

		this.drawUnit = function (index, data, g) {
			var obj = this.axis.c(index);

			var width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y,
                min = width;

			if (height < min) {
				min = height;
			}

			// center
			var centerX = width / 2 + x,
                centerY = height / 2 + y,
                outerRadius = min / 2;

			var target = this.brush.target,
                active = this.brush.active,
				all = 360,
				startAngle = 0,
				max = 0;

			for (var i = 0; i < target.length; i++) {
				max += data[target[i]];
			}

			for (var i = 0; i < target.length; i++) {
                var value = data[target[i]],
                    endAngle = all * (value / max);

                if (this.brush['3d']) {
                    var pie3d = this.drawPie3d(centerX, centerY, outerRadius, startAngle, endAngle, ColorUtil.darken(this.color(i), 0.5));
                    g.append(pie3d);
                }

				startAngle += endAngle;
			}

            startAngle = 0;

			for (var i = 0; i < target.length; i++) {
                var value = data[target[i]],
                    endAngle = all * (value / max),
                    centerAngle = startAngle + (endAngle / 2) - 90,
                    pie = this.drawPie(centerX, centerY, outerRadius, startAngle, endAngle, this.color(i));

                // 설정된 키 활성화
                if (active == target[i] || $.inArray(target[i], active) != -1) {
                    this.setActiveEvent(pie, centerX, centerY, centerAngle);
                    cache_active[centerAngle] = true;
                }

                // 활성화 이벤트 설정
                if (this.brush.activeEvent != null) {
                    (function(p, cx, cy, ca) {
                        p.on(self.brush.activeEvent, function(e) {
                            if(!cache_active[ca]) {
                                self.setActiveEvent(p, cx, cy, ca);
                                cache_active[ca] = true;
                            } else {
                                p.translate(cx, cy);
                                cache_active[ca] = false;
                            }
                        });

                        p.attr({ cursor: "pointer" });
                    })(pie, centerX, centerY, centerAngle);
                }

                if (this.brush.showText) {
                    var text = this.getFormatText(target[i], value, max),
                        elem = this.drawText(centerX, centerY, centerAngle, outerRadius, text);

                    this.addEvent(elem, index, i);
                    g.append(elem);
                }

                self.addEvent(pie, index, i);
                g.append(pie);

				startAngle += endAngle;
			}
		}

        this.drawBefore = function() {
            g = this.chart.svg.group();
        }

		this.draw = function() {
			this.eachData(function(i, data) {
				this.drawUnit(i, data, g);
			});

            return g;
		}
	}

    PieBrush.setup = function() {
        return {
            /** @cfg {Boolean} [clip=false] If the brush is drawn outside of the chart, cut the area. */
            clip: false,
            /** @cfg {Boolean} [showText=false] Set the text appear.  */
            showText: false,
            /** @cfg {Function} [format=null] Returns a value from the format callback function of a defined option. */
            format: null,
            /** @cfg {Boolean} [3d=false] check 3d support */
            "3d": false,
            /** @cfg {String|Array} [active=null] Activates the pie of an applicable property's name. */
            active: null,
            /** @cfg {String} [activeEvent=null]  Activates the pie in question when a configured event occurs (click, mouseover, etc). */
            activeEvent: null
        }
    }

	return PieBrush;
}, "chart.brush.core");

jui.define("chart.brush.donut", [ "util.base", "util.math", "util.color" ], function(_, math, ColorUtil) {

    /**
     * @class chart.brush.donut 
     * 
     * implements donut brush 
     *  
     * @extends chart.brush.pie
     * 
     */
	var DonutBrush = function() {
        var self = this,
            cache_active = {};

        /**
         * @method drawDonut 
         * 
         * donut 을 그린다.
         *   
         * @param {Number} centerX 중앙 위치 x
         * @param {Number} centerY 중앙 위치 y
         * @param {Number} innerRadius 안쪽 반지름
         * @param {Number} outerRadius 바깥쪽 반지름
         * @param {Number} startAngle 시작 지점 각도
         * @param {Number} endAngle 시작지점에서 끝지점까지의 각도
         * @param {Object} attr donut 설정될 svg 속성 리스트
         * @param {Boolean} hasCircle
         * @return {util.svg.element}
         */
		this.drawDonut = function(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, attr, hasCircle) {
		    hasCircle = hasCircle || false;

			attr['stroke-width']= outerRadius - innerRadius;

			var g = this.chart.svg.group(),
				path = this.chart.svg.path(attr),
				dist = Math.abs(outerRadius - innerRadius);

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle)),
				startX = obj.x,
				startY = obj.y;


			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			// 중심점 이동
			g.translate(centerX, centerY);

			// outer arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y);

			g.append(path);

            if(hasCircle) {
                var centerCircle = math.rotate(0, -innerRadius - dist/2, math.radian(startAngle)),
					cX = centerCircle.x,
					cY = centerCircle.y,
					centerCircleLine = math.rotate(cX, cY, math.radian(endAngle));
    
                var circle = this.chart.svg.circle({
                    cx : centerCircleLine.x,
                    cy : centerCircleLine.y,
                    r : dist/2,
                    fill  : attr.fill
                });
                
                g.append(circle);
    
                var circle2 = this.chart.svg.circle({
                    cx : centerCircleLine.x,
                    cy : centerCircleLine.y,
                    r : 3,
                    fill  : "white"
                });
                
                g.append(circle2);
            }

			return g;
		}

        /**
         * @method drawDonut3d
         *
         * donut 을 그린다.
         *
         * @param {Number} centerX 중앙 위치 x
         * @param {Number} centerY 중앙 위치 y
         * @param {Number} innerRadius 안쪽 반지름
         * @param {Number} outerRadius 바깥쪽 반지름
         * @param {Number} startAngle 시작 지점 각도
         * @param {Number} endAngle 시작지점에서 끝지점까지의 각도
         * @param {Object} attr donut 설정될 svg 속성 리스트
         * @param {Boolean} hasCircle
         * @return {util.svg.element}
         */
		this.drawDonut3d = function(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, attr, hasCircle, isLast) {
			var g = this.chart.svg.group(),
				path = this.chart.svg.path(attr),
                dist = Math.abs(outerRadius - innerRadius);

            outerRadius += dist/2;
            innerRadius = outerRadius - dist;

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle)),
				startX = obj.x,
				startY = obj.y;

			var innerObj = math.rotate(0, -innerRadius, math.radian(startAngle)),
				innerStartX = innerObj.x,
				innerStartY = innerObj.y;


			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));
			innerObj = math.rotate(innerStartX, innerStartY, math.radian(endAngle));

			// 중심점 이동
			g.translate(centerX, centerY);

			// outer arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y);


            var y = obj.y + 10,
                x = obj.x + 5,
                innerY = innerObj.y + 10,
                innerX = innerObj.x + 5,
                targetX = startX + 5,
                targetY = startY + 10,
                innerTargetX = innerStartX + 5,
                innerTargetY = innerStartY + 10;

            path.LineTo(x, y);
            path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 0, targetX, targetY)
            path.ClosePath();
            g.append(path);

            // 안쪽 면 그리기
            var innerPath = this.chart.svg.path(attr);

            // 시작 하는 위치로 옮김
            innerPath.MoveTo(innerStartX, innerStartY);
            innerPath.Arc(innerRadius, innerRadius, 0, (endAngle > 180) ? 1 : 0, 1, innerObj.x, innerObj.y);
            innerPath.LineTo(innerX, innerY);
            innerPath.Arc(innerRadius, innerRadius, 0, (endAngle > 180) ? 1 : 0, 0, innerTargetX, innerTargetY);
            innerPath.ClosePath();
            g.append(innerPath);

			return g;
		}

		this.drawDonut3dBlock = function(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, attr, hasCircle, isLast) {
			var g = this.chart.svg.group(),
				path = this.chart.svg.path(attr),
                dist = Math.abs(outerRadius - innerRadius);

            outerRadius += dist/2;
            innerRadius = outerRadius - dist;

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle)),
				startX = obj.x,
				startY = obj.y;

			var innerObj = math.rotate(0, -innerRadius, math.radian(startAngle)),
				innerStartX = innerObj.x,
				innerStartY = innerObj.y;


			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));
			innerObj = math.rotate(innerStartX, innerStartY, math.radian(endAngle));

			// 중심점 이동
			g.translate(centerX, centerY);

            var y = obj.y + 10,
                x = obj.x + 5,
                innerY = innerObj.y + 10,
                innerX = innerObj.x + 5;

            // 왼쪽면 그리기
            var rect = this.chart.svg.path(attr);
            rect.MoveTo(obj.x, obj.y).LineTo(x, y).LineTo(innerX, innerY).LineTo(innerObj.x, innerObj.y).ClosePath();
            g.append(rect);

			return g;
		}


        this.drawUnit = function (index, data, g) {
            var obj = this.axis.c(index);

            var width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y,
                min = width;

            if (height < min) {
                min = height;
            }
          
            if (this.brush.size >= min/2) {
              this.brush.size = min/4;
            }

            // center
            var centerX = width / 2 + x,
                centerY = height / 2 + y,
                outerRadius = min / 2 - this.brush.size / 2,
                innerRadius = outerRadius - this.brush.size;

            var target = this.brush.target,
                active = this.brush.active,
                all = 360,
                startAngle = 0,
                max = 0;

            for (var i = 0; i < target.length; i++) {
                max += data[target[i]];
            }

            if (this.brush['3d']) {
                // 화면 블럭 그리기
                for (var i = 0; i < target.length; i++) {
                    var value = data[target[i]],
                        endAngle = all * (value / max),
                        donut3d = this.drawDonut3dBlock(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, {
                            fill : ColorUtil.darken(this.color(i), 0.5)
                        }, i == target.length - 1);
                    g.append(donut3d);

                    startAngle += endAngle;
                }

                startAngle = 0;
                for (var i = 0; i < target.length; i++) {
                    var value = data[target[i]],
                        endAngle = all * (value / max),
                        donut3d = this.drawDonut3d(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, {
                            fill : ColorUtil.darken(this.color(i), 0.5)
                        }, i == target.length - 1);
                    g.append(donut3d);

                    startAngle += endAngle;
                }
            }

            startAngle = 0;

            for (var i = 0; i < target.length; i++) {
                var value = data[target[i]],
                    endAngle = all * (value / max),
                    centerAngle = startAngle + (endAngle / 2) - 90,
                    donut = this.drawDonut(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, {
                        stroke : this.color(i),
                        fill : 'transparent'
                    });

                // 설정된 키 활성화
                if (active == target[i] || $.inArray(target[i], active) != -1) {
                    this.setActiveEvent(donut, centerX, centerY, centerAngle);
                    cache_active[centerAngle] = true;
                }

                // 활성화 이벤트 설정
                if (this.brush.activeEvent != null) {
                    (function (p, cx, cy, ca) {
                        p.on(self.brush.activeEvent, function (e) {
                            if (!cache_active[ca]) {
                                self.setActiveEvent(p, cx, cy, ca);
                                cache_active[ca] = true;
                            } else {
                                p.translate(cx, cy);
                                cache_active[ca] = false;
                            }
                        });

                        p.attr({ cursor: "pointer" });
                    })(donut, centerX, centerY, centerAngle);
                }

                if(this.brush.showText) {
                    var text = this.getFormatText(target[i], value),
                        elem = this.drawText(centerX, centerY, centerAngle, outerRadius, text);

                    this.addEvent(elem, index, i);
                    g.append(elem);
                }

                this.addEvent(donut, index, i);
                g.append(donut);

                startAngle += endAngle;
            }
        }
	}

	DonutBrush.setup = function() {
		return {
            /** @cfg {Number} [size=50] donut stroke width  */
			size: 50
		};
	}

	return DonutBrush;
}, "chart.brush.pie");

jui.define("chart.brush.clock", [ "util.math" ], function(math) {

    /**
     * @class chart.brush.clock 
     * 
     * implements clock brush 
     *  
     * @extends chart.brush.core  
     * 
     */
	var ClockBrush = function() {
        var w, centerX, centerY, startY, startX, outerRadius, innerRadius;

        /**
         * @method drawInnerCircle 
         *
         * 내부 원 그리기 
         *  
         * @param {Number} w
         * @param {Number} centerX
         * @param {Number} centerY
         * @returns {util.svg.element} circle element 
         */
        this.drawInnerCircle = function(w, centerX, centerY) {
            return this.chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : 10
            });
            
        }
        
        /**
         * @method drawInnerCircle2
         *
         * 내부 원 그리기 2
         *
         * @param {Number} w
         * @param {Number} centerX
         * @param {Number} centerY
         * @returns {util.svg.element} circle element
         */        
        this.drawInnerCircle2 = function(w, centerX, centerY) {
            return this.chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : 5,
                fill : 'white'
            });
            
        }

        /**
         * @method drawOuterCircle
         *
         * 바깥 원 그리기
         *
         * @param {Number} w
         * @param {Number} centerX
         * @param {Number} centerY
         * @returns {util.svg.element} circle element
         */        
        this.drawOuterCircle = function(w, centerX, centerY) {
            return this.chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : w-10,
                fill : 'transparent',
                stroke : 'black',
                "stroke-width" : 5
            });
        }
        
        
        this.drawSecond = function(w, centerX, centerY, hour, minute, second, millis) {

            var rate = 360 / 60; 
            var milliRate = rate / 1000;

            var radian = math.radian(rate * second + milliRate * millis);
            var obj = math.rotate(0, -(w-20), radian );
            
            return this.chart.svg.line({
                x1 : centerX,
                y1 : centerY,
                x2 : centerX + obj.x,
                y2 : centerY + obj.y,
                stroke : 'black'
                
            });
        }
        
        this.drawMinute = function(w, centerX, centerY, hour, minute, second, millis) {
            var g = this.chart.svg.group().translate(centerX, centerY);
            var rate = 360 / 60;
            var secondRate = rate / 60;
            var milliRate = secondRate / 1000;

            var radian = math.radian(rate * minute + secondRate * second + milliRate * millis);
            var obj = math.rotate(0, -(w-40), radian );

            return this.chart.svg.line({
                x1 : centerX,
                y1 : centerY,
                x2 : centerX + obj.x,
                y2 : centerY + obj.y,
                stroke : 'black',
                "stroke-width" : 5
            });

        }
        
        this.drawHour = function(w, centerX, centerY, hour, minute, second, millis) {
            var rate = 360 / 12;
            var minuteRate = rate / 60;
            var secondRate = minuteRate / 60;
            var milliRate = secondRate / 1000;

            var radian = math.radian(rate * hour + minuteRate * minute + secondRate * second + milliRate * millis);
            var obj = math.rotate(0, -(w-50), radian );

            return this.chart.svg.line({
                x1 : centerX,
                y1 : centerY,
                x2 : centerX + obj.x,
                y2 : centerY + obj.y,
                stroke : 'black',
                "stroke-width" : 7

            });
        }

        this.drawLine = function(w, centerX, centerY) {

            var g = this.chart.svg.group().translate(centerX, centerY);

            var hourRate = 360 / 12;
            var minuteRate = hourRate / 5;

            for (var i = 1; i <= 12; i++) {
                var radian = math.radian(hourRate * i);
                var outer = math.rotate(0, -(w-10), radian);
                var inner = math.rotate(0, -(w-20), radian);
                var text = math.rotate(0, -(w-30), radian);

                var line = this.chart.svg.line({
                    x1 : outer.x,
                    y1 : outer.y,
                    x2 : inner.x,
                    y2 : inner.y,
                    stroke : 'black',
                    "stroke-width" :  2
                });

                g.append(line);
                var minRadian = math.radian(hourRate * (i-1));
                for(var j = 1; j <= 4; j++) {
                    var radian = minRadian + math.radian(minuteRate * j);
                    var outer = math.rotate(0, -(w-10), radian);
                    var inner = math.rotate(0, -(w-15), radian);

                    var line = this.chart.svg.line({
                        x1 : outer.x,
                        y1 : outer.y,
                        x2 : inner.x,
                        y2 : inner.y,
                        stroke : 'black',
                        "stroke-width" :  2
                    });

                    g.append(line);

                }

                g.append(this.chart.text({
                    x : text.x,
                    y : text.y + 6,
                    'text-anchor' : 'middle',
                    stroke : 'black'
                }, i));

            }
            
            return g;
            
        }
        
		this.drawUnit = function(index, data, group) {
            var obj = this.axis.c(index),
                width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y;

            // center
            w = Math.min(width, height) / 2;
            centerX = width / 2 + x;
            centerY = height / 2 + y;
            
            var date = new Date(),
                hour = this.getValue(data, "hour", date.getHours()),
                minute = this.getValue(data, "minute", date.getMinutes()),
                second = this.getValue(data, "second", date.getSeconds()),
                millis = date.getMilliseconds();

            group.append(this.drawOuterCircle(w, centerX, centerY));
            group.append(this.drawInnerCircle(w, centerX, centerY));
            group.append(this.drawLine(w, centerX, centerY));
            group.append(this.drawSecond(w, centerX, centerY, hour, minute, second, millis));
            group.append(this.drawMinute(w, centerX, centerY, hour, minute, second, millis));
            group.append(this.drawHour(w, centerX, centerY, hour, minute, second, millis));
            group.append(this.drawInnerCircle2(w, centerX, centerY));
            
            return group; 
		}

        this.draw = function() {
            var group = this.chart.svg.group();

            this.eachData(function(i, data) {
                this.drawUnit(i, data, group);
            });

            return group;
        }
	}

	return ClockBrush;
}, "chart.brush.core");

jui.define("chart.brush.scatter", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.scatter
     *
     * 점으로 이루어진 데이타를 표현하는 브러쉬
     *
     * @extends chart.brush.core
     */
    var ScatterBrush = function() {

        /**
         * @method createScatter
         *
         * 좌표별 scatter 생성
         *
         * @param {Object} pos
         * @param {Number} index
         * @return {util.svg.element}
         */
        this.createScatter = function(pos, index) {
            var self = this,
                elem = null,
                target = this.chart.get("series", this.brush.target[index]),
                symbol = (!target.symbol) ? this.brush.symbol : target.symbol,
                w = h = this.brush.size;

            var color = this.color(index),
                borderColor = this.chart.theme("scatterBorderColor"),
                borderWidth = this.chart.theme("scatterBorderWidth");

            if(_.typeCheck("function", symbol)) {
                elem = this.chart.svg.image({
                    "xlink:href": symbol(pos.value),
                    width: w + borderWidth,
                    height: h + borderWidth,
                    x: pos.x - (w / 2) - borderWidth,
                    y: pos.y - (h / 2)
                });
            } else {
                if(symbol == "triangle" || symbol == "cross") {
                    elem = this.chart.svg.group({ width: w, height: h }, function() {
                        if(symbol == "triangle") {
                            var poly = self.chart.svg.polygon();

                            poly.point(0, h)
                                .point(w, h)
                                .point(w / 2, 0);
                        } else {
                            self.chart.svg.line({ stroke: color, "stroke-width": borderWidth * 2, x1: 0, y1: 0, x2: w, y2: h });
                            self.chart.svg.line({ stroke: color, "stroke-width": borderWidth * 2, x1: 0, y1: w, x2: h, y2: 0 });
                        }
                    }).translate(pos.x - (w / 2), pos.y - (h / 2));
                } else {
                    if(symbol == "rectangle") {
                        elem = this.chart.svg.rect({
                            width: w,
                            height: h,
                            x: pos.x - (w / 2),
                            y: pos.y - (h / 2)
                        });
                    } else {
                        elem = this.chart.svg.ellipse({
                            rx: w / 2,
                            ry: h / 2,
                            cx: pos.x,
                            cy: pos.y
                        });
                    }
                }

                if(symbol != "cross") {
                    elem.attr({
                        fill: color,
                        stroke: borderColor,
                        "stroke-width": borderWidth
                    })
                    .hover(function () {
                        if(elem == self.activeScatter) return;

                        elem.attr({
                            fill: self.chart.theme("scatterHoverColor"),
                            stroke: color,
                            "stroke-width": borderWidth * 2,
                            opacity: 1
                        });
                    }, function () {
                        if(elem == self.activeScatter) return;

                        elem.attr({
                            fill: color,
                            stroke: borderColor,
                            "stroke-width": borderWidth,
                            opacity: (self.brush.hide) ? 0 : 1
                        });
                    });
                }
            }

            return elem;
        }

        /**
         * @method drawScatter
         *
         * scatter 그리기
         *
         * @param {Array} points
         * @return {util.svg.element} g element 리턴
         */
        this.drawScatter = function(points) {
            var self = this;

            var g = this.chart.svg.group(),
                borderColor = this.chart.theme("scatterBorderColor"),
                borderWidth = this.chart.theme("scatterBorderWidth");

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].length; j++) {
                    if(this.brush.hideZero && points[i].value[j] === 0) {
                        continue;
                    }

                    var data = {
                        x: points[i].x[j],
                        y: points[i].y[j],
                        max: points[i].max[j],
                        min: points[i].min[j],
                        value: points[i].value[j]
                    };

                    var p = this.createScatter(data, i);

                    // Max & Min 툴팁 생성
                    if(this.brush.display == "max" && data.max || this.brush.display == "min" && data.min) {
                        g.append(this.drawTooltip(data.x, data.y, this.format(data.value)));
                    }

                    // 컬럼 및 기본 브러쉬 이벤트 설정
                    if(this.brush.activeEvent != null) {
                        (function(scatter, x, y, text, color) {
                            scatter.on(self.brush.activeEvent, function(e) {
                                if(self.brush.symbol != "cross") {
                                    if (self.activeScatter != null) {
                                        self.activeScatter.attr({
                                            fill: self.activeScatter.attributes["stroke"],
                                            stroke: borderColor,
                                            "stroke-width": borderWidth,
                                            opacity: (self.brush.hide) ? 0 : 1
                                        });
                                    }

                                    self.activeScatter = scatter;
                                    self.activeScatter.attr({
                                        fill: self.chart.theme("scatterHoverColor"),
                                        stroke: color,
                                        "stroke-width": borderWidth * 2,
                                        opacity: 1
                                    });
                                }

                                self.activeTooltip.html(text);
                                self.activeTooltip.translate(x, y);
                            });

                            scatter.attr({ cursor: "pointer" });
                        })(p, data.x, data.y, this.format(data.value), this.color(i));
                    }

                    if(this.brush.hide) {
                        p.attr({ opacity: 0 });
                    }

                    this.addEvent(p, j, i);
                    g.append(p);
                }
            }

            // 액티브 툴팁
            this.activeTooltip = this.drawTooltip(0, 0, "");
            g.append(this.activeTooltip);

            return g;
        }

        this.drawTooltip = function(x, y, text) {
            return this.chart.text({
                y: -this.brush.size,
                "text-anchor" : "middle",
                "font-weight" : this.chart.theme("tooltipPointFontWeight")
            }, text).translate(x, y);
        }

        /**
         * @method draw
         *
         * @return {util.svg.element}
         */
        this.draw = function() {
            return this.drawScatter(this.getXY());
        }

        this.drawAnimate = function() {
            var area = this.chart.area();

            return this.chart.svg.animateTransform({
                attributeName: "transform",
                type: "translate",
                from: area.x + " " + area.height,
                to: area.x + " " + area.y,
                begin: "0s" ,
                dur: "0.4s",
                repeatCount: "1"
            });
        }
    }

    ScatterBrush.setup = function() {
        return {
            /** @cfg {"circle"/"triangle"/"rectangle"/"cross"/"callback"} [symbol="circle"] Determines the shape of a (circle, rectangle, cross, triangle).  */
            symbol: "circle",
            /** @cfg {Number} [size=7]  Determines the size of a starter. */
            size: 7,
            /** @cfg {Boolean} [hide=false]  Hide the scatter, will be displayed only when the mouse is over. */
            hide: false,
            /** @cfg {Boolean} [hideZero=false]  When scatter value is zero, will be hidden. */
            hideZero: false,
            /** @cfg {String} [activeEvent=null]  Activates the scatter in question when a configured event occurs (click, mouseover, etc). */
            activeEvent: null,
            /** @cfg {"max"/"min"} [display=null]  Shows a tooltip on the scatter for the minimum/maximum value.  */
            display: null,
            /** @cfg {Boolean} [clip=false] If the brush is drawn outside of the chart, cut the area. */
            clip: false
        };
    }

    return ScatterBrush;
}, "chart.brush.core");
jui.define("chart.brush.scatterpath", ["util.base"], function(_) {

    /**
     * @class chart.brush.scatterpath
     *
     * scatter path 는 path 를 이용해서 최적화된 symbol 을 그리는 브러쉬
     *
     * scatter 로 표현하지 못하는 많은 양의 데이타를 표시 하는데 사용할 수 있다.
     *
     * @extends chart.brush.core
     *
     */
	var ScatterPathBrush = function() {

        this.drawScatter = function(points) {
            //"use asm";
            var width = height = this.brush.size,
                color = this.color(0),
                strokeWidth = this.brush.strokeWidth;

            var opt = {
                fill : "none",
                    stroke : color,
                "stroke-width" : strokeWidth,
                "stroke-opacity" : 1,
                "stroke-linecap" : "butt",
                "stroke-linejoin" :  "round"
            };

            var g = this.chart.svg.group(),
                path = this.chart.svg.pathSymbol();

            var tpl = path.template(width, height);

            var count = 5;
            var list = [];

            for(var i = 1; i <= count; i++) {
                list[i] = this.chart.svg.pathSymbol(opt);
            }

            var loop = _.loop(points[0].x.length);

            for(var i = 0; i < points.length; i++) {
                var target = this.chart.get("series", this.brush.target[i]),
                    symbol = (target && target.symbol) ? target.symbol : this.brush.symbol;

                loop(function(index, group) {
                    list[group].add(points[i].x[index]|0, points[i].y[index]|0, tpl[symbol]);
                })

            }

            for(var i = 1; i <= count; i++) {
                g.append(list[i]);
            }
            
            path.remove();

            return g;
        }

        this.draw = function() {
            return this.drawScatter(this.getXY(false));
        }
	}

    ScatterPathBrush.setup = function() {
        return {
            /** @cfg {"circle"/"triangle"/"rectangle"/"cross"} [symbol="circle"] Determines the shape of a starter (circle, rectangle, cross, triangle).  */
            symbol: "circle", // or triangle, rectangle, cross
            /** @cfg {Number} [size=7]  Determines the size of a starter. */
            size: 7,
            /** @cfg {Number} [strokeWidth=1] Set the line thickness of a starter. */
            strokeWidth : 1
        };
    }

	return ScatterPathBrush;
}, "chart.brush.core");
jui.define("chart.brush.bargauge", [], function() {

    /**
     * @class chart.brush.bargauge 
     *
     * @extends chart.brush.core
     */
	var BarGaugeBrush = function(chart, axis, brush) {

        /**
         * @method draw
         * 
         * @protected
         * @return {TransformElement}
         */
		this.draw = function() {
            var group = chart.svg.group();

            var obj = axis.c(0),
                width = obj.width,
                x = obj.x,
                y = obj.y;

			this.eachData(function(i, data) {
                var g = chart.svg.group(),
                    v = this.getValue(data, "value", 0),
                    t = this.getValue(data, "title", ""),
                    max = this.getValue(data, "max", 100),
                    min = this.getValue(data, "min", 0);

                var value = (width / (max - min)) * v,
                    textY = (y + brush.size / 2 + brush.cut) - 1;

                g.append(chart.svg.rect({
                    x : x + brush.cut,
                    y : y,
                    width: width,
                    height : brush.size,
                    fill : chart.theme("bargaugeBackgroundColor")
                }));
                
                g.append(chart.svg.rect({
                    x : x,
                    y : y,
                    width: value,
                    height : brush.size,
                    fill : chart.color(i, brush)
                }));

                g.append(chart.text({
                    x : x + brush.cut,
                    y : textY,
                    "text-anchor" : "start",
                    "font-size" : chart.theme("bargaugeFontSize"),
                    fill : chart.theme("bargaugeFontColor")
                }, t));
                
                g.append(chart.text({
                    x : width - brush.cut,
                    y : textY,
                    "text-anchor" : "end",
                    "font-size" : chart.theme("bargaugeFontSize"),
                    fill : chart.theme("bargaugeFontColor")
                }, this.format(v, i)));

                this.addEvent(g, i, null);
                group.append(g);

                y += brush.size + brush.cut;
			});

            return group;
		}
	}

    BarGaugeBrush.setup = function() {
        return {
            /** @cfg {Number} [cut=5] Determines the spacing of a bar gauge. */
            cut: 5,
            /** @cfg {Number} [size=20] Determines the size of a bar gauge. */
            size: 20,
            /** @cfg {Function} [format=null] bar gauge format callback */
            format: null,

            max : 100,

            min : 0
        };
    }

	return BarGaugeBrush;
}, "chart.brush.core");

jui.define("chart.brush.circlegauge", [], function() {

    /**
     * @class chart.brush.circlegauge 
     * 
     * implements circle gauge  
     *
     * @extends chart.brush.core 
     */
	var CircleGaugeBrush = function(chart, axis, brush) {
        var group;
        var w, centerX, centerY, outerRadius;

        this.drawUnit = function(i, data) {
            var obj = axis.c(i),
                value = this.getValue(data, "value", 0),
                max = this.getValue(data, "max", 100),
                min = this.getValue(data, "min", 0);

            var rate = (value - min) / (max - min),
                width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y;

            // center
            w = Math.min(width, height) / 2;
            centerX = width / 2 + x;
            centerY = height / 2 + y;
            outerRadius = w;

            group.append(chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : outerRadius,
                fill : chart.theme("gaugeBackgroundColor"),
                stroke : this.color(0),
                "stroke-width" : 2
            }));

            group.append(chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : outerRadius * rate,
                fill : this.color(0)
            }));

            this.addEvent(group, null, null);
        }
        
		this.draw = function() {
            group = chart.svg.group();

            this.eachData(function(i, data) {
                this.drawUnit(i, data);
            });

            return group;
		}
	}

    CircleGaugeBrush.setup = function() {
        return {
            /** @cfg {Boolean} [clip=false] If the brush is drawn outside of the chart, cut the area. */
            clip: false
        }
    }

	return CircleGaugeBrush;
}, "chart.brush.core");

jui.define("chart.brush.fillgauge", [ "jquery", "util.base" ], function($, _) {

	var FillGaugeBrush = function(chart, axis, brush) {
        var self = this;
        var w, centerX, centerY, outerRadius, clipId;
        var rect;

        function setDirection(direction) {
            var rate = (brush.value - brush.min) / (brush.max - brush.min);

            if (direction == "vertical") {
                var height = chart.area('height') * rate;
                var width = chart.area('width');
                var x = 0;
                var y = chart.area('height') - height;
            } else {		// horizontal
                var height = chart.area('height');
                var width = chart.area('width') * rate;
                var x = 0;
                var y = 0;
            }

            rect.attr({
                x : x,
                y : y,
                width : width,
                height : height
            });
        }

        function createPath(group, path) {
            group.append(chart.svg.path({
                x : 0,
                y : 0,
                fill : chart.theme("gaugeBackgroundColor"),
                d : path
            }));

            group.append(chart.svg.path({
                x : 0,
                y : 0,
                fill : self.color(0),
                d : path,
                "clip-path" : "url(#" + clipId + ")"
            }));
        }

        this.drawBefore = function() {
            var axis = axis || {};
            
            var obj = axis.c(),
                width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y,
                min = width;

            if (height < min) {
                min = height;
            }

            w = min / 2;
            centerX = width / 2 + x;
            centerY = height / 2 + y;
            outerRadius = w;
            clipId = _.createId("fill-gauge");

            var clip = chart.svg.clipPath({
                id : clipId
            });

            rect = chart.svg.rect({
                x : 0,
                y : 0,
                width : 0,
                height : 0
            });

            clip.append(rect);
            chart.defs.append(clip);
        }
		
		this.draw = function() {
			var group = chart.svg.group({
				opacity : 0.8
			});

			setDirection(brush.direction);

            if (brush.svg != "" || brush.path != "") {
                if (brush.svg != "") {
                    $.ajax({
                        url : brush.svg,
                        async : false,
                        success : function(xml) {
                            var path = $(xml).find("path").attr("d");
                            createPath(group, path);
                        }
                    });
                } else {
                    createPath(group, brush.path);
                }
            } else {
                if (brush.shape == "circle") {
                    group.append(chart.svg.circle({
                        cx : centerX,
                        cy : centerY,
                        r : outerRadius,
                        fill : chart.theme("gaugeBackgroundColor")
                    }));

                    group.append(chart.svg.circle({
                        cx : centerX,
                        cy : centerY,
                        r : outerRadius,
                        fill : chart.color(0, brush),
                        "clip-path" : "url(#" + clipId + ")"
                    }));

                } else if (brush.shape == "rectangle") {
                    group.append(chart.svg.rect({
                        x : 0,
                        y : 0,
                        width : chart.area('width'),
                        height : chart.area('height'),
                        fill : chart.theme("gaugeBackgroundColor")
                    }));

                    group.append(chart.svg.rect({
                        x : 0,
                        y : 0,
                        width : chart.area('width'),
                        height : chart.area('height'),
                        fill : this.color(0),
                        "clip-path" : "url(#" + clipId + ")"
                    }));

                }
            }

            return group;
		}
	}

    FillGaugeBrush.setup = function() {
        return {
            /** @cfg {Number} [min=0] Determines the minimum size of a fill gauge.*/
            min: 0,
            /** @cfg {Number} [max=100] Determines the maximum size of a fill gauge.*/
            max: 100,
            /** @cfg {Number} [value=0] Determines the value of a fill gauge. */
            value: 0,
            /** @cfg {String} [shape="circle"] Determines the shape of a fill gauge (circle, rectangle).*/
            shape: "circle", // or rectangle
            /** @cfg {String} [direction="vertical"] Determines the direction in which a fill gauge is to be filled (vertical, horizontal). */
            direction: "vertical",
            /** @cfg {String} [svg=""] Sets the shape of a fill gauge with a specified URL as an SVG tag. */
            svg: "",
            /** @cfg {String} [path=""] Sets the shape of a fill gauge with a specified pass tag.*/
            path: ""
        };
    }

	return FillGaugeBrush;
}, "chart.brush.core");

jui.define("chart.brush.area", [], function() {

    /**
     * @class chart.brush.area
     *
     * implements area brush
     *
     *
     * @extends chart.brush.line
     */
    var AreaBrush = function() {

        /**
         * @method drawArea 
         * 
         * draw area util method
         *
         * @param {Array} path  caculated xy points
         * @return {TransformElement}
         * @protected
         */
        this.drawArea = function(path) {
            var g = this.chart.svg.group(),
                y = this.axis.y(this.brush.startZero ? 0 : this.axis.y.min());

            for(var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k),
                    xList = path[k].x;

                if(path[k].length > 0) {
                    p.LineTo(xList[xList.length - 1], y);
                    p.LineTo(xList[0], y);
                    p.ClosePath();
                }

                p.attr({
                    fill: this.color(k),
                    "fill-opacity": this.chart.theme("areaBackgroundOpacity"),
                    "stroke-width": 0
                });

                this.addEvent(p, null, k);
                g.prepend(p);

                // Add line
                if(this.brush.line) {
                    g.prepend(this.createLine(path[k], k));
                }
            }

            return g;
        }

        /**
         * @method draw 
         * 
         * @protected  
         * @return {TransformElement}
         */
        this.draw = function() {
            return this.drawArea(this.getXY());
        }

        /**
         * @method drawAnimate
         *
         * @protected
         */
        this.drawAnimate = function(root) {
            root.append(
                this.chart.svg.animate({
                     attributeName: "opacity",
                     from: "0",
                     to: "1",
                     begin: "0s" ,
                     dur: "1.5s",
                     repeatCount: "1",
                     fill: "freeze"
                 })
            );
        }
    }

    AreaBrush.setup = function() {
        return {
            /** @cfg {"normal"/"curve"/"step"} [symbol="normal"] Sets the shape of a line (normal, curve, step). */
            symbol: "normal", // normal, curve, step
            /** @cfg {Number} [active=null] Activates the bar of an applicable index. */
            active: null,
            /** @cfg {String} [activeEvent=null]  Activates the bar in question when a configured event occurs (click, mouseover, etc). */
            activeEvent: null,
            /** @cfg {"max"/"min"} [display=null]  Shows a tool tip on the bar for the minimum/maximum value.  */
            display: null,
            /** @cfg {Boolean} [startZero=false]  The end of the area is zero point. */
            startZero: false,
            /** @cfg {Boolean} [line=true]  Visible line */
            line: true
        };
    }

    return AreaBrush;
}, "chart.brush.line");

jui.define("chart.brush.stackline", [], function() {

	/**
	 * @class chart.brush.stackline
	 *
	 * stack 형태의 line 브러쉬
	 *
	 * @extends chart.brush.line
	 */
	var StackLineBrush = function() {
        this.draw = function() {
            return this.drawLine(this.getStackXY());
        }
	}

	return StackLineBrush;
}, "chart.brush.line");
jui.define("chart.brush.stackarea", [], function() {

	/**
	 * @class chart.brush.stackarea
	 *
	 * stack 형태의 area brush
	 *
	 * @extends chart.brush.area
	 */
	var StackAreaBrush = function() {
		this.draw = function() {
            return this.drawArea(this.getStackXY());
		}
	}

	return StackAreaBrush;
}, "chart.brush.area");

jui.define("chart.brush.stackscatter", [], function() {

	/**
	 * @class chart.brush.stackscatter
	 *
	 * stack 형태의 scatter 브러쉬
	 *
	 * @extends chart.brush.scatter
	 */
	var StackScatterBrush = function() {
        this.draw = function() {
            return this.drawScatter(this.getStackXY());
        }
	}

	return StackScatterBrush;
}, "chart.brush.scatter");
jui.define("chart.brush.gauge", [ "util.math" ], function(math) {

    /**
     * @class chart.brush.gauge 
     * 
     * implements gauge brush 
     *  
     * @extends chart.brush.donut
     */
	var GaugeBrush = function() {
		var self = this;
        var w, centerX, centerY, outerRadius, innerRadius;

        function createText(startAngle, endAngle, min, max, value, unit) {
			var g = self.chart.svg.group({
				"class" : "gauge text"
			}).translate(centerX, centerY);

			g.append(self.chart.svg.text({
				x : 0,
				y : (self.brush.arrow) ? 70 : 10,
				"text-anchor" : "middle",
				"font-size" : "3em",
				"font-weight" : 1000,
				"fill" : self.color(0)
			}, value + ""));

			if (unit != "") {
				g.append(self.chart.text({
					x : 0,
					y : 100,
					"text-anchor" : "middle",
					"font-size" : "1.5em",
					"font-weight" : 500,
					"fill" : self.chart.theme("gaugeFontColor")
				}, unit))
			}

			// 바깥 지름 부터 그림
			var startX = 0;
			var startY = -outerRadius;

            // min
            var obj = math.rotate(startX, startY, math.radian(startAngle));

            startX = obj.x;
            startY = obj.y;

            g.append(self.chart.text({
                x : obj.x + 30,
                y : obj.y + 20,
                "text-anchor" : "middle",
				"fill" : self.chart.theme("gaugeFontColor")
            }, min + ""));

			// max
			// outer arc 에 대한 지점 설정
            var obj = math.rotate(startX, startY, math.radian(endAngle));
    
            g.append(self.chart.text({
                x : obj.x - 20,
                y : obj.y + 20,
                "text-anchor" : "middle",
				"fill" : self.chart.theme("gaugeFontColor")
            }, max + ""));

			return g;
		}

        this.drawBefore = function() {

        }

        /**
         * @method drawUnit 
         * 
         * data 별 gague 를 그린다.
         *  
         * @param {Number} index
         * @param {Object} data
         * @param {util.svg.element} group
         * @return {util.svg.element}
         */
		this.drawUnit = function(index, data, group) {
			var obj = this.axis.c(index),
				value = this.getValue(data, "value", 0),
				max = this.getValue(data, "max", 100),
				min = this.getValue(data, "min", 0),
				unit = this.getValue(data, "unit");

			var startAngle = this.brush.startAngle;
			var endAngle = this.brush.endAngle;

			if (endAngle >= 360) {
				endAngle = 359.99999;
			}

			var rate = (value - min) / (max - min),
				currentAngle = endAngle * rate;

			if (currentAngle > endAngle) {
				currentAngle = endAngle;
			}

			var width = obj.width,
				height = obj.height,
				x = obj.x,
				y = obj.y;

			// center
			w = Math.min(width, height) / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w - this.brush.size/2;
			innerRadius = outerRadius - this.brush.size;

			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, startAngle + currentAngle, endAngle - currentAngle, {
				fill : "transparent",
				stroke : this.chart.theme("gaugeBackgroundColor")
			}));


			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, startAngle, currentAngle, {
				fill : "transparent",
				stroke : this.color(index)
			}));


			// startAngle, endAngle 에 따른 Text 위치를 선정해야함
			group.append(createText(startAngle, endAngle, min, max, value, unit));

			return group;
		}

		this.draw = function() {

			var group = this.chart.svg.group();

			this.eachData(function(i, data) {
				this.drawUnit(i, data, group);
			});

			return group;

		}
	}

	GaugeBrush.setup = function() {
		return {
            /** @cfg {Number} [size=30] Determines the stroke width of a gauge.  */
			size: 30,
            /** @cfg {Number} [startAngle=0] Determines the start angle(as start point) of a gauge. */
			startAngle: 0,
            /** @cfg {Number} [endAngle=360] Determines the end angle(as draw point) of a gauge. */
			endAngle: 360
		};
	}

	return GaugeBrush;
}, "chart.brush.donut");

jui.define("chart.brush.fullgauge", ["util.math"], function(math) {

	/**
	 * @class chart.brush.fullgauge
	 * implements full gauge brush
	 * @extends chart.brush.donut
	 */
	var FullGaugeBrush = function() {
		var self = this, textY = 5;
        var group, w, centerX, centerY, outerRadius, innerRadius, textScale;

		function createText(value, index) {
			var g = self.chart.svg.group().translate(centerX, centerY);

            g.append(self.chart.text({
                "text-anchor" : "middle",
                "font-size" : self.chart.theme("gaugeFontSize"),
                "font-weight" : self.chart.theme("gaugeFontWeight"),
                "fill" : self.color(0),
                y: textY
            }, self.format(value, index)).scale(textScale));

			return g;
		}

        function createTitle(title, dx, dy) {
            var g = self.chart.svg.group().translate(centerX + dx, centerY + dy),
                anchor = (dx == 0) ? "middle" : ((dx < 0) ? "end" : "start");

            g.append(self.chart.text({
                "text-anchor" : anchor,
                "font-size" : self.chart.theme("gaugeTitleFontSize"),
                "font-weight" : self.chart.theme("gaugeTitleFontWeight"),
                fill : self.chart.theme("gaugeTitleFontColor"),
                y: textY
            }, title).scale(textScale));

            return g;
        }

		this.drawUnit = function(index, data) {
			var obj = this.axis.c(index),
				value = this.getValue(data, "value", 0),
                title = this.getValue(data, "title"),
				max = this.getValue(data, "max", 100),
				min = this.getValue(data, "min", 0);

			var startAngle = this.brush.startAngle;
			var endAngle = this.brush.endAngle;

			if (endAngle >= 360) {
				endAngle = 359.99999;
			}

			var rate = (value - min) / (max - min),
				currentAngle = endAngle * rate;

			if (currentAngle > endAngle) {
				currentAngle = endAngle;
			}

			var width = obj.width,
				height = obj.height,
				x = obj.x,
				y = obj.y;

			// center
			w = Math.min(width, height) / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w - this.brush.size;
			innerRadius = outerRadius - this.brush.size;
            textScale = this.getScaleValue(w, 40, 400, 1, 1.5);

			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, startAngle + currentAngle, endAngle - currentAngle, {
				stroke : this.chart.theme("gaugeBackgroundColor"),
				fill : "transparent"
			}));

			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, startAngle, currentAngle, {
				stroke : this.color(index),
				fill : "transparent"
			}));

            if(this.brush.showText) {
                group.append(createText(value, index));
            }

            if(title != "") {
                group.append(createTitle(title, this.brush.titleX, this.brush.titleY));
            }

			return group;
		}

		this.draw = function() {
			group = this.chart.svg.group();

			this.eachData(function(i, data) {
				this.drawUnit(i, data);
			});

			return group;
		}
	}

	FullGaugeBrush.setup = function() {
		return {
			/** @cfg {Number} [size=30] Determines the stroke width of a gauge.  */
			size: 60,
			/** @cfg {Number} [startAngle=0] Determines the start angle(as start point) of a gauge. */
			startAngle: 0,
			/** @cfg {Number} [endAngle=360] Determines the end angle(as draw point) of a gauge. */
			endAngle: 360,
			/** @cfg {Boolean} [showText=true] */
            showText: true,
			/** @cfg {Number} [titleX=0] */
            titleX: 0,
			/** @cfg {Number} [titleY=0]  */
            titleY: 0,
			/** @cfg {Function} [format=null] */
            format: null
		};
	}

	return FullGaugeBrush;
}, "chart.brush.donut");

jui.define("chart.brush.stackgauge", [ "util.math" ], function(math) {

	/**
	 * @class chart.brush.stackgauge
	 *
	 * stack 형태의 gauge 브러쉬
	 *
	 * @extends chart.brush.donut
	 */
	var StackGaugeBrush = function(chart, axis, brush) {
        var w, centerX, centerY, outerRadius;

		this.drawBefore = function() {
			if (!axis.c) {
				axis.c = function() {
					return {
						x : 0,
						y : 0,
						width : chart.area("width"),
						height : chart.area("height")
					};
				}
			}

			var obj = axis.c(),
				width = obj.width,
				height = obj.height,
				x = obj.x,
				y = obj.y,
				min = width;

			if (height < min) {
				min = height;
			}

			w = min / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w;
		}

		this.draw = function() {
			var group = chart.svg.group();
			
			this.eachData(function(i, data) {
				var rate = (data[brush.target] - brush.min) / (brush.max - brush.min),
                    currentAngle = (brush.endAngle) * rate,
                    innerRadius = outerRadius - brush.size + brush.cut;
				
				if (brush.endAngle >= 360) {
                    brush.endAngle = 359.99999;
				}
				
				// 빈 공간 그리기 
				var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle - currentAngle, {
					fill : chart.theme("gaugeBackgroundColor")
				});
	
				group.append(g);
				
				// 채워진 공간 그리기 
				g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle,{
					fill : this.color(i)
				}, true);
	
				group.append(g);
				
				// draw text 
				group.append(chart.text({
					x : centerX + 2,
					y : centerY + Math.abs(outerRadius) - 5,
					fill : this.color(i),
					"font-size" : "12px",
					"font-weight" : "bold"
				}, data[brush.title] || ""))
				
				outerRadius -= brush.size;
			});

            return group;
		}
	}

	StackGaugeBrush.setup = function() {
		return {
			/** @cfg {Number} [min=0] Determines the minimum value of a stack gauge.*/
			min: 0,
			/** @cfg {Number} [max=100] Determines the maximum value of a stack gauge.*/
			max: 100,
			/** @cfg {Number} [cut=5] Determines the bar spacing of a stack gauge.*/
			cut: 5,
			/** @cfg {Number} [size=24] Determines the bar size of a stack gauge.*/
			size: 24,
			/** @cfg {Number} [startAngle=-180] Determines the start angle of a stack gauge.*/
			startAngle: -180,
			/** @cfg {Number} [endAngle=360] Determines the end angle of a stack gauge.*/
			endAngle: 360,
			/** @cfg {String} [title="title"] Sets a data key to be configured as the title of a stack gauge.*/
			title: "title"
		};
	}

	return StackGaugeBrush;
}, "chart.brush.donut");

jui.define("chart.brush.waterfall", [], function() {

	/**
	 * @class chart.brush.waterfall
	 *
	 * waterfall 형태의 브러쉬
	 *
	 * @extends chart.brush.core
	 */
	var WaterFallBrush = function(chart, axis, brush) {
		var g, count, zeroY, width, columnWidth, half_width;
		var outerPadding;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
			count = this.listData().length;
			zeroY = axis.y(0);

			width = axis.x.rangeBand();
			half_width = (width - outerPadding * 2);
			columnWidth = (width - outerPadding * 2 - (brush.target.length - 1)) / brush.target.length;
		}

		this.draw = function() {
			var target = brush.target[0],
				stroke = chart.theme("waterfallLineColor");

			this.eachData(function(i, data) {
				var startX = axis.x(i) - half_width / 2,
					startY = axis.y(data[target]),
					r = null, l = null;

				if(i == 0 || (i == count - 1 && brush.end)) {
					var color = chart.theme("waterfallEdgeBackgroundColor");

					if (startY <= zeroY) {
						r = chart.svg.rect({
							x: startX,
							y: startY,
							width: columnWidth,
							height: Math.abs(zeroY - startY),
							fill: color
						});
					} else {
						r = chart.svg.rect({
							x: startX,
							y: zeroY,
							width: columnWidth,
							height: Math.abs(zeroY - startY),
							fill: color
						});
					}
				} else {
					var preValue = this.getData(i - 1)[target],
						nowValue = data[target],
						preStartY = axis.y(preValue),
						nowStartY = axis.y(nowValue),
						h = preStartY - nowStartY;

					if(h > 0) {
						r = chart.svg.rect({
							x: startX,
							y: preStartY - h,
							width: columnWidth,
							height: Math.abs(h),
							fill: chart.theme("waterfallBackgroundColor")
						});
					} else {
						r = chart.svg.rect({
							x: startX,
							y: preStartY,
							width: columnWidth,
							height: Math.abs(h),
							fill: chart.theme("waterfallInvertBackgroundColor")
						});
					}

					if(brush.line) {
						l = chart.svg.line({
							x1: startX - outerPadding * 2,
							y1: nowStartY + h,
							x2: startX,
							y2: nowStartY + h,
							stroke: stroke,
							"stroke-width": 1,
							"stroke-dasharray": chart.theme("waterfallLineDashArray")
						});

						g.append(l);
					}
				}

				this.addEvent(r, i, 0);
				g.append(r);

				startX += columnWidth;
			});

            return g;
		}
	}

	WaterFallBrush.setup = function() {
		return {
			/** @cfg {Boolean} [line=true] Connects with a line between columns of a waterfall.*/
			line: true,
			/** @cfg {Boolean} [end=false] Sets effects for the last column of a waterfall.*/
			end: false,
			/** @cfg {Boolean} [outerPadding=5] Determines the outer margin of a waterfall.*/
			outerPadding: 5
		};
	}

	return WaterFallBrush;
}, "chart.brush.core");

jui.define("chart.brush.splitline", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.splitline
     *
     * 분리된 영역의 선을 그리는 브러쉬
     *
     * @extends chart.brush.core
     */
	var SplitLineBrush = function() {
        this.createLine = function(pos, index) {
            var opts = {
                stroke: this.color(index),
                "stroke-width": this.chart.theme("lineBorderWidth"),
                fill: "transparent"
            };

            var split = this.brush.split,
                symbol = this.brush.symbol;

            var x = pos.x,
                y = pos.y,
                px, py; // curve에서 사용함

            var g = this.chart.svg.group(),
                p = this.chart.svg.path(opts).MoveTo(x[0], y[0]);

            if(symbol == "curve") {
                px = this.curvePoints(x);
                py = this.curvePoints(y);
            }

            for(var i = 0; i < x.length - 1; i++) {
                if(g.children.length == 0) {
                    if ((_.typeCheck("integer", split) && i == split) ||
                        (_.typeCheck("date", split) && this.axis.x.invert(x[i]).getTime() >= split.getTime())) {
                        var color = this.chart.theme("lineSplitBorderColor"),
                            opacity = this.chart.theme("lineSplitBorderOpacity");

                        g.append(p);

                        opts["stroke"] = (color != null) ? color : opts["stroke"];
                        opts["stroke-opacity"] = opacity;

                        p = this.chart.svg.path(opts).MoveTo(x[i], y[i]);
                    }
                }

                if(symbol == "step") {
                    var sx = x[i] + ((x[i + 1] - x[i]) / 2);

                    p.LineTo(sx, y[i]);
                    p.LineTo(sx, y[i + 1]);
                }

                if(symbol != "curve") {
                    p.LineTo(x[i + 1], y[i + 1]);
                } else {
                    p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                }
            }

            g.append(p);

            return g;
        }

        this.drawLine = function(path) {
            var g = this.chart.svg.group();

            for(var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k);

                this.addEvent(p, null, k);
                g.append(p);
            }

            return g;
        }

        this.draw = function() {
            return this.drawLine(this.getXY());
        }
	}

    SplitLineBrush.setup = function() {
        return {
            /** @cfg {"normal"/"curve"/"step"} [symbol="normal"] Sets the shape of a line (normal, curve, step).  */
            symbol: "normal", // normal, curve, step
            /** @cfg {Number} [split=null] Sets the style of a line of a specified index value.  */
            split: null
        };
    }

	return SplitLineBrush;
}, "chart.brush.core");
jui.define("chart.brush.splitarea", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.splitarea
     *
     * 분리된 영역의 브러쉬
     *
     * @extends chart.brush.splitline
     */
    var SplitAreaBrush = function() {

        this.drawArea = function(path) {
            var g = this.chart.svg.group(),
                maxY = this.chart.area('height'),
                split = this.brush.split,
                splitColor = this.chart.theme("areaSplitBackgroundColor");

            for(var k = 0; k < path.length; k++) {
                var opts = {
                    fill: this.color(k),
                    "fill-opacity": this.chart.theme("areaBackgroundOpacity"),
                    "stroke-width": 0
                };

                var line = this.createLine(path[k], k),
                    xList = path[k].x;

                // 날짜일 경우, 해당 인덱스를 구해야 함
                if(_.typeCheck("date", split)) {
                    for(var i = 0; i < xList.length - 1; i++) {
                        if(this.axis.x.invert(xList[i]).getTime() >= split.getTime()) {
                            split = i;
                            break;
                        }
                    }
                }

                line.each(function(i, p) {
                    if(i == 0) {
                        split = (split != null) ? split : xList.length - 1;

                        p.LineTo(xList[split], maxY);
                        p.LineTo(xList[0], maxY);
                        p.attr(opts);
                    } else {
                        opts["fill"] = splitColor;

                        p.LineTo(xList[xList.length - 1], maxY);
                        p.LineTo(xList[split], maxY);
                        p.attr(opts);
                    }

                    p.ClosePath();
                });

                this.addEvent(line, null, k);
                g.prepend(line);

                // Add line
                if(this.brush.line) {
                    g.prepend(this.createLine(path[k], k));
                }
            }

            return g;
        }

        this.draw = function() {
            return this.drawArea(this.getXY());
        }
    }

    SplitAreaBrush.setup = function() {
        return {
            /** @cfg {"normal"/"curve"/"step"} [symbol="normal"] Sets the shape of a line (normal, curve, step).  */
            symbol: "normal", // normal, curve, step
            /** @cfg {Number} [split=null] Sets the style of a line of a specified index value.  */
            split: null,
            /** @cfg {Boolean} [line=true]  Visible line */
            line: true
        };
    }

    return SplitAreaBrush;
}, "chart.brush.splitline");

jui.define("chart.brush.rangecolumn", [], function() {

    /**
     * @class chart.brush.rangecolumn 
     * 
     * implements range column brush 
     * 
     * @extends chart.brush.core
     */
	var RangeColumnBrush = function(chart, axis, brush) {
		var g, width, columnWidth, half_width;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;

			width = axis.x.rangeBand();
			half_width = (width - outerPadding * 2);
			columnWidth = (width - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;

			borderColor = chart.theme("columnBorderColor");
			borderWidth = chart.theme("columnBorderWidth");
			borderOpacity = chart.theme("columnBorderOpacity");
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var startX = axis.x(i) - (half_width / 2);

				for(var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						startY = axis.y(value[1]),
						zeroY = axis.y(value[0]);

					var r = chart.svg.rect({
						x : startX,
						y : startY,
						width : columnWidth,
						height : Math.abs(zeroY - startY),
						fill : this.color(j),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, i, j);
                    g.append(r);

					startX += columnWidth + innerPadding;
				}
			});

            return g;
		}
	}

	RangeColumnBrush.setup = function() {
		return {
            /** @cfg {Number} [outerPadding=2] Determines the outer margin of a column. */
            outerPadding: 2,
            /** @cfg {Number} [innerPadding=1] Determines the inner margin of a column. */
            innerPadding: 1
		};
	}

	return RangeColumnBrush;
}, "chart.brush.core");

jui.define("chart.brush.rangebar", [], function() {

    /**
     * @class chart.brush.rangebar 
     * 
     * implements range bar brush 
     * 
     * @extends chart.brush.core 
     */
	var RangeBarBrush = function(chart, axis, brush) {
		var g, height, half_height, barHeight;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;

			height = axis.y.rangeBand();
			half_height = height - (outerPadding * 2);
			barHeight = (half_height - (brush.target.length - 1) * innerPadding) / brush.target.length;

			borderColor = chart.theme("barBorderColor");
			borderWidth = chart.theme("barBorderWidth");
			borderOpacity = chart.theme("barBorderOpacity");
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var group = chart.svg.group(),
					startY = axis.y(i) - (half_height / 2);

				for(var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						startX = axis.x(value[1]),
						zeroX = axis.x(value[0]);

					var r = chart.svg.rect({
						x : zeroX,
						y : startY,
						height : barHeight,
						width : Math.abs(zeroX - startX),
						fill : this.color(j),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, i, j);
                    group.append(r);

					startY += barHeight + innerPadding;
				}
				
				g.append(group);
			});

            return g;
		}
	}

	RangeBarBrush.setup = function() {
		return {
            /** @cfg {Number} [outerPadding=2] Determines the outer margin of a bar. */
			outerPadding: 2,
            /** @cfg {Number} [innerPadding=1] Determines the inner margin of a bar. */
			innerPadding: 1
		};
	}

	return RangeBarBrush;
}, "chart.brush.core");

jui.define("chart.brush.topologynode.edge", [], function() {
    /**
     * @class chart.brush.topologynode.edge
     * 
     * 토폴로지 Edge 표현 객체  
     * 
     */
    var TopologyEdge = function(start, end, in_xy, out_xy) {
        var connect = false, element = null;

        this.key = function() {
            return start + ":" + end;
        }

        this.reverseKey = function() {
            return end + ":" + start;
        }

        this.connect = function(is) {
            if(arguments.length == 0) {
                return connect;
            }

            connect = is;
        }

        this.element = function(elem) {
            if(arguments.length == 0) {
                return element;
            }

            element = elem;
        }

        this.get = function(type) {
            if(type == "start") return start;
            else if(type == "end") return end;
            else if(type == "in_xy") return in_xy;
            else if(type == "out_xy") return out_xy;
        }
    }

    return TopologyEdge;
});

jui.define("chart.brush.topologynode.edgemanager", [ "util.base" ], function(_) {
    /**
     * @class chart.brush.topologynode.edgemananger
     * 토폴로지 Edge 관리자
     */
    var TopologyEdgeManager = function() {
        var list = [],
            cache = {};

        this.add = function(edge) {
            cache[edge.key()] = edge;
            list.push(edge);
        }

        this.get = function(key) {
            return cache[key];
        }

        this.is = function(key) {
            return (cache[key]) ? true : false;
        }

        this.list = function() {
            return list;
        }

        this.each = function(callback) {
            if(!_.typeCheck("function", callback)) return;

            for(var i = 0; i < list.length; i++) {
                callback.call(this, list[i]);
            }
        }
    }

    return TopologyEdgeManager;
});

jui.define("chart.brush.topologynode",
    [ "util.base", "util.math", "chart.brush.topologynode.edge", "chart.brush.topologynode.edgemanager" ],
    function(_, math, Edge, EdgeManager) {

    /**
     * @class chart.brush.topologynode
     * TopologyNode Class
     * @extends chart.brush.core 
     */
    var TopologyNode = function(chart, axis, brush) {
        var self = this,
            edges = new EdgeManager(),
            g, tooltip, r, point,
            textY = 14, padding = 7, anchor = 7,
            active = null; // 활성화된 노드 차트

        function getDistanceXY(x1, y1, x2, y2, dist) {
            var a = x1 - x2,
                b = y1 - y2,
                c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)),
                dist = (!dist) ? 0 : dist,
                angle = math.angle(x1, y1, x2, y2);

            return {
                x: x1 + Math.cos(angle) * (c + dist),
                y: y1 + Math.sin(angle) * (c + dist),
                angle: angle,
                distance: c
            }
        }

        function getEdgeData(key) {
            for(var i = 0; i < brush.edgeData.length; i++) {
                if(brush.edgeData[i].key == key) {
                    return brush.edgeData[i];
                }
            }

            return null;
        }

        function getTooltipData(edge) {
            for(var j = 0; j < brush.edgeData.length; j++) {
                if(edge.key() == brush.edgeData[j].key) {
                    return brush.edgeData[j];
                }
            }

            return null;
        }

        function getTooltipTitle(key) {
            var names = [],
                keys = key.split(":");

            self.eachData(function(i, data) {
                var title = _.typeCheck("function", brush.nodeTitle) ? brush.nodeTitle(data) : "";

                if(data.key == keys[0]) {
                    names[0] = title || data.key;
                }

                if(data.key == keys[1]) {
                    names[1] = title || data.key;
                }
            });

            if(names.length > 0) return names;
            return key;
        }

        function createNodes(index, data) {
            var xy = axis.c(index),
                color =_.typeCheck("function", brush.nodeColor) ?
                brush.nodeColor(data) : (brush.nodeColor || self.color(0)),
                title = _.typeCheck("function", brush.nodeTitle) ? brush.nodeTitle(data) : "",
                text =_.typeCheck("function", brush.nodeText) ? brush.nodeText(data) : "";

            var node = chart.svg.group({
                index: index
            }, function() {
                if(_.typeCheck("function", brush.nodeImage)) {
                    chart.svg.image({
                        "xlink:href": brush.nodeImage(data),
                        width: r * 2,
                        height: r * 2,
                        x: -r,
                        y: -r,
                        cursor: "pointer"
                    });
                } else {
                    chart.svg.circle({
                        "class": "circle",
                        r: r,
                        fill: color,
                        cursor: "pointer"
                    });
                }

                if(text && text != "") {
                    chart.text({
                        "class": "text",
                        x: 0,
                        y: 6,
                        fill: chart.theme("topologyNodeFontColor"),
                        "font-size": chart.theme("topologyNodeFontSize"),
                        "text-anchor": "middle",
                        cursor: "pointer"
                    }, text);
                }

                if(title && title != "") {
                    chart.text({
                        "class": "title",
                        x: 0,
                        y: r + 13,
                        fill: chart.theme("topologyNodeTitleFontColor"),
                        "font-size": chart.theme("topologyNodeTitleFontSize"),
                        "font-weight": "bold",
                        "text-anchor": "middle",
                        cursor: "pointer"
                    }, title);
                }
            }).translate(xy.x, xy.y);

            node.on("click", function(e) {
                chart.emit("topology.nodeclick", [ data, e ]);
            });

            return node;
        }

        function createEdges() {
            edges.each(function(edge) {
                var in_xy = edge.get("in_xy"),
                    out_xy = edge.get("out_xy");

                var node = chart.svg.group();
                node.append(createEdgeLine(edge, in_xy, out_xy));
                node.append(createEdgeText(edge, in_xy, out_xy));

                g.append(node);
            });
        }

        function createEdgeLine(edge, in_xy, out_xy) {
            var g = chart.svg.group();

            if(!edge.connect()) {
                g.append(chart.svg.line({
                    cursor: "pointer",
                    x1: in_xy.x,
                    y1: in_xy.y,
                    x2: out_xy.x,
                    y2: out_xy.y,
                    stroke: chart.theme("topologyEdgeColor"),
                    "stroke-width": 1,
                    "shape-rendering": "geometricPrecision"
                }));
            }

            g.append(chart.svg.circle({
                fill: chart.theme("topologyEdgeColor"),
                stroke: chart.theme("backgroundColor"),
                "stroke-width": 2,
                r: point,
                cx: out_xy.x,
                cy: out_xy.y
            }));

            g.on("click", function(e) {
                onEdgeActiveHanlder(edge, e);
            });

            edge.element(g);

            return g;
        }

        function createEdgeText(edge, in_xy, out_xy) {
            var text = null;
            var edgeAlign = (out_xy.x > in_xy.x) ? "end" : "start",
                edgeData = getEdgeData(edge.key());

            if(edgeData != null) {
                var edgeText = _.typeCheck("function", brush.edgeText) ? brush.edgeText(edgeData, edgeAlign) : null;

                if (edgeText != null) {
                    if (edgeAlign == "end") {
                        text = chart.svg.text({
                            x: out_xy.x - 9,
                            y: out_xy.y + 13,
                            cursor: "pointer",
                            fill: chart.theme("topologyEdgeFontColor"),
                            "font-size": chart.theme("topologyEdgeFontSize"),
                            "text-anchor": edgeAlign
                        }, edgeText)
                            .rotate(math.degree(out_xy.angle), out_xy.x, out_xy.y);
                    } else {
                        text = chart.svg.text({
                            x: out_xy.x + 8,
                            y: out_xy.y - 7,
                            cursor: "pointer",
                            fill: chart.theme("topologyEdgeFontColor"),
                            "font-size": chart.theme("topologyEdgeFontSize"),
                            "text-anchor": edgeAlign
                        }, edgeText)
                            .rotate(math.degree(in_xy.angle), out_xy.x, out_xy.y);
                    }

                    text.on("click", function (e) {
                        onEdgeActiveHanlder(edge, e);
                    });
                }
            }

            return text;
        }

        function setDataEdges(index, targetIndex) {
            var data = self.getData(index),
                targetKey = self.getValue(data, "outgoing", [])[targetIndex],
                target = axis.c(targetKey),
                xy = axis.c(index);

            var dist = r + point + 1,
                in_xy = getDistanceXY(target.x, target.y, xy.x, xy.y, -(dist)),
                out_xy = getDistanceXY(xy.x, xy.y, target.x, target.y, -(dist)),
                edge = new Edge(self.getValue(data, "key"), targetKey, in_xy, out_xy);

            if(edges.is(edge.reverseKey())) {
                edge.connect(true);
            }

            edges.add(edge);
        }

        function setNodeCharts(node, data) {
            var inner = chart.svg.image({ visibility: "hidden" }),
                c = null,
                i = null,
                t = null;

            node.each(function(j, elem) {
                var attr = elem.attributes;

                if(attr["class"] == "circle")
                    c = elem;
                if(attr["class"] == "text")
                    i = elem;
                if(attr["class"] == "title")
                    t = elem;
            });

            node.append(inner);

            node.on("dblclick", function(e) {
                if(active != null) resetActiveChart();

                var nc = brush.nodeChart(data, e),
                    w = nc.padding("left") + nc.padding("right") + nc.area("width"),
                    h = nc.padding("top") + nc.padding("bottom") + nc.area("height"),
                    r = Math.sqrt((w * w) + (h * h)) / 2;

                // 노드 반지름 설정
                c.attr({
                    r: r,
                    stroke: chart.theme("backgroundColor"),
                    "stroke-width": 2
                });

                inner.attr({
                    x: -(w / 2),
                    y: -(h / 2),
                    width: w,
                    height: h,
                    "xlink:href": nc.svg.toDataURI(),
                    visibility: "visible"
                });

                i.attr({ visibility: "hidden" });
                t.attr({ visibility: "hidden" });

                active = {
                    c: c,
                    i: i,
                    t: t,
                    inner: inner
                };
            });
        }

        function resetActiveChart() {
            if(active == null) return;

            active.i.attr({ visibility: "visible" });
            active.t.attr({ visibility: "visible" });
            active.inner.attr({ visibility: "hidden" });

            if (_.typeCheck("function", brush.nodeImage)) {
                active.c.attr({ width: r * 2, height: r * 2 });
            } else {
                active.c.attr({ r: r });
            }

            active = null;
        }

        function showTooltip(edge, e) {
            if(!_.typeCheck("function", brush.tooltipTitle) ||
                !_.typeCheck("function", brush.tooltipText)) return;

            var rect = tooltip.get(0);
                text = tooltip.get(1);

            // 텍스트 초기화
            rect.attr({ points: "" });
            text.element.textContent = "";

            var edge_data = getTooltipData(edge),
                in_xy = edge.get("in_xy"),
                out_xy = edge.get("out_xy"),
                align = (out_xy.x > in_xy.x) ? "end" : "start";

            // 커스텀 이벤트 발생
            chart.emit("topology.edgeclick", [ edge_data, e ]);

            if(edge_data != null) {
                // 엘리먼트 생성 및 추가
                var title = document.createElementNS("http://www.w3.org/2000/svg", "tspan"),
                    contents = document.createElementNS("http://www.w3.org/2000/svg", "tspan"),
                    y = (padding * 2) + ((align == "end") ? anchor : 0);

                text.element.appendChild(title);
                text.element.appendChild(contents);

                title.setAttribute("x", padding);
                title.setAttribute("y", y);
                title.setAttribute("font-weight", "bold");
                title.textContent = brush.tooltipTitle(getTooltipTitle(edge_data.key), align);

                contents.setAttribute("x", padding);
                contents.setAttribute("y", y + textY + (padding / 2));
                contents.textContent = brush.tooltipText(edge_data, align);

                // 엘리먼트 위치 설정
                var scale = chart.scale(),
                    size = text.size(),
                    w = (size.width + padding * 2) / scale,
                    h = (size.height + padding * 2) / scale,
                    x = out_xy.x - (w / 2) + (anchor / 2) + (point / 2);

                text.attr({ x: w / 2 });
                rect.attr({ points: self.balloonPoints((align == "end") ? "bottom" : "top", w, h, anchor) });
                tooltip.attr({ visibility: "visible" });

                if(align == "end") {
                    tooltip.translate(x, out_xy.y + (anchor / 2) + point);
                } else {
                    tooltip.translate(x, out_xy.y - anchor - h + point);
                }
            }
        }

        function onEdgeActiveHanlder(edge, e) {
            edges.each(function(newEdge) {
                var elem = newEdge.element(),
                    circle = (elem.children.length == 2) ? elem.get(1) : elem.get(0),
                    line = (elem.children.length == 2) ? elem.get(0) : null,
                    color = chart.theme("topologyEdgeColor"),
                    activeColor = chart.theme("topologyActiveEdgeColor");

                if(edge != null && (edge.key() == newEdge.key() || edge.reverseKey() == newEdge.key())) {
                    if(line != null) {
                        line.attr({ stroke: activeColor, "stroke-width": 2 });
                    }
                    circle.attr({ fill: activeColor });

                    // 툴팁에 보여지는 데이터 설정
                    if(edge.key() == newEdge.key()) {
                        // 엣지 툴팁 보이기
                        showTooltip(edge);
                    }
                } else {
                    if(line != null) {
                        line.attr({ stroke: color, "stroke-width": 1 });
                    }
                    circle.attr({ fill: color });
                }
            });
        }

        this.drawBefore = function() {
            g = chart.svg.group();
            r = chart.theme("topologyNodeRadius");
            point = chart.theme("topologyEdgePointRadius");

            tooltip = chart.svg.group({
                visibility: "hidden"
            }, function() {
                chart.svg.polygon({
                    fill: chart.theme("topologyTooltipBackgroundColor"),
                    stroke: chart.theme("topologyTooltipBorderColor"),
                    "stroke-width": 1
                });

                chart.text({
                    "font-size": chart.theme("topologyTooltipFontSize"),
                    "fill": chart.theme("topologyTooltipFontColor"),
                    y: textY
                });
            });
        }

        this.draw = function() {
            var nodes = [];

            this.eachData(function(i, data) {
                for(var j = 0; j < data.outgoing.length; j++) {
                    // 엣지 데이터 생성
                    setDataEdges(i, j);
                }
            });

            // 엣지 그리기
            createEdges();

            // 노드 그리기
            this.eachData(function(i, data) {
                var node = createNodes(i, data);
                g.append(node);

                nodes[i] = { node: node, data: data };
            });

            // 툴팁 숨기기 이벤트 (차트 배경 클릭시)
            this.on("chart.mousedown", function(e) {
                if(chart.svg.root.element == e.target) {
                    onEdgeActiveHanlder(null, e);
                    tooltip.attr({ visibility: "hidden" });
                }
            });

            // 액티브 엣지 선택 (렌더링 이후에 설정)
            if(_.typeCheck("string", brush.activeEdge)) {
                this.on("render", function(init) {
                    if(!init) {
                        var edge = edges.get(brush.activeEdge);
                        onEdgeActiveHanlder(edge);
                    }
                });
            }

            // 노드 차트 설정
            if(_.typeCheck("function", brush.nodeChart) && brush.nodeImage == null) {
                for(var i = 0; i < nodes.length; i++) {
                    setNodeCharts(nodes[i].node, nodes[i].data);
                }
            }

            return g;
        }
    }

    TopologyNode.setup = function() {
        return {
            /** @cfg {Boolean} [clip=false] If the brush is drawn outside of the chart, cut the area. */
            clip: false,

            // topology options
            /** @cfg {Function} [nodeTitle=null] */
            nodeTitle: null,
            /** @cfg {Function} [nodeText=null] */
            nodeText: null,
            /** @cfg {Function} [nodeImage=null] */
            nodeImage: null,
            /** @cfg {Function/String} [nodeColor=null] */
            nodeColor: null,

            nodeChart: null,

            /** @cfg {Array} [edgeData=[]] */
            edgeData: [],
            /** @cfg {String} [edgeText=null] */
            edgeText: null,
            /** @cfg {Function} [tooltipTitle=null] */

            tooltipTitle: null,
            /** @cfg {Function} [tooltipText=null] */
            tooltipText: null,
            /** @cfg {String} [activeEdge=null] */
            activeEdge: null
        }
    }

    return TopologyNode;
}, "chart.brush.core");
jui.define("chart.brush.focus", [], function() {
	/**
	 * @class chart.brush.focus
	 *
	 * implements focus brush
	 *
	 * @extends chart.brush.core
	 */
	var FocusBrush = function(chart, axis, brush) {
		var g;

		this.drawFocus = function(start, end) {
			var borderColor = chart.theme("focusBorderColor"),
				borderSize = chart.theme("focusBorderWidth"),
				bgColor = chart.theme("focusBackgroundColor"),
				bgOpacity = chart.theme("focusBackgroundOpacity");

			var height = chart.area('height');

			g = chart.svg.group({}, function() {
				var startX = start,
					endX = end;

				if (brush.hide) {
					return ;
				}

				chart.svg.line({
					stroke: borderColor,
					"stroke-width": borderSize,
					x1: 0,
					y1: 0,
					x2: 0,
					y2: height
				}).translate(startX, 0);

				chart.svg.rect({
					width: Math.abs(endX - startX),
					height: height,
					fill: bgColor,
					opacity: bgOpacity
				}).translate(startX, 0)

				chart.svg.line({
					stroke: borderColor,
					"stroke-width": borderSize,
					x1: 0,
					y1: 0,
					x2: 0,
					y2: height
				}).translate(endX, 0);
			});

			return g;
		}

		this.draw = function() {
			var start = 0, end = 0;

			if(brush.start == -1 || brush.end == -1) {
				return this.chart.svg.g();
			}

			if(axis.x.type == "block") {
				start = axis.x(brush.start) - axis.x.rangeBand() / 2;
				end = axis.x(brush.end) + axis.x.rangeBand() / 2;
			} else  {
				start = axis.x(brush.start);
				end = axis.x(brush.end);
			}

			return this.drawFocus(start, end);
		}
	}

	FocusBrush.setup = function() {
		return {
			/** @cfg {Integer} [start=-1] Sets a focus start index.*/
			start: -1,

			/** @cfg {Integer} [end=-1] Sets a focus end index. */
			end: -1
		};
	}

	return FocusBrush;
}, "chart.brush.core");
jui.define("chart.brush.pin", [], function() {
    /**
     * @class chart.brush.pin  
     * 
     * implements pin brush  
     *  
     * @extends chart.brush.core   
     */
    var PinBrush = function(chart, axis, brush) {
        var self = this;

        this.draw = function() {
            var size = brush.size,
                color = chart.theme("pinBorderColor"),
                width = chart.theme("pinBorderWidth");

            var g = chart.svg.group({}, function() {
                var d = axis.x(brush.split),
                    x = d - (size / 2),
                    value = self.format(axis.x.invert(d));

                chart.text({
                    "text-anchor": "middle",
                    "font-size": chart.theme("pinFontSize"),
                    "fill": chart.theme("pinFontColor")
                }, value).translate(d, -4);

                chart.svg.polygon({
                    fill: color
                })
                .point(size, 0)
                .point(size / 2, size)
                .point(0, 0)
                .translate(x, 0);

                chart.svg.line({
                    stroke: color,
                    "stroke-width": width,
                    x1: size / 2,
                    y1: 0,
                    x2: size / 2,
                    y2: chart.area("height")
                }).translate(x, 0);
            });

            return g;
        }
    }

    PinBrush.setup = function() {
        return {
            /** @cfg {Number} [size=6] */
            size: 6,
            /** @cfg {Number} [split=0] Determines a location where a pin is displayed (data index). */
            split: 0,
            /** @cfg {Boolean} [showValue=false] */
            showValue: false,
            /** @cfg {Function} [format=null] */
            format: null
        };
    }

    return PinBrush;
}, "chart.brush.core");
jui.define("chart.brush.map.core", [ "jquery", "util.base" ], function($, _) {
    /**
     * @class chart.brush.map.core
     *
     * implements core method for brush
     *
     * @abstract
     * @extends chart.brush.core
     * @requires jquery
     * @requires util.base
     */
	var MapCoreBrush = function() {
	}

	return MapCoreBrush;
}, "chart.brush.core");
jui.define("chart.brush.map.selector", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.over 
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapSelectorBrush = function(chart, axis, brush) {
		var activePath = null;

		this.draw = function() {
			var g = chart.svg.group(),
				originFill = null;

			this.on("map.mouseover", function(obj, e) {
				if(activePath == obj.path) return;

				originFill = obj.path.styles.fill || obj.path.attributes.fill;
				obj.path.css({
					fill: chart.theme("mapSelectorColor")
				});
			});
			this.on("map.mouseout", function(obj, e) {
				if(activePath == obj.path) return;

				obj.path.css({
					fill: originFill
				});
			});

			if(brush.activeEvent != null) {
				this.on(brush.activeEvent, function(obj, e) {
					activePath = obj.path;

					axis.map.each(function(i, obj) {
						obj.path.css({
							fill: originFill
						});
					});

					obj.path.css({
						fill: chart.theme("mapSelectorActiveColor")
					});
				});
			}

			return g;
		}
	}

	MapSelectorBrush.setup = function() {
		return {
			activeEvent: null
		}
	}

	return MapSelectorBrush;
}, "chart.brush.map.core");

jui.define("chart.brush.map.template", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.template
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapTemplateBrush = function() {
        var self = this;

		this.draw = function() {
            var g = this.chart.svg.group();

            this.eachData(function(i, data) {
                var xy = self.axis.map(data.id),
                    result = self.brush.callback.call(self, i, data, { x: xy.x, y: xy.y });

                result.translate(xy.x, xy.y);
                g.append(result);
            });

			return g;
		}
	}

    MapTemplateBrush.setup = function() {
        return {
            callback : function(data) { return ''; }
        }

    }

	return MapTemplateBrush;
}, "chart.brush.map.core");

jui.define("chart.brush.map.bubble", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.bubble
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapBubbleBrush = function(chart, axis, brush) {
        var self = this;

        function getMinMaxValues() {
            var min = 0,
                max = 0,
                dataList = self.listData();

            for(var i = 0; i < dataList.length; i++) {
                var value = axis.getValue(dataList[i], "value", 0);

                min = (i == 0) ? value : Math.min(value, min);
                max = (i == 0) ? value : Math.max(value, max);
            }

            return {
                min: min,
                max: max
            }
        }

		this.draw = function() {
            var g = chart.svg.group(),
                color = _.typeCheck("string", brush.color) ? chart.color(brush.color) : this.color(0),
                minmax = getMinMaxValues();

            this.eachData(function(i, d) {
                var value = axis.getValue(d, "value", 0),
                    size = this.getScaleValue(value, minmax.min, minmax.max, brush.min, brush.max),
                    xy = axis.map(axis.getValue(d, "id", null));

                if(xy != null) {
                    if(_.typeCheck("function", brush.color)) {
                        color = chart.color(brush.color.call(chart, d) || color);
                    }

                    var c = chart.svg.circle({
                        r: size,
                        "fill": color,
                        "fill-opacity": chart.theme("mapBubbleBackgroundOpacity"),
                        "stroke": color,
                        "stroke-width": chart.theme("mapBubbleBorderWidth")
                    });

                    c.translate(xy.x, xy.y);
                    g.append(c);
                }
            });

			return g;
		}
	}

    MapBubbleBrush.setup = function() {
        return {
            color : null,
            min : 10,
            max : 30
        }
    }

	return MapBubbleBrush;
}, "chart.brush.map.core");

jui.define("chart.brush.map.flightroute", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.flightroute
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapFlightRouteBrush = function(chart, axis, brush) {
        var self = this;
        var g, tooltip;
        var smallColor, largeColor, borderWidth, lineColor, lineWidth, outerSize;
        var smallRate = 0.4, largeRate = 1.33, padding = 7, anchor = 7, textY = 14;

        function printTooltip(obj) {
            var msg = obj.data.title;

            if(_.typeCheck("string", msg) && msg != "") {
                tooltip.get(1).text(msg);
                tooltip.get(1).attr({ "text-anchor": "middle" });
            }

            return msg;
        }

        function setOverEffect(type, xy, outer, inner) {
            outer.hover(over, out);
            inner.hover(over, out);

            function over(e) {
                if(!printTooltip(xy)) return;

                var color = (type == "large") ? smallColor : largeColor,
                    size = tooltip.get(1).size(),
                    innerSize = outerSize * smallRate,
                    w = size.width + (padding * 2),
                    h = size.height + padding;

                tooltip.get(1).attr({ x: w / 2 });
                tooltip.get(0).attr({
                    points: self.balloonPoints("top", w, h, anchor),
                    stroke: color
                });
                tooltip.attr({ visibility: "visible" });
                tooltip.translate(xy.x - (w / 2), xy.y - h - anchor - innerSize);

                outer.attr({ stroke: color });
                inner.attr({ fill: color });
            }

            function out(e) {
                var color = (type == "large") ? largeColor : smallColor;

                tooltip.attr({ visibility: "hidden" });
                outer.attr({ stroke: color });
                inner.attr({ fill: color });
            }
        }

        this.drawAirport = function(type, xy) {
            var color = (type == "large") ? largeColor : smallColor,
                innerSize = outerSize * smallRate;

            var outer = chart.svg.circle({
                r: (type == "large") ? outerSize * largeRate : outerSize,
                "stroke-width": (type == "large") ? borderWidth * largeRate : borderWidth,
                "fill": "transparent",
                "fill-opacity": 0,
                "stroke": color
            }).translate(xy.x, xy.y);

            var inner = chart.svg.circle({
                r: (type == "large") ? innerSize * largeRate : innerSize,
                "stroke-width": 0,
                "fill": color
            }).translate(xy.x, xy.y);

            g.append(outer);
            g.append(inner);

            // 마우스오버 이벤트 설정
            setOverEffect(type, xy, outer, inner);
        }

        this.drawRoutes = function(target, xy) {
            var line = chart.svg.line({
                x1: xy.x,
                y1: xy.y,
                x2: target.x,
                y2: target.y,
                stroke: lineColor,
                "stroke-width": lineWidth
            });

            g.append(line);
        }

        this.drawBefore = function() {
            g = chart.svg.group();
            tooltip = chart.svg.group({
                visibility: "hidden"
            }, function() {
                chart.svg.polygon({
                    fill: chart.theme("tooltipBackgroundColor"),
                    "fill-opacity": chart.theme("tooltipBackgroundOpacity"),
                    stroke: chart.theme("tooltipBorderColor"),
                    "stroke-width": 2
                });

                chart.text({
                    "font-size": chart.theme("tooltipFontSize"),
                    "fill": chart.theme("tooltipFontColor"),
                    y: textY
                });
            });

            smallColor = chart.theme("mapFlightRouteAirportSmallColor");
            largeColor = chart.theme("mapFlightRouteAirportLargeColor");
            borderWidth = chart.theme("mapFlightRouteAirportBorderWidth");
            outerSize = chart.theme("mapFlightRouteAirportRadius");
            lineColor = chart.theme("mapFlightRouteLineBorderColor");
            lineWidth = chart.theme("mapFlightRouteLineBorderWidth");
        }

		this.draw = function() {
            this.eachData(function(i, d) {
                var id = axis.getValue(d, "id", null),
                    type = axis.getValue(d, "airport", null),
                    routes = axis.getValue(d, "routes", []),
                    xy = axis.map(id);

                if(type != null && xy != null) {
                    for(var j = 0; j < routes.length; j++) {
                        var target = axis.map(routes[j]);

                        if(target != null) {
                            this.drawRoutes(target, xy);
                        }
                    }

                    this.drawAirport(type, xy);
                }
            });

			return g;
		}
	}

    MapFlightRouteBrush.setup = function() {
        return {
        }
    }

	return MapFlightRouteBrush;
}, "chart.brush.map.core");

jui.define("chart.widget.core", [ "jquery", "util.base" ], function($, _) {


    /**
     * @class chart.widget.core
     * implements core widget
     * @extends chart.draw
     * @alias CoreWidget
     * @requires util.base
     * @requires jquery
     *
     */
	var CoreWidget = function() {

        /**
         * @method drawAfter  
         * @param {Object} obj
         */
        this.drawAfter = function(obj) {
            obj.attr({ "class": "widget widget-" + this.widget.type });
        }

        this.getIndexArray = function(index) {
            var list = [ 0 ];

            if(_.typeCheck("array", index)) {
                list = index;
            } else if(_.typeCheck("integer", index)) {
                list = [ index ];
            }

            return list;
        }

        this.isRender = function() {
            return (this.widget.render === true) ? true : false;
        }

        this.on = function(type, callback, axisIndex) {
            var self = this;

            return this.chart.on(type, function() {
                if(_.startsWith(type, "axis.") && _.typeCheck("integer", axisIndex)) {
                    var axis = self.chart.axis(axisIndex),
                        e = arguments[0];

                    if (_.typeCheck("object", axis)) {
                        if (arguments[1] == axisIndex) {
                            callback.apply(self, [ e ]);
                        }
                    }
                } else {
                    callback.apply(self, arguments);
                }
            }, this.isRender() ? "render" : "renderAll");
        }
	}

    CoreWidget.setup = function() {

        /** @property {chart.builder} chart */
        /** @property {chart.axis} axis */
        /** @property {Object} widget */
        /** @property {Number} index [Read Only] Index which shows the sequence how a widget is drawn. */

        return {
            /**
             * @cfg {Boolean} [render=false] Determines whether a widget is to be rendered.
             */            
            render: false,
            /**
             * @cfg {Number} [index=0] current widget index
             */
            index: 0
        }
    }

	return CoreWidget;
}, "chart.draw"); 
jui.define("chart.widget.tooltip", [ "jquery" ], function($) {
    /**
     * @class chart.widget.tooltip
     * implements tooltip widget
     * @extends chart.widget.core
     * @alias TooltipWidget
     * @requires jquery
     *
     */
    var TooltipWidget = function(chart, axis, widget) {
        var self = this;
        var g, text, rect;
        var padding = 7, anchor = 7, textY = 14;
        var tspan = []; // 멀티라인일 경우, 하위 노드 캐시

        function setMessage(index, message) {
            if(!tspan[index]) {
                var elem = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                text.element.appendChild(elem);
                tspan[index] = elem;
            }

            tspan[index].textContent = message;
        }

        function getFormat(key, value, data) {
            if(typeof(widget.format) == "function") {
                return self.format(key, value, data);
            } else {
                if (!value) {
                    return key;
                }

                return key + ": " + self.format(value);
            }
        }

        function printTooltip(obj) {
            if(obj.dataKey && widget.all === false) {
                var t = chart.get("series", obj.dataKey),
                    k = obj.dataKey,
                    d = (obj.data != null) ? obj.data[k] : null;

                // 위젯 포지션에 따른 별도 처리
                if(widget.orient == "bottom") {
                    text.attr({ y: textY + anchor });
                }

                // 툴팁 값 설정
                var message = getFormat((t.text) ? t.text : k, d, obj.data);
                setMessage(0, message);

                text.attr({ "text-anchor": "middle" });
            } else {
                var brush = obj.brush;

                for(var i = 0; i < brush.target.length; i++) {
                    var key = brush.target[i],
                        t = chart.get("series", key),
                        x = padding,
                        y = (textY * i) + (padding * 2),
                        d = (obj.data != null) ? obj.data[key] : null;

                    // 위젯 포지션에 따른 별도 처리
                    if(widget.orient == "bottom") {
                        y = y + anchor;
                    }

                    var message = getFormat((t.text) ? t.text : key, d, obj.data);
                    setMessage(i, message);

                    tspan[i].setAttribute("x", x);
                    tspan[i].setAttribute("y", y);
                }

                text.attr({ "text-anchor": "inherit" });
            }
        }

        function existBrush(index) {
            var list = self.getIndexArray(self.widget.brush);

            return ($.inArray(index, list) == -1) ? false : true;
        }

        this.drawBefore = function() {
            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                rect = chart.svg.polygon({
                    fill: chart.theme("tooltipBackgroundColor"),
                    "fill-opacity": chart.theme("tooltipBackgroundOpacity"),
                    stroke: chart.theme("tooltipBorderColor"),
                    "stroke-width": 1
                });

                text = chart.text({
                    "font-size": chart.theme("tooltipFontSize"),
                    "fill": chart.theme("tooltipFontColor"),
                    y: textY
                });
            });
        }

        this.draw = function() {
            var self = this,
                isActive = false,
                w, h;

            this.on("mouseover", function(obj, e) {
                if(isActive || !existBrush(obj.brush.index)) return;
                if(!obj.dataKey && !obj.data) return;

                // 툴팁 텍스트 출력
                printTooltip(obj);

                var size = text.size();
                w = size.width + (padding * 2);
                h = size.height + padding;

                text.attr({ x: w / 2 });
                rect.attr({ points: self.balloonPoints(widget.orient, w, h, anchor) });
                g.attr({ visibility: "visible" });

                isActive = true;
            });

            this.on("mousemove", function(obj, e) {
                if(!isActive) return;

                var x = e.bgX - (w / 2),
                    y = e.bgY - h - anchor - (padding / 2);

                if(widget.orient == "left" || widget.orient == "right") {
                    y = e.bgY - (h / 2) - (padding / 2);
                }

                if(widget.orient == "left") {
                    x = e.bgX - w - anchor;
                } else if(widget.orient == "right") {
                    x = e.bgX + anchor;
                } else if(widget.orient == "bottom") {
                    y = e.bgY + (anchor * 2);
                }

                g.translate(x, y);
            });

            this.on("mouseout", function(obj, e) {
                if(!isActive) return;

                g.attr({ visibility: "hidden" });
                isActive = false;
            });

            return g;
        }
    }

    TooltipWidget.setup = function() {
        return {
            /** @cfg {"bottom"/"top"/"left"/"right" } Determines the side on which the tool tip is displayed (top, bottom, left, right). */
            orient: "top",
            /** @cfg {Boolean} [all=false] Determines whether to show all values of row data.*/
            all: false,
            /** @cfg {Function} [format=null] Sets the format of the value that is displayed on the tool tip. */
            format: null,
            /** @cfg {Number} [brush=0] Specifies a brush index for which a widget is used. */
            brush: 0
        };
    }

    return TooltipWidget;
}, "chart.widget.core");
jui.define("chart.widget.title", [], function() {

    /**
     * @class chart.widget.title
     * implements title widget
     * @extends chart.widget.core
     * @alias TitleWidget
     *
     */
    var TitleWidget = function(chart, axis, widget) {
        var x = 0, y = 0, anchor = "middle";

        this.drawBefore = function() {
            if (widget.orient == "bottom") {
                y = chart.area("y2") + chart.padding("bottom") - 20;
            } else if (widget.orient == "top") {
                y = 20;
            } else {
                y = chart.area("y") + chart.area("height") / 2
            }

            if (widget.align == "center") {
                x = chart.area("x") + chart.area("width") / 2;
                anchor = "middle";
            } else if (widget.align == "start") {
                x = chart.area("x");
                anchor = "start";
            } else {
                x = chart.area("x2");
                anchor = "end";
            }
        }

        this.draw = function() {
            var obj = chart.svg.getTextRect(widget.text);

            var half_text_width = obj.width / 2,
                half_text_height = obj.height / 2;

            var text =  chart.text({
                x : x + widget.dx,
                y : y + widget.dy,
                "text-anchor" : anchor,
                "font-size" : widget.size || chart.theme("titleFontSize"),
                "font-weight" : chart.theme("titleFontWeight"),
                "fill" : chart.theme("titleFontColor")
            }, widget.text);

            if (widget.orient == "center") {
                if (widget.align == "start") {
                    text.rotate(-90, x + widget.dx + half_text_width, y + widget.dy + half_text_height)
                } else if (widget.align == "end") {
                    text.rotate(90, x + widget.dx - half_text_width, y + widget.dy + half_text_height)
                }
            }

            return text;
        }
    }

    TitleWidget.setup = function() {
        return {
            /** @cfg {"bottom"/"top"/"left"/"right" } [orient="top"]  Determines the side on which the tool tip is displayed (top, bottom, left, right). */
            orient: "top", // or bottom
            /** @cfg {"start"/"center"/"end" } [align="center"] Aligns the title message (center, start, end).*/
            align: "center",
            /** @cfg {String} [text=""] Sets the title message. */
            text: "",
            /** @cfg {Number} [dx=0] Moves the x coordinate by a set value from the location where the chart is drawn.  */
            dx: 0,
            /** @cfg {Number} [dy=0] Moves the y coordinate by a set value from the location where the chart is drawn. */
            dy: 0,
            /** @cfg {Number} [size=null] Sets the title message size. */
            size: null
        }
    }

    return TitleWidget;
}, "chart.widget.core");
jui.define("chart.widget.legend", [ "util.base" ], function(_) {

    /**
     * @class chart.widget.legend
     * implements legend widget
     * @extends chart.widget.core
     * @alias LegendWidget
     * @requires util.base
     *
     */
    var LegendWidget = function(chart, axis, widget) {
        var columns = [];

        function setLegendStatus(brush) {
            if(!widget.filter) return;

            if(!columns[brush.index]) {
                columns[brush.index] = {};
            }

            for(var i = 0; i < brush.target.length; i++) {
                columns[brush.index][brush.target[i]] = true;
            }
        }

        function changeTargetOption(brushList) {
            var target = [],
                index = brushList[0].index;

            for(var key in columns[index]) {
                if(columns[index][key]) {
                    target.push(key);
                }
            }

            for(var i = 0; i < brushList.length; i++) {
                chart.updateBrush(brushList[i].index, { target: target });
            }

            // 차트 렌더링이 활성화되지 않았을 경우
            if(!chart.isRender()) {
                chart.render();
            }

            chart.emit("legend.filter", [ target ]);
        }

        /**
         * brush 에서 생성되는 legend 아이콘 리턴 
         * 
         * @param {object} chart
         * @param {object} brush
         */
		this.getLegendIcon = function(brush) {
            var self = this,
                arr = [],
                data = brush.target,
                count = data.length,
                r = chart.theme("legendIconRadius");
			
			for(var i = 0; i < count; i++) {
                var group = chart.svg.group(),
                    target = brush.target[i],
                    text = chart.get("series", target).text || target,
                    color = chart.color(i, brush),
                    rect = chart.svg.getTextRect(text);

                if(widget.icon != null) {
                    var icon = _.typeCheck("function", widget.icon) ? widget.icon(brush.index) : widget.icon;

                    group.append(chart.text({
                        x: 0,
                        y: 11,
                        "font-size": chart.theme("legendFontSize"),
                        "fill": color
                    }, icon));
                } else {
                    group.append(chart.svg.circle({
                        cx : r,
                        cy : r,
                        r : r,
                        fill : color
                    }));
                }

 				group.append(chart.text({
					x : (r * 2) + 2,
					y : 10,
                    "font-size" : chart.theme("legendFontSize"),
                    "fill" : chart.theme("legendFontColor"),
					"text-anchor" : "start"
				}, text));

				arr.push({
					icon : group,
					width : (r * 2) + rect.width + 14,
					height : (r * 2) + 4
				});

                if(widget.filter) {
                    (function(key, element) {
                        element.attr({
                            cursor: "pointer"
                        });

                        element.on("click", function(e) {
                            if(columns[brush.index][key]) {
                                element.attr({ opacity: 0.7 });
                                columns[brush.index][key] = false;
                            } else {
                                element.attr({ opacity: 1 });
                                columns[brush.index][key] = true;
                            }

                            changeTargetOption((widget.brushSync) ? self.listBrush() : [ brush ]);
                        });
                    })(target, group);
                }
			}
			
			return arr;
		}        
        
        this.draw = function() {
            var group = chart.svg.group();
            
            var x = 0,
                y = 0,
                total_width = 0,
                total_height = 0,
                max_width = 0,
                max_height = 0,
                brushes = this.getIndexArray(widget.brush);

            for(var i = 0; i < brushes.length; i++) {
                var index = brushes[i];

                // brushSync가 true일 경우, 한번만 실행함
                if(widget.brushSync && index != 0) return;

                var brush = chart.get("brush", brushes[index]),
                    arr = this.getLegendIcon(brush);

                for(var k = 0; k < arr.length; k++) {
                    group.append(arr[k].icon);
                    arr[k].icon.translate(x, y);

                    if (widget.orient == "bottom" || widget.orient == "top") {
                        x += arr[k].width;
                        total_width += arr[k].width;

                        if (max_height < arr[k].height) {
                            max_height = arr[k].height;
                        }
                    } else {
                        y += arr[k].height;
                        total_height += arr[k].height;

                        if (max_width < arr[k].width) {
                            max_width = arr[k].width;
                        }
                    }
                }

                setLegendStatus(brush);
            }
            
            // legend 위치  선정
            if (widget.orient == "bottom" || widget.orient == "top") {
                var y = (widget.orient == "bottom") ? chart.area("y2") + chart.padding("bottom") - max_height : chart.area("y") - chart.padding("top");
                
                if (widget.align == "start") {
                    x = chart.area("x");
                } else if (widget.align == "center") {
                    x = chart.area("x") + (chart.area("width") / 2- total_width / 2);
                } else if (widget.align == "end") {
                    x = chart.area("x2") - total_width;
                }
            } else {
                var x = (widget.orient == "left") ? chart.area("x") - chart.padding("left") : chart.area("x2") + chart.padding("right") - max_width;
                
                if (widget.align == "start") {
                    y = chart.area("y");
                } else if (widget.align == "center") {
                    y = chart.area("y") + (chart.area("height") / 2 - total_height / 2);
                } else if (widget.align == "end") {
                    y = chart.area("y2") - total_height;
                }
            } 
            
            group.translate(Math.floor(x), Math.floor(y));

            return group;
        }
    }

    LegendWidget.setup = function() {
        return {
            /** @cfg {"bottom"/"top"/"left"/"right" } Sets the location where the label is displayed (top, bottom). */
            orient: "bottom",
            /** @cfg {"start"/"center"/"end" } Aligns the label (center, start, end). */
            align: "center", // or start, end
            /** @cfg {Boolean} [filter=false] Performs filtering so that only label(s) selected by the brush can be shown. */
            filter: false,
            /** @cfg {Function/String} [icon=null]   */
            icon: null,
            /** @cfg {Boolean} [brushSync=false] Applies all brushes equally when using a filter function. */
            brushSync: false,
            /** @cfg {Number} [brush=0] Specifies a brush index for which a widget is used. */
            brush: 0
        };
    }

    return LegendWidget;
}, "chart.widget.core");
jui.define("chart.widget.zoom", [ "util.base" ], function(_) {

    /**
     * @class chart.widget.zoom
     * implements zoom widget
     * @extends chart.widget.core
     * @alias ZoomWidget
     * @requires util.base
     *
     */
    var ZoomWidget = function() {
        var self = this,
            top = 0,
            left = 0;

        function setDragEvent(axisIndex, thumb, bg) {
            var axis = self.chart.axis(axisIndex),
                isMove = false,
                mouseStart = 0,
                thumbWidth = 0;

            self.on("axis.mousedown", function(e) {
                if(isMove) return;

                isMove = true;
                mouseStart = e.bgX;
            }, axisIndex);

            self.on("axis.mousemove", function(e) {
                if(!isMove) return;

                thumbWidth = e.bgX - mouseStart;

                if(thumbWidth > 0) {
                    thumb.attr({
                        width: thumbWidth
                    });

                    thumb.translate(mouseStart, top + axis.area("y"));
                } else {
                    thumb.attr({
                        width: Math.abs(thumbWidth)
                    });

                    thumb.translate(mouseStart + thumbWidth, top + axis.area("y"));
                }
            }, axisIndex);

            self.on("axis.mouseup", endZoomAction, axisIndex);
            self.on("chart.mouseup", endZoomAction);
            self.on("bg.mouseup", endZoomAction);
            self.on("bg.mouseout", endZoomAction);

            function endZoomAction() {
                isMove = false;
                if(thumbWidth == 0) return;

                var tick = axis.area("width") / (axis.end - axis.start),
                    x = ((thumbWidth > 0) ? mouseStart : mouseStart + thumbWidth) - left,
                    start = Math.floor(x / tick) + axis.start,
                    end = Math.ceil((x + Math.abs(thumbWidth)) / tick) + axis.start;

                // 차트 줌
                if(start < end) {
                    axis.zoom(start, end);
                    bg.attr({ "visibility": "visible" });

                    // 차트 렌더링이 활성화되지 않았을 경우
                    if(!self.chart.isRender()) {
                        self.chart.render();
                    }
                }

                resetDragStatus();
            }

            function resetDragStatus() { // 엘리먼트 및 데이터 초기화
                isMove = false;
                mouseStart = 0;
                thumbWidth = 0;

                thumb.attr({
                    width: 0
                });
            }
        }

        this.drawSection = function(axisIndex) {
            var axis = this.chart.axis(axisIndex),
                cw = axis.area("width"),
                ch = axis.area("height"),
                r = 12;

            return this.chart.svg.group({}, function() {
                var thumb = self.chart.svg.rect({
                    height: ch,
                    fill: self.chart.theme("zoomBackgroundColor"),
                    opacity: 0.3
                });

                var bg = self.chart.svg.group({
                    visibility: "hidden"
                }, function() {
                    self.chart.svg.rect({
                        width: cw,
                        height: ch,
                        fill: self.chart.theme("zoomFocusColor"),
                        opacity: 0.2
                    });

                    self.chart.svg.group({
                        cursor: "pointer"
                    }, function() {
                        self.chart.svg.circle({
                            r: r,
                            cx: cw,
                            cy: 0,
                            opacity: 0
                        });

                        self.chart.svg.path({
                            d: "M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M16.9,15.5l-1.4,1.4L12,13.4l-3.5,3.5 l-1.4-1.4l3.5-3.5L7.1,8.5l1.4-1.4l3.5,3.5l3.5-3.5l1.4,1.4L13.4,12L16.9,15.5z",
                            fill: self.chart.theme("zoomFocusColor")
                        }).translate(cw - r, -r);
                    }).on("click", function(e) {
                        bg.attr({ visibility: "hidden" });
                        axis.screen(1);

                        // 차트 렌더링이 활성화되지 않았을 경우
                        if(!self.chart.isRender()) {
                            self.chart.render();
                        }
                    });

                }).translate(left + axis.area("x"), top + axis.area("y"));

                setDragEvent(axisIndex, thumb, bg);
            });
        }

        this.drawBefore = function() {
            top = this.chart.padding("top");
            left = this.chart.padding("left");
        }

        this.draw = function() {
            var g = this.chart.svg.group(),
                count = this.chart.axis().length;

            for(var i = 0; i < count; i++) {
                g.append(this.drawSection(i));
            }

            return g;
        }
    }

    return ZoomWidget;
}, "chart.widget.core");
jui.define("chart.widget.zoomscroll", [ "util.base", "chart.builder" ], function (_, builder) {

    /**
     * @class chart.widget.zoomscroll
     * @extends chart.widget.core
     * @alias ScrollWidget
     * @requires util.base
     */
    var ZoomScrollWidget = function(chart, axis, widget) {
        var self = this,
            w = null,
            h = null,
            tick = 0,
            start = null,
            end = null,
            count = null;
        var l_rect = null,
            r_rect = null;

        function setDragEvent(group, isLeft) {
            var bg = group.get(0),
                ctrl = group.get(1);

            var isMove = false,
                mouseStart = 0,
                bgWidth = 0;

            ctrl.on("mousedown", function(e) {
                if(isMove) return;

                isMove = true;
                bgWidth = bg.attributes.width;
                mouseStart = e.x;
            });

            self.on("chart.mousemove", function(e) {
                if(!isMove) return;
                var dis = e.x - mouseStart;

                if(isLeft) {
                    if(dis > 0 && !preventDragAction()) return;

                    var tw = bgWidth + dis;

                    bg.attr({ width: tw });
                    ctrl.attr({ x1: tw, x2: tw });

                    start = Math.floor(tw / tick);
                } else {
                    if(dis < 0 && !preventDragAction()) return;

                    var tw = bgWidth - dis;

                    bg.attr({ width: tw, x: w - tw });
                    ctrl.attr({ x1: w - tw, x2: w - tw });

                    end = count - Math.floor(tw / tick);
                }
            });

            self.on("chart.mouseup", endZoomAction);
            self.on("bg.mouseup", endZoomAction);

            function endZoomAction() {
                if(!isMove) return;

                isMove = false;
                var axies = chart.axis();

                for(var i = 0; i < axies.length; i++) {
                    axies[i].zoom(start, end);
                }
            }

            function preventDragAction() {
                var l = l_rect.attributes.width,
                    r = r_rect.attributes.x;

                if(l <= r - tick) return true;
                return false;
            }
        }

        this.drawBefore = function() {
            count = axis.origin.length;
            start = axis.start;
            end = axis.end;
            w = chart.area("width");
            h = chart.theme("zoomScrollBackgroundSize");
            tick = w / count;
        }

        this.draw = function() {
            var bgColor = chart.theme("zoomScrollBackgroundColor"),
                focusColor = chart.theme("zoomScrollFocusColor"),
                brushColor = chart.theme("zoomScrollBrushColor");

            var c = builder(null, {
                width: w,
                height: h,
                padding: 0,
                axis: {
                    x: _.extend({ hide: true, line: false }, axis.get("x"), true),
                    y: _.extend({ hide: true, line: false }, axis.get("y"), true),
                    data: axis.origin
                },
                brush: {
                    type: "area",
                    target: widget.target,
                    line: false,
                    colors: [ brushColor ]
                },
                style: {
                    backgroundColor: "transparent"
                }
            });

            return chart.svg.group({}, function() {
                chart.svg.rect({
                    width: w,
                    height: h,
                    fill: bgColor,
                    "fill-opacity": 0.1,
                    stroke: bgColor,
                    "stroke-opacity": 0.1
                });

                chart.svg.image({
                    width: w,
                    height: h,
                    "xlink:href": c.svg.toDataURI()
                });

                chart.svg.group({}, function() {
                    var lw = start * tick;

                    l_rect = chart.svg.rect({
                        width: lw,
                        height: h,
                        fill: focusColor,
                        "fill-opacity": 0.3,
                        stroke: focusColor,
                        "stroke-opacity": 0.3
                    });

                    chart.svg.line({
                        x1: lw,
                        x2: lw,
                        y1: 0,
                        y2: h,
                        stroke: bgColor,
                        "stroke-width": 1.5,
                        "stroke-opacity": 0.3,
                        cursor: "w-resize"
                    });

                    setDragEvent(this, true);
                });

                chart.svg.group({}, function() {
                    var rw = (count - end) * tick;

                    r_rect = chart.svg.rect({
                        x: w - rw,
                        width: rw,
                        height: h,
                        fill: focusColor,
                        "fill-opacity": 0.3,
                        stroke: focusColor,
                        "stroke-opacity": 0.3
                    });

                    chart.svg.line({
                        x1: w - rw,
                        x2: w - rw,
                        y1: 0,
                        y2: h,
                        stroke: bgColor,
                        "stroke-width": 1.5,
                        "stroke-opacity": 0.3,
                        cursor: "e-resize"
                    });

                    setDragEvent(this, false);
                });
            }).translate(chart.area("x"), chart.area("y2") - h);
        }
    }

    ZoomScrollWidget.setup = function() {
        return {
            target : null
        }
    }

    return ZoomScrollWidget;
}, "chart.widget.core");
jui.define("chart.widget.scroll", [ "util.base" ], function (_) {

    /**
     * @class chart.widget.scroll
     * @extends chart.widget.core
     * @alias ScrollWidget
     * @requires util.base
     */
    var ScrollWidget = function(chart, axis, widget) {
        var self = this;
        var thumbWidth = 0,
            thumbLeft = 0,
            bufferCount = 0,
            dataLength = 0,
            totalWidth = 0,
            piece = 0,
            rate = 0 ;

        function setScrollEvent(thumb) {
            var isMove = false,
                mouseStart = 0,
                thumbStart = 0,
                axies = chart.axis();

            self.on("bg.mousedown", mousedown);
            self.on("chart.mousedown", mousedown);
            self.on("bg.mousemove", mousemove);
            self.on("bg.mouseup", mouseup);
            self.on("chart.mousemove", mousemove);
            self.on("chart.mouseup", mouseup);

            function mousedown(e) {
                if(isMove && thumb.element != e.target) return;

                isMove = true;
                mouseStart = e.bgX;
                thumbStart = thumbLeft;
            }

            function mousemove(e) {
                if(!isMove) return;

                var gap = thumbStart + e.bgX - mouseStart;

                if(gap < 0) {
                    gap = 0;
                } else {
                    if(gap + thumbWidth > chart.area("width")) {
                        gap = chart.area("width") - thumbWidth;
                    }
                }

                thumb.translate(gap, 1);
                thumbLeft = gap;

                var startgap = gap * rate,
                    start = startgap == 0 ? 0 : Math.floor(startgap / piece);

                if(gap + thumbWidth == chart.area("width")) {
                    start += 1;
                }

                for(var i = 0; i < axies.length; i++) {
                    axies[i].zoom(start, start + bufferCount);
                }

                // 차트 렌더링이 활성화되지 않았을 경우
                if(!chart.isRender()) {
                    chart.render();
                }
            }

            function mouseup(e) {
                if(!isMove) return;

                isMove = false;
                mouseStart = 0;
                thumbStart = 0;
            }
        }

        this.drawBefore = function() {
			dataLength =  axis.origin.length;
			bufferCount = axis.buffer;
			piece = chart.area("width") / bufferCount;
			totalWidth = piece * dataLength;
			rate = totalWidth / chart.area("width");
            thumbWidth = chart.area("width") * (bufferCount / dataLength) + 2;
        }

        this.draw = function() {
            var bgSize = chart.theme("scrollBackgroundSize"),
                bgY = (widget.orient == "top") ? chart.area("y") - bgSize : chart.area("y2");

            return chart.svg.group({}, function() {
                chart.svg.rect({
                    width: chart.area("width"),
                    height: bgSize,
                    fill: chart.theme("scrollBackgroundColor")
                });

                var thumb = chart.svg.rect({
                    width: thumbWidth,
                    height: bgSize - 2,
                    fill: chart.theme("scrollThumbBackgroundColor"),
                    stroke: chart.theme("scrollThumbBorderColor"),
                    cursor: "pointer",
                    "stroke-width": 1
                }).translate(thumbLeft, 1);

                // 차트 스크롤 이벤트
                setScrollEvent(thumb);

            }).translate(chart.area("x"), bgY);
        }
    }

    ScrollWidget.setup = function() {
        return {
            orient : "bottom"
        }
    }

    return ScrollWidget;
}, "chart.widget.core");
jui.define("chart.widget.vscroll", [ "util.base" ], function (_) {

    /**
     * @class chart.widget.vscroll
     * @extends chart.widget.core
     * @alias ScrollWidget
     * @requires util.base
     */
    var VScrollWidget = function(chart, axis, widget) {
        var self = this;
        var thumbHeight = 0,
            thumbTop = 0,
            bufferCount = 0,
            dataLength = 0,
            totalHeight = 0,
            piece = 0,
            rate = 0 ;

        function setScrollEvent(thumb) {
            var isMove = false,
                mouseStart = 0,
                thumbStart = 0,
                axies = chart.axis();

            self.on("bg.mousedown", mousedown);
            self.on("chart.mousedown", mousedown);
            self.on("bg.mousemove", mousemove);
            self.on("bg.mouseup", mouseup);
            self.on("chart.mousemove", mousemove);
            self.on("chart.mouseup", mouseup);

            function mousedown(e) {
                if(isMove && thumb.element != e.target) return;

                isMove = true;
                mouseStart = e.bgY;
                thumbStart = thumbTop;
            }

            function mousemove(e) {
                if(!isMove) return;

                var gap = thumbStart + e.bgY - mouseStart;

                if(gap < 0) {
                    gap = 0;
                } else {
                    if(gap + thumbHeight > chart.area("height")) {
                        gap = chart.area("height") - thumbHeight;
                    }
                }

                thumb.translate(1, gap);
                thumbTop = gap;

                var startgap = gap * rate,
                    start = startgap == 0 ? 0 : Math.floor(startgap / piece);

                if(gap + thumbHeight == chart.area("height")) {
                    start += 1;
                }

                for(var i = 0; i < axies.length; i++) {
                    axies[i].zoom(start, start + bufferCount);
                }

                // 차트 렌더링이 활성화되지 않았을 경우
                if(!chart.isRender()) {
                    chart.render();
                }
            }

            function mouseup(e) {
                if(!isMove) return;

                isMove = false;
                mouseStart = 0;
                thumbStart = 0;
            }
        }

        this.drawBefore = function() {
			dataLength =  axis.origin.length;
			bufferCount = axis.buffer;
			piece = chart.area("height") / bufferCount;
			totalHeight = piece * dataLength;
			rate = totalHeight / chart.area("height");
            thumbHeight = chart.area("height") * (bufferCount / dataLength) + 2;
        }

        this.draw = function() {
            var bgSize = chart.theme("scrollBackgroundSize"),
                bgX = (widget.orient == "right") ? chart.area("x2") : chart.area("x") - bgSize;

            return chart.svg.group({}, function() {
                chart.svg.rect({
                    width: bgSize,
                    height: chart.area("height"),
                    fill: chart.theme("scrollBackgroundColor")
                });

                var thumb = chart.svg.rect({
                    width: bgSize - 2,
                    height: thumbHeight,
                    fill: chart.theme("scrollThumbBackgroundColor"),
                    stroke: chart.theme("scrollThumbBorderColor"),
                    cursor: "pointer",
                    "stroke-width": 1
                }).translate(1, thumbTop);

                // 차트 스크롤 이벤트
                setScrollEvent(thumb);

            }).translate(bgX, chart.area("y"));
        }
    }

    VScrollWidget.setup = function() {
        return {
            orient : "left"
        }
    }

    return VScrollWidget;
}, "chart.widget.core");
jui.define("chart.widget.cross", [ "util.base" ], function(_) {


    /**
     * @class chart.widget.cross
     * implements cross widget
     * @extends chart.widget.core
     * @alias CoreWidget
     * @requires util.base
     *
     */
    var CrossWidget = function(chart, axis, widget) {
        var self = this;
        var tw = 50, th = 18, ta = tw / 10; // 툴팁 넓이, 높이, 앵커 크기
        var pl = 0, pt = 0; // 엑시스까지의 여백
        var g, xline, yline, xTooltip, yTooltip;
        var tspan = [];

        function printTooltip(index, text, message) {
            if(!tspan[index]) {
                var elem = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                text.element.appendChild(elem);
                tspan[index] = elem;
            }

            tspan[index].textContent = message;
        }

        this.drawBefore = function() {
            // 위젯 옵션에 따라 엑시스 변경
            axis = this.chart.axis(widget.axis);

            // 엑시스 여백 값 가져오기
            pl = chart.padding("left") + axis.area("x");
            pt = chart.padding("top") + axis.area("y");

            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                // 포맷 옵션이 없을 경우, 툴팁을 생성하지 않음
                if(_.typeCheck("function", widget.yFormat)) {
                    xline = chart.svg.line({
                        x1: 0,
                        y1: 0,
                        x2: axis.area("width"),
                        y2: 0,
                        stroke: chart.theme("crossBorderColor"),
                        "stroke-width": chart.theme("crossBorderWidth"),
                        opacity: chart.theme("crossBorderOpacity")
                    });

                    yTooltip = chart.svg.group({}, function () {
                        chart.svg.polygon({
                            fill: chart.theme("crossBalloonBackgroundColor"),
                            "fill-opacity": chart.theme("crossBalloonBackgroundOpacity"),
                            points: self.balloonPoints("left", tw, th, ta)
                        });

                        chart.text({
                            "font-size": chart.theme("crossBalloonFontSize"),
                            "fill": chart.theme("crossBalloonFontColor"),
                            "text-anchor": "middle",
                            x: tw / 2,
                            y: 12
                        });
                    }).translate(-(tw + ta), 0);
                }

                if(_.typeCheck("function", widget.xFormat)) {
                    yline = chart.svg.line({
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: axis.area("height"),
                        stroke: chart.theme("crossBorderColor"),
                        "stroke-width": chart.theme("crossBorderWidth"),
                        opacity: chart.theme("crossBorderOpacity")
                    });

                    xTooltip = chart.svg.group({}, function () {
                        chart.svg.polygon({
                            fill: chart.theme("crossBalloonBackgroundColor"),
                            "fill-opacity": chart.theme("crossBalloonBackgroundOpacity"),
                            points: self.balloonPoints("bottom", tw, th, ta)
                        });

                        chart.text({
                            "font-size": chart.theme("crossBalloonFontSize"),
                            "fill": chart.theme("crossBalloonFontColor"),
                            "text-anchor": "middle",
                            x: tw / 2,
                            y: 17
                        });
                    }).translate(0, axis.area("height") + ta);
                }
            }).translate(pl, pt);
        }

        this.draw = function() {
            this.on("axis.mouseover", function(e) {
                g.attr({ visibility: "visible" });
            }, widget.axis);

            this.on("axis.mouseout", function(e) {
                g.attr({ visibility: "hidden" });
            }, widget.axis);

            this.on("axis.mousemove", function(e) {
                var left = e.bgX - pl,
                    top = e.bgY - pt + 2;

                if(xline) {
                    xline.attr({
                        y1: top,
                        y2: top
                    });
                }

                if(yline) {
                    yline.attr({
                        x1: left,
                        x2: left
                    });
                }

                // 포맷 옵션이 없을 경우, 처리하지 않음
                if(yTooltip) {
                    yTooltip.translate(-(tw + ta), top - (th / 2));

                    var value = axis.y.invert(e.chartY),
                        message = widget.yFormat.call(self.chart, value);
                    printTooltip(0, yTooltip.get(1), message);
                }

                if(xTooltip) {
                    xTooltip.translate(left - (tw / 2), axis.area("height") + ta);

                    var value = axis.x.invert(e.chartX),
                        message = widget.xFormat.call(self.chart, value);
                    printTooltip(1, xTooltip.get(1), message);
                }
            }, widget.axis);

            return g;
        }
    }

    CrossWidget.setup = function() {
        return {
            axis: 0,
            /**
             * @cfg {Function} [xFormat=null] Sets the format for the value on the X axis shown on the tooltip.
             */            
            xFormat: null,
            /**
             * @cfg {Function} [yFormat=null] Sets the format for the value on the Y axis shown on the tooltip.
             */
            yFormat: null
        };
    }

    return CrossWidget;
}, "chart.widget.core");
jui.define("chart.widget.topologyctrl", [ "util.base" ], function(_) {

    /**
     * @class chart.widget.topologyctrl
     * 
     * 토폴로지 이벤트 핸들러
     * 
     * @extends chart.widget.core 
     */
    var TopologyControlWidget = function(chart, axis, widget) {
        var self = this;
        var targetKey, startX, startY;
        var renderWait = false;
        var scale = 1, boxX = 0, boxY = 0;

        function initDragEvent() {
            self.on("chart.mousemove", function(e) {
                if(!_.typeCheck("string", targetKey)) return;

                var xy = axis.c(targetKey);
                xy.setX(startX + (e.chartX - startX));
                xy.setY(startY + (e.chartY - startY));

                if(renderWait === false) {
                    setTimeout(function () {
                        chart.render();
                        setBrushEvent();

                        renderWait = false;
                    }, 70);

                    renderWait = true;
                }
            });

            self.on("chart.mouseup", endDragAction);
            self.on("bg.mouseup", endDragAction);
            self.on("bg.mouseout", endDragAction);

            function endDragAction(e) {
                if(!_.typeCheck("string", targetKey)) return;
                targetKey = null;
            }
        }

        function initZoomEvent() {
            $(chart.root).bind("mousewheel DOMMouseScroll", function(e){
                if(e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
                    if(scale < 2) {
                        scale += 0.1;
                    }
                } else {
                    if(scale > 0.5) {
                        scale -= 0.1;
                    }
                }

                chart.scale(scale);
                return false;
            });
        }

        function initMoveEvent() {
            var startX = null, startY = null;

            self.on("chart.mousedown", function(e) {
                if(_.typeCheck("string", targetKey)) return;
                if(startX != null || startY != null) return;

                startX = boxX + e.x;
                startY = boxY + e.y;
            });

            self.on("chart.mousemove", function(e) {
                if(startX == null || startY == null) return;

                var xy = chart.view(startX - e.x, startY - e.y);
                boxX = xy.x;
                boxY = xy.y;
            });

            self.on("chart.mouseup", endMoveAction);
            self.on("bg.mouseup", endMoveAction);
            self.on("bg.mouseout", endMoveAction);

            function endMoveAction(e) {
                if(startX == null || startY == null) return;

                startX = null;
                startY = null;
            }
        }

        function setBrushEvent() {
            chart.svg.root.get(0).each(function(i, brush) {
                var cls = brush.attr("class");

                if(cls && cls.indexOf("topologynode") != -1) {
                    brush.each(function(i, node) {
                        var index = parseInt(node.attr("index"));

                        if(!isNaN(index)) {
                            var data = axis.data[index];

                            (function (key) {
                                node.on("mousedown", function(e) {
                                    if (_.typeCheck("string", targetKey)) return;

                                    var xy = axis.c(key);
                                    targetKey = key;
                                    startX = xy.x;
                                    startY = xy.y;

                                    // 선택한 노드 맨 마지막으로 이동
                                    xy.moveLast();
                                });
                            })(self.axis.getValue(data, "key"));
                        }
                    });
                }
            });
        }

        this.draw = function() {
            if(widget.zoom) {
                initZoomEvent();
            }

            if(widget.move) {
                initMoveEvent();
                chart.svg.root.attr({ cursor: "move" });
            }

            initDragEvent();
            setBrushEvent();

            return chart.svg.group();
        }
    }

    TopologyControlWidget.setup = function() {
        return {
            /** @cfg {Boolean} [move=false] Set to be moved to see the point of view of the topology map. */
            move: false,
            /** @cfg {Boolean} [zoom=false] Set the zoom-in / zoom-out features of the topology map. */
            zoom: false
        }
    }

    return TopologyControlWidget;
}, "chart.widget.core");
jui.define("chart.widget.map.core", [], function() {

    /**
     * @class chart.widget.map.core
     * @extends chart.widget.core
     */
    var MapCoreWidget = function(chart, axis, widget) {
    }

    MapCoreWidget.setup = function() {
        return {
            axis: 0
        }
    }

    return MapCoreWidget;
}, "chart.widget.core");
jui.define("chart.widget.map.control", [ "util.base" ], function(_) {
    var SCROLL_MIN_Y = 21.5,
        SCROLL_MAX_Y = 149;

    /**
     * @class chart.widget.map.control
     * @extends chart.widget.map.core
     */
    var MapControlWidget = function(chart, axis, widget) {
        var scale = 1,
            viewX = 0,
            viewY = 0,
            blockX = 0,
            blockY = 0,
            scrollY = 0,
            step = 0,
            tick = 0,
            btn = { top: null, right: null, bottom: null, left: null, home: null, up: null, down: null, thumb: null };

        function createBtnGroup(type, opacity, x, y, url) {
            btn[type] = chart.svg.group({
                cursor: (url != null) ? "pointer" : "move"
            }, function() {
                chart.svg.rect({
                    x: 0.5,
                    y: 0.5,
                    width: 20,
                    height: 20,
                    rx: 2,
                    ry: 2,
                    stroke: 0,
                    fill: chart.theme("mapControlButtonColor"),
                    "fill-opacity": opacity
                });

                if(url != null) {
                    chart.svg.image({
                        x: 4.5,
                        y: 4.5,
                        width: 11,
                        height: 11,
                        "xmlns:xlink": "http://www.w3.org/1999/xlink",
                        "xlink:href": url,
                        opacity: 0.6
                    });
                }
            }).translate(x, y);

            return btn[type];
        }

        function createScrollThumbLines() {
            return chart.svg.group({}, function() {
                for(var i = 0; i < 6; i++) {
                    var y = 22 * i;

                    chart.svg.path({
                        fill: "none",
                        "stroke-width": 1,
                        "stroke-opacity": 0.6,
                        stroke: chart.theme("mapControlScrollLineColor")
                    }).MoveTo(1.5, 41.5 + y).LineTo(18.5, 41.5 + y);
                }
            });
        }

        function getScrollThumbY(nowScale) {
            var y = SCROLL_MAX_Y - (step * ((nowScale - widget.minScale) / 0.1));

            if(y < SCROLL_MIN_Y) return SCROLL_MIN_Y;
            else if(y > SCROLL_MAX_Y) return SCROLL_MAX_Y;

            return y;
        }

        function getScrollScale(y) {
            return parseFloat((widget.minScale + ((SCROLL_MAX_Y - y) / step) * 0.1).toFixed(1));
        }

        function setButtonEvents() {
            var originViewX = viewX,
                originViewY = viewY;

            btn.top.on("click", function(e) {
                viewY -= blockY;
                move();
            });
            btn.right.on("click", function(e) {
                viewX += blockX;
                move();
            });
            btn.bottom.on("click", function(e) {
                viewY += blockY;
                move();
            });
            btn.left.on("click", function(e) {
                viewX -= blockX;
                move();
            });
            btn.home.on("click", function(e) {
                viewX = originViewX;
                viewY = originViewY;
                move();
            });

            btn.up.on("click", function(e) {
                if(scale > widget.maxScale) return;

                scale += 0.1;
                zoom();
            });
            btn.down.on("click", function(e) {
                if(scale - 0.09 < widget.minScale) return;

                scale -= 0.1;
                zoom();
            });

            function move() {
                axis.updateMap({
                    scale: scale,
                    viewX: viewX,
                    viewY: viewY
                });

                axis.map.view(viewX, viewY);
            }
            function zoom() {
                axis.updateMap({
                    scale: scale,
                    viewX: viewX,
                    viewY: viewY
                });

                scrollY = getScrollThumbY(scale);
                axis.map.scale(scale);
                btn.thumb.translate(0, scrollY);
            }
        }

        function setScrollEvent(bar) {
            var startY = 0,
                moveY = 0;

            btn.thumb.on("mousedown", function(e) {
                if(startY > 0) return;

                startY = e.y;
            });

            btn.thumb.on("mousemove", moveThumb);
            bar.on("mousemove", moveThumb);

            btn.thumb.on("mouseup", endMoveThumb);
            bar.on("mouseup", endMoveThumb);
            bar.on("mouseout", endMoveThumb);

            function moveThumb(e) {
                if(startY == 0) return;
                var sy = scrollY + e.y - startY;

                if(sy >= SCROLL_MIN_Y && sy <= SCROLL_MAX_Y) {
                    moveY = e.y - startY;
                    scale = getScrollScale(sy);

                    axis.updateMap({
                        scale: scale,
                        viewX: viewX,
                        viewY: viewY
                    });

                    axis.map.scale(scale);
                    btn.thumb.translate(0, getScrollThumbY(scale));
                }
            }

            function endMoveThumb(e) {
                if(startY == 0) return;

                startY = 0;
                scrollY += moveY;
            }
        }

        this.drawBefore = function() {
            scale = axis.map.scale();
            viewX = axis.map.view().x;
            viewY = axis.map.view().y;
            blockX = axis.map.size().width / 10;
            blockY = axis.map.size().height / 10;
            tick = (widget.maxScale - widget.minScale) * 10;
            step = (SCROLL_MAX_Y - SCROLL_MIN_Y) / tick;
            scrollY = getScrollThumbY(scale);
        }

        this.draw = function() {
            var g = chart.svg.group({}, function() {
                var top = chart.svg.group(),
                    bottom = chart.svg.group().translate(20, 80),
                    bar = chart.svg.rect({
                        x: 0.5,
                        y: 0.5,
                        width: 26,
                        height: 196,
                        rx: 4,
                        ry: 4,
                        stroke: 0,
                        fill: chart.theme("mapControlScrollColor"),
                        "fill-opacity": 0.15
                    }).translate(-3, -3);

                top.append(createBtnGroup("left", 0.8, 0, 20, "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIQjI9poMcdXpOKTujw0pGjAgA7"));
                top.append(createBtnGroup("right", 0.8, 40, 20, "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIQjI8JycvonomSKhksxBqbAgA7"));
                top.append(createBtnGroup("top", 0.8, 20, 0, "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIQjI+pCmvd2IkzUYqw27yfAgA7"));
                top.append(createBtnGroup("bottom", 0.8, 20, 40, "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIQjI+pyw37TDxTUhhq0q2fAgA7"));
                top.append(createBtnGroup("home", 0, 20, 20, "data:image/gif;base64,R0lGODlhCwALAPABAAAAAAAAACH5BAUAAAEALAAAAAALAAsAAAIZjI8ZoAffIERzMVMxm+9KvIBh6Imb2aVMAQA7"));

                bottom.append(bar);
                bottom.append(createScrollThumbLines());
                bottom.append(createBtnGroup("up", 0.8, 0, 0, "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAISjI8ZoMhtHpQH2HsV1TD29SkFADs="));
                bottom.append(createBtnGroup("down", 0.8, 0, 170, "data:image/gif;base64,R0lGODlhCwALAPABAP///wAAACH5BAUAAAEALAAAAAALAAsAAAIMjI+py+0BopSv2qsKADs="));
                bottom.append(createBtnGroup("thumb", 0.8, 0, scrollY));

                // ��ư Ŭ�� �̺�Ʈ ����
                setButtonEvents();
                setScrollEvent(bar);
            });

            var ot = widget.orient,
                ag = widget.align,
                dx = widget.dx,
                dy = widget.dy,
                x2 = axis.area("x2"),
                y2 = axis.area("y2");

            // ��Ʈ�ѷ� ��ġ ����
            if(ot == "bottom" && ag == "start") {
                g.translate(dx, y2 - (273 + dy));
            } else if(ot == "bottom" && ag == "end") {
                g.translate(x2 - (60 + dx), y2 - (273 + dy));
            } else if(ot == "top" && ag == "end") {
                g.translate(x2 - (60 + dx), dy);
            } else {
                g.translate(dx, dy);
            }

            return g;
        }
    }

    MapControlWidget.setup = function() {
        return {
            /** @cfg {"top"/"bottom" } Sets the location where the label is displayed (top, bottom). */
            orient: "top",
            /** @cfg {"start"/"end" } Aligns the label (center, start, end). */
            align: "start",

            minScale: 1,
            maxScale: 3,

            dx: 5,
            dy: 5
        }
    }

    return MapControlWidget;
}, "chart.widget.map.core");
jui.define("chart.widget.map.tooltip", [ "util.base" ], function(_) {

    /**
     * @class chart.widget.map.core
     * @extends chart.widget.core
     */
    var MapTooltipWidget = function(chart, axis, widget) {
        var self = this;
        var g, text, rect;
        var padding = 7, anchor = 7, textY = 14;

        function getFormat(data) {
            if(_.typeCheck("function", widget.format)) {
                return self.format(data);
            }

            return data.id;
        }

        function printTooltip(obj) {
            var msg = getFormat(obj);

            if(widget.orient == "bottom") {
                text.attr({ y: textY + anchor });
            }

            if(_.typeCheck("string", msg) && msg != "") {
                text.text(msg);
                text.attr({ "text-anchor": "middle" });
            }

            return msg;
        }

        this.drawBefore = function() {
            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                rect = chart.svg.polygon({
                    fill: chart.theme("tooltipBackgroundColor"),
                    "fill-opacity": chart.theme("tooltipBackgroundOpacity"),
                    stroke: chart.theme("tooltipBorderColor"),
                    "stroke-width": 1
                });

                text = chart.text({
                    "font-size": chart.theme("tooltipFontSize"),
                    "fill": chart.theme("tooltipFontColor"),
                    y: textY
                });
            });
        }

        this.draw = function() {
            var isActive = false,
                w, h;

            this.on("map.mouseover", function(obj, e) {
                if(!printTooltip(obj)) return;

                var size = text.size();
                w = size.width + (padding * 2);
                h = size.height + padding;

                text.attr({ x: w / 2 });
                rect.attr({ points: self.balloonPoints(widget.orient, w, h, anchor) });
                g.attr({ visibility: "visible" });

                isActive = true;
            });

            this.on("map.mousemove", function(obj, e) {
                if(!isActive) return;

                var x = e.bgX - (w / 2),
                    y = e.bgY - h - anchor - (padding / 2);

                if(widget.orient == "left" || widget.orient == "right") {
                    y = e.bgY - (h / 2) - (padding / 2);
                }

                if(widget.orient == "left") {
                    x = e.bgX - w - anchor;
                } else if(widget.orient == "right") {
                    x = e.bgX + anchor;
                } else if(widget.orient == "bottom") {
                    y = e.bgY + (anchor * 2);
                }

                g.translate(x, y);
            });

            this.on("map.mouseout", function(obj, e) {
                if(!isActive) return;

                g.attr({ visibility: "hidden" });
                isActive = false;
            });

            return g;
        }
    }

    return MapTooltipWidget;
}, "chart.widget.tooltip");
jui.defineUI("chartx.realtime", [ "jquery", "util.base", "util.time", "chart.builder" ], function($, _, time, builder) {

    /**
     * @class chartx.realtime
     *
     * 리얼타임 차트 구현
     *
     * @extends core
     */
    var UI = function() {
        var axis = null,
            interval = null,
            dataList = [];

        function runningChart(self) {
            var opts = self.options,
                domain = initDomain(self);

            for(var i = 0; i < dataList.length; i++) {
                if(dataList[i][opts.axis.key].getTime() <= domain[0].getTime()) {
                    dataList.splice(i, 1);
                } else {
                    break;
                }
            }

            axis.updateGrid("x", {
                domain: domain
            });

            axis.update(dataList);
        }

        function initDomain(self) {
            var end = new Date(),
                start = time.add(end, time.minutes, -self.options.period);

            return [ start, end ];
        }

        function getOptions(self) {
            var options = {},
                excepts = [ "interval", "period", "axis" ];

            for(var key in self.options) {
                if($.inArray(key, excepts) == -1) {
                    options[key] = self.options[key];
                }
            }

            return options;
        }

        this.init = function() {
            var opts = this.options,
                target = (_.typeCheck("array", opts.brush)) ? opts.brush[0].target : opts.brush.target;

            var axis_domain = target;

            if(_.typeCheck("array", target )) {
                axis_domain = (function(target) {
                    return function(d) {
                        var arr = [];
                        for(var i = 0; i < target.length ;i++) {
                            arr.push(d[target[i]]);
                        }

                        return arr;
                    }
                })(target);
            }

            this.chart = builder(this.selector, _.extend({
                axis : {
                    x : {
                        type : "date",
                        domain : initDomain(this),
                        step : [ time.minutes, opts.axis.xstep ],
                        realtime : true,
                        format : opts.axis.format,
                        key : opts.axis.key,
                        line : opts.axis.xline,
                        hide : opts.axis.xhide
                    },
                    y : {
                        type : "range",
                        domain : (opts.axis.domain != null) ? opts.axis.domain : axis_domain,
                        step : opts.axis.ystep,
                        line : opts.axis.yline,
                        hide : opts.axis.yhide
                    },
                    buffer: opts.period * 60
                }
            }, getOptions(this)));

            // 기본 엑시스 설정
            axis = this.chart.get("axis", 0);

            // 초기값 설정
            if(opts.axis.data.length > 0) {
                this.update(opts.axis.data);
            }

            // 리얼타임 그리드 시작
            this.start();
        }

        this.update = function(data) {
            dataList = data;
            axis.update(dataList);
        }

        this.clear = function() {
            dataList = [];
            axis.update([]);
        }

        this.reset = function() {
            this.clear();
            this.stop();
        }

        this.append = function(data) {
            var newData = data;

            if(!_.typeCheck("array", data)) {
                newData = [ data ];
            }

            dataList = dataList.concat(newData);
        }

        this.start = function() {
            if(interval != null) return;

            var self = this;
            interval = setInterval(function () {
                runningChart(self);
            }, this.options.interval * 1000);
        }

        this.stop = function() {
            if(interval == null) return;

            clearInterval(interval);
            interval = null;
        }
    }

    UI.setup = function() {
        return {

            /** @cfg  {String/Number} [width="100%"] chart width */
            width: "100%", // chart 기본 넓이
            /** @cfg  {String/Number} [height="100%"] chart height */
            height: "100%", // chart 기본 높이
            /**
             * @cfg  {Object} padding chart padding
             * @cfg  {Number} [padding.top=50] chart padding
             * @cfg  {Number} [padding.bottom=50] chart padding
             * @cfg  {Number} [padding.left=50] chart padding
             * @cfg  {Number} [padding.right=50] chart padding
             */
            padding: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            },

            /** @cfg  {String} [theme=jennifer] chart theme  */
            theme: "jennifer",
            /** @cfg  {Object} style chart custom theme  */
            style: {},
            /** @cfg {Object} series Sets additional information for a specific data property. */
            series: {},
            /** @cfg {Array} brush Determines a brush to be added to a chart. */
            brush: [],
            /** @cfg {Array} widget Determines a widget to be added to a chart. */
            widget: [],

            /**
             * @cfg {Object} axis  Determines a axis to be added to a chart
             * @cfg {Array/Function/String} [domain=null]
             * @cfg {String} [format="hh:mm"]
             * @cfg {String} [key="time"]
             * @cfg {Number} [xstep=1] Set a step of x grid(date).
             * @cfg {Number} [ystep=10] Set a step of y grid(range).
             * @cfg {Boolean} [xline=true] Set a line option of x grid.
             * @cfg {Boolean} [yline=true] Set a line option of y grid.
             * @cfg {Boolean} [xhide=true] Set a hide option of x grid.
             * @cfg {Boolean} [yhide=true] Set a hide option of y grid.
             * @cfg {Array} [data=[]] Sets the row set data which constitute a chart.
             */
            axis : {
                domain : null,
                format : "hh:mm",
                key : "time",
                xstep : 1, // x축 분 간격
                ystep : 10,
                xline : true,
                yline : true,
                xhide : false,
                yhide : false,
                data : []
            },

            /** @cfg {Number} [interval=1] Set moving time interval(in seconds) */
            interval : 1, // second

            /** @cfg {Number} [period=1] set interval for realtime (in minute)*/
            period : 5 // minute
        }
    }

    return UI;
});
jui.define("chartx.mini", [ "jquery", "chart.builder" ], function($, builder) {

    /**
     * @class chartx.mini
     *
     * 심플 차트 구현
     *
     * @extends core
     */
    var UI = function(selector, data, options) {

      options = options || { type : "column" };

      if (typeof options == 'string') {
        options = { type : options };
      }

      options.type = options.type || "column";
      
      var beforeData = data;
      $(selector).each(function() {
        
        if ($(this).data('type')) {
          options.type = $(this).data('type');
        }
        
        if (beforeData == 'html') {
          $(this).attr('data', $(this).text());
          data = ($(this).text() || $(this).attr('data')).split(",");
          for(var i = 0; i < data.length; i++) {
            data[i] = parseFloat(data[i]);
          }
          $(this).empty();
        }
        var obj = [];
        var domain = [];
        var pieObj = [{}];
        for(var i = 0; i < data.length; i++) {
          obj.push({ "key" : data[i] });
          domain.push("key" + i);
          pieObj[0]["key" + i] = data[i];
        }

        var realData = obj;
        var target = "key";

        if (options.type == "pie" || options.type == 'donut') {
          realData = pieObj;
          target = false;
        }

        var opt = $.extend(true, {
          padding : 0,
          height : 18,
          axis : {
            data : realData,
            x : { type : 'block', domain : domain, hide : true, full : ( options.type != 'column')   },
            y : { type : 'range', domain : 'key', hide : true },
            c : { type : 'panel', hide : true }
          },
          brush : {
            type : "column",
            target : target
          }
        }, { brush : options });

        // 개별 차트 생성 
        builder(this, opt);
      })
      

    }

    return UI;
});