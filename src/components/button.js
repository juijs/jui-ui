import $ from "jquery"
import jui from "../main.js"

export default {
    name: "ui.button",
    extend: "event",
    component: function () {
        var _ = jui.include("util.base");

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
                    if($(e.currentTarget).hasClass("disabled")) {
                        return false;
                    }

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

            /**
             * @method enable
             * Enables the tab at a specified index
             *
             * @param {Boolean} isActive
             */
            this.enable = function(isActive) {
                if(isActive) {
                    $(this.root).find(".btn").removeClass("disabled");
                } else {
                    $(this.root).find(".btn").addClass("disabled");
                }
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
    }
}