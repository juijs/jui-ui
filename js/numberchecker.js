jui.defineUI("ui.numberchecker", [ "jquery" ], function($) {

    /**
     * @class ui.numberchecker
     *
     * @extends core
     * @alias NumberChecker
     * @requires jquery
     *
     */
    var UI = function() {
        var $focus = null;

        function validNumberType(value, isInt) {
            var regex = isInt ? /^\d+$/ : /^[-]?\d+(?:[.]\d+)?$/;

            if(!regex.test(value)) {
                return false;
            }

            return true;
        }

        function getDefaultValue(self) {
            var $element = $(self.root);

            var opts = self.options,
                isInt = opts.int,
                step = $element.attr("step") || "",
                min = $element.attr("min") || "",
                max = $element.attr("max") || "",
                value = $element.val();

            if(!isInt && step != "any") {
                step = "any";
            } else if(isInt && step == "any") {
                step = "";
            }

            return {
                step: step,
                min: opts.min ? opts.min : min,
                max: opts.max ? opts.max : max,
                value: opts.value ? opts.value : value,
            }
        }

        this.init = function() {
            var element = this.root,
                isInt = this.options.int,
                message = this.options.message,
                opts = getDefaultValue(this);

            // 초기 값 유효성 검사
            if(validNumberType(opts.value, isInt)) {
                $(element).val(opts.value);
            } else {
                $(element).addClass("invalid").val("").attr("placeholder", message);
            }

            $(element).attr(opts);

            $(element).on("focus", function(e) {
                $(element).removeClass("invalid").attr("placeholder", "");
            });

            $(element).on("focusout", function(e) {
                var value = $(this).val();

                if(!validNumberType(value, isInt)) {
                    $(element).addClass("invalid").val("").attr("placeholder", message);
                }
            });

            return this;
        }
    }

    UI.setup = function() {
        return {
            int: true,
            min: null,
            max: null,
            value: null,
            message: "Invalid number"
        };
    }

    return UI;
});