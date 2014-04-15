(function(exports) {
	var core = null, ui = {}, uix = {};
	
	/**
	 * Private Classes
	 * 
	 */
	var QuickSort = function(array, isClone) { // isClone이면, 해당 배열을 참조하지 않고 복사해서 처리
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
	
	var IndexParser = function() {
		this.isIndexDepth = function(index) {
			if(typeof(index) == "string" && index.indexOf(".") != -1) {
				return true;
			}
			
			return false;
		}
		
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
		
		this.changeIndex = function(index, targetIndex, rootIndex) {
			var rootIndexLen = this.getIndexList(rootIndex).length,
				indexList = this.getIndexList(index),
				tIndexList = this.getIndexList(targetIndex);
			
			for(var i = 0; i < rootIndexLen; i++) {
				indexList.shift();
			}

			return tIndexList.concat(indexList).join(".");
		}
		
		this.getNextIndex = function(index) { // 현재 인덱스에서 +1
			var indexList = this.getIndexList(index),
				no = indexList.pop() + 1;
				
			indexList.push(no);
			return indexList.join(".");
		}
		
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
	        var utftext = "";
	 
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
	
		_.templateSettings = {
			evaluate : /<\!([\s\S]+?)\!>/g,
			interpolate : /<\!=([\s\S]+?)\!>/g,
			escape : /<\!-([\s\S]+?)\!>/g
		};
	
		_.template = function(text, data, settings) {
			settings = _.defaults(settings || {}, _.templateSettings);
	
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
	 * Public Utility Classes
	 * 
	 */
	var utility = {
			
		//-- Properties
		browser: {
			webkit: (window.webkitURL) ? true : false,
			mozilla: (window.mozInnerScreenX) ? true : false,
			msie: (navigator.userAgent.indexOf("Trident") != -1) ? true : false
		},
		isTouch: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
				
		//-- Functions
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
		inherit: function(ctor, superCtor) {
			ctor.super_ = superCtor;
			ctor.prototype = new superCtor;
			ctor.prototype.constructor = ctor;
		},
		extend: function(origin, add) {
			// Don't do anything if add isn't an object
			if (!add || typeof add !== 'object') return origin;
			
			var keys = Object.keys(add);
			var i = keys.length;
			while (i--) {
				origin[keys[i]] = add[keys[i]];
			}
			
			return origin;
		},
		pxToInt: function(px) {
			if(typeof(px) == "string" && px.indexOf("px") != -1) {
				return parseInt(px.split("px").join(""));
			}
			
			return px;
		},
		clone: function(obj) {
			var clone = ($.isArray(obj)) ? [] : {};
			
	        for(var i in obj) {
	            if(typeof(obj[i]) == "object")
	                clone[i] = this.clone(obj[i]);
	            else
	                clone[i] = obj[i];
	        }
	        
	        return clone;
		},
		sort: function(array) {
			return new QuickSort(array);
		},
		runtime: function(name, callback) {
			var nStart = new Date().getTime();
			callback();
			var nEnd = new Date().getTime(); 
			
			console.log(name + " : " + (nEnd - nStart) + "ms");
		},
		template: function(html, obj) {
			if(!obj) return template(html);
			else return template(html, obj);
		},
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
		index: function() {
			return new IndexParser();
		},
		chunk: function(arr, len) {
		  var chunks = [],
		      i = 0,
		      n = arr.length;
		
		  while (i < n) {
		    chunks.push(arr.slice(i, i += len));
		  }
		
		  return chunks;
		},
		typeCheck: function(t, v) {
			function check(type, value) {
				return {
					"string": (typeof(value) == "string") ? true : false,
					"integer": (typeof(value) == "number" && value % 1 == 0) ? true : false,
					"float": (typeof(value) == "number" && value % 1 != 0) ? true : false,
					"number": (typeof(value) == "number") ? true : false,
					"object": (typeof(value) == "object") ? true : false,
					"function": (typeof(value) == "function") ? true : false,
					"array": (value != null && typeof(value) == "object" && typeof(value.length) == "number") ? true : false,
					"boolean"	: (typeof(value) == "boolean") ? true : false, 
					"undefined": (typeof(value) == "undefined") ? true: false,
					"null": (value === null) ? true : false
				}[type];
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
		fileToCsv: function(file, callback) {
			var reader = new FileReader();
			
	        reader.onload = function(readerEvt) {
	            if(typeof(callback) == "function") {
	            	callback(readerEvt.target.result);
	            }
	        };
	
	        reader.readAsText(file);
		},
		csvToBase64: function(csv) {
			return "data:application/octet-stream;base64," + Base64.encode(csv);
		},
		csvToData: function(keys, csv) {
			var dataList = [],
				tmpRowArr = csv.split("\n");
				
			for(var i = 1; i < tmpRowArr.length; i++) {
				if(tmpRowArr[i] != "") {
					var tmpArr = tmpRowArr[i].split(","),
						data = {};
					
					for(var j = 0; j < keys.length; j++) {
						data[keys[j]] = tmpArr[j];
					}
					
					dataList.push(data);
				}
			}
			
			return dataList;
		},
		getCsvFields: function(fields, csvFields) {
			var tmpFields = (csvFields) ? csvFields : fields;
			
			for(var i = 0; i < tmpFields.length; i++) {
				if(!isNaN(tmpFields[i])) {
					tmpFields[i] = fields[tmpFields[i]];
				}
			}
			
			return tmpFields;
		},
        dateFormat: function(date, format, utc) {
            var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
        btoa: Base64.encode,
        atob: Base64.decode
	}
	
	var getDepends = function(depends, level) {
		var args = [];
		
		for(var i = 0; i < depends.length; i++) {
			if(level > 0 && depends[i] == "util") {
				args[i] = utility;
			} 
			
			if(level > 1 && depends[i] == "ui") {
				args[i] = ui;
			} 
			
			if(level > 1 && depends[i].indexOf("ui.") != -1) {
				var uiKey = depends[i].replace("ui.", ""),
					uiObj = ui[uiKey];
				
				if(!uiObj) {
					throw new Error("JUI_CRITICAL_ERR: UI(" + depends[i] + ") is not loaded");
				}
				
				args[i] = uiObj;
			}
			
			if(level > 2 && depends[i] == "uix") {
				args[i] = uix;
			} 
			
			if(level > 2 && depends[i].indexOf("uix.") != -1) {
				var uiKey = depends[i].replace("uix.", ""),
					uiObj = uix[uiKey];
				
				if(!uiObj) {
					throw new Error("JUI_CRITICAL_ERR: UIX(" + depends[i] + ") is not loaded");
				}
				
				args[i] = uiObj;
			}
		}
		
		return args;
	}
	
	
	/**
	 * Global Object
	 * 
	 */
	exports.jui = {
		ready: function() {
			var args = [],
				callback = (arguments.length == 2) ? arguments[1] : arguments[0],
				depends = (arguments.length == 2) ? arguments[0] : null;

			$(function() { 
				if(depends) {
					args = getDepends(depends, 3);
				} else {
					args = [ ui, uix, utility ];
				}
				
				callback.apply(null, args);
			});
		},
		define: function() {
			var tmpUi = [], tmpUix = [];
			
			var name = arguments[0],
				callback = (arguments.length == 3) ? arguments[2] : arguments[1],
				depends = (arguments.length == 3) ? arguments[1] : null;
				
			// Core 객체 생성
			if(name == "core") { 
				core = callback(utility);
			}
			
			// UI 함수 추가
			if(name.indexOf("ui.") != -1) {
				var args = [], 
					key = name.replace("ui.", "");
				
				// UIX에 UI 디펜던시 추가
				if(depends) {
					args = getDepends(depends, 1);
				} else {
					args = [ utility ];
				}
					
				ui[key] = core.init({ type: key, func: callback.apply(null, args) });
			} 
			
			// UIX 함수 추가
			if(name.indexOf("uix.") != -1) {
				var args = [],
					key = name.replace("uix.", "");
				
				// UIX에 UI 디펜던시 추가
				if(depends) {
					args = getDepends(depends, 2);
				} else {
					args = [ utility, ui ];
				}
				
				uix[key] = core.init({ type: key, func: callback.apply(null, args) });
			}
		},
		log: function() {
			var jui_mng = window.open(
	    		this.logUrl, 
	    		"JUIM",
	    		"width=800, height=600, toolbar=no, menubar=no, resizable=yes"
	    	);
	    	
	    	jui.debugAll(function(log, str) {
	    		jui_mng.log(log, str);
	    	});
	    	
	    	return jui_mng;
		},
		logUrl: "jui.mng.html"
	};
})(window);
jui.define('core', function(_) {
	
	var UIManager = new function() {
		var instances = [], classes = [];
		
		/**
		 * Public Methods, Instance
		 * 
		 */
		this.add = function(uiIns) {
			instances.push(uiIns);
		}
		
		this.get = function(key) {
			var result = [];

			if(!isNaN(key)) {
				return instances[key];
			} else if(typeof(key) == "string") {
				for(var i = 0; i < instances.length; i++) {
					if(key == instances[i].type) {
						result.push(instances[i]);
					}
				}
			}
			
			return result;
		}
		
		this.getAll = function() {
			return instances;
		}
		
		this.size = function() {
			return instances.length;
		}
		
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
				var uiList = instances[i].list;
				
				for(var j = 0; j < uiList.length; j++) {
					this.debug(uiList[j], i, j, callback);
				}
			}
		}
		
		/**
		 * Public Methods, Class
		 * 
		 */
		this.addClass = function(uiCls) {
			classes.push(uiCls);
		}
		
		this.getClass = function(key) {
			if(!isNaN(key)) {
				return classes[key];
			} else if(typeof(key) == "string") {
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
		
		this.create = function(type, selector, options) {
			var clsFunc = UIManager.getClass(type)["class"];
			return clsFunc(selector, options);
		}
	}
	
	var UIListener = function(obj) {
		var list = [];
		
		/**
		 * Private Methods
		 * 
		 */
		function settingEventAnimation(e) {
			var pfx = ["webkit", "moz", "MS", "o", ""];
			
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
			var eTypes = {
				"click": "touchstart",
				"dblclick": "touchend",
				"mousedown": "touchstart",
				"mousemove": "touchmove",
				"mouseup": "touchend"
			};
			
			if(e.callback && !e.children) {
				$(e.target).on(eTypes[e.type], e.callback);
			} else {
				$(e.target).on(eTypes[e.type], e.children, e.callback);
			}
			
			list.push(e);
		}
		
		/**
		 * Public Methods
		 * 
		 */
		this.add = function(args) {
			var e = { target: args[0], type: args[1] };
			
			if(typeof(args[2]) == "function") {
				e = $.extend(e, { callback: args[2] });
			} else if(typeof(args[2]) == "string") {
				e = $.extend(e, { children: args[2], callback: args[3] });
			}
			
			// 이벤트 유형에 따른 이벤트 설정
			if(e.type.toLowerCase().indexOf("animation") != -1) 
				settingEventAnimation(e);
			else {
				if(e.target != "body" && e.target != window) { // body와 window일 경우에만 이벤트 중첩이 가능
					$(e.target).unbind(e.type);
				}
				
				if(_.isTouch) {
					settingEventTouch(e);
				} else {
					settingEvent(e);
				}
			}
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
	 * 각각의 UI별 공통 메소드 (메모리 공유)
	 * 예를 들어 테이블 UI 객체일 경우에 해당되는 모든 요소는 UI 객체에 공유된다.
	 */
	var UICore = function() {
		this.base = function() {
			var vo = null;
			
			this.emit = function(type, args) {
				var result = null;
				
				for(var i = 0; i < this.event.length; i++) {
					var tmpEvent = this.event[i];
					
					if(tmpEvent.type == type.toLowerCase()) {
						if(typeof(args) == "object" && args.length != undefined) {
							result = tmpEvent.callback.apply(this, args);
						} else {
							result = tmpEvent.callback.call(this, args);
						}
					}
				}
				
				return result;
			}
			
			this.on = function(type, callback) {
				if(typeof(type) != "string" && typeof(callback) != "object") return;
				this.event.push({ type: type.toLowerCase(), callback: callback });
			}
			
			this.addEvent = function() {
				this.listen.add(arguments);
			}
			
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
			
			this.setTpl = function(name, html) {
				this.tpl[name] = _.template(html);
			}
			
			this.setVo = function() {
				if(!this.options.vo) return;
				
				if(vo != null) vo.reload();
				vo = $(this.selector).jbinder();
				
				this.bind = vo;
			}
			
			this.setOption = function(key, value) {
				if(typeof(key) == "object") {
					for(var k in key) {
						this.options[k] = key[k];
					}
				} else {
					this.options[key] = value;
				}
			}
		}
		
		this.build = function(UI) {
			_.inherit(UI.func, this.base);
			
			// 세팅 메소드에 정의되지 않은 옵션을 사용할 경우에 에러 발생
			function checkedOptions(defOpts, opts) {
				var exceptOpts = [ "event", "tpl", "vo" ],
					defOptKeys = [],
					optKeys = [];
				
				for(var key in defOpts) { defOptKeys.push(key); }
				for(var key in opts) { optKeys.push(key); }
				
				for(var i = 0; i < optKeys.length; i++) {
					var name = optKeys[i];
					
					if($.inArray(name, defOptKeys) == -1 && $.inArray(name, exceptOpts) == -1) {
						throw new Error("JUI_CRITICAL_ERR: '" + name + "' is not an option");
					}
				}
			}
			
			return function(selector, options) {
				var list = [], 
					$root = $(selector);
					
				$root.each(function(index) {
					var obj = new UI.func(),
						setting = obj.setting();
					var defOptions = (typeof(setting.options) == "object") ? setting.options : {};
						
					// Options Check
					checkedOptions(defOptions, options);
					
					// Default Options Setting
					var opts = $.extend(defOptions, options);
						opts.tpl = (opts.tpl) ? opts.tpl : {};
					
					// Pulbic Properties
					obj.init.prototype = obj;
					obj.init.prototype.selector = $root.selector;
					obj.init.prototype.root = this;
					obj.init.prototype.options = opts;
					obj.init.prototype.tpl = {};
					obj.init.prototype.event = new Array(); // Custom Event
					obj.init.prototype.listen = new UIListener(); // DOM Event
					obj.init.prototype.timestamp = Date.now();
					obj.init.prototype.index = ($root.size() == 0) ? null : index;
					
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
					if(opts.tpl) {
						for(var name in opts.tpl) {
							var tplHtml = opts.tpl[name];
							
							if(typeof(tplHtml) == "string" && tplHtml != "") {
								obj.init.prototype.tpl[name] = _.template(tplHtml);
							}
						}
					}
					
					var uiObj = new obj.init();
					var validFunc = (typeof(setting.valid) == "object") ? setting.valid : {},
						animateFunc = (typeof(setting.animate) == "object") ? setting.animate : {};
					
					// Event Setting 
					if(typeof(uiObj.options.event) == "object") {
						for(var key in uiObj.options.event) {
							uiObj.on(key, uiObj.options.event[key]);
						}
					}
					
					// Type-Valid Check
					for(var key in validFunc) {
						uiObj.addValid(key, validFunc[key]);
					}

					// Call-Animate Functions
					if(opts.animate) {
						for(var key in animateFunc) {
							if(typeof(animateFunc[key]) == "object") {
								uiObj.callDelay(key, animateFunc[key]);
							}
						}
					}
					
					list[index] = uiObj;
				});
				
				// UIManager에 데이터 입력
				UIManager.add({ type: UI.type, list: list, selector: selector, options: options, index: UIManager.size() });
				
				return (list.length == 1) ? list[0] : list;
			}
		}
	};
	
	UICore.init = function(UI) {
		var uiObj = null;
		
		if(typeof(UI) === "object") {
			var core = new UICore();
			uiObj = core.build(UI);
			
			UIManager.addClass({ type: UI.type, "class": uiObj });
		}
		
		return uiObj;
	}
	
	// UIManager는 Global 객체로 정의
	window.jui = (typeof(jui) == "object") ? $.extend(jui, UIManager) : UIManager;
	
	return UICore;
});
jui.define('ui.button', [], function() {
	
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
			
			$(self.element).find(".btn").each(function(i) {
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
			this.ui.addEvent(self.element, "click", ".btn", function(e) {
				self._setting("event", e);
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
		
		// Private
		this._setting = function(type, e, order) {
			var self = this,
				className = "active",
				index = this.options.index,
				value = this.options.value;
				
			$(self.element).find(".btn").each(function(i) {
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
	
	var UI = function() {
		var ui_list = {};
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					type: "radio",
					index: 0,
					value: ""
				},
				valid: {
					setIndex: [ [ "integer", "array" ] ],
					setValue: [ [ "integer", "string", "array", "boolean" ] ]
				}
			}
		}
		
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
			
			return this;
		}
		
		this.setIndex = function(indexList) {
			ui_list[this.options.type].options.index = indexList;
			ui_list[this.options.type]._setting("init", null, "index");
		}

		this.setValue = function(valueList) {
			ui_list[this.options.type].options.value = valueList;
			ui_list[this.options.type]._setting("init", null, "value");
		}
		
		this.getData = function() {
			return ui_list[this.options.type].data;
		}
		
		this.getValue = function() {
			return ui_list[this.options.type].data.value;
		}

		this.reload = function() {
			ui_list[this.options.type]._setting("init");
		}
	}
	
	return UI;
});
jui.define('ui.combo', [], function() {
	
	/**
	 * Common Logic
	 * 
	 */
	var hideAll = function() {
		var call_list = jui.get("combo");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i].list;
			
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
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ui_list = null, ui_data = null;
		var index = -1;
					
		/**
		 * Private Methods
		 * 
		 */
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
				}
			});
			
			if($combo_list.size() == 0) {
				ui_data = null;
			}
		}
		
		function getElement(target) {
			return ($(target).children("a").size() > 0) ? $(target).children("a")[0] : target;
		}
		
		function setEventKeydown(self) {
			if(!self.options.keydown) return;
			
			self.addEvent(window, "keydown", function(e) {
				if(self.type == "hide") return;
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
					index = -1;
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
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					index: 0,
					value: "",
					width: 0,
					height: 100,
					keydown: false,
					position: "bottom"
				},
				valid: {
					setIndex: [ "integer" ],
					setValue: [ [ "integer", "string", "boolean" ] ]
				}
			}
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
				if(self.type == "open") return;
				
				hideAll();
				self.open(e);
				
				return false;
			});
			
			// Select
			this.addEvent($combo_drop, "click", "li", function(e) {
				hideAll();
				
				var elem = getElement(e.target),
					value = $(elem).attr("value"),
					text = $(elem).html();
					
				ui_data = { value: value, text: text, element: elem };
				$combo_text.html(text);
				$combo_root.attr("value", value);
				
				self.emit("change", [ ui_data, e ]);
				e.preventDefault();
			});
			
			// Init
			ui_list = { root: $combo_root, text: $combo_text, drop: $combo_drop, toggle: $combo_toggle };

			this.type = "fold"; // 기본 타입 설정
			this.reload();
			
			//  Key up/down event
			setEventKeydown(this);
			
			return this;
		}
		
		this.setIndex = function(index) {
			load("index", index);
		}

		this.setValue = function(value) {
			load("value", value);
		}
		
		this.getData = function() {
			return ui_data;
		}
		
		this.getValue = function() {
			return (ui_data != null) ? ui_data["value"] : null;
		}

		this.getText = function() {
			return (ui_data != null) ? ui_data["text"] : null;
		}
		
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
		
		this.fold = function() {
			ui_list["drop"].hide();
			ui_list["toggle"].removeClass("active");
			
			if(this.options.position == "top") {
				ui_list["drop"].css("top", 0);
			}
			
			this.emit("fold");
			this.type = "fold";
		}
		
		this.reload = function() {
			if(this.options.value != "") {
				load("value", this.options.value);
			} else {
				load("index", this.options.index);
			}
			
			this.emit("reload", ui_data);
		}
	}
	
	return UI;
});
jui.define('ui.datepicker', [ "util" ], function(_) {

    /**
     * UI Class
     *
     */
    var UI = function() {
    	var year = null, month = null, date = null,
            selDate = null, items = {}; // 헌재 페이지의 요소 엘리먼트 캐싱
        var $head = null, $body = null;


        /**
         * Private Methods
         *
         */
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
                selDate = new Date(year + "-" + m + "-" + d);
            } else if(opts.type == "monthly") {
            	var m = (month < 10) ? "0" + month : month;
                selDate = new Date(year + "-" + m + "-01");
            } else if(opts.type == "yearly") {
                selDate = new Date(no + "-01-01");
            }
        }

        function getCalendarDate(self) {
        	var opts = self.options,
        		tmpDate = null;
        	
        	if(opts.type == "daily") {
        		var m = (month < 10) ? "0" + month : month;
        		tmpDate = new Date(year + "-" + m + "-01");
        	} else if(opts.type == "monthly") {
        		tmpDate = new Date(year + "-01-01");
        	} else if(opts.type == "yearly") {
        		tmpDate = new Date();
        	}
        	
        	return tmpDate;
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
                
                if(obj.objs[i].type == "now") {
                	setCalendarDate(self, obj.objs[i].no);
                }
                
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
                    nums[i] = no;
                    objs[i] = { type: (d.getMonth() + 1 == m && d.getDate() == no) ? "now": "", no: nums[i] };
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
                nums.push(i);
                objs.push({ type: (d.getFullYear() == year && d.getMonth() + 1 == i) ? "now": "", no: i });
            }

            return { objs: objs, nums: nums };
        }

        function getYearList(y) {
            var objs = [],
                nums = [],
                startYear = y - 4;

            var d = new Date();

            for(var i = startYear; i < startYear + 12; i++) {
                nums.push(i);
                objs.push({ type: (d.getFullYear() == i) ? "now": "", no: i });
            }

            return { objs: objs, nums: nums };
        }


        /**
         * Public Methods & Options
         *
         */
        this.setting = function() {
            return {
            	options: {
	                type: "daily",
	                titleFormat: "yyyy.MM",
	                format: "yyyy-MM-dd",
	                animate: false
            	},
            	valid: {
            		page: [ "integer", "integer" ],
            		select: [ "integer", "integer", "integer" ],
            		getFormat: [ "string" ]
            	},
            	animate: {
            		page: {
            			after: function() {
            				var self = this;
            				
            				$body.find("tr").each(function(i) {
            					var ms = (i + 1) * 200;
            					
        						$(this).addClass("fadeIn")
        						.css({
        							"animation-duration":  ms + "ms"
        						});
        						
        						(function(elem) {
        							self.addEvent(this, 'AnimationEnd', function() {
        								$(elem).removeClass("fadeIn");
        							});
        						})(this);
            				});
            			}
            		}
            	}
            };
        }

        this.init = function() {
            var self = this,
                opts = this.options;
            var d = new Date();

            year = d.getFullYear();
            month = d.getMonth() + 1;
            date = d.getDate();

            $head = $(this.root).children(".head");
            $body = $(this.root).children(".body");

            // 이벤트 정의
            setCalendarEvent(this);

            // 화면 초기화
            this.page(year, month);

            return this;
        }
        
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
        
        this.select = function(y, m, d) {
        	var opts = this.options;

        	if(arguments.length == 0) {
        		y = year;
        		m = month;
        		d = date;
        	}

            if(opts.type == "daily") {
            	this.page(y, m);
            	$(items[d]).trigger("click");
            } else if(opts.type == "monthly") {
            	this.page(y);
            	$(items[m]).trigger("click");
            } else if(opts.type == "yearly") {
                this.page(y);
                $(items[y]).trigger("click");
            }
        }

        this.getDate = function() {
            return selDate;
        }

        this.getTime = function() {
            return selDate.getTime();
        }

        this.getFormat = function(format) {
            return _.dateFormat(selDate, (typeof(format) == "string") ? format : this.options.format);
        }
    }

    return UI;
});
jui.define('ui.dropdown', [], function() {
	
	/**
	 * Common Logic
	 * 
	 */
	var hideAll = function() {
		var dd = getDropdown();
		
		if(dd != null) {
			dd.hide();
		}
	}
	
	var getDropdown = function() {
		var call_list = jui.get("dropdown");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i].list;
			
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
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ui_list = null, index = -1;
		
		
		/**
		 * Private Methods
		 * 
		 */
		function setEvent(self) {
			var $list = $(ui_list.menu).find("li");
			
			// 이벤트 걸린거 초기화
			$list.unbind("click").unbind("hover");
			
			// 클릭 이벤트 설정
			self.addEvent($list, "click", function(e) {
				var index = getTargetIndex(e.currentTarget),
					text = $(e.currentTarget).text(),
					value = $(e.currentTarget).attr("value");
				
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
		
		function setEventKeydown(self) {
			if(!self.options.keydown) return;
			
			self.addEvent(window, "keydown", function(e) {
				if(self.type == "hide") return;
				var $list = ui_list.menu.find("li");
				
				if(e.which == 38) { // up
					if(index < 1) index = $list.size() - 1;
					else index--;
					
					selectItem(self, function() {
						index--;
						selectItem(self);
					});
				}
				
				if(e.which == 40) { // down
					if(index < $list.size() - 1) index++;
					else index = 0;
					
					selectItem(self, function() {
						index++;
						selectItem(self);
					});
				}
				
				if(e.which == 13) { // enter
					$list.eq(index).trigger("click");
					index = -1;
				}
				
				return false;
			});
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
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					close: true,
					keydown: false,
					left: 0,
					top: 0,
					width: 0,
					height: 0,
					list: []
				},
				valid: {
					update: [ "array" ],
					show: [ "number", "number" ],
					move: [ "number", "number" ],
					wheel: [ "integer", "function" ]
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
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
			
			// Select
			this.update(opts.list);
			this.type = "hide"; // 기본 타입 설정
			
			return this;
		}
		
		this.update = function(list) {
			if(typeof(list) == "object" && this.tpl.node) {
				$(ui_list.menu).empty();
				
				for(var i = 0; i < list.length; i++) {
					$(ui_list.menu).append(this.tpl.node(list[i]));
				}
			}
			
			setEvent(this);
		}
		
		this.hide = function() {
			ui_list.root.hide();
			
			this.emit("hide");
			this.type = "hide";
		}
		
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
		
		this.move = function(x, y) {
			ui_list.root.css("left", x);
			ui_list.root.css("top", y);
		}
		
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
				$list.eq(index).trigger("click");
				index = -1;
				
				if(callback) callback();
			}
		}
		
		this.reload = function() {
			this.init();
			this.emit("reload");
		}
	}
	
	return UI;
});
jui.define('ui.modal', [ 'util' ], function(_) {
	
	/**
	 * Common Logic
	 * 
	 */
	var win_width = 0;
	
	_.resize(function() {
		if(win_width == $(window).width()) return; 
		
		var call_list = jui.get("modal");
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i].list;
			
			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "show") {
					ui_list[j].hide();
					ui_list[j].show();
				}
			}
		}
		
		win_width = $(window).width();
	}, 300);
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var $modal = null, $clone = null;
		var uiId = null, uiObj = null, uiTarget = null;
		var x = 0, y = 0, z_index = 5000;
		
		
		/**
		 * Private Methods
		 * 
		 */
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
			var x = "auto", y = "auto", h = 0;
			
			var target = self.options.target, 
				hTarget = (target == "body") ? window : target,
				pos = (target == "body") ? "fixed" : "absolute",
				tPos = (target == "body") ? null : "relative";
			
			x = ($(hTarget).width() / 2) - ($(self.root).width() / 2);
			y = ($(hTarget).height() / 2) - ($(self.root).height() / 2);
			
			h = $(target).outerHeight();
			h = (h > 0) ? h : $(hTarget).outerHeight();
			
			return {
				x: x, y: y, pos: pos, tPos: tPos, h: h
			}
		}
		
		function createModal(self, h) {
			if($modal != null) return;
			
			$modal = $("<div id='MODAL_" + self.timestamp + "'></div>").css({ 
				position: "absolute",
				width: "100%",
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
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					color: "black",
					opacity: 0.4,
					target: "body",
					index: 0,
					autoHide: true // 자신을 클릭했을 경우, hide
				}
			}
		}
		
		this.init = function() {
			setPrevStatus(this); // 이전 상태 저장
			this.type = "hide"; // 기본 타입 설정
			
			return this;
		}
		
		this.hide = function() {
			// 모달 대상 객체가 숨겨진 상태가 아닐 경우..
			if(uiObj.display != "none") {
				$clone.remove();
				$clone = null;
			}
			
			$(this.options.target).css("position", uiTarget.position);
			$(this.root).css(uiObj);
			
			if($modal) {
				$modal.remove();
				$modal = null;
			}
			
			this.type = "hide";
		}
		
		this.show = function() {
			var info = getModalInfo(this);
			
			// 모달 대상 객체가 숨겨진 상태가 아닐 경우..
			if(uiObj.display != "none") {
				$clone = $(this.root).clone();
				$clone.insertAfter($(this.root));
			}
			
			$(this.options.target).css("position", info.tPos);
			$(this.root).css({
				"position": info.pos,
				"left": info.x,
				"top": info.y,
				"z-index": (z_index + this.options.index)
			}).show();
			
			createModal(this, info.h);
			this.type = "show";
		}
	}
	
	return UI;
});
jui.define('ui.notify', [], function() {

    /**
     * UI Class
     *
     */
    var UI = function() {
    	var $container = null, DEF_PADDING = 12;
    	
        /**
         * Public Methods & Options
         *
         */
        this.setting = function() {
            return {
            	options: {
	                position: "top-right", // top | top-left | top-right | bottom | bottom-left | bottom-right
	                padding: DEF_PADDING, // 알림 컨테이너 여백 또는 리터럴 형태로 패딩 값을 직접 넣을 수 있음
	                distance: 5, // 알림끼리의 간격
	                timeout: 3000, // 0이면 사라지지 않음
	                showDuration: 500,
	                hideDuration: 500,
	                showEasing: "swing",
	                hideEasing: "linear"
            	},
            	valid: {
            		add: [ "object", "integer" ]
            	}
            };
        }

        this.init = function() {
            var self = this, 
            	opts = this.options;
            
            var padding = (typeof(opts.padding) == "object") ? DEF_PADDING : opts.padding,
        		paddingObj = {
	    			"top":    		{ top: padding, bottom: null, left: padding, right: padding },
	    			"top-right":    { top: padding, bottom: null, left: null, right: padding },
	    			"top-left":     { top: padding, bottom: null, left: padding, right: null },
	    			"bottom":  		{ top: null, bottom: padding, left: padding, right: padding },
	    			"bottom-right": { top: null, bottom: padding, left: null, right: padding },
	    			"bottom-left":  { top: null, bottom: padding, left: padding, right: padding }
	        	},
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

        this.add = function(data, timeout) {
            var self = this, 
            	opts = this.options,
            	delay = (!isNaN(timeout)) ? timeout : opts.timeout;
            	
            var $alarm = $(this.tpl.alarm(data)).css({ "margin-bottom": opts.distance });
            
            // 포지션 예외 처리
            if(opts.position == "top" || opts.position == "bottom") {
            	$alarm.outerWidth(
        			$container.width() - ((typeof(opts.padding) == "object" && opts.padding.right) ? opts.padding.right : DEF_PADDING) * 3
    			);
            }

            // 추가
            if(isTop()) {
            	$container.prepend($alarm);
            } else {
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
        
        this.reset = function() {
        	$container.empty();
        }
    }

    return UI;
});
jui.define('ui.paging', [], function() {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var activePage = 1, lastPage = 1;
		var $main = null;
		
		
		/**
		 * Private Methods
		 * 
		 */
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
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					count: 0,		// 데이터 전체 개수
					pageCount: 10,	// 한페이지당 데이터 개수
					screenCount: 5	// 페이지 개수
				},
				valid: {
					reload: [ "integer" ],
					page: [ "integer" ]
				}
			}
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
		
		this.reload = function(count) {
			var count = (!count) ? this.options.count : count;
			
			activePage = 1;
			lastPage = Math.ceil(count / this.options.pageCount);
			
			this.page(activePage);
		}
		
		this.page = function(pNo) {
			if(!pNo) return activePage;
			
			var pages = [], 
				end = (lastPage < this.options.screenCount) ? lastPage : this.options.screenCount,
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
			$main.html(this.tpl["pages"]({ pages: pages, lastPage: lastPage }));
			
			setEventAction(this);
			setEventPage(this);
			setPageStyle(this, activePage);
			
			// 커스텀 이벤트 발생
			this.emit("page", [ activePage ]);
		}

		this.next = function() {
			this.page(activePage + 1);
		}
		
		this.prev = function() {
			this.page(activePage - 1);
		}
		
		this.first = function() {
			this.page(1);
		}

		this.last = function() {
			this.page(lastPage);
		}
	}
	
	return UI;
});
jui.define('ui.tooltip', [], function() {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var $tooltip = null;
		var pos = {}, title = "", delay = null;
		
		
		/**
		 * Private Methods
		 * 
		 */
		function createTooltip(self) {
			$tooltip = 
				$("<div id='TOOLTIP_" + self.timestamp + "' class='tooltip tooltip-" + self.options.position + " tooltip-" + self.options.color + "'>" + 
					"<div class='anchor'></div>" +
					"<div class='title'>" + ((self.options.title) ? self.options.title : title) + "</div>" +
				"</div>");
			
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
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					color: "black",
					position: "top",
					width: 150,
					align: "left",
					delay: 0,
					type: "mouseover",
					title: ""
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
				
			// 타이틀 설정
			title = $(this.root).attr("title");
			$(this.root).removeAttr("title");
			
			// 기존의 설정된 이벤트 제거
			$(this.root).unbind(opts.type).unbind("mouseout");
			
			// 보이기 이벤트
			this.addEvent(this.root, opts.type, function(e) {
				delay = setTimeout(function() {
					self.show();
				}, opts.delay);
				
				return false;
			});
			
			// 숨기기 이벤트
			this.addEvent(this.root, "mouseout", function(e) {
				clearTimeout(delay);
				self.hide();
				
				return false;
			});
			
			return this;
		}
		
		this.hide = function() {
			if($tooltip != null) { 
				$tooltip.remove();
				$tooltip = null;
				
				pos = {};
			}
		}
		
		this.show = function() {
			if($tooltip) this.hide();
			createTooltip(this);
			
			$tooltip.css({ 
				"left": pos.x,
				"top": pos.y
			});
		}		
	}
	
	return UI;
});
jui.define('uix.autocomplete', [ 'util', 'ui.dropdown' ], function(_, dropdown) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ddUi = null, target = null;
		
		
		/**
		 * Private Methods
		 * 
		 */
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
		
		function getFilteredWords(self, word) {
			var words = self.options.words,
				result = [];
			
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
				
				createDropdown(self, getFilteredWords(self, $(this).val()));
				return false;
			});
		}
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					target: null,
					words: []
				},
				valid: {
					update: [ "array" ]
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 타겟 엘리먼트 설정
			target = (opts.target == null) ? this.root : $(this.root).find(opts.target);
			
			// 키-업 이벤트 설정
			setEventKeyup(this);
			
			return this;
		}		
		
		this.update = function(words) {
			this.options.words = words;
		}
	}
	
	return UI;
});
jui.define('uix.tab', [ 'util', 'ui.dropdown' ], function(_, dropdown) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ui_menu = null,
			index = -1, 
			info = { $root: null, $list: null, $anchor: null, activeIndex: 0 };
			
			
		/**
		 * Private Methods
		 * 
		 */
		function showTarget(target, elem, isInit) {
			$(target).children("*").each(function(i) {
				var self = this;
				
				if(("#" + self.id) == $(elem).attr("href")) {
					$(self).show();
				} else {
					$(self).hide();
				}
			});
		}
		
		function hideAll() {
			info.$list.removeClass("active");
		}
		
		function showMenu(elem) {
			var pos = $(elem).offset();
			
			$(elem).parent().addClass("menu-keep");
			ui_menu.show(pos.left, pos.top + info.$root.height());
		}
		
		function hideMenu() {
			var $menuTab = info.$list.eq(index);
			$menuTab.removeClass("menu-keep");
		}
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					target: "", 
					index: 0 
				},
				valid: {
					show: [ "integer" ]
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 컴포넌트 요소 세팅
			info.$root = $(this.root);
			info.$list = $(this.root).children("li");
			info.$anchor = $("<div class='anchor'></div>");
			
			// 드롭다운 메뉴 
			if(this.tpl.menu) {
				var $menu = $(this.tpl.menu());
				$menu.insertAfter(info.$root);
				
				ui_menu = dropdown($menu, {
					event: {
						change: function(data, e) {
							hideMenu();
							self.emit("changeMenu", [ data, e ]);
						},
						hide: function() {
							hideMenu();
						}
					}
				});
			}
			
			info.$list.each(function(i) {
				// 인덱스 설정
				if($(this).attr("class") == "active" || opts.index == i) { 
					var tmpObj = this;
					
					setTimeout(function() { // 최초에 숨겨진 컨텐츠 영역 처리
						info.$anchor.appendTo($(tmpObj));
						info.activeIndex = i;
						
						self.show(i);
					}, 10);
				}
				
				// 메뉴 설정
				if($(this).hasClass("menu")) 
					index = i;
			
				// 이벤트 설정
				self.addEvent($(this), "click", "a", function(e) {
					var text = $(e.currentTarget).text();
					
					if(i != index) { 
						if(opts.target != "") 
							showTarget(opts.target, this);
						
						self.emit("change", [ { index: i, text: text }, e ]);
						self.show(i);
						
						info.activeIndex = i;
					} else {
						self.emit("menu", [ { index: i, text: text }, e ]);
						if(ui_menu.type != "show") showMenu(this);
					}
					
					e.preventDefault();
				});
			});
			
			return this;
		}
		
		this.show = function(index) {
			hideAll();
			
			var $tab = info.$list.eq(index);
			$tab.addClass("active");
			
			info.$anchor.appendTo($tab);
			showTarget(this.options.target, $tab.find("a").get(0));
		}
		
		this.activeIndex = function() {
			return info.activeIndex;
		}
	}
	
	return UI;
});
jui.define('uix.table', [ 'util', 'ui.dropdown' ], function(_, dropdown) {
	
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
	 * UI Core Class
	 * 
	 */
	var UIColumn = function(index) {
		var self = this;
		
		this.element = null;
		this.list = []; // 자신의 컬럼 로우 TD 태그 목록
		this.order = "asc";
		this.name = null;
		this.data = [];
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
	
	var UIRow = function(data, tplFunc, pRow) {
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
		this.childrens = [];
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
			var clist = row.childrens;
			
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
			
			for(var i = 0; i < row.childrens.length; i++) {
				var c_row = row.childrens[i];
				
				if(!c_row.isLeaf()) {
					removeChildAll(c_row);
				} else {
					$(c_row.element).remove();
				}
			}
		}

		function reloadChildAll() {
			for(var i = 0; i < self.childrens.length; i++) {
				self.childrens[i].reload(i);
			}
		}
		
		
		/**
		 * Public Methods
		 * 
		 */
		
		//-- 자신과 관련된 메소드

		this.reload = function(rownum, isUpdate, columns) {
			if(!isUpdate) setIndex(rownum); // 노드 인덱스 설정
			
			if(this.element != null) {
				var newElem = getElement();
				
				$(newElem).insertAfter(this.element);
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
			return (this.childrens.length == 0) ? true : false;
		}
		
		this.fold = function() {
			this.type = "fold";

			for(var i = 0; i < this.childrens.length; i++) {
				var c_row = this.childrens[i];
				$(c_row.element).hide();
				
				if(!c_row.isLeaf()) c_row.fold();
			}
		}
		
		this.open = function() {
			this.type = "open";

			for(var i = 0; i < this.childrens.length; i++) {
				var c_row = this.childrens[i];
				$(c_row.element).show();
				
				if(!c_row.isLeaf()) c_row.open();
			}
		}
		
		this.appendChild = function(row) {
			var lastElem = (this.isLeaf()) ? this.element : this.lastChildLeaf().element;
			$(row.element).insertAfter(lastElem);
			
			this.childrens.push(row);
		}

		this.insertChild = function(rownum, row, isReload) {
			var lastElem = this.element;
			
			if(rownum > 0) {
				var cRow = this.childrens[rownum - 1];
				
				// 마지막 자식이거나 대상 로우가 자식이 있을 경우
				if(!cRow.isLeaf() || this.childrens.length == rownum + 1) {
					lastElem = cRow.lastChildLeaf().element;
				} else {
					lastElem = cRow.element;
				}
				
			}
			
			$(row.element).insertAfter(lastElem);
			
			var preRows = this.childrens.splice(0, rownum);
			preRows.push(row);
			
			this.childrens = preRows.concat(this.childrens);
			reloadChildAll();
		}
		
		this.removeChild = function(index) {
			for(var i = 0; i < this.childrens.length; i++) {
				var row = this.childrens[i];
				
				if(row.index == index) {
					this.childrens.splice(i, 1); // 배열에서 제거
					removeChildAll(row);
				}
			}
			
			reloadChildAll();
		}

		this.lastChild = function() {
			if(!this.isLeaf())
				return this.childrens[this.childrens.length - 1];
				
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
	
	var UITable = function(handler, fields) {
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
				var column = new UIColumn(i);
				
				if(columns[i]) { // 기존의 컬럼 정보가 있을 경우에는 리스트만 초기화 한다.
					column.element = columns[i].element;
					column.order = columns[i].order;
					column.name = columns[i].name;
					column.data = columns[i].data;
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
			if(type == "reload") {
				for(var i = 0; i < columns.length; i++) {
					columns[i].list[row.index] = row.list[i];
					columns[i].data[row.index] = row.data[columns[i].name];
				}
			} else if(type == "append") {
				for(var i = 0; i < columns.length; i++) {
					columns[i].list.push(row.list[i]);
					columns[i].data.push(row.data[columns[i].name]);
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
			var row = new UIRow(data, $tpl.row, pRow);
			row.reload(no, false, columns);
			
			return row;
		}
		
		function setRowChildAll(dataList, row) {
			var c_rows = row.childrens;
			
			if(c_rows.length > 0) {
				for(var i = 0; i < c_rows.length; i++) {
					dataList.push(c_rows[i]);
					
					if(c_rows[i].childrens.length > 0) {
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
				return getRowChildLeaf(keys, row.childrens[tmpKey]);
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
				$(row.element).insertAfter((tRow.childrens.length == 0) ? tRow.element : tRow.lastChildLeaf().element);
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
				cRow = createRow(data, pRow.childrens.length, pRow);
				
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
			var self = this, qs = _.sort(rows);
			
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
		    	
    			if(!isNaN(value) && value != null) {
    				return parseInt(value);
    			} 
    			
    			if(typeof(value) == "string") {
    				return value.toLowerCase();
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
					
					if(tmpRows[i].childrens.length > 0) {
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
	
	
	/**
	 * UI Main Class
	 * 
	 */
	var UI = function() {
		var $obj = null, ddUi = null; // table/thead/tbody 구성요소, 컬럼 설정 UI (Dropdown)
		var rowIndex = null;
		
		
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
			
			$obj.tbody.unbind("scroll").scroll(function(e) {
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
					if(row.childrens.length > 0) {
						setEventRow(self, row);
						setEventRows(self, row.childrens);
					} else {
						setEventRow(self, row);
					}
				})(rows[i])
			}
		}
		
		function setEventRow(self, row) {
			self.addEvent(row.element, "click", function(e) {
				// 1. 공통 이벤트 발생
				self.emit("select", [ row, e ]);

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
				if(typeof(callback) == "function") { // editRow일 경우
					callback();
				} else {
					var data = {};
					data[column.name] = $input.val();

					var res = self.emit("editend", [ data ]);
					
					// 이벤트 리턴 값이 false가 아닐 경우에만 업데이트
					if(res !== false) {
						self.update(row.index, data);
						$input.remove();
					}
				}
			}
		}

		function setEventColumn(self) {
			// 컬럼 컨텍스트 이벤트
			$obj.thead.find("tr > th").each(function(i) {
				(function(index, thElement) {
					self.addEvent(thElement, "contextmenu", function(e) {
						self.emit("colmenu", [ self.getColumn(index), e ]);
						return false;
					});
				})(i, this);
			});
		}
		
		function setSort(self) {
			var sortIndexes = self.options.sort,
				len = (sortIndexes === true) ? self.uit.getColumnCount() : sortIndexes.length;
			
			for(var i = 0; i < len; i++) {
				var columnKey = (sortIndexes === true) ? i : sortIndexes[i],
					column = self.getColumn(columnKey);
				
				if(column.element != null) {
					(function(index, name) {
						self.addEvent(column.element, "click", function(e) {
							if($(e.target).hasClass("resize")) return;
							self.sort(index, undefined, e);
							
							return false;
						});
					})(columnKey, column.name);
					
					$(column.element).css("cursor", "pointer");
				}
			}
		}
		
		function setColumnResize(self) {
			var resizeX = 0;
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
				var pos = $colElem.position();
				
				$resizeBar.css({
					position: "absolute",
			        width: "8px",
			        height: "100%", 
			        left: ($colElem.outerWidth() + pos.left - 1) + "px",
			        top: pos.top + "px",
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
					self.emit("colresize", [ col, e ]);
					resizeX = 0;
					
					// 리사이징 바, 위치 이동
					var left = $(col.element).position().left;
					$(colResize).css("left", $(col.element).outerWidth() + left - 1);
					
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
		 * Public Methods & Options
		 *
		 */
		this.setting = function() {
			var MAX = 2500, DELAY = 70;
			
			function animateUpdate(self, rows) {
				var ms = MAX - 1;
				
				for(var i = 0; i < rows.length; i++) {
					ms = (ms < MAX) ? (i + 1) * DELAY : MAX;
					
					$(rows[i].element).addClass("fadeInLeft")
					.css({
						"animation-duration":  ms + "ms"
					});
					
					(function(index) {
						self.addEvent(rows[index].element, 'AnimationEnd', function() {
							$(rows[index].element).removeClass("fadeInLeft");
						});
					})(i);
				}
			}
			
			return {
				options: {
					fields: null,
					csv: null,
					csvNames: null,
					rows: [],
					colshow: false,
					scroll: false,
					scrollHeight: 200,
					expand: false,
					expandEvent: true,
					editCell: false,
					editRow: false,
					editEvent: true,
					resize: false,
					sort: false,
					sortIndex: null,
					sortOrder: "asc",
					animate: false
				},
				valid: {
					update: [ [ "integer", "string", "array" ], "object" ],
					updateTree: [ "array" ],
					append: [ [ "integer", "string", "object", "array" ], [ "object", "array" ] ],
					insert: [ [ "integer", "string" ], [ "object", "array" ] ],
					select: [ [ "integer", "string" ] ],
					remove: [ [ "integer", "string" ] ],
					move: [ [ "integer", "string" ], [ "integer", "string" ] ],
					sort: [ [ "integer", "string" ], [ "string", "undefined" ], [ "object", "undefined" ] ],
					scroll: [ "integer" ],
					open: [ [ "integer", "string" ] ],
					fold: [ [ "integer", "string" ] ],
					get: [ [ "integer", "string" ] ],
					getAll: [ [ "integer", "string" ] ],
					getColumn: [ [ "integer", "string" ] ],
					showColumn: [ [ "integer", "string" ], [ "object", "undefined" ] ],
					hideColumn: [ [ "integer", "string" ], [ "object", "undefined" ] ],
					initColumns: [ "array" ],
					showExpand: [ [ "integer", "string" ], [ "object", "undefined" ], [ "object", "undefined" ] ],
					hideExpand: [ [ "object", "undefined" ] ],
					showEditRow: [ [ "integer", "string" ], [ "object", "undefined" ] ],
					setCsv: [ "string", "string" ],
					setCsvFile: [ [ "string", "object" ], "object" ],
					getCsv: [ [ "boolean", "undefined" ] ],
					getCsvBase64: [ [ "boolean", "undefined" ] ]
				},
				animate: {
					update: {
						after: function() {
							if(arguments.length == 1) {
								if(!_.browser.webkit && !_.browser.mozilla) return;
								animateUpdate(this, this.listAll());
							}
						}
					},
					updateTree: {
						after: function() {
							if(!_.browser.webkit && !_.browser.mozilla) return;
							animateUpdate(this, this.listAll());
						}
					},
					remove: {
						before: function(index) {
							var row = this.get(index);
							
							$(row.element).addClass("fadeOutDown")
							.css({
								"animation-duration":  "350ms",
								"animation-timing-function": "ease-out"
							});
						},
						delay: 200
					},
					reset: {
						before: function() {
							var rows = this.listAll(),
								m = 2000,
								d = ((m / rows.length) < 50) ? 50 : (m / rows.length);
							
							for(var i = 0; i < rows.length; i++) {
								m -= d;
								
								$(rows[i].element).addClass("fadeOutRight")
								.css({
									"animation-duration":  ((m > 0) ? m : 50) + "ms",
									"animation-fill-mode": "both"
								});
							}
						},
						delay: 1000
					}
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// UIHandler, 추후 코어에서 처리
			$obj = {
				table: $(this.root),
				thead: $(this.root).find("thead"),
				tbody: $(this.root).find("tbody")
			};
			
			// UITable 객체 생성
			this.uit = new UITable({ 
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
			
			if(opts.fields && opts.sort) {
				setSort(this);
			}
			
			if(opts.rows.length > 0) {
				this.update(opts.rows);
			} else {
				this.setVo(); // 데이터가 있을 경우에는 VO 세팅을 별도로 함
			}
			
			if(!opts.fields) {
				if(opts.sort || opts.colshow || opts.editCell || opts.editRow) {
					throw new Error("JUI_CRITICAL_ERR: 'fields' option is required");
				}
			}
			
			setEventColumn(this);
			
			return this;
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
			if(!this.options.fields || !this.options.sort) return;
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

		this.listAll = function() {
			return this.uit.getRowAll();
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
		
		this.columnMenu = function(x) {
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
			if(!this.options.editRow) return;
			
			// 초기화
			this.unselect();
			this.hideExpand();
			
			var self = this,
				row = this.get(index);
			var $cells = $(row.element).find("td");
			
			$cells.each(function(i) {
				setEventEditCell(self, this, row, i, e, function() {
					var data = {};
					
					$cells.each(function(colIndex) {
						var column = self.getColumn(colIndex);
						
						if(column.name != null) {
							data[column.name] = $(this).find(".edit").val();
						}
					});
					
					var res = self.emit("editend", [ data ]);
					
					// 이벤트 리턴 값이 false가 아닐 경우에만 업데이트
					if(res !== false) {
						self.update(row.index, data);
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
			if(!this.options.fields && !this.options.csv) return;
			
			var csv = (arguments.length == 1) ? arguments[0] : arguments[1],
				key = (arguments.length == 2) ? arguments[0] : null;
			
			var fields = _.getCsvFields(this.options.fields, this.options.csv),
				dataList = _.csvToData(fields, csv);
			
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
		
		this.activeIndex = function() { // 활성화된 확장/수정/선택 상태의 로우 인덱스를 리턴
			return rowIndex;
		}
	}
	
	return UI;
});
jui.define('uix.tree', [ 'util' ], function(_) {
	
	/**
	 * UI Core Class
	 * 
	 */
	var UINode = function(data, tplFunc) {
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
		this.childrens = [];		// 자식 노드들
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
			if(self.childrens.length > 0) {
				setIndexChild(self);
			}
		}
		
		function setIndexChild(node) {
			var clist = node.childrens;
			
			for(var i = 0; i < clist.length; i++) {
				clist[i].reload(i);
				
				if(clist[i].childrens.length > 0) { 
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
			
			for(var i = 0; i < node.childrens.length; i++) {
				var cNode = node.childrens[i];
				
				if(cNode.childrens.length > 0) {
					removeChildAll(cNode);
				} else {
					$(cNode.element).remove();
				}
			}
		}

		function reloadChildAll(node) {
			for(var i = 0; i < node.childrens.length; i++) {
				var cNode = node.childrens[i];
				cNode.reload(i);
				
				if(cNode.childrens.length > 0) {
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
			return (this.childrens.length == 0) ? true : false;
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
			this.childrens.push(node);
		}

		this.insertChild = function(nodenum, node) {
			if(nodenum == 0) {
				if(this.childrens.length == 0) {
					$(this.element).children("ul").append(node.element);
				} else {
					$(node.element).insertBefore(this.childrens[0].element);
				}
			} else {
				$(node.element).insertAfter(this.childrens[nodenum - 1].element);
			}
			
			var preNodes = this.childrens.splice(0, nodenum);
			preNodes.push(node);
			
			this.childrens = preNodes.concat(this.childrens);
			reloadChildAll(this);
		}
		
		this.removeChild = function(index) {
			for(var i = 0; i < this.childrens.length; i++) {
				var node = this.childrens[i];
				
				if(node.index == index) {
					this.childrens.splice(i, 1); // 배열에서 제거
					removeChildAll(node);
				}
			}
			
			reloadChildAll(this);
		}

		this.lastChild = function() {
			if(this.childrens.length > 0)
				return this.childrens[this.childrens.length - 1];
				
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
	
	var UITree = function(handler) {
		var self = this, root = null;
		
		var $obj = handler.$obj,
			$tpl = handler.$tpl;
		
		var iParser = _.index();
		
		/**
		 * Private Methods
		 * 
		 */
		function createNode(data, no, pNode) {
			var node = new UINode(data, $tpl.node);
			
			node.parent = (pNode) ? pNode : null;
			node.reload(no);
			
			return node;
		}
		
		function setNodeChildAll(dataList, node) {
			var c_nodes = node.childrens;
			
			if(c_nodes.length > 0) {
				for(var i = 0; i < c_nodes.length; i++) {
					dataList.push(c_nodes[i]);
					
					if(c_nodes[i].childrens.length > 0) {
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
				return getNodeChildLeaf(keys, node.childrens[tmpKey]);
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
				var node = createNode(data, root.childrens.length, root);
				root.appendChild(node);
			}
			
			return node;
		}
		
		function appendNodeDataChild(index, data) {
			var pNode = self.getNode(index), 
				cNode = createNode(data, pNode.childrens.length, pNode);
				
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
			if(root.childrens.length == 0 && parseInt(index) == 0) {
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
			var nodes = root.childrens;
			
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
				node.parent.childrens.splice(node.nodenum, 1);
				node.parent.reloadChildrens();
				node.parent = tpNode;
				
				// 이동 대상 데이터 처리
				var preNodes = tpNode.childrens.splice(0, tNo);
				preNodes.push(node);
				
				tpNode.childrens = preNodes.concat(tpNode.childrens);
				tpNode.reloadChildrens();
			}
		}
		
		this.getNode = function(index) {
			if(index == null) return root.childrens;
			else {
				var nodes = root.childrens;
				
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
				tmpNodes = (index == null) ? root.childrens : [ this.getNode(index) ];
			
			for(var i = 0; i < tmpNodes.length; i++) {
				if(tmpNodes[i]) {
					dataList.push(tmpNodes[i]);
					
					if(tmpNodes[i].childrens.length > 0) {
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
	
	
	/**
	 * UI Main Class
	 * 
	 */
	var UI = function() {
		var $obj = null;
		var dragIndex = { start: null, end: null }, 
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
					var childs = self.uit.getRoot().childrens;
					
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
			$("body").unbind("mousemove").unbind("mouseup");

			for(var i = 0; i < nodeList.length; i++) {
				(function(node) {
					$(node.element).unbind("mousedown").unbind("mouseup");
					
					self.addEvent(node.element, "mousedown", function(e) {
						if(e.target.tagName == "I") return;
						
						if(dragIndex.start == null) {
							dragIndex.start = node.index;
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
								self.move(dragIndex.start, ("" + root.childrens.length));
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
		 * Public Methods & Options
		 *
		 */
		this.setting = function() {
			return {
				options: {
					root: null,
					rootHide: false,
					rootFold: false,
					drag: false,
					dragChild: true
				},
				valid: {
					update: [ "string", "object" ],
					append: [ [ "string", "object", "array" ], [ "object", "array" ] ],
					insert: [ "string", [ "object", "array" ] ],
					select: [ "string" ],
					remove: [ "string" ],
					move: [ "string", "string" ],
					open: [ [ "string", "null" ], [ "object", "undefined" ] ],
					fold: [ [ "string", "null" ], [ "object", "undefined" ] ],
					openAll: [ "string" ],
					foldAll: [ "string" ],
					listParents: [ "string" ],
					get: [ "string" ],
					getAll: [ "string" ]
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// UITable 객체 생성
			this.uit = new UITree({ $obj: { tree: $(this.root) }, $tpl: this.tpl }); // 신규 테이블 클래스 사용
			
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
			
			return this;
		}
		
		this.update = function(index, data) {
			this.uit.updateNode(index, data);
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
	}
	
	return UI;
});
jui.define('uix.window', [ 'util', 'ui.modal' ], function(_, modal) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var z_index = 2000,
			target = null,
			move = {},
			resize = {},
			info = {},
			ui_modal = null;
		
		
		/**
		 * Private Methods
		 *
		 */
		function setBodyResize() {
			var bottom = (info.$foot.length < 1) ? parseInt(info.$root.css("border-radius")) : info.$foot.outerHeight();
			info.$body.outerHeight(info.$root.outerHeight() - info.$head.outerHeight() - bottom);
		}
		
		
		/**
		 * Public Methods & Options
		 *
		 */
		this.setting = function() {
			function animateVisible(self, style) {
				$(self.root).addClass(style)
				.css({
					"animation-duration": "500ms",
					"animation-fill-mode": "both"
				});
				
				self.addEvent(self.root, 'AnimationEnd', function() {
					$(self.root).removeClass(style);
				});
			}
			
			return {
				options: {
					width: 400,
					height: 300,
					left: "auto",
					top: "auto",
					right: "auto",
					bottom: "auto",
					modal: false,
					move: true,
					resize: true,
					modalIndex: 0,
					animate: false
				},
				valid: {
					show: [ "integer", "integer" ],
					move: [ "integer", "integer" ],
					update: [ "string" ],
					setTitle: [ "string" ],
					setSize: [ "integer", "integer" ]
				},
				animate: {
					show: {
						after: function() {
							animateVisible(this, "fadeInDown");
						}
					},
					hide: {
						before: function() {
							animateVisible(this, "fadeOutUp");
						},
						after: function() {
							$(this.root).removeClass("fadeOutUp");
						},
						delay: 500
					},
					move: {
						after: function() {
							animateVisible(this, "shake");
						}
					}
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			var $win_root = $(this.root),
				$win_head = $(this.root).children(".head"),
				$win_body = $(this.root).children(".body"),
				$win_foot = $(this.root).children(".foot"),
				$body = $("body");
				
			// 옵션 예외 처리
			if(opts.modal) {
				opts.move = false;
				opts.resize = false;
			}
				
			// UI 객체 추가
			info = { $root: $win_root, $head: $win_head, $body: $win_body, $foot: $win_foot };
			
			// 기본 스타일 & Modal 스타일 & Body로 강제 이동
			$body.children(this.selector).remove();
			$win_root.css(opts).appendTo($body);
			
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
			
			// 바디 리사이징
			setBodyResize();
			
			// Init
			setTimeout(function() {
				$win_root.hide();
				
				if(opts.modal) {
					var modalOpts = (opts.modalIndex > 0) ? { index: opts.modalIndex } : {};
					ui_modal = modal(self.selector, $.extend({ autoHide: false }, modalOpts));
				}
			}, 10);
			
			return this;
		}
		
		this.hide = function() {
			if(ui_modal) ui_modal.hide();
			else info.$root.hide();
			
			this.emit("hide");
			this.type = "hide";
		}
		
		this.show = function(x, y) {
			if(ui_modal) ui_modal.show();
			else info.$root.show();
			
			if(x || y) this.move(x, y);
			
			this.emit("show");
			this.type = "show";
		}
		
		this.move = function(x, y) {
			info.$root.css("left", x);
			info.$root.css("top", y);
		}
		
		this.update = function(html) {
			info.$body.empty().html(html);
		}
		
		this.setTitle = function(html) {
			info.$head.find(".title").empty().html(html);
		}
		
		this.setSize = function(w, h) {
			info.$root.width(w);
			info.$root.height(h);
			
			setBodyResize();
		}
		
		this.resize = function() {
			setBodyResize();
		}
	}
	
	return UI;
});
jui.define('uix.xtable', [ 'util', 'ui.modal' ], function(_, modal) {
	
	/**
	 * Common Logic
	 * 
	 */
	_.resize(function() {
		var call_list = jui.get("xtable");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i].list;
			
			for(var j = 0; j < ui_list.length; j++) {
				ui_list[j].resize();
			}
		}
	}, 1000);
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var head = null, body = null;
		var rows = [], o_rows = null;
		var page = 1, p_type = null;
		var ui_modal = null, is_loading = false;
		
		
		/**
		 * Private Methods
		 * 
		 */
		function createTableList(self) { // 2
			var exceptOpts = [ "buffer", "bufferCount", "csvCount", "sortLoading", "sortCache", "sortIndex", "sortOrder", "event", "rows" ];
			
			body = jui.create("table", $(self.root).children("table"), getExceptOptions(self, exceptOpts.concat("resize"))); // 바디 테이블 생성
			setTableBodyStyle(self, body); // X-Table 생성 및 마크업 설정
			
			head = jui.create("table", $(self.root).children("table.head"), getExceptOptions(self, exceptOpts)); // 헤더 테이블 생성
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
			}
			
			function setTableBodyStyle(self, body) {
				var $table =  $(body.root).clone(),
					cols = body.listColumn();
				
				// X-Table 바디 영역 스크롤 높이 설정
				if(self.options.buffer != "page") 
					$(body.root).wrap("<div class='body' style='max-height: " + self.options.scrollHeight + "px'></div>");
				else
					$(body.root).wrap("<div class='body'></div>");
				
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
				$(self.root).prepend($("<div></div>").outerHeight($table.height()));
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
			
			$body.unbind("scroll").scroll(function(e) {
			    if((this.scrollTop + self.options.scrollHeight) >= $body.get(0).scrollHeight) {
		    		self.next();
			    	self.emit("scroll", e);
			    	
			    	return false;
			    }
			});
		}
		
		function setFilteredData(self, name, callback) {
			if(o_rows == null) o_rows = rows;
			else rows = o_rows;
			
			var t_rows = rows.slice(),
				s_rows = [];
				
			for(var i = 0, len = t_rows.length; i < len; i++) {
				if(callback(t_rows[i][name])) {
					s_rows.push(t_rows[i]);
				}
			}
			
			self.update(s_rows);
			self.emit("filter", [ s_rows ]);
		}
		
		function resetFilteredData(self) {
			if(o_rows != null) {
				self.update(o_rows);
				
				o_rows = null;
			}
		}
		
		function setColumnWidthAuto(self) {
			var columns = head.listColumn();
			
			for(var i = 0; i < columns.length; i++) {
				if(columns[i].width == null) {
					$(columns[i].element).outerWidth("auto");
				}
			}
		}
		

		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			var MAX = 2500, DELAY = 70;
			
			function animateUpdate(self, rows, style) {
				var ms = MAX - 1;
				
				for(var i = 0; i < rows.length; i++) {
					ms = (ms < MAX) ? (i + 1) * DELAY : MAX;
					
					$(rows[i].element).addClass(style)
					.css({
						"animation-duration":  ms + "ms"
					});
					
					(function(index) {
						self.addEvent(rows[index].element, 'AnimationEnd', function() {
							$(rows[index].element).removeClass(style);
						});
					})(i);
				}
			}
			
			return {
				options: {
					fields: null,
					csv: null,
					csvNames: null,
					csvCount: 10000,
					rows: [],
					colshow: false,
					expand: false,
					resize: false, 
					scrollHeight: 200, // xtable 전용 옵션
					buffer: "scroll",
					bufferCount: 100,
					sort: false,
					sortLoading: false,
					sortCache: false,
					sortIndex: null,
					sortOrder: "asc",
					animate: false
				},
				valid: {
					select: [ [ "integer", "string" ] ],
					update: [ "array" ],
					page: [ "integer" ],
					sort: [ [ "integer", "string" ], [ "string", "undefined" ], [ "object", "undefined" ], [ "boolean", "undefined" ] ],
					filter: [ [ "integer", "string" ], [ "integer", "string", "boolean" ], "function" ],
					height: [ "integer" ],
					getColumn: [ [ "integer", "string" ] ],
					getData: [ [ "integer", "string" ] ],
					showColumn: [ [ "integer", "string" ] ],
					hideColumn: [ [ "integer", "string" ] ],
					initColumns: [ "array" ],
					columnMenu: [ "integer" ],
					showExpand: [ [ "integer", "string" ], "object" ],
					hideExpand: [ [ "integer", "string" ] ],
					showLoading: [ "integer" ],
					setCsv: [ "string" ],
					setCsvFile: [ "object" ],
					rowFunc: [ "string", [ "integer", "string" ], "function" ]
				},
				animate: {
					update: {
						after: function() {
							if(!_.browser.webkit && !_.browser.mozilla) return;
							animateUpdate(this, this.list(), "fadeInLeft");
						}
					},
					page: {
						after: function() {
							animateUpdate(this, this.list(), (p_type == "next") ? "fadeInLeft" : "fadeInRight");
						}
					},
					reset: {
						before: function() {
							var rows = this.list(),
								m = 2000,
								d = ((m / rows.length) < 50) ? 50 : (m / rows.length);
							
							for(var i = 0; i < rows.length; i++) {
								m -= d;
								
								$(rows[i].element).addClass("fadeOutRight")
								.css({
									"animation-duration":  ((m > 0) ? m : 50) + "ms",
									"animation-fill-mode": "both"
								});
							}
						},
						delay: 1000
					},
					filter: {
						after: function() {
							animateUpdate(this, this.list(), "flipInX");
						}
					}
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
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
			if(opts.rows) {
				this.update(opts.rows);
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
			
			return this;
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
			if(!this.options.fields || !this.options.sort) return;
			
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
		    	
    			if(!isNaN(value) && value != null) {
    				return parseInt(value);
    			} 
    			
    			if(typeof(value) == "string") {
    				return value.toLowerCase();
    			}
    			
    			return "";
		    }
		}
		
		this.filter = function(index, keyword, callback) { // filter (=포함), keyword가 null일 경우에는 롤백
			if(!this.options.fields) return;

			var column = head.getColumn(index);
			resetFilteredData(this);
			
			if(column.name && keyword) {
				setFilteredData(this, column.name, function(target) {
					if(typeof(callback) == "function") {
						if(callback(target, keyword))
							return true;
					} else {
						if(("" + target).indexOf(("" + keyword)) != -1)
							return true;
					}
					
					return false;
				});
			} else {
				this.emit("filter", [ rows ]);
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
		
		this.columnMenu = function(x) {
			head.columnMenu(x);
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
			if(!this.options.fields && !this.options.csv) return;
			
			var fields = _.getCsvFields(this.options.fields, this.options.csv);
			this.update(_.csvToData(fields, csv));
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
	}
	
	return UI;
});