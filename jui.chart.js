(function(exports, $) {
	var global = { jquery: $ }, globalFunc = {};

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
	var utility = global["util.base"] = {
			
		//-- Properties
		browser: {
			webkit: (typeof window.webkitURL != 'undefined') ? true : false,
			mozilla: (typeof window.mozInnerScreenX != 'undefined') ? true : false,
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
			ctor.prototype = new superCtor;
			ctor.prototype.constructor = ctor;
            ctor.prototype.parent = ctor.prototype;
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
        deepClone: function(obj) {
            var value = '';

            if (this.typeCheck('array', obj)) {
                value = [];

                for(var i = 0, len = obj.length; i < len; i++) {
                    value[i] = this.deepClone(obj[i]);
                }
            } else if (this.typeCheck("date", obj)) {
                value = obj;
            } else if (this.typeCheck("object", obj)) {
                value = {};

                for(var key in obj) {
                    value[key] = this.deepClone(obj[key]);
                }

            } else {
                value = obj;
            }

            return value ;
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
					"object": (typeof(value) == "object" && value !== null) ? true : false,
					"function": (typeof(value) == "function") ? true : false,
					"array": (value != null && typeof(value) == "object" && typeof(value.length) == "number") ? true : false,
					"boolean"	: (typeof(value) == "boolean") ? true : false, 
					"undefined": (typeof(value) == "undefined") ? true: false,
					"null": (value === null) ? true : false,
                    "date": (typeof(value) == "object" && value !== null && typeof(value.getTime) == "function") ? true : false
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
		getCsvFields: function(fields, csvFields) {
			var tmpFields = (this.typeCheck("array", csvFields)) ? csvFields : fields;
			
			for(var i = 0; i < tmpFields.length; i++) {
				if(!isNaN(tmpFields[i])) {
					tmpFields[i] = fields[tmpFields[i]];
				}
			}
			
			return tmpFields;
		},
        svgToBase64: function(xml) {
            return "data:image/svg+xml;base64," + Base64.encode(xml);
        },
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
        btoa: Base64.encode,
        atob: Base64.decode
	}


    /**
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
	 * Global Object
	 * 
	 */
	exports.jui = {
		
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
         * 사용자가 실제로 사용할 수 있는 UI 클래스를 정의
         *
         * @param name 모듈 로드와 상속에 사용될 이름을 정한다.
         * @param depends 'define'이나 'defineUI'로 정의된 클래스나 객체를 인자로 받을 수 있다.
         * @param callback UI 클래스를 해당 콜백 함수 내에서 클래스 형태로 구현하고 리턴해야 한다.
         * @param parent 'depends'와 달리 'define'으로 정의된 클래스만 상속받을 수 있다.
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
         * UI 클래스에서 사용될 클래스를 정의하고, 자유롭게 상속할 수 있는 클래스를 정의
         *
         * @param name 모듈 로드와 상속에 사용될 이름을 정한다.
         * @param depends 'define'이나 'defineUI'로 정의된 클래스나 객체를 인자로 받을 수 있다.
         * @param callback UI 클래스를 해당 콜백 함수 내에서 클래스 형태로 구현하고 리턴해야 한다.
         * @param parent 'depends'와 달리 'define'으로 정의된 클래스만 상속받을 수 있다.
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
         * define과 defineUI로 정의된 클래스 또는 객체를 가져온다.
         *
         * @param name 가져온 클래스 또는 객체의 이름
         * @returns {*}
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
         * @returns {Array}
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
         * @returns {Window}
         */
		log: function(logUrl) {
			var jui_mng = window.open(
				logUrl || "tool/debug.html",
				"JUIM",
				"width=1024, height=768, toolbar=no, menubar=no, resizable=yes"
			);

			jui.debugAll(function (log, str) {
				jui_mng.log(log, str);
			});

			return jui_mng;
		}
	};
})(window, jQuery || $);
jui.define("core", [ "jquery", "util.base" ], function($, _) {
	
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

			if(_.typeCheck("integer", key)) {
				return instances[key];
			} else if(_.typeCheck("string", key)) {
				for(var i = 0; i < instances.length; i++) {
					if(key == instances[i].type) {
						result.push(instances[i]);
					} else { // @Deprecated 그룹이 정해져 있지 않을 경우
                        if(instances[i].type.indexOf("." + key) != -1) {
                            result.push(instances[i]);
                        }
                    }
				}
			}
			
			return result;
		}
		
		this.getAll = function() {
			return instances;
		}

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
			if(_.typeCheck("integer", key)) {
				return classes[key];
			} else if(_.typeCheck("string", key)) {
				for(var i = 0; i < classes.length; i++) {
					if(key == classes[i].type) {
                        return classes[i];
					} else { // @Deprecated 그룹이 정해져 있지 않을 경우
                        if(classes[i].type.indexOf("." + key) != -1) {
                            return classes[i];
                        }
                    }
				}
			}
			
			return null;
		}
		
		this.getClassAll = function() {
			return classes;
		}

        /**
         * UI 객체 동적 생성 메소드
         *
         * @param type
         * @param selector
         * @param options
         * @returns {*}
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
                        $(e.target).unbind(e.type);
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
    var UICoreSet = function(type, list, selector, options) {

        this.type = type;
        this.list = list;
        this.selector = selector;
        this.options = options;

        this.destroy = function() {
            for(var i = 0; i < this.list.length; i++) {
                this.list[i].destroy();
            }
        }
    }
	
	
	/** 
	 * 각각의 UI별 공통 메소드 (메모리 공유)
	 * 예를 들어 테이블 UI 객체일 경우에 해당되는 모든 요소는 UI 객체에 공유된다.
	 */
	var UICore = function() {
        var vo = null;

        /**
         * 커스텀 이벤트 발생시키는 메소드
         *
         * @param type 발생시킬 이벤트
         * @param args 이벤트 핸들러에 넘기는 값
         * @param _unique 내부적으로 사용하며, on 이벤트인지 bind 이벤트인지 구분
         * @param _result 내부적으로 사용하며, 리턴 값은 커스텀 이벤트의 핸들러 값
         * @returns {*} 커스텀 이벤트의 핸들러의 리턴 값 또는 undefined
         */
        this.emit = function(type, args, _unique, _result) {
            var unique = (!_unique) ? false : true;

            for(var i = 0; i < this.event.length; i++) {
                var e = this.event[i];

                if(e.type == type.toLowerCase() && e.unique === unique) {
                    if(typeof(args) == "object" && args.length != undefined) {
                        _result = e.callback.apply(this, args);
                    } else {
                        _result = e.callback.call(this, args);
                    }
                }
            }

            if(unique === false) {
                return this.emit(type, args, true, _result);
            }

            return _result;
        }

        this.on = function(type, callback) {
            if(typeof(type) != "string" && typeof(callback) != "object") return;
            this.event.push({ type: type.toLowerCase(), callback: callback, unique: false  });
        }

        this.bind = function(type, callback) {
            if(typeof(type) != "string" && typeof(callback) != "object") return;

            this.unbind(type);
            this.event.push({ type: type.toLowerCase(), callback: callback, unique: true });
        }

        this.unbind = function(type) {
            var event = [];

            for(var i = 0; i < this.event.length; i++) {
                var e = this.event[i];

                if (e.type != type.toLowerCase() || e.unique === false)
                    event.push(e);
            }

            this.event = event;
        }

        this.addEvent = function() {
            this.listen.add(arguments);
        }

        this.addTrigger = function(selector, type) {
            this.listen.trigger(selector, type);
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

        this.destroy = function() {
            if(!this.__proto__) return;

            for(var i = 0; i < this.listen.size(); i++) {
                var obj = this.listen.get(i);
                obj.target.unbind(obj.type);
            }

            for(var key in this.__proto__) {
                delete this.__proto__[key];
            }
        }
	};

    UICore.build = function(UI) {

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
            var $root = $(selector);
            var list = [],
                defOpts = _.typeCheck("function", UI["class"].setup) ? UI["class"].setup() : {};

            $root.each(function(index) {
                var mainObj = new UI["class"]();

                // Check Options
                if(_.typeCheck("object", defOpts)) {
                    checkedOptions(defOpts, options);
                }

                // Options Setting
                var opts = $.extend(true, defOpts, options);
                    opts.tpl = _.typeCheck("object", opts.tpl) ? opts.tpl : {};

                // Public Properties
                mainObj.init.prototype = mainObj;
                mainObj.init.prototype.selector = $root.selector;
                mainObj.init.prototype.root = this;
                mainObj.init.prototype.options = opts;
                mainObj.init.prototype.tpl = {};
                mainObj.init.prototype.event = new Array(); // Custom Event
                mainObj.init.prototype.listen = new UIListener(); // DOM Event
                mainObj.init.prototype.timestamp = new Date().getTime();
                mainObj.init.prototype.index = ($root.size() == 0) ? null : index;
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
                if(_.typeCheck("object", opts.tpl)) {
                    for(var name in opts.tpl) {
                        var tplHtml = opts.tpl[name];

                        if(_.typeCheck("string", tplHtml) && tplHtml != "") {
                            mainObj.init.prototype.tpl[name] = _.template(tplHtml);
                        }
                    }
                }

                var uiObj = new mainObj.init();

                // Event Setting
                if(_.typeCheck("object", uiObj.options.event)) {
                    for(var key in uiObj.options.event) {
                        uiObj.on(key, uiObj.options.event[key]);
                    }
                }

                list[index] = uiObj;
            });

            // UIManager에 데이터 입력
            UIManager.add(new UICoreSet(UI.type, list, selector, options));

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
	
	// UIManager는 Global 객체로 정의
	window.jui = (typeof(jui) == "object") ? $.extend(jui, UIManager) : UIManager;
	
	return UICore;
});
jui.define("util.math", [], function() {

	/**
	 * math 객체 
	 *  
	 */
	var self = {
		// 2d rotate
		rotate : function(x, y, radian) {
			return {
				x : x * Math.cos(radian) - y * Math.sin(radian),
				y : x * Math.sin(radian) + y * Math.cos(radian)
			}
		},

		// degree to radian
		radian : function(degree) {
			return degree * Math.PI / 180;
		},
		
		// radian to degree 
		degree : function(radian) {
			return radian * 180 / Math.PI;
		},

		// 중간값 계산 하기 
		interpolateNumber : function(a, b) {
			return function(t) {
				return a + (b - a) * t;
			}
		},

		// 중간값 round 해서 계산하기
		interpolateRound : function(a, b) {
			var f = this.interpolateNumber(a, b);

			return function(t) {
				return Math.round(f(t));
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
	 * 범위(scale)에 대한 계산 
	 * 
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
					if ( typeof _range[t] != 'undefined') {
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
				var start = func.min();
				var end = func.max();

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

			function func(x) {
				var index = -1;
				var target;
				

				
				for (var i = 0, len = _domain.length; i < len; i++) {

					if (i == len - 1) {
              if (x == _domain[i]) {
                index = i;
                break;
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

          // 최대 최소 체크
					if (_domain.length - 1 == index) {
						return _range[index];
					} else if (index == -1) {    // 값의 범위를 넘어갔을 때 
					  
					  var max = func.max();
					  var min = func.min();
					  
					  if (max < x) {
					    
              if (_isClamp) return max;					    
					    
					    var last = _domain[_domain.length -1];
					    var last2 = _domain[_domain.length -2];
					    
					    var rlast = _range[_range.length -1];
					    var rlast2 = _range[_range.length -2];
					    
					    var distLast = Math.abs(last - last2);
					    var distRLast = Math.abs(rlast - rlast2);
					    
					    return rlast + Math.abs(x - max) * distRLast / distLast; 
					    
					  } else if (min > x) {
					    
					    if (_isClamp) return min;
					    
              var first = _domain[0];
              var first2 = _domain[1];
              
              var rfirst = _range[0];
              var rfirst2 = _range[1];
              
              var distFirst = Math.abs(first - first2);
              var distRFirst = Math.abs(rfirst - rfirst2);
              
              return rfirst - Math.abs(x - min) * distRFirst / distFirst;					    
					  }
					  
						return _range[_range.length - 1];
					} else {

						var min = _domain[index];
						var max = _domain[index+1];

						var minR = _range[index]; 
						var maxR = _range[index + 1];

						var pos = (x - min) / (max - min);

						var scale = _isRound ? math.interpolateRound(minR, maxR) : math.interpolateNumber(minR, maxR);

						return scale(pos);

					}
				}

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

				return this;
			}

			func.range = function(values) {

				if (!arguments.length) {
					return _range;
				}

				for (var i = 0; i < values.length; i++) {
					_range[i] = values[i];
				}

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

				return arr;
			}

			return func;
		}
	}

	return self;
});

jui.define("util.color", [], function() {

	/**
	 * color 객체 
	 *  
	 */
	var self = {
		
		regex  : /(linear|radial)\((.*)\)(.*)/i,
		
		trim : function (str) {
			return (str || "").replace(/^\s+|\s+$/g, '');	
		},

		parse : function(color) {
			return this.parseGradient(color);
		},
		
		/**
		 * gradient parser 
		 * 
		 * ex)
		 * 
		 * linear(left) #fff,#000
		 * linear(right) #fff,50 yellow,black
		 * radial(50%,50%,50%,50,50)
		 *  
 		 * @param {Object} color
		 */
		parseGradient : function(color) {
			var matches = color.match(this.regex);
			
			if (!matches) return color; 
			
			var type = this.trim(matches[1]);
			var attr = this.parseAttr(type, this.trim(matches[2]));
			var stops = this.parseStop(this.trim(matches[3]));
			
			var obj = { type : type };
			
			for(var k in attr) {
				obj[k] = attr[k];
			}
			
			obj.stops = stops;
			
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
					stops.push({ "stop-color" : arr[0] })
				} else if (arr.length == 2) {
					stops.push({ "offset" : arr[0], "stop-color" : arr[1] })
				} else if (arr.length == 3) {
					stops.push({ "offset" : arr[0], "stop-color" : arr[1], "stop-opacity" : arr[2] })
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
            this.attributes = {};
            this.styles = {};

            // 기본 속성 설정
            this.attr(attr);
        }
        
        this.each = function(callback) {
            if(typeof(callback) != "function") return;

            for(var i = 0; i < this.childrens.length; i++) {
                var self = this.childrens[i];
                callback.apply(self, [ i, self ]);
            }

            return this.childrens;
        }

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
        	if(elem.parent) {
        		elem.remove();	
        	}
        	
            this.childrens.push(elem);
            elem.parent = this;

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
            for(var k in attr) {
                this.attributes[k] = attr[k];
            }

            for(var k in this.attributes) {
                if(k.indexOf("xlink:") != -1) {
                    this.element.setAttributeNS("http://www.w3.org/1999/xlink", k, this.attributes[k]);
                } else {
                    this.element.setAttributeNS(null, k, this.attributes[k]);
                }
            }

            return this;
        }

        this.css = function(css) {
            var list = [];

            for(var k in css) {
                this.styles[k] = css[k];
            }

            for(var k in this.styles) {
                list.push(k + ":" + this.styles[k]);
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
    }

    return Element;
});

jui.define("util.svg.element.transform", [], function() { // polygon, polyline
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

        this.rotate = function() {
            orders["rotate"] = "rotate(" + getStringArgs(arguments) + ")";
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
    }

    return TransElement;
}, "util.svg.element");

jui.define("util.svg.element.path", [], function() { // path
    var PathElement = function() {
        var orders = [];

        function applyOrders(self) {
            if(orders.length == 0) return;
            self.attr({ d: orders.join(" ") });
        }

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
            applyOrders(this);
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

    return PathElement;
}, "util.svg.element.transform");

jui.define("util.svg.element.poly", [], function() { // polygon, polyline
    var PolyElement = function() {
        var orders = [];

        function applyOrders(self) {
            if(orders.length == 0) return;
            self.attr({ points: orders.join(" ") });
        }

        this.point = function(x, y) {
            orders.push(x + "," + y);
            return this;
        }

        this.join = function() {
            if(orders.length > 0) { // Firefox 처리
                var start = orders[0];
                orders.push(start);
            }

            applyOrders(this);
        }
    }

    return PolyElement;
}, "util.svg.element.transform");

jui.define("util.svg",
    [ "util.base", "util.math", "util.svg.element", "util.svg.element.transform",
        "util.svg.element.path", "util.svg.element.poly" ],
    function(_, math, Element, TransElement, PathElement, PolyElement) {

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
            for(var i = 0; i < target.childrens.length; i++) {
                var child = target.childrens[i];

                if(child) {
                    if (child.parent == target) {
                        target.element.appendChild(child.element);
                    }

                    if (child.join) { // PathElement & PolyElement auto join
                        child.join();
                    }

                    if (child.childrens.length > 0) {
                        appendAll(child);
                    }
                }
            }
        }

        /**
         * 일반 메소드
         *
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

        this.reset = function(isAll) {
            this.clear(isAll);
            main.childrens = [];

            if(isAll === true) {
                sub.childrens = [];
            }
        }

        this.render = function(isAll) {
            this.clear();

            if(isFirst === false || isAll === true) {
                appendAll(root);
            } else {
                appendAll(main);
            }

            isFirst = true;
        }

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
        
        this.toXml = function() {
            var text = rootElem.innerHTML;

            text = text.replace('xmlns="http://www.w3.org/2000/svg"', '');

            return [
                '<?xml version="1.0" encoding="utf-8"?>',
                text.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
            ].join("\n");
        }
        
        this.toDataURL = function(type, callback) {
            type = type || "image/svg+xml";

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

        this.autoRender = function(elem, isAuto) {
            if(depth > 0) return;

            if(!isAuto) {
                sub.append(elem);
            } else {
                main.append(elem);
            }
        }
        
        this.getTextRect = function(text) {
        	var el = this.text({ 'class' : 'dummy', x : -100, y : -100 }, text);

        	root.element.appendChild(el.element);
        	var rect = el.element.getBoundingClientRect();
        	$(el.element).remove();
        	
        	return { width : rect.width, height : rect.height }; 
        }

        /**
         * 엘리먼트 생성 메소드
         *
         */

        this.custom = function(name, attr, callback) {
            return create(new Element(), name, attr, callback);
        }

        this.defs = function(callback) {
            return create(new Element(), "defs", null, callback);
        }

        this.symbol = function(attr, callback) {
            return create(new Element(), "symbol", attr, callback);
        }

        this.g = this.group = function(attr, callback) {
            return create(new TransElement(), "g", attr, callback);
        }

        this.marker = function(attr, callback) {
            return create(new Element(), "marker", attr, callback);
        }

        this.a = function(attr, callback) {
            return create(new TransElement(), "a", attr, callback);
        }

        this.switch = function(attr, callback) {
            return create(new Element(), "switch", attr, callback);
        }

        this.use = function(attr) {
            return create(new Element(), "use", attr);
        }

        this.rect = function(attr, callback) {
            return create(new TransElement(), "rect", attr, callback);
        }

        this.line = function(attr, callback) {
            return create(new TransElement(), "line", attr, callback);
        }

        this.circle = function(attr, callback) {
            return create(new TransElement(), "circle", attr, callback);
        }

        this.text = function(attr, textOrCallback) {
            if(_.typeCheck("string", textOrCallback)) {
                return create(new TransElement(), "text", attr).text(textOrCallback);
            }

            return create(new TransElement(), "text", attr, textOrCallback);
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

    return SVG;
});
jui.define("util.svg3d", [ "util.base", "util.math", "util.svg" ], function(_, math, SVGUtil) {
    var SVG = function(rootElem, rootAttr) {
        var svg = null;

        function init() {
            svg = new SVGUtil(rootElem, rootAttr);
        }

        /**
         * 일반 메소드
         *
         */

        this.size = function() {
            return svg.size();
        }

        this.clear = function(isAll) {
            return svg.clear(isAll);
        }

        this.reset = function(isAll) {
            return svg.reset(isAll);
        }

        this.render = function(isAll) {
            return svg.render(isAll);
        }

        /**
         * 엘리먼트 생성 메소드 (3D)
         *
         */

        this.rect3d = function(attr) {
            var radian = math.radian(attr.degree),
                x1 = 0, y1 = 0,
                w1 = attr.width, h1 = attr.height;

            var x2 = (Math.cos(radian) * attr.depth) + x1,
                y2 = (Math.sin(radian) * attr.depth) + y1;

            var w2 = attr.width + x2,
                h2 = attr.height + y2;

            var g = svg.group({
                width: w2,
                height: h2
            }, function() {
                delete attr.width, attr.height, attr.degree, attr.depth;

                svg.path(attr)
                    .MoveTo(x2, x1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2)
                    .LineTo(x1, y2);

                svg.path(attr)
                    .MoveTo(x1, y2)
                    .LineTo(x1, h2)
                    .LineTo(w1, h2)
                    .LineTo(w1, y2)
                    .ClosePath();

                svg.path(attr)
                    .MoveTo(w1, h2)
                    .LineTo(w2, h1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2)
                    .ClosePath();
            });

            return g;
        }

        init();
    }

    return SVG;
});
jui.define("chart.draw", [ "jquery", "util.base" ], function($, _) {
	/**
	 * 그리기 Base 클래스
	 * 
	 * 
	 */
	var Draw = function() {

        function setupOptions(options, defOpts) {
            var exceptOpts = [
                    "type", "target", "index", "colors", // only brush
                    "x", "y", "x1", "y1", "c", "dist" // only grid
                ],
                defOptKeys = [],
                optKeys = [];

            // 사용자가 넘긴 옵션
            for(var key in options) {
                optKeys.push(key);
            }

            // 드로우 객체의 정의된 옵션
            for(var key in defOpts) {
                defOptKeys.push(key);

                if(_.typeCheck("undefined", options[key])) {
                    options[key] = defOpts[key];
                }
            }

            // 정의되지 않은 옵션 사용 유무 체크
            for(var i = 0; i < optKeys.length; i++) {
                var name = optKeys[i];

                if($.inArray(name, defOptKeys) == -1 && $.inArray(name, exceptOpts) == -1) {
                    throw new Error("JUI_CRITICAL_ERR: '" + name + "' is not an option in chart.draw");
                }
            }
        }
		
		/**
		 * 모든 Draw 객체는  render 함수를 통해서 그려진다. 
		 * 
		 */
		this.render = function() {
            if (!_.typeCheck("function", this.draw)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
            }

            // Call drawSetting method (Only brush and widget)
            if (_.typeCheck("function", this.drawSetup)) {
                var tmpOpts = this.drawSetup(),
                    opts = _.typeCheck("object", tmpOpts) ? tmpOpts : {};

                // Options Check
                setupOptions(this.grid || this.brush || this.widget, opts);
            }

            // Call drawBefore method (All)
            if (_.typeCheck("function", this.drawBefore)) {
                this.drawBefore();
            }

            // Call draw method (All)
			var obj = this.draw();

            if (!_.typeCheck("object", obj)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method should return the object");
            } else {
                if(this.brush) { // 브러쉬일 경우, 기본 좌표 설정
                    obj.translate(this.chart.x(), this.chart.y());
                }
            }

            return obj;
		}
	}

	return Draw;
});

jui.defineUI("chart.builder", [ "jquery", "util.base", "util.svg", "util.color" ], function($, _, SVGUtil, ColorUtil) {

    /**
     * Common Logic
     *
     */
    var win_width = 0;

    _.resize(function() {
        if(win_width == $(window).width()) return;

        var call_list = jui.get("chart.builder");
        for(var i = 0; i < call_list.length; i++) {
            var ui_list = call_list[i].list;

            for(var j = 0; j < ui_list.length; j++) {
                if(ui_list[j].options.width == "100%") {
                    ui_list[j].resize();
                }
            }
        }

        win_width = $(window).width();
    }, 300);

    /**
     * Chart Builder 구현
     *
     */
    var UI = function() {
        var _data = [], _page = 1, _start = 0, _end = 0;
        var _grid = {}, _brush = [], _widget = [], _scales = [], _hash = {};
        var _padding, _series, _area, _theme;


        /**
         * chart 기본 영역 계산
         *
         * padding 을 제외한 영역에서  x,y,x2,y2,width,height 속성을 구함
         *
         * 기본적으로 모든 브러쉬와 그리드는 계산된 영역안에서 그려짐
         *
         * @param {Object} self
         */
        function calculate(self) {
            var max = self.svg.size();

            var chart = {
                width: max.width - (_padding.left + _padding.right),
                height: max.height - (_padding.top + _padding.bottom),
                x: _padding.left,
                y: _padding.top
            };

            // chart 영역 계산
            chart.x2 = chart.x + chart.width;
            chart.y2 = chart.y + chart.height;

            _area = chart;
        }

        /**
         * draw 이전에 환경 셋팅
         *
         */
        function drawBefore(self) {
            // 데이타 설정 , deepClone 으로 기존 옵션 값에 영향을 주지 않음
            var series = _.deepClone(self.options.series),
                grid = _.deepClone(self.options.grid),
                brush = _.deepClone(self.options.brush),
                widget = _.deepClone(self.options.widget),
                series_list = [];

            // series 데이타 구성
            for (var i = 0, len = _data.length; i < len; i++) {
                var row = _data[i];

                for (var key in row) {
                    var obj = series[key] || {},
                        value = row[key],
                        range = null;

                    if (value instanceof Array) {
                        range = { max : Math.max.apply(Math, value), min : Math.min.apply(Math, value) }
                    } else {
                        range = { max : +value, min : +value }
                    }

                    obj.data = obj.data || [];
                    obj.min = typeof obj.min == 'undefined' ? 0 : obj.min;
                    obj.max = typeof obj.max == 'undefined' ? 0 : obj.max;
                    obj.data[i] = value;

                    if (range.min < obj.min) {
                        obj.min = range.min;
                    }

                    if (range.max > obj.max) {
                        obj.max = range.max;
                    }

                    // 시리즈 데이터 설정
                    series[key] = obj;
                }
            }

            // series_list
            for (var key in series) {
                series_list.push(key);
            }

            _brush = createBrushData(brush, series_list);
            _widget = createBrushData(widget, series_list);
            _series = series;
            _grid = grid;

            // hash code 삭제
            _hash = {};
        }

        /**
         * svg 기본 defs element 생성
         *
         */
        function drawDefs(self) {
            // draw defs
            var defs = self.svg.defs();

            // default clip path
            self.clipId = self.createId('clip-id');

            var clip = self.svg.clipPath({
                id: self.clipId
            });

            clip.append(self.svg.rect({
                x: 0,
                y: 0,
                width: self.width(),
                height: self.height()
            }));
            defs.append(clip);

            self.defs = defs;
        }

        /**
         * grid 그리기
         *
         * 설정된 grid 객체를 통해서
         *
         * x(bottom), y(left), x1(top), y1(right)
         *
         * 의 방향으로 grid 를 생성
         *
         */
        function drawGrid(self) {
            var grid = self.grid();

            if (grid != null) {
                if (grid.type) {
                    grid = {
                        c: grid
                    };
                }

                for (var k in grid) {
                    var orient = 'custom';

                    if (k == 'x')
                        orient = 'bottom';
                    else if (k == 'x1')
                        orient = 'top';
                    else if (k == 'y')
                        orient = 'left';
                    else if (k == 'y1')
                        orient = 'right';

                    if (!_scales[k]) {
                        _scales[k] = [];
                    }

                    if (!_.typeCheck("array", grid[k])) {
                        grid[k] = [grid[k]];
                    }

                    for (var keyIndex = 0, len = grid[k].length; keyIndex < len; keyIndex++) {
                        var Grid = jui.include("chart.grid." + (grid[k][keyIndex].type || "block"));

                        // 브러쉬&위젯 기본 프로퍼티 정의
                        Grid.prototype.chart = self;
                        Grid.prototype.grid = grid[k][keyIndex];

                        var obj = new Grid(orient, self, grid[k][keyIndex]).render(),
                            dist = grid[k][keyIndex].dist || 0;

                        // grid 별 dist 로 위치선정하기
                        if (k == 'y') {
                            obj.root.translate(self.x() - dist, self.y());
                        } else if (k == 'y1') {
                            obj.root.translate(self.x2() + dist, self.y());
                        } else if (k == 'x') {
                            obj.root.translate(self.x(), self.y2() + dist);
                        } else if (k == 'x1') {
                            obj.root.translate(self.x(), self.y() - dist);
                        }

                        _scales[k][keyIndex] = obj.scale
                    }
                }
            }
        }

        /**
         * brush 그리기
         *
         * brush 에 맞는 x, y 축(grid) 설정
         *
         */
        function drawBrush(self, type) {
            var draws = (type == "brush") ? _brush : _widget;

            if (draws != null) {
                for (var i = 0; i < draws.length; i++) {
                    var Obj = jui.include("chart." + type + "." + draws[i].type);

                    // 그리드 축 설정
                    setGridAxis(draws[i]);
                    draws[i].index = i;

                    // 브러쉬&위젯 기본 프로퍼티 정의
                    Obj.prototype.chart = self;
                    Obj.prototype[type] = draws[i];

                    // 브러쉬&위젯 엘리먼트 생성 및 후처리
                    if (type == "widget") {
                        var draw = new Obj(self, draws[i]),
                            elem = draw.render();

                        if(!draw.isRender()) {
                            self.svg.autoRender(elem, false);
                        }
                    } else {
                        new Obj(self, draws[i]).render();
                    }
                }
            }
        }

        /**
         * Brush 옵션을 가공하여, 실제 사용되는 객체를 만든다.
         * Widget도 같이 사용한다.
         *
         * @param draws
         * @param series_list
         * @returns {*}
         */
        function createBrushData(brush, series_list) {
            if(_.typeCheck("array", brush)) {
                for (var i = 0; i < brush.length; i++) {
                    var b = brush[i];

                    if (!b.target) {
                        b.target = series_list;
                    } else if (typeof b.target == 'string') {
                        b.target = [b.target];
                    }
                }
            }

            return brush;
        }

        /**
         * 브러쉬와 위젯의 그리드 객체 설정
         *
         * @param draw
         * @param drawObj
         */
        function setGridAxis(draw) {
            if (_scales.x || _scales.x1) {
                if (!_scales.x && _scales.x1) {
                    _scales.x = _scales.x1;
                }

                if (!_.typeCheck("function", draw.x)) {
                    draw.x = ( typeof draw.x1 !== 'undefined') ? _scales.x1[draw.x1 || 0] : _scales.x[draw.x || 0];
                }
            }
            if (_scales.y || _scales.y1) {
                if (!_scales.y && _scales.y1) {
                    _scales.y = _scales.y1;
                }

                if (!_.typeCheck("function", draw.y)) {
                    draw.y = ( typeof draw.y1 !== 'undefined') ? _scales.y1[draw.y1 || 0] : _scales.y[draw.y || 0];
                }
            }
            if (_scales.c) {
                if (!_.typeCheck("function", draw.c)) {
                    draw.c = _scales.c[draw.c || 0];
                }
            }
        }

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
            $(self.root).on("selectstart", function(e) {
                e.preventDefault();
                return false;
            });

            function checkPosition(e) {
                var pos = $(self.root).offset(),
                    offsetX = e.pageX - pos.left,
                    offsetY = e.pageY - pos.top;

                e.bgX = offsetX;
                e.bgY = offsetY;
                e.chartX = offsetX - self.padding("left");
                e.chartY = offsetY - self.padding("top");

                if (e.chartX < 0)
                    return;
                if (e.chartX > self.width())
                    return;
                if (e.chartY < 0)
                    return;
                if (e.chartY > self.height())
                    return;

                return true;
            }
        }

        function createGradient(self, obj, hashKey) {
            if (typeof hashKey != 'undefined' && _hash[hashKey]) {
                return "url(#" + _hash[hashKey] + ")";
            }

            var id = self.createId('gradient');

            obj.id = id;
            var g;
            if (obj.type == 'linear') {
                g = self.svg.linearGradient(obj);
            } else if (obj.type == 'radial') {
                g = self.svg.radialGradient(obj);
            }

            for (var i = 0; i < obj.stops.length; i++) {
                g.append(self.svg.stop(obj.stops[i]));
            }

            self.defs.append(g);

            if (typeof hashKey != 'undefined') {
                _hash[hashKey] = id;
            }

            return "url(#" + id + ")";
        }

        function getColor(self, color) {
            if (_.typeCheck("object", color)) {
                return createGradient(self, color);
            }

            var parsedColor = ColorUtil.parse(color);
            if (parsedColor == color)
                return color;

            return createGradient(self, parsedColor, color);
        }

        function setThemeStyle() {
            if (arguments.length == 1) {
                _theme = $.extend(_theme, arguments[0]);
            } else if (arguments.length == 2) {
                _theme[arguments[0]] = arguments[1];
            }
        }

        function getBrushOption(brush) {
            if(brush == null) return;

            var result = null;

            if (_.typeCheck("string", brush)) {
                result = [{
                    type: brush
                }];
            } else if (!_.typeCheck("array", brush)) {
                result = [ brush ];
            } else {
                result = brush;
            }

            return result;
        }

        this.init = function() {
            var opts = this.options;

            // 패딩 옵션 설정
            if (opts.padding == "empty") {
                _padding = {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0
                };
            } else {
                _padding = opts.padding;
            }

            // 차트 브러쉬/위젯 기본값 설정
            opts.brush = getBrushOption(opts.brush);
            opts.widget = getBrushOption(opts.widget);

            // 차트 테마 설정
            setThemeStyle(jui.include("chart.theme." + opts.theme));

            // 차트 테마 스타일 설정
            if (opts.style) {
                setThemeStyle(opts.style);
            }

            // UI 바인딩 설정
            if (opts.bind) {
                this.bindUI(opts.bind);
            }

            // svg 기본 객체 생성
            this.svg = new SVGUtil(this.root, {
                width: opts.width,
                height: opts.height
            });

            // 데이터 업데이트 및 커스텀 이벤트 발생
            this.update();
            this.emit("load");

            // 차트 배경 이벤트
            setChartEvent(this);
        }

        /**
         * 차트 영역 데이터 반환
         *
         * @returns {*}
         */
        this.width = function() {
            return _area.width;
        }
        this.height = function() {
            return _area.height;
        }
        this.x = function() {
            return _area.x;
        }
        this.y = function() {
            return _area.y;
        }
        this.x2 = function() {
            return _area.x2;
        }
        this.y2 = function() {
            return _area.y2;
        }

        /**
         * padding 옵션 리턴
         *
         * @param {string} key
         *
         */
        this.padding = function(key) {
            if (_padding[key]) {
                return _padding[key];
            }

            return _padding;
        }

        this.color = function(i, brush) {
            var color;

            // 테마 & 브러쉬 옵션 컬러 설정
            if (_.typeCheck("array", brush.colors)) {
                color = brush.colors[i];
            } else {
                var c = _theme["colors"];
                color = (i > c.length - 1) ? c[c.length - 1] : c[i];
            }

            // 시리즈 컬러 설정
            if(_.typeCheck("array", brush.target)) {
                var series = _series[brush.target[i]];

                if(series && series.color) {
                    color = series.color;
                }
            }

            if (_hash[color]) {
                return "url(#" + _hash[color] + ")";
            }

            return getColor(this, color);
        }

        /**
         * 현재 text 관련 theme 가 정해진 text element 생성
         *
         * @param {object} attr
         * @param {string|function} textOrCallback
         */
        this.text = function(attr, textOrCallback) {
            var el = this.svg.text(_.extend({
                "font-family": this.theme("fontFamily"),
                "font-size": this.theme("fontSize"),
                "fill": this.theme("fontColor")
            }, attr), textOrCallback);

            return el;
        }

        /**
         * theme 의 요소에 대한 값 구하기
         *
         * <code>
         *
         * // theme 전체 객체 얻어오기
         * var theme = chart.theme();
         *
         * // 부분 속성 얻어오기
         * var fontColor = chart.theme("fontColor");
         *
         * // 값 비교해서 얻어오기
         * chart.theme(isSelected, "selectedFontColor", "fontColor");  // isSelected 가 true 이면 selectedFontColor, 아니면 fontColor 리턴
         *
         *
         * </code>
         *
         *
         */
        this.theme = function(key, value, value2) {
            if (arguments.length == 0) {
                return _theme;
            } else if (arguments.length == 1) {
                if (_theme[key]) {
                    if (key.indexOf("Color") > -1 && _theme[key]) {
                        return getColor(this, _theme[key]);
                    } else {
                        return _theme[key];
                    }
                }
            } else if (arguments.length == 3) {
                var val = (key) ? value : value2;
                if (val.indexOf("Color") > -1 && _theme[val]) {
                    return getColor(this, _theme[val]);
                } else {
                    return _theme[val];
                }

            }
        }

        /**
         * series 옵션 리턴
         *
         * @param {string} key
         *
         */
        this.series = function(key) {
            if (_series[key]) {
                return _series[key];
            }

            return _series;
        }

        /**
         * grid 옵션 리턴
         *
         * @param {string} key
         *
         */
        this.grid = function(key) {
            if (_grid[key]) {
                return _grid[key];
            }

            return _grid;
        }

        /**
         * brush 옵션 리턴
         *
         * @param {string} key
         *
         */
        this.brush = function(key) {
            if (_brush[key]) {
                return _brush[key];
            }

            return _brush;
        }

        /**
         * data 옵션 리턴
         *
         * @param {integer} index
         *
         */
        this.data = function(index, field) {
            if (_data[index]) {

                if (typeof field != 'undefined') {
                    return _data[index][field];
                }

                return _data[index];
            }

            return _data;
        }

        /**
         * 브러쉬/위젯/그리드에서 공통적으로 사용하는 숫자 포맷 함수
         *
         * @param value
         */
        this.format = function(value) {
            var callback = this.options.format;

            if(_.typeCheck("function", callback)) {
                return callback(value) + "";
            }

            return value + "";
        }

        /**
         * chart 내에서 사용될 유일한 키 생성
         *
         * @param {string} key
         */
        this.createId = function(key) {
            return [key || "chart-id", (+new Date), Math.round(Math.random() * 100) % 100].join("-")
        }

        /**
         * jui component binding
         *
         * uix.table, uix.xtable 객체를 바인딩 해서 사용할 수 있음.
         *
         * 테이블 요소를 수정하면 chart의 data 속성으로 자동으로 설정
         *
         * @param {object} bind   uix.table, uix.xtable 객체 사용
         */
        this.bindUI = function(uiObj) {
            var self = this;

            if (uiObj.module.type == "uix.table") {
                uiObj.callAfter("update", updateTable);
                uiObj.callAfter("sort", updateTable);
                uiObj.callAfter("append", updateTable);
                uiObj.callAfter("insert", updateTable);
                uiObj.callAfter("remove", updateTable);
            } else if (uiObj.module.type == "uix.xtable") {
                uiObj.callAfter("update", updateXTable);
                uiObj.callAfter("sort", updateXTable);
            }

            function updateTable() {
                var data = [];

                for (var i = 0; i < uiObj.count(); i++) {
                    data.push(uiObj.get(i).data);
                }

                self.update(data);
            }

            function updateXTable() {
                self.update(uiObj.listData());
            }
        }

        /**
         * chart render 함수 재정의
         *
         */
        this.render = function() {
            // SVG 메인 리셋
            this.svg.reset();

            // chart 영역 계산
            calculate(this);

            // chart 관련된 요소 draw
            drawBefore(this);
            drawDefs(this);
            drawGrid(this);
            drawBrush(this, "brush");
            drawBrush(this, "widget");

            // SVG 태그 백그라운드 테마 설정
            this.svg.root.css({
                background: this.theme("backgroundColor")
            });

            // SVG 메인/서브 렌더링
            this.svg.render();
            this.emit("render");
        }

        /**
         * data 업데이트 후 차트 다시 생성
         *
         * @param {array} data
         */
        this.update = function(data) {
            if (data) {// 데이터가 있을 경우...
                this.options.data = data;
            }

            this.page(1);
        }

        this.page = function(pNo) {
            if (arguments.length == 0) {
                return _page - 1;
            }

            var dataList = this.options.data,
                limit = this.options.bufferCount,
                maxPage = Math.ceil(dataList.length / limit);

            // 최소 & 최대 페이지 설정
            if (pNo < 1) {
                _page = 1;
            } else {
                _page = (pNo > maxPage) ? maxPage : pNo;
            }

            _start = (_page - 1) * limit, _end = _start + limit;

            // 마지막 페이지 처리
            if (_end > dataList.length) {
                _start = dataList.length - limit;
                _end = dataList.length;
            }

            if (_end <= dataList.length) {
                _start = (_start < 0) ? 0 : _start;
                _data = dataList.slice(_start, _end);

                this.render();
                if (dataList.length > 0)
                    _page++;
            }
        }

        this.next = function() {
            var dataList = this.options.data,
                limit = this.options.bufferCount,
                step = this.options.shiftCount;

            _start += step;

            var isLimit = (_start + limit > dataList.length);

            _end = (isLimit) ? dataList.length : _start + limit;
            _start = (isLimit) ? dataList.length - limit : _start;
            _start = (_start < 0) ? 0 : _start;
            _data = dataList.slice(_start, _end);

            this.render();
        }

        this.prev = function() {
            var dataList = this.options.data,
                limit = this.options.bufferCount,
                step = this.options.shiftCount;

            _start -= step;

            var isLimit = (_start < 0);

            _end = (isLimit) ? limit : _start + limit;
            _start = (isLimit) ? 0 : _start;
            _data = dataList.slice(_start, _end);

            this.render();
        }

        this.zoom = function(start, end) {
            if (arguments.length == 0) {
                return {
                    start: _start,
                    end: _end
                }
            }

            if (start == end)
                return;

            var dataList = this.options.data;

            _end = (end > dataList.length) ? dataList.length : end;
            _start = (start < 0) ? 0 : start;
            _data = dataList.slice(_start, _end);

            this.render();
        }

        /**
         * chart 사이즈 조정
         *
         * @param {integer} width
         * @param {integer} height
         */
        this.resize = function(width, height) {
            if(arguments.length == 2) {
                this.setOption({
                    width: width,
                    height: height
                });
            }

            this.svg.size(this.options.width, this.options.height);
            this.render(true);
        }

        /**
         * 브러쉬를 추가한 후 차트 렌더링
         *
         * @param brush
         * @param isNotAll
         */
        this.addBrush = function(brush) {
            this.options.brush.push(brush);
            this.render();
        }

        /**
         * 브러쉬를 삭제한 후 차트 렌더링
         *
         * @param index
         * @param isNotAll
         */
        this.removeBrush = function(index) {
            this.options.brush.splice(index, 1);
            this.render();
        }

        /**
         * 해당 인덱스의 브러쉬를 업데이트한 후 렌더링
         *
         * @param index
         * @param brush
         * @param isNotAll
         */
        this.updateBrush = function(index, brush) {
            for(var key in  brush) {
                this.options.brush[index][key] = brush[key];
            }

            this.render();
        }

        /**
         * 테마 변경 후 차트 렌더링
         *
         * @param themeName
         */
        this.setTheme = function(theme) {
            var newTheme = (_.typeCheck("string", theme)) ? jui.include("chart.theme." + theme) : theme;

            if(newTheme != null) {
                setThemeStyle(newTheme);
                this.render();
            }
        }

        /**
         * chart CSV 데이터 설정
         *
         * @param csv
         */
        this.setCsv = function(csv) {
            var chartFields = [],
                csvFields = this.options.csv,
                csvNumber = this.options.csvNumber;

            for (var key in _series) {
                chartFields.push(key);
            }

            if (chartFields.length == 0 && !csvFields)
                return;

            var fields = _.getCsvFields(chartFields, csvFields), csvNumber = (csvNumber) ? _.getCsvFields(fields, csvNumber) : null;

            this.update(_.csvToData(fields, csv, csvNumber));
        }

        /**
         * chart CSV 파일 데이터 설정
         *
         * @param file
         */
        this.setCsvFile = function(file) {
            var self = this;

            _.fileToCsv(file, function(csv) {
                self.setCsv(csv);
            });
        }
    }

    UI.setup = function() {
        return {
            width: "100%", // chart 기본 넓이
            height: "100%", // chart 기본 높이

            // style
            padding: {
                left: 50,
                right: 50,
                bottom: 50,
                top: 50
            },

            // chart
            theme: "jennifer", // 기본 테마 jennifer
            style: {},
            series: {},
            grid: {},
            brush: null,
            widget: null,
            data: [],
            bind: null,
            format: null,

            // buffer
            bufferCount: 100,
            shiftCount: 1,

            // csv
            csv: null,
            csvNumber: null
        }
    }

    return UI;
}, "core");

jui.define("chart.theme.jennifer", [], function() {
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
        // common styles
    	backgroundColor : "white",
    	fontSize : "11px",
    	fontColor : "#333333",
		fontFamily : "arial,Tahoma,verdana",
        colors : themeColors,

        // grid styles
    	gridFontColor : "#333333",
    	gridActiveFontColor : "#ff7800",
        gridBorderColor : "#ebebeb",
    	gridBorderWidth : 1,
        gridBorderDashArray : "none",
		gridAxisBorderColor : "#ebebeb",
		gridAxisBorderWidth : 1,
    	gridActiveBorderColor : "#ff7800",
    	gridActiveBorderWidth: 1,

        // brush styles
        barBorderColor : "none",
        barBorderWidth : 0,
        barBorderOpacity : 0,
        columnBorderColor : "none",
        columnBorderWidth : 0,
        columnBorderOpacity : 0,
    	gaugeBackgroundColor : "#ececec",
        gaugeArrowColor : "#666666",
        gaugeFontColor : "#666666",
    	pieBorderColor : "white",
        pieBorderWidth : 1,
        donutBorderColor : "white",
        donutBorderWidth : 1,
    	areaOpacity : 0.5,
        areaSplitBackgroundColor : "#929292",
        bubbleOpacity : 0.5,
        bubbleBorderWidth : 1,
        candlestickBorderColor : "black",
        candlestickBackgroundColor : "white",
        candlestickInvertBorderColor : "red",
        candlestickInvertBackgroundColor : "red",
        ohlcBorderColor : "black",
        ohlcInvertBorderColor : "red",
        ohlcBorderRadius : 5,
        lineBorderWidth : 2,
        lineSplitBorderColor : null,
        lineSplitBorderOpacity : 0.5,
        pathOpacity : 0.5,
        pathBorderWidth : 1,
        scatterBorderColor : "white",
        scatterBorderWidth : 1,
        scatterHoverColor : "white",
        waterfallBackgroundColor : "#87BB66", // 4
        waterfallInvertBackgroundColor : "#FF7800", // 3
        waterfallEdgeBackgroundColor : "#7BBAE7", // 1
        waterfallLineColor : "#a9a9a9",
        waterfallLineDashArray : "0.9",

        // widget styles
        titleFontColor : "#333",
        titleFontSize : "13px",
        legendFontColor : "#333",
        legendFontSize : "12px",
        tooltipFontColor : "#333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "#aaaaaa",
        tooltipOpacity : 0.7,
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
        crossBalloonOpacity : 0.5
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
        gridBorderDashArray : "none",
        gridAxisBorderColor : "#efefef",
        gridAxisBorderWidth : 1,
        gridActiveBorderColor : "#ff7800",
        gridActiveBorderWidth: 1,

        // brush styles
        barBorderColor : "none",
        barBorderWidth : 0,
        barBorderOpacity : 0,
        columnBorderColor : "none",
        columnBorderWidth : 0,
        columnBorderOpacity : 0,
        gaugeBackgroundColor : "#ececec",
        gaugeArrowColor : "#666666",
        gaugeFontColor : "#666666",
        pieBorderColor : "white",
        pieBorderWidth : 1,
        donutBorderColor : "white",
        donutBorderWidth : 1,
        areaOpacity : 0.4,
        areaSplitBackgroundColor : "linear(top) #b3b3b3,0.9 #929292",
        bubbleOpacity : 0.5,
        bubbleBorderWidth : 1,
        candlestickBorderColor : "#14be9d",
        candlestickBackgroundColor : "linear(top) #27d7b5",
        candlestickInvertBorderColor : "#ff4848",
        candlestickInvertBackgroundColor : "linear(top) #ff6e6e",
        ohlcBorderColor : "#14be9d",
        ohlcInvertBorderColor : "#ff4848",
        ohlcBorderRadius : 5,
        lineBorderWidth : 2,
        lineSplitBorderColor : null,
        lineSplitBorderOpacity : 0.5,
        pathOpacity : 0.5,
        pathBorderWidth : 1,
        scatterBorderColor : "white",
        scatterBorderWidth : 2,
        scatterHoverColor : "white",
        waterfallBackgroundColor : "linear(top) #9cd37a,0.9 #87bb66", // 4
        waterfallInvertBackgroundColor : "linear(top) #ff9d46,0.9 #ff7800", // 3
        waterfallEdgeBackgroundColor : "linear(top) #a1d6fc,0.9 #7BBAE7", // 1
        waterfallLineColor : "#a9a9a9",
        waterfallLineDashArray : "0.9",

        // widget styles
        titleFontColor : "#333",
        titleFontSize : "13px",
        legendFontColor : "#666",
        legendFontSize : "12px",
        tooltipFontColor : "#fff",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "black",
        tooltipBorderColor : "none",
        tooltipOpacity : 1,
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
        crossBalloonOpacity : 0.8
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
        gridBorderDashArray : "none",
		gridAxisBorderColor : "#464646",
		gridAxisBorderWidth : 1,
    	gridActiveBorderColor : "#ff7800",
    	gridActiveBorderWidth: 1,

        // brush styles
        barBorderColor : "none",
        barBorderWidth : 0,
        barBorderOpacity : 0,
        columnBorderColor : "none",
        columnBorderWidth : 0,
        columnBorderOpacity : 0,
    	gaugeBackgroundColor : "#3e3e3e",
        gaugeArrowColor : "#a6a6a6",
        gaugeFontColor : "#c5c5c5",
    	pieBorderColor : "#232323",
        pieBorderWidth : 1,
        donutBorderColor : "#232323",
        donutBorderWidth : 1,
    	areaOpacity : 0.5,
        areaSplitBackgroundColor : "#ebebeb",
        bubbleOpacity : 0.5,
        bubbleBorderWidth : 1,
        candlestickBorderColor : "#14be9d",
        candlestickBackgroundColor : "#14be9d",
        candlestickInvertBorderColor : "#ff4848",
        candlestickInvertBackgroundColor : "#ff4848",
        ohlcBorderColor : "#14be9d",
        ohlcInvertBorderColor : "#ff4848",
        ohlcBorderRadius : 5,
        lineBorderWidth : 2,
        lineSplitBorderColor : null,
        lineSplitBorderOpacity : 0.5,
        pathOpacity : 0.2,
        pathBorderWidth : 1,
        scatterBorderColor : "none",
        scatterBorderWidth : 1,
        scatterHoverColor : "#222222",
        waterfallBackgroundColor : "#26f67c", //
        waterfallInvertBackgroundColor : "#f94590", // 3
        waterfallEdgeBackgroundColor : "#8bccf9", // 1
        waterfallLineColor : "#a9a9a9",
        waterfallLineDashArray : "0.9",

        // widget styles
        titleFontColor : "#ffffff",
        titleFontSize : "14px",
        legendFontColor : "#ffffff",
        legendFontSize : "11px",
        tooltipFontColor : "#333333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "white",
        tooltipOpacity : 1,
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
        crossBalloonOpacity : 1
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
		gridBorderDashArray : "1, 3",
		gridAxisBorderColor : "#bfbfbf",
		gridAxisBorderWidth : 1,
		gridActiveBorderColor : "#ff7800",
		gridActiveBorderWidth : 1,

		// brush styles
		barBorderColor : "none",
		barBorderWidth : 0,
		barBorderOpacity : 0,
		columnBorderColor : "none",
		columnBorderWidth : 0,
		columnBorderOpacity : 0,
		gaugeBackgroundColor : "#f5f5f5",
        gaugeArrowColor : "gray",
		gaugeFontColor : "#666666",
		pieBorderColor : "white",
		pieBorderWidth : 1,
		donutBorderColor : "white",
		donutBorderWidth : 3,
		areaOpacity : 0.4,
		areaSplitBackgroundColor : "#ebebeb",
		bubbleOpacity : 0.5,
		bubbleBorderWidth : 1,
		candlestickBorderColor : "#14be9d",
		candlestickBackgroundColor : "#14be9d",
		candlestickInvertBorderColor : "#ff4848",
		candlestickInvertBackgroundColor : "#ff4848",
        ohlcBorderColor : "#14be9d",
        ohlcInvertBorderColor : "#ff4848",
        ohlcBorderRadius : 5,
		lineBorderWidth : 2,
		lineSplitBorderColor : null,
		lineSplitBorderOpacity : 0.5,
		pathOpacity : 0.5,
		pathBorderWidth : 1,
		scatterBorderColor : "white",
		scatterBorderWidth : 1,
		scatterHoverColor : "white",
		waterfallBackgroundColor : "#73e9d2", // 4
		waterfallInvertBackgroundColor : "#ffb9ce", // 3
		waterfallEdgeBackgroundColor : "#08c4e0", // 1
		waterfallLineColor : "#a9a9a9",
		waterfallLineDashArray : "0.9",

        // widget styles
        titleFontColor : "#333",
        titleFontSize : "18px",
        legendFontColor : "#333",
        legendFontSize : "11px",
        tooltipFontColor : "#fff",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "black",
        tooltipBorderColor : "black",
        tooltipOpacity : 0.7,
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
		crossBalloonOpacity : 0.7
	}
}); 
jui.define("chart.grid.core", [ "util.base" ], function(_) {
	/**
	 * Grid Core 객체 
	 * 
	 */
	var CoreGrid = function() {

		/**
		 * block,radar grid 에 대한 domain 설정
		 *  
		 */
		this.setBlockDomain = function(chart, grid) {
			if (grid.type == "radar" || grid.type == "block") {
				if (grid.target && !grid.domain) {
					var domain = [],
						data = chart.data();
					
                    if (grid.reverse) {
                        var start = data.length - 1,
							end = 0,
							step = -1;
                    } else {
                        var start = 0,
							end = data.length - 1,
							step = 1;
                    }
					
					for (var i = start; ((grid.reverse) ? i >= end : i <=end); i += step) {
						domain.push(data[i][grid.target]);
					}

					grid.domain = domain;

					if (grid.reverse) {
						grid.domain.reverse();
					}
				}
			}
			
			return grid; 			
		}
		
		/**
		 * range grid 의 domain 설정 
		 * 
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성 
		 * 
		 */
		this.setRangeDomain = function(chart, grid) {
			if ( typeof grid.target == "string" || typeof grid.target == "function") {
				grid.target = [grid.target];
			}

			if (grid.target && grid.target.length && !grid.domain) {
				var max = grid.max,
					min = grid.min;
				var data = chart.data();

				for (var i = 0; i < grid.target.length; i++) {
					var s = grid.target[i];

					if ( typeof s == "function") {
						for (var index = 0; index < data.length; index++) {
							var row = data[index];

							var value = +s(row);

							if (max < value)
								max = value;
							if (min > value)
								min = value;

						}
					} else {
						var _max = chart.series(s).max;
						var _min = chart.series(s).min;
						if (max < _max)
							max = _max;
						if (min > _min)
							min = _min;
					}

				}
				
				grid.max = max;
				grid.min = min;

				var unit = grid.unit || Math.ceil((max - min) / grid.step),
					start = 0;

				while (start < max) {
					start += unit;
				}

				var end = 0;
				while (end > min) {
					end -= unit;
				}

				if (unit == 0) {
					grid.domain = [0, 0];
				} else {
					grid.domain = [end, start];					
					if (grid.reverse) {
						grid.domain.reverse();
					}
					grid.step = Math.abs(start / unit) + Math.abs(end / unit);					
					
				}
			}
			
			return grid; 
		}
		
		/**
		 * date grid 의 domain 설정 
		 * 
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성 
		 * 
		 */
		this.setDateDomain = function(chart, grid) {
			if ( typeof grid.target == "string" || typeof grid.target == "function") {
				grid.target = [grid.target];
			}

			if (grid.target && grid.target.length) {
				var min = grid.min || undefined,
					max = grid.max || undefined;
				var data = chart.data();
				
				for (var i = 0; i < grid.target.length; i++) {
					var s = grid.target[i];
					
					for(var index = 0; index < data.length; index++) {
						var value = +data[index][s];
						if (typeof min == "undefined") min = value;
						else if (min > value) min = value;
						
						if (typeof max == "undefined") max = value;
						else if (max < value) max = value;						
					}
				}
				
				grid.max = max;
				grid.min = min;
				grid.domain = [grid.min, grid.max];
				
				if (grid.reverse) {
					grid.domain.reverse();
				}				
			}
			
			return grid; 
		}		
		
		/**
		 * scale wrapper 
		 * 
		 * grid 의 x 좌표 값을 같은 형태로 가지고 오기 위한 wrapper 함수 
		 * 
		 * grid 속성에 key 가 있다면  key 의 속성값으로 실제 값을 처리 
		 * 
		 * ex) 
		 * 
		 * // 그리드 속성에 키가 없을 때 
		 * scale(0);		// 0 인덱스에 대한 값  (block, radar)
		 * 
		 * // grid 속성에 key 가 있을 때  
		 * grid { key : "field" }
		 * scale(0)			// field 값으로 scale 설정 (range, date)
		 * 
		 */
		this.wrapper = function(chart, scale, key) {
			var old_scale = scale; 
			
			function new_scale(i) {
				
				if (key) {
					i = chart.data(i)[key];
				}
				
				return old_scale(i);
			}	
			
			new_scale.max = function() {
				return old_scale.max.apply(old_scale, arguments);
			}
			
			new_scale.min = function() {
				return old_scale.min.apply(old_scale, arguments);
			}
			
			new_scale.rangeBand = function() {
				return old_scale.rangeBand.apply(old_scale, arguments);
			}
			
			new_scale.rate = function() {
				return old_scale.rate.apply(old_scale, arguments);
			}
			
			new_scale.invert = function() {
				return old_scale.invert.apply(old_scale, arguments);
			}
			
			new_scale.clamp = function() {
				return old_scale.clamp.apply(old_scale, arguments);
			}
			
			new_scale.key = key;
			
			return new_scale;
		}
		
		/**
		 * theme 이 적용된  axis line 리턴 
		 * 
		 */
		this.axisLine = function(chart, attr) {
			return chart.svg.line(_.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,
				stroke : this.color("gridAxisBorderColor"),
				"stroke-width" : chart.theme("gridAxisBorderWidth"),
				"stroke-opacity" : 1
			}, attr));
		}

		/**
		 * theme 이 적용된  line 리턴 
		 * 
		 */
		this.line = function(chart, attr) {
			return chart.svg.line(_.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,				
				stroke : this.color("gridBorderColor"),
				"stroke-width" : chart.theme("gridBorderWidth"),
				"stroke-dasharray" : chart.theme("gridBorderDashArray"),
				"stroke-opacity" : 1
			}, attr));
		}

		this.color  = function(theme) {

			if (arguments.length == 3) {
				return (this.grid.color) ? this.chart.color(0, { colors: [ this.grid.color ] }) : this.chart.theme.apply(this.chart, arguments);
			}

			return (this.grid.color) ? this.chart.color(0, { colors: [ this.grid.color ] }) : this.chart.theme(theme);
		}

		/**
		 * grid 그리기  
		 * 
		 */		
		this.drawGrid = function(chart, orient, cls, grid) {
			// create group
			var root = chart.svg.group({
				"class" : ["grid", cls].join(" ")
			})

			// render axis
			this[orient].call(this, chart, root);

			// wrapped scale
			this.scale = this.wrapper(chart, this.scale, grid.key);

			// hide grid 
			if (grid.hide) {
				root.attr({ display : "none" })
			}

			return {
				root : root,
				scale : this.scale
			};
		}

		/**
		 * grid 의 실제 위치와 size 를 구함
		 *
		 * @param chart
		 * @param orient
		 * @param grid
		 * @returns {{start: number, size: *}}
		 */
		this.getGridSize = function(chart, orient, grid) {
			var width = chart.width();
			var height = chart.height();
			var max = (orient == "left" || orient == "right") ? height : width;

			var start = 0;
			if (grid.start) {
				if (typeof grid.start == 'string' && grid.start.indexOf("%") > -1){
					start = max * parseFloat(grid.start.replace("%", ""))/100
				} else {
					start = grid.start
				}
			}

			var size = max ;
			if (grid.size) {
				if (typeof grid.size == 'string' && grid.size.indexOf("%") > -1){
					size = max * parseFloat(grid.size.replace("%", ""))/100
				} else {
					size = grid.size
				}
			}

			if (start == 'center') {
				start = max / 2 - size / 2;
			}

			return {
				start  : start,
				size : size,
				end : start + size
			}
		}

		this.drawSetup = function() {
			var self = this;

			var callback = function(value) {
				return self.chart.format(value);
			}

			return {
				domain: null,
				step: 10,
				min: 0,
				max: 0,
				reverse: false,
				key: null,
				hide: false,
				unit: 0,
				color: null,
				title: null,
				start: null,
				size: null,
				line: false,
				format: callback
			}
		}
	}

	return CoreGrid;
}, "chart.draw"); 
jui.define("chart.grid.block", [ "util.scale" ], function(UtilScale) {

	/**
	 * Block Grid 
	 * 
	 * @param {Object} orient		// grid 방향 
	 * @param {Object} grid
	 */
	var BlockGrid = function(orient, chart, grid) {

		/**
		 * top 그리기 
		 */
		this.top = function(chart, g, scale) {
			var full_height = chart.height();
			
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}))
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = grid.format(this.domain[i]);

                if (domain == "") {
                    continue;
                }

				var axis = chart.svg.group({
					"transform" : "translate(" + this.points[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					x1 : -this.half_band,
					y1 : 0,
					x2 : -this.half_band,
					y2 : (grid.line) ? full_height : this.bar
				}));

				axis.append(chart.text({
					x : 0,
					y : -20,
					"text-anchor" : "middle"
				}, domain));

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? full_height : this.bar
				}));

				g.append(axis);
			}
		}
		
		/**
		 * bottom 그리기
		 */
		this.bottom = function(chart, g, scale) {
			var full_height = chart.height();

			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}));
			}

			for (var i = 0, len = this.points.length; i < len; i++) {
				var domain = grid.format(this.domain[i]);

                if (domain == "") {
                    continue;
                }
                
				var axis = chart.svg.group({
					"transform" : "translate(" + this.points[i] + ", 0)"
				});
				
				axis.append(this.line(chart, {
					x1 : -this.half_band,
					y1 : 0,
					x2 : -this.half_band,
					y2 : (grid.line) ? -full_height : this.bar
				}));

				axis.append(chart.text({
					x : 0,
					y : 20,
					"text-anchor" : "middle"
				}, domain));

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				})

				axis.append(this.line(chart, {
					y2 : (grid.line) ? -full_height : this.bar
				}));

				g.append(axis);
			}
		}
		
		/**
		 * left 그리기 
		 */
		this.left = function(chart, g, scale) {
			var full_width = chart.width();

			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}))
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = grid.format(this.domain[i]);

				if (domain == "") {
					continue;
				}


				var axis = chart.svg.group({
					"transform" : "translate(0, " + (this.points[i] - this.half_band ) + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? full_width : -this.bar
				}));

				axis.append(chart.text({
					x : -this.bar - 4,
					y : this.half_band,
					"text-anchor" : "end"
				}, domain));

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				})

				axis.append(this.line(chart, {
					x2 : (grid.line) ? chart.width() : -this.bar
				}));

				g.append(axis);
			}
		}

		/**
		 * right 그리기 
		 * 
		 */
		this.right = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}))
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = grid.format(this.domain[i]);

				if (domain == "") {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0, " + (this.points[i] - this.half_band) + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? -chart.width() : this.bar
				}));

				axis.append(chart.text({
					x : this.bar + 4,
					y : this.half_band,
					"text-anchor" : "start"
				}, domain));

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? -chart.width() : this.bar
				}));

				g.append(axis);
			}
		}

		this.drawBefore = function() {
			grid.type = grid.type || "block";
			grid = this.setBlockDomain(chart, grid);

			var obj = this.getGridSize(chart, orient, grid);

			// scale 설정
			this.scale = UtilScale.ordinal().domain(grid.domain);
			var range = [obj.start, obj.end];

			if (grid.full) {
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
			this.half_band = (grid.full) ? 0 : this.band / 2;
			this.bar = 6;
			this.reverse = grid.reverse;
		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "block", grid);
		}

		this.drawSetup = function() {
			return $.extend(this.parent.drawSetup(), {
				// core options
				max: 10,
				start: 0,
				size: 0,

				// block options
				full: false
			});
		}
	}

	return BlockGrid;
}, "chart.grid.core");

jui.define("chart.grid.date", [ "util.time", "util.scale" ], function(UtilTime, UtilScale) {

	var DateGrid = function(orient, chart, grid) {

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

				var domain = grid.format(ticks[i]);

				if (domain == "") {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? chart.height() : -bar
				}));

				axis.append(chart.text({
					x : 0,
					y : -bar - 4,
					"text-anchor" : "middle",
					fill : chart.theme("gridFontColor")
				}, domain));

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

				var domain = grid.format(ticks[i]);

				if (domain == "") {
					continue;
				}

				var group = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				group.append(this.line(chart, {
					y2 : (grid.line) ? -chart.height() : bar
				}));

				group.append(chart.text({
					x : 0,
					y : bar * 3,
					"text-anchor" : "middle",
					fill : chart.theme("gridFontColor")
				}, domain));

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

				var domain = grid.format(ticks[i]);

				if (domain == "") {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? chart.width() : -bar
				}));

				axis.append(chart.text({
					x : -bar-2,
					y : bar-2,
					"text-anchor" : "end",
					fill : chart.theme("gridFontColor")
				}, domain));

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

				var domain = grid.format(ticks[i]);

				if (domain == "") {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				})

				axis.append(this.line(chart,{
					x2 : (grid.line) ? -chart.width() : bar
				}));

				axis.append(chart.text({
					x : bar + 4,
					y : -bar,
					"text-anchor" : "start",
					fill : chart.theme("gridFontColor")
				}, domain));

				g.append(axis);
			}
		}


		this.drawBefore = function() {
			grid = this.setDateDomain(chart, grid);


			var obj = this.getGridSize(chart, orient, grid);

			var range = [obj.start, obj.end];
			this.scale = UtilScale.time().domain(grid.domain).rangeRound(range);

			if (grid.realtime) {
				this.ticks = this.scale.realTicks(grid.step[0], grid.step[1]);
			} else {
				this.ticks = this.scale.ticks(grid.step[0], grid.step[1]);
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
				this.values[i] = this.scale(this.ticks[i]);
			}
		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "date", grid);
		}

		this.drawSetup = function() {
			return $.extend(this.parent.drawSetup(), {
				// date options
				realtime: false
			});
		}
	}

	return DateGrid;
}, "chart.grid.core");

jui.define("chart.grid.radar", [ "util.math" ], function(math) {

	var RadarGrid = function(orient, chart, grid) {
		var self = this,
			position = [];

		function drawCircle(chart, root, centerX, centerY, x, y, count) {
			var r = Math.abs(y),
				cx = centerX,
				cy = centerY;

			root.append(chart.svg.circle({
				cx : cx,
				cy : cy,
				r : r,
				"fill-opacity" : 0,
				stroke : self.color("gridAxisBorderColor"),
				"stroke-width" : chart.theme("gridBorderWidth")
			}));
		}

		function drawRadial(chart, root, centerX, centerY, x, y, count, unit) {
			var g = chart.svg.group();
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

			var path = chart.svg.path({
				"fill" : "none",
				stroke : self.color("gridAxisBorderColor"),
				"stroke-width" : chart.theme("gridBorderWidth")
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
            var max = grid.max;
            var domain = grid.domain;

            return function(index, value) {
                var rate = value / max;

				var height = Math.abs(obj.y1) - Math.abs(obj.y2),
					pos = height * rate,
					unit = 2 * Math.PI / domain.length;

				var cx = obj.x1,
					cy = obj.y1,
					y = -pos,
					x = 0;

                var o = math.rotate(x, y, unit * index);

                x = o.x;
                y = o.y;

                return {
                    x : cx + x,
                    y : cy + y
                }
            }
        }

		this.drawBefore = function() {
			grid = this.setBlockDomain(chart, grid);
		}

		this.draw = function() {
			var width = chart.width(), height = chart.height();
			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			var w = min / 2,
				centerX = chart.x() + width / 2,
				centerY = chart.y() + height / 2;

			var startY = -w,
				startX = 0,
				count = grid.domain.length,
				step = grid.step,
				unit = 2 * Math.PI / count,
				h = Math.abs(startY) / step;

			var g = chart.svg.group({
				"class" : "grid radar"
			});

			var root = chart.svg.group();

			g.append(root);

			// domain line
			position = [];

			for (var i = 0; i < count; i++) {
				var x2 = centerX + startX,
					y2 = centerY + startY;

				root.append(chart.svg.line({
					x1 : centerX,
					y1 : centerY,
					x2 : x2,
					y2 : y2,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth")
				}))

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

				if (!grid.hideText) {
					root.append(chart.text({
						x : tx,
						y : ty,
						"text-anchor" : talign,
						fill : chart.theme("gridFontColor")
					}, grid.domain[i]))
				}
				
				var obj = math.rotate(startX, startY, unit);

				startX = obj.x;
				startY = obj.y;

			}

			if (!grid.line) {
				return {
					root : root , 
					scale : scale(position[0])
				};
			}

			// area split line
			startY = -w;
			var stepBase = 0,
				stepValue = grid.max / grid.step;

			for (var i = 0; i < step; i++) {

				if (i == 0 && grid.extra) {
					startY += h;
					continue;
				}

				if (grid.shape == "circle") {
					drawCircle(chart, root, centerX, centerY, 0, startY, count);
				} else {
					drawRadial(chart, root, centerX, centerY, 0, startY, count, unit);
				}

				if (!grid.hideText) {
					root.append(chart.text({
						x : centerX,
						y : centerY + (startY + h - 5),
						fill : chart.theme("gridFontColor")
					}, (grid.max - stepBase) + ""))
				}

				startY += h;
				stepBase += stepValue;
			}
			
			// hide
			if (grid.hide) {
				root.attr({ display : "none" })
			}			

			return {
				root : root, 
				scale : scale(position[0])
			};
		}

		this.drawSetup = function() {
			return $.extend(this.parent.drawSetup(), {
				// core options
				max: 100,

				// common options
				line: true,

				// radar options
				hideText: false,
				extra: false,
				shape: "radial" // or circle
			});
		}
	}

	return RadarGrid;
}, "chart.grid.core");

jui.define("chart.grid.range", [ "util.scale" ], function(UtilScale) {

	/**
	 * 숫자 범위(range) 그리드 객체 
	 *  
	 * @param {Object} orient
	 * @param {Object} grid
	 */
	var RangeGrid = function(orient, chart, grid) {

		this.top = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x2 : this.size
				}));
			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {

				var domain = grid.format(ticks[i]);

				if (domain == "") {
					continue;
				}

				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? chart.height() : -bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				axis.append(chart.text({
					x : 0,
					y : -bar - 4,
					"text-anchor" : "middle",
					fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
				}, domain));

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

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {

				var domain = grid.format(ticks[i]);

				if (domain == "") {
					continue;
				}

				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? -chart.height() : bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				axis.append(chart.text({
					x : 0,
					y : bar * 3,
					"text-anchor" : "middle",
					fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
				}, domain))

				g.append(axis);
			}
		}

		this.left = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}));

			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {

				var domain = grid.format(ticks[i]);

				if (domain == "") {
					continue;
				}

				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = chart.svg.group({
					"transform" : "translate(0, " + values[i] + ")"
				})

				axis.append(this.line(chart, {
					x2 : (grid.line) ? chart.width() : -bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")					
				}));

				if (!grid.hideText) {
					axis.append(chart.text({
						x : -bar - 4,
						y : bar,
						"text-anchor" : "end",
						fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
					}, domain));
				}

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

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {

				var domain = grid.format(ticks[i]);

				if (domain == "") {
					continue;
				}

				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = chart.svg.group({
					"transform" : "translate(0, " + values[i] + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? -chart.width() : bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				axis.append(chart.text({
					x : bar + 4,
					y : bar,
					"text-anchor" : "start",
					fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
				}, domain));

				g.append(axis);
			}
		}

		this.drawBefore = function() {
			grid = this.setRangeDomain(chart, grid);

			var obj = this.getGridSize(chart, orient, grid);
			this.scale = UtilScale.linear().domain(grid.domain);

			if (orient == "left" || orient == "right") {
				this.scale.range([obj.end, obj.start]);
			} else {
				this.scale.range([obj.start, obj.end]);
			}

			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.step = grid.step;
			this.nice = grid.nice;
			this.ticks = this.scale.ticks(this.step, this.nice);
			this.bar = 6;

			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = this.scale(this.ticks[i]);
			}
		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "range", grid);
		}

		this.drawSetup = function() {
			return $.extend(this.parent.drawSetup(), {
				// range options
				hideText: false,
				nice: false
			});
		}
	}

	return RangeGrid;
}, "chart.grid.core");

jui.define("chart.brush.core", [ "util.base" ], function(_) {
	var CoreBrush = function() {

        function setMouseEvent(self, e) {
            var pos = $(self.chart.root).offset(),
                offsetX = e.pageX - pos.left,
                offsetY = e.pageY - pos.top;

            e.bgX = offsetX;
            e.bgY = offsetY;
            e.chartX = offsetX - self.chart.padding("left");
            e.chartY = offsetY - self.chart.padding("top");
        }

        /**
         * 좌표 배열 'K'에 대한 커브 좌표 'P1', 'P2'를 구하는 함수
         *
         * @param K
         * @returns {{p1: Array, p2: Array}}
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
         * 값에 비례하여 반지름을 구하는 함수
         *
         * @param value
         * @param minValue
         * @param maxValue
         * @param minRadius
         * @param maxRadius
         * @returns {*}
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
         * 차트 데이터에 대한 좌표 'x', 'y'를 구하는 함수
         *
         * @param brush
         * @param chart
         * @returns {Array}
         */
        this.getXY = function() {
            var xy = [];

            for (var i = 0, len = this.chart.data().length; i < len; i++) {
                var startX = this.brush.x(i),
                    data = this.chart.data(i);

                for (var j = 0; j < this.brush.target.length; j++) {
                    var key = this.brush.target[j],
                        value = data[key],
                        series = this.chart.series(key);

                    if (!xy[j]) {
                        xy[j] = {
                            x: [],
                            y: [],
                            value: [],
                            min: [],
                            max: []
                        };
                    }

                    xy[j].x.push(startX);
                    xy[j].y.push(this.brush.y(value));
                    xy[j].value.push(value);
                    xy[j].min.push((value == series.min) ? true : false);
                    xy[j].max.push((value == series.max) ? true : false);
                }
            }

            return xy;
        }

        /**
         * 차트 데이터에 대한 좌표 'x', 'y'를 구하는 함수
         * 단, 'y' 좌표는 다음 데이터 보다 높게 구해진다.
         *
         * @param brush
         * @param chart
         * @returns {Array}
         */

        this.getStackXY = function() {
            var xy = this.getXY();

            for (var i = 0, len = this.chart.data().length; i < len; i++) {
                var data = this.chart.data(i),
                    valueSum = 0;

                for (var j = 0; j < this.brush.target.length; j++) {
                    var key = this.brush.target[j],
                        value = data[key];

                    if(j > 0) {
                        valueSum += data[this.brush.target[j - 1]];
                    }

                    xy[j].y[i] = this.brush.y(value + valueSum);
                }
            }

            return xy;
        }
        
        /**
         * 브러쉬 엘리먼트에 대한 공통 이벤트 정의
         *
         * @param brush
         * @param chart
         * @param element
         * @param targetIndex
         * @param dataIndex
         */
        this.addEvent = function(elem, targetIndex, dataIndex) {
            var self = this;
            var obj = {
                brush: self.brush,
                dataIndex: dataIndex,
                dataKey: (targetIndex != null) ? self.brush.target[targetIndex] : null,
                data: (dataIndex != null) ? self.chart.data(dataIndex) : null
            };

            elem.on("click", function(e) {
                setMouseEvent(self, e);
                self.chart.emit("click", [ obj, e ]);
            });

            elem.on("dblclick", function(e) {
                setMouseEvent(self, e);
                self.chart.emit("dblclick", [ obj, e ]);
            });

            elem.on("contextmenu", function(e) {
                setMouseEvent(self, e);
                self.chart.emit("rclick", [ obj, e ]);
                e.preventDefault();
            });

            elem.on("mouseover", function(e) {
                setMouseEvent(self, e);
                self.chart.emit("mouseover", [ obj, e ]);
            });

            elem.on("mouseout", function(e) {
                setMouseEvent(self, e);
                self.chart.emit("mouseout", [ obj, e ]);
            });

            elem.on("mousemove", function(e) {
                setMouseEvent(self, e);
                self.chart.emit("mousemove", [ obj, e ]);
            });

            elem.on("mousedown", function(e) {
                setMouseEvent(self, e);
                self.chart.emit("mousedown", [ obj, e ]);
            });

            elem.on("mouseup", function(e) {
                setMouseEvent(self, e);
                self.chart.emit("mouseup", [ obj, e ]);
            });
        }
	}

	return CoreBrush;
}, "chart.draw"); 
jui.define("chart.brush.bar", [], function() {

	var BarBrush = function(chart, brush) {
		var g, zeroX, count, height, half_height, barHeight;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;

			zeroX = brush.x(0);
			count = chart.data().length;

			height = brush.y.rangeBand();
			half_height = height - (outerPadding * 2);
			barHeight = (half_height - (brush.target.length - 1) * innerPadding) / brush.target.length;

			borderColor = chart.theme("barBorderColor");
			borderWidth = chart.theme("barBorderWidth");
			borderOpacity = chart.theme("barBorderOpacity");
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var group = chart.svg.group(),
					startY = brush.y(i) - (half_height / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var startX = brush.x(chart.data(i, brush.target[j])),
                        r = null;

					if (startX >= zeroX) {
						r = chart.svg.rect({
							x : zeroX,
							y : startY,
							height : barHeight,
							width : Math.abs(zeroX - startX),
							fill : chart.color(j, brush),
							stroke : borderColor,
							"stroke-width" : borderWidth,
							"stroke-opacity" : borderOpacity
						});
					} else {
						var w = Math.abs(zeroX - startX);

						r = chart.svg.rect({
							y : startY,
							x : zeroX - w,
							height : barHeight,
							width : w,
							fill : chart.color(j, brush),
							stroke : borderColor,
							"stroke-width" : borderWidth,
							"stroke-opacity" : borderOpacity
						});
					}

                    this.addEvent(r, j, i);
                    group.append(r);

					startY += barHeight + innerPadding;
				}
				
				g.append(group);
			}

            return g;
		}

        this.drawSetup = function() {
            return {
                outerPadding: 2,
                innerPadding: 1
            }
        }
	}

	return BarBrush;
}, "chart.brush.core");

jui.define("chart.brush.bubble", [], function() {

	var BubbleBrush = function(chart, brush) {
        var self = this;

        function createBubble(chart, brush, pos, index) {
            var series = chart.series(brush.target[index]),
                radius = self.getScaleValue(pos.value, series.min, series.max, brush.min, brush.max);

            return chart.svg.circle({
                cx: pos.x,
                cy: pos.y,
                r: radius,
                "fill": chart.color(index, brush),
                "fill-opacity": chart.theme("bubbleOpacity"),
                "stroke": chart.color(index, brush),
                "stroke-width": chart.theme("bubbleBorderWidth")
            });
        }

        this.drawBubble = function(chart, brush, points) {
            var g = chart.svg.group({
                "clip-path" : "url(#" + chart.clipId + ")"
            });

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].x.length; j++) {
                    var b = createBubble(chart, brush, {
                        x: points[i].x[j], y: points[i].y[j], value: points[i].value[j]
                    }, i);

                    this.addEvent(b, i, j);
                    g.append(b);
                }
            }

            return g;
        }

        this.draw = function() {
            return this.drawBubble(chart, brush, this.getXY());
        }

        this.drawSetup = function() {
            return {
                min: 5,
                max: 30
            }
        }
	}

	return BubbleBrush;
}, "chart.brush.core");
jui.define("chart.brush.candlestick", [], function() {

    var CandleStickBrush = function(chart, brush) {
        var g, count, width = 0, barWidth = 0, barPadding = 0;

        function getTargets(chart) {
            var target = {};

            for (var j = 0; j < brush.target.length; j++) {
                var t = chart.series(brush.target[j]);
                target[t.type] = t;
            }

            return target;
        }

        this.drawBefore = function() {
            g = chart.svg.group();

            count = chart.data().length;
            width = brush.x.rangeBand();
            barWidth = width * 0.7;
            barPadding = barWidth / 2;
        }

        this.draw = function() {
            var targets = getTargets(chart);

            for (var i = 0; i < count; i++) {
                var startX = brush.x(i),
                    r = null,
                    l = null;

                var open = targets.open.data[i],
                    close = targets.close.data[i],
                    low =  targets.low.data[i],
                    high = targets.high.data[i];

                if(open > close) { // 시가가 종가보다 높을 때 (Red)
                    var y = brush.y(open);

                    l = chart.svg.line({
                        x1: startX,
                        y1: brush.y(high),
                        x2: startX,
                        y2: brush.y(low),
                        stroke: chart.theme("candlestickInvertBorderColor"),
                        "stroke-width": 1
                    });

                    r = chart.svg.rect({
                        x : startX - barPadding,
                        y : y,
                        width : barWidth,
                        height : Math.abs(brush.y(close) - y),
                        fill : chart.theme("candlestickInvertBackgroundColor"),
                        stroke: chart.theme("candlestickInvertBorderColor"),
                        "stroke-width": 1
                    });

                } else {
                    var y = brush.y(close);

                    l = chart.svg.line({
                        x1: startX,
                        y1: brush.y(high),
                        x2: startX,
                        y2: brush.y(low),
                        stroke: chart.theme("candlestickBorderColor"),
                        "stroke-width":1
                    });

                    r = chart.svg.rect({
                        x : startX - barPadding,
                        y : y,
                        width : barWidth,
                        height : Math.abs(brush.y(open) - y),
                        fill : chart.theme("candlestickBackgroundColor"),
                        stroke: chart.theme("candlestickBorderColor"),
                        "stroke-width": 1
                    });
                }

                this.addEvent(r, null, i);

                g.append(l);
                g.append(r);
            }

            return g;
        }

        this.drawSetup = function() {
            return {};
        }
    }

    return CandleStickBrush;
}, "chart.brush.core");

jui.define("chart.brush.ohlc", [], function() {

    var OHLCBrush = function(chart, brush) {
        var g, count;

        function getTargets(chart) {
            var target = {};

            for (var j = 0; j < brush.target.length; j++) {
                var t = chart.series(brush.target[j]);
                target[t.type] = t;
            }

            return target;
        }

        this.drawBefore = function() {
            g = chart.svg.group();
            count = chart.data().length;
        }

        this.draw = function() {
            var targets = getTargets(chart);

            for (var i = 0; i < count; i++) {
                var startX = brush.x(i);

                var open = targets.open.data[i],
                    close = targets.close.data[i],
                    low =  targets.low.data[i],
                    high = targets.high.data[i],
                    color = (open > close) ? chart.theme("ohlcInvertBorderColor") : chart.theme("ohlcBorderColor");

                var lowHigh = chart.svg.line({
                    x1: startX,
                    y1: brush.y(high),
                    x2: startX,
                    y2: brush.y(low),
                    stroke: color,
                    "stroke-width": 1
                });

                var close = chart.svg.line({
                    x1: startX,
                    y1: brush.y(close),
                    x2: startX + chart.theme("ohlcBorderRadius"),
                    y2: brush.y(close),
                    stroke: color,
                    "stroke-width": 1
                });

                var open = chart.svg.line({
                    x1: startX,
                    y1: brush.y(open),
                    x2: startX - chart.theme("ohlcBorderRadius"),
                    y2: brush.y(open),
                    stroke: color,
                    "stroke-width": 1
                });

                this.addEvent(lowHigh, null, i);

                g.append(lowHigh);
                g.append(close);
                g.append(open);
            }

            return g;
        }

        this.drawSetup = function() {
            return {}
        }
    }

    return OHLCBrush;
}, "chart.brush.core");

jui.define("chart.brush.column", [], function() {

	var ColumnBrush = function(chart, brush) {
		var g, zeroY, count, width, columnWidth, half_width;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;

			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			half_width = (width - outerPadding * 2);
			columnWidth = (width - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;

			borderColor = chart.theme("columnBorderColor");
			borderWidth = chart.theme("columnBorderWidth");
			borderOpacity = chart.theme("columnBorderOpacity");
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var startX = brush.x(i) - (half_width / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var startY = brush.y(chart.data(i)[brush.target[j]]),
                        r = null;

					if (startY <= zeroY) {
						r = chart.svg.rect({
							x : startX,
							y : startY,
							width : columnWidth,
							height : Math.abs(zeroY - startY),
							fill : chart.color(j, brush),
							stroke : borderColor,
							"stroke-width" : borderWidth,
							"stroke-opacity" : borderOpacity
						});
					} else {
						r = chart.svg.rect({
							x : startX,
							y : zeroY,
							width : columnWidth,
							height : Math.abs(zeroY - startY),
							fill : chart.color(j, brush),
							stroke : borderColor,
							"stroke-width" : borderWidth,
							"stroke-opacity" : borderOpacity
						});
					}

                    this.addEvent(r, j, i);
                    g.append(r);

					startX += columnWidth + innerPadding;
				}
			}

            return g;
		}

        this.drawSetup = function() {
            return {
                outerPadding: 2,
                innerPadding: 1
            }
        }
	}

	return ColumnBrush;
}, "chart.brush.core");

jui.define("chart.brush.donut", [ "util.math" ], function(math) {

	var DonutBrush = function() {
        var w, centerX, centerY, startY, startX, outerRadius, innerRadius;

		this.drawDonut = function(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, attr, hasCircle) {
		    
		    hasCircle = hasCircle || false; 
		    
		    var dist = Math.abs(outerRadius - innerRadius);
		    
			var g = this.chart.svg.group({
				"class" : "donut"
			});

			var path = this.chart.svg.path(attr);

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle));

			var startX = obj.x;
			var startY = obj.y;
			
			var innerCircle = math.rotate(0, -innerRadius, math.radian(startAngle));
			
			var startInnerX = innerCircle.x;
			var startInnerY = innerCircle.y;
			
			
			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			// inner arc 에 대한 지점 설정 			
			innerCircle = math.rotate(startInnerX, startInnerY, math.radian(endAngle));

			// 중심점 이동 
			g.translate(centerX, centerY);

			// outer arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y);

			// 라인 긋기 
			path.LineTo(innerCircle.x, innerCircle.y);

			// inner arc 그리기 
			path.Arc(innerRadius, innerRadius, 0, (endAngle > 180) ? 1 : 0, 0, startInnerX, startInnerY);
			
			// 패스 종료
			path.ClosePath();

			g.append(path);

            if (hasCircle) {
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
            var width = this.chart.width(),
                height = this.chart.height(),
                min = width;

            if (height < min) {
                min = height;
            }

            // center
            w = min / 2;
            centerX = width / 2;
            centerY = height / 2;
            startY = -w;
            startX = 0;
            outerRadius = Math.abs(startY);
            innerRadius = outerRadius - this.brush.size;
        }

		this.draw = function() {
			var group = this.chart.svg.group({
				"class" : "brush donut"
			});

			var target = this.brush.target,
				data = this.chart.data(0);

			var all = 360,
				startAngle = 0,
				max = 0;

			for (var i = 0; i < target.length; i++) {
				max += data[target[i]];
			}

			for (var i = 0; i < target.length; i++) {
				var value = data[target[i]],
					endAngle = all * (value / max);

				var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, {
					fill : this.chart.color(i, this.brush),
					stroke : this.chart.theme("donutBorderColor"),
					"stroke-width" : this.chart.theme("donutBorderWidth")
				});

                this.addEvent(g, i, 0);
				group.append(g);

				startAngle += endAngle;
			}

            return group;
		}

        this.drawSetup = function() {
            return {
                size: 50
            }
        }
	}

	return DonutBrush;
}, "chart.brush.core");

jui.define("chart.brush.equalizer", [], function() {

    var EqualizerBrush = function(chart, brush) {
        var g, zeroY, count, width, barWidth, half_width;

        this.drawBefore = function() {
            g = chart.svg.group();

            zeroY = brush.y(0);
            count = chart.data().length;

            width = brush.x.rangeBand();
            half_width = (width - brush.outerPadding * 2) / 2;
            barWidth = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
        }

        this.draw = function() {
            for (var i = 0; i < count; i++) {
                var startX = brush.x(i) - half_width;

                for (var j = 0; j < brush.target.length; j++) {
                    var barGroup = chart.svg.group();
                    var startY = brush.y(chart.data(i, brush.target[j])),
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
                                fill : chart.color(Math.floor(eIndex / brush.gap), brush)
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
                                fill : chart.color(Math.floor(eIndex / brush.gap), brush)
                            });

                            eY += unitHeight + padding;
                            eIndex++;

                            barGroup.append(r);
                        }
                    }

                    this.addEvent(barGroup, j, i);
                    g.append(barGroup);

                    startX += barWidth + brush.innerPadding;
                }
            }

            return g;
        }

        this.drawSetup = function() {
            return {
                innerPadding: 10,
                outerPadding: 15,
                unit: 5,
                gap: 5
            }
        }
    }

    return EqualizerBrush;
}, "chart.brush.core");

jui.define("chart.brush.fullstack", [], function() {

	var FullStackBrush = function(chart, brush) {
		var g, zeroY, count, width, barWidth;

		this.drawBefore = function() {
			g = chart.svg.group();

			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			barWidth = width - brush.outerPadding * 2;
		}

		this.draw = function() {
			var chart_height = chart.height();

			for (var i = 0; i < count; i++) {
				var startX = brush.x(i) - barWidth / 2,
                    sum = 0,
                    list = [];

				for (var j = 0; j < brush.target.length; j++) {
					var height = chart.data(i, brush.target[j]);

					sum += height;
					list.push(height);
				}

				var startY = 0,
                    max = brush.y.max(),
                    current = max;
				
				for (var j = list.length - 1; j >= 0; j--) {
					var height = chart_height - brush.y.rate(list[j] , sum);
					
					var r = chart.svg.rect({
						x : startX,
						y : startY,
						width : barWidth,
						height : height,
						fill : chart.color(j, brush)
					});

                    this.addEvent(r, j, i);
					g.append(r);

					if (brush.text) {
						var percent = Math.round((list[j]/sum)*max);
						var text = chart.svg.text({
							x : startX + barWidth / 2,
							y : startY + height / 2 + 8,
							"text-anchor" : "middle"
						}, ((current - percent < 0 ) ? current : percent) + "%");					
						g.append(text);					
						current -= percent;
					}
					
					startY += height;										
				}
			}

            return g;
		}

        this.drawSetup = function() {
            return {
                outerPadding: 15
            }
        }
	}

	return FullStackBrush;
}, "chart.brush.core");

jui.define("chart.brush.line", [], function() {

	var LineBrush = function() {

        this.createLine = function(pos, index) {
            var x = pos.x,
                y = pos.y;

            var p = this.chart.svg.path({
                stroke : this.chart.color(index, this.brush),
                "stroke-width" : this.chart.theme("lineBorderWidth"),
                fill : "transparent"
            }).MoveTo(x[0], y[0]);

            if(this.brush.symbol == "curve") {
                var px = this.curvePoints(x),
                    py = this.curvePoints(y);

                for (var i = 0; i < x.length - 1; i++) {
                    p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                }
            } else {
                for (var i = 0; i < x.length - 1; i++) {
                    if(this.brush.symbol == "step") {
                        var sx = x[i] + ((x[i + 1] - x[i]) / 2);

                        p.LineTo(sx, y[i]);
                        p.LineTo(sx, y[i + 1]);
                    }

                    p.LineTo(x[i + 1], y[i + 1]);
                }
            }

            return p;
        }

        this.drawLine = function(path) {
            var g = this.chart.svg.group();

            for (var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k);

                this.addEvent(p, k, null);
                g.append(p);
            }

            return g;
        }

        this.draw = function() {
            return this.drawLine(this.getXY());
        }

        this.drawSetup = function() {
            return {
                symbol: "normal" // normal, curve, step
            }
        }
	}

	return LineBrush;
}, "chart.brush.core");
jui.define("chart.brush.path", [], function() {

	var PathBrush = function(chart, brush) {

		this.draw = function() {
			var g = chart.svg.group({
				'class' : 'brush path'
			});
			
			var data = chart.data(),
                data_count = data.length;
			
			for(var ti = 0, len = brush.target.length; ti < len; ti++) {
				var color = chart.color(ti, brush);

				var path = chart.svg.path({
					fill : color,
					"fill-opacity" : chart.theme("pathOpacity"),
					stroke : color,
					"stroke-width" : chart.theme("pathBorderWidth")
				});
	
				g.append(path);
	
				for (var i = 0; i < data_count; i++) {
					var obj = brush.c(i, chart.data(i, brush.target[ti])),
						x = obj.x - chart.x(),
						y = obj.y - chart.y();
	
					if (i == 0) {
						path.MoveTo(x, y);
					} else {
						path.LineTo(x, y);
					}
				}
	
				path.ClosePath();
			}

			return g;
		}
	}

	return PathBrush;
}, "chart.brush.core");

jui.define("chart.brush.pie", [ "util.math" ], function(math) {

	var PieBrush = function(chart, brush) {
        var w, centerX, centerY, outerRadius;

		this.drawPie = function(chart, centerX, centerY, outerRadius, startAngle, endAngle, attr) {
			var g = chart.svg.group({
				"class" : "pie"
			});

			var path = chart.svg.path(attr);

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle));

			var startX = obj.x,
                startY = obj.y;
			
			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			g.translate(centerX, centerY);

			// arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y);
			path.LineTo(0, 0);
			path.ClosePath();

			g.append(path);

			return g;
		}

        this.drawBefore = function() {
            var width = chart.width(),
				height = chart.height();
            var min = width;

            if (height < min) {
                min = height;
            }

            // center
            w = min / 2;
            centerX = width / 2;
            centerY = height / 2;
            outerRadius = w;
        }

		this.draw = function() {
			var group = chart.svg.group({
				"class" : "brush donut"
			});

			var target = brush.target,
				all = 360,
                startAngle = 0,
				max = 0;

			for (var i = 0; i < target.length; i++) {
				max += chart.data(0)[target[i]];
			}

			for (var i = 0; i < target.length; i++) {
				var value = chart.data(0)[target[i]],
                    endAngle = all * (value / max);

				var g = this.drawPie(chart, centerX, centerY, outerRadius, startAngle, endAngle, {
					fill : chart.color(i, brush),
					stroke : chart.theme("pieBorderColor"),
					"stroke-width" : chart.theme("pieBorderWidth")
				});

                this.addEvent(g, i, 0);
				group.append(g);

				startAngle += endAngle;
			}

            return group;
		}

        this.drawSetup = function() {
            return {}
        }
	}

	return PieBrush;
}, "chart.brush.core");

jui.define("chart.brush.scatter", [], function() {

	var ScatterBrush = function() {

        this.createScatter = function(pos, index) {
            var self = this;

            var elem = null,
                display = this.brush.display,
                target = this.chart.series(this.brush.target[index]),
                symbol = (!target.symbol) ? this.brush.symbol : target.symbol,
                w = h = this.brush.size;

            var color = this.chart.color(index, this.brush),
                borderColor = this.chart.theme("scatterBorderColor"),
                borderWidth = this.chart.theme("scatterBorderWidth");

            if(symbol == "triangle" || symbol == "cross") {
                var self = this;

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

            // display 옵션이 max 또는 min일 때, 나머지 엘리먼트는 숨기기
            if(display == "max" && !pos.max || display == "min" && !pos.min) {
                elem.attr({ visibility: "hidden" });
            }

            return elem;
        }

        this.drawScatter = function(points) {
            var g = this.chart.svg.group();

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].x.length; j++) {
                    var p = this.createScatter({
                        x: points[i].x[j],
                        y: points[i].y[j],
                        max: points[i].max[j],
                        min: points[i].min[j]
                    }, i);
                    this.addEvent(p, i, j);

                    g.append(p);
                }
            }

            return g;
        }

        this.draw = function() {
            return this.drawScatter(this.getXY());
        }

        this.drawSetup = function() {
            return {
                symbol: "circle", // or triangle, rectangle, cross
                size: 7,
                display: null // max, min
            }
        }
	}

	return ScatterBrush;
}, "chart.brush.core");
jui.define("chart.brush.stackbar", [], function() {

	var StackBarBrush = function(chart, brush) {
		var g, series, count, height, barWidth;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

			series = chart.series();
			count = chart.data().length;

			height = brush.y.rangeBand();
			barWidth = height - brush.outerPadding * 2;

			borderColor = chart.theme("barBorderColor");
			borderWidth = chart.theme("barBorderWidth");
			borderOpacity = chart.theme("barBorderOpacity");
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var group = chart.svg.group();
				
				var startY = brush.y(i) - barWidth/ 2,
                    startX = brush.x(0),
                    value = 0;
				
				for (var j = 0; j < brush.target.length; j++) {
					var xValue = chart.data(i, brush.target[j]) + value,
                        endX = brush.x(xValue);

					var r = chart.svg.rect({
						x : (startX < endX) ? startX : endX,
						y : startY,
						width : Math.abs(startX - endX),
						height : barWidth,
						fill : chart.color(j, brush),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, j, i);
					group.append(r);					
					
					startX = endX;
					value = xValue;
				}
				
				g.append(group);
			}

            return g;
		}

        this.drawSetup = function() {
            return {
                outerPadding: 15
            }
        }
	}

	return StackBarBrush;
}, "chart.brush.core");

jui.define("chart.brush.stackcolumn", [], function() {

	var ColumnStackBrush = function(chart, brush) {
		var g, zeroY, count, width, barWidth;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			barWidth = width - brush.outerPadding * 2;

			borderColor = chart.theme("columnBorderColor");
			borderWidth = chart.theme("columnBorderWidth");
			borderOpacity = chart.theme("columnBorderOpacity");
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var group = chart.svg.group();
				
				var startX = brush.x(i) - barWidth / 2,
                    startY = brush.y(0),
                    value = 0;


				for(var j = 0; j < brush.target.length; j++) {
					var yValue = chart.data(i, brush.target[j]) + value,
                        endY = brush.y(yValue);
					
					var r = chart.svg.rect({
						x : startX,
						y : (startY > endY) ? endY : startY,
						width : barWidth,
						height : Math.abs(startY - endY),
						fill : chart.color(j, brush),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});
					
                    this.addEvent(r, j, i);
					group.append(r);					
					
					startY = endY;
					value = yValue;
				}
				
				g.append(group);
			}

            return g;
		}

        this.drawSetup = function() {
            return {
                outerPadding: 15
            }
        }
	}

	return ColumnStackBrush;
}, "chart.brush.core");

jui.define("chart.brush.bargauge", [], function() {

	var BarGaugeBrush = function(chart, brush) {
        var y = 0, x = 0;

		this.draw = function() {
			var group = chart.svg.group({
				"class" : "brush bar gauge"
			});

			if (brush.split) {
				var max = chart.width();	
			} else {
				var max = chart.width();
			}

			for(var i = 0, len = chart.data().length; i < len; i++) {
                var data = chart.data(i);
                
                var g = chart.svg.group({
                    "class" : "bar"
                });
                
                g.append(chart.text({
                    x : x,
                    y : y + brush.size / 2 + brush.cut,
                    "text-anchor" : "end",
                    fill : chart.color(i, brush)
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

                this.addEvent(g, null, i);
                group.append(g);
                
                y += brush.size + brush.cut;
			}

            return group;
		}

        this.drawSetup = function() {
            return {
                cut: 5,
                size: 20,
                split: false,
                align: "left",
                title: "title"
            }
        }
	}

	return BarGaugeBrush;
}, "chart.brush.core");

jui.define("chart.brush.circlegauge", [ "util.math" ], function(math) {

	var CircleGaugeBrush = function(chart, brush) {
        var w, centerX, centerY, outerRadius;

		this.drawBefore = function() {
            var width = chart.width(), height = chart.height();
            var min = width;

            if (height < min) {
                min = height;
            }

            w = min / 2;
            centerX = width / 2;
            centerY = height / 2;
            outerRadius = w;
		}

		this.draw = function() {
            var rate = (brush.value - brush.min) / (brush.max - brush.min);

			var group = chart.svg.group({
				"class" : "brush circle gauge"
			});

            group.append(chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : outerRadius,
                fill : chart.theme("gaugeBackgroundColor"),
                stroke : chart.color(0, brush),
                "stroke-width" : 2
            }));
            
            group.append(chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : outerRadius * rate,
                fill : chart.color(0, brush)
            }));

            this.addEvent(group, null, null);

            return group;
		}

        this.drawSetup = function() {
            return {
                min: 0,
                max: 100,
                value: 0
            };
        }
	}

	return CircleGaugeBrush;
}, "chart.brush.core");

jui.define("chart.brush.fillgauge", [ "jquery" ], function($) {

	var FillGaugeBrush = function(chart, brush) {
        var w, centerX, centerY, outerRadius, clipId;
        var rect;

        function setDirection(direction) {
            var rate = (brush.value - brush.min) / (brush.max - brush.min);

            if (direction == "vertical") {
                var height = chart.height() * rate;
                var width = chart.width();
                var x = 0;
                var y = chart.height() - height;
            } else {		// horizontal
                var height = chart.height();
                var width = chart.width() * rate;
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
                fill : chart.color(0, brush),
                d : path,
                "clip-path" : "url(#" + clipId + ")"
            }));
        }

        this.drawBefore = function() {
            var width = chart.width(), height = chart.height();
            var min = width;

            if (height < min) {
                min = height;
            }

            w = min / 2;
            centerX = width / 2;
            centerY = height / 2;
            outerRadius = w;
            clipId = chart.createId("fill-gauge");

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
				"class" : "brush fill gauge",
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
                        width : chart.width(),
                        height : chart.height(),
                        fill : chart.theme("gaugeBackgroundColor")
                    }));

                    group.append(chart.svg.rect({
                        x : 0,
                        y : 0,
                        width : chart.width(),
                        height : chart.height(),
                        fill : chart.color(0, brush),
                        "clip-path" : "url(#" + clipId + ")"
                    }));

                }
            }

            return group;
		}

        this.drawSetup = function() {
            return {
                min: 0,
                max: 100,
                value: 0,
                shape: "circle", // or rectangle
                direction: "vertical",
                svg: "",
                path: ""
            }
        }
	}

	return FillGaugeBrush;
}, "chart.brush.core");

jui.define("chart.brush.area", [], function() {

    var AreaBrush = function() {

        this.drawArea = function(path) {
            var g = this.chart.svg.group(),
                maxY = this.chart.height();

            for (var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k),
                    xList = path[k].x;

                p.LineTo(xList[xList.length - 1], maxY);
                p.LineTo(xList[0], maxY);
                p.ClosePath();
                p.attr({
                    fill: this.chart.color(k, this.brush),
                    "fill-opacity": this.chart.theme("areaOpacity"),
                    "stroke-width": 0
                });

                this.addEvent(p, null, null);
                g.prepend(p);
            }

            return g;
        }

        this.draw = function() {
            return this.drawArea(this.getXY());
        }
    }

    return AreaBrush;
}, "chart.brush.line");

jui.define("chart.brush.stackline", [], function() {

	var StackLineBrush = function() {
        this.draw = function() {
            return this.drawLine(this.getStackXY());
        }
	}

	return StackLineBrush;
}, "chart.brush.line");
jui.define("chart.brush.stackarea", [], function() {

	var StackAreaBrush = function() {
		this.draw = function() {
            return this.drawArea(this.getStackXY());
		}
	}

	return StackAreaBrush;
}, "chart.brush.area");

jui.define("chart.brush.stackscatter", [], function() {

	var StackScatterBrush = function() {
        this.draw = function() {
            return this.drawScatter(this.getStackXY());
        }
	}

	return StackScatterBrush;
}, "chart.brush.scatter");
jui.define("chart.brush.gauge", [ "util.math" ], function(math) {

	var GaugeBrush = function(chart, brush) {
        var w, centerX, centerY, outerRadius, innerRadius;

        function createText(startAngle, endAngle, min, max, value) {
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
				"fill" : chart.color(0, brush)
			}, value + ""));

			if (brush.unitText != "") {
				g.append(chart.text({
					x : 0,
					y : 100,
					"text-anchor" : "middle",
                    "font-family" : chart.theme("fontFamily"),
					"font-size" : "1.5em",
					"font-weight" : 500,
					"fill" : chart.theme("gaugeFontColor")
				}, brush.unitText))
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

        function createArrow(startAngle, endAngle) {
			var g = chart.svg.group({
				"class" : "gauge block"
			}).translate(centerX, centerY);

			// 바깥 지름 부터 그림
			var startX = 0;
			var startY = -(outerRadius + 5);

			var path = chart.svg.path({
				stroke : chart.theme("gaugeArrowColor"),
				"stroke-width" : 0.2,
				"fill" : chart.theme("gaugeArrowColor")
			});

			path.MoveTo(startX, startY);
			path.LineTo(5, 0);
			path.LineTo(-5, 0);
			path.ClosePath();

			// start angle
			path.rotate(startAngle);
			g.append(path)
			path.rotate(endAngle + startAngle);

			g.append(chart.svg.circle({
				cx : 0,
				cy : 0,
				r : 5,
				fill : chart.theme("gaugeArrowColor")
			}));

			g.append(chart.svg.circle({
				cx : 0,
				cy : 0,
				r : 2,
				fill : chart.theme("gaugeArrowColor")
			}));

			return g;
		}

        this.drawBefore = function() {
            var width = chart.width(), height = chart.height();
            var min = width;

            if (height < min) {
                min = height;
            }

            w = min / 2;
            centerX = width / 2;
            centerY = height / 2;
            outerRadius = w;
            innerRadius = outerRadius - brush.size;
        }

		this.draw = function() {
			var group = chart.svg.group({
				"class" : "brush gauge"
			});

			var rate = (brush.value - brush.min) / (brush.max - brush.min),
                currentAngle = (brush.endAngle) * rate;
			
			if (brush.endAngle >= 360) {
                brush.endAngle = 359.99999;
			}
			
			var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle - currentAngle, {
				fill : chart.theme("gaugeBackgroundColor")
			});

			group.append(g);

			g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle, {
				fill : chart.color(0, brush)
			});

			group.append(g);

            if (brush.arrow) {
                g = createArrow(brush.startAngle, currentAngle);
                group.append(g);
            }

            // startAngle, endAngle 에 따른 Text 위치를 선정해야함
            g = createText(brush.startAngle, brush.endAngle, brush.min, brush.max, brush.value);
            group.append(g);

            return group;
		}

        this.drawSetup = function() {
            return {
                min: 0,
                max: 100,
                value: 0,
                size: 60,
                startAngle: 0,
                endAngle: 360,
                arrow: true,
                unitText: ""
            }
        }
	}

	return GaugeBrush;
}, "chart.brush.donut");

jui.define("chart.brush.fullgauge", ["util.math"], function(math) {

	var GaugeBrush = function(chart, brush) {
        var w, centerX, centerY, outerRadius, innerRadius;

		function createText(startAngle, endAngle, min, max, value) {
			var g = chart.svg.group({
				"class" : "gauge text"
			});

			g.translate(centerX, centerY);

			if (brush.text != "") {
				g.append(chart.svg.text({
					x : 0,
					y : 10,
					"text-anchor" : "middle",
					"font-family" : chart.theme("fontFamily"),
					"font-size" : "3.5em",
					"font-weight" : 1000,
					"fill" : chart.color(0, brush)
				}, value + ""));
			}
			
			if (brush.unitText != "") {
				g.append(chart.text({
					x : 0,
					y : 40,
					"text-anchor" : "middle",
                    "font-family" : chart.theme("fontFamily"),
					"font-size" : "2em",
					"font-weight" : 500,
					"fill" : chart.theme("gaugeFontColor")
				}, brush.unitText));
			}

			return g;
		}

        this.drawBefore = function() {
            var width = chart.width(), height = chart.height();
            var min = width;

            if (height < min) {
                min = height;
            }

            w = min / 2;
            centerX = width / 2;
            centerY = height / 2;
            outerRadius = w;
            innerRadius = outerRadius - brush.size;
        }

		this.draw = function() {
			var group = chart.svg.group({
				"class" : "brush donut"
			});

			var rate = (brush.value - brush.min) / (brush.max - brush.min),
                currentAngle = (brush.endAngle) * rate;
			
			if (brush.endAngle >= 360) {
                brush.endAngle = 359.99999;
			}
			
			var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle - currentAngle, {
				fill : chart.theme("gaugeBackgroundColor")
			});

			group.append(g);

			g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle, {
				fill : chart.color(0, brush)
			});

			group.append(g);

            // startAngle, endAngle 에 따른 Text 위치를 선정해야함
            g = createText(brush.startAngle, brush.endAngle, brush.min, brush.max, brush.value);
            group.append(g);

            return group;
		}

        this.drawSetup = function() {
            return {
                min: 0,
                max: 100,
                value: 0,
                size: 60,
                startAngle: 0,
                endAngle: 300,
                text: "",
                unitText: ""
            }
        }
	}

	return GaugeBrush;
}, "chart.brush.donut");

jui.define("chart.brush.stackgauge", [ "util.math" ], function(math) {

	var StackGaugeBrush = function(chart, brush) {
        var w, centerX, centerY, outerRadius;

		this.drawBefore = function() {
			var width = chart.width(), height = chart.height();
			var min = width;

			if (height < min) {
				min = height;
			}

			w = min / 2;
			centerX = width / 2;
			centerY = height / 2;
			outerRadius = w;
		}

		this.draw = function() {
			var group = chart.svg.group({
				"class" : "brush donut"
			});
			
			for(var i = 0, len = chart.data().length; i < len; i++) {
				var rate = (chart.data(i)[brush.target] - brush.min) / (brush.max - brush.min),
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
					fill : chart.color(i, brush)
				}, true);
	
				group.append(g);
				
				// draw text 
				group.append(chart.text({
					x : centerX + 2,
					y : centerY + Math.abs(outerRadius) - 5,
					fill : chart.color(i, brush),
					"font-size" : "12px",
					"font-weight" : "bold"
				}, chart.data(i)[brush.title] || ""))
				
				outerRadius -= brush.size;
			}

            return group;
		}

        this.drawSetup = function() {
            return {
                min: 0,
                max: 100,
                cut: 5,
                size: 24,
                startAngle: -180,
                endAngle: 360,
                title: "title"
            }
        }
	}

	return StackGaugeBrush;
}, "chart.brush.donut");

jui.define("chart.brush.waterfall", [], function() {

	var WaterFallBrush = function(chart, brush) {
		var g, zeroY, count, width, columnWidth, half_width;
		var outerPadding;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
			zeroY = brush.y(0);
			count = chart.data().length;

			width = brush.x.rangeBand();
			half_width = (width - outerPadding * 2);
			columnWidth = (width - outerPadding * 2 - (brush.target.length - 1)) / brush.target.length;
		}

		this.draw = function() {
			var target = brush.target[0],
				stroke = chart.theme("waterfallLineColor");

			for (var i = 0; i < count; i++) {
				var startX = brush.x(i) - half_width / 2,
					startY = brush.y(chart.data(i)[target]),
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
					var preValue = chart.data(i - 1)[target],
						nowValue = chart.data(i)[target],
						preStartY = brush.y(preValue),
						nowStartY = brush.y(nowValue),
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

				this.addEvent(r, 0, i);
				g.append(r);

				startX += columnWidth;
			}

            return g;
		}

        this.drawSetup = function() {
            return {
				line: true,
				end: false,
                outerPadding: 5
            }
        }
	}

	return WaterFallBrush;
}, "chart.brush.core");

jui.define("chart.brush.splitline", [ "util.base" ], function(_) {

	var SplitLineBrush = function() {

        this.createLine = function(pos, index) {
            var opts = {
                stroke: this.chart.color(index, this.brush),
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

            for (var i = 0; i < x.length - 1; i++) {
                if(i == split) {
                    var color = this.chart.theme("lineSplitBorderColor"),
                        opacity = this.chart.theme("lineSplitBorderOpacity");

                    g.append(p);

                    opts["stroke"] = (color != null) ? color : this.chart.color(index, this.brush);
                    opts["stroke-opacity"] = opacity;

                    p = this.chart.svg.path(opts).MoveTo(x[i], y[i]);
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

            for (var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k);

                this.addEvent(p, k, null);
                g.append(p);
            }

            return g;
        }

        this.draw = function() {
            return this.drawLine(this.getXY());
        }

        this.drawSetup = function() {
            return {
                symbol: "normal", // normal, curve, step
                split: null
            }
        }
	}

	return SplitLineBrush;
}, "chart.brush.core");
jui.define("chart.brush.splitarea", [ "util.base" ], function(_) {

    var SplitAreaBrush = function() {

        this.drawArea = function(path) {
            var g = this.chart.svg.group(),
                maxY = this.chart.height(),
                split = this.brush.split,
                splitColor = this.chart.theme("areaSplitBackgroundColor");

            for (var k = 0; k < path.length; k++) {
                var opts = {
                    fill: this.chart.color(k, this.brush),
                    "fill-opacity": this.chart.theme("areaOpacity"),
                    "stroke-width": 0
                };

                var line = this.createLine(path[k], k),
                    xList = path[k].x;

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

                this.addEvent(line, null, null);
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

	var RangeColumnBrush = function(chart, brush) {
		var g, count, width, columnWidth, half_width;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;
			count = chart.data().length;

			width = brush.x.rangeBand();
			half_width = (width - outerPadding * 2);
			columnWidth = (width - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;

			borderColor = chart.theme("columnBorderColor");
			borderWidth = chart.theme("columnBorderWidth");
			borderOpacity = chart.theme("columnBorderOpacity");
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var startX = brush.x(i) - (half_width / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var data = chart.data(i)[ brush.target[j]],
						startY = brush.y(data[1]),
						zeroY = brush.y(data[0]);

					var r = chart.svg.rect({
						x : startX,
						y : startY,
						width : columnWidth,
						height : Math.abs(zeroY - startY),
						fill : chart.color(j, brush),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, j, i);
                    g.append(r);

					startX += columnWidth + innerPadding;
				}
			}

            return g;
		}

        this.drawSetup = function() {
            return {
                outerPadding: 2,
                innerPadding: 1
            }
        }
	}

	return RangeColumnBrush;
}, "chart.brush.core");

jui.define("chart.brush.rangebar", [], function() {

	var RangeBarBrush = function(chart, brush) {
		var g, count, height, half_height, barHeight;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;
			count = chart.data().length;

			height = brush.y.rangeBand();
			half_height = height - (outerPadding * 2);
			barHeight = (half_height - (brush.target.length - 1) * innerPadding) / brush.target.length;

			borderColor = chart.theme("barBorderColor");
			borderWidth = chart.theme("barBorderWidth");
			borderOpacity = chart.theme("barBorderOpacity");
		}

		this.draw = function() {
			for (var i = 0; i < count; i++) {
				var group = chart.svg.group(),
					startY = brush.y(i) - (half_height / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var data = chart.data(i, brush.target[j]),
						startX = brush.x(data[1]),
						zeroX = brush.x(data[0]);

					var r = chart.svg.rect({
						x : zeroX,
						y : startY,
						height : barHeight,
						width : Math.abs(zeroX - startX),
						fill : chart.color(j, brush),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, j, i);
                    group.append(r);

					startY += barHeight + innerPadding;
				}
				
				g.append(group);
			}

            return g;
		}

        this.drawSetup = function() {
            return {
                outerPadding: 2,
                innerPadding: 1
            }
        }
	}

	return RangeBarBrush;
}, "chart.brush.core");

jui.define("chart.widget.core", [ "util.base" ], function(_) {

	var CoreWidget = function() {
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
            } else if(type == "bottom") {
                points.push([ 0, anchor ].join(","));
                points.push([ (w / 2) - (anchor / 2), anchor ].join(","));
                points.push([ (w / 2), 0 ].join(","));
                points.push([ (w / 2) + (anchor / 2), anchor ].join(","));
                points.push([ w, anchor ].join(","));
                points.push([ w, anchor + h ].join(","))
                points.push([ 0, anchor + h ].join(","));
            } else if(type == "left") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, (h / 2) - (anchor / 2) ].join(","));
                points.push([ w + anchor, (h / 2) ].join(","));
                points.push([ w, (h / 2) + (anchor / 2) ].join(","));
                points.push([ w, h ].join(","));
                points.push([ 0, h ].join(","));
            } else if(type == "right") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, h ].join(","));
                points.push([ 0, h ].join(","));
                points.push([ 0, (h / 2) + (anchor / 2) ].join(","));
                points.push([ 0 - anchor, (h / 2) ].join(","));
                points.push([ 0, (h / 2) - (anchor / 2) ].join(","));
            }

            // Firefox 처리 (시작점과 끝점 연결)
            points.push([ 0, 0 ].join(","));

            return points.join(" ");
        }

        this.eachBrush = function(callback) {
            if(!_.typeCheck("function", callback)) return;
            var list = this.getBrush();

            for(var i = 0; i < list.length; i++) {
                callback.prototype = this;
                new callback(i, this.chart.brush(i));
            }
        }

        this.getBrush = function() {
            var brush = this.widget.brush,
                list = [ 0 ];

            if(_.typeCheck("array", brush)) {
                list = brush;
            } else if(_.typeCheck("integer", brush)) {
                list = [ brush ];
            }

            return list;
        }

        this.existBrush = function(index) {
            var list = this.getBrush();

            return ($.inArray(index, list) == -1) ? false : true;
        }

        this.isRender = function() {
            return (this.widget.render === true) ? true : false;
        }

        this.drawSetup = function() {
            return {
                brush: null,
                render: false
            }
        }
	}

	return CoreWidget;
}, "chart.draw"); 
jui.define("chart.widget.tooltip", [ "jquery" ], function($) {
    var TooltipWidget = function(chart, widget) {
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

        function printTooltip(obj) {
            if(obj.dataKey && widget.all === false) {
                var t = chart.series(obj.dataKey),
                    k = obj.dataKey,
                    d = (obj.data != null) ? obj.data[k] : null;

                // 위젯 포지션에 따른 별도 처리
                if(widget.position == "bottom") {
                    text.attr({ y: textY + anchor });
                }

                // 툴팁 값 설정
                var message = widget.format((t.text) ? t.text : k, d);
                setMessage(0, message);

                text.attr({ "text-anchor": "middle" });
            } else {
                var brush = chart.brush(obj.brush.index);

                for(var i = 0; i < brush.target.length; i++) {
                    var key = brush.target[i],
                        t = chart.series(key),
                        x = padding,
                        y = (textY * i) + (padding * 2),
                        d = (obj.data != null) ? obj.data[key] : null;

                    // 위젯 포지션에 따른 별도 처리
                    if(widget.position == "bottom") {
                        y = y + anchor;
                    }

                    var message = widget.format((t.text) ? t.text : key, d);
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
                    "fill-opacity": chart.theme("tooltipOpacity"),
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

            chart.on("mouseover", function(obj, e) {
                if(isActive || !self.existBrush(obj.brush.index)) return;
                if(!obj.dataKey && !obj.data) return;

                // 툴팁 텍스트 출력
                printTooltip(obj);

                var size = text.size();
                w = size.width + (padding * 2);
                h = size.height + padding;

                text.attr({ x: w / 2 });
                rect.attr({ points: self.balloonPoints(widget.position, w, h, anchor) });
                g.attr({ visibility: "visible" });

                isActive = true;
            });

            chart.on("mousemove", function(obj, e) {
                if(!isActive) return;

                var x = e.bgX - (w / 2),
                    y = e.bgY - h - anchor - (padding / 2);

                if(widget.position == "left" || widget.position == "right") {
                    y = e.bgY - (h / 2) - (padding / 2);
                }

                if(widget.position == "left") {
                    x = e.bgX - w - anchor;
                } else if(widget.position == "right") {
                    x = e.bgX + anchor;
                } else if(widget.position == "bottom") {
                    y = e.bgY + (anchor * 2);
                }

                g.translate(x, y);
            });

            chart.on("mouseout", function(obj, e) {
                if(!isActive) return;

                g.attr({ visibility: "hidden" });
                isActive = false;
            });

            return g;
        }

        this.drawSetup = function() {
            var callback = function(key, value) {
                if(!value) {
                    return key;
                }

                return key + ": " + chart.format(value);
            }

            return $.extend(this.parent.drawSetup(), {
                position: "top", // or bottom, left, right
                all: false,
                format: callback
            });
        }
    }

    return TooltipWidget;
}, "chart.widget.core");
jui.define("chart.widget.title", [ "util.base", "util.math" ], function(_, math) {

    var TitleWidget = function(chart, widget) {
        var x = 0, y = 0, anchor = "middle";

        this.drawBefore = function() {
            if (widget.position == "bottom") {
                y = chart.y2() + chart.padding("bottom") - 20;
            } else if (widget.position == "top") {
                y = 20;
            } else {
                y = chart.y() + chart.height() / 2
            }

            if (widget.align == "center") {
                x = chart.x() + chart.width()/2;
                anchor = "middle";
            } else if (widget.align == "start") {
                x = chart.x();
                anchor = "start";
            } else {
                x = chart.x2();
                anchor = "end";
            }
        }

        this.draw = function() {
            if (widget.text == "") {
                return; 
            }

            var obj = chart.svg.getTextRect(widget.text);

            var half_text_width = obj.width/2;
            var half_text_height = obj.height/2;

            var text =  chart.text({
                x : x + widget.dx,
                y : y + widget.dy,
                "text-anchor" : anchor,
                "font-family" : chart.theme("fontFamily"),
                "font-size" : chart.theme("titleFontSize"),
                "fill" : chart.theme("titleFontColor")
            }, widget.text);

            if (widget.position == "center") {
                if (widget.align == 'start') {
                    text.rotate(-90, x + widget.dx + half_text_width, y + widget.dy + half_text_height)
                } else if (widget.align == 'end') {
                    text.rotate(90, x + widget.dx - half_text_width, y + widget.dy + half_text_height)
                }

            }

            return text;
        }

        this.drawSetup = function() {
            return $.extend(this.parent.drawSetup(), {
                position: "top", // or bottom
                align: "center", // or start, end
                text: "",
                dx: 0,
                dy: 0
            });
        }
    }

    return TitleWidget;
}, "chart.widget.core");
jui.define("chart.widget.legend", [ "util.base" ], function(_) {

    var LegendWidget = function(chart, widget) {
        var columns = {};

        function setLegendStatus(brush) {
            if(!widget.filter) return;

            for(var i = 0; i < brush.target.length; i++) {
                columns[brush.target[i]] = true;
            }
        }

        function changeTargetOption(brush) {
            var target = [];

            for(var key in columns) {
                if(columns[key]) {
                    target.push(key);
                }
            }

            chart.updateBrush(brush.index, { target: target });
        }

        /**
         * brush 에서 생성되는 legend 아이콘 리턴 
         * 
         * @param {object} chart
         * @param {object} brush
         */
		this.getLegendIcon = function(brush) {
			var arr = [],
                data = brush.target,
                count = data.length;
			
			for(var i = 0; i < count; i++) {
                var target = brush.target[i],
                    text = chart.series(target).text || target;

				var rect = chart.svg.getTextRect(text),
                    width = Math.min(rect.width, rect.height),
                    height = width;
								 
				var group = chart.svg.group({
					"class" : "legend icon"
				});
				
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
                            if(columns[key]) {
                                element.attr({ opacity: 0.7 });
                                columns[key] = false;
                            } else {
                                element.attr({ opacity: 1 });
                                columns[key] = true;
                            }

                            changeTargetOption(brush);
                        });
                    })(target, group);
                }
			}
			
			return arr;
		}        
        
        this.draw = function() {
            var group = chart.svg.group({
                "class" : "widget legend"
            });
            
            var x = 0, y = 0,
                total_width = 0, total_height = 0,
                max_width = 0, max_height = 0;

            this.eachBrush(function(index, brush) {
                var arr = this.getLegendIcon(brush);

                for(var k = 0; k < arr.length; k++) {
                    group.append(arr[k].icon);
                    arr[k].icon.translate(x, y);

                    if (widget.position == "bottom" || widget.position == "top") {
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
            if (widget.position == "bottom" || widget.position == "top") {
                var y = (widget.position == "bottom") ? chart.y2() + chart.padding("bottom") - max_height : chart.y() - chart.padding("top");
                
                if (widget.align == "start") {
                    x = chart.x();
                } else if (widget.align == "center") {
                    x = chart.x() + (chart.width() / 2- total_width / 2);
                } else if (widget.align == "end") {
                    x = chart.x2() - total_width;
                }
            } else {
                var x = (widget.position == "left") ? chart.x() - chart.padding("left") : chart.x2() + chart.padding("right") - max_width;
                
                if (widget.align == "start") {
                    y = chart.y();
                } else if (widget.align == "center") {
                    y = chart.y() + (chart.height() / 2 - total_height / 2);
                } else if (widget.align == "end") {
                    y = chart.y2() - total_height;
                }
            } 
            
            group.translate(Math.floor(x), Math.floor(y));

            return group;
        }

        this.drawSetup = function() {
            return $.extend(this.parent.drawSetup(), {
                position : "bottom",
                align : "center", // or start, end
                filter : false
            });
        }
    }

    return LegendWidget;
}, "chart.widget.core");
jui.define("chart.widget.scroll", [ "util.base" ], function (_) {

    var ScrollWidget = function(chart, widget) {
        var thumbWidth = 0,
            thumbLeft = 0,
            bufferCount = 0,
            dataLength = 0,
            totalWidth = 0,
            piece = 0,
            rate = 0 ;

        function setScrollEvent(chart, thumb) {
            var isMove = false,
                mouseStart = 0,
                thumbStart = 0;

            chart.on("bg.mousedown", function(e) {
                if(isMove && thumb.element != e.target) return;

                isMove = true;
                mouseStart = e.bgX;
                thumbStart = thumbLeft;
            });

            chart.on("bg.mousemove", mousemove);
            chart.on("bg.mouseup", mouseup);
            chart.on("chart.mousemove", mousemove);
            chart.on("chart.mouseup", mouseup);

            function mousemove(e) {
                if(!isMove) return;

                var gap = thumbStart + e.bgX - mouseStart;

                if(gap < 0) {
                    gap = 0;
                } else {
                    if(gap + thumbWidth > chart.width()) {
                        gap = chart.width() - thumbWidth;
                    }
                }

                thumb.translate(gap, 1);
                thumbLeft = gap;

                var startgap = gap * rate,
                    start = startgap == 0 ? 0 : Math.floor(startgap / piece);

                if (gap + thumbWidth == chart.width()) {
                    start += 1;
                }

                chart.zoom(start, start + bufferCount);
            }

            function mouseup(e) {
                if(!isMove) return;

                isMove = false;
                mouseStart = 0;
                thumbStart = 0;
            }
        }

        this.drawBefore = function() {
            var opts = chart.options;

			dataLength =  opts.data.length; 
			bufferCount = opts.bufferCount;

			piece = chart.width() / bufferCount;
			totalWidth = piece * dataLength;
			rate = totalWidth / chart.width();
            thumbWidth = chart.width() * (bufferCount / dataLength) + 2;
        }

        this.draw = function() {
            return chart.svg.group({}, function() {
                chart.svg.rect({
                    width: chart.width(),
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
                setScrollEvent(chart, thumb);

            }).translate(chart.x(), chart.y2());
        }

        this.drawSetup = function() {
            return this.parent.drawSetup();
        }
    }

    return ScrollWidget;
}, "chart.widget.core");
jui.define("chart.widget.zoom", [ "util.base" ], function(_) {

    var ZoomWidget = function(chart, widget) {
        var count, tick;

        function setDragEvent(chart, thumb, bg) {
            var isMove = false,
                mouseStart = 0,
                thumbWidth = 0;

            chart.on("chart.mousedown", function(e) {
                if(isMove || chart.zoom().start > 0) return;

                isMove = true;
                mouseStart = e.bgX;
            });

            chart.on("chart.mousemove", function(e) {
                if(!isMove) return;

                thumbWidth = e.bgX - mouseStart;

                if(thumbWidth > 0) {
                    thumb.attr({
                        width: thumbWidth
                    });

                    thumb.translate(mouseStart, chart.y());
                } else {
                    thumb.attr({
                        width: Math.abs(thumbWidth)
                    });

                    thumb.translate(mouseStart + thumbWidth, chart.y());
                }
            });

            chart.on("chart.mouseup", function(e) {
                isMove = false;
            });

            chart.addEvent("body", "mouseup", function(e) {
                if(thumbWidth == 0) return;

                var x = ((thumbWidth > 0) ? mouseStart : mouseStart + thumbWidth) - chart.padding("left");
                var start = Math.floor(x / tick),
                    end = Math.ceil((x + Math.abs(thumbWidth)) / tick);

                // 차트 줌
                if(start < end) {
                    chart.zoom(start, end);
                    bg.attr({ "visibility": "visible" });
                }

                resetDragStatus();
            });

            function resetDragStatus() { // 엘리먼트 및 데이터 초기화
                isMove = false;
                mouseStart = 0;
                thumbWidth = 0;

                thumb.attr({
                    width: 0
                });
            }
        }

        this.drawBefore = function() {
            var opts = chart.options,
                len = opts.data.length;

            count = (len < opts.bufferCount && len > 0) ? len : opts.bufferCount;
            tick = chart.width() / count;
        }

        this.draw = function() {
            var cw = chart.width(),
                ch = chart.height(),
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
                            d: "M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M16.9,15.5l-1.4,1.4L12,13.4l-3.5,3.5   l-1.4-1.4l3.5-3.5L7.1,8.5l1.4-1.4l3.5,3.5l3.5-3.5l1.4,1.4L13.4,12L16.9,15.5z",
                            fill: chart.theme("zoomFocusColor")
                        }).translate(cw - r, -r);
                    }).on("click", function(e) {
                        bg.attr({ visibility: "hidden" });
                        chart.page(1);
                    });

                }).translate(chart.x(), chart.y());

                setDragEvent(chart, thumb, bg);
            });
        }

        this.drawSetup = function() {
            return this.parent.drawSetup();
        }
    }

    return ZoomWidget;
}, "chart.widget.core");
jui.define("chart.widget.cross", [ "util.base" ], function(_) {

    var CrossWidget = function(chart, widget) {
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

            tspan[index].textContent = widget.format(message);
        }

        this.drawBefore = function() {
            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                xline = chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: chart.width(),
                    y2: 0,
                    stroke: chart.theme("crossBorderColor"),
                    "stroke-width": chart.theme("crossBorderWidth"),
                    opacity: chart.theme("crossBorderOpacity")
                });

                yline = chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: chart.height(),
                    stroke: chart.theme("crossBorderColor"),
                    "stroke-width": chart.theme("crossBorderWidth"),
                    opacity: chart.theme("crossBorderOpacity")
                });

                // 포맷 옵션이 없을 경우, 툴팁을 생성하지 않음
                if(_.typeCheck("function", widget.format)) {
                    yTooltip = chart.svg.group({}, function () {
                        chart.svg.polygon({
                            fill: chart.theme("crossBalloonBackgroundColor"),
                            "fill-opacity": chart.theme("crossBalloonOpacity"),
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

                    xTooltip = chart.svg.group({}, function () {
                        chart.svg.polygon({
                            fill: chart.theme("crossBalloonBackgroundColor"),
                            "fill-opacity": chart.theme("crossBalloonOpacity"),
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
                    }).translate(0, chart.height() + ta);
                }

            }).translate(chart.x(), chart.y());
        }

        this.draw = function() {
            chart.on("chart.mouseover", function(e) {
                g.attr({ visibility: "visible" });
            });

            chart.on("chart.mouseout", function(e) {
                g.attr({ visibility: "hidden" });
            });

            chart.on("chart.mousemove", function(e) {
                var left = e.chartX + 2,
                    top = e.chartY + 2;

                xline.attr({
                    y1: top,
                    y2: top
                });

                yline.attr({
                    x1: left,
                    x2: left
                });

                // 포맷 옵션이 없을 경우, 처리하지 않음
                if(_.typeCheck("function", widget.format)) {
                    if (yTooltip) {
                        yTooltip.translate(-(tw + ta), top - (th / 2));
                        printTooltip(0, yTooltip.get(1), self.widget.y.invert(top));
                    }

                    if (xTooltip) {
                        xTooltip.translate(left - (tw / 2), chart.height() + ta);
                        printTooltip(1, xTooltip.get(1), self.widget.x.invert(left));
                    }
                }
            });

            return g;
        }

        this.drawSetup = function() {
            var callback = function(value) {
                return chart.format(value);
            }

            return $.extend(this.parent.drawSetup(), {
                format: callback
            });
        }
    }

    return CrossWidget;
}, "chart.widget.core");
jui.defineUI("chartx.realtime", [ "jquery", "util.base", "util.time", "chart.builder" ], function($, _, time, builder) {

    var UI = function() {
        var interval = null,
            dataList = [];

        function runningChart(self) {
            var domain = initDomain(self);

            for(var i = 0; i < dataList.length; i++) {
                if (dataList[i][self.options.grid.key].getTime() <= domain[0].getTime()) {
                    dataList.splice(i, 1);
                } else {
                    break;
                }
            }

            self.chart.options.grid.x.domain = domain;
            self.chart.update(dataList);
        }

        function initDomain(self) {
            var end = new Date(),
                start = time.add(end, time.minutes, -self.options.period);

            return [ start, end ];
        }

        function getOptions(self) {
            var options = {},
                excepts = [ "grid", "interval", "period" ];

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

            this.chart = builder(this.selector, $.extend(true, {
                bufferCount : opts.period * 60,
                grid : {
                    x : {
                        type : "date",
                        domain : initDomain(this),
                        step : [ time.minutes, opts.grid.xstep ],
                        realtime : true,
                        format : opts.grid.format,
                        key : opts.grid.key,
                        line : opts.grid.xline
                    },
                    y : {
                        type : "range",
                        target : (opts.grid.target != null) ? opts.grid.target : target,
                        step : opts.grid.ystep,
                        line : opts.grid.yline
                    }
                }
            }, getOptions(this)));

            // 초기값 세팅
            if(opts.data.length > 0) {
                this.update(opts.data);
            }

            // 그리드 러닝
            this.start();
        }

        this.update = function(data) {
            dataList = data;
            this.chart.update(dataList);
        }

        this.clear = function() {
            dataList = [];
            this.chart.update([]);
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
            }, this.interval * 1000);
        }

        this.stop = function() {
            if(interval == null) return;

            clearInterval(interval);
            interval = null;
        }
    }

    UI.setup = function() {
        return {
            width : "100%",		// chart 기본 넓이
            height : "100%",		// chart 기본 높이

            // style
            padding : {
                left : 50 ,
                right : 50,
                bottom : 50,
                top : 50
            },

            // chart
            theme : "jennifer",	// 기본 테마 jennifer
            data : [],
            style : {},
            series : {},
            brush : null,
            widget : null,

            // grid (custom)
            grid : {
                target : null,
                format : "hh:mm",
                key : "time",
                xstep : 1, // x축 분 간격
                ystep : 10,
                xline : true,
                yline : true
            },

            // realtime
            interval : 1, // 초
            period : 5 // 분
        }
    }

    return UI;
}, "core");