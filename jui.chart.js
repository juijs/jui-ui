(function(exports, $) {
	var global = { jquery: $ }, globalFunc = {};

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
			webkit: (typeof window.webkitURL != 'undefined') ? true : false,
			mozilla: (typeof window.mozInnerScreenX != 'undefined') ? true : false,
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
							tmpArr.push(keys[j]);
						} else {
							tmpArr.push(dataList[i][keys[j]]);
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
								tmpArr.push(opts.names[j]);
							} else {
								tmpArr.push(opts.fields[j]);
							}
						} else {
							tmpArr.push(opts.rows[i][opts.fields[j]]);
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
					var tmpArr = tmpRowArr[i].split(","),
						data = {};
					
					for(var j = 0; j < keys.length; j++) {
                        data[keys[j]] = tmpArr[j];

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
			var start = 0;
			var end = total;

			var unit = Math.ceil(total/5);

			return function(callback) {

				var first = start, second = unit * 1, third = unit * 2, fourth = unit * 3, fifth = unit * 4;
				var firstMax = second, secondMax = third, thirdMax = fourth, fourthMax = fifth, fifthMax = end;

				while(first < firstMax && first < end) {
					callback.call(context, first, 1); first++;
					if (second < secondMax && second < end) { callback.call(context, second, 2); second++; }
					if (third < thirdMax && third < end) { callback.call(context, third, 3); third++; }
					if (fourth < fourthMax && fourth < end) { callback.call(context, fourth, 4); fourth++; }
					if (fifth < fifthMax && fifth < end) { callback.call(context, fifth, 5); fifth++; }
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
            var total = data.length;
			var start = 0;
			var end = total;

			var unit = Math.ceil(total/5);

			return function(callback) {

				var first = start, second = unit * 1, third = unit * 2, fourth = unit * 3, fifth = unit * 4;
				var firstMax = second, secondMax = third, thirdMax = fourth, fourthMax = fifth, fifthMax = end;

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
            var list = {};
            
            var func = this.loopArray(data);
            
            func(function(d, i, group) {
                var value = d[keyField];
                
                if (typeof list[value] == 'undefined') {
                    list[value] = [];
                }
                
                list[value].push(i);
                
            })
            
            return list; 
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
	exports.jui = {

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

            if(utility.typeCheck("function", global[name])) {
                throw new Error("JUI_CRITICAL_ERR: '" + name + "' is already exist");
            }

            if(utility.typeCheck("undefined", parent)) { // 기본적으로 'core' 클래스를 상속함
                parent = "core";
            }

            if(!utility.typeCheck("function", global[parent])) {
                throw new Error("JUI_CRITICAL_ERR: Parents are the only function");
            } else {
                if(globalFunc[parent] !== true) {
                    throw new Error("JUI_CRITICAL_ERR: UI function can not be inherited");
                }
            }
			
			var args = getDepends(depends),
                uiFunc = callback.apply(null, args);

            // 상속
            utility.inherit(uiFunc, global[parent]);

            // UI 고유 설정
            global[name] = global["core"].init({
                type: name,
                "class": uiFunc
            });
		},

        /**
         * @method define
		 *
		 * UI 클래스에서 사용될 클래스를 정의하고, 자유롭게 상속할 수 있는 클래스를 정의
         *
         * @param {String} name 모듈 로드와 상속에 사용될 이름을 정한다.
         * @param {Array} depends 'define'이나 'defineUI'로 정의된 클래스나 객체를 인자로 받을 수 있다.
         * @param {Function} callback UI 클래스를 해당 콜백 함수 내에서 클래스 형태로 구현하고 리턴해야 한다.
         * @param {String} parent 'depends'와 달리 'define'으로 정의된 클래스만 상속받을 수 있다.
         */
        define: function(name, depends, callback, parent) {
            if(!utility.typeCheck("string", name) || !utility.typeCheck("array", depends) ||
                !utility.typeCheck("function", callback) || !utility.typeCheck([ "string", "undefined" ], parent)) {

                throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
            }

            if(utility.typeCheck("function", global[name])) {
                throw new Error("JUI_CRITICAL_ERR: '" + name + "' is already exist");
            }

            var args = getDepends(depends),
                uiFunc = callback.apply(null, args);

            if(utility.typeCheck("function", global[parent])) {
                if(globalFunc[parent] !== true) {
                    throw new Error("JUI_CRITICAL_ERR: UI function can not be inherited");
                } else {
                    utility.inherit(uiFunc, global[parent]);
                }
            }

            // 함수 고유 설정
            global[name] = uiFunc;
            globalFunc[name] = true;
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
})(window, jQuery || $);
jui.define("core", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class core.UIManager
     * UI에 관련된 기본 로직 클래스 
     *
     * @private
     * @singleton
     *  
     */
	var UIManager = new function() {
		var instances = [], classes = [];


        /**
         * @method add
         *
         * 생성된 instance 를 추가
         *
         * @param {Object} uiIns
         */
		this.add = function(uiIns) {
			instances.push(uiIns);
		}

        /**
         * @method emit
         *
         * 커스텀 이벤트 실행
         *
         * @param {String} key  selector
         * @param {String} type  이벤트 이름
         * @param {Array} args  이벤트에 전달될 파라미터
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
         *
         * 객체 가지고 오기
         *
         * @param {String/Integer} key 패키지 명 또는 인스턴스 index
         * @returns {Object/Array} 생성된 객체 또는 리스트
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
         *
         * 모든 인스턴스 리스트
         *
         * @return {Array}
         */
		this.getAll = function() {
			return instances;
		}

        /**
         * @method remove
         *
         * 인스턴스 삭제
         *
         * @param {Integer} index
         * @return {Object}  removed instance;
         */
        this.remove = function(index) {
            if(_.typeCheck("integer", index)) { // UI 객체 인덱스
                return instances.splice(index, 1)[0];
            }
        }

        this.shift = function() {
            return instances.shift();
        }

        this.pop = function() {
            return instances.pop();
        }

        /**
         * @method size
         *
         * 인스턴스 길이 얻어오기
         *
         * @return {Number} 인스턴스 길이
         */
		this.size = function() {
			return instances.length;
		}

        /**
         * @method debug
         *
         * 디버그 코드 삽입
         *
         * @param {Object} uiObj
         * @param {Number} i
         * @param {Number} j
         * @param {Function} callback  디버그시 실행될 함수
         *
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
         *
         * @param {String} uiCls
         */
		this.addClass = function(uiCls) {
			classes.push(uiCls);
		}

        /**
         * @method getClass
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
		
		this.getClassAll = function() {
			return classes;
		}

        /**
         * @method create
         *
         * UI 객체 동적 생성 메소드
         *
         * @param {String} type  모듈 이름
         * @param {String/Object} selector   jquery selector or dom element
         * @param {Object} options  객체 생성시 필요한 옵션
         * @return {Object} 생성된 JUI 객체
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
		
		/**
		 * Private Methods
		 * 
		 */
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
		
		/**
		 * Public Methods
		 * 
		 */
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


    /**
     * UIManager에서 관리되는 객체
     * 객체 생성 정보와 목록을 가지고 있음
     */
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
     * 각각의 UI별 공통 메소드 (메모리 공유)
	 * 예를 들어 테이블 UI 객체일 경우에 해당되는 모든 요소는 UI 객체에 공유된다.
     * @alias UICore
     *
	 */
	var UICore = function() {
        var vo = null;

        /**
         * @method emit
         * 
         * 커스텀 이벤트 발생시키는 메소드
         *
         * @param {String} type 발생시킬 이벤트
         * @param {Function} args 이벤트 핸들러에 넘기는 값
         * @return {Mixed} 커스텀 이벤트의 핸들러의 리턴 값 또는 undefined
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
         * 이벤트를 리스너에 등록한다.
         * @param {String} type 이벤트 이름
         * @param {Function} callback 실행할 콜백 함수
         */
        this.on = function(type, callback) {
            if(typeof(type) != "string" || typeof(callback) != "function") return;
            this.event.push({ type: type.toLowerCase(), callback: callback, unique: false  });
        }

        /**
         * @method off
         * 등록된 이벤트를 삭제한다.
         * @param {String} type 이벤트 이름
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
         * 커스텀 이벤트 등록
         */
        this.addEvent = function() {
            this.listen.add(arguments);
        }

        /**
         * @method addTrigger
         * 트리거 등록
         * @param selector
         * @param type
         */
        this.addTrigger = function(selector, type) {
            this.listen.trigger(selector, type);
        }

        /**
         * @method addValid
         * Validation 추가
         * @param name
         * @param params
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
         * @param {String} name
         * @param {Function} callback
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
         * tpl 을 설정한다.
         * @param {String} name tpl 이름
         * @param {String} html tpl string
         */
        this.setTpl = function(name, html) {
            this.tpl[name] = _.template(html);
        }

        /**
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
         * 옵션을 설정한다.
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
        
        this.find = function(selector) {
            return this.$root.find(selector);
        }

        /**
         * @method destroy
         * 생성된 객체를 메모리에서 삭제한다.
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
            var $root = $(selector);
            var list = [];

            $root.each(function(index) {
                var mainObj = new UI["class"]();

                // Check Options
                var opts = jui.defineOptions(UI["class"], options || {});

                // Public Properties
                mainObj.init.prototype = mainObj;
                mainObj.init.prototype.selector = $root.selector;
                mainObj.init.prototype.root = this;
                mainObj.init.prototype.$root = $(this);
                mainObj.init.prototype.options = opts;
                mainObj.init.prototype.tpl = {};
                mainObj.init.prototype.event = new Array(); // Custom Event
                mainObj.init.prototype.listen = new UIListener(); // DOM Event
                mainObj.init.prototype.timestamp = new Date().getTime();
                mainObj.init.prototype.index = index;
                mainObj.init.prototype.module = UI;

                // Template Setting (Markup)
                $("script").each(function(i) {
                    if(selector == $(this).data("jui") || selector == $(this).data("vo")) {
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
            /** @cfg {Object} [tpl={}]  템플릿 리스트  */
            tpl: {},
            /** @cfg {Object} [event={}]  이벤트 리스트  */
            event: {},
            /**
             * @cfg {Object} [tpl={}]
             * 템플릿 리스트
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
                
                if (_domain[0] > _domain[1]) {
                    arr.reverse();
                }

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

        /**
         * 엘리먼트 생성 및 조회 메소드
         *
         */

        this.create = function(type, attr) {
            // 퍼블릭 프로퍼티
            this.element = document.createElementNS("http://www.w3.org/2000/svg", type);
            this.childrens = [];
            this.parent = null;
            this.styles = {};
            this.attributes = {};

            // 기본 속성 설정
            this.attr(attr);
        };
        
        this.each = function(callback) {
            if(typeof(callback) != "function") return;

            for(var i = 0, len = this.childrens.length; i < len; i++) {
                var self = this.childrens[i];
                callback.apply(self, [ i, self ]);
            }

            return this.childrens;
        };

        this.get = function(index) {
            if(this.childrens[index]) {
                return this.childrens[index];
            }

            return null;
        }

        this.index = function(obj) {
            for(var i = 0; i < this.childrens.length; i++) {
                if(obj == this.childrens[i]) {
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

                this.childrens.push(elem);
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
        	
            this.childrens.splice(index, 0, elem);
            elem.parent = this;

            return this;
        }

        this.remove = function() {
            var index = 0,
                nChild = [],
                pChild = this.parent.childrens;

            for(var i = 0; i < pChild.length; i++) {
                if (pChild[i] == this) {
                    index = i;
                    break;
                }

                nChild.push(pChild[i]);
            }

            this.parent.childrens = nChild;

            return this;
        }

        /**
         * 엘리먼트 DOM 조작 메소드
         *
         */

        this.attr = function(attr) {
            
            if (typeof attr == 'undefined' || !attr) return;
            
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
        	this.element.appendChild(document.createTextNode(text));
        	
        	return this; 
        }
        
        /**
         * 엘리먼트 DOM 이벤트 메소드
         *
         */

        this.on = function(type, handler) {
            this.element.addEventListener(type, function(e) {
                if(typeof(handler) == "function") {
                    handler.call(this, e);
                }
            }, false);

            return this;
        }

        this.hover = function(overHandler, outHandler) {
            this.element.addEventListener("mouseover", function(e) {
                if(typeof(overHandler) == "function") {
                    overHandler.call(this, e);
                }
            }, false);

            this.element.addEventListener("mouseout", function(e) {
                if(typeof(outHandler) == "function") {
                    outHandler.call(this, e);
                }
            }, false);

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
        var orders = {};

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
            var key = _.createId(),
                d = orders.join(" "),
                $dummy = $("<svg><path id='" + key + "'></path></svg>");

            $("body").append($dummy.find("path").attr("d", d).end());

            var length = $("#" + key)[0].getTotalLength();
            $dummy.remove();

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

        this.rect3d = function(width, height, degree, depth) {
            var radian = math.radian(degree),
                x1 = 0, y1 = 0,
                w1 = width, h1 = height;

            var x2 = (Math.cos(radian) * depth) + x1,
                y2 = (Math.sin(radian) * depth) + y1;

            var w2 = width + x2,
                h2 = height + y2;

            var g = svg.group({
                width: w2,
                height: h2
            }, function() {
                this.MoveTo(x2, x1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2)
                    .LineTo(x1, y2);

                this.MoveTo(x1, y2)
                    .LineTo(x1, h2)
                    .LineTo(w1, h2)
                    .LineTo(w1, y2)
                    .ClosePath();

                this.MoveTo(w1, h2)
                    .LineTo(w2, h1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2)
                    .ClosePath();
            });

            return g;
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

jui.define("util.svg",
    [ "util.base", "util.math", "util.svg.element", "util.svg.element.transform",
        "util.svg.element.path", "util.svg.element.path.symbol", "util.svg.element.path.rect", "util.svg.element.poly" ],
    function(_, math, Element, TransElement, PathElement, PathSymbolElement, PathRectElement, PolyElement) {

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
        
        function create(obj, type, attr, callback) {
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

        function createChild(obj, type, attr, callback) {
            if(obj.parent == main) {
                throw new Error("JUI_CRITICAL_ERR: Parents are required elements of the '" + type + "'");
            }

            return create(obj, type, attr, callback);
        }

        function appendAll(target) {
            var len = target.childrens.length;
            for(var i = 0; i < len; i++) {
                var child = target.childrens[i];

                if(child) {
                    if(child.childrens.length > 0) {
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

        /**
         * 일반 메소드
         *
         */

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
            main.childrens = [];

            if(isAll === true) {
                sub.childrens = [];
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

            var a = document.createElement('a');
            a.download = (name) ? name + ".svg" : "svg.svg";
            a.href = this.toDataURL()//;_.svgToBase64(rootElem.innerHTML);

            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }
        
        this.downloadImage = function(name, type) {
            type = type || "image/png";

            var img = new Image();
            var size = this.size();
            var uri = this.toDataURL()
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

            var uri = this.toDataURL()
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
         * @method toXml
         *
         * convert xml string
         *
         * @return {String} xml
         */
        this.toXml = function() {
            var text = rootElem.innerHTML;

            text = text.replace('xmlns="http://www.w3.org/2000/svg"', '');

            return [
                '<?xml version="1.0" encoding="utf-8"?>',
                text.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
            ].join("\n");
        }

        /**
         * @method toDataURL
         *
         * convert svg to datauri format
         *
         * @return {String}
         */
        this.toDataURL = function() {
            var xml = this.toXml();

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

        /**
         * 엘리먼트 생성 메소드
         *
         */

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
            return create(new Element(), name, attr, callback);
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
            return create(new Element(), "defs", null, callback);
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
            return create(new Element(), "symbol", attr, callback);
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
            return create(new TransElement(), "g", attr, callback);
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
            return create(new Element(), "marker", attr, callback);
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
            return create(new TransElement(), "a", attr, callback);
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
            return create(new Element(), "switch", attr, callback);
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
            return create(new Element(), "use", attr);
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
            return create(new TransElement(), "rect", attr, callback);
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
            return create(new TransElement(), "line", attr, callback);
        }

        this.circle = function(attr, callback) {
            return create(new TransElement(), "circle", attr, callback);
        }

        this.text = function(attr, textOrCallback) {
            if(arguments.length == 2) {
                if (_.typeCheck("function", textOrCallback)) {
                    return create(new TransElement(), "text", attr, textOrCallback);
                }

                return create(new TransElement(), "text", attr).text(textOrCallback);
            }

            return create(new TransElement(), "text", attr);
        }

        this.textPath = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return create(new Element(), "textPath", attr).text(text);
            }

            return create(new Element(), "textPath", attr);
        }

        this.tref = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return create(new Element(), "tref", attr).text(text);
            }

            return create(new Element(), "tref", attr);
        }

        this.tspan = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return create(new Element(), "tspan", attr).text(text);
            }

            return create(new Element(), "tspan", attr);
        }

        this.ellipse = function(attr, callback) {
            return create(new TransElement(), "ellipse", attr, callback);
        }

        this.image = function(attr, callback) {
            return create(new TransElement(), "image", attr, callback);
        }

        this.path = function(attr, callback) {
            return create(new PathElement(), "path", attr, callback);
        }

        this.pathSymbol = function(attr, callback) {
            return create(new PathSymbolElement(), "path", attr, callback);
        }

        this.pathRect = function(attr, callback) {
            return create(new PathRectElement(), "path", attr, callback);
        }

        this.polyline = function(attr, callback) {
            return create(new PolyElement(), "polyline", attr, callback);
        }

        this.polygon = function(attr, callback) {
            return create(new PolyElement(), "polygon", attr, callback);
        }

        this.pattern = function(attr, callback) {
            return create(new Element(), "pattern", attr, callback);
        }

        this.mask = function(attr, callback) {
            return create(new Element(), "mask", attr, callback);
        }

        this.clipPath = function(attr, callback) {
            return create(new Element(), "clipPath", attr, callback);
        }

        this.linearGradient = function(attr, callback) {
            return create(new Element(), "linearGradient", attr, callback);
        }

        this.radialGradient = function(attr, callback) {
            return create(new Element(), "radialGradient", attr, callback);
        }

        this.filter = function(attr, callback) {
            return create(new Element(), "filter", attr, callback);
        }

        /**
         * 엘리먼트 관련 메소드 (그라데이션)
         *
         */

        this.stop = function(attr) {
            return createChild(new Element(), "stop", attr);
        }

        /**
         * 엘리먼트 관련 메소드 (애니메이션)
         *
         */

        this.animate = function(attr) {
            return createChild(new Element(), "animate", attr);
        }

        this.animateColor = function(attr) {
            return createChild(new Element(), "animateColor", attr);
        }

        this.animateMotion = function(attr) {
            return createChild(new Element(), "animateMotion", attr);
        }

        this.animateTransform = function(attr) {
            return createChild(new Element(), "animateTransform", attr);
        }

        this.mpath = function(attr) {
            return createChild(new Element(), "mpath", attr);
        }

        this.set = function(attr) {
            return createChild(new Element(), "set", attr);
        }

        /**
         * 엘리먼트 관련 메소드 (필터)
         *
         */

        this.feBlend = function(attr) {
            return createChild(new Element(), "feBlend", attr);
        }

        this.feColorMatrix = function(attr) {
            return createChild(new Element(), "feColorMatrix", attr);
        }

        this.feComponentTransfer = function(attr) {
            return createChild(new Element(), "feComponentTransfer", attr);
        }

        this.feComposite = function(attr) {
            return createChild(new Element(), "feComposite", attr);
        }

        this.feConvolveMatrix = function(attr) {
            return createChild(new Element(), "feConvolveMatrix", attr);
        }

        this.feDiffuseLighting = function(attr) {
            return createChild(new Element(), "feDiffuseLighting", attr);
        }

        this.feDisplacementMap = function(attr) {
            return createChild(new Element(), "feDisplacementMap", attr);
        }

        this.feFlood = function(attr) {
            return createChild(new Element(), "feFlood", attr);
        }

        this.feGaussianBlur = function(attr) {
            return createChild(new Element(), "feGaussianBlur", attr);
        }

        this.feImage = function(attr) {
            return createChild(new Element(), "feImage", attr);
        }

        this.feMerge = function(attr, callback) {
            return createChild(new Element(), "feMerge", attr, callback);
        }

        this.feMergeNode = function(attr) {
            return createChild(new Element(), "feMergeNode", attr);
        }

        this.feMorphology = function(attr) {
            return createChild(new Element(), "feMorphology", attr);
        }

        this.feOffset = function(attr) {
            return createChild(new Element(), "feOffset", attr);
        }

        this.feSpecularLighting = function(attr) {
            return createChild(new Element(), "feSpecularLighting", attr);
        }

        this.feTile = function(attr) {
            return createChild(new Element(), "feTile", attr);
        }

        this.feTurbulence = function(attr) {
            return createChild(new Element(), "feTurbulence", attr);
        }

        init();
    }

    /**
     * @method createElement
     *
     * create nested elements by json
     *
     *      @example
     *      SVG.createElement({
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
    SVG.createElement = function(obj) {
        var el = new Element();

        el.create(obj.type, obj.attr);

        if (obj.children instanceof Array) {
            for(var i = 0, len = obj.children.length ; i < obj.children.length; i++) {
                el.append(SVG.createElement(obj.children[i]));
            }
        }

        return el;
    }

    return SVG;
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
                var draw = this.grid || this.brush || this.widget;

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
         * Draw 객체 기본 포맷 메소드
         *
         */
        this.format = function() {
            var draw = this.grid || this.brush || this.widget,
                callback = draw.format || this.chart.format;

            return callback.apply(this.chart, arguments);
        }

        /**
         * 말풍선 그리그 메소드
         *
         * @param type
         * @param w
         * @param h
         * @param anchor
         * @returns {string}
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
	}

    Draw.setup = function() {
        return {
            /** @cfg {String} [type=null] */
            type: null,
            /** @cfg {Boolean} [animate=false] */
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
        var self = this;
        var _area = {};

        function caculatePanel(a) {
            a.x = getValue(a.x, chart.area('width'));
            a.y = getValue(a.y, chart.area('height'));
            a.width = getValue(a.width, chart.area('width'));
            a.height = getValue(a.height, chart.area('height'));

            a.x2 = a.x + a.width;
            a.y2 = a.y + a.height;

            return a;
        }

        function getValue(value, max) {
            if(_.typeCheck("string", value) && value.indexOf("%") > -1) {
                return max * (parseFloat(value.replace("%", "")) /100);
            }

            return value;
        }
        
        function drawGridType(axis, k) {
            if((k == 'x' || k == 'y') && !_.typeCheck("object", axis[k])) return null;

            // 축 위치 설정
            axis[k] = axis[k]  || {};

            if (k == "x") {
                axis[k].orient = axis[k].orient == 'top' ? 'top' : 'bottom';
            } else if (k == 'y') {
                axis[k].orient = axis[k].orient == 'right' ? 'right' : 'left';
            } else if (k == 'c') {
                axis[k].type = axis[k].type || 'panel';
                axis[k].orient = 'custom';
            }

            // 다른 그리드 옵션을 사용함
            if(_.typeCheck("integer", axis[k].extend)) {
                _.extend(axis[k], chart.options.axis[axis[k].extend][k], true);
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
                 elem.root.translate(chart.area('x') + self.area("x") - axis[k].dist, chart.area('y'));
            } else if(axis[k].orient == "right") {
                elem.root.translate(chart.area('x') + self.area("x2") + axis[k].dist, chart.area('y'));
            } else if(axis[k].orient == "bottom") {
                elem.root.translate(chart.area('x') , chart.area('y') + self.area("y2") + axis[k].dist);
            } else if(axis[k].orient == "top") {
                elem.root.translate(chart.area('x') , chart.area('y') + self.area("y") - axis[k].dist);
            } else {
                // custom
                if(elem.root) elem.root.translate(chart.area('x') + self.area("x"), chart.area('y') + self.area('y'));
            }

            elem.scale.type = axis[k].type;

            return elem.scale;
        }
        
        function page(pNo) {
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

        function init() {
            _.extend(self, {
                data : cloneAxis.data,
                origin : cloneAxis.origin,
                buffer : cloneAxis.buffer,
                shift : cloneAxis.shift,
                page : cloneAxis.page
            });
            
            // 원본 데이터 설정
            self.origin = self.data;

            // 페이지 초기화
            page(1);

            // Grid 및 Area 설정
            self.reload(cloneAxis);
        }

        /**
         * @method reload
         * 
         * Axis 의 x,y,z 축을 다시 생성한다. 
         * * * 
         * @param {Object} options
         */
        this.reload = function(options) {
            _.extend(this, {
                x : options.x,
                y : options.y,
                c : options.c
            });

            _area = caculatePanel(_.extend(options.area, {
                x: 0, y: 0 , width: chart.area("width"), height: chart.area("height")
            }, true));

            this.x = drawGridType(this, "x");
            this.y = drawGridType(this, "y");
            this.c = drawGridType(this, "c");
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
            page(pNo);

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
         *  *  
         * @param {Number} start
         * @param {Number} end
         */
        this.zoom = function(start, end) {
            if(start == end) return;

            var dataList = this.origin;
            this.end = (end > dataList.length) ? dataList.length : end;
            this.start = (start < 0) ? 0 : start;
            this.data = dataList.slice(this.start, this.end);

            if(chart.isRender()) chart.render();
        }
        
        init();
    }

    Axis.setup = function() {
        return {
            /** @cfg {chart.grid.core} [x=null]  x축 그리드 */
            x: null,
            /** @cfg {chart.grid.core} [y=null]  y축 그리드 */
            y: null,
            /** @cfg {chart.grid.core} [c=null]  커스텀 그리드 */
            c: null,
            /** @cfg {Array} [data=[]]  Axis 에서 사용할 data  */
            data: [],
            /** @cfg {Array} [origin=[]]  원본 data  */
            origin: [],
            /** @cfg {Object} [area={}]  Axis 의 위치,크기 정의 */
            area: {},
            /** @cfg {Number} [buffer=10000]  page 당 표시할 데이타 개수  */
            buffer: 10000,
            /** @cfg {Number} [shift=1]  prev, next 로 이동할 때 이동하는 데이타 개수  */
            shift: 1,
            /** @cfg {Number} [page=1]  현재 표시될 페이지 */
            page: 1
        }
    }

    return Axis;
});

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
     * implements chart builder
     *
     * @extends core
     * @alias ChartBuilder
     * @requires util.base
     * @requires util.svg
     * @requires util.color
     * @requires jquery
     *
     */
    var UI = function() {
        var _axis = [], _brush = [], _widget = [], _defs = null;
        var _padding, _series, _area,  _theme, _hash = {};
        var _initialize = false, _options = null, _handler = []; // 리셋 대상 커스텀 이벤트 핸들러
        var _scale = 1, _xbox = 0, _ybox = 0; // 줌인/아웃, 뷰박스X/Y 관련 변수

        /**
         * @method caculate
         * 
         * chart 기본 영역 계산
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

            // 해쉬 코드 초기화
            _hash = {};
        }

        /**
         * @method drawDefs
         * define svg default pattern, clipPath, Symbol  
         * @param {chart.builder} self
         * @private
         */
        function drawDefs(self) {
            _defs = self.svg.defs(function() {
                self.svg.clipPath({
                    id: "clip-id-" + self.timestamp
                }, function() {
                    self.svg.rect({
                        x: 0,
                        y: 0,
                        width: self.area("width"),
                        height: self.area("height")
                    });
                });
            });
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
         * @param {Boolean} isAll  whether redraw widget 
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
                    var brush = _brush[_.typeCheck("array", draws[i].brush) ? draws[i].brush[0] : draws[i].brush],
                        draw = new Obj(self, _axis[brush.axis], draws[i]);

                    draw.chart = self;
                    draw.axis = _axis[brush.axis];
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

        function resetCustomEvent(self) {
            for(var i = 0; i < _handler.length; i++) {
                self.off(_handler[i]);
            }

            _handler = [];
        }

        function createGradient(self, obj, hashKey) {
            if(!_.typeCheck("undefined", hashKey) && _hash[hashKey]) {
                return "url(#" + _hash[hashKey] + ")";
            }

            var g = null,
                id = _.createId("gradient");

            obj.attr.id = id;

            g = SVGUtil.createElement(obj);

            _defs.append(g);

            if(!_.typeCheck("undefined", hashKey)) {
                _hash[hashKey] = id;
            }

            return "url(#" + id + ")";
        }
        
        function createPattern(self, obj) {
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

                if (!patternElement.attr('id')) {
                    patternElement.attr({id : obj})
                }

                _defs.append(patternElement);
                
                _hash[obj] = obj;
                
                return "url(#" + obj + ")";
                
            } else {
                obj.attr.id = obj.attr.id || _.createId('pattern-');

                if (_hash[obj.attr.id]) {
                    return "url(#" + obj.attr.id + ")";
                }                
                
                var patternElement = SVGUtil.createElement(obj);
                
                _defs.append(patternElement);
                
                _hash[obj.attr.id] = obj.attr.id;
                
                return "url(#" + obj.attr.id + ")";
            }
        }

        function createColor(self, color) {
            if(_.typeCheck("undefined", color)) {
                return "none";
            }

            if(_.typeCheck("object", color)) {
                
                if (color.type == 'pattern') {
                    return createPattern(self, color);
                } else {
                    return createGradient(self, color);
                }
            }
            
            if (typeof color == 'string') {
                var url = createPattern(self, color);
                if (url) {
                    return url; 
                }
            }

            var parsedColor = ColorUtil.parse(color);
            if(parsedColor == color)
                return color;

            return createGradient(self, parsedColor, color);
        }

        function setThemeStyle(theme, options) {
            if(_.typeCheck("string", theme)) {
                _theme = _.extend(jui.include("chart.theme." + theme), options);
            } else if(_.typeCheck("object", theme)) {
                _theme = _.extend(_theme, theme);
            }
        }

        function setDefaultOptions(self) {
            // 일부 옵션을 제외하고 클론
            _options = _.deepClone(self.options, { data: true, bind: true });

            var padding = _options.padding;

            // 패딩 옵션 설정
            if(padding == "empty") {
                _padding = { left: 0, right: 0, bottom: 0, top: 0 };
            } else {
                if(_.typeCheck("integer", padding)) {
                    _padding = { left: padding, right: padding, bottom: padding, top: padding };
                } else {
                    _padding = padding;
                }
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
        }

        function setChartIcons() {
            var path = _options.iconPath;
            if($(".jui").size() > 0 || path == null) return;

            var iconList = [
                "url(" + path + ".eot) format('embedded-opentype')",
                "url(" + path + ".woff) format('woff')",
                "url(" + path + ".ttf) format('truetype')",
                "url(" + path + ".svg) format('svg')"
            ],
            fontFace = "font-family: icojui; font-weight: normal; font-style: normal; src: " + iconList.join(",");

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
            setThemeStyle(_options.theme, _options.style);

            // svg 기본 객체 생성
            this.svg = new SVGUtil(this.root, {
                width: _options.width,
                height: _options.height,
                'buffered-rendering' : 'dynamic'
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
         * get option's property of chart builder 
         *
         * @param {String} type "axis", "brush", "widget", "series", "padding", "area"
         * @param {String} key  property name
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
         * 차트의 엑시스 객체를 반환
         *
         * @param key
         * @returns {Array}
         */
        this.axis = function(key) {
            return _.typeCheck("undefined", _axis[key]) ? _axis : _axis[key];
        }

        /**
         * 차트의 영역 요소 반환
         *
         * @param key (width | height | x | y | x2 | y2)
         * @returns {*}
         */
        this.area = function(key) {
            return _.typeCheck("undefined", _area[key]) ? _area : _area[key];
        }

        /**
         * 차트의 여백 요소 반환
         * @param key (top | left | bottom | right)
         * @returns {*}
         */
        this.padding = function(key) {
            return _.typeCheck("undefined", _padding[key]) ? _padding : _padding[key];
        }

        /**
         * 브러쉬 컬러 관련 함수
         *
         * @param dataIndex
         * @param brush
         * @returns {*}
         */
        this.color = function(i, brush) {
            var color;

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

            if(_hash[color]) {
                return "url(#" + _hash[color] + ")";
            }

            function nextColor(newIndex) {
                var c = _theme["colors"],
                    index = newIndex || i;

                return (index > c.length - 1) ? c[c.length - 1] : c[index];
            }

            return createColor(this, color);
        }

        /**
         * 현재 text 관련 theme 가 정해진 text element 생성
         *
         * @param {object} attr
         * @param {string|function} textOrCallback
         */
        this.text = function(attr, textOrCallback) {
            if(_.typeCheck("string", textOrCallback)) {
                var regex = /{([^{}]+)}/g,
                    result = textOrCallback.match(regex);

                if(result != null) {
                    for(var i = 0; i < result.length; i++) {
                        var unicode = this.icon(result[i].substring(1, result[i].length - 1));
                        textOrCallback = textOrCallback.replace(result[i], unicode);
                    }
                }
            }

            var el = this.svg.text(_.extend({
                "font-family": this.theme("fontFamily"),
                "font-size": this.theme("fontSize"),
                "fill": this.theme("fontColor")
            }, attr), textOrCallback);

            return el;
        }

        /**
         * CSS의 SVG 아이콘을 가져오는 메소드
         *
         * @param key
         * @returns {*}
         */
        this.icon = function(key) {
            if(key.indexOf(".") == -1) return null;

            var keySet = key.split("."),
                module = jui.include("chart.icon." + keySet[0]);

            return module[keySet[1]];
        }

        /**
         * @method theme
         * theme 의 요소에 대한 값 구하기
         *
         * ```
         *      // theme 전체 객체 얻어오기
         *      var theme = chart.theme();
         *      // 부분 속성 얻어오기
         *      var fontColor = chart.theme("fontColor");
         *      // 값 비교해서 얻어오기
         *      chart.theme(isSelected, "selectedFontColor", "fontColor");  // isSelected 가 true 이면 selectedFontColor, 아니면 fontColor 리턴
         * ```
         */
        this.theme = function(key, value, value2) {
            if(arguments.length == 0) {
                return _theme;
            } else if(arguments.length == 1) {
                if(key.indexOf("Color") > -1 && _theme[key] != null) {
                    return createColor(this, _theme[key]);
                }

                return _theme[key];
            } else if(arguments.length == 3) {
                var val = (key) ? value : value2;

                if(val.indexOf("Color") > -1 && _theme[val] != null) {
                    return createColor(this, _theme[val]);
                }

                return _theme[val];
            }
        }

        /**
         * 브러쉬/위젯/그리드에서 공통적으로 사용하는 숫자 포맷 함수
         *
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
         * uix.table, uix.xtable 객체를 바인딩 해서 사용할 수 있음.
         * 테이블 요소를 수정하면 chart의 data 속성으로 자동으로 설정
         *
         * @param {object} bind   uix.table, uix.xtable 객체 사용
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
         * 차트에서 사용할 커스텀 이벤트 핸들러
         *
         * @param type
         * @param callback
         */
        this.on = function(type, callback, isReset) {
            if(!_.typeCheck("string", type)  || !_.typeCheck("function", callback)) return;

            this.event.push({ type: type.toLowerCase(), callback: callback  });
            if(isReset === true) _handler.push(callback);
        }

        /**
         * 차트의 줌인/줌아웃 상태를 설정
         *
         * @param scale
         * @returns {number}
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
         * 차트의 보이는 영역을 변경
         *
         * @param x
         * @param y
         * @returns {{x: number, y: number}}
         */
        this.viewBox = function(x, y) {
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
         * chart render 함수 재정의
         *
         */
        this.render = function(isAll) {
            // SVG 메인 리셋
            this.svg.reset(isAll);

            // chart 이벤트 초기화 (삭제 대상)
            resetCustomEvent(this);

            // chart 영역 계산
            calculate(this);

            // chart 관련된 요소 draw
            drawBefore(this);
            drawDefs(this);
            drawAxis(this);
            drawBrush(this);
            drawWidget(this, isAll);

            // SVG 태그 백그라운드 테마 설정
            this.svg.root.css({
                background: this.theme("backgroundColor")
            });

            // SVG 메인/서브 렌더링
            this.svg.render(isAll);

            // 커스텀 이벤트 발생
            this.emit("render", [ _initialize ]);

            // 초기화 설정
            _initialize = true;
        }

        /*
         * Brush & Widget 관련 메소드
         *
         */

        /**
         * @method addBrush 
         * 
         * 동적으로 브러쉬를 추가한다. 
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
         * 특정 브러쉬를 삭제한다. 
         * @param {Number} index
         */
        this.removeBrush = function(index) {
            _options.brush.splice(index, 1);
            if(this.isRender()) this.render();
        }
        /**
         * @method updateBrush 
         * 특정 브러쉬를 업데이트 한다.  
         * @param {Number} index
         * @param {Object} brush
         */
        this.updateBrush = function(index, brush) {
            _.extend(_options.brush[index], brush);
            if(this.isRender()) this.render();
        }

        /**
         * @method addWidget 
         * 동적으로 위젯을 추가한다. 
         * 
         * @param {Object} widget
         */
        this.addWidget = function(widget) {
            _options.widget.push(widget);
            if(this.isRender()) this.render();
        }

        /**
         * @method removeWidget 
         * 특정 위젯을 삭제한다.  
         * @param {Number} index
         */
        this.removeWidget = function(index) {
            _options.widget.splice(index, 1);
            if(this.isRender()) this.render();
        }

        /**
         * @method updateWidget
         * 특정 위젯을 업데이트한다.
         * @param {Number} index
         * @param {Object} widget
         */
        this.updateWidget = function(index, widget) {
            _.extend(_options.widget[index], widget);
            if(this.isRender()) this.render();
        }


        /**
         * 테마 변경 후 차트 렌더링
         *
         * @param themeName
         */
        this.setTheme = function(theme) {
            setThemeStyle(theme, _options.style);
            if(this.isRender()) this.render(true);
        }

        /**
         * 사이즈 조정 후 차트 렌더링
         *
         * @param {integer} width
         * @param {integer} height
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
         * 차트가 풀-사이즈인지 확인
         *
         * @returns {boolean}
         */
        this.isFullSize = function() {
            if(_options.width == "100%" || _options.height == "100%")
                return true;

            return true;
        }

        /**
         * 차트의 자동 렌더링 여부 확인
         * false일 경우, 수동으로 render 메소드를 호출해줘야 함
         *
         * @returns {boolean}
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
            /** @cfg {Object} series 각각의 필드에 대한 메타 정보 */
            series: {},
            /** @cfg {Array} brush 그려질 브러쉬 목록 */
            brush: [],
            /** @cfg {Array} widget 그려질 위젯 목록 */
            widget: [],
            /** @cfg {Array} axis 그려질 Axis 목록 */
            axis: [],

            bind: null,
            /** @cfg {Function} [format=null] 빌더에서 공통으로 사용할 format 함수 정의 */
            format: null,
            /** @cfg {Boolean} [render=true] */
            render: true,

            /** @cfg {String} */
            iconPath: null
        }
    }

    /**
     * @event bg_click
     * 실제 이벤트 이름은 bg.click 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_click
     * 실제 이벤트 이름은 chart.click 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_rclick
     * 실제 이벤트 이름은 bg.rclick 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_rclick
     * 실제 이벤트 이름은 chart.rclick 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_dblclick
     * 실제 이벤트 이름은 bg.dblclick 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_dblclick
     * 실제 이벤트 이름은 chart.dblclick 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mousemove
     * 실제 이벤트 이름은 bg.mousemove 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mousemove
     * 실제 이벤트 이름은 chart.mousemove 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mousedown
     * 실제 이벤트 이름은 bg.mousedown 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mousedown
     * 실제 이벤트 이름은 chart.mousedown 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mouseup
     * 실제 이벤트 이름은 bg.mouseup 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mouseup
     * 실제 이벤트 이름은 chart.mouseup 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mouseover
     * 실제 이벤트 이름은 bg.mouseover 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mouseover
     * 실제 이벤트 이름은 chart.mouseover 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mouseout
     * 실제 이벤트 이름은 bg.mouseout 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mouseout
     * 실제 이벤트 이름은 chart.mouseout 사용된다.
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
		fontFamily : "arial,Tahoma,verdana,icojui",
        /** @cfg   */
        colors : themeColors,

        /** @cfg Grid Font Color */
    	gridFontColor : "#333333",
        /** @cfg Grid Active Font color */
    	gridActiveFontColor : "#ff7800",
        /** @cfg Grid Border Color */
        gridBorderColor : "#ebebeb",
        /** @cfg Grid Border Width */
    	gridBorderWidth : 1,
        /** @cfg Grid Border Dash Array */
        gridBorderDashArray : "none",
        /** @cfg */
		gridAxisBorderColor : "#ebebeb",
        /** @cfg */
		gridAxisBorderWidth : 1,
        /** @cfg */
    	gridActiveBorderColor : "#ff7800",
        /** @cfg */
    	gridActiveBorderWidth: 1,

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
    	pieBorderColor : null,
        /** @cfg */        
        pieBorderWidth : 1,
        /** @cfg */
        pieOuterFontSize : "11px",
        /** @cfg */
        pieOuterLineColor : "#a9a9a9",
        /** @cfg */
        pieOuterLineSize : 8,
        /** @cfg */
        donutBorderColor : "white",
        /** @cfg */
        donutBorderWidth : 1,
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
        crossBalloonBackgroundOpacity : 0.5

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
        fontFamily : "arial,Tahoma,verdana,icojui",
        colors : themeColors,

        // grid styles
        gridFontColor : "#666",
        gridActiveFontColor : "#ff7800",
        gridBorderColor : "#efefef",
        gridBorderWidth : 1,
        gridBorderDashArray : "none",
        gridAxisBorderColor : "#efefef",
        gridAxisBorderWidth : 1,
        gridActiveBorderColor : "#ff7800",
        gridActiveBorderWidth: 1,

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
        pieBorderColor : "white",
        pieBorderWidth : 1,
        pieOuterFontSize : "11px",
        pieOuterLineColor : "#a9a9a9",
        pieOuterLineSize : 8,
        donutBorderColor : "white",
        donutBorderWidth : 1,
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
        tooltipFontColor : "#fff",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "black",
        tooltipBorderColor : "none",
        tooltipBackgroundOpacity : 1,
        scrollBackgroundColor : "#dcdcdc",
        scrollThumbBackgroundColor : "#b2b2b2",
        scrollThumbBorderColor : "#9f9fa4",
        zoomBackgroundColor : "red",
        zoomFocusColor : "gray",
        crossBorderColor : "#a9a9a9",
        crossBorderWidth : 1,
        crossBorderOpacity : 0.8,
        crossBalloonFontSize : "11px",
        crossBalloonFontColor : "white",
        crossBalloonBackgroundColor : "black",
        crossBalloonBackgroundOpacity : 0.8
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
		fontFamily : "arial,Tahoma,verdana,icojui",
        colors : themeColors,

        // grid styles
    	gridFontColor : "#868686",
    	gridActiveFontColor : "#ff762d",
        gridBorderColor : "#464646",
        gridBorderWidth : 1,
        gridBorderDashArray : "none",
		gridAxisBorderColor : "#464646",
		gridAxisBorderWidth : 1,
    	gridActiveBorderColor : "#ff7800",
    	gridActiveBorderWidth: 1,

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
    	pieBorderColor : "#232323",
        pieBorderWidth : 1,
        pieOuterFontSize : "11px",
        pieOuterLineColor : "#a9a9a9",
        pieOuterLineSize : 8,
        donutBorderColor : "#232323",
        donutBorderWidth : 1,
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
        tooltipFontColor : "#333333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "white",
        tooltipBackgroundOpacity : 1,
        scrollBackgroundColor : "#3e3e3e",
        scrollThumbBackgroundColor : "#666666",
        scrollThumbBorderColor : "#686868",
        zoomBackgroundColor : "red",
        zoomFocusColor : "gray",
        crossBorderColor : "#a9a9a9",
        crossBorderWidth : 1,
        crossBorderOpacity : 0.8,
        crossBalloonFontSize : "11px",
        crossBalloonFontColor : "#333",
        crossBalloonBackgroundColor : "white",
        crossBalloonBackgroundOpacity : 1
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
		fontFamily : "Caslon540BT-Regular,Times,New Roman,serif,icojui",
		colors : themeColors,

		// grid styles
		gridFontColor : "#333333",
		gridActiveFontColor : "#ff7800",
		gridBorderColor : "#bfbfbf",
		gridBorderWidth : 1,
		gridBorderDashArray : "1, 3",
		gridAxisBorderColor : "#bfbfbf",
		gridAxisBorderWidth : 1,
		gridActiveBorderColor : "#ff7800",
		gridActiveBorderWidth : 1,

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
		pieBorderColor : "white",
		pieBorderWidth : 1,
        pieOuterFontSize : "11px",
        pieOuterLineColor : "#a9a9a9",
        pieOuterLineSize : 8,
		donutBorderColor : "white",
		donutBorderWidth : 3,
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
        tooltipFontColor : "#fff",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "black",
        tooltipBorderColor : "black",
		tooltipBackgroundOpacity : 0.7,
		scrollBackgroundColor :	"#f5f5f5",
		scrollThumbBackgroundColor : "#b2b2b2",
		scrollThumbBorderColor : "#9f9fa4",
		zoomBackgroundColor : "red",
		zoomFocusColor : "gray",
		crossBorderColor : "#a9a9a9",
		crossBorderWidth : 1,
		crossBorderOpacity : 0.8,
		crossBalloonFontSize : "11px",
		crossBalloonFontColor :	"white",
		crossBalloonBackgroundColor : "black",
		crossBalloonBackgroundOpacity : 0.7
	}
}); 
jui.define("chart.theme.pattern", [], function() {

    var themeColors = [
        "pattern-white-rect1",
        "pattern-white-rect2",
        "pattern-white-rect3",
        "pattern-white-rect4",
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
        /** Chart Background Color */
        backgroundColor : "white",
        /** Base Font Size */
        fontSize : "11px",
        /** Base Font Color  */
        fontColor : "#333333",
        /** Base Font Family */
        fontFamily : "arial,Tahoma,verdana,icojui",
        /** Color List  */
        colors : themeColors,

        // grid styles
        /** Grid Font Color */
        gridFontColor : "#333333",
        /** Grid Active Font color */
        gridActiveFontColor : "#ff7800",
        /** Grid Border Color */
        gridBorderColor : "#ebebeb",
        /** Grid Border Width */
        gridBorderWidth : 1,
        /** Grid Border Dash Array */
        gridBorderDashArray : "none",
        /** */
        gridAxisBorderColor : "#ebebeb",
        /** */
        gridAxisBorderWidth : 1,
        /** */
        gridActiveBorderColor : "#ff7800",
        /** */
        gridActiveBorderWidth: 1,

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
        pieBorderColor : "white",
        /** */
        pieBorderWidth : 1,
        /** */
        pieOuterFontSize : "11px",
        /** */
        pieOuterLineColor : "#a9a9a9",
        /** */
        pieOuterLineSize : 8,
        /** */
        donutBorderColor : "white",
        /** */
        donutBorderWidth : 1,
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
        tooltipFontColor : "#333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "#aaaaaa",
        tooltipBackgroundOpacity : 0.7,
        scrollBackgroundColor : "#dcdcdc",
        scrollThumbBackgroundColor : "#b2b2b2",
        scrollThumbBorderColor : "#9f9fa4",
        zoomBackgroundColor : "red",
        zoomFocusColor : "gray",
        crossBorderColor : "#a9a9a9",
        crossBorderWidth : 1,
        crossBorderOpacity : 0.8,
        crossBalloonFontSize : "11px",
        crossBalloonFontColor : "white",
        crossBalloonBackgroundColor : "black",
        crossBalloonBackgroundOpacity : 0.5
    }
});
jui.define("chart.pattern.white", ["util.svg"], function(SVG){

    /**
     * @class chart.pattern.white 
     * 
     * pattern default sample  
     * 
     * @singleton
     */

    function CreateCirclePattern (id, size) {
        size = parseInt(size || 1);
        var el = SVG.createElement({
            type : "pattern",
            attr : { id : 'pattern-white-circle' + id,  x : 10, y : 10, width : 10, height : 10, patternUnits : "userSpaceOnUse" },
            children : [
                { type : 'rect', attr : { width : 10, height : 10, fill : '#ffffff' }},
                { type : 'circle', attr : { cx : size, cy : size, r : size,  fill : '#000000' }}
            ]
        });

        return el; 
    }
    

    return {

        /**
         * @property circle
         *
         * create svg element by json
         *
         * @return {util.svg.element}
         */
        circle : SVG.createElement({
            type: "pattern",
            attr: { id: 'pattern-white-circle', width: 15, height: 15, patternUnits: "userSpaceOnUse" },
            children: [
                { type: 'rect', attr: { width: 50, height: 50, fill: '#282828' }},
                { type: 'circle', attr: { cx: 3, cy: 4.3, r: 1.8, fill: '#393939' }},
                { type: 'circle', attr: { cx: 3, cy: 3, r: 1.8, fill: 'black' }},
                { type: 'circle', attr: { cx: 10.5, cy: 12.5, r: 1.8, fill: '#393939' }},
                { type: 'circle', attr: { cx: 10.5, cy: 11.3, r: 1.8, fill: 'black' }}
            ]
        }),
        
        /**
         * @method rect
         *
         * create svg element by chart's svg  
         * 
         * @return {util.svg.element}
         */        
        rect : SVG.createElement({
            type: "pattern",
            attr: { id: 'pattern-white-rect', width: 20, height: 20, patternUnits: "userSpaceOnUse" },
            children: [
                { type: 'rect', attr: { width: 20, height: 20, fill: '#00a9f1' }},
                { type: 'rect', attr: { width: 20, height: 10, fill: '#26baf4' }}
            ]
        }),

        circle1 : function() { return CreateCirclePattern.call(this, 1, 1); },
        circle2 : function() { return CreateCirclePattern.call(this, 2, 1.5); },
        circle3 : function() { return CreateCirclePattern.call(this, 3, 2); },
        circle4 : function() { return CreateCirclePattern.call(this, 4, 2.5); },
        circle5 : function() { return CreateCirclePattern.call(this, 5, 3); },
        circle6 : function() { return CreateCirclePattern.call(this, 6, 3.5); },
        circle7 : function() { return CreateCirclePattern.call(this, 7, 4); },
        circle8 : function() { return CreateCirclePattern.call(this, 8, 4.5); },

        rect1 : SVG.createElement({
            type : 'pattern',
            attr: { id: 'pattern-white-rect1', width: 70, height: 70, patternUnits: "userSpaceOnUse" },
            children : [
                { type : 'image' , attr : { "xlink:href" : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCI+CjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIgZmlsbD0iI2JiZDgxNyI+PC9yZWN0Pgo8ZyB0cmFuc2Zvcm09InJvdGF0ZSg0NSkiPgo8cmVjdCB3aWR0aD0iOTkiIGhlaWdodD0iMjUiIGZpbGw9IiNhOWNlMDAiPjwvcmVjdD4KPHJlY3QgeT0iLTUwIiB3aWR0aD0iOTkiIGhlaWdodD0iMjUiIGZpbGw9IiNhOWNlMDAiPjwvcmVjdD4KPC9nPgo8L3N2Zz4=", width: 70, height : 70}}
            ]
        }),
        rect2 : SVG.createElement({
            type : 'pattern',
            attr: { id: 'pattern-white-rect2', width: 56, height: 100, patternUnits: "userSpaceOnUse", patternTransform : "rotate(45)" },
            children : [
                { type : 'image' , attr : { "xlink:href" : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjhkMjAzIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZjYyOSIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMCA4NEwyOCAxMDBMNTYgODRMNTYgNTBMMjggMzQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZTUwMyIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+Cjwvc3ZnPg==", width: 56, height : 100}}
            ]
        }),
        rect3 : SVG.createElement({
            type : 'pattern',
            attr: { id: 'pattern-white-rect3', width: 10, height: 10, patternUnits: "userSpaceOnUse", patternTransform : "scale(2)" },
            children : [
                { type : 'rect' , attr : { width : 10, height : 10, fill : '#ffffff', stroke : '#000000', "stroke-width" : 0.5 }}
            ]
        }),
        rect4 : SVG.createElement({
            type : 'pattern',
            attr: { id: 'pattern-white-rect4', width: 10, height: 10, patternUnits: "userSpaceOnUse", patternTransform : "skewX(45)" },
            children : [
                { type : 'rect' , attr : { width : 10, height : 10, fill : '#ffffff', stroke : '#000000', "stroke-width" : 0.5 }}
            ]
        })

    }
    
})

jui.define("chart.icon.jennifer", [], function() {
	return {
		"ws" : "\ue600",
		"was" : "\ue601",
		"upload" : "\ue602",
		"unorderedlist" : "\ue603",
		"underline" : "\ue604",
		"trashcan" : "\ue605",
		"textcolor" : "\ue606",
		"text" : "\ue607",
		"table" : "\ue608",
		"stoppage" : "\ue609",
		"stop" : "\ue60a",
		"server" : "\ue60b",
		"search" : "\ue60c",
		"save" : "\ue60d",
		"right" : "\ue60e",
		"return" : "\ue60f",
		"resize" : "\ue610",
		"refresh2" : "\ue611",
		"refresh" : "\ue612",
		"realtime" : "\ue613",
		"printer" : "\ue614",
		"preview" : "\ue615",
		"plus" : "\ue616",
		"play" : "\ue617",
		"pause" : "\ue618",
		"orderedlist" : "\ue619",
		"new-window" : "\ue61a",
		"more" : "\ue61b",
		"minus" : "\ue61c",
		"loading" : "\ue61d",
		"link" : "\ue61e",
		"left" : "\ue61f",
		"label" : "\ue620",
		"italic" : "\ue621",
		"image" : "\ue622",
		"html" : "\ue623",
		"home" : "\ue624",
		"hide" : "\ue625",
		"help" : "\ue626",
		"gear" : "\ue627",
		"exit" : "\ue628",
		"edit" : "\ue629",
		"download" : "\ue62a",
		"document" : "\ue62b",
		"db" : "\ue62c",
		"dashboardlist" : "\ue62d",
		"close" : "\ue62e",
		"chevron-right" : "\ue62f",
		"chevron-left" : "\ue630",
		"checkmark" : "\ue631",
		"check" : "\ue632",
		"chart" : "\ue633",
		"caution" : "\ue634",
		"calendar" : "\ue635",
		"bold" : "\ue636",
		"arrow3" : "\ue637",
		"arrow2" : "\ue638",
		"arrow1" : "\ue639",
		"align-right" : "\ue63a",
		"align-left" : "\ue63b",
		"align-center" : "\ue63c",
		"add-dir2" : "\ue63d",
		"add-dir" : "\ue63e"
	}
});
jui.define("chart.grid.core", [ "jquery", "util.base" ], function($, _) {
	/**
	 * @class chart.grid.core
     * Grid Core 객체 
	 * @extends chart.draw
     * @abstract
	 */
	var CoreGrid = function() {

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
				return (this.grid.color) ? this.chart.color(0, { colors: [ this.grid.color ] }) : this.chart.theme.apply(this.chart, arguments);
			}

			return (this.grid.color) ? this.chart.color(0, { colors: [ this.grid.color ] }) : this.chart.theme(theme);
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

			// render axis
            if(_.typeCheck("function", func)) {
                func.call(this, root);
            }

			// wrapped scale
			this.scale = this.wrapper(this.scale, this.grid.key);

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
			var width = this.axis.area('width'),
				height = this.axis.area('height'),
				axis = (this.grid.orient == "left" || this.grid.orient == "right") ? this.axis.area('y') : this.axis.area('x'),
				max = (this.grid.orient == "left" || this.grid.orient == "right") ? height : width,
				start = axis,
				size = max;

			return {
				start: start,
				size: size,
				end: start + size
			}
		}
	}

	CoreGrid.setup = function() {
		return {
            /**
             * @cfg {Number} [extend=null] extend grid's option
             */
			extend:	null,
            /**  @cfg {Number} [dist=0] 그리는 좌표로부터 떨어지는 거리  */
			dist: 0,

			/**  @cfg {"top"/"left"/"bottom"/"right"} [orient=null] 기본적으로 배치될 그리드 방향 */
			orient: null,
            
            /** @cfg {Boolean} [hide=false] 숨기기 여부 설정, hide=true 이면 보이지 않음  */
			hide: false,

            /** @cfg {String/Object/Number} [color=null] 그리드의 라인 색깔 */
			color: null,
            /** @cfg {String} [title=null] */
			title: null,
            /** @cfg {Boolean} [hide=false] */
			line: false,
            baseline : true,
            /** @cfg {Function} [format=null]  화면상에 나타나는 텍스트를 변환하는 함수 */
			format: null,
            /** @cfg {Number} [textRotate=null] 표시되는 텍스트의 회전 여부 */
			textRotate : null
		};
	}

	return CoreGrid;
}, "chart.draw"); 
jui.define("chart.grid.block", [ "util.scale", "util.base" ], function(UtilScale, _) {

    /**
     * @class chart.grid.block
     * Block Grid 는 특정한 간격을 가지고 있는  Grid 이다.
     * 
     *  { type : "block", domain : [ 'week1', 'week2', 'week3' ] } 
     * 
     * domain 을 배열로 지정하면 해단 개수만큼 그리드의 영역이 설정된다.
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
			var full_height = this.axis.area('height');
			
			if (!this.grid.line) {
				g.append(this.axisLine({
					x1 : this.start,
					x2 : this.end
				}))
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = this.format(this.domain[i], i);

                if (!domain && domain !== 0) {
                    continue;
                }

				var axis = this.chart.svg.group({
					"transform" : "translate(" + this.points[i] + ", 0)"
				});

				axis.append(this.line(this.chart, {
					x1 : -this.half_band,
					y1 : 0,
					x2 : -this.half_band,
					y2 : (this.grid.line) ? full_height : this.bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : 0,
					y : -20,
					"text-anchor" : "middle"
				}, domain)));

				g.append(axis);
			}

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				});

				axis.append(this.line({
					y2 : (this.grid.line) ? full_height : this.bar
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
			var full_height = this.axis.area('height');

			if (!this.grid.line) {
				g.append(this.axisLine({
					x1 : this.start,
					x2 : this.end
				}));
			}

			for (var i = 0, len = this.points.length; i < len; i++) {
				var domain = this.format(this.domain[i], i);

				if (!domain && domain !== 0) {
                    continue;
                }
                
				var axis = this.chart.svg.group({
					"transform" : "translate(" + this.points[i] + ", 0)"
				});
				
				axis.append(this.line({
					x1 : -this.half_band,
					y1 : 0,
					x2 : -this.half_band,
					y2 : (this.grid.line) ? -full_height : this.bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : 0,
					y : 20,
					"text-anchor" : "middle"
				}, domain)));

				g.append(axis);
			}

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				})

				axis.append(this.line({
					y2 : (this.grid.line) ? -full_height : this.bar
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
			var full_width = this.axis.area('width');

			if (!this.grid.line) {
				g.append(this.axisLine({
					y1 : this.start,
					y2 : this.end
				}))
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = this.format(this.domain[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + (this.points[i] - this.half_band ) + ")"
				});

				axis.append(this.line({
					x2 : (this.grid.line) ? full_width : -this.bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : -this.bar - 4,
					y : this.half_band,
					"text-anchor" : "end"
				}, domain)));

				g.append(axis);
			}

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				})

				axis.append(this.line({
					x2 : (this.grid.line) ? this.axis.area('width') : -this.bar
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
			if (!this.grid.line) {
				g.append(this.axisLine({
					y1 : this.start,
					y2 : this.end
				}));
			}

			for (var i = 0, len = this.points.length; i < len; i++) {
				var domain = this.format(this.domain[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + (this.points[i] - this.half_band) + ")"
				});

				axis.append(this.line({
					x2 : (this.grid.line) ? -this.axis.area('width') : this.bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : this.bar + 4,
					y : this.half_band,
					"text-anchor" : "start"
				}, domain)));

				g.append(axis);
			}

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				});

				axis.append(this.line({
					x2 : (this.grid.line) ? -this.axis.area('width') : this.bar
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
            /** @cfg {String/Array/Function} [domain=null] */
			domain: null,
            /** @cfg {Boolean} [reverse=false] */
			reverse: false,
            /** @cfg {Number} [max=10] */
			max: 10,
            /** @cfg {Boolean} [full=false] */
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
			if (!this.grid.line) {
				g.append(this.axisLine({
					x1 : this.start,
					x2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line({
					y2 : (this.grid.line) ? this.axis.area('height') : -bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : 0,
					y : -bar - 4,
					"text-anchor" : "middle",
					fill : this.chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}

		this.bottom = function(g) {
			if (!this.grid.line) {
				g.append(this.axisLine({
					x1 : this.start,
					x2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var group = this.chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				group.append(this.line({
					y2 : (this.grid.line) ? -this.axis.area('height') : bar
				}));

				group.append(this.getTextRotate(this.chart.text({
					x : 0,
					y : bar * 3,
					"text-anchor" : "middle",
					fill : this.chart.theme("gridFontColor")
				}, domain)));

				g.append(group);
			}
		}

		this.left = function(g) {
			if (!this.grid.line) {
				g.append(this.axisLine({
					y1 : this.start,
					y2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				});

				axis.append(this.line({
					x2 : (this.grid.line) ? this.axis.area('width') : -bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : -bar-2,
					y : bar-2,
					"text-anchor" : "end",
					fill : this.chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}

		this.right = function(g) {
			if (!this.grid.line) {
				g.append(this.axisLine({
					y1 : this.start,
					y2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;
			
			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				});

				axis.append(this.line({
					x2 : (this.grid.line) ? -this.axis.area('width') : bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : bar + 4,
					y : -bar,
					"text-anchor" : "start",
					fill : this.chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
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
            /** @cfg {Array} [domain=null] */
			domain: null,
            /** @cfg {Array} [step=[]] */
			step: [],
            /** @cfg {Number} [min=null] min timestamp  */
			min: null,
            /** @cfg {Number} [max=null] max timestamp  */
			max: null,
            /** @cfg {Boolean} [reverse=false]  */
			reverse: false,
            /** @cfg {String} [key=null] a field for value  */
			key: null,
            /** @cfg {Boolean} [realtime=false]  */
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
	var DateBlockGrid = function(chart, axis, grid) {
		var orient = grid.orient;
		var domain = [];
		var step = [];
		var unit = 0;
		var half_unit;


		this.top = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? this.axis.area('height') : -bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : 0,
					y : -bar - 4,
					"text-anchor" : "middle",
					fill : chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}

		this.bottom = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var group = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				group.append(this.line(chart, {
					y2 : (grid.line) ? -this.axis.area('height') : bar
				}));

				group.append(this.getTextRotate(chart.text({
					x : 0,
					y : bar * 3,
					"text-anchor" : "middle",
					fill : chart.theme("gridFontColor")
				}, domain)));

				g.append(group);
			}
		}

		this.left = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? this.axis.area('width') : -bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : -bar-2,
					y : bar-2,
					"text-anchor" : "end",
					fill : chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}

		this.right = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				});

				axis.append(this.line(chart,{
					x2 : (grid.line) ? -this.axis.area('width') : bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : bar + 4,
					y : -bar,
					"text-anchor" : "start",
					fill : chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}

		this.wrapper = function(chart, scale, key) {
			var old_scale = scale;
			var self = this;

			old_scale.rangeBand = function() {
				return unit;
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
			domain = [this.grid.min, this.grid.max];

			if (_.typeCheck("function", this.grid.step)) {
				step = step.call(this.chart, domain);
			} else {
				step = this.grid.step;
			}

			if (this.grid.reverse) {
				domain.reverse();
			}
		}

		this.drawBefore = function() {

			console.log('aaa');

			var self = this;
			this.initDomain();

			var obj = this.getGridSize(chart, orient, grid),
				range = [obj.start, obj.end];

			console.log(domain, range, step);

			var time = UtilScale.time().domain(domain).rangeRound(range);


			unit = Math.abs(range[0] - range[1])/(this.axis.data.length- 1);
			half_unit = unit/2;


			if (this.grid.realtime) {
				this.ticks = time.realTicks(step[0], step[1]);
			} else {
				this.ticks = time.ticks(step[0], step[1]);
			}

			if ( typeof grid.format == "string") {
				(function(grid, str) {
					grid.format = function(value) {
						return UtilTime.format(value, str);
					}	
				})(grid, grid.format)
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

			console.log(this.ticks, this.values);

			this.scale = $.extend((function(i) {
				return  i * unit;
			}), time);

		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "dateblock", grid);
		}
	}


	DateBlockGrid.setup = function() {
		return {
			/** @cfg {Array} [domain=null] */
			domain: null,
			/** @cfg {Array} [step=[]] */
			step: [],
			/** @cfg {Number} [min=0] min timestamp  */
			min: 0,
			/** @cfg {Number} [max=0] max timestamp  */
			max: 0,
			/** @cfg {Boolean} [reverse=false]  */
			reverse: false
		};
	}

	return DateBlockGrid;
}, "chart.grid.core");

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
			domain: null,
			reverse: false,
			max: 100,
            step : 10,
			line: true,
			hideText: false,
			extra: false,
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
			if (!this.grid.line) {
				g.append(this.axisLine({
					x2 : this.size
				}));
			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0, len = ticks.length; i < len; i++) {

				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = this.chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line({
					y2 : (this.grid.line) ? this.axis.area('height') : -bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : this.chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : 0,
					y : -bar - 4,
					"text-anchor" : "middle",
					fill : this.chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}

		this.bottom = function(g) {
			if (!this.grid.line) {
				g.append(this.axisLine({
					x1 : this.start,
					x2 : this.end
				}));
			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {

				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = this.chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line({
					y2 : (this.grid.line) ? -this.axis.area('height') : bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : this.chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : 0,
					y : bar * 3,
					"text-anchor" : "middle",
					fill : this.chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
				}, domain)))

				g.append(axis);
			}
		}

		this.left = function(g) {
			if (!this.grid.line) {
				g.append(this.axisLine({
					y1 : this.start,
					y2 : this.end
				}));

			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;
            
            var activeBorderColor = this.color("gridActiveBorderColor");
            var borderColor = this.color("gridBorderColor");

			for (var i = 0; i < ticks.length; i++) {

				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + values[i] + ")"
				})

				axis.append(this.line({
					x2 : (this.grid.line) ? this.axis.area('width') : -bar,
					stroke : isZero ? activeBorderColor : borderColor,
					"stroke-width" : this.chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x : -bar - 4,
						y : bar,
						"text-anchor" : "end",
						fill : this.chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
					}, domain)));
				}

				g.append(axis);

			}
		}

		this.right = function(g) {
			if (!this.grid.line) {
				g.append(this.axisLine({
					y1 : this.start,
					y2 : this.end
				}));
			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + values[i] + ")"
				});

				axis.append(this.line({
					x2 : (this.grid.line) ? -this.axis.area('width') : bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : this.chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : bar + 4,
					y : bar,
					"text-anchor" : "start",
					fill : this.chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
				}, domain)));

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
			/** @cfg {Array} [domain=null]  보이는 값(min, max) 설정 */
			domain: null,
			/** @cfg {Number} [step=10] 나누는 숫자 */
			step: 10,
			/** @cfg {Number} [min=0] 최소값 설정 */
			min: 0,
			/** @cfg {Number} [max=0] 최대값 설정 */
			max: 0,
			/** @cfg {Number} [unit=null] 단계별 사이즈  */
			unit: null,
			/**
			 * @cfg {Boolean} [clamp=true]
			 *
			 * max 나 min 을 넘어가는 값에 대한 체크,
			 * true 이면 넘어가는 값도 min, max 에서 조정, false 이면  비율로 계산해서 넘어가는 값 적용
			 */
			clamp : true,
			/**
			 * @cfg {Boolean} [reverse=false]
			 *
			 * 도메인을 거꾸로 정렬한다.
			 * true 이면 도메인이  [0,300] 이라고 할 때 [300, 0] 으로 변경된다.
			 * 화면상에 300 에서 0 값으로 차례로 나타나게 된다.
			 */
			reverse: false,
			/** @cfg {String} [key=null] a field for value */
			key: null,
			/** @cfg {Boolean} [hideText=false] 텍스트 보이기 여부 */
			hideText: false,
			/** @cfg {Boolean} [nice=false] 그리드 간격 적당히 분할하기  */
			nice: false
		};
	}

	return RangeGrid;
}, "chart.grid.core");

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
			/** @cfg {Array} [domain=null]  보이는 값(min, max) 설정 */
			domain: null,
			/** @cfg {Number} [step=10] 나누는 숫자 */
			step: 10,
			/** @cfg {Number} [min=0] 최소값 설정 */
			min: 0,
			/** @cfg {Number} [max=0] 최대값 설정 */
			max: 0,
			/** @cfg {Number} [unit=null] 단계별 사이즈  */
			unit: null,
			/**
			 * @cfg {Boolean} [clamp=true]
			 *
			 * max 나 min 을 넘어가는 값에 대한 체크,
			 * true 이면 넘어가는 값도 min, max 에서 조정, false 이면  비율로 계산해서 넘어가는 값 적용
			 */
			clamp : true,
			/**
			 * @cfg {Boolean} [reverse=false]
			 *
			 * 도메인을 거꾸로 정렬한다.
			 * true 이면 도메인이  [0,300] 이라고 할 때 [300, 0] 으로 변경된다.
			 * 화면상에 300 에서 0 값으로 차례로 나타나게 된다.
			 */
			reverse: false,
			/** @cfg {String} [key=null] a field for value */
			key: null,
			/** @cfg {Boolean} [hideText=false] 텍스트 보이기 여부 */
			hideText: false,
			/** @cfg {Boolean} [hideZero=false] 0(zero) value 화면에서 보이지 않기 */
			hideZero: false,
			/** @cfg {Boolean} [nice=false] 그리드 간격 적당히 분할하기  */
			nice: false,
			/** @cfg {Boolean} [center=false] 가운데로 그리드 이동  */
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

        this.custom = function(chart, g) {
            for(var i = 0, len = this.axis.data.length; i < len; i++) {
                var obj = this.scale(i);

                obj.x -= this.axis.area('x');
                obj.y -= this.axis.area('y');

                var rect = chart.svg.rect($.extend(obj, {
                    fill : 'tranparent',
                    stroke : "white"
                }));

                //g.append(rect);
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

        OverlapGrid.setup = function() {
            return {
                /** @cfg {Number} [size=null] 분할할 개수  */
                count : null
            }
        }
    }
    
    return OverlapGrid;
}, "chart.grid.core");

jui.define("chart.grid.topology.table", [ "util.base" ], function(_) {

    /**
     * @class chart.grid.topology.table
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
                if(data[i].key == key) {
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
            sort: null, // or random
            space: 50
        }
    }
    
    return TopologyTableGrid;
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
                obj.attr({ "clip-path" : "url(#clip-id-" + this.chart.timestamp + ")" });
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

        /**
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
        this.eachData = function(callback) {
            if(!_.typeCheck("function", callback)) return;
            var list = this.listData();


            for(var index = 0, len = list.length; index < len; index++) {
                callback.call(this, index, list[index]);
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

        this.color = function(key) {
            if (typeof key == 'string') {
                return this.chart.color(0, { colors : [key] });
            }
            return this.chart.color(key, this.brush);
        }

        this.on = function(type, callback) {
            return this.chart.on(type, callback, true);
        }
	}

    CoreBrush.setup = function() {
        return {
            /** @cfg {Array} [target=null] 적용될 필드 리스트  */
            target: null,
            /** @cfg {Array} [colors=null]
             * 필드 리스트마다 적용될 색상
             *
             * colors 는 theme 보다 우선순위를 가진다.
             */
            colors: null,
            /** @cfg {Integer} [axis=0] 그려질 영역의 Axis 인덱스 */
            axis: 0,
            /** @cfg {Integer} [index=null] 현재 브러쉬의 인덱스 */
            index: null,
            /** @cfg {boolean} [clip=true] 그려지는 영역을 clip 할 것인지 체크 */
            clip: true
        }
    }

	return CoreBrush;
}, "chart.draw"); 
jui.define("chart.brush.bar", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.bar 
     * implements bar brush 
     * @extends chart.brush.core
     */
	var BarBrush = function(chart, axis, brush) {
		var g;
		var zeroX, height, half_height, bar_height;

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

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroX = axis.x(0);
			height = axis.y.rangeBand();
			half_height = height - (brush.outerPadding * 2);

			bar_height = (half_height - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
            bar_height = (bar_height < 0) ? 0 : bar_height;
		}

		this.drawETC = function(group) {
			if(!_.typeCheck("array", this.barList)) return;

			var self = this,
				style = this.getBarStyle();

			// 액티브 툴팁 생성
			this.active = this.drawTooltip();
            group.append(this.active.tooltip);

			for (var i = 0; i < this.barList.length; i++) {
				var r = this.barList[i];

				// Max & Min 툴팁 생
				if (this.brush.display == "max" && r.max || this.brush.display == "min" && r.min) {
					r.minmax = this.drawTooltip(r.color, style.circleColor, 1);
					r.minmax.control(r.position, r.tooltipX, r.tooltipY, this.format(r.value));
                    group.append(r.minmax.tooltip);
				}

				// 컬럼 및 기본 브러쉬 이벤트 설정
				if (r.value != 0 && this.brush.activeEvent != null) {
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
						tooltipX = axis.x((value == 0) ? brush.minValue : value),
						tooltipY = startY + (bar_height / 2),
						position = (tooltipX >= zeroX) ? "right" : "left";

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
            /** @cfg {Number} [minValue=0] */
			minValue: 0,
            /** @cfg {Number} [outerPadding=2] */
			outerPadding: 2,
            /** @cfg {Number} [innerPadding=1] */
			innerPadding: 1,
            /** @cfg {Number} [active=null] */
			active: null,
            /** @cfg {String} [activeEvent=null]  event name (click or mouseover or etc) */
			activeEvent: null, // or click, mouseover, ...
            /** @cfg {"max"/"min"} [display=null]  'max', 'min' */
			display: null // or max, min
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
						tooltipY = axis.y((value == 0) ? brush.minValue : value),
						position = (tooltipY <= zeroY) ? "top" : "bottom";

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
			/** @cfg {Number} [outerPadding=15] */
			outerPadding: 15,
			/** @cfg {Number} [active=null] 선택 되어진 bar 의 인덱스 */
			active: null,
			/** @cfg {String} [activeEvent=null]  active 가 적용될 이벤트 (click, mouseover, etc..)*/
			activeEvent: null // or click, mouseover, ...
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
            /** @cfg {Number} [active=null] active data index  */
			active: null,
            /** @cfg {Number} [activeEvent=null] active event name (click or mouseover ...) */
			activeEvent: null, // or click, mouseover, ...
            /** @cfg {Boolean} [showText=false] */
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
			var chart_height = chart.area("height");

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
                var c = elem.childrens[0];

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
            /** @cfg {Number} [min=5] */
            min: 5,
            /** @cfg {Number} [max=5] */
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
     * @extends chart.brush.core
     */
    var CandleStickBrush = function() {
        var g, width = 0, barWidth = 0, barPadding = 0;

        this.getTargetData = function(data) {
            var target = {
                low: data[this.brush.low],
                high: data[this.brush.high],
                open: data[this.brush.open],
                close: data[this.brush.close]
            };

            return target;
        }

        this.drawBefore = function() {
            g = this.chart.svg.group();
            width = this.axis.x.rangeBand();
            barWidth = width * 0.7;
            barPadding = barWidth / 2;
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var data = this.getTargetData(data),
                    startX = this.axis.x(i),
                    r = null,
                    l = null;

                if(data.open > data.close) { // 시가가 종가보다 높을 때 (Red)
                    var y = this.axis.y(data.open);

                    l = this.chart.svg.line({
                        x1: startX,
                        y1: this.axis.y(data.high),
                        x2: startX,
                        y2: this.axis.y(data.low),
                        stroke: this.chart.theme("candlestickInvertBorderColor"),
                        "stroke-width": 1
                    });

                    r = this.chart.svg.rect({
                        x : startX - barPadding,
                        y : y,
                        width : barWidth,
                        height : Math.abs(this.axis.y(data.close) - y),
                        fill : this.chart.theme("candlestickInvertBackgroundColor"),
                        stroke: this.chart.theme("candlestickInvertBorderColor"),
                        "stroke-width": 1
                    });

                } else {
                    var y = this.axis.y(data.close);

                    l = this.chart.svg.line({
                        x1: startX,
                        y1: this.axis.y(data.high),
                        x2: startX,
                        y2: this.axis.y(data.low),
                        stroke: this.chart.theme("candlestickBorderColor"),
                        "stroke-width":1
                    });

                    r = this.chart.svg.rect({
                        x : startX - barPadding,
                        y : y,
                        width : barWidth,
                        height : Math.abs(this.axis.y(data.open) - y),
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

    CandleStickBrush.setup = function() {
        return {
            /** @cfg {String} [low=low] a field for low value   */ 
            low: "low",
            /** @cfg {String} [high=high] a field for high value   */
            high: "high",
            /** @cfg {String} [open=open] a field for open value   */
            open: "open",
            /** @cfg {String} [close=close] a field for close value   */
            close: "close"
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
                var data = this.getTargetData(data),
                    startX = axis.x(i);

                var open = data.open,
                    close = data.close,
                    low = data.low,
                    high = data.high;

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

jui.define("chart.brush.donut", [ "util.math" ], function(math) {

    /**
     * @class chart.brush.donut 
     * 
     * implements donut brush 
     *  
     * @extends chart.brush.core  
     * 
     */
	var DonutBrush = function() {
        var w, centerX, centerY, startY, startX, outerRadius, innerRadius;

        /**
         * @method drawDonut 
         *  
         * @param {Number} centerX
         * @param {Number} centerY
         * @param {Number} innerRadius
         * @param {Number} outerRadius
         * @param {Number} startAngle
         * @param {Number} endAngle
         * @param {Object} attr
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

        this.drawBefore = function() {
            var width = this.chart.area('width'),
                height = this.chart.area('height'),
                min = width;

            if(height < min) {
                min = height;
            }

            // center
            w = min / 2;
            centerX = width / 2;
            centerY = height / 2;
            startY = -w;
            startX = 0;
            outerRadius = Math.abs(startY) - this.brush.size;
            innerRadius = outerRadius - this.brush.size;
        }

		this.draw = function() {
			var group = this.chart.svg.group();

			var target = this.brush.target,
				data = this.getData(0);

			var all = 360,
				startAngle = 0,
				max = 0;

			for(var i = 0; i < target.length; i++) {
				max += data[target[i]];
			}

			for(var i = 0; i < target.length; i++) {
				var value = data[target[i]],
					endAngle = all * (value / max);

				var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, {
					fill : 'transparent',
					stroke : this.color(i)
				});

                this.addEvent(g, 0, i);
				group.append(g);

				startAngle += endAngle;
			}

            return group;
		}
	}

	DonutBrush.setup = function() {
		return {
            /** @cfg {Number} [size=50] donut stroke width  */
			size: 50
		};
	}

	return DonutBrush;
}, "chart.brush.core");

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
            /** @cfg {Number} [innerPadding=10] */
            innerPadding: 10,
            /** @cfg {Number} [outerPadding=15] */
            outerPadding: 15,
            /** @cfg {Number} [unit=5] */
            unit: 5,
            /** @cfg {Number} [gap=5] */
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
        var circleColor, disableOpacity, lineBorderWidth;

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
        }

        this.draw = function() {
            return this.drawLine(this.getXY());
        }

        this.drawAnimate = function(root) {
            var svg = this.chart.svg;

            root.each(function(i, elem) {
                if(elem.is("util.svg.element.path")) {
                    var len = elem.length();

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
                }
            });
        }
	}

    LineBrush.setup = function() {
        return {
            symbol: "normal", // normal, curve, step
            display: null,
            active: null,
            activeEvent: null // or click, mouseover, ...
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

jui.define("chart.brush.pie", [ "util.base", "util.math" ], function(_, math) {

	/**
	 * @class chart.brush.pie
	 *
	 * implements pie brush
	 *
     * @extends chart.brush.core
	 */
	var PieBrush = function(chart, axis, brush) {
        var self = this, g;
        var centerX, centerY, outerRadius;

		function createPie(startAngle, endAngle, color) {
			var pie = chart.svg.group(),
				path = chart.svg.path({
                    fill : color,
                    stroke : chart.theme("pieBorderColor") || color,
                    "stroke-width" : chart.theme("pieBorderWidth")
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

		function createUnit(index, data) {
			var obj = axis.c(index);

			var width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y,
                min = width;

			if (height < min) {
				min = height;
			}

			// center
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = min / 2;

			var target = brush.target,
				all = 360,
				startAngle = 0,
				max = 0;

			for (var i = 0; i < target.length; i++) {
				max += data[target[i]];
			}

			for (var i = 0; i < target.length; i++) {
				var value = data[target[i]],
					endAngle = all * (value / max),
                    pie = createPie(startAngle, endAngle, self.color(i));

                if(brush.showText == "outer") {
                    var series = chart.get("series", target[i]),
                        dText = ((series.text != "") ? series.text : target[i]) + ": " + value,
                        cText = _.typeCheck("function", brush.format) ? brush.format(target[i], value) : dText,
                        outer = self.drawTextOuter(startAngle + (endAngle / 2) - 90, cText);

                    self.addEvent(outer, index, i);
                    g.append(outer);
                }

                self.addEvent(pie, index, i);
				g.append(pie);

				startAngle += endAngle;
			}
		}

        this.drawTextOuter = function(centerAngle, text) {
            var c = this.chart,
                dist = c.theme("pieOuterLineSize"),
                r = outerRadius * 1.2,
                x = centerX + (Math.cos(math.radian(centerAngle)) * r),
                y = centerY + (Math.sin(math.radian(centerAngle)) * r),
                isLeft = (centerAngle + 90 > 180) ? true : false,
                ex = (isLeft) ? x - dist : x + dist;

            return c.svg.group({}, function() {
                var path = c.svg.path({
                    fill: "transparent",
                    stroke: c.theme("pieOuterLineColor"),
                    "stroke-width": 0.7
                });

                path.MoveTo(centerX, centerY)
                    .LineTo(x, y)
                    .LineTo(ex, y);

                c.text({
                    "font-size": c.theme("pieOuterFontSize"),
                    "text-anchor": (isLeft) ? "end" : "start",
                    "alignment-baseline": "middle"
                }, text).translate(ex + (isLeft ? -3 : 3), y);
            });
        }

        this.drawBefore = function() {
            g = this.chart.svg.group();
        }

		this.draw = function() {
			this.eachData(function(i, data) {
				createUnit(i, data);
			});

            return g;
		}
	}

    PieBrush.setup = function() {
        return {
            clip: false,
            showText: null // outer, inner
        }
    }

	return PieBrush;
}, "chart.brush.core");

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
            
            var obj = this.axis.c(index);
            
            var width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y;

            // center
            w = Math.min(width, height) / 2;
            centerX = width / 2 + x;
            centerY = height / 2 + y;
            
            var date = new Date();
            
            var hour = typeof data[this.brush.hour] == 'undefined' ? date.getHours() : data[this.brush.hour];
            var minute = typeof data[this.brush.minute] == 'undefined' ?  date.getMinutes() : data[this.brush.minute];
            var second = typeof data[this.brush.second] == 'undefined' ?  date.getSeconds() : data[this.brush.second];
            var millis = typeof data[this.brush.second]  == 'undefined' ?  date.getMilliseconds() : 0;

            group.append(this.drawOuterCircle(w, centerX, centerY));
            group.append(this.drawInnerCircle(w, centerX, centerY));
            group.append(this.drawLine(w, centerX, centerY));
            group.append(this.drawSecond(w, centerX, centerY, hour, minute, second, millis));
            group.append(this.drawMinute(w, centerX, centerY, hour, minute, second, millis));
            group.append(this.drawHour(w, centerX, centerY, hour, minute, second, millis));
            group.append(this.drawInnerCircle2(w, centerX, centerY));
            
            return group; 
		}

        this.drawBefore = function() {

        }

        this.draw = function() {

            var group = this.chart.svg.group();

            this.eachData(function(i, data) {
                this.drawUnit(i, data, group);
            });

            return group;

        }
	}

	ClockBrush.setup = function() {
		return {
            hour : "hour",
            minute : "minute",
            second : "second"
		};
	}

	return ClockBrush;
}, "chart.brush.core");

jui.define("chart.brush.scatter", [], function() {

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
            var self = this;
            var elem = null,
                target = this.chart.get("series", this.brush.target[index]),
                symbol = (!target.symbol) ? this.brush.symbol : target.symbol,
                w = h = this.brush.size;

            var color = this.color(index),
                borderColor = this.chart.theme("scatterBorderColor"),
                borderWidth = this.chart.theme("scatterBorderWidth");

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
                    elem.attr({
                        fill: self.chart.theme("scatterHoverColor"),
                        stroke: color,
                        "stroke-width": borderWidth * 2
                    });
                }, function () {
                    elem.attr({
                        fill: color,
                        stroke: borderColor,
                        "stroke-width": borderWidth
                    });
                });
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
            var g = this.chart.svg.group();

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].length; j++) {
                    var p = this.createScatter({
                        x: points[i].x[j],
                        y: points[i].y[j],
                        max: points[i].max[j],
                        min: points[i].min[j],
                        value: points[i].value[j]
                    }, i);

                    this.addEvent(p, j, i);
                    g.append(p);
                }
            }

            return g;
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
            /** @cfg {"circle"/"triangle"/"rectangle"/"cross"} [symbol="circle"] 그려질 모양 선택  */
            symbol: "circle", // or triangle, rectangle, cross
            /** @cfg {Number} [size=7]  그려질 모양 크기 */
            size: 7,
            /** @cfg {Boolean} [clip=false] */
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
            /** @cfg {"circle"/"triangle"/"rectangle"/"cross"} [symbol="circle"] 그려질 모양 선택  */
            symbol: "circle", // or triangle, rectangle, cross
            /** @cfg {Number} [size=7]  그려질 모양 크기 */
            size: 7,
            /** @cfg {Number} [strokeWidth=1] 선의 굵기 */
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
         * @method drawBefore
         * 
         * @protected
         */
        this.drawBefore = function() {

        }

        /**
         * @method draw
         * 
         * @protected
         * @return {TransformElement}
         */
		this.draw = function() {
            var obj = axis.c(),
                width = obj.width,
                x = obj.x,
                y = obj.y;

			var group = chart.svg.group();

			if (brush.split) {
				var max = width;
			} else {
				var max = width;
			}

			this.eachData(function(i, data) {
                var g = chart.svg.group({
                    "class" : "bar"
                });
                
                g.append(chart.text({
                    x : x,
                    y : y + brush.size / 2 + brush.cut,
                    "text-anchor" : "end",
                    fill : this.color(i)
                }, data[brush.title] || ""))
                
                g.append(chart.svg.rect({
                    x : x + brush.cut,
                    y : y,
                    width: max,
                    height : brush.size,
                    fill : chart.theme("gaugeBackgroundColor")
                }));
                
                var value = (data.value)  * max / 100,
                    ex = (100 - data.value)  * max / 100,
                    startX = x + brush.cut;
                
                if (brush.align == "center") {
                	startX += (max/2 - value/2);
                } else if (brush.align == "right") {
                	startX += max - value; 
                }
                
                g.append(chart.svg.rect({
                    x : startX,
                    y : y,
                    width: value,
                    height : brush.size,
                    fill : chart.color(i, brush)
                }));

                if (brush.split) {
                	var textX = x + value + brush.cut * 2 + ex,
                        textAlign = "start",
                        textColor = chart.color(i, brush);
                } else {
                	var textX = x + brush.cut * 2,
                        textAlign = "start",
                        textColor = "white";
                	
                	if (this.align == "center") {
                		textX = x + brush.cut + max / 2;
                		textAlign = "middle";
                	} else if (brush.align == "right") {
                		textX = x + max;
                		textAlign = "end";                		
                	}
                }
                
                g.append(chart.text({
                    x : textX,
                    y : y + brush.size / 2 + brush.cut,
                    "text-anchor" : textAlign,
                    fill : textColor
                }, brush.format ? brush.format(data.value) : data.value + "%"))

                this.addEvent(g, i, null);
                group.append(g);
                
                y += brush.size + brush.cut;
			});

            return group;
		}
	}

    BarGaugeBrush.setup = function() {
        return {
            /** @cfg {Number} [cut=5] bar gauge item padding */
            cut: 5,
            /** @cfg {Number} [size=20]  bar gauge item height */
            size: 20,
            /** @cfg {Boolean} [split=false] */
            split: false,
            /** @cfg {String} [align=left] bar gauge align  */
            align: "left",
            /** @cfg {String} [title=title]  a field for title */
            title: "title"
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
        var w, centerX, centerY, outerRadius;

		this.drawBefore = function() {

		}

        this.drawUnit = function(i, data, group) {

            var obj = axis.c(index),
                value = (data[this.brush.target] || data.value) || 0,
                max = (data[this.brush.max] || data.max) || 100,
                min = (data[this.brush.min] || data.min) || 0;


            var rate = (value - min) / (max - min);

            var width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y;

            // center
            w = Math.min(width, height) / 2;
            centerX = width / 2 + x;
            centerY = height / 2 + y;
            outerRadius = w;

            var group = chart.svg.group();

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

            var group = chart.svg.group();

            this.eachData(function(i, data) {
                this.drawUnit(i, data, group);
            });

            return group;


		}
	}

    CircleGaugeBrush.setup = function() {
        return {
            /** @cfg {String} [min=min] a field for min */
            min: 'min',
            /** @cfg {String} [max=max] a field for max */
            max: 'max',
            /** @cfg {String} [value=value] a field for value */
            value: 'value'
        };
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
            min: 0,
            max: 100,
            value: 0,
            shape: "circle", // or rectangle
            direction: "vertical",
            svg: "",
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
                maxY = this.axis.y(this.axis.y.min());

            for(var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k),
                    xList = path[k].x;

                if(path[k].length > 0) {
                    p.LineTo(xList[xList.length - 1], maxY);
                    p.LineTo(xList[0], maxY);
                    p.ClosePath();
                }

                p.attr({
                    fill: this.color(k),
                    "fill-opacity": this.chart.theme("areaBackgroundOpacity"),
                    "stroke-width": 0
                });

                this.addEvent(p, null, k);
                g.prepend(p);
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
	var GaugeBrush = function(chart, axis, brush) {
		var self = this;
        var w, centerX, centerY, outerRadius, innerRadius;

        function createText(startAngle, endAngle, min, max, value, unit) {
			var g = chart.svg.group({
				"class" : "gauge text"
			}).translate(centerX, centerY);

			g.append(chart.svg.text({
				x : 0,
				y : (brush.arrow) ? 70 : 10,
				"text-anchor" : "middle",
				"font-family" : chart.theme("fontFamily"),
				"font-size" : "3em",
				"font-weight" : 1000,
				"fill" : self.color(0)
			}, value + ""));

			if (unit != "") {
				g.append(chart.text({
					x : 0,
					y : 100,
					"text-anchor" : "middle",
                    "font-family" : chart.theme("fontFamily"),
					"font-size" : "1.5em",
					"font-weight" : 500,
					"fill" : chart.theme("gaugeFontColor")
				}, unit))
			}

			// 바깥 지름 부터 그림
			var startX = 0;
			var startY = -outerRadius;

            // min
            var obj = math.rotate(startX, startY, math.radian(startAngle));

            startX = obj.x;
            startY = obj.y;

            g.append(chart.text({
                x : obj.x + 30,
                y : obj.y + 20,
                "text-anchor" : "middle",
                "font-family" : chart.theme("fontFamily"),
				"fill" : chart.theme("gaugeFontColor")
            }, min + ""));

			// max
			// outer arc 에 대한 지점 설정
            var obj = math.rotate(startX, startY, math.radian(endAngle));
    
            g.append(chart.text({
                x : obj.x - 20,
                y : obj.y + 20,
                "text-anchor" : "middle",
                "font-family" : chart.theme("fontFamily"),
				"fill" : chart.theme("gaugeFontColor")
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
				value = (data[this.brush.target] || data.value) || 0,
				max = (data[this.brush.max] || data.max) || 100,
				min = (data[this.brush.min] || data.min) || 0,
				unit = (data[this.brush.unit] || data.unit) || "";


			var rate = (value - min) / (max - min),
				currentAngle = brush.endAngle * rate;

			if (brush.endAngle >= 360) {
				brush.endAngle = 359.99999;
			}

			if (currentAngle > brush.endAngle) {
				currentAngle = brush.endAngle;
			}

			var width = obj.width,
				height = obj.height,
				x = obj.x,
				y = obj.y;

			// center
			w = Math.min(width, height) / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w - brush.size/2;
			innerRadius = outerRadius - brush.size;

			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle - currentAngle, {
				fill : "transparent",
				stroke : chart.theme("gaugeBackgroundColor")
			}));


			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle, {
				fill : "transparent",
				stroke : this.color(0)
			}));


			// startAngle, endAngle 에 따른 Text 위치를 선정해야함
			group.append(createText(brush.startAngle, brush.endAngle, min, max, value, unit));


            // draw item 
			this.drawItem(group, data, {
				width : width,
				height : height,
				startAngle : brush.startAngle,
				endAngle : currentAngle,
                outerRadius : outerRadius,
                innerRadius : innerRadius,
                size : brush.size,
				centerX : centerX,
				centerY : centerY
			});


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
            /** @cfg {String} [min=min] a field for min value */
			min: "min",
            /** @cfg {String} [max=max] a field for max value */
			max: "max",
            /** @cfg {String} [value=value] a field for value */
			value: "value",
            /** @cfg {Number} [size=30] stroke width  */
			size: 30,
            /** @cfg {Number} [startAngle=0] start point */
			startAngle: 0,
            /** @cfg {Number} [endAngle=360]  */
			endAngle: 360,
            /** @cfg {String} [unitText=""]  */
			unitText: ""
		};
	}

	return GaugeBrush;
}, "chart.brush.donut");

jui.define("chart.brush.fullgauge", ["util.math"], function(math) {

	/**
	 * @class chart.brush.fullgage
	 * implements full gauge brush
	 * @extends chart.brush.fullgauge
	 */
	var FullGaugeBrush = function(chart, axis, brush) {
		var self = this;
        var w, centerX, centerY, outerRadius, innerRadius;

		function createText(value, unit) {
			var g = chart.svg.group().translate(centerX, centerY);

			if (brush.showText) {
				g.append(chart.svg.text({
					x : 0,
					y : 10,
					"text-anchor" : "middle",
					"font-family" : chart.theme("fontFamily"),
					"font-size" : "1.5em",
					"font-weight" : 1000,
					"fill" : self.color(0)
				}, value + unit));
			}

			return g;
		}

        this.drawBefore = function() {

        }

		this.drawUnit = function(index, data, group) {
			var obj = axis.c(index),
				value = (data[this.brush.target] || data.value) || 0,
				max = (data[this.brush.max] || data.max) || 100,
				min = (data[this.brush.min] || data.min) || 0,
				unit = (data[this.brush.unit] || data.unit) || "";

			var rate = (value - min) / (max - min),
				currentAngle = Math.abs(brush.startAngle - brush.endAngle) * rate;

			if (brush.endAngle >= 360) {
				brush.endAngle = 359.99999;
			}

			var width = obj.width,
				height = obj.height,
				x = obj.x,
				y = obj.y;

			// center
			w = Math.min(width, height) / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w - brush.size;
			innerRadius = outerRadius - brush.size;

			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle, {
				stroke : chart.theme("gaugeBackgroundColor"),
				fill : 'transparent'
			}));

			group.append(this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle, {
				stroke : this.color(0),
				fill : 'transparent'
			}));

			group.append(createText(value, unit));

			return group;
		}

		this.draw = function() {
			var group = chart.svg.group();

			this.eachData(function(i, data) {
				this.drawUnit(i, data, group);
			});

			return group;

		}
	}

	FullGaugeBrush.setup = function() {
		return {
			min: "min",
			max: "max",
			value: "value",
			size: 60,
			startAngle: 0,
			endAngle: 300,
			showText: true
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
			/** @cfg {Number} [min=0] */
			min: 0,
			/** @cfg {Number} [max=100] */
			max: 100,
			/** @cfg {Number} [cut=5] */
			cut: 5,
			/** @cfg {Number} [size=24] */
			size: 24,
			/** @cfg {Number} [startAngle=-180] */
			startAngle: -180,
			/** @cfg {Number} [endAngle=360] */
			endAngle: 360,
			/** @cfg {String} [title="title"] */
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
			/** @cfg {Boolean} [line=true] */
			line: true,
			/** @cfg {Boolean} [end=false] */
			end: false,
			/** @cfg {Boolean} [outerPadding=5] */
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
                if(g.childrens.length == 0) {
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
            /** @cfg {"normal"/"curve"/"step"} [symbol="normal"] 그려질 모양 선택  */
            symbol: "normal", // normal, curve, step
            /** @cfg {Number} [split=null] 분리될 위치  */
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
            }

            return g;
        }

        this.draw = function() {
            return this.drawArea(this.getXY());
        }
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
            /** @cfg {Number} [outerPadding=2] */
            outerPadding: 2,
            /** @cfg {Number} [innerPadding=1] */
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
            /** @cfg {Number} [outerPadding=2] */
			outerPadding: 2,
            /** @cfg {Number} [innerPadding=1] */
			innerPadding: 1
		};
	}

	return RangeBarBrush;
}, "chart.brush.core");

jui.define("chart.brush.topology.edge", [], function() {
    /**
     * @class chart.brush.topology.edge 
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

jui.define("chart.brush.topology.edgemanager", [ "util.base" ], function(_) {
    /**
     * @class chart.brush.topology.edgemananger 
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

jui.define("chart.brush.topology.node",
    [ "util.base", "util.math", "chart.brush.topology.edge", "chart.brush.topology.edgemanager" ],
    function(_, math, Edge, EdgeManager) {

    /**
     * @class chart.brush.topology.node
     * 토폴로지를 표시할 Node 객체  
     * @extends chart.brush.core 
     */
    var TopologyNode = function(chart, axis, brush) {
        var self = this,
            edges = new EdgeManager(),
            g, tooltip, r, point,
            textY = 14, padding = 7, anchor = 7; // 엣지 툴팁

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
            var xy = axis.c(index);

            var node = chart.svg.group({
                index: index
            }, function() {
                var color =_.typeCheck("function", brush.nodeColor) ?
                        brush.nodeColor(data) : (brush.nodeColor || self.color(0));
                var title = _.typeCheck("function", brush.nodeTitle) ? brush.nodeTitle(data) : "",
                    text =_.typeCheck("function", brush.nodeText) ? brush.nodeText(data) : "";

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
                        r: r,
                        fill: color,
                        cursor: "pointer"
                    });
                }

                if(text && text != "") {
                    chart.text({
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
                targetKey = data.outgoing[targetIndex],
                target = axis.c(targetKey),
                xy = axis.c(index);

            var dist = r + point + 1,
                in_xy = getDistanceXY(target.x, target.y, xy.x, xy.y, -(dist)),
                out_xy = getDistanceXY(xy.x, xy.y, target.x, target.y, -(dist)),
                edge = new Edge(data.key, targetKey, in_xy, out_xy);

            if(edges.is(edge.reverseKey())) {
                edge.connect(true);
            }

            edges.add(edge);
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
                    circle = (elem.childrens.length == 2) ? elem.get(1) : elem.get(0),
                    line = (elem.childrens.length == 2) ? elem.get(0) : null,
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
                g.append(createNodes(i, data));
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

            return g;
        }
    }

    TopologyNode.setup = function() {
        return {
            /** @cfg {Boolean} [clip=false] 클립 여부*/
            clip: false,

            // topology options
            nodeTitle: null,
            nodeText: null,
            nodeImage: null,
            nodeColor: null,
            edgeData: [],
            edgeText: null,
            tooltipTitle: null,
            tooltipText: null,
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
			/** @cfg {Integer} [start=-1] */
			start: -1,

			/** @cfg {Integer} [end=-1] */
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
            /** @cfg {Number} [split=0] */
            split: 0,
            /** @cfg {Boolean} [showValue=false] */
            showValue: false,
            /** @cfg {Function} [format=null] */
            format: null
        };
    }

    return PinBrush;
}, "chart.brush.core");
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
        function getIndexArray(brush) {
            var list = [ 0 ];

            if(_.typeCheck("array", brush)) {
                list = brush;
            } else if(_.typeCheck("integer", brush)) {
                list = [ brush ];
            }

            return list;
        }

        /**
         * @method drawAfter  
         * @param {Object} obj
         */
        this.drawAfter = function(obj) {
            obj.attr({ "class": "widget widget-" + this.widget.type });
        }

        /**
         * @method eachBrush 
         * traverse each brush 
         * @param {Function} callback
         */
        this.eachBrush = function(callback) {
            if(!_.typeCheck("function", callback)) return;
            var list = getIndexArray(this.widget.brush);

            for(var i = 0; i < list.length; i++) {
                callback.apply(this, [ i, this.chart.get("brush", list[i]) ]);
            }
        }

        /**
         * @method listBrush 
         * 
         * 연결된 브러쉬 객체 목록을 가지고 온다. 
         *  
         * @returns {Array}
         */
        this.listBrush = function() {
            var list = getIndexArray(this.widget.brush),
                result = [];

            for(var i = 0; i < list.length; i++) {
                result[i] = this.chart.get("brush", list[i]);
            }

            return result;
        }

        /**
         * @method getBrush 
         * 연결된 브러쉬를 가지고 온다. 
         *  
         * @param {Number} index 
         * @returns {*}
         */
        this.getBrush = function(index) {
            return this.listBrush()[index];
        }

        /**
         * @method existBrush 
         * 연결된 브러쉬가 존재하는지 체크한다.
         *
         * @param {Number} index
         * @returns {Boolean}
         */
        this.existBrush = function(index) {
            var list = getIndexArray(this.widget.brush);

            return ($.inArray(index, list) == -1) ? false : true;
        }

        this.isRender = function() {
            return (this.widget.render === true) ? true : false;
        }

        this.on = function(type, callback) {
            return this.chart.on(type, callback, this.isRender());
        }
	}

    CoreWidget.setup = function() {
        return {
            /**
             * @cfg {Number} [brush=0] selected brush index  
             */
            brush: 0,
            /**
             * @cfg {Boolean} [render=false] check whether widget redraw
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
                return widget.format.apply(self.chart, [ key, value, data ]);
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

                text = chart.svg.text({
                    "font-family": chart.theme("fontFamily"),
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
                if(isActive || !self.existBrush(obj.brush.index)) return;
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
            /** @cfg {"bottom"/"top"/"left"/"right" } */
            orient: "top", // or bottom, left, right
            /** @cfg {Boolean} [all=false] */
            all: false,
            /** @cfg {Function} [format=false] */
            format: null
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
                "font-family" : chart.theme("fontFamily"),
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
            /** @cfg {"bottom"/"top"/"left"/"right" } */
            orient: "top", // or bottom
            /** @cfg {"start"/"center"/"end" } */
            align: "center", // or start, end
            /** @cfg {String} text 표시될 타이틀 */
            text: "",
            /** @cfg {Number} [dx=0] x 축과의 거리  */
            dx: 0,
            /** @cfg {Number} [dy=0] y 축과의 거리  */
            dy: 0,
            /** @cfg {Number} [size=null] */
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
                count = data.length;
			
			for(var i = 0; i < count; i++) {
                var target = brush.target[i],
                    text = chart.get("series", target).text || target;

				var rect = chart.svg.getTextRect(text),
                    width = Math.min(rect.width, rect.height),
                    height = width;
								 
				var group = chart.svg.group();
				
				group.append(chart.svg.rect({
					x: 0, 
					y : 0, 
					width: width, 
					height : height,
					fill : chart.color(i, brush)
				}));
				
 				group.append(chart.text({
					x : width + 4,
					y : 11,
                    "font-family" : chart.theme("fontFamily"),
                    "font-size" : chart.theme("legendFontSize"),
                    "fill" : chart.theme("legendFontColor"),
					"text-anchor" : "start"
				}, text));

				arr.push({
					icon : group,
					width : width + 4 + rect.width + 10,
					height : height + 4
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
            
            var x = 0, y = 0,
                total_width = 0, total_height = 0,
                max_width = 0, max_height = 0;

            this.eachBrush(function(index, brush) {
                // brushSync가 true일 경우, 한번만 실행함
                if(widget.brushSync && index != 0) return;

                var arr = this.getLegendIcon(brush);

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
            });
            
            // legend 위치  선정
            if (widget.orient == "bottom" || widget.orient == "top") {
                var y = (widget.orient == "bottom") ? chart.area('y2') + chart.padding("bottom") - max_height : chart.area('y') - chart.padding("top");
                
                if (widget.align == "start") {
                    x = chart.area('x');
                } else if (widget.align == "center") {
                    x = chart.area('x') + (chart.area('width') / 2- total_width / 2);
                } else if (widget.align == "end") {
                    x = chart.area('x2') - total_width;
                }
            } else {
                var x = (widget.orient == "left") ? chart.area('x') - chart.padding("left") : chart.area('x2') + chart.padding("right") - max_width;
                
                if (widget.align == "start") {
                    y = chart.area('y');
                } else if (widget.align == "center") {
                    y = chart.area('y') + (chart.area('height') / 2 - total_height / 2);
                } else if (widget.align == "end") {
                    y = chart.area('y2') - total_height;
                }
            } 
            
            group.translate(Math.floor(x), Math.floor(y));

            return group;
        }
    }

    LegendWidget.setup = function() {
        return {
            /** @cfg {"bottom"/"top"/"left"/"right" } */
            orient: "bottom",
            /** @cfg {"start"/"center"/"end" } */
            align: "center", // or start, end
            /** @cfg {Boolean} [filter=false] */
            filter: false,
            /** @cfg {Boolean} [brushSync=false] */
            brushSync: false
        };
    }

    return LegendWidget;
}, "chart.widget.core");
jui.define("chart.widget.scroll", [ "util.base" ], function (_) {

    /**
     * @class chart.widget.scroll
     * implements scroll widget
     * @extends chart.widget.core
     * @alias ScrollWidget
     * @requires util.base
     *
     */
    var ScrollWidget = function(chart, axis, widget) {
        var thumbWidth = 0,
            thumbLeft = 0,
            bufferCount = 0,
            dataLength = 0,
            totalWidth = 0,
            piece = 0,
            rate = 0 ;

        function setScrollEvent(self, thumb) {
            var isMove = false,
                mouseStart = 0,
                thumbStart = 0;

            self.on("bg.mousedown", function(e) {
                if(isMove && thumb.element != e.target) return;

                isMove = true;
                mouseStart = e.bgX;
                thumbStart = thumbLeft;
            });

            self.on("bg.mousemove", mousemove);
            self.on("bg.mouseup", mouseup);
            self.on("chart.mousemove", mousemove);
            self.on("chart.mouseup", mouseup);

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

                axis.zoom(start, start + bufferCount);

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
            var self = this;

            return chart.svg.group({}, function() {
                chart.svg.rect({
                    width: chart.area("width"),
                    height: 7,
                    fill: chart.theme("scrollBackgroundColor")
                });

                var thumb = chart.svg.rect({
                    width: thumbWidth,
                    height: 5,
                    fill: chart.theme("scrollThumbBackgroundColor"),
                    stroke: chart.theme("scrollThumbBorderColor"),
                    cursor: "pointer",
                    "stroke-width": 1
                }).translate(thumbLeft, 1);

                // 차트 스크롤 이벤트
                setScrollEvent(self, thumb);

            }).translate(chart.area("x"), chart.area("y2"));
        }
    }

    return ScrollWidget;
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
    var ZoomWidget = function(chart, axis, widget) {

        function setDragEvent(self, thumb, bg) {
            var isMove = false,
                mouseStart = 0,
                thumbWidth = 0;

            self.on("chart.mousedown", function(e) {
                if(isMove) return;

                isMove = true;
                mouseStart = e.bgX;
            });

            self.on("chart.mousemove", function(e) {
                if(!isMove) return;

                thumbWidth = e.bgX - mouseStart;

                if(thumbWidth > 0) {
                    thumb.attr({
                        width: thumbWidth
                    });

                    thumb.translate(mouseStart, chart.area("y"));
                } else {
                    thumb.attr({
                        width: Math.abs(thumbWidth)
                    });

                    thumb.translate(mouseStart + thumbWidth, chart.area("y"));
                }
            });

            self.on("chart.mouseup", endZoomAction);
            self.on("bg.mouseup", endZoomAction);
            self.on("bg.mouseout", endZoomAction);

            function endZoomAction() {
                isMove = false;
                if(thumbWidth == 0) return;

                var tick = chart.area("width") / (axis.end - axis.start),
                    x = ((thumbWidth > 0) ? mouseStart : mouseStart + thumbWidth) - chart.padding("left"),
                    start = Math.floor(x / tick) + axis.start,
                    end = Math.ceil((x + Math.abs(thumbWidth)) / tick) + axis.start;

                // 차트 줌
                if(start < end) {
                    axis.zoom(start, end);
                    bg.attr({ "visibility": "visible" });

                    // 차트 렌더링이 활성화되지 않았을 경우
                    if(!chart.isRender()) {
                        chart.render();
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

        this.draw = function() {
            var self = this;
            var cw = chart.area("width"),
                ch = chart.area("height"),
                r = 12;

            return chart.svg.group({}, function() {
                var thumb = chart.svg.rect({
                    height: ch,
                    fill: chart.theme("zoomBackgroundColor"),
                    opacity: 0.3
                });

                var bg = chart.svg.group({
                    visibility: "hidden"
                }, function() {
                    chart.svg.rect({
                        width: cw,
                        height: ch,
                        fill: chart.theme("zoomFocusColor"),
                        opacity: 0.2
                    });

                    chart.svg.group({
                        cursor: "pointer"
                    }, function() {
                        chart.svg.circle({
                            r: r,
                            cx: cw,
                            cy: 0,
                            opacity: 0
                        });

                        chart.svg.path({
                            d: "M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M16.9,15.5l-1.4,1.4L12,13.4l-3.5,3.5 l-1.4-1.4l3.5-3.5L7.1,8.5l1.4-1.4l3.5,3.5l3.5-3.5l1.4,1.4L13.4,12L16.9,15.5z",
                            fill: chart.theme("zoomFocusColor")
                        }).translate(cw - r, -r);
                    }).on("click", function(e) {
                        bg.attr({ visibility: "hidden" });
                        axis.screen(1);

                        // 차트 렌더링이 활성화되지 않았을 경우
                        if(!chart.isRender()) {
                            chart.render();
                        }
                    });

                }).translate(chart.area("x"), chart.area("y"));

                setDragEvent(self, thumb, bg);
            });
        }
    }

    return ZoomWidget;
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
            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                // 포맷 옵션이 없을 경우, 툴팁을 생성하지 않음
                if(_.typeCheck("function", widget.yFormat)) {
                    xline = chart.svg.line({
                        x1: 0,
                        y1: 0,
                        x2: chart.area("width"),
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

                        chart.svg.text({
                            "font-family": chart.theme("fontFamily"),
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
                        y2: chart.area('height'),
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

                        chart.svg.text({
                            "font-family": chart.theme("fontFamily"),
                            "font-size": chart.theme("crossBalloonFontSize"),
                            "fill": chart.theme("crossBalloonFontColor"),
                            "text-anchor": "middle",
                            x: tw / 2,
                            y: 17
                        });
                    }).translate(0, chart.area("height") + ta);
                }
            }).translate(chart.area("x"), chart.area("y"));
        }

        this.draw = function() {
            var brush = this.getBrush(0);

            this.on("chart.mouseover", function(e) {
                g.attr({ visibility: "visible" });
            });

            this.on("chart.mouseout", function(e) {
                g.attr({ visibility: "hidden" });
            });

            this.on("chart.mousemove", function(e) {
                var left = e.chartX + 2,
                    top = e.chartY + 2;

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

                    var value = axis.y.invert(top),
                        message = widget.yFormat.call(self.chart, value);
                    printTooltip(0, yTooltip.get(1), message);
                }

                if(xTooltip) {
                    xTooltip.translate(left - (tw / 2), chart.area("height") + ta);

                    var value = axis.x.invert(left),
                        message = widget.xFormat.call(self.chart, value);
                    printTooltip(1, xTooltip.get(1), message);
                }
            });

            return g;
        }
    }

    CrossWidget.setup = function() {
        return {
            /**
             * @cfg {Function} [xFormat=null] callback function for x format
             */            
            xFormat: null,
            /**
             * @cfg {Function} [yFormat=null] callback function for y format
             */
            yFormat: null
        };
    }

    return CrossWidget;
}, "chart.widget.core");
jui.define("chart.widget.topology.ctrl", [ "util.base" ], function(_) {

    /**
     * @class chart.widget.topology.ctrl 
     * 
     * 토폴로지 이벤트 핸들러
     * 
     * @extends chart.widget.core 
     */
    var TopologyControlWidget = function(chart, axis, widget) {
        var targetKey, startX, startY;
        var renderWait = false;
        var scale = 1, boxX = 0, boxY = 0;

        function initDragEvent() {
            chart.on("chart.mousemove", function(e) {
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

            chart.on("chart.mouseup", endDragAction);
            chart.on("bg.mouseup", endDragAction);
            chart.on("bg.mouseout", endDragAction);

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

            chart.on("chart.mousedown", function(e) {
                if(_.typeCheck("string", targetKey)) return;
                if(startX != null || startY != null) return;

                startX = boxX + e.x;
                startY = boxY + e.y;
            });

            chart.on("chart.mousemove", function(e) {
                if(startX == null || startY == null) return;

                var xy = chart.viewBox(startX - e.x, startY - e.y);
                boxX = xy.x;
                boxY = xy.y;
            });

            chart.on("chart.mouseup", endMoveAction);
            chart.on("bg.mouseup", endMoveAction);
            chart.on("bg.mouseout", endMoveAction);

            function endMoveAction(e) {
                if(startX == null || startY == null) return;

                startX = null;
                startY = null;
            }
        }

        function setBrushEvent() {
            chart.svg.root.get(0).each(function(i, brush) {
                var cls = brush.attr("class");

                if(cls && cls.indexOf("topology.node") != -1) {
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
                            })(data.key);
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
            /** @cfg {Boolean} [move=false] */
            move: false,
            /** @cfg {Boolean} [zoom=false] */
            zoom: false
        }
    }

    return TopologyControlWidget;
}, "chart.widget.core");
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
                        line : opts.axis.xline
                    },
                    y : {
                        type : "range",
                        domain : (opts.axis.domain != null) ? opts.axis.domain : axis_domain,
                        step : opts.axis.ystep,
                        line : opts.axis.yline
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
            /** @cfg {String/Number} [width="100%"] 차트 기본 넓이 */
            width : "100%",
            /** @cfg {String/Number} [height="100%"] 차트 기본 높이 */
            height : "100%",

            /** @cfg {Object} padding 차트 여백 */
            padding : {
                /** @cfg {Number} [padding.left=50] */
                left : 50 ,
                /** @cfg {Number} [padding.right=50] */
                right : 50,
                /** @cfg {Number} [padding.bottom=50] */
                bottom : 50,
                /** @cfg {Number} [padding.top=50] */
                top : 50
            },

            /** @cfg {String} [theme=jennifer] 기본 테마 jennifer */
            theme : "jennifer",
            /** @cfg {Object} [style={}]  */
            style : {},
            /** @cfg {Object} [series={}] */
            series : {},
            /** @cfg {Array} [brush=[]]  */
            brush : [],
            /** @cfg {Array} [widget=[]] */
            widget : [],

            /** @cfg {Object} axis  그리드 에 관한 설정 */
            axis : {
                domain : null,
                format : "hh:mm",
                key : "time",
                xstep : 1, // x축 분 간격
                ystep : 10,
                xline : true,
                yline : true,
                data : []
            },

            /** @cfg {Number} [interval=1] 리얼타임 움직이는 시간 간격(초단위) */
            interval : 1, // 초

            /** @cfg {Number} [interval=1] 리얼타임 전체 시작과 끝 기간 (분단위) */
            period : 5 // 분
        }
    }

    return UI;
});