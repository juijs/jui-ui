jui.define("core", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class core.UIManager
     * UI에 관련된 기본 로직 클래스 
     *  
     * @alternateClassName jui
     * @singleton
     *  
     */
	var UIManager = new function() {
		var instances = [], classes = [];

		
		/**
		 * Public Methods, Instance
		 * 
		 */
		this.add = function(uiIns) {
			instances.push(uiIns);
		}

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
				var uiList = instances[i];
				
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
            tpl: {},
            event: {},
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