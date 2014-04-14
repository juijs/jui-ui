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