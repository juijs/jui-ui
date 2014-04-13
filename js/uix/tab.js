jui.define('uix.tab', [ 'util', 'ui.dropdown' ], function(_, dropdown) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ui_menu = null,
			index = -1, 
			info = { $root: null, $list: null, $anchor: null, activeIndex: 0 };
			
			
		/**
		 * Private Methods
		 * 
		 */
		function showTarget(target, elem, isInit) {
			$(target).children("*").each(function(i) {
				var self = this;
				
				if(("#" + self.id) == $(elem).attr("href")) {
					$(self).show();
				} else {
					$(self).hide();
				}
			});
		}
		
		function hideAll() {
			info.$list.removeClass("active");
		}
		
		function showMenu(elem) {
			var pos = $(elem).offset();
			
			$(elem).parent().addClass("menu-keep");
			ui_menu.show(pos.left, pos.top + info.$root.height());
		}
		
		function hideMenu() {
			var $menuTab = info.$list.eq(index);
			$menuTab.removeClass("menu-keep");
		}
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					target: "", 
					index: 0 
				},
				valid: {
					show: [ "integer" ]
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 컴포넌트 요소 세팅
			info.$root = $(this.root);
			info.$list = $(this.root).children("li");
			info.$anchor = $("<div class='anchor'></div>");
			
			// 드롭다운 메뉴 
			if(this.tpl.menu) {
				var $menu = $(this.tpl.menu());
				$menu.insertAfter(info.$root);
				
				ui_menu = dropdown($menu, {
					event: {
						change: function(data, e) {
							hideMenu();
							self.emit("changeMenu", [ data, e ]);
						},
						hide: function() {
							hideMenu();
						}
					}
				});
			}
			
			info.$list.each(function(i) {
				// 인덱스 설정
				if($(this).attr("class") == "active" || opts.index == i) { 
					var tmpObj = this;
					
					setTimeout(function() { // 최초에 숨겨진 컨텐츠 영역 처리
						info.$anchor.appendTo($(tmpObj));
						info.activeIndex = i;
						
						self.show(i);
					}, 10);
				}
				
				// 메뉴 설정
				if($(this).hasClass("menu")) 
					index = i;
			
				// 이벤트 설정
				self.addEvent($(this), "click", "a", function(e) {
					var text = $(e.currentTarget).text();
					
					if(i != index) { 
						if(opts.target != "") 
							showTarget(opts.target, this);
						
						self.emit("change", [ { index: i, text: text }, e ]);
						self.show(i);
						
						info.activeIndex = i;
					} else {
						self.emit("menu", [ { index: i, text: text }, e ]);
						if(ui_menu.type != "show") showMenu(this);
					}
					
					e.preventDefault();
				});
			});
			
			return this;
		}
		
		this.show = function(index) {
			hideAll();
			
			var $tab = info.$list.eq(index);
			$tab.addClass("active");
			
			info.$anchor.appendTo($tab);
			showTarget(this.options.target, $tab.find("a").get(0));
		}
		
		this.activeIndex = function() {
			return info.activeIndex;
		}
	}
	
	return UI;
});