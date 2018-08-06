import $ from "jquery"
import jui from "../main.js"

export default {
    name: "ui.numberchecker",
    extend: "event",
    component: function () {
        var _ = jui.include("util.base");

        var UI = function() {
            function validNumberType(value, isInt) {
                var regex = isInt ? /^[-]?\d+$/ : /^[-]?\d+(?:[.]\d+)?$/;

                if(!regex.test(value)) {
                    return false;
                }

                return true;
            }

            function getDefaultValue(self) {
                var $element = $(self.root);

                var opts = self.options,
                    isInt = opts.integer,
                    min = $element.attr("min") || "",
                    max = $element.attr("max") || "",
                    value = $element.val() || "";

                return {
                    min: opts.min != null ? opts.min : min,
                    max: opts.max != null? opts.max : max,
                    value: value
                }
            }

            function getValidData(value, min, max, isInt) {
                var value = (isInt) ? parseInt(value) : parseFloat(value),
                    min = (isInt) ? parseInt(min) : parseFloat(min),
                    max = (isInt) ? parseInt(max) : parseFloat(max);

                return {
                    min: min,
                    max: max,
                    value: value
                }
            }

            this.init = function() {
                var element = this.root,
                    isInt = this.options.integer,
                    empty = this.options.empty,
                    message = this.options.message,
                    opts = getDefaultValue(this);

                // 초기 값 유효성 검사
                if(validNumberType(opts.value, isInt)) {
                    $(element).val(opts.value);
                } else {
                    $(element).addClass("invalid").val("").attr("placeholder", message);
                }

                if(!isInt) {
                    $(element).attr("step", "any");
                }

                $(element).attr("min", opts.min);
                $(element).attr("max", opts.max);

                // 입력된 값이 유효하면 value를 변경한다. 차후에 유효성 검사 실패시 초기값으로 사용함.
                $(element).on("input", function(e) {
                    var value = $(element).val();

                    if(validNumberType(value, isInt)) {
                        var data = getValidData(value, opts.min, opts.max, isInt);

                        if(opts.min !== "" && opts.max !== "") {
                            if(value >= data.min && value <= data.max) {
                                opts.value = data.value;
                            }
                        }

                        if(opts.min !== "" && opts.max === "") {
                            if(value >= data.min) opts.value = data.value;
                        }

                        if(opts.min === "" && opts.max !== "") {
                            if(value <= data.max) opts.value = data.value;
                        }
                    }
                });

                $(element).on("focus", function(e) {
                    $(element).removeClass("invalid").attr("placeholder", "");
                });

                $(element).on("focusout", function(e) {
                    var value = $(element).val();

                    if(!validNumberType(value, isInt)) {
                        if(empty != null) {
                            $(element).val(opts[empty]);
                        } else {
                            $(element).addClass("invalid").val("").attr("placeholder", message);
                        }
                    } else {
                        var data = getValidData(value, opts.min, opts.max, isInt);

                        if(opts.min !== "" && data.value < data.min) {
                            $(element).val(data.min);
                        } else if(opts.max !== "" && data.value > data.max) {
                            $(element).val(data.max);
                        } else {
                            $(element).val(data.value);
                        }
                    }
                });

                return this;
            }
        }

        UI.setup = function() {
            return {
                integer: true,
                empty: null, // min or max or value
                min: null,
                max: null,
                message: "Invalid number"
            };
        }

        return UI;
    }
}