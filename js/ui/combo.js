jui.define('ui.combo', [], function() {
	
	/**
	 * Common Logic
	 * 
	 */
	var hideAll = function() {
		var call_list = jui.get("combo");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i].list;
			
			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "open") ui_list[j].fold();
			}
		}
	}
	
	$(function() { 
		$("body").on("click", function(e) {
			hideAll();
		});
	});
	
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ui_list = null, ui_data = null;
		var index = -1;
					
		/**
		 * Private Methods
		 * 
		 */
		function load(type, data) {
			var $combo_root = ui_list["root"],
				$combo_text = ui_list["text"],
				$combo_drop = ui_list["drop"],
				$combo_list = $combo_drop.children("li");
			
			$combo_list.each(function(i) {
				var elem = getElement(this),
					value = $(elem).attr("value"),
					text = $(elem).text();
				
				if(!value) { 
					value = text;
					$(elem).attr("value", value);
				}
				
				if((type == "index" && data == i) || (type == "value" && data == value)) {
					ui_data = { index: i, value: value, text: text };
					
					$combo_root.attr("value", value);
					$combo_text.html(text);
				}
			});
			
			if($combo_list.size() == 0) {
				ui_data = null;
			}
		}
		
		function getElement(target) {
			return ($(target).children("a").size() > 0) ? $(target).children("a")[0] : target;
		}
		
		function setEventKeydown(self) {
			if(!self.options.keydown) return;
			
			self.addEvent(window, "keydown", function(e) {
				if(self.type == "hide") return;
				var $list = ui_list["drop"].children("li");
				
				if(e.which == 38) { // up
					if(index < 1) index = $list.size() - 1;
					else index--;
					
					selectItem(self, function() {
						index--;
						selectItem(self);
					});
					
					return false;
				}
				
				if(e.which == 40) { // down
					if(index < $list.size() - 1) index++;
					else index = 0;
					
					selectItem(self, function() {
						index++;
						selectItem(self);
					});
					
					return false;
				}
				
				if(e.which == 13) { // enter
					$list.eq(index).trigger("click");
					index = -1;
				}
			});
		}
		
		function selectItem(self, callback) {
			var $list = ui_list["drop"].children("li"),
				$target = $list.eq(index);
			
			$list.removeClass("active");

			if($target.val() != "" || $target.html() != "") {
				$target.addClass("active");
				
				if(self.options.height > 0) {
					ui_list["drop"].scrollTop(index * $target.outerHeight());
				}
			} else {
				if(typeof(callback) == "function") {
					callback();
				}
			}
		}
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					index: 0,
					value: "",
					width: 0,
					height: 100,
					keydown: false,
					position: "bottom"
				},
				valid: {
					setIndex: [ "integer" ],
					setValue: [ [ "integer", "string", "boolean" ] ]
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			var $combo_root 	= $(this.root),
				$combo_text 	= $combo_root.children(".btn").not(".btn-toggle"),
				$combo_toggle 	= $combo_root.children(".btn-toggle"),
				$combo_click	= $combo_root.children(".btn"),
				$combo_drop 	= $combo_root.children("ul");
					
			//-- 드롭다운은 중앙으로 위치 (그룹 스타일 좌/우 라운드 효과)
			$combo_drop.insertAfter($combo_text);
			
			// Width
			if(opts.width > 0) {
				$combo_text.outerWidth(opts.width - $combo_toggle.outerWidth() + 1);
				$combo_text.css({
					"overflow": "hidden",
					"white-space": "nowrap"
				});
			}
			
			// Height
			if(opts.height > 0) {
				$combo_drop.css({ "maxHeight": opts.height, "overflow": "auto" });
			}
			
			// Show
			this.addEvent($combo_click, "click", function(e) {
				if(self.type == "open") return;
				
				hideAll();
				self.open(e);
				
				return false;
			});
			
			// Select
			this.addEvent($combo_drop, "click", "li", function(e) {
				hideAll();
				
				var elem = getElement(e.target),
					value = $(elem).attr("value"),
					text = $(elem).html();
					
				ui_data = { value: value, text: text, element: elem };
				$combo_text.html(text);
				$combo_root.attr("value", value);
				
				self.emit("change", [ ui_data, e ]);
				e.preventDefault();
			});
			
			// Init
			ui_list = { root: $combo_root, text: $combo_text, drop: $combo_drop, toggle: $combo_toggle };

			this.type = "fold"; // 기본 타입 설정
			this.reload();
			
			//  Key up/down event
			setEventKeydown(this);
			
			return this;
		}
		
		this.setIndex = function(index) {
			load("index", index);
		}

		this.setValue = function(value) {
			load("value", value);
		}
		
		this.getData = function() {
			return ui_data;
		}
		
		this.getValue = function() {
			return (ui_data != null) ? ui_data["value"] : null;
		}

		this.getText = function() {
			return (ui_data != null) ? ui_data["text"] : null;
		}
		
		this.open = function(e) {
			ui_list["toggle"].addClass("active");
			ui_list["drop"].outerWidth(ui_list["root"].outerWidth() - 1);

			if(this.options.position == "top") {
				var h = ui_list["drop"].outerHeight();
				
				ui_list["drop"].animate({
				    top: "-" + h,
				    height: "toggle"
				}, 100);
			} else {
				ui_list["drop"].slideDown(100);
			}

			this.emit("open", e);
			this.type = "open";
		}
		
		this.fold = function() {
			ui_list["drop"].hide();
			ui_list["toggle"].removeClass("active");
			
			if(this.options.position == "top") {
				ui_list["drop"].css("top", 0);
			}
			
			this.emit("fold");
			this.type = "fold";
		}
		
		this.reload = function() {
			if(this.options.value != "") {
				load("value", this.options.value);
			} else {
				load("index", this.options.index);
			}
			
			this.emit("reload", ui_data);
		}
	}
	
	return UI;
});