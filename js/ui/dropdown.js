jui.define('ui.dropdown', [], function() {
	
	/**
	 * Common Logic
	 * 
	 */
	var hideAll = function() {
		var call_list = jui.get("dropdown");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i].list;
			
			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "show") ui_list[j].hide();
			}
		}
	}
	
	$(function() { 
		$("body").bind("click", function(e) {
			var tn = e.target.tagName;
			
			if(tn != "LI" && tn != "INPUT" && tn != "A" && tn != "BUTTON" && tn != "I") {
				hideAll();
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
				var target = e.currentTarget;
				self.emit("change", [ { text: $(target).html(), element: target, value: $(target).val() }, e ]);
				
				// close가 true일 경우, 전체 드롭다운 숨기기
				if(self.options.close) hideAll();
			});
			
			// 마우스 오버시 hover 클래스 제거
			self.addEvent($list, "hover", function(e) {
				$list.removeClass("hover");
			});
		}
		
		function setEventKeydown(self) {
			if(!self.options.keydown) return;
			
			self.addEvent(window, "keydown", function(e) {
				if(self.type == "hide") return;
				
				var $list = ui_list.menu.find("li");
				
				if(e.which == 38) { // up
					if(index < 0) index = $list.size() - 1;
					else index--;
					
					self.hover(index);
					return false;
				}
				
				if(e.which == 40) { // down
					if(index < $list.size() - 1) index++;
					else index = 0;
					
					self.hover(index);
					return false;
				}
				
				if(e.which == 13) { // enter
					$list.eq(index).trigger("click");
					index = -1;
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
					close: true,
					keydown: false,
					list: [],
					left: 0,
					top: 0
				},
				valid: {
					update: [ "array" ],
					show: [ "number", "number" ],
					move: [ "number", "number" ],
					hover: [ "integer" ]
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			var $dd_root = $(this.root),
				$dd_menu = $dd_root.children("ul"),
				$dd_anchor = $dd_root.children(".anchor");
			
			// UI 객체 추가
			ui_list = { root: $dd_root, menu: $dd_menu, anchor: $dd_anchor };

			// Size
			ui_list.root.outerWidth(ui_list.menu.outerWidth());
			
			// Select
			this.update(opts.list);
			this.move(opts.left, opts.top);
			this.type = "hide"; // 기본 타입 설정
			
			return this;
		}
		
		this.update = function(list) {
			if(typeof(list) == "object" && this.tpl.li) {
				$(ui_list.menu).empty();
				
				for(var i = 0; i < list.length; i++) {
					$(ui_list.menu).append(this.tpl.li(list[i]));
				}
			}
			
			setEvent(this);
			setEventKeydown(this);
		}
		
		this.hide = function() {
			ui_list.root.hide();
			
			this.emit("hide");
			this.type = "hide";
		}
		
		this.show = function(x, y) {
			hideAll();
			
			ui_list.root.show();
			
			// Options
			if(ui_list.anchor.size() > 0) 
				ui_list.root.css("margin-top", "10px");
			
			//
			if(x || y) this.move(x, y);
			
			this.emit("show");
			this.type = "show";
		}
		
		this.move = function(x, y) {
			if(x) ui_list.root.css("left", x);
			if(y) ui_list.root.css("top", y);
		}
		
		this.hover = function(index) {
			var $list = ui_list.menu.find("li");
			
			$list.removeClass("hover");
			$list.eq(index).addClass("hover");
		}
	}
	
	return UI;
});