jui.defineUI("ui.button", [ "jquery", "util.base" ], function($, _) {

    var UIRadio = function(ui, element, options) {
		this.data = { index: 0, value: "", elem: null };
		
		this.ui = ui;
		this.element = element;
		this.options = $.extend({ index: 0, value: "" }, options);
		
		// Private
		this._setting = function(type, e, order) {
			var self = this,
				className = "active",
				index = this.options.index,
				value = this.options.value;

			$(self.element).children(".btn").each(function(i) {
				if(type == "event") {
					if(e.currentTarget == this) on(i, this);
					else off(this);
				} else if(type == "init") {
					if(order == "value") {
						if(value == $(this).attr("value")) on(i, this);
						else off(this);
					} else {
						if(index == i) on(i, this);
						else off(this);
					}
				}
			});

			function on(i, elem) {
				var value = $(elem).attr("value"),
					text = $(elem).text();

				self.data = { index: i, value: value, text: text };
				$(elem).addClass(className);
			}

			function off(elem) {
				$(elem).removeClass(className);
			}
		}


		this.init = function() {
			var self = this;

			// Event
			this.ui.addEvent($(self.element).children(".btn"), "click", function(e) {
				self._setting("event", e);

                self.ui.emit("click", [ self.data, e ]);
				self.ui.emit("change", [ self.data, e ]);

				e.preventDefault();
			});

			// Init
			if(this.options.value != "") {
				this._setting("init", this.options.value, "value");
			} else {
				this._setting("init", this.options.index, "index");
			}
		}
	}

	var UICheck = function() {
		this.data = [];
		this.options = $.extend({ index: [], value: [] }, this.options);

		this._setting = function(type, e, order) {
			var self = this,
				className = "active",
				index = this.options.index,
				value = this.options.value;

			$(self.element).children(".btn").each(function(i) {
				if(type == "init") {
					if(order == "value") {
						if(inArray(value, $(this).attr("value"))) on(i, this);
						else off(i, this);
					} else {
						if(inArray(index, i)) on(i, this);
						else off(i, this);
					}
				} else {
					if(e.currentTarget == this) {
						if(!$(this).hasClass("active")) on(i, this);
						else off(i, this);
					}
				}
			});
			
			function on(i, elem) {
				var value = $(elem).attr("value"),
					text = $(elem).text();
			
				self.data[i] = { index: i, value: value, text: text };
				$(elem).addClass(className);
			}
			
			function off(i, elem) {
				self.data[i] = null;
				$(elem).removeClass(className);
			}
			
			function inArray(arr, val) {
				for(var i = 0; i < arr.length; i++) {
					if(arr[i] == val) return true;
				}
				
				return false;
			}
		}
	}

	/**
	 * @class ui.button
	 * @extends core
	 * @alias Button
	 * @requires jquery
	 * @requires util.base
	 */
	var UI = function() {
		var ui_list = {};

		this.init = function() {
            var self = this, opts = this.options;
			
			if(opts.type == "radio") {
				ui_list[opts.type] = new UIRadio(self, this.root, self.options);
				ui_list[opts.type].init();
			} else if(opts.type == "check") {
				UICheck.prototype = new UIRadio(self, this.root, self.options);
				
				ui_list[opts.type] = new UICheck();
				ui_list[opts.type].init();
			}
		}

		/**
		 * @method setIndex
         * Selects a button of a specified index
         *
		 * @param {Array} indexList Index for button check
		 */
		this.setIndex = function(indexList) {
            var btn = ui_list[this.options.type];

			btn.options.index = indexList;
            btn._setting("init", null, "index");

            this.emit("change", [ btn.data ]);
		}

		/**
		 * @method setValue
         * Selects a button with a specified value
         *
		 * @param {Array} valueList Values for button check
		 */
		this.setValue = function(valueList) {
            var btn = ui_list[this.options.type];

            btn.options.value = valueList;
            btn._setting("init", null, "value");

            this.emit("change", [ btn.data ]);
		}

		/**
		 * @method getData
         * Gets the data of the button currently selected
         *
		 * @return {Array}
		 */
		this.getData = function() {
			return ui_list[this.options.type].data;
		}

		/**
		 * @method getValue
         * Gets the value of the button currently selected
         *
		 * @return {Array} Values
		 * @return {Object} Value
		 */
		this.getValue = function() {
            var data = this.getData();

            if(_.typeCheck("array", data)) { // 타입이 체크일 경우
                var values = [];

                for(var i = 0; i < data.length; i++) {
                    values[i] = (data[i] != null) ? data[i].value : data[i];
                }

                return values;
            }

			return data.value;
		}

		/**
		 * @method reload
		 * Re-defines the button UI
		 */
		this.reload = function() {
			ui_list[this.options.type]._setting("init");
		}
	}

    UI.setup = function() {
        return {
			/**
			 * @cfg {String} [type="radio"]
             * Determines whether to use a radio/check button
			 */
			type: "radio",

			/**
			 * @cfg {Integer} [index=0]
			 * Determines an initial selection button with a specified index
			 */
			index: 0,

			/**
			 * @cfg {String} [index=""]
			 * Determines an initial selection button with a specified value
			 */
			value: ""
        }
    }

    /**
     * @event change
     * Event that occurs when clicking on a button
     *
     * @param {Object} data Data of the selected button
     * @param {jQueryEvent} e The event object
     */

	/**
	 * @event click
	 * Event that occurs when clicking on a button
	 *
	 * @param {Object} data Data of the selected button
	 * @param {jQueryEvent} e The event object
	 */
	
	return UI;
});
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
			
			if($combo_list.size() == 0) {
				ui_data = null;
			}
		}
		
		function getElement(target) { // 드롭다운 메뉴 타겟
			return ($(target).children("a").size() > 0) ? $(target).children("a")[0] : target;
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
jui.defineUI("ui.datepicker", [ "jquery", "util.base" ], function($, _) {

    function getStartDate(date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        return date;
    }

    /**
     * @class ui.datepicker
     * @extends core
     * @alias Date Picker
     * @requires jquery
     * @requires util.base
     */
    var UI = function() {
    	var year = null, month = null, date = null,
            selDate = null, items = {}; // 헌재 페이지의 요소 엘리먼트 캐싱
        var $head = null, $body = null;
        var minDate = null, maxDate = null;


        function setCalendarEvent(self) {
            self.addEvent($head.children(".prev"), "click", function(e) {
                self.prev(e);
            });

            self.addEvent($head.children(".next"), "click", function(e) {
                self.next(e);
            });
        }

        function setCalendarDate(self, no) {
        	var opts = self.options;

            if(opts.type == "daily") {
            	var m = (month < 10) ? "0" + month : month,
            		d = (no < 10) ? "0" + no : no;
                selDate = new Date(year + "/" + m + "/" + d);
            } else if(opts.type == "monthly") {
            	var m = (no < 10) ? "0" + no : no;
                selDate = new Date(year + "/" + m + "/01");
            } else if(opts.type == "yearly") {
                selDate = new Date(no + "/01/01");
            }

            // 0시 0분 0초 0밀리 초로 설정
            selDate = getStartDate(selDate);
        }

        function getCalendarDate(self) {
        	var opts = self.options,
        		tmpDate = null;

        	if(opts.type == "daily") {
        		var m = (month < 10) ? "0" + month : month;
        		tmpDate = new Date(year + "/" + m + "/01");
        	} else if(opts.type == "monthly") {
        		tmpDate = new Date(year + "/01/01");
        	} else if(opts.type == "yearly") {
        		tmpDate = new Date();
        	}

        	return getStartDate(tmpDate);
        }

        function getCalendarHtml(self, obj) {
            var opts = self.options,
                resHtml = [],
                tmpItems = [];

            // 활성화 날짜 캐시 초기화
            items = {};

            if(self.tpl["date"]) {
                for(var i = 0; i < obj.objs.length; i++) {
                    tmpItems.push(self.tpl["date"]({
                        type: obj.objs[i].type,
                        date: obj.objs[i].no,
                        day: tmpItems.length
                    }));

                    if(isNextBr(i)) {
                        resHtml.push("<tr>" + tmpItems.join("") + "</tr>");
                        tmpItems = [];
                    }
                }
            } else {
                for(var i = 0; i < obj.objs.length; i++) {
                    tmpItems.push(obj.nums[i]);

                    if(isNextBr(i)) {
                        resHtml.push(self.tpl["dates"]({ dates: tmpItems }));
                        tmpItems = [];
                    }
                }
            }

            var $list = $(resHtml.join(""));
            $list.find("td").each(function(i) {
                $(this).addClass(obj.objs[i].type);

                self.addEvent(this, "click", function(e) {
                    if(obj.objs[i].type == "none") return;

                    $body.find("td").removeClass("active");
                    $(this).addClass("active");

                    setCalendarDate(self, obj.objs[i].no);
                    self.emit("select", [ self.getFormat(), e ]);
                });

                if(obj.objs[i].type != "none") {
                	items[obj.objs[i].no] = this;
                }
            });

            function isNextBr(i) {
                return (opts.type == "daily") ? ((i + 1) % 7 == 0) : ((i + 1) % 3 == 0);
            }

            return $list;
        }

        function getLastDate(year, month) {
            if(month == 2) {
                if(year % 100 != 0 && (year % 4 == 0 || year % 400 == 0))
                    return 29;
                else
                    return 28;
            } else {
                var months = [ 31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
                return months[month - 1];
            }
        }

        function getDateList(self, y, m) {
            var objs = [],
                nums = [],
                no = 1;

            var d = new Date(),
                start = new Date(y + "-" + ((m < 10) ? "0" + m : m)).getDay(),
                ldate = getLastDate(y, m), sdate = 0;

            var prevYear = (m == 1) ? y - 1 : y,
                prevMonth = (m == 1) ? 12 : m - 1,
                prevLastDay = getLastDate(prevYear, prevMonth);

            // 최소 날짜로 시작일 설정
            if(minDate && minDate.getFullYear() == y && minDate.getMonth() + 1 == m) {
                sdate = minDate.getDate();
            }

            // 최대 날짜로 종료일 설정
            if(maxDate && maxDate.getFullYear() == y && maxDate.getMonth() + 1 == m) {
                ldate = maxDate.getDate();
            }

            for(var i = 0; i < start; i++) {
                nums[i] = (prevLastDay - start) + (i + 1);
                objs[i] = { type: "none", no: nums[i] };
            }

            for(var i = start; i < 42; i++) {
                if(sdate <= no && no <= ldate) {
                    var type = "";

                    if(d.getMonth() + 1 == m && d.getDate() == no) {
                        type = "now";
                    }

                    if(selDate != null) {
                        if(selDate.getFullYear() == y && selDate.getMonth() + 1 == m && selDate.getDate() == no) {
                            type = "active";
                        }
                    }

                    nums[i] = no;
                    objs[i] = { type: type, no: nums[i] };
                    no++;
                } else {
                    nums[i] = no - ldate;
                    objs[i] = { type: "none", no: nums[i] };
                    no++;
                }
            }

            return { objs: objs, nums: nums };
        }

        function getMonthList(y) {
            var objs = [],
                nums = [];

            var d = new Date();

            for(var i = 1; i <= 12; i++) {
                var type = "";

                if(d.getFullYear() == y && d.getMonth() + 1 == i) {
                    type = "now";
                }

                if(selDate != null) {
                    if(selDate.getFullYear() == y && selDate.getMonth() + 1 == i) {
                        type = "active";
                    }
                }

                nums.push(i);
                objs.push({ type: type, no: i });
            }

            return { objs: objs, nums: nums };
        }

        function getYearList(y) {
            var objs = [],
                nums = [],
                startYear = y - 4;

            var d = new Date();

            for(var i = startYear; i < startYear + 12; i++) {
                var type = "";

                if(d.getFullYear() == i) {
                    type = "now";
                }

                if(selDate != null) {
                    if(selDate.getFullYear() == i) {
                        type = "active";
                    }
                }

                nums.push(i);
                objs.push({ type: type, no: i });
            }

            return { objs: objs, nums: nums };
        }

        function checkDate(y, m, d) {
            if(minDate) {
                var minY = minDate.getFullYear(), minM = minDate.getMonth() + 1, minD = minDate.getDate();
                if (y < minY || (y >= minY && m < minM)) return [minY, minM, minD];
            }
            if(maxDate) {
                var maxY = maxDate.getFullYear(),maxM = maxDate.getMonth() + 1, maxD = maxDate.getDate()
                if (y > maxY || (y <= maxY && m > maxM)) return [maxY, maxM, maxD];
            }
            return [y, m, d];
        }

        this.init = function() {
            var opts = this.options;

            $head = $(this.root).children(".head");
            $body = $(this.root).children(".body");
            minDate = (_.typeCheck("date", opts.minDate)) ? opts.minDate : null;
            maxDate = (_.typeCheck("date", opts.maxDate)) ? opts.maxDate : null;

            if(opts.type == "daily") {
                // 기본 날짜가 최소 날짜나 최대 날짜보다 작거나 큰 경우
                if(opts.date < minDate) {
                    opts.date = minDate;
                } else if(opts.date < minDate) {
                    opts.date = maxDate;
                }

                // 최소 날짜와 최대 날짜가 서로 교차하는 경우
                if(minDate && maxDate && maxDate < minDate) {
                    minDate = null;
                    maxDate = null;
                }
            }

            // 이벤트 정의
            setCalendarEvent(this);

            // 기본 날짜 설정
            this.select(opts.date);
        }

        /**
         * @method page
         * Outputs a calendar that fits the year/month entered
         *
         * @param {Integer} year
         * @param {Integer} month
         */
        this.page = function(y, m) {
            if(arguments.length == 0) return;
            var opts = this.options;

            if(opts.type == "daily") {
                year = y;
                month = m;

                $body.find("tr:not(:first-child)").remove();
                $body.append(getCalendarHtml(this, getDateList(this, year, month)));
            } else if(opts.type == "monthly") {
                year = y;

                $body.find("tr").remove();
                $body.append(getCalendarHtml(this, getMonthList(year)));
            } else if(opts.type == "yearly") {
                year = y;

                $body.find("tr").remove();
                $body.append(getCalendarHtml(this, getYearList(year)));
            }

            $head.children(".title").html(_.dateFormat(getCalendarDate(this), opts.titleFormat));
        }

        /**
         * @method prev
         * Outputs a calendar that fits the previous year/month
         *
         */
        this.prev = function(e) {
            var opts = this.options;

            if(opts.type == "daily") {
                var y = (month == 1) ? year - 1 : year,
                    m = (month == 1) ? 12 : month - 1;

                if(minDate && minDate.getFullYear() == year && minDate.getMonth() + 1 == month) {
                    return;
                }

                this.page(y, m);
            } else if(opts.type == "monthly") {
                this.page(year - 1);
            } else if(opts.type == "yearly") {
                this.page(year - 12);
            }

            this.emit("prev", [ e ]);
        }

        /**
         * @method next
         * Outputs a calendar that fits the next year/month
         *
         */
        this.next = function(e) {
            var opts = this.options;

            if(opts.type == "daily") {
                var y = (month == 12) ? year + 1 : year,
                    m = (month == 12) ? 1 : month + 1;

                if(maxDate && maxDate.getFullYear() == year && maxDate.getMonth() + 1 == month) {
                    return;
                }

                this.page(y, m);
            } else if(opts.type == "monthly") {
                this.page(year + 1);
            } else if(opts.type == "yearly") {
                this.page(year + 12);
            }

            this.emit("next", [ e ]);
        }

        /**
         * @method select
         * Selects today if there is no value, or selects a date applicable to a timestamp or year/month/date
         *
         * @param {"year"/"month"/"date"/"timestamp"/"Date"}
         */
        this.select = function() {
        	var opts = this.options,
        		args = arguments;

        	if(args.length == 0) {
        		y = year;
        		m = month;
        		d = date;
        	} else if(args.length == 3) {
        		y = args[0];
        		m = args[1];
        		d = args[2];
        	} else if(args.length == 1) {
        		var time = (_.typeCheck("date", args[0])) ? args[0] : new Date(args[0]);

        		y = time.getFullYear();
        		m = time.getMonth() + 1;
        		d = time.getDate();
        	}

            if(opts.type == "daily") {
                // 최소일과 최대일이 교차하는 경우
                if(minDate || maxDate) {
                    var checkedDate = checkDate(y, m, d);
                    this.page(checkedDate[0], checkedDate[1]);
                	this.addTrigger(items[checkedDate[2]], "click");
                }

            	this.page(y, m);
            	this.addTrigger(items[d], "click");
            } else if(opts.type == "monthly") {
            	this.page(y);
            	this.addTrigger(items[m], "click");
            } else if(opts.type == "yearly") {
                this.page(y);
                this.addTrigger(items[y], "click");
            }
        }

        /**
         * @method addTime
         * Selects a date corresponding to the time added to the currently selected date
         *
         * @param {"Integer"/"Date"} time Timestamp or Date
         */
        this.addTime = function(time) {
        	selDate = new Date(this.getTime() + time);
        	this.select(this.getTime());
        }

        /**
         * @method getDate
         * Gets the value of the date currently selected
         *
         * @return {Date} Date object
         */
        this.getDate = function() {
            return selDate;
        }

        /**
         * @method getTime
         * Gets the timestamp value of the date currently selected
         *
         * @return {Integer} Timestamp
         */
        this.getTime = function() {
            return selDate.getTime();
        }

        /**
         * @method getFormat
         * Gets a date string that fits the format entered
         *
         * @return {String} format Formatted date string
         */
        this.getFormat = function(format) {
            return _.dateFormat(selDate, (typeof(format) == "string") ? format : this.options.format);
        }

        /**
         * @method reload
         * Reloads the datepicker
         */
        this.reload = function() {
            var opts = this.options;
            minDate = (_.typeCheck("date", opts.minDate)) ? opts.minDate : null;
            maxDate = (_.typeCheck("date", opts.maxDate)) ? opts.maxDate : null;

            if(opts.type == "daily") {
                // 기본 날짜가 최소 날짜나 최대 날짜보다 작거나 큰 경우
                if(opts.date < minDate) {
                    opts.date = minDate;
                } else if(opts.date < minDate) {
                    opts.date = maxDate;
                }
            }

            this.select();
            this.emit("reload");
        }
    }

    UI.setup = function() {
        var now = getStartDate(new Date());

        return {
            /**
             * @cfg {"daily"/"monthly"/"yearly"} [type="daily"]
             * Determines the type of a calendar
             */
            type: "daily",

            /**
             * @cfg {String} [titleFormat="yyyy.MM"]
             * Title format of a calendar
             */
            titleFormat: "yyyy.MM",

            /**
             * @cfg {String} [format="yyyy-MM-dd"]
             * Format of the date handed over when selecting a specific date
             */
            format: "yyyy-MM-dd",

            /**
             * @cfg {Date} [date="now"]
             * Selects a specific date as a basic
             */
            date: now,

            /**
             * @cfg {Boolean} [animate=false]
             * @deprecated
             */
            animate: false,

            /**
             * @cfg {Date} [minDate="null"]
             * Selects a specific minimum date
             */
            minDate: null,

            /**
             * @cfg {Date} [maxDate="null"]
             * Selects a specific maximum date
             */
            maxDate: null
        };
    }

    /**
     * @event select
     * Event that occurs when selecting a specific date
     *
     * @param {String} value Formatted date string
     * @param {EventObject} e The event object
     */

    /**
     * @event prev
     * Event that occurs when clicking on the previous button
     *
     * @param {EventObject} e The event object
     */

    /**
     * @event next
     * Event that occurs when clicking on the next button
     *
     * @param {EventObject} e The event object
     */

    return UI;
});

jui.defineUI("ui.colorpicker", [ "jquery", "util.base", "util.color" ], function($, _, color) {

    /**
     * @class ui.colorpicker
     * @extends core
     * @alias ColorPicker
     * @requires jquery
     * @requires util.base
     * @requires util.color
     */
    var UI = function() {
        var self, opts, dist;
        var hue_color = [
            { rgb : '#ff0000', start : .0 },
            { rgb : '#ffff00', start : .17 },
            { rgb : '#00ff00', start : .33 },
            { rgb : '#00ffff', start : .50 },
            { rgb : '#0000ff', start : .67 },
            { rgb : '#ff00ff', start : .83 },
            { rgb : '#ff0000', start : 1 }
        ];

        var $root, $hue, $color, $value, $saturation, $drag_pointer, $drag_bar,
            $control, $controlPattern, $controlColor, $hueContainer, $opacity, $opacityContainer,
            $opacityInput, $opacity_drag_bar, $information, $informationTitle1, $informationTitle2,
            $informationTitle3, $informationTitle4, $informationInput1, $informationInput2,
            $informationInput3, $informationInput4;

        function setInputColor(evtType) {
            var rgb = null;

            if (evtType == 'hex') {
                rgb = color.rgb($informationInput1.val());

                $informationInput2.val(rgb.r);
                $informationInput3.val(rgb.g);
                $informationInput4.val(rgb.b);

            } else if (evtType == 'rgb') {
                $informationInput1.val(color.format({
                    r : parseInt($informationInput2.val(), 10),
                    g : parseInt($informationInput3.val(), 10),
                    b : parseInt($informationInput4.val(), 10)
                }, 'hex'));

                rgb = color.rgb($informationInput1.val());

            } else {
                var str = self.getColor('hex');

                $informationInput1.val(str);

                rgb = color.rgb($informationInput1.val());
                $informationInput2.val(rgb.r);
                $informationInput3.val(rgb.g);
                $informationInput4.val(rgb.b);
            }

            // set alpha
            rgb.a = caculateOpacity();

            // set background
            $controlColor.css("background-color", color.format(rgb, 'hex'));
            $opacityInput.val(Math.floor(rgb.a * 100) + "%");

            // emit change
            self.emit("change", [ color.format(rgb, 'hex' ), rgb ]);
        }

        function setMainColor(e) {
            var offset = $color.offset();
            var w = $color.width();
            var h = $color.height();

            var x = e.clientX - offset.left;
            var y = e.clientY - offset.top;

            if (x < 0) x = 0;
            else if (x > w) x = w;

            if (y < 0) y = 0;
            else if (y > h) y = h;

            $drag_pointer.css({
                left: x - 5,
                top: y - 5
            }).data('pos', { x: x, y : y});

            setInputColor();
        }

        function checkHueColor(p) {
            var startColor, endColor;

            for(var i = 0; i < hue_color.length;i++) {
                if (hue_color[i].start >= p) {
                    startColor = hue_color[i-1];
                    endColor = hue_color[i];
                    break;
                }
            }

            if (startColor && endColor) {
                var scale = color.scale().domain(startColor.rgb, endColor.rgb);

                return scale((p - startColor.start)/(endColor.start - startColor.start), 'hex');
            }

            return null;
        }

        function setHueColor(e) {
            var min = $hueContainer.offset().left;
            var max = min + $hueContainer.width();
            var current = pos(e).clientX;

            if (current < min) {
                dist = 0;
            } else if (current > max) {
                dist = 100;
            } else {
                dist = (current - min) / (max - min) * 100;
            }

            var x = ($hue.width() * (dist/100));

            $drag_bar.css({
                left: (x -Math.ceil($drag_bar.width()/2)) + 'px'
            }).data('pos', { x : x});

            var hueColor = checkHueColor(dist/100);
            $color.css("background-color", hueColor);

            setInputColor();
        }

        function setOpacity(e) {
            var min = $opacity.offset().left;
            var max = min + $opacity.width();
            var current = pos(e).clientX;

            if (current < min) {
                dist = 0;
            } else if (current > max) {
                dist = 100;
            } else {
                dist = (current - min) / (max - min) * 100;
            }

            var x = ($opacity.width() * (dist/100));

            $opacity_drag_bar.css({
                left: (x -Math.ceil($opacity_drag_bar.width()/2)) + 'px'
            }).data('pos', { x : x});

            setInputColor();
        }

        function caculateOpacity() {
            var opacityPos = $opacity_drag_bar.data('pos') || { x : 0 };
            var a = Math.round((opacityPos.x / $opacity.width()) * 100) / 100;

            return a;
        }

        function calculateColor() {
            var pos = $drag_pointer.data('pos') || { x : 0, y : 0 };
            var huePos = $drag_bar.data('pos') || { x : 0 };

            var width = $color.width();
            var height = $color.height();

            var h = (huePos.x / $hue.width()) * 360;
            var s = (pos.x / width);
            var v = ((height - pos.y) / height);

            var rgb = color.HSVtoRGB(h, s, v);
            rgb.a = caculateOpacity();

            return rgb;
        }

        function selectDom(tag, attr) {
            var tag = !tag ? "div" : tag,
                $dom = $("<" + tag + " />");

            if(typeof(attr) == "object") {
                $dom.attr(attr);
            }

            return $dom;
        };

        function pos(e) {
            if (_.isTouch) {
                return e.originalEvent.touches[0];
            }

            return e;
        }

        function checkNumberKey(e) {
            var code = e.which,
                isExcept = false;

            if(code == 37 || code == 39 || code == 8 || code == 46 || code == 9)
                isExcept = true;

            if(!isExcept && (code < 48 || code > 57))
                return false;

            return true;
        }

        function setRGBtoHexColor(e) {
            var r = $informationInput2.val(),
                g = $informationInput3.val(),
                b = $informationInput4.val();

            if(r == "" || g == "" || b == "") return;

            if(parseInt(r) > 255) $informationInput2.val(255);
            else $informationInput2.val(parseInt(r));

            if(parseInt(g) > 255) $informationInput3.val(255);
            else $informationInput3.val(parseInt(g));

            if(parseInt(b) > 255) $informationInput4.val(255);
            else $informationInput4.val(parseInt(b));

            initColor(color.format({
                r: parseInt($informationInput2.val()),
                g: parseInt($informationInput3.val()),
                b: parseInt($informationInput4.val())
            }, "hex"), "rgb");
        }

        function initColor(newColor, evtType) {
            var c = newColor || self.options.color,
                rgb = color.rgb(c);

            $color.css("background-color", c);

            var hsv = color.RGBtoHSV(rgb.r, rgb.g, rgb.b),
                x = $color.width() * hsv.s,
                y = $color.height() * (1-hsv.v);

            $drag_pointer.css({
                left : x - 5,
                top : y - 5
            }).data('pos', { x  : x, y : y });

            var hueX = $hue.width() * (hsv.h / 360);

            $drag_bar.css({
                left : hueX - 7.5
            }).data('pos', { x : hueX });

            var opacityX = $opacity.width() * (rgb.a || 0);

            $opacity_drag_bar.css({
                left : opacityX - 7.5
            }).data('pos', { x : opacityX });

            setInputColor(evtType);
        }

        function initEvent() {
            self.addEvent($color, 'mousedown', function(e) {
                $color.data('isDown', true);
                setMainColor(e);
            });

            self.addEvent($color, 'mouseup', function(e) {
                $color.data('isDown', false);
            });

            self.addEvent($drag_bar, 'mousedown', function(e) {
                e.preventDefault();
                $hue.data('isDown', true);
            });

            self.addEvent($opacity_drag_bar, 'mousedown', function(e) {
                e.preventDefault();
                $opacity.data('isDown', true);
            });

            self.addEvent($hueContainer, 'mousedown', function(e) {
                $hue.data('isDown', true);
                setHueColor(e);
            });

            self.addEvent($opacityContainer, 'mousedown', function(e) {
                $opacity.data('isDown', true);
                setOpacity(e);
            });

            self.addEvent($informationInput1, 'keydown', function(e) {
                if(e.which < 65 || e.which > 70) {
                    return checkNumberKey(e);
                }
            });
            self.addEvent($informationInput1, 'keyup', function(e) {
                var code = $(this).val();

                if(code.charAt(0) == '#' && code.length == 7) {
                    initColor(code, 'hex');
                }
            });

            self.addEvent($informationInput2, 'keydown', checkNumberKey);
            self.addEvent($informationInput2, 'keyup', setRGBtoHexColor);
            self.addEvent($informationInput3, 'keydown', checkNumberKey);
            self.addEvent($informationInput3, 'keyup', setRGBtoHexColor);
            self.addEvent($informationInput4, 'keydown', checkNumberKey);
            self.addEvent($informationInput4, 'keyup', setRGBtoHexColor);

            self.addEvent(document, 'mouseup', function (e) {
                $color.data('isDown', false);
                $hue.data('isDown', false);
                $opacity.data('isDown', false);
            });

            self.addEvent(document, 'mousemove', function (e) {
                if ($color.data('isDown')) {
                    setMainColor(e);
                }

                if ($hue.data('isDown')) {
                    setHueColor(e);
                }

                if ($opacity.data('isDown')) {
                    setOpacity(e);
                }
            });
        }

        this.init = function() {
            self = this, opts = this.options;

            $root = $(this.root);
            $color = selectDom('div', { 'class': 'color' });
            $drag_pointer = selectDom('div', { 'class': 'drag-pointer' });
            $value = selectDom('div', { 'class': 'value' });
            $saturation = selectDom('div', { 'class': 'saturation' });

            $control = selectDom('div', { 'class': 'control' });
            $controlPattern = selectDom('div', { 'class': 'empty' });
            $controlColor = selectDom('div', { 'class': 'color' });
            $hue = selectDom('div', { 'class': 'hue' });
            $hueContainer = selectDom('div', { 'class': 'container' });
            $drag_bar = selectDom('div', { 'class': 'drag-bar' });
            $opacity = selectDom('div', { 'class': 'opacity' });
            $opacityContainer = selectDom('div', { 'class': 'container' });
            $opacityInput = selectDom('input', { 'class': 'input', 'type': 'text', 'disabled': true });
            $opacity_drag_bar = selectDom('div', { 'class': 'drag-bar2' });

            $information = selectDom('div', { 'class': 'information' });
            $informationTitle1 = selectDom('div', { 'class': 'title' }).html("HEX");
            $informationTitle2 = selectDom('div', { 'class': 'title' }).html("R");
            $informationTitle3 = selectDom('div', { 'class': 'title' }).html("G");
            $informationTitle4 = selectDom('div', { 'class': 'title' }).html("B");
            $informationInput1 = selectDom('input', { 'class': 'input', 'type': 'text', 'maxlength': 7 });
            $informationInput2 = selectDom('input', { 'class': 'input', 'type': 'text', 'maxlength': 3  });
            $informationInput3 = selectDom('input', { 'class': 'input', 'type': 'text', 'maxlength': 3  });
            $informationInput4 = selectDom('input', { 'class': 'input', 'type': 'text', 'maxlength': 3  });

            $value.html($drag_pointer);
            $saturation.html($value);
            $color.html($saturation);

            $hueContainer.html($drag_bar);
            $hue.html($hueContainer);

            $opacityContainer.html($opacity_drag_bar);
            $opacity.html($opacityContainer);

            $control.append($hue);
            $control.append($opacity);
            $control.append($opacityInput);
            $control.append($controlPattern);
            $control.append($controlColor);

            $information.append($informationInput1);
            $information.append($informationInput2);
            $information.append($informationInput3);
            $information.append($informationInput4);
            $information.append($informationTitle1);
            $information.append($informationTitle2);
            $information.append($informationTitle3);
            $information.append($informationTitle4);

            $root.html($color);
            $root.append($control);
            $root.append($information);

            initEvent();
            initColor();
        }

        this.setColor = function(value) {
            if(typeof(value) == "object") {
                if(!value.r || !value.g || !value.b)
                    return;

                initColor(color.format(value, "hex"));
            } else if(typeof(value) == "string") {
                if(value.charAt(0) != "#")
                    return;

                initColor(value);
            }
        }

        this.getColor = function(type) {
            var rgb = calculateColor();

            if (type) {
                if (type == 'hex') {
                    if (rgb.a < 1) {
                        type = 'rgb';
                    }
                }
                return color.format(rgb, type);
            }

            return rgb;
        }
    }

    UI.setup = function() {
        return {
            type : 'full',
            color : '#FF0000'
        }
    }

    return UI;
});
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
				if($(this).hasClass("divider") || $(this).hasClass("title")) return;
				
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
			$dd_menu = ($dd_menu.size() == 0) ? $dd_root : $dd_menu;
			
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
			if(ui_list.anchor.size() > 0) 
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
				if(index < 1) index = $list.size() - 1;
				else index--;
				
				selectItem(this, function() {
					index--;
					selectItem(self);
				});
				
				if(callback) callback();
			}
			
			if(key == 40 || key == 1) { // down
				if(index < $list.size() - 1) index++;
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
jui.defineUI("ui.modal", [ "jquery", "util.base" ], function($, _) {

	var win_width = 0;
	
	_.resize(function() {
		if(win_width == $(window).width()) return; 
		
		var call_list = jui.get("ui.modal");
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i];
			
			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "show") {
					ui_list[j].resize();
				}
			}
		}
		
		win_width = $(window).width();
	}, 300);

    /**
     * @class ui.modal
     * Developed as a separate component so that the modal, which is used in UI components such as window or loading, can be used more universally
     *
     * @extends core
     * @alias Modal
     * @requires jquery
     * @requires util.base
     *
     */
	var UI = function() {
		var $modal = {}, $clone = null;
		var uiObj = null, uiTarget = null;
		var z_index = 5000;
		
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

		function getInnerModalPosition(target) {
			if(target == "body") {
				return null;
			} else {
				if($(target).hasClass("msgbox") || $(target).hasClass("window")) {
					return "absolute";
				} else {
					return "relative";
				}
			}
		}
		
		function getModalInfo(self) {
			var target = self.options.target,
				hTarget = (target == "body") ? window : target,
				pos = (target == "body") ? "fixed" : "absolute",
				tPos = getInnerModalPosition(target),
                sLeft = $(target).scrollLeft();
			
			var x = (($(hTarget).width() / 2) - ($(self.root).width() / 2)) + $(target).scrollLeft(),
				y = ($(hTarget).height() / 2) - ($(self.root).height() / 2);

			var w = (sLeft > 0) ? $(target).outerWidth() + sLeft : "100%",
				h = $(target).outerHeight();

			// inner modal일 경우
			if(tPos != null) {
				var sh = $(hTarget)[0].scrollHeight;
				
				h = (sh > h) ? sh : h;
				y = y + $(hTarget).scrollTop();

			// global modal일 경우
			} else {
				var sh = $(window).outerHeight();

				h = (h > sh) ? h : sh;
			}
			
			return {
				x: x, y: y, pos: pos, tPos: tPos, w: w, h: h
			}
		}
		
		function createModal(self, w, h) {
			var mi = self.timestamp;
			
			if( $modal[mi] != null) return;
			
			$modal[mi] = $("<div id='MODAL_" + self.timestamp + "'></div>").css({ 
				position: "absolute",
				width: w,
				height: h,
				left: 0,
				top: 0,
				opacity: self.options.opacity, 
				"background-color": self.options.color,
				"z-index": (z_index + self.options.index) - 1
			});
		
			// 모달 추가
			$(self.options.target).append($modal[mi]);
			
			// 루트 모달 옆으로 이동
			$(self.root).insertAfter($modal[mi]);

			// 모달 닫기 이벤트 걸기
			self.addEvent($modal[mi], "click", function(e) {
				if(self.options.autoHide) {
					self.hide();
				}
				
				return false;
			});
		}

		this.init = function() {
			setPrevStatus(this); // 이전 상태 저장

			// 대상의 기본 상태는 숨기기
			if(!this.options.clone) {
				$(this.root).hide();
			}

			// 타입 프로퍼티 설정
			this.type = "hide";
		}

        /**
         * @method hide
         * Hides a modal
         */
		this.hide = function() {
			var opts = this.options,
				mi = this.timestamp;

			// 모달 대상 객체가 숨겨진 상태가 아닐 경우..
			if(opts.clone) {
				$clone.remove();
				$clone = null;
			}
			
			$(opts.target).css("position", uiTarget.position);
			$(this.root).css(uiObj);
			
			if($modal[mi]) {
				$modal[mi].remove();
				delete $modal[mi]; 
			}
			
			this.type = "hide";
		}

        /**
         * @method show
         * Shows a modal
         */
		this.show = function() {
			var opts = this.options,
				info = getModalInfo(this);

			// 모달 대상 객체가 숨겨진 상태가 아닐 경우..
			if(opts.clone) {
				$clone = $(this.root).clone();
				$clone.insertAfter($(this.root));
			}

            // 위치 재조정
			$(this.root).appendTo(opts.target);
            this.resize();

			$(opts.target).css("position", info.tPos);
			$(this.root).show();

			createModal(this, info.w, info.h);
			this.type = "show";
		}

        /**
         * @method resize
         * Re-adjust the location of a modal
         */
        this.resize = function() {
            var info = getModalInfo(this),
            	mi = this.timestamp;

            $(this.root).css({
                "position": info.pos,
                "left": info.x,
                "top": info.y,
                "z-index": (z_index + this.options.index)
            });

            if($modal[mi] != null) {
            	$modal[mi].height(info.h);
            }
        }
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {"black"/"gray"} [color="black"]
             * Determines the color of a modal
             */
			color: "black",

            /**
             * @cfg {Float} [opacity=0.4]
             * Sets the transparency of a modal
             */
			opacity: 0.4,

            /**
             * @cfg {String/DOMElement} [target="body"]
             * Sets a selector on which a modal is shown
             */
			target: "body",

            /**
             * @cfg {Integer} [index=0]
             * Determines the sequence (index) of a modal
             */
			index: 0,

            /**
             * @cfg {Boolean} [clone=false]
             * Copies an existing modal and shows it
             */
			clone: false,

            /**
             * @cfg {Boolean} [autoHide=true]
             * Automatically hides a modal when clicking on it
             */
			autoHide: true
        }
    }
	
	return UI;
});

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
jui.defineUI("ui.paging", [ "jquery" ], function($) {

    /**
     * @class ui.paging
     * Paging component that can be applied to a screen with tables or various other data
     *
     * @extends core
     * @alias Paging
     * @requires jquery
     */
	var UI = function() {
		var activePage = 1, lastPage = 1;
		var $main = null;

		function setEventAction(self) {
			self.addEvent($(self.root).find(".prev"), "click", function(e) {
				self.prev();
				return false;
			});
			
			self.addEvent($(self.root).find(".next"), "click", function(e) {
				self.next();
				return false;
			});
		}
		
		function setEventPage(self) {
			self.addEvent($main.find(".page"), "click", function(e) {
				var page = parseInt($(e.currentTarget).text());
				self.page(page);
				
				return false;
			});
		}
		
		function setPageStyle(self, page) {
			var $list = $main.find(".page");
			
			$list.each(function(i) {
				if($(this).text() == page) {
					$(this).addClass("active");
				} else {
					$(this).removeClass("active");
				}
			});
		}
		
		function changePage(self, pNo) {
			var pages = [], 
				end = (lastPage < self.options.screenCount) ? lastPage : self.options.screenCount,
				start = pNo - Math.ceil(end / 2) + 1,
				start = (start < 1) ? 1 : start;
			
			activePage = (pNo > lastPage) ? lastPage : pNo;
			activePage = (pNo < 1) ? 1 : pNo;
			
			if(lastPage < start + end) {
				for(var i = lastPage - end + 1; i < lastPage + 1; i++) {
					pages.push(i);
				}
				
				if(activePage > lastPage) activePage = lastPage;
			} else {
				for(var i = start; i < start + end; i++) {
					pages.push(i);
				}
			}
			
			// 템플릿 적용
			$main.html(self.tpl["pages"]({ pages: pages, lastPage: lastPage }));
			
			setEventAction(self);
			setEventPage(self);
			setPageStyle(self, activePage);
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 페이징 메인 설정, 없을 경우에는 root가 메인이 됨
			$main = $(self.root).find(".list");
			$main = ($main.size() == 0) ? $(self.root) : $main;
			
			// 페이지 리로드
			this.reload();
			
			return this;
		}

        /**
         * @method reload
         * Reloads the number of specified data records, or reloads the initially configured number of data records if there is no parameter
         *
         * @param {Integer} count Data total count
         */
		this.reload = function(count) {
			var count = (!count) ? this.options.count : count;
			
			activePage = 1;
			lastPage = Math.ceil(count / this.options.pageCount);
			
			changePage(this, activePage);
			this.emit("reload");
		}

        /**
         * @method page
         * Changes to a specified page number, and gets the currently enabled page number if there is no parameter
         *
         * @param {Integer} pNo Page number
         */
		this.page = function(pNo) {
			if(!pNo) return activePage;
			
			changePage(this, pNo);
			this.emit("page", [ activePage ]);
		}

        /**
         * @method next
         * Changes to the next page
         */
		this.next = function() {
			this.page(activePage + 1);
		}

        /**
         * @method prev
         * Changes to the previous page
         */
		this.prev = function() {
			this.page(activePage - 1);
		}

        /**
         * @method first
         * Changes to the first page
         */
		this.first = function() {
			this.page(1);
		}

        /**
         * @method last
         * Changes to the last page
         */
		this.last = function() {
			this.page(lastPage);
		}
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {Integer} [count=0]
             * Total number of data records subject to paging)
             */
			count: 0,

            /**
             * @cfg {Integer} [pageCount=10]
             * Number of data records per page
             */
			pageCount: 10,

            /**
             * @cfg {Integer} [screenCount=5]
             * Number of pages shown on the paging screen
             */
			screenCount: 5
        }
    }

    /**
     * @event page
     * Event that occurs when the page is changed
     *
     * @param {Integer} page Active page number
     */

    /**
     * @event reload
     * Event that occurs when the page is reloaded
     */
	
	return UI;
});
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
jui.defineUI("ui.layout", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class ui.layout
     * Layout can split the screen into areas and each area will be resizable
     *
     * @extends core
     * @alias Layout
     * @requires jquery
     * @requires util.base
     *
     */
	var UI = function() {
		var ui_layout = null, 
			ui_options = {}, 
			directions = [ 'top','left','right','bottom','center' ];
		
		var resizerIcons = { 
			top: 'n-resize', 
			bottom: 'n-resize', 
			right: 'e-resize', 
			left: 'e-resize' 
		};
		
		function setEvent($resizer, move, down, up) {
			$resizer.mousedown(function(e) {
				$resizer.data('mousedown', true);
				
				var $shadow = $resizer.clone();
				
				$resizer.data('shadow', $shadow);
				$resizer.after($shadow);
				
				down.call(this, e);
				$shadow.css('opacity', 0.3);
				
				$(document).on('mousemove', move);
				$(document).on('mouseup', function mouseUp(e) {
					$(document).off('mousemove', move);
					$(document).off('mouseup', mouseUp);
						
					up.call(this, e);
          			$resizer.data('mousedown', false);					
          			
					$shadow.remove();
					$("body :not(.resize)").css({ 'user-select' : '' })						
				});
				
				$("body :not(.resize)").css({ 'user-select' : 'none' })
			});
		}
		
		function setPosition(height, first, arr, second) {
			arr = arr || [];
			
			if(ui_layout[height]) {
				ui_layout[height].height(first);
			}
			
			if(typeof arr == 'string') arr = [arr];
			if(arr.length == 0) return;
			
			for(var i = 0, len = arr.length; i < len; i++) {
				var $obj = ui_layout[arr[i]];
				
				if($obj) {
					$obj.css({ top : second })
					if($obj.resizer) $obj.resizer.css({ top : second })					
				}
			}
		}
		
		function setResizer(direction) {
			var $first, $second, $layout, $resizer, options;

			$layout = ui_layout[direction];
			$resizer = $layout.resizer;

			$resizer.css({
				cursor : resizerIcons[direction]
			})			
			
			if($resizer.data('event')) return; 
			
			if(direction == 'top') {
				setEvent($resizer, function(e) {
					if(!$resizer.data('mousedown')) return; 
					
					var top = e.clientY - $resizer.data('current');
					var min = ui_options.top.min;
					var max = ui_options.top.max;
					if(min <= top && top < max) {
						$resizer.css({top : top + 'px'});
					}
					
				}, function(e) {
					var top = $resizer.position().top;										 
					$resizer.data('current', e.clientY - top);
				}, function(e) {

					var top = $resizer.position().top;					
					var height = $resizer.height();					
	
					var first = top;
					var second = (top + $resizer.height()) + 'px';
						
					var pre_height = ui_layout.top.height();
					ui_layout.top.height(first);
					
					var dh = pre_height - first;
					var new_height = ui_layout.center.height() + dh;
					
					ui_layout.center.css({top : second}).height(new_height);			
					ui_layout.left.css({top : second}).height(new_height);			
					ui_layout.left.resizer.css({top : second}).height(new_height);			
					ui_layout.right.css({top : second}).height(new_height);			
					ui_layout.right.resizer.css({top : second}).height(new_height);			
				});
		
			} else if(direction == 'bottom') {
				setEvent($resizer, function(e) {
					if(!$resizer.data('mousedown')) return; 
					
					var top = e.clientY - $resizer.data('current');
					var min = ui_options.bottom.min;
					var max = ui_options.bottom.max;
					
					var dh =  $layout.position().top - (top + ui_options.barSize);
					var real_height = dh + $layout.height();
					
					if(min <= real_height && real_height <= max ) {
						$resizer.css({top : top + 'px'});	
					}
				}, function(e) {
					var top = $resizer.position().top;										 
					$resizer.data('current', e.clientY - top);
				}, function(e) {
					var top = $resizer.position().top + $resizer.height();
					
					var max = ui_layout.root.height();
					var dh = parseFloat(ui_layout.bottom.position().top) - top;
					
					ui_layout.bottom.css({ top : top + "px"});
					ui_layout.bottom.height(ui_layout.bottom.height() + dh);
					
					var new_height = ui_layout.center.height() - dh;
					
					ui_layout.center.height(new_height);			
					ui_layout.left.height(new_height);			
					ui_layout.left.resizer.height(new_height);			
					ui_layout.right.height(new_height);			
					ui_layout.right.resizer.height(new_height);		
				});				
			} else if(direction == 'left') {
				setEvent($resizer, function(e) {
					if(!$resizer.data('mousedown')) return; 
					
					var left = e.clientX - $resizer.data('current');
					var min = ui_options.left.min;
					var max = ui_options.left.max;
					if(min <= left && left < max) {
						$resizer.css({left : left + 'px'});
					}
				}, function(e) {
					var left = $resizer.position().left;										 
					$resizer.data('left', left).data('current', e.clientX - left);
				}, function(e) {
          			if(!$resizer.data('mousedown')) return; 
          					
					var left = $resizer.position().left;
					var pre_left = $resizer.data('left');
					var dw = pre_left - left;
					
					ui_layout.left.css({ width : left + "px"});
					ui_layout.center.css({ left : (left + ui_options.barSize ) + "px" });
          			ui_layout.center.width(ui_layout.center.width() + dw);
				});	
			} else if(direction == 'right') {
        		setEvent($resizer, function(e) {
					if(!$resizer.data('mousedown')) return; 
					  
					var left = e.clientX - $resizer.data('current');
					var min = ui_options.right.min;
					var max = ui_options.right.max;
					  
					var sizeLeft = ui_layout.left.width() + ui_layout.left.resizer.width();
					var sizeCenter = ui_layout.center.width();
					var current = $layout.width() - (left - (sizeLeft + sizeCenter));
					  
					if(min <= current && current < max) {
						$resizer.css({left : left + 'px'});  
					}
		        }, function(e) {
		        	var left = $resizer.position().left;                     
		        	$resizer.data('left', left).data('current', e.clientX - left);
		        }, function(e) {
					if(!$resizer.data('mousedown')) return; 
					
					var left = $resizer.position().left;
					var pre_left = $resizer.data('left');
					var dw = pre_left - left;
					
					ui_layout.right.css({ 
						left : (left + $resizer.width()) + 'px',
						width : (ui_layout.right.width() + dw) + "px"
					});
					ui_layout.center.width(ui_layout.center.width() - dw);		          
		        });			  
			}
			
			$resizer.data('event', true);
		}

        function initLayout(self) {
            for(var i = 0, len = directions.length; i < len; i++) {
                var direct = ui_layout[directions[i]];

                if(direct) {
                    ui_layout.root.append(direct);

                    if(directions[i] != 'center') {
                        if(ui_options[directions[i]].resize) {
                            if(!direct.resizer) {
                                direct.resizer = $("<div class='resize " + directions[i] + "' />");
                            }

                            ui_layout.root.append(direct.resizer);
                            setResizer(directions[i]);
                        }
                    }
                }
            }

            self.resize();
        }
	
		this.init = function() {
			var self = this, opts = this.options;
			var $root, $top, $left, $right, $bottom, $center;
			
			$root = $(this.root).css("position", "relative");
			
			if(opts.width != null) {
				$root.outerWidth(opts.width);
			}

			if(opts.height != null) {
				$root.outerHeight(opts.height);
			}
			
			$top = (opts.top.el) ? $(opts.top.el) : $root.find("> .top");				
			if($top.length == 0) $top = null; 
			
			$left = (opts.left.el) ? $(opts.left.el) : $root.find("> .left");
			if($left.length == 0) $left = null;

			
			$right = (opts.right.el) ? $(opts.right.el) : $root.find("> .right"); 
			if($right.length == 0) $right = null;
			
			$bottom = (opts.bottom.el) ? $(opts.bottom.el) : $root.find("> .bottom"); 
			if($bottom.length == 0) $bottom = null;
			
			$center = (opts.center.el) ? $(opts.center.el) : $root.find("> .center"); 
			if($center.length == 0) $center = null;
			
			ui_layout = { 
				root 	: $root, 
				top 	: $top, 
				left 	: $left,
				right 	: $right, 
				bottom 	: $bottom,
				center	: $center
			};
			
			ui_options = opts;
			initLayout(this);
			
			$(window).on('resize', function(e) {
				self.resize();
			})
 
			return this; 			
		}

        /**
         * @method resize
         * Resets the layout
         */
		this.resize = function() {
			var $obj = null, $option = null;
            var sizeTop = 0, sizeLeft = 0, sizeRight = 0, sizeBottom = 0, sizeCenter = 0 ;
			
			$obj = ui_layout.top;
			$option = this.options.top;

			if($obj) {
				$obj.css({
					'position' : 'absolute',
					'top' : '0px',
					'left' : '0px',
					'width' : '100%',
					'height' : $option.size || $option.min  
				});
				
				sizeTop = $obj.height();
				
				if($option.resize) {
					$obj.resizer.css({
						'position' : 'absolute',
						'top': sizeTop,
						'left' : '0px',
						'width' : '100%',
						"background": this.options.barColor,						
						"height" : this.options.barSize
					})					
					
					sizeTop += this.options.barSize;
				} else {
					if($obj.resizer) {
						$obj.resizer.remove();
					}
				}
			}

			$obj = ui_layout.bottom;
			$option = this.options.bottom;
			
			var max = ui_layout.root.height();			
			
			if($obj) {
				$obj.css({
					'position' : 'absolute',
					'left' : '0px',
					'width' : '100%',
					'height' : $option.size || $option.min  
				});
				
				var bottom_top = (sizeTop -  $obj.height()) + sizeTop;
				
				if($option.resize) {
					$obj.resizer.css({
						'position' 	: 'absolute',
						'top' 		: bottom_top,
						'left' 		: '0px',
						'width' 	: '100%',
						"background": this.options.barColor,
						"height" 	: this.options.barSize
					});					
					
					bottom_top += this.options.barSize;
				} else {
					if($obj.resizer) {
						$obj.resizer.remove();
					}
				}		
					
				$obj.css('top', bottom_top + "px");					
			}			
			
			$obj = ui_layout.left;
			$option = this.options.left;
			
			var content_height = max ;
			
			if(ui_layout.top) {
				content_height -= ui_layout.top.height();
				if(ui_layout.top.resizer) {
					content_height -= ui_layout.top.resizer.height();	
				}
			}
			
			if(ui_layout.bottom) {
				content_height -= ui_layout.bottom.height();
				if(ui_layout.bottom.resizer) {
					content_height -= ui_layout.bottom.resizer.height();	
				}
			}							
			
			if($obj) {
				$obj.css({
					'position' : 'absolute',
					'top' : sizeTop,
					'left' : '0px',
					'height' : content_height,
					'width' : $option.size || $option.min,
					'max-width' : '100%',
					'overflow' : 'auto'
				});
				
				sizeLeft = $obj.width();
				
				if($option.resize) {
					$obj.resizer.css({
						'position' 	: 'absolute',
						'top' 		: sizeTop,
						'height'	: $obj.height(),
						'left' 		: sizeLeft,
						"background": this.options.barColor,
						"width" 	: this.options.barSize
					});			
					
					sizeLeft += this.options.barSize;
				} else {
					if($obj.resizer) {
						$obj.resizer.remove();
					}					
				}					
			}
			
			$obj = ui_layout.right;
			$option = this.options.right;
			
			var max_width = ui_layout.root.width();
		    var content_width = max_width;
		    
		    if(ui_layout.left) {
		    	content_width -= ui_layout.left.width();
		    	if(ui_layout.left.resizer) {
		    		content_width -= ui_layout.left.resizer.width();
		    	}
		    }			
			
			if($obj) {
				$obj.css({
					'position' : 'absolute',
					'top' : sizeTop,
					//'right' : '0px',
					'height' : content_height,
					'width' : $option.size || $option.min  ,
					'max-width' : '100%'
				});
				
				if($option.resize) {
					$obj.resizer.css({
						'position' 	: 'absolute',
						'top' 		: sizeTop,
						'height'	: $obj.height(),
						"background": this.options.barColor,
						"width" 	: this.options.barSize
					})	
					
					sizeRight += this.options.barSize;
				} else {
					if($obj.resizer) {
						$obj.resizer.remove();
					}					
				}		
				
		    	content_width -= ui_layout.right.width();
		    	if(ui_layout.right.resizer) {
		    		content_width -= ui_layout.right.resizer.width();
		    	}
		        
		        $obj.resizer.css({ left : (sizeLeft + content_width) + "px" });
		        $obj.css({left : (sizeLeft + content_width + $obj.resizer.width()) + "px"})
											
			}									
			
			$obj = ui_layout.center;
			$option = this.options.center;
			
			if($obj) {
				$obj.css({
					'position' 	: 'absolute',
					'top' 		: sizeTop,
          			'height'  : content_height,
					'left' 		: sizeLeft,
					'width'   : content_width,
					'overflow' : 'auto'
				});
			}			
		}
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {String} [barColor="#d6d6d6"]
             * Determines the color of the resizing bar
             */
			barColor : '#d6d6d6',

            /**
             * @cfg {Integer} [barSize=3]
             * Determines the size of the resizing bar
             */
			barSize : 3,

            /**
             * @cfg {Integer} [width=null]
             * Determines the container area value
             */
			width	: null,

            /**
             * @cfg {Integer} [height=null]
             * Determines the container height value
             */
			height	: null,

            /**
             * @cfg {Object} top
             * Configures options for the top area
             */
			top		: { el : null, size : null, min : 50, max : 200, resize : true },

            /**
             * @cfg {Object} left
             * Configures options for the left area
             */
			left	: { el : null, size : null, min : 50, max : 200, resize : true },

            /**
             * @cfg {Object} right
             * Configures options for the right area
             */
			right	: { el : null, size : null, min : 50, max : 200, resize : true },

            /**
             * @cfg {Object} bottom
             * Configures options for the bottom area
             */
			bottom	: { el : null, size : null, min : 50, max : 200, resize : true },

            /**
             * @cfg {Object} center
             * Configures options for the center area
             */
			center	: { el : null }
        }
    }
	
	return UI;
	
});

jui.defineUI("ui.accordion", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class ui.accordion
     * @extends core
     * @alias Accordion
     * @requires jquery
     */
    var UI = function() {
        var activeIndex = 0;

        var $title = null,
            $content = null;

        function showTitle(index) {
            $title.each(function(i) {
                if(index == i) {
                    $(this).addClass("active");
                    $content.insertAfter(this).show();
                } else {
                    $(this).removeClass("active");
                }
            });
        }

        function setTitleEvent(self) {
            $title.each(function(i) {
                self.addEvent(this, "click", function(e) {
                    if($(this).hasClass("active") && self.options.autoFold) {
                        $(this).removeClass("active");
                        $content.hide();
                        self.emit("fold", [ i, e ] );
                    } else {
                        showTitle(i);
                        self.emit("open", [ i, e ]);
                    }
                });
            });
        }

        this.init = function() {
            var opts = this.options;

            $title = $(this.root).find(".title");
            $content = $(this.root).find(".content");

            if(_.typeCheck("integer", opts.index)) {
                showTitle(opts.index);
            } else {
                $content.hide();
            }

            setTitleEvent(this);
        }

        /**
         * @method activeIndex
         * Gets the index of the currently enabled node
         *
         * @return {Integer} Index
         */
        this.activeIndex = function() {
            return activeIndex;
        }
    }

    UI.setup = function() {
        return {
            /**
             * @cfg {Integer} [index=null]
             * Sets an enabled node
             */
            index: null,

            /**
             * @cfg {Boolean} [autoFold=false]
             * When you click on a node, the node folding
             */
            autoFold: false
        }
    }

    /**
     * @event open
     * When a node is opened, the events that occur
     *
     * @param {Integer} index Index
     * @param {jQueryEvent} e The event object
     */

    /**
     * @event fold
     * When a node is closed, the events that occur
     *
     * @param {Integer} index Index
     * @param {jQueryEvent} e The event object
     */

    return UI;
});
jui.defineUI("ui.switch", [ "jquery", "util.base" ], function($, _) {


    /**
     * @class ui.switch
     * @extends core
     * @alias Switch button
     * @requires jquery
     * @requires util.base
     */
    var UI = function() {
        function selectDom(root, selector) {
            var $dom = $(root).find('.' + selector);

            if (!$dom.length) {
                $dom = $("<div />").addClass(selector);
            }

            return $dom;
        }

        this.init = function() {
            var self = this,
                opts = this.options;

            var $left = selectDom(this.root, "left"),
                $right = selectDom(this.root, "right"),
                $area = selectDom(this.root, "area"),
                $bar = selectDom(this.root, "bar"),
                $handle = selectDom(this.root, "handle");

            $bar.html($left),
            $bar.append($right),
            $area.html($bar);

            $(this.root).html($area).append($handle);

            this.addEvent(this.root, opts.toggleEvent, function(e) {
                self.toggle();
            });

            if(opts.checked) {
                $(this.root).addClass("on");
            }
        }

        this.getValue = function() {
            return $(this.root).hasClass("on");
        }

        this.setValue = function(value) {
            $(this.root).toggleClass("on", !!value);
            this.emit("change", [ value ]);
        }

        this.toggle = function() {
            this.setValue(!this.getValue());
        }
    };

    UI.setup = function() {
        return {
            checked: false,
            toggleEvent: "click"
        }
    }

    return UI;
});
jui.defineUI("ui.slider", [ "jquery", "util.base", "util.math" ], function($, _, math) {

    /**
     * @class ui.slider
     * @extends core
     * @alias Slider
     * @requires jquery
     * @requires util.base
     */
    var UI = function() {
        var self, isVertical, preFromValue, preToValue;
        var $root, $track, $handle, $toHandle, $tooltipTrack, $progress;
        var $tooltip, $tooltipMessage, $tooltip2, $tooltipMessage2;

        function min() {
            return self.options.min;
        }

        function max() {
            return self.options.max;
        }

        function step() {
            return self.options.step;
        }

        function type() {
            return self.options.type;
        }

        function isDouble() {
            return type() == 'double';
        }

        function isSingle() {
            return type() == 'single';
        }

        function isShowProgress() {

            return $root.data('progress') == false ? false : self.options.progress;
        }

        function isShowTooltip() {
            return $root.data('tooltip') == false ? false : self.options.tooltip;
        }

        function getTooltip(type) {
            return (type == 'from') ? $tooltip : $tooltip2;
        }

        function getTooltipMessage(type) {
            return (type == 'from') ? $tooltipMessage : $tooltipMessage2;
        }

        function getHandle(type) {
            if (type == 'to') {
                return $toHandle;
            }

            return $handle;
        }

        function pos(e) {
            if (_.isTouch) {
                return e.originalEvent.touches[0];
            }

            return e;
        }

        function getStyleValue($node, key) {
            return $node[0].style[key];
        }

        function setProgressBar() {
            if (isSingle()) {
                if (isVertical) {
                    $progress.height(getStyleValue($handle, 'bottom')).css({ bottom : 0 });
                } else {
                    $progress.width(getStyleValue($handle, 'left'));
                }
            } else {
                if (isVertical) {
                    var toDist = parseFloat(getStyleValue($toHandle, 'bottom').replace('%', ''));
                    var fromDist = parseFloat(getStyleValue($handle, 'bottom').replace('%', ''));

                    $progress.height((toDist - fromDist) + '%').css({
                        bottom : fromDist + '%'
                    });
                } else {
                    var toDist = parseFloat(getStyleValue($toHandle, 'left').replace('%', ''));
                    var fromDist = parseFloat(getStyleValue($handle, 'left').replace('%', ''));

                    $progress.width((toDist - fromDist) + '%').css({
                        left : fromDist + '%'
                    });
                }
            }
        }

        function checkMaxFromTo(dist, type) {
            if (isDouble()) {
                if (type == 'from') {
                    if (isVertical) {
                        var toDist = parseFloat(getStyleValue($toHandle, 'bottom').replace('%', ''));
                        if (dist >=  toDist) {
                            dist = toDist;
                        }
                    } else {
                        var toDist = parseFloat(getStyleValue($toHandle, 'left').replace('%', ''));
                        if (dist >=  toDist) {
                            dist = toDist;
                        }
                    }
                } else if (type == 'to') {
                    if (isVertical) {
                        var fromDist = parseFloat(getStyleValue($handle, 'bottom').replace('%', ''));
                        if (dist <=  fromDist) {
                            dist = fromDist;
                        }
                    } else {
                        var fromDist = parseFloat(getStyleValue($handle, 'left').replace('%', ''));
                        if (dist <=  fromDist) {
                            dist = fromDist;
                        }
                    }
                }
            }

            return dist;
        }

        function setViewStatus(dist, type) {
            var value = getValue(dist/100);

            if (value < min()) value = min();
            if (value > max()) value = max();

            dist = (value - min()) / (max() - min()) * 100;
            dist = checkMaxFromTo(dist, type);

            // redefine value
            value = getValue(dist/100);

            var percent = dist + '%';
            var $handle = getHandle(type)

            if (isVertical) {
                $handle.css({ bottom : percent });
            } else {
                $handle.css({ left : percent });
            }

            setProgressBar();

            if (isShowTooltip()) {
                var $tooltip = getTooltip(type);
                var $tooltipMessage = getTooltipMessage(type);

                if (_.typeCheck("function", self.options.format)) {
                    value = self.options.format.call(self, value);
                }

                $tooltipMessage.html(value);

                if (isVertical) {
                    $tooltip.css({
                        bottom : $track.height() * (dist / 100),
                        'margin-bottom' : -1 * ($tooltip.height()/2)
                    });

                } else {
                    $tooltip.css({
                        left : percent,
                        "margin-left" : -1 * ($tooltip.width()/2)
                    });

                    var xPos = $track.width() * ( dist/100);
                    var lastPos =  xPos + $tooltip.width()/2;
                    var firstPos =  xPos - $tooltip.width()/2;

                    if (lastPos >= $track.width() ) {
                        $tooltip.css({
                            left : $track.width() - $tooltip.width() + $handle.width()/2,
                            'margin-left' : 0
                        }).addClass('last');
                    } else if (firstPos <= 0 ) {
                        $tooltip.css({
                            'left' : -$handle.width()/2,
                            'margin-left' : 0
                        }).addClass('first');
                    } else {
                        $tooltip.removeClass('first last');
                    }
                }

                $tooltip.show();
            }

            if (type == 'from') {
                if (preFromValue != value) {
                    self.emit("change", [ { type: type, from: value, to: self.getToValue() } ]);
                    preFromValue = value;
                }
            } else if (type == 'to') {
                if (preToValue != value) {
                    self.emit("change", [ { type: type, from: self.getFromValue(), to: value } ]);
                    preToValue = value;
                }
            }

        }

        function setHandlePosition(e, type) {
            var min, max, current;
            var dist = undefined;

            if (self.options.orient == 'vertical') {
                min = $track.offset().top - $("body").scrollTop();
                max = min + $track.height();
                current = pos(e).clientY;

                if (current <= min) {
                    dist = 100;
                } else if (current >= max) {
                    dist = 0;
                } else {
                    dist = (max - current) / (max - min) * 100;
                }
            } else {
                min = $track.offset().left;
                max = min + $track.width();
                current = pos(e).clientX;

                if (current < min) {
                    dist = 0;
                } else if (current > max) {
                    dist = 100;
                } else {
                    dist = (current - min) / (max - min) * 100;
                }
            }

            setViewStatus(dist, type);
        }

        function getValue(dist) {
            if (typeof dist == 'undefined') {

                if (isVertical) {
                    dist = parseFloat($handle.css('bottom'))/$track.height();
                } else {
                    dist = parseFloat($handle.css('left'))/$track.width();
                }
            }

            var minValue = min();
            var maxValue = max();

            var value = (minValue + (maxValue - minValue) * dist);

            var stepValue = step();
            var temp = math.remain(value, stepValue);

            value = math.minus(value, temp);

            if (temp > math.div(stepValue, 2)) {
                value = math.plus(value, stepValue);
            }

            return value;
        }

        function initElement() {
            $root.addClass(self.options.orient);

            $track = $("<div class='track' />");
            $tooltipTrack = $("<div class='tooltip-track' />");
            $progress = $("<div class='progress' />");

            if (!isShowProgress()) {
                $progress.hide();
            }

            $handle = $("<div class='handle from' />");
            $track.html($progress);
            $track.append($handle);

            if (isDouble()) {
                $toHandle = $("<div class='handle to' />");
                $track.append($toHandle);
            }

            var tooltip_orient = isVertical ? 'right': 'top';

            $tooltip = $('<div class="tooltip '+tooltip_orient+'"><div class="message" /></div>').hide();
            $tooltipMessage = $tooltip.find(".message");

            $tooltip2 = $('<div class="tooltip '+tooltip_orient+'"><div class="message" /></div>').hide();
            $tooltipMessage2 = $tooltip2.find(".message");

            $tooltipTrack.html($tooltip);
            $tooltipTrack.append($tooltip2);

            $root.html($track);
            $root.append($tooltipTrack);

            if (isShowTooltip()) {
                $root.addClass('has-tooltip');
            }
        }

        function initEvent() {
            self.addEvent($handle, 'mousedown', function(e) {
                $handle.data('select', true);
                $("body").addClass("slider-cursor");
            });

            if (isDouble()) {
                self.addEvent($toHandle, 'mousedown', function(e) {
                    $toHandle.data('select', true);
                    $("body").addClass("slider-cursor");
                });
            }

            self.addEvent($track, 'mousedown', function(e) {
                $("body").addClass("slider-cursor");

                if (self.options.type == 'single') {
                    $handle.data('select', true);
                    setHandlePosition(e, 'from');
                } else {
                    //TODO: if type is double, check position
                }
            });

            self.addEvent('body', 'mouseup', function(e) {
                $handle.data('select', false);
                if (self.options.type == 'double') {
                    $toHandle.data('select', false);
                }

                $("body").removeClass("slider-cursor");
            });

            self.addEvent('body', 'mousemove', function(e) {
                if ($handle.data('select')) {
                    setHandlePosition(e, 'from');
                } else if (self.options.type == 'double' && $toHandle.data('select')) {
                    setHandlePosition(e, 'to');
                }
            });
        }

        this.init = function() {
            self = this;
            $root = $(this.root);

            isVertical = (this.options.orient == 'vertical');
            initElement();
            initEvent();

            this.setFromValue();
            this.setToValue();
        }

        /**
         * @method setFromValue
         * set FromHandle's value
         *
         * @param {Number}
         */
        this.setFromValue = function(value) {
            var from = value || $root.data("from") || this.options.from,
                dist = (from - min()) / (max() - min()) * 100;

            setViewStatus(dist, "from");
        }

        /**
         * @method setToValue
         * set ToHandle's value
         *
         * @param {Number}
         */
        this.setToValue = function(value) {
            if (isDouble()) {
                var to = value || $root.data("to") || this.options.to,
                    dist = (to - min()) / (max() - min()) * 100;

                setViewStatus(dist, "to");
            }
        }

        /**
         * @method getFromValue
         * get FromHandle's value
         *
         * @return {Number} value
         */
        this.getFromValue = function() {
            return getValue();
        }

        /**
         * @method getToValue
         * get ToHandle's value
         *
         * @return {Number} value
         */
        this.getToValue = function () {
            var dist;

            if(isDouble()) {
                if (isVertical) {
                    dist = parseFloat($toHandle.css("bottom")) / $track.height();
                } else {
                    dist = parseFloat($toHandle.css("left")) / $track.width();
                }

                return getValue(dist);
            }

            return getValue();
        }
    }

    UI.setup = function() {
        return {
            type : "single", // or double
            orient : "horizontal", // or vertical,
            min : 0,
            max : 10,
            step : 1,
            from : 0,
            to : 10,
            tooltip : true,
            format : null,
            progress : true

        }
    }

    /**
     * @event change
     * Event that occurs when dragging on a slider
     *
     * @param {Object} data Data of current from
     * @param {jQueryEvent} e The event object
     */

    return UI;
});
jui.defineUI("ui.progress", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class ui.slider
     * @extends core
     * @alias Slider
     * @requires jquery
     * @requires util.base
     */
    var UI = function() {
        var self, $root, $area, $bar;

        function min() {
            return self.options.min;
        }

        function max() {
            return self.options.max;
        }

        function orient() {
            return self.options.orient;
        }

        function type() {
            return self.options.type;
        }

        function animated() {
            return self.options.animated;
        }

        function striped() {
            return self.options.striped;
        }

        function value() {
            return self.options.value;
        }

        function setBarSize(percent) {
            if (orient() == "vertical") {
                $bar.height(percent + "%");
            } else {
                $bar.width(percent + "%");
            }
        }

        function getBarSize() {
            var percent;
            if (orient() == "vertical") {
                percent = $bar.css("height");
            } else {
                percent = $bar.css("width");
            }

            return percent;
        }


        function initElement() {
            $root.addClass(orient()).addClass(type());

            $area = $root.find(".area");
            $bar = $root.find(".bar");

            if($area.size() == 0) {
                $area = $("<div class='area' />");
                $root.html($area);
            }

            if($bar.size() == 0) {
                $bar = $("<div class='bar' />");
                $area.html($bar);
            }

            self.setValue();
            self.setStriped();
            self.setAnimated();
        }

        this.init = function () {
            self = this;
            $root = $(this.root);

            initElement();
        }

        this.setAnimated = function(isAnimated) {
            if (typeof isAnimated == "undefined") {
                $bar.toggleClass("animated", animated());
            } else {
                $bar.toggleClass("animated", isAnimated);
            }
        }

        this.setStriped = function(isStriped) {
            if (typeof isStriped == "undefined") {
                $bar.toggleClass("striped", striped());
            } else {
                $bar.toggleClass("striped", isStriped);
            }
        }

        this.setValue = function(v) {
            var v = (typeof v == "undefined") ? value() : v,
                percent = (v - min()) / (max() - min()) * 100;

            setBarSize(percent);
        }

        this.getValue = function() {
            return min() + (max() - min()) * (parseFloat(getBarSize().replace("%", "")) / 100);
        }
    }

    UI.setup = function() {
        return {
            type: "",       // simple or flat
            orient : "horizontal", // or vertical,
            min : 0,
            max : 100,
            value : 0,
            striped : false,   // or true
            animated : false     // or true
        }
    };

    /**
     * @event change
     * Event that occurs when dragging on a slider
     *
     * @param {Object} data Data of current from
     * @param {jQueryEvent} e The event object
     */

    return UI;
});
jui.defineUI("ui.autocomplete", [ "jquery", "util.base", "ui.dropdown" ], function($, _, dropdown) {
	
	/**
	 * @class ui.autocomplete
     * Auto complete component that shows a list of keywords containing the input value when inputting a string in a text box
     *
     * @extends core
     * @requires jquery
     * @requires util.base
     * @requires ui.dropdown
	 */
	var UI = function() {
		var ddUi = null, target = null,
            words = [], list = [];

		function createDropdown(self, words) {
			if(words.length == 0) {
				if(ddUi) ddUi.hide();
				return;
			} else {
				if(ddUi) $(ddUi.root).remove();
			}
			
			var pos = $(self.root).offset(),
				$ddObj = $(self.tpl.words({ words: words }));

			$("body").append($ddObj);
			
			ddUi = dropdown($ddObj, {
				keydown: true,
				width: $(self.root).outerWidth(),
				left: pos.left,
				top: pos.top + $(self.root).outerHeight(),
				event: {
					change: function(data, e) {
						$(target).val(data.text);
						self.emit("change", [ data.text, e ]);
					}
				}
			});
			
			ddUi.show();
		}
		
		function getFilteredWords(word) {
			var result = [];
			
			if(word != "") {
				for(var i = 0; i < words.length; i++) {
					var origin = words[i],
						a = words[i].toLowerCase(),
						b = word.toLowerCase();
					
					if(a.indexOf(b) != -1) {
						result.push(origin);
					}
				}
			}
			
			return result;
		}
		
		function setEventKeyup(self) {
			self.addEvent(target, "keyup", function(e) {
				if(e.which == 38 || e.which == 40 || e.which == 13) return;

                list = getFilteredWords($(this).val());
				createDropdown(self, list);

				return false;
			});
		}

		this.init = function() {
			var opts = this.options;
			
			// 타겟 엘리먼트 설정
			target = (opts.target == null) ? this.root : $(this.root).find(opts.target);

			// 키-업 이벤트 설정
			setEventKeyup(this);

            // 단어 업데이트
            this.update(opts.words);
		}

        /**
         * @method update
         * Updates words subject to autofill
         *
         * @param {Array} words
         */
		this.update = function(newWords) {
			words = newWords;
		}

		/**
		 * @method close
		 * Close the active drop-down
		 *
		 */
		this.close = function() {
			if(ddUi) ddUi.hide();
		}

        /**
         * @method list
         * Gets filtered words subject to autofill
         *
         * @return {Array} words
         */
        this.list = function() {
            return list;
        }
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {String/DOMElement} [target=null]
             * Designates a target selector when an autofill route is not a target
             */
			target: null,

            /**
             * @cfg {Array} words
             * Designates words subject to autofill
             */
			words: []
        }
    }

    /**
     * @event change
     * Event that occurs when you click on a dropdown that shows a word list
     *
     * @param {String} word Changed word
     */
	
	return UI;
});
jui.defineUI("ui.tab", [ "jquery", "util.base", "ui.dropdown" ], function($, _, dropdown) {

    /**
     * @class ui.tab
     * @extends core
     * @alias Tab
     * @requires jquery
     * @requires util.base
     * @requires ui.dropdown
     */
	var UI = function() {
		var ui_menu = null,
			$anchor = null;
			
		var menuIndex = -1, // menu index
			activeIndex = 0;
		
		function hideAll(self) {
			var $list = $(self.root).children("li");
			$list.removeClass("active");
		}
		
		function showMenu(self, elem) {
			var pos = $(elem).offset();
			
			$(elem).addClass("checked");
			ui_menu.show(pos.left, pos.top + $(self.root).height());
		}
		
		function hideMenu(self) {
			var $list = $(self.root).children("li"),
				$menuTab = $list.eq(menuIndex);
			
			$menuTab.removeClass("checked");
		}
		
		function changeTab(self, index) {
			hideAll(self);
			
			var $list = $(self.root).children("li"),
				$tab = $list.eq(index).addClass("active");
			
			$anchor.appendTo($tab);
			showTarget(self.options.target, $tab[0]);
		}
		
		function showTarget(target, elem, isInit) {
			var hash = $(elem).find("[href*=\#]").attr("href");
			
			$(target).children("*").each(function(i) {
				var self = this;
				
				if(("#" + self.id) == hash) {
					$(self).show();
				} else {
					$(self).hide();
				}
			});
		}
		
		function setEventNodes(self) {
			$(self.root).children("li").each(function(i) {
				// 메뉴 설정
				if($(this).hasClass("menu")) {
					menuIndex = i;
				}
			
				// 이벤트 설정
				self.addEvent(this, [ "click", "contextmenu" ], function(e) {
					if($(this).hasClass("disabled")) {
						return false;
					}

					var text = $.trim($(this).text()),
                        value = $(this).val();

					if(i != menuIndex) {
                        if(i != activeIndex) {
                            var args = [ { index: i, text: text, value: value }, e ];

							if(self.options.target != "") {
								showTarget(self.options.target, this);
							}

							// 엑티브 인덱스 변경
							activeIndex = i;

							self.emit("change", args);
							self.emit("click", args);

							changeTab(self, i);
                        }
					} else {
						self.emit("menu", [ { index: i, text: text }, e ]);
						if(ui_menu.type != "show") showMenu(self, this);
					}
					
					return false;
				});
			});
			
			setActiveNode(self);
			setEventDragNodes(self);
		}
		
		function setEventDragNodes(self) {
			if(!self.options.drag) return;
			
			var $tabs = $(self.root).children("li"),
				$origin = null,
				$clone = null;
			
			var index = null,
				targetIndex = null;
			
			$tabs.each(function(i) {
				self.addEvent(this, "mousedown", function(e) {
					$origin = $(this);
					$clone = $origin.clone().css("opacity", "0.5");
					
					index = i;
					self.emit("dragstart", [ index, e ]);
					
					return false;
				});

				self.addEvent(this, "mousemove", function(e) {
					if(index == null) return;
					targetIndex = i;
					
					if(index > targetIndex) { // move 로직과 동일
						if(targetIndex == 0) {
							$clone.insertBefore($tabs.eq(0));
						} else {
							$clone.insertAfter($tabs.eq(targetIndex - 1));
						}
					} else {
						if(targetIndex == $tabs.size() - 1) {
							$clone.insertAfter($tabs.eq(targetIndex));
						} else {
							$clone.insertBefore($tabs.eq(targetIndex + 1));
						}
					}
					
					$origin.hide();
				});
			});
			
			self.addEvent(self.root, "mouseup", function(e) {
				if($origin != null) $origin.show();
				if($clone != null) $clone.remove();
				
				if(index != null && targetIndex != null) {
					self.move(index, targetIndex);
					self.emit("dragend", [ targetIndex, e ]);
				}

				index = null;
				targetIndex =  null;
			});
		}
		
		function setActiveNode(self) {
			var $list = $(self.root).children("li"),
				$markupNode = $list.filter(".active"),
				$indexNode = $list.eq(activeIndex),
				$node = ($markupNode.size() == 1) ? $markupNode : $indexNode;
			
			// 노드가 없거나 disabled 상태일 때, 맨 첫번째 노드를 활성화
			if($node.hasClass("disabled") || $node.size() == 0) {
				$node = $list.eq(0);
				activeIndex = 0;
			}
			
			$anchor.appendTo($node);
			changeTab(self, $list.index($node));
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 활성화 인덱스 설정
			activeIndex = opts.index;
			
			// 컴포넌트 요소 세팅
			$anchor = $("<div class='anchor'></div>");
			
			// 탭 목록 갱신 및 이벤트 설정
			if(opts.nodes.length > 0) {
				this.update(opts.nodes);
			} else {
				setEventNodes(this);
			}
			
			// 드롭다운 메뉴 
			if(this.tpl.menu) {
				var $menu = $(this.tpl.menu());
				$("body").append($menu);
				
				ui_menu = dropdown($menu, {
					event: {
						change: function(data, e) {
							hideMenu(self);
							self.emit("changemenu", [ data, e ]);
						},
						hide: function() {
							hideMenu(self);
						}
					}
				});
			}
			
			return this;
		}

        /**
         * @method update
         * Changes the tab list
         *
         * @param {Array} nodes
         */
		this.update = function(nodes) {
			if(!this.tpl.node) return;
			
			$(this.root).empty();
			
			for(var i = 0; i < nodes.length; i++) {
				$(this.root).append(this.tpl.node(nodes[i]));
			}

			setEventNodes(this);
		}

        /**
         * @method insert
         * Adds a tab at a specified index
         *
         * @param {Integer} index
         * @param {Object} node
         */
		this.insert = function(index, node) {
			if(!this.tpl.node) return;
			
			var html = this.tpl.node(node),
				$list = $(this.root).children("li");
			
			if(index == $list.size()) {
				$(html).insertAfter($list.eq(index - 1));
			} else {
				$(html).insertBefore($list.eq(index));
			}

			setEventNodes(this);
		}

        /**
         * @method append
         * Adds a tab to the last node
         *
         * @param {Object} node
         */
		this.append = function(node) {
			if(!this.tpl.node) return;

			var html = this.tpl.node(node);
			
			if(menuIndex != -1) {
				$(html).insertBefore($(this.root).find(".menu"));
				menuIndex++;
			} else {
				$(this.root).append(html);
			}
			
			setEventNodes(this);
		}

        /**
         * @method prepend
         * Adds a tab to the first node
         *
         * @param {Object} node
         */
		this.prepend = function(node) {
			if(!this.tpl.node) return;

			$(this.root).prepend(this.tpl.node(node));
			setEventNodes(this);
		}

        /**
         * @method remove
         * Removes a tab at a specified index
         *
         * @param {Integer} index
         */
		this.remove = function(index) {
			$(this.root).children("li").eq(index).remove();
			setEventNodes(this);
		}

        /**
         * @method move
         * Changes a specified tab to a tab at a target index
         *
         * @param {Integer} index
         * @param {Integer} targetIndex
         */
		this.move = function(index, targetIndex) {
			if(index == targetIndex) return;
			
			var $tabs = $(this.root).children("li"),
				$target = $tabs.eq(index);
			
			if(index > targetIndex) {
				if(targetIndex == 0) {
					$target.insertBefore($tabs.eq(0));
				} else {
					$target.insertAfter($tabs.eq(targetIndex - 1));
				}
			} else {
				if(targetIndex == $tabs.size() - 1) {
					$target.insertAfter($tabs.eq(targetIndex));
				} else {
					$target.insertBefore($tabs.eq(targetIndex + 1));
				}
			}
			
			activeIndex = targetIndex;
			setEventNodes(this);
		}

        /**
         * @method show
         * Enables the tab at a specified index
         *
         * @param {Integer} index
         */
		this.show = function(index) {
            if(index == menuIndex || index == activeIndex) return;

			var $target = $(this.root).children("li").eq(index);
			if($target.hasClass("disabled")) return;

			activeIndex = index;

			this.emit("change", [{ 
				index: index, 
				text: $.trim($target.text()),
                value: $target.val()
			}]);

			changeTab(this, index);
		}

		/**
		 * @method enable
		 * Enables the tab at a specified index
		 *
		 * @param {Integer} index
		 */
		this.enable = function(index) {
			if(index == menuIndex || index == activeIndex) return;

			var $target = $(this.root).children("li").eq(index);
			$target.removeClass("disabled");
		}

		/**
		 * @method disable
		 * Disables the tab at a specified index
		 *
		 * @param {Integer} index
		 */
		this.disable = function(index) {
			if(index == menuIndex || index == activeIndex) return;

			var $target = $(this.root).children("li").eq(index);
			$target.addClass("disabled");
		}

        /**
         * @method activeIndex
         * Gets the index of the currently enabled tab
         *
         * @return {Integer}
         */
		this.activeIndex = function() {
			return activeIndex;
		}
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {String/DOMElement} [target=""]
             * Determines a selector in the area to become the content of a tab
             */
			target: "",

            /**
             * @cfg {Integer} [index=0]
             * Sets an enabled tab
             */
			index: 0,

            /**
             * @cfg {Boolean} [drag=false]
             * Changes the tab location through dragging
             */
			drag: false,

            /**
             * @cfg {Array} nodes
             * Sets a tab list to data rather than markup
             */
			nodes: []
        }
    }

    /**
     * @event change
     * Event that occurs when a tab is enabled
     *
     * @param {Object} data changed data
     * @param {EventObject} e The event object
     */

    /**
     * @event click
     * Event that occurs when a tab is mouse clicked
     *
     * @param {Object} data changed data
     * @param {EventObject} e The event object
     */

    /**
     * @event menu
     * Event which occurs when tab menu shown
     *
     * @param {Object} data changed data
     * @param {EventObject} e The event object
     */

    /**
     * @event changemenu
     * Event that occurs when a dropdown is selected
     *
     * @param {Object} data changed data
     * @param {EventObject} e The event object
     */

    /**
     * @event dragstart
     * Event that occurs when a tab starts to move
     *
     * @param {Integer} index
     * @param {EventObject} e The event object
     */

    /**
     * @event dragend
     * Event that occurs when the movement of a tab is completed
     *
     * @param {Integer} index
     * @param {EventObject} e The event object
     */
	
	return UI;
});
jui.define("ui.tree.node", [ "jquery" ], function($) {

    /**
     * @class ui.tree.node
     * implements Tree's Node
     * @alias TreeNode
     * @requires jquery
     */
    var Node = function(data, tplFunc) {
        var self = this;

        /** @property {Array} [data=null] Data of a specifiednode */
        this.data = data;

        /** @property {HTMLElement} [element=null] LI element of a specified node */
        this.element = null;

        /** @property {Integer} [index=null] Index of a specified node */
        this.index = null;

        /** @property {Integer} [nodenum=null] Unique number of a specifiede node at the current depth */
        this.nodenum = null;

        /** @property {ui.tree.node} [parent=null] Variable that refers to the parent of the current node */
        this.parent = null;

        /** @property {Array} [children=null] List of child nodes of a specified node */
        this.children = [];

        /** @property {Integer} [depth=0] Depth of a specified node */
        this.depth = 0;

        /** @property {String} [type='open'] State value that indicates whether a child node is shown or hidden */
        this.type = "open";

        function setIndex(nodenum) {
            self.nodenum = (!isNaN(nodenum)) ? nodenum : self.nodenum;

            if(self.parent) {
                if(self.parent.index == null) self.index = "" + self.nodenum;
                else self.index = self.parent.index + "." + self.nodenum;
            }

            // 뎁스 체크
            if(self.parent && typeof(self.index) == "string") {
                self.depth = self.index.split(".").length;
            }

            // 자식 인덱스 체크
            if(self.children.length > 0) {
                setIndexChild(self);
            }
        }

        function setIndexChild(node) {
            var clist = node.children;

            for(var i = 0; i < clist.length; i++) {
                clist[i].reload(i);

                if(clist[i].children.length > 0) {
                    setIndexChild(clist[i]);
                }
            }
        }

        function getElement() {
            if(!tplFunc) return self.element;

            try {
                var element = $(tplFunc(
                        $.extend({ node: { index: self.index, data: self.data, depth: self.depth } }, self.data))
                ).get(0);
            } catch(e) {
                console.log(e);
            }

            return element;
        }

        function removeChildAll(node) {
            $(node.element).remove();

            for(var i = 0; i < node.children.length; i++) {
                var cNode = node.children[i];

                if(cNode.children.length > 0) {
                    removeChildAll(cNode);
                } else {
                    $(cNode.element).remove();
                }
            }
        }

        function reloadChildAll(node) {
            for(var i = 0; i < node.children.length; i++) {
                var cNode = node.children[i];
                cNode.reload(i);

                if(cNode.children.length > 0) {
                    reloadChildAll(cNode);
                }
            }
        }

        this.reload = function(nodenum, isUpdate) {
            setIndex(nodenum); // 노드 인덱스 설정

            if(this.element != null) {
                var newElem = getElement();

                if(!isUpdate) {
                    $(this.parent.element).children("ul").append(newElem);
                } else {
                    $(newElem).insertAfter(this.element);
                }

                $(this.element).remove();

                this.element = newElem;
            } else {
                this.element = getElement();
            }
        }


        this.reloadChildrens = function() {
            reloadChildAll(this);
        }

        this.destroy = function() {
            if(this.parent != null) { // 부모가 있을 경우, 연결관계 끊기
                this.parent.removeChild(this.index);
            } else {
                removeChildAll(this);
                $(this.element).remove();
            }
        }

        this.isLeaf = function() {
            return (this.children.length == 0) ? true : false;
        }

        this.fold = function() {
            $(this.element).children("ul").hide();
            this.type = "fold";
        }

        this.open = function() {
            $(this.element).children("ul").show();
            this.type = "open";
        }

        this.appendChild = function(node) {
            $(this.element).children("ul").append(node.element);
            this.children.push(node);
        }

        this.insertChild = function(nodenum, node) {
            if(nodenum == 0) {
                if(this.children.length == 0) {
                    $(this.element).children("ul").append(node.element);
                } else {
                    $(node.element).insertBefore(this.children[0].element);
                }
            } else {
                $(node.element).insertAfter(this.children[nodenum - 1].element);
            }

            var preNodes = this.children.splice(0, nodenum);
            preNodes.push(node);

            this.children = preNodes.concat(this.children);
            reloadChildAll(this);
        }

        this.removeChild = function(index) {
            for(var i = 0; i < this.children.length; i++) {
                var node = this.children[i];

                if(node.index == index) {
                    this.children.splice(i, 1); // 배열에서 제거
                    removeChildAll(node);
                }
            }

            reloadChildAll(this);
        }

        this.lastChild = function() {
            if(this.children.length > 0)
                return this.children[this.children.length - 1];

            return null;
        }

        this.lastChildLeaf = function(lastRow) {
            var row = (!lastRow) ? this.lastChild() : lastRow;

            if(row.isLeaf()) return row;
            else {
                return this.lastChildLeaf(row.lastChild());
            }
        }
    }

    return Node;
});


jui.define("ui.tree.base", [ "jquery", "util.base", "ui.tree.node" ], function($, _, Node) {

    var Base = function(handler) {
        var self = this, root = null;

        var $obj = handler.$obj,
            $tpl = handler.$tpl;

        var iParser = _.index();


        function createNode(data, no, pNode) {
            var node = new Node(data, $tpl.node);

            node.parent = (pNode) ? pNode : null;
            node.reload(no);

            return node;
        }

        function setNodeChildAll(dataList, node) {
            var c_nodes = node.children;

            if(c_nodes.length > 0) {
                for(var i = 0; i < c_nodes.length; i++) {
                    dataList.push(c_nodes[i]);

                    if(c_nodes[i].children.length > 0) {
                        setNodeChildAll(dataList, c_nodes[i]);
                    }
                }
            }
        }

        function getNodeChildLeaf(keys, node) {
            if(!node) return null;
            var tmpKey = keys.shift();

            if(tmpKey == undefined) {
                return node;
            } else {
                return getNodeChildLeaf(keys, node.children[tmpKey]);
            }
        }

        function insertNodeDataChild(index, data) {
            var keys = iParser.getIndexList(index);

            var pNode = self.getNodeParent(index),
                nodenum = keys[keys.length - 1];
            node = createNode(data, nodenum, pNode);

            // 데이터 갱신
            pNode.insertChild(nodenum, node);

            return node;
        }

        function appendNodeData(data) {
            if(root == null) {
                root = createNode(data);;
                $obj.tree.append(root.element);
            } else {
                var node = createNode(data, root.children.length, root);
                root.appendChild(node);
            }

            return node;
        }

        function appendNodeDataChild(index, data) {
            var pNode = self.getNode(index),
                cNode = createNode(data, pNode.children.length, pNode);

            pNode.appendChild(cNode);

            return cNode;
        }

        function isRelative(node, targetNode) {
            var nodeList = [];

            while(true) {
                var tNode = targetNode.parent;

                if(tNode) {
                    nodeList.push(tNode);
                    targetNode = tNode;
                } else {
                    break;
                }
            }

            for(var i = 0; i < nodeList.length; i++) {
                if(node == nodeList[i]) {
                    return true;
                }
            }

            return false;
        }


        this.appendNode = function() {
            var index = arguments[0], data = arguments[1];

            if(!data) {
                return appendNodeData(index);
            } else {
                return appendNodeDataChild(index, data);
            }
        }

        this.insertNode = function(index, data) {
            if(root.children.length == 0 && parseInt(index) == 0) {
                return this.appendNode(data);
            } else {
                return insertNodeDataChild(index, data);
            }
        }

        this.updateNode = function(index, data) {
            var node = this.getNode(index);

            for(var key in data) {
                node.data[key] = data[key];
            }

            node.reload(node.nodenum, true);
            node.reloadChildrens();

            return node;
        }

        this.removeNode = function(index) {
            this.getNode(index).destroy();
        }

        this.removeNodes = function() {
            var nodes = root.children;

            if(nodes.length > 0) {
                var node = nodes.pop();

                node.parent = null;
                node.destroy();

                this.removeNodes();
            }
        }

        this.openNode = function(index) {
            if(index == null) this.getRoot().open();
            else this.getNode(index).open();
        }

        this.foldNode = function(index) {
            if(index == null) this.getRoot().fold();
            else this.getNode(index).fold();
        }

        this.openNodeAll = function(index) {
            var nodeList = this.getNodeAll(index);

            for(var i = 0; i < nodeList.length; i++) {
                nodeList[i].open();
            }

            if(index == null) this.getRoot().open();
        }

        this.foldNodeAll = function(index) {
            var nodeList = this.getNodeAll(index);

            for(var i = 0; i < nodeList.length; i++) {
                nodeList[i].fold();
            }

            if(index == null) this.getRoot().fold();
        }

        this.moveNode = function(index, targetIndex) {
            if(index == targetIndex) return;

            var node = this.getNode(index),
                tpNode = this.getNodeParent(targetIndex);
            var indexList = iParser.getIndexList(targetIndex);
            tNo = indexList[indexList.length - 1];

            if(!isRelative(node, tpNode)) {
                // 기존의 데이터
                node.parent.children.splice(node.nodenum, 1);
                node.parent.reloadChildrens();
                node.parent = tpNode;

                // 이동 대상 데이터 처리
                var preNodes = tpNode.children.splice(0, tNo);
                preNodes.push(node);

                tpNode.children = preNodes.concat(tpNode.children);
                tpNode.reloadChildrens();
            }
        }

        this.getNode = function(index) {
            if(index == null) return root.children;
            else {
                var nodes = root.children;

                if(iParser.isIndexDepth(index)) {
                    var keys = iParser.getIndexList(index);
                    return getNodeChildLeaf(keys, nodes[keys.shift()]);
                } else {
                    return (nodes[index]) ? nodes[index] : null;
                }
            }
        }

        this.getNodeAll = function(index) {
            var dataList = [],
                tmpNodes = (index == null) ? root.children : [ this.getNode(index) ];

            for(var i = 0; i < tmpNodes.length; i++) {
                if(tmpNodes[i]) {
                    dataList.push(tmpNodes[i]);

                    if(tmpNodes[i].children.length > 0) {
                        setNodeChildAll(dataList, tmpNodes[i]);
                    }
                }
            }

            return dataList;
        }

        this.getNodeParent = function(index) { // 해당 인덱스의 부모 노드를 가져옴 (단, 해당 인덱스의 노드가 없을 경우)
            var keys = iParser.getIndexList(index);

            if(keys.length == 1) {
                return root;
            } else if(keys.length == 2) {
                return this.getNode(keys[0]);
            } else if(keys.length > 2) {
                keys.pop();
                return this.getNode(keys.join("."));
            }
        }

        this.getRoot = function() {
            return root;
        }
    }

    return Base;
});


jui.defineUI("ui.tree", [ "util.base", "ui.tree.base" ], function(_, Base) {

    /**
     * @class ui.tree
     * implements Tree Component
     * @extends core
     * @alias Tree
     * @requires util.base
     * @requires ui.tree.base
     *
     */
	var UI = function() {
		var dragIndex = { start: null, end: null },
            nodeIndex = null,
			iParser = _.index();


		function setNodeStatus(self, nodeList) {
			for(var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i];
				$(node.element).removeClass("open fold leaf last");
				
				if(node.parent && node.isLeaf()) {
					$(node.element).addClass("leaf");
				} else {
					if(node.type == "open") {
						$(node.element).addClass("open");
						node.open();
					} else {
						$(node.element).addClass("fold");
						node.fold();
					}
				}
				
				if(!node.parent) {
					$(node.element).addClass("root");
				} else {
					if(node.parent.lastChild() == node) {
						$(node.element).addClass("last");
					}
				}
				
				$(node.element).children("i:first-child").remove();
				$(node.element).prepend($("<i></i>"));
			}
		}
		
		function toggleNode(self, index, callback) {
			if(index == null) {
				if(self.options.rootHide) {
					var childs = self.uit.getRoot().children;
					
					for(var i = 0; i < childs.length; i++) {
						callback(childs[i].index);
					}
					
					reloadUI(self,  false);
				} else {
					callback(index);
					reloadUI(self,  true);
				}
			} else {
				callback(index);
				reloadUI(self,  false);
			}
		}
		
		function setEventNodes(self, nodeList) {
			for(var i = 0; i < nodeList.length; i++) {
				(function(node) {
					var $elem = $(node.element);
					
					self.addEvent($elem.children("i:first-child"), "click", function(e) {
						if(node.type == "open") {
							self.fold(node.index, e);
						} else {
							self.open(node.index, e);
						}
						
						e.stopPropagation();
					});
					
					self.addEvent($elem.children("a,span,div")[0], "click", function(e) {
                        if($elem.hasClass("disabled") || $elem.attr("disabled")) return;

						self.emit("select", [ node, e ]);
						e.stopPropagation();
					});
				})(nodeList[i]);
			}
		}
		
		function setEventDragNodes(self, nodeList) {
			if(!self.options.drag) return;
			
			var root = self.uit.getRoot();
			$("body").off("mousemove").off("mouseup");

			for(var i = 0; i < nodeList.length; i++) {
				(function(node) {
					$(node.element).off("mousedown").off("mouseup");
					
					self.addEvent(node.element, "mousedown", function(e) {
						if(e.target.tagName == "I") return;
						
						if(dragIndex.start == null) {
							dragIndex.start = node.index;
							self.emit("dragstart", [ node.index, e ]);
						}
						
						return false;
					});

					self.addEvent(node.element, "mouseup", function(e) {
						if(e.target.tagName == "I") return;
						
						if(self.options.dragChild !== false) {
							if(dragIndex.start && dragIndex.start != node.index) {
								var cNode = node.lastChild(),
									endIndex = (cNode) ? iParser.getNextIndex(cNode.index) : node.index + ".0";
								
								self.move(dragIndex.start, endIndex);
								self.emit("dragend", [ endIndex, e ]);
							}
						}
						
						dragIndex.start = null;
						dragIndex.end = null;
						
						return false;
					});

					self.addEvent(root.element, "mouseup", function(e) {
						if(e.target.tagName == "I") return;

						if(self.options.dragChild !== false) {
							if(dragIndex.start) {
								var endIndex = "" + root.children.length;
								
								self.move(dragIndex.start, endIndex);
								self.emit("dragend", [ endIndex, e ]);
							}
						}
						
						dragIndex.start = null;
						dragIndex.end = null;
						
						return false;
					});
				})(nodeList[i]);
			}
			
			self.addEvent("body", "mouseup", function(e) {
				if(dragIndex.start && dragIndex.end) {
					self.move(dragIndex.start, dragIndex.end);
					self.emit("dragend", [ dragIndex.end, e ]);
				}
				
				dragIndex.start = null;
				dragIndex.end = null;
				
				return false;
			});
		}
		
		function setDragNodes(self) {
			if(!self.options.drag) return;
			
			$(self.root).find(".drag").remove();
			var nodeList = self.listAll();
			
			for(var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i],
					pos = $(node.element).position();
				
				if(pos.top > 0) { // top이 0이면, hide된 상태로 간주
					addDragElement(self, node, pos);
				}
			}
		}

		function setDragLastNodes(self) {
			if(!self.options.drag) return;
			var nodeList = self.listAll();
			
			for(var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i],
				pos = $(node.element).position();
				
				if(pos.top > 0 && node.parent) { // top이 0이면, hide된 상태로 간주
					if(node.parent.lastChild() == node) {
						pos.top = pos.top + $(node.element).outerHeight();
						addDragElement(self, node, pos, true);
					}
				}
			}
		}
		
		function addDragElement(self, node, pos, isLast) {
			if(!self.options.drag) return;
			
			var index = (isLast) ? iParser.getNextIndex(node.index) : node.index;
			var $drag = $("<div class='drag'></div>")
				.attr("data-index", index)
				.css(pos)
				.outerWidth($(node.element).outerWidth());

			$(self.root).append($drag);
			
			self.addEvent($drag, "mouseover", function(e) {
				if(dragIndex.start) {
					dragIndex.end = index;
					$drag.addClass("on");
				}
			});

			self.addEvent($drag, "mouseout", function(e) {
				if(dragIndex.start) {
					$drag.removeClass("on");
				}
			});
		}
		
		function reloadUI(self, isRoot) {
			var nodeList = self.listAll();
			
			setNodeStatus(self, nodeList);
			setEventNodes(self, nodeList);
			setEventDragNodes(self, nodeList);
			setDragNodes(self); // 차후에 개선
			setDragLastNodes(self);
			
			if(isRoot) {
				setNodeStatus(self, [ self.uit.getRoot() ]);
				setEventNodes(self, [ self.uit.getRoot() ]);
			}
		}


		this.init = function() {
			var self = this, opts = this.options;
			
			// UITable 객체 생성
			this.uit = new Base({ $obj: { tree: $(this.root) }, $tpl: this.tpl }); // 신규 테이블 클래스 사용
			
			// 루트 데이터 처리
			if(opts.root) {
				this.uit.appendNode(opts.root);
				reloadUI(this, true);
			} else {
				throw new Error("JUI_CRITICAL_ERROR: root data is required");
			}
			
			// 루트 숨기기
			if(opts.rootHide) {
				var root = this.uit.getRoot();
				
				$(root.element).css("padding-left", "0px");
				$(root.element).children("*:not(ul)").hide();
			}
			
			// 루트 접기
			if(opts.rootFold) {
				this.fold();
			}
		}

        /**
         * @method update
         * Changes to the node at a specified index.
         *
         * @param {Integer} index
         * @param {Array} data
         */
		this.update = function(index, data) {
            var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
                index = (arguments.length == 2) ? arguments[0] : null;

            if(index != null) {
                this.uit.updateNode(index, dataList);
            } else {
                var iParser = _.index();

                // 전체 로우 제거
                this.uit.removeNodes();

                // 트리 로우 추가
                for(var i = 0; i < dataList.length; i++) {
                    var pIndex = iParser.getParentIndex(dataList[i].index);

                    if(pIndex == null) {
                        this.uit.appendNode(dataList[i].data);
                    } else {
                        this.uit.appendNode(pIndex, dataList[i].data);
                    }
                }
            }

            reloadUI(this);
		}

        /**
         * @method append
         * Adds to a child node at a specified index.
         *
         * @param {Array/String} param1 index or data
         * @param {Array} param2 null or data
         */
		this.append = function() {
			var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
				index = (arguments.length == 2) ? arguments[0] : null;
				
			dataList = (dataList.length == undefined) ? [ dataList ] : dataList;
			
			for(var i = 0; i < dataList.length; i++) {
				if(index != null) this.uit.appendNode(index, dataList[i]);
				else this.uit.appendNode(dataList[i]);
			}
			
			reloadUI(this); // 차후에 개선
		}

        /**
         * @method insert
         * Adds a node at a specified index.
         *
         * @param {String} index
         * @param {Array} data
         */
		this.insert = function(index, data) {
			var dataList = (data.length == undefined) ? [ data ] : data;
			
			for(var i = 0; i < dataList.length; i++) {
				this.uit.insertNode(index, dataList[i]);
			}
			
			reloadUI(this); // 차후에 개선
		}

        /**
         * @method select
         * Adds a node at a specified index.
         *
         * @param {String} index
         * @return {NodeObject} node
         */
		this.select = function(index) {
			var node = (index == null) ? this.uit.getRoot() : this.get(index);
			
			$(this.root).find("li").removeClass("active");
			$(node.element).addClass("active");

            nodeIndex = index;
			return node;
		}

        /**
         * @method unselect
         * Removes the 'active' class from a selected node and gets an instance of the specified node.
         */
        this.unselect = function() {
            if(nodeIndex == null) return;
            var node = this.get(nodeIndex);

            $(node.element).removeClass("active");
            nodeIndex = null;

            return node;
        }

        /**
         * @method remove
         * Deletes a node at a specified index.
         *
         * @param {String} index
         */
		this.remove = function(index) {
			this.uit.removeNode(index);
			reloadUI(this); // 차후에 개선
		}

        /**
         * @method reset
         * Deletes all child nodes except for a root.
         */
		this.reset = function() {
			this.uit.removeNodes();
			reloadUI(this); // 차후에 개선
		}

        /**
         * @method move
         * Moves a node at a specified index to the target index.
         *
         * @param {String} index
         * @param {String} targetIndex
         */
		this.move = function(index, targetIndex) {
			this.uit.moveNode(index, targetIndex);
			reloadUI(this); // 차후에 개선
		}

        /**
         * @method open
         * Shows a child node at a specified index.
         *
         * @param {String} index
         */
		this.open = function(index, e) { // 로트 제외, 하위 모든 노드 대상
			if(index == null && this.options.rootHide) return;
			var isRoot = (index == null);
			
			this.uit.openNode(index);
			reloadUI(this, isRoot); // 차후에 개선

			this.emit("open", [ (isRoot) ? this.uit.getRoot() : this.get(index), e ]);
		}

        /**
         * @method fold
         * Folds up a child node at a specified index.
         *
         * @param {String} index
         */
		this.fold = function(index, e) {
			if(index == null && this.options.rootHide) return;
			var isRoot = (index == null);

			this.uit.foldNode(index);
			reloadUI(this, isRoot); // 차후에 개선
			
			this.emit("fold", [ (isRoot) ? this.uit.getRoot() : this.get(index), e ]);
		}

        /**
         * @method openAll
         * Shows all child nodes at a specified index.
         *
         * @param {String} index
         */
		this.openAll = function(index) { // 로트 포함, 하위 모든 노드 대상
			var self = this,
				isRoot = (index == null);
			
			toggleNode(this, index, function(i) {
				self.uit.openNodeAll(i);
			});

			this.emit("openall", [ (isRoot) ? this.uit.getRoot() : this.get(index) ]);
		}

        /**
         * @method foldAll
         * Folds up all child nodes at a specified index.
         *
         * @param {String} index
         */
		this.foldAll = function(index) {
			var self = this,
				isRoot = (index == null);

			toggleNode(this, index, function(i) {
				self.uit.foldNodeAll(i);
			});

			this.emit("foldall", [ (isRoot) ? this.uit.getRoot() : this.get(index) ]);
		}

        /**
         * @method list
         * Return all nodes of the root.
         *
         * @return {Array} nodes
         */
		this.list = function() {
			return this.uit.getNode();
		}

        /**
         * @method listAll
         * Returns all child nodes.
         *
         * @return {Array} nodes
         */
		this.listAll = function() {
			return this.uit.getNodeAll();
		}

        /**
         * @method listParent
         * Returns all parent nodes at a specified index.
         *
         * @param {String} index
         * @return {Array} nodes
         */
		this.listParents = function(index) {
			var node = this.get(index),
				parents = [];
			
			if(node.parent) {
				addParent(node.parent);
			}
			
			function addParent(node) {
				if(node.index != null) {
					parents.push(node);
					
					if(node.parent != null) {
						addParent(node.parent);
					}
				}
			}
			
			return parents.reverse();
		}

        /**
         * @method get
         * Gets a node at a specified index
         *
         * @param {String} index
         * @return {NodeObject} node
         */
		this.get = function(index) {
			if(index == null) return null;
			return this.uit.getNode(index);
		}

        /**
         * @method getAll
         * Gets all nodes at a specified index including child nodes.
         *
         * @param {String} index
         * @return {Array} nodes
         */
		this.getAll = function(index) {
			if(index == null) return null;
			return this.uit.getNodeAll(index);
		}

        /**
         * @method activeIndex
         * Gets the index of a node that is activated in an active state.
         *
         * @return {Integer} index
         */
        this.activeIndex = function() {
            return nodeIndex;
        }
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {NodeObject} [root=null]
             * Adds a root node (required).
             */
            root: null,

            /**
             * @cfg {Boolean} [rootHide=false]
             * Hides a root node.
             */
            rootHide: false,

            /**
             * @cfg {Boolean} [rootFold=false]
             * Folds up a root node.
             */
            rootFold: false,

            /**
             * @cfg {Boolean} [drag=false]
             * It is possible to drag the movement of a node.
             */
            drag: false,

            /**
             * @cfg {Boolean} [dragChild=true]
             * It is possible to drag the node movement but the node is not changed to a child node of the target node.
             */
            dragChild: true
        }
    }

    /**
     * @event select
     * Event that occurs when a node is selected
     *
     * @param {NodeObject) node
     * @param {EventObject} e The event object
     */

    /**
     * @event open
     * Event that occurs when a node is shown
     *
     * @param {NodeObject) node
     * @param {EventObject} e The event object
     */

    /**
     * @event fold
     * Event that occurs when a node is hidden
     *
     * @param {NodeObject) node
     * @param {EventObject} e The event object
     */

    /**
     * @event dragstart
     * Event that occurs when a node starts to move
     *
     * @param {Integer) index Node's index
     * @param {EventObject} e The event object
     */

    /**
     * @event dragend
     * Event that occurs when the movement of a node is completed
     *
     * @param {Integer) index Node's index
     * @param {EventObject} e The event object
     */
	
	return UI;
});
jui.defineUI("ui.window", [ "jquery", "util.base", "ui.modal" ], function($, _, modal) {

    /**
     * @class ui.window
     * The window is a layer component that can replace pop-ups
     *
     * @extends core
     * @alias Window
     * @requires jquery
     * @requires util.base
     * @requires ui.modal
     *
     */
	var UI = function() {
		var z_index = 2000,
			target = null,
			move = {},
			resize = {},
			info = {},
			ui_modal = null;

		function setBodyResize() {
			var bottom = (info.$foot.length < 1) ? 5 : info.$foot.outerHeight();
			info.$body.outerHeight(info.$root.outerHeight() - info.$head.outerHeight() - bottom);
		}

		this.init = function() {
			var self = this, opts = this.options;
			
			var $win_root = $(this.root),
				$win_head = $(this.root).children(".head"),
				$win_body = $(this.root).children(".body"),
				$win_foot = $(this.root).children(".foot");
				
			// 옵션 예외 처리
			if(opts.modal) {
				opts.move = false;
				opts.resize = false;
			}
				
			// UI 객체 추가
			info = { $root: $win_root, $head: $win_head, $body: $win_body, $foot: $win_foot };
			
			// 기본 스타일 & Modal 스타일 & Body로 강제 이동
			$win_root.css($.extend({ position: "absolute" }, opts)).appendTo($("body"));
			
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
			$win_root.hide();

			// 모달 컴포넌트 설정
			if(opts.modal) {
				var modalOpts = (opts.modalIndex > 0) ? { index: opts.modalIndex } : {};
				ui_modal = modal(self.root, $.extend({ autoHide: false }, modalOpts));
			}
		}

        /**
         * @method hide
         * Hides a window
         */
		this.hide = function() {
			if(ui_modal) ui_modal.hide();
			else info.$root.hide();
			
			this.emit("hide");
			this.type = "hide";
		}

        /**
         * @method show
         * Shows a window at specified coordinates
         *
         * @param {Integer} x
         * @param {Integer} y
         */
		this.show = function(x, y) {
			if(ui_modal) ui_modal.show();
			else info.$root.show();
			
			if(x || y) this.move(x, y);
			
			this.emit("show");
			this.type = "show";

			setBodyResize();
		}

        /**
         * @method move
         * Moves a window at specified coordinates
         *
         * @param {Integer} x
         * @param {Integer} y
         */
		this.move = function(x, y) {
			info.$root.css("left", x);
			info.$root.css("top", y);
		}

        /**
         * @method update
         * Changes the markup in the body area of a window
         *
         * @param {String} html
         */
		this.update = function(html) {
			info.$body.empty().html(html);
		}

        /**
         * @method setTitle
         * Changes the markup of the title tag in the head area of a window
         *
         * @param {String} title
         */
		this.setTitle = function(html) {
			info.$head.find(".title").empty().html(html);
		}

        /**
         * @method setSize
         * Changes the horizontal/vertical size of a window
         *
         * @param {Integer} width
         * @param {Integer} height
         */
		this.setSize = function(w, h) {
			info.$root.width(w);
			info.$root.height(h);
			
			setBodyResize();
		}

        /**
         * @method resize
         * Designates a scroll area if there is a lot of content in the window body area
         */
		this.resize = function() {
			setBodyResize();
		}

        /**
         * @method resizeModal
         * Re-adjust the location of a modal window
         */
        this.resizeModal = function() {
            if(!ui_modal) return;

            ui_modal.resize();
        }
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {Integer} [width=400]
             * Determines the horizontal size of a window
             */
			width: 400,

            /**
             * @cfg {Integer} [height=300]
             * Determines the height of a window
             */
			height: 300,

            /**
             * @cfg {String/Integer} [left="auto"]
             * Determines the X coordinate of a window
             */
			left: "auto",

            /**
             * @cfg {String/Integer} [top="auto"]
             * Determines the Y coordinate of a window
             */
			top: "auto",

            /**
             * @cfg {String/Integer} [right="auto"]
             * Determines the X coordinate based on the right side of a window
             */
			right: "auto",

            /**
             * @cfg {String/Integer} [bottom="auto"]
             * Determines the Y coordinate based on the bottom side of a window
             */
			bottom: "auto",

            /**
             * @cfg {Boolean} [modal=false]
             * Applies a modal UI to a window
             */
			modal: false,

            /**
             * @cfg {Boolean} [move=true]
             * It is possible to move a window
             */
			move: true,

            /**
             * @cfg {Boolean} [resize=true]
             * It is possible to resize a window
             */
			resize: true,

            /**
             * @cfg {Integer} [modalIndex=0]
             * Determines the z-index property of a modal UI
             */
			modalIndex: 0,

            /**
             * @cfg {Boolean} [animate=false]
             * Determines whether to use the animation effect of a UI
             *
             * @deprecated
             */
			animate: false
        }
    }

    /**
     * @event show
     * Event that occurs when a window is shown
     */

    /**
     * @event hide
     * Event that occurs when a window is hidden
     */

    /**
     * @event move
     * Event that occurs when a window is moved
     *
     * @param {EventObject} e The event object
     */

    /**
     * @event resize
     * Event that occurs when a window is resized
     *
     * @param {EventObject} e The event object
     */
	
	return UI;
});