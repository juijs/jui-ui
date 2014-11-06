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

		// Private
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
	
	var UI = function() {
		var ui_list = {};


		/**
		 * Public Methods
		 * 
		 */

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
		
		this.setIndex = function(indexList) {
            var btn = ui_list[this.options.type];

			btn.options.index = indexList;
            btn._setting("init", null, "index");

            this.emit("change", [ btn.data ]);
		}

		this.setValue = function(valueList) {
            var btn = ui_list[this.options.type];

            btn.options.value = valueList;
            btn._setting("init", null, "value");

            this.emit("change", [ btn.data ]);
		}
		
		this.getData = function() {
			return ui_list[this.options.type].data;
		}
		
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

		this.reload = function() {
			ui_list[this.options.type]._setting("init");
		}
	}

    UI.setup = function() {
        return {
			type: "radio",
			index: 0,
			value: ""
        }
    }
	
	return UI;
});