jui.defineUI("ui.dropdown", [ "jquery" ], function($) {

	var hideAll = function() {
		var dd = getDropdown();

		if(dd != null) {
			dd.hide();
		}
	}

	var getDropdown = function() {
		var call_list = jui.get("ui.dropdown");

		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i];

			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "show") return ui_list[j];
			}
		}

		return null;
	}

	$(function() {
		document.addEventListener("click", function(e) {
			var tn = e.target.tagName;

			if(tn != "LI" && tn != "INPUT" && tn != "A" && tn != "BUTTON" && tn != "I") {
				hideAll();
			}
		});

		window.addEventListener("keydown", function(e) {
			var dd = getDropdown();

			if(dd != null) {
				dd.wheel(e.which, function() {
					e.preventDefault();
				});
			}
		});
	});


    /**
     * @class ui.dropdown
     * Dropdown is a UI component that is frequently used in multiple UI components such as combo box, navigation, table, ect
     *
     * @extends core
     * @alias Dropdown
     * @requires jquery
     *
     */
	var UI = function() {
		var ui_list = null, index = -1;

		function setEventNodes(self) {
			var $list = $(ui_list.menu).find("li");

			// 이벤트 걸린거 초기화
			$list.off("click").off("hover");

			// 클릭 이벤트 설정
			self.addEvent($list, "click", function(e) {
				if($(this).hasClass("divider") || $(this).hasClass("title") || $(this).hasClass("disabled")) return;

				var index = getTargetIndex(this),
					text = $(this).text(),
					value = $(this).attr("value");

				self.emit("change", [ { index: index, value: value, text: text }, e ]);

				// close가 true일 경우, 전체 드롭다운 숨기기
				if(self.options.close) hideAll();

				// A 태그일 경우에는 이벤트 막기
				if(e.target.tagName == "A") {
					e.preventDefault();
				}
			});

			// 마우스 오버시 hover 클래스 제거
			self.addEvent($list, "hover", function(e) {
				$list.removeClass("active");
			});

			function getTargetIndex(elem) {
				var result = 0;

				$list.each(function(i) {
					if(elem == this) {
						result = i;
					}
				});

				return result;
			}
		}

		function selectItem(self, callback) {
			var $list = ui_list.menu.find("li"),
				$target = $list.eq(index);

			$list.removeClass("active");

			if($target.val() != "" || $target.html() != "") {
				$target.addClass("active");

				if(self.options.height > 0) {
					ui_list.menu.scrollTop(index * $target.outerHeight());
				}
			} else {
				if(typeof(callback) == "function") {
					callback();
				}
			}
		}

		this.init = function() {
			var opts = this.options;

			var $dd_root = $(this.root),
				$dd_menu = $dd_root.find("ul"),
				$dd_anchor = $dd_root.find(".anchor");

			// 메인 설정, 없을 경우에는 root가 메인이 됨
			$dd_menu = ($dd_menu.length == 0) ? $dd_root : $dd_menu;

			// UI 객체 추가
			ui_list = { root: $dd_root, menu: $dd_menu, anchor: $dd_anchor };

			// Size
			ui_list.root.outerWidth(ui_list.menu.outerWidth());

			// Width
			if(opts.width > 0) {
				$dd_menu.outerWidth(opts.width);
			}

			// Height
			if(opts.height > 0) {
				$dd_menu.css({ "maxHeight": opts.height, "overflow": "auto" });
			}

			// Left
			if(opts.left > 0) {
				$dd_root.css("left", opts.left);
			}

			// Top
			if(opts.top > 0) {
				$dd_root.css("top", opts.top);
			}

			// Default Styles
			$dd_menu.css({ "display": "block" });
			$dd_root.css({ "position": "absolute", "display": "none" });

			// 드롭다운 목록 갱신
			if(opts.nodes.length > 0) {
				this.update(opts.nodes);
			} else {
				setEventNodes(this);
			}

			this.type = "hide"; // 기본 타입 설정
		}

        /**
         * @method update
         * Changes the dropdown list
         *
         * @param {Array} nodes Dropdown list
         */
		this.update = function(nodes) {
			if(!this.tpl.node) return;

			$(ui_list.menu).empty();

			for(var i = 0; i < nodes.length; i++) {
				$(ui_list.menu).append(this.tpl.node(nodes[i]));
			}

			setEventNodes(this);
		}

        /**
         * @method hide
         * Hides the dropdown
         */
		this.hide = function() {
			ui_list.root.hide();

			this.emit("hide");
			this.type = "hide";
		}

        /**
         * @method show
         * Shows a dropdown at the specified coordinates
         *
         * @param {Integer} x
         * @param {Integer} y
         */
		this.show = function(x, y) {
			hideAll();

			ui_list.root.show();

			// Anchor 옵션 처리
			if(ui_list.anchor.length > 0)
				ui_list.root.css("margin-top", "10px");

			// x, y 값이 있을 경우
			if(arguments.length == 2) {
				this.move(x, y);
			}

			this.emit("show");
			this.type = "show";
		}

        /**
         * @method move
         * Moves a dropdown to the specified coordinates
         *
         * @param {Integer} x
         * @param {Integer} y
         */
		this.move = function(x, y) {
			ui_list.root.css("left", x);
			ui_list.root.css("top", y);
		}

        /**
         * @method wheel
         * Changes a selected node upwards when the key is set to -1, or downwards when the key is set to 1. If the key is set to 0, the speciified node is selected
         *
         * @param {Integer} key
         * @param {Function} callback
         */
		this.wheel = function(key, callback) {
			if(!this.options.keydown) return;

			var self = this,
				$list = ui_list.menu.find("li");

			// 탭을 눌렀을 경우, 드롭다운 숨기기
			if(key == 9) {
				this.hide();
				return;
			}

			if(key == 38 || key == -1) { // up
				if(index < 1) index = $list.length - 1;
				else index--;

				selectItem(this, function() {
					index--;
					selectItem(self);
				});

				if(callback) callback();
			}

			if(key == 40 || key == 1) { // down
				if(index < $list.length - 1) index++;
				else index = 0;

				selectItem(self, function() {
					index++;
					selectItem(self);
				});

				if(callback) callback();
			}

			if(key == 13 || key == 0 || !key) { // enter
				self.addTrigger($list.eq(index), "click");
				index = -1;

				if(callback) callback();
			}
		}

        /**
         * @method reload
         * Reloads the dropdown list
         */
		this.reload = function() {
			this.init();
			this.emit("reload");
		}
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {Boolean} [close=true]
             * Closes the Auto when clicking on the dropdown list
             */
			close: true,

            /**
             * @cfg {Boolean} [keydown=false]
             * It is possible to choose anything on the dropdown list with the arrow keys on the keyboard
             */
			keydown: false,

            /**
             * @cfg {Integer} [left=0]
             * Sets the X coordinate of the dropdown list
             */
			left: 0,

            /**
             * @cfg {Integer} [top=0]
             * Sets the Y coordinate of the dropdown list
             */
			top: 0,

            /**
             * @cfg {Integer} [width=0]
             * Determines the horizontal size of a dropdown list
             */
			width: 0,

            /**
             * @cfg {Integer} [height=0]
             * Determines the vertical size of a dropdown list
             */
			height: 0,

            /**
             * @cfg {Array} nodes
             * Sets a dropdown list to data rather than markup
             */
			nodes: []
        }
    }

    /**
     * @event change
     * Event that occurs when anything on the dropdown list is selected
     *
     * @param {Object} data
     * @param {EventObject} e The event object
     */

    /**
     * @event show
     * Event that occurs when a dropdown is shown
     */

    /**
     * @event hide
     * Event that occurs when a dropdown is hidden
     */

    /**
     * @event reload
     * Event that occurs when a dropdown is reloaded
     */

	return UI;
});
