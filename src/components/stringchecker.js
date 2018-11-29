import $ from "jquery"
import jui from "../main.js"

export default {
    name: "ui.stringchecker",
    extend: "event",
    component: function () {
        var UI = function() {
            var patterns = {
                email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                url: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
                color: /#?([A-Fa-f0-9]){3}(([A-Fa-f0-9]){3})?/
            };

            function validStringType(self, value, opts, event) {
                if(opts.validJson) {
                    var jsonStr = '{ "key":"' + value + '" }';

                    try {
                        JSON.parse(jsonStr);
                    } catch (e) {
                        if(event) {
                            updatePlaceholder(self, self.emit("invalid", [ "json", value ]));
                        }

                        return false;
                    }
                }

                if(opts.validBlank) {
                    if($.trim(value) == "") {
                        updatePlaceholder(self, self.emit("invalid", [ "blank" ]));
                    }
                }

                if(opts.pattern != null) {
                    if(typeof(opts.pattern) == "string") {
                        var result = false,
                            type = opts.pattern.toLowerCase(),
                            regex = patterns[type];

                        if(regex != null) {
                            result = regex.test(value);
                        }

                        if(!result && event) {
                            updatePlaceholder(self, self.emit("invalid", [ type, value ]));
                        }

                        return result;
                    } else if(typeof(opts.pattern) == "object") {
                        var result = regex.test(value);

                        if(!result && event) {
                            updatePlaceholder(self, self.emit("invalid", [ "regex", value ]));
                        }

                        return result;
                    }
                }

                if(opts.minLength != -1) {
                    if(value.length < opts.minLength) {
                        updatePlaceholder(self, self.emit("invalid", [ "min", value ]));
                    }
                }

                if(opts.maxLength != -1) {
                    if(value.length > opts.maxLength) {
                        updatePlaceholder(self, self.emit("invalid", [ "max", value ]));
                    }
                }

                return true;
            }

            function getDefaultValue(self) {
                var $element = $(self.root);

                var opts = self.options,
                    value = $element.val() || "";

                return {
                    value: value,
                    validJson: opts.validJson,
                    validBlank: opts.validBlank,
                    minLength: opts.minLength,
                    maxLength: opts.maxLength,
                    pattern: opts.pattern
                }
            }

            function getValidData(value) {
                var value = "" + value;

                return {
                    value: value
                }
            }

            function updatePlaceholder(self, message) {
                if(typeof(message) == "string" && message != "") {
                    $(self.root).attr("placeholder", message);
                } else {
                    var optMessage = self.options.message;

                    if(typeof(optMessage) == "string" && optMessage != "") {
                        $(self.root).attr("placeholder", optMessage);
                    }
                }

                $(self.root).addClass("invalid").val("");
            }

            this.init = function() {
                var self = this,
                    element = this.root,
                    opts = getDefaultValue(this);

                // 입력된 값이 유효하면 value를 변경한다. 차후에 유효성 검사 실패시 초기값으로 사용함.
                $(element).on("input", function(e) {
                    var value = $(element).val();

                    if(validStringType(self, value, opts, false)) {
                        var data = getValidData(value);
                        opts.value = data.value;
                    }
                });

                $(element).on("focus", function(e) {
                    $(element).removeClass("invalid").attr("placeholder", "");
                });

                $(element).on("focusout", function(e) {
                    var value = $(element).val();

                    if(!validStringType(self, value, opts, true)) {
                        updatePlaceholder(self, null);
                    } else {
                        var data = getValidData(value);
                        $(element).val(data.value);
                    }
                });

                // 초기 값 유효성 검사
                setTimeout(function() {
                    if(validStringType(self, opts.value, opts, true)) {
                        $(element).val(opts.value);
                    } else {
                        updatePlaceholder(self, null);
                    }

                }, 100);

                return this;
            }
        }

        UI.setup = function() {
            return {
                validJson: true,
                validBlank: false,
                minLength: -1,
                maxLength: -1,
                pattern: null, // regex or string type (email, url, color, ...)
                message: null
            };
        }

        return UI;
    }
}