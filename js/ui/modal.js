jui.defineUI("ui.modal", [ "util" ], function(_) {
	
	/**
	 * Common Logic
	 * 
	 */
	var win_width = 0;
	
	_.resize(function() {
		if(win_width == $(window).width()) return; 
		
		var call_list = jui.get("modal");
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i].list;
			
			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "show") {
					ui_list[j].resize();
				}
			}
		}
		
		win_width = $(window).width();
	}, 300);
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var $modal = null, $clone = null;
		var uiId = null, uiObj = null, uiTarget = null;
		var x = 0, y = 0, z_index = 5000;
		
		
		/**
		 * Private Methods
		 * 
		 */
		function setPrevStatus(self) {
			uiObj = { 
				"position": $(self.root).css("position"),
				"left": $(self.root).css("left"),
				"top": $(self.root).css("top"),
				"z-index": $(self.root).css("z-index"),
				"display": $(self.root).css("display")
			};
			
			uiTarget = {
				"position": $(self.options.target).css("position")
			};
		}
		
		function getModalInfo(self) {
			var x = "auto", y = "auto", h = 0;
			
			var target = self.options.target, 
				hTarget = (target == "body") ? window : target,
				pos = (target == "body") ? "fixed" : "absolute",
				tPos = (target == "body") ? null : "relative";
			
			x = ($(hTarget).width() / 2) - ($(self.root).width() / 2);
			y = ($(hTarget).height() / 2) - ($(self.root).height() / 2);
			
			h = $(target).outerHeight();
			h = (h > 0) ? h : $(hTarget).outerHeight();
			
			// inner modal일 경우
			if(tPos != null) {
				var sh = $(hTarget)[0].scrollHeight;
				
				h = (sh > h) ? sh : h;
				y = y + $(hTarget).scrollTop();
			}
			
			return {
				x: x, y: y, pos: pos, tPos: tPos, h: h
			}
		}
		
		function createModal(self, h) {
			if($modal != null) return;
			
			$modal = $("<div id='MODAL_" + self.timestamp + "'></div>").css({ 
				position: "absolute",
				width: "100%",
				height: h,
				left: 0,
				top: 0,
				opacity: self.options.opacity, 
				"background-color": self.options.color,
				"z-index": (z_index + self.options.index) - 1
			});
		
			// 모달 추가
			$(self.options.target).append($modal);
			
			// 루트 모달 옆으로 이동
			if(self.options.target != "body") {
				$(self.root).insertAfter($modal);
			}
			
			// 모달 닫기 이벤트 걸기
			self.addEvent($modal, "click", function(e) {
				if(self.options.autoHide) {
					self.hide();
				}
				
				return false;
			});
		}
		
		
		/**
		 * Public Methods
		 * 
		 */
		
		this.init = function() {
			setPrevStatus(this); // 이전 상태 저장
			this.type = "hide"; // 기본 타입 설정
		}
		
		this.hide = function() {
			// 모달 대상 객체가 숨겨진 상태가 아닐 경우..
			if(uiObj.display != "none") {
				$clone.remove();
				$clone = null;
			}
			
			$(this.options.target).css("position", uiTarget.position);
			$(this.root).css(uiObj);
			
			if($modal) {
				$modal.remove();
				$modal = null;
			}
			
			this.type = "hide";
		}
		
		this.show = function() {
			var info = getModalInfo(this);
			
			// 모달 대상 객체가 숨겨진 상태가 아닐 경우..
			if(uiObj.display != "none") {
				$clone = $(this.root).clone();
				$clone.insertAfter($(this.root));
			}

            // 위치 재조정
            this.resize();

			$(this.options.target).css("position", info.tPos);
			$(this.root).show();
			
			createModal(this, info.h);
			this.type = "show";
		}

        this.resize = function() {
            var info = getModalInfo(this);

            $(this.root).css({
                "position": info.pos,
                "left": info.x,
                "top": info.y,
                "z-index": (z_index + this.options.index)
            });

            if($modal != null) {
                $modal.height(info.h);
            }
        }
	}

    UI.setting = function() {
        return {
            options: {
                color: "black",
                opacity: 0.4,
                target: "body",
                index: 0,
                autoHide: true // 자신을 클릭했을 경우, hide
            }
        }
    }
	
	return UI;
}, "core");