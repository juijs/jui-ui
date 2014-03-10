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