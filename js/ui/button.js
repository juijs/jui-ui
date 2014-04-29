jui.define('ui.button', [], function() {
	
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
			
			$(self.element).find(".btn").each(function(i) {
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
			this.ui.addEvent(self.element, "click", ".btn", function(e) {
				self._setting("event", e);
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
				
			$(self.element).find(".btn").each(function(i) {
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
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					type: "radio",
					index: 0,
					value: ""
				},
				valid: {
					setIndex: [ [ "integer", "array" ] ],
					setValue: [ [ "integer", "string", "array", "boolean" ] ]
				}
			}
		}
		
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
			
			return this;
		}
		
		this.setIndex = function(indexList) {
			ui_list[this.options.type].options.index = indexList;
			ui_list[this.options.type]._setting("init", null, "index");
		}

		this.setValue = function(valueList) {
			ui_list[this.options.type].options.value = valueList;
			ui_list[this.options.type]._setting("init", null, "value");
		}
		
		this.getData = function() {
			return ui_list[this.options.type].data;
		}
		
		this.getValue = function() {
			return ui_list[this.options.type].data.value;
		}

		this.reload = function() {
			ui_list[this.options.type]._setting("init");
		}
	}
	
	return UI;
});