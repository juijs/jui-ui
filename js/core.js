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