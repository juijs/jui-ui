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
                "top":    		{ top: padding, bottom: "auto", left: padding, right: padding },
                "top-right":    { top: padding, bottom: "auto", left: "auto", right: padding },
                "top-left":     { top: padding, bottom: "auto", left: padding, right: "auto" },
                "bottom":  		{ top: "auto", bottom: padding, left: padding, right: padding },
                "bottom-right": { top: "auto", bottom: padding, left: "auto", right: padding },
                "bottom-left":  { top: "auto", bottom: padding, left: padding, right: padding }
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