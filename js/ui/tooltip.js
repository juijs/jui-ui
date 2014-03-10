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