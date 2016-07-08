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

            // TODO: 특정 클래스의 마크업에 한정하는거라 차후에 개선해야함
            if($tooltip != null) {
                $tooltip.find(".message").html(title);
            }
        }
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {String} [color="black"]
             * Determines the color of a tooltip
             */
            color: "null",

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
                item: "<div class='tooltip <!= position !>' <! if(color != null) { !>style='background-color: <!= color !>'<! } !>>" +
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