/*! jbinder v@0.0.1 | seogi1004.github.com/jbinder */

(function(experts) {
	
	var ViewData = function(type, elem) {
		var $sel = $(elem);
		var dataType = 0,
			dataAttr = null;
		
		function isTypeHtml(elem) {
			if(elem.value == undefined || elem.tagName.toUpperCase() == 'BUTTON')
				return true;
			
			return false;
		}
		
		function init() {
			if(!type) {
				if(isTypeHtml(elem)) dataType = "html";
				else dataType = "value";
			} else {
				if(type.indexOf(".") != -1) {
					var arr = type.split(".");
					
					dataType = arr[0];
					dataAttr = arr[1];
				} else {
					dataType = "css";
					dataAttr = type;
				}
			}
		}
		
		this.run = function(value) {
			var method = {
				"html": function() { 
					if(value) $sel.html(value);
					else return $sel.html();
				},
				"value": function() { 
					if(value) $sel.val(value);
					else return $sel.val();
				},
				"css": function() { 
					if(value) { 
						if(typeof(value) == "object") {
							$sel.css(value);
						} else {
							$sel.css(dataAttr, value);
						}
					} else return $sel.css(dataAttr);
				},
				"attr": function() { 
					if(value) { 
						if(typeof(value) == "object") {
							$sel.attr(value);
						} else {
							$sel.attr(dataAttr, value);
						}
					} else return $sel.attr(dataAttr);
				}
			};
			
			return method[dataType]();
		}
		
		init();
	}
	
	var JBinder = function(root, options) {
		var	self = this,
			auto = {};
		
		var def_methods = {
			get: true, val: true, destroy: true, close: true, reload: true
		};
			
		function init() {
			var funcList = [], 
				bindList = [],
				autoList = [];
			
			$(root).find("[" + options.attr + "]").each(function(i) {
				var $this = $(this),
					tmpComm = $this.attr(options.attr),
					tmpCommArr = getParseCommandArr(tmpComm);
					
				var commArr = (tmpCommArr.length > 0) ? tmpCommArr : [ tmpCommArr ];
				
				for(var j=0, len=commArr.length; j < len; j++) {
					var command = commArr[j];
					
					if(!command.is_auto) {
						if(!command.key) {
							bindList.push({ name: command.func, elem: this });
						} else {
							funcList.push({ func: command.func, key: command.key, data: this });
						}
					} else {
						if(this.tagName == "INPUT" || this.tagName == "SELECT" || this.tagName == "TEXTAREA") {
							autoList.push({ func: command.func, type: command.type, elem: this });
						}
					}
				}
				
				if(funcList.length > 0) settingBindFunc(funcList);
				if(bindList.length > 0) settingBindMulti(bindList);
				if(autoList.length > 0) settingBindAuto(autoList);
			});
		}
		
		/**
		 * data 속성의 value 파싱 함수
		 * 
		 * @param {String} command
		 */
		function getParseCommand(command) {
			var key = null, func = null, type = null; 
			var is_auto = false;
			
			if(command) {
				if(command.indexOf('@') != -1) {
					var arr = command.split("@");
						func = arr[0],
						type = arr[1],
						is_auto = true;
				} else {
					if(command.indexOf('#') != -1) {
						var arr = command.split("#");
							type = arr[1],
							command = arr[0];
					}
					
					if(command.indexOf(':') != -1) {
						var arr = command.split(":");
							key = arr[1], 
							func = arr[0];
					} else {
						func = command;
					}
				}
			}
				
			return {
				key		: key,
				func	: func,
				type	: type,
				is_auto	: is_auto
			};
		}
		
		function getParseCommandArr(command) {
			if(command.indexOf(',') != -1) {
				//if(command.indexOf(':') != -1) throw new Error("JBINDER_BIND_ERR: bind array keys can not be used");
				
				var arr = command.split(","),
					commArr = new Array();
				
				for(var i=0, len=arr.length; i < len; i++) {
					commArr.push(getParseCommand(arr[i]));
				}
				
				return commArr;
			}
			
			return getParseCommand(command);
		}
		
		/**
		 * bind 태그일 경우, 
		 * 엘리먼트 유형에 따라 처리하는 함수
		 * 
		 * @param {Element} elem
		 * @param {String} value 
		 */
		function settingBindProc(func, elem, value) {
			var tmpComm = $(elem).attr(options.attr),
				tmpCommArr = getParseCommandArr(tmpComm),
				commArr = (tmpCommArr.length > 0) ? tmpCommArr : [ tmpCommArr ];
			
			for(var i=0, len=commArr.length; i < len; i++) {
				var comm = commArr[i];
				
				if(comm.func == func) {
					new ViewData(comm.type, elem).run(value);
				}
			}
		}	
		
		/**
		 * bind 태그일 경우, 
		 * 단일/멀티 유형에 따라 처리하는 함수
		 * 
		 * @param {Array} bindList
		 */
		function settingBindMulti(bindList) {
			var list = new Object();
			
			for(var i=0, len=bindList.length; i < len; i++) {
				var obj = bindList[i];
				if(!list[obj.name]) list[obj.name] = [];
				
				list[obj.name].push(obj.elem);
			}
			
			for(var func in list) {
				(function(func) {
					self[func] = function(value) {
						var elemList = list[func];
						
						for(var j=0, len=elemList.length; j < len; j++) {
							var elem = elemList[j];
							
							settingBindProc(func, elem, value);
						}
						
						return (elemList.length > 1) ? elemList : elemList[0];
					}
				})(func);
			}
		}
		
		/**
		 * bind 태그 메소드 세팅 함수
		 * bind일 경우, settingBindProc 호출
		 * 
		 * @param {Array} funcList
		 */
		function settingBindFunc(funcList) {
			for(var i=0, len=funcList.length; i < len; i++) {
				var func = funcList[i].func;
				
				(function(func) {
					self.funcMultiProc = function(key, value) {
						var data = getFuncElem(funcList, func, key);
						settingBindProc(func, data, value);
						
						return data;
					};
				})(func);
				
				function getFuncElem(funcList, func, key) {
					for(var i=0, len=funcList.length; i < len; i++) {
						var obj = funcList[i];
						
						if(obj.func == func && obj.key == key) {
							return obj.data;
						}
					}
				}
				
				self[func] = self.funcMultiProc;
			}
		}
		
		/**
		 * bind 태그 이벤트 오토 세팅 함수
		 * 
		 * @param {Array} autoList
		 */
		function settingBindAuto(autoList) {
			for(var i=0, len=autoList.length; i < len; i++) {
				var elem = autoList[i].elem,
					func = autoList[i].func,
					type = autoList[i].type;
				
				$(elem).unbind(type).on(type, function(e) {
					self[func]($(this).val());
				});
			}
		}
		
		/**
		 * bind/tag/act, 엘리먼트 또는 데이터을 가져오는 메소드
		 * 
		 * @param {String} key
		 * @param {Boolean} is_elem
		 */	
		function _search(key, is_elem) {
			var sel	= "[" + options.attr + "]",
				cmdList = [];
			
			$(root).find(sel).each(function(i) {
				var cmd_str = $(this).attr(options.attr),
					command = getParseCommandArr(cmd_str);
					command = (!command.length) ? [ command ] : command;
				
				for(var i = 0; i < command.length; i++) {
					if(key == command[i].func) {
						cmdList.push({ cmd: command[i], elem: this });
					}
				}
			});
			
			function getData(data) {
				return new ViewData(data.cmd.type, data.elem).run();
			}
			
			return (function(cmdList) {
				if(cmdList.length == 1 && !cmdList[0].cmd.key) {
					if(is_elem) return cmdList[0].elem;
					else return getData(cmdList[0]);
					
				} else {
					var list = new Object(),
						index = 0;
					
					for(var i=0, len=cmdList.length; i < len; i++) {
						var cmd = cmdList[i].cmd;
						
						if(cmd.key) { key = cmd.key; } 
						else { key = index; index++; }
						
						if(is_elem) list[key] = cmdList[i].elem;
						else list[key] = getData(cmdList[i]);
					}
					
					return list;
				}
			})(cmdList);
		}
		
		//-- Search API
		self.get = function(key) { return _search(key, true); }
		self.val = function(key) { return _search(key, false); }
		
		//-- Memory Returned API
		self.destroy = function() {
			$(root).off().remove();
			self.close(true);
		}
		
		self.close = function(isOff) {
			if(!isOff) $(root).off();
			for(var key in this) { delete this[key]; }
		}
		
		self.reload = function() {
			for(var key in this) { 
				if(!def_methods[key]) {
					delete this[key];
				}
			}
			
			init();
		}
		
		//-- Initialization
		init();
	}
	
	$.fn.jbinder = function(options) {
		var result = [], opts = $.extend({ 
			target: null,
			attr: "data-bind"
		}, options);
		
		$(this).each(function(i) {
			var binder = new JBinder(this, opts);
			result[i] = (opts.target != null) ? $.extend(opts.target, binder) : binder; 
		});
		
		return (result.length == 1) ? result[0] : result;
	}
	
})(window);