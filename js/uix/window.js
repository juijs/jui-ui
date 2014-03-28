jui.define('uix.window', [ 'util', 'ui.modal' ], function(_, modal) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var z_index = 2000,
			target = null,
			move = {},
			resize = {},
			info = {},
			ui_modal = null;
		
		
		/**
		 * Private Methods
		 *
		 */
		function setBodyResize() {
			var bottom = (info.$foot.length < 1) ? parseInt(info.$root.css("border-radius")) : info.$foot.outerHeight();
			info.$body.outerHeight(info.$root.outerHeight() - info.$head.outerHeight() - bottom);
		}
		
		
		/**
		 * Public Methods & Options
		 *
		 */
		this.setting = function() {
			function animateVisible(self, style) {
				$(self.root).addClass(style)
				.css({
					"animation-duration": "500ms",
					"animation-fill-mode": "both"
				});
				
				self.addEvent(self.root, 'AnimationEnd', function() {
					$(self.root).removeClass(style);
				});
			}
			
			return {
				options: {
					width: 400,
					height: 300,
					left: "auto",
					top: "auto",
					right: "auto",
					bottom: "auto",
					modal: false,
					move: true,
					resize: true,
					modalIndex: 0,
					animate: false
				},
				valid: {
					show: [ "integer", "integer" ],
					move: [ "integer", "integer" ],
					update: [ "string" ],
					setTitle: [ "string" ],
					setSize: [ "integer", "integer" ]
				},
				animate: {
					show: {
						after: function() {
							animateVisible(this, "fadeInDown");
						}
					},
					hide: {
						before: function() {
							animateVisible(this, "fadeOutUp");
						},
						after: function() {
							$(this.root).removeClass("fadeOutUp");
						},
						delay: 500
					},
					move: {
						after: function() {
							animateVisible(this, "shake");
						}
					}
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			var $win_root = $(this.root),
				$win_head = $(this.root).children(".head"),
				$win_body = $(this.root).children(".body"),
				$win_foot = $(this.root).children(".foot"),
				$body = $("body");
				
			// 옵션 예외 처리
			if(opts.modal) {
				opts.move = false;
				opts.resize = false;
			}
				
			// UI 객체 추가
			info = { $root: $win_root, $head: $win_head, $body: $win_body, $foot: $win_foot };
			
			// 기본 스타일 & Modal 스타일 & Body로 강제 이동
			$body.children(this.selector).remove();
			$win_root.css(opts).appendTo($body);
			
			// 윈도우 이동
			if(opts.move) {
				this.addEvent($win_head, "mousedown", function(e) {
					target = $win_root;
					
					move.check = true;
					move.disX = e.pageX - target.offset().left;
					move.disY = e.pageY - target.offset().top;
				});
			}
			
			// 윈도우 리사이징
			if(opts.resize) {
				$win_root.append("<i class='icon-resize resize'></i>");
				
				this.addEvent($win_root.children(".resize"), "mousedown", function(e) {
					target = $win_root;
					
					resize.check = true;
					resize.disX = target.width() + target.offset().left;
					resize.disWidth = target.width();
					resize.disY = target.height() + target.offset().top;
					resize.disHeight = target.height();
					
					return false;
				});
			}
			
			// 윈도우 포커스
			if(!opts.modal) {
				self.addEvent($win_root, "mousedown", function(e) {
					$win_root.css("z-index", ++z_index);
					e.stopPropagation();
				});
			}
			
			// 윈도우 숨기기
			this.addEvent($win_head.find(".close"), "click", function(e) {
				self.hide();
				return false;
			});
			
			this.addEvent("body", "mousemove", function(e) {
				// 윈도우 이동
				if(move.check) {
					var x = e.pageX - move.disX;
					var y = e.pageY - move.disY;
					
					$(target).css({ left: x + "px", top: y + "px" });
				}

				// 윈도우 리사이징
				if(resize.check) {
					var resizeX = e.pageX - resize.disX,
						resizeY = e.pageY - resize.disY;
					
					target.width(resize.disWidth + resizeX);
					target.height(resize.disHeight + resizeY);
					
					setBodyResize();
				}
			});
			
			this.addEvent("body", "mouseup", function(e) {
				if(move.check) self.emit("move", e); 
				if(resize.check) self.emit("resize", e);
				
				move.check = false;
				resize.check = false;
			});
			
			// 기본 타입 설정
			this.type = "hide";
			
			// 바디 리사이징
			setBodyResize();
			
			// Init
			setTimeout(function() {
				$win_root.hide();
				
				if(opts.modal) {
					var modalOpts = (opts.modalIndex > 0) ? { index: opts.modalIndex } : {};
					ui_modal = modal(self.selector, $.extend({ autoHide: false }, modalOpts));
				}
			}, 10);
			
			return this;
		}
		
		this.hide = function() {
			if(ui_modal) ui_modal.hide();
			else info.$root.hide();
			
			this.emit("hide");
			this.type = "hide";
		}
		
		this.show = function(x, y) {
			if(ui_modal) ui_modal.show();
			else info.$root.show();
			
			if(x || y) this.move(x, y);
			
			this.emit("show");
			this.type = "show";
		}
		
		this.move = function(x, y) {
			info.$root.css("left", x);
			info.$root.css("top", y);
		}
		
		this.update = function(html) {
			info.$body.empty().html(html);
		}
		
		this.setTitle = function(html) {
			info.$head.find(".title").empty().html(html);
		}
		
		this.setSize = function(w, h) {
			info.$root.width(w);
			info.$root.height(h);
			
			setBodyResize();
		}
		
		this.resize = function() {
			setBodyResize();
		}
	}
	
	return UI;
});