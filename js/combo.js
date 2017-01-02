jui.defineUI("ui.combo", [ "jquery", "util.base" ], function($, _) {

	var hideAll = function() {
		var call_list = jui.get("ui.combo");

		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i];

			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "open") ui_list[j].fold();
			}
		}
	}

	$(function() {
		document.addEventListener("click", function(e) {
			hideAll();
		});
	});


	/**
	 * @class ui.combo
	 * @extends core
     * @alias Combo Box
	 * @requires jquery
	 * @requires util.base
	 */
	var UI = function() {
		var ui_list = null, ui_data = null;
		var index = -1;


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

					if ($combo_root.select && $combo_root.select[0] ) {
						$combo_root.select[0].selectedIndex = i;
					}
				}
			});

			if($combo_list.length == 0) {
				ui_data = null;
			}
		}

		function getElement(target) { // 드롭다운 메뉴 타겟
			return ($(target).children("a").length > 0) ? $(target).children("a")[0] : target;
		}

		function setEventKeydown(self) {
			if(!self.options.keydown) return;

            // 기본 상태 처리
            index = self.options.index;
            selectItem(self);

			self.addEvent(window, "keydown", function(e) {
				if(self.type == "fold") return;
				var $list = ui_list["drop"].children("li");

				if(e.which == 38) { // up
					if(index < 1) index = $list.length - 1;
					else index--;

					selectItem(self, function() {
						index--;
						selectItem(self);
					});

					return false;
				}

				if(e.which == 40) { // down
					if(index < $list.length - 1) index++;
					else index = 0;

					selectItem(self, function() {
						index++;
						selectItem(self);
					});

					return false;
				}

				if(e.which == 13) { // enter
					$list.eq(index).trigger("click");
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

		function makeSelectTouch(self) {
			if(!_.isTouch) return;

			var $combo_root = ui_list["root"];

			if ($combo_root.select && $combo_root.select[0]) {
				var $select = $combo_root.select;
				$select.empty();
			} else {
				var $select = $("<select></select>").css({
					position: "absolute",
					opacity : 0.01
				});

				$combo_root.find("ul").after($select);

				self.addEvent($select, "change", function(e) {
					var elem = $(e.currentTarget).find("option:selected").data("elem");
					self.addTrigger(elem, "touchstart");
				});

				$combo_root.select = $select;
			}

			$combo_root.find("ul > li").each(function(i, elem) {
				var value = $(elem).data('value');
				var text = $(elem).text();

				$select.append($("<option></option>").val(value).text(text).data("elem", elem));
			});
		}

		function getMaxListWidth() {
			var maxValue = 0;

			ui_list["drop"].children("li").each(function(i) {
				var elem = getElement(this);
				maxValue = Math.max(maxValue, $(elem).outerWidth());
			});

			return maxValue;
		}

		this.init = function() {
			var self = this, opts = this.options;

			var $combo_root 	= $(this.root),
				$combo_text 	= $combo_root.children(".btn").not(".toggle"),
				$combo_toggle 	= $combo_root.children(".toggle"),
				$combo_click	= $combo_root.children(".btn"),
				$combo_drop 	= $combo_root.children("ul");

			//-- 드롭다운은 중앙으로 위치 (그룹 스타일 좌/우 라운드 효과)
			$combo_drop.insertAfter($combo_text);

			// Width
			if(opts.width > 0) {
				$combo_text.outerWidth(opts.width - $combo_toggle.outerWidth() + 1);
				$combo_text.css({
					"overflow-x": "hidden",
					"overflow-y": "hidden",
					"white-space": "nowrap"
				});
			}

			// Height
			if(opts.height > 0) {
				$combo_drop.css({
					"overflow-x": "hidden",
					"overflow-y": "auto",
					"max-height": opts.height
				});
			}

			// Show
			this.addEvent($combo_click, "click", function(e) {
				if (_.isTouch) {
					$combo_root.select.focus();
				} else {
					if(self.type == "open") return;

					hideAll();
					self.open(e);
				}

				return false;
			});

			// Select
			this.addEvent($combo_drop, "click", "li:not(.divider)", function(e) {
				hideAll();

                var elem = getElement(this),
                    value = $(elem).attr("value"),
                    text = $(elem).text();

				ui_data = { value: value, text: text, element: elem };
				$combo_text.html(text);
				$combo_root.attr("value", value);

                self.emit("click", [ ui_data, e ]);
				self.emit("change", [ ui_data, e ]);

				e.preventDefault();
			});

			// Init
			ui_list = { root: $combo_root, text: $combo_text, drop: $combo_drop, toggle: $combo_toggle };

			this.type = "fold"; // 기본 타입 설정
			this.reload();

			//  Key up/down event
			setEventKeydown(this);
		}

		/**
		 * @method setIndex
		 * Selects a button of a specified index
         *
		 * @param {Number} index
		 */
		this.setIndex = function(index) {
			load("index", index);
			this.emit("change", [ ui_data ]);
		}

        /**
         * @method setValue
         * Selects a button having a specified value
         *
         * @param {Mixed} value
         */
		this.setValue = function(value) {
			load("value", value);
			this.emit("change", [ ui_data ]);
		}

        /**
         * @method getData
         * Gets the data of the button currently selected
         *
         * @return {Object}
         */
		this.getData = function() {
			return ui_data;
		}

        /**
         * @method getValue
         * Gets the value of the button currently selected
         *
         * @return {Mixed}
         */
		this.getValue = function() {
			return (ui_data != null) ? ui_data["value"] : null;
		}

        /**
         * @method getText
         * Gets the markup text of the button currently selected
         *
         * @return {String}
         */
		this.getText = function() {
			return (ui_data != null) ? ui_data["text"] : null;
		}

        /**
         * @method open
         * Shows the element list of a combo box
         */
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

			if(this.options.flex) {
				var maxWidth = getMaxListWidth();

				if(maxWidth > ui_list["drop"].outerWidth()) {
					ui_list["drop"].outerWidth(getMaxListWidth() + 50);
				}
			}

			this.emit("open", e);
			this.type = "open";
		}

        /**
         * @method fold
         * Hides the element list of a combo box
         */
		this.fold = function() {
			ui_list["drop"].hide();
			ui_list["toggle"].removeClass("active");

			if(this.options.position == "top") {
				ui_list["drop"].css("top", 0);
			}

			this.emit("fold");
			this.type = "fold";
		}

        /**
         * @method reload
         * Re-defines a combo box
         */
		this.reload = function() {
			if(this.options.value != "") {
				load("value", this.options.value);
			} else {
				load("index", this.options.index);
			}

			makeSelectTouch(this);

			this.emit("reload", ui_data);
		}
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {Integer} [index=0]
             * Determines an initial selection button with a specified index
             */
			index: 0,

            /**
             * @cfg {String} [value=0]
             * Determines an initial selection button with a specified value
             */
			value: "",

            /**
             * @cfg {Integer} [width=0]
             * Determines the horizontal size of a combo box
             */
			width: 0,

            /**
             * @cfg {Integer} [height=100]
             * Determines an initial selection button with a specified value
             */
			height: 100,

            /**
             * @cfg {Boolean} [keydown=false]
             * It is possible to select a node using the keyboard
             */
			keydown: false,

            /**
             * @cfg {"top"/"bottom"} [position="bottom"]
             * It is possible to determine an initial selection button with a specified value
             */
			position: "bottom",

			/**
			 * @cfg {Boolean} [flex=true]
			 * Drop-down menu is varied by changing the width function
			 */
			flex: true
        }
    }

    /**
     * @event change
     * Event which occurs when selecting a combo box
     *
     * @param {Object} data changed data
     * @param {EventObject} e The event object
     */

	/**
	 * @event click
	 * Event which occurs when selecting a combo box
	 *
	 * @param {Object} data changed data
	 * @param {EventObject} e The event object
	 */

	/**
	 * @event open
	 * Event which occurs when opening a combo box
	 */

	/**
	 * @event fold
	 * Event which occurs when folding a combo box
	 */

	return UI;
});
