jui.defineUI("ui.timepicker", [ "jquery" ], function($) {

    /**
     * @class ui.timepicker
     *
     * @extends core
     * @alias Timepicker
     * @requires jquery
     *
     */
    var UI = function() {
        var $focus = null;

        function validNumberType(evt) {
            var theEvent = evt || window.event,
                key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode( key );

            var regex = /[0-9]|\./;
            if(!regex.test(key)) {
                theEvent.returnValue = false;

                if(theEvent.preventDefault) {
                    theEvent.preventDefault();
                }
            }
        }

        function updateNumberValue(elem, min, max) {
            var val = parseInt($(elem).val());

            if(!isNaN(val)) {
                if(val > max) $(elem).val(max);
                if(val < 0) $(elem).val(min);
            } else {
                $(elem).val("00");
            }
        }

        function updateUpDownValue(elem, dist) {
            var val = parseInt($(elem).val());

            var res = val + (dist || 0);
            if(res < 0) res = 0;

            $(elem).val(res < 10 ? "0" + res : res);
        }

        function updateBtnValue(elem, dist, focusout) {
            if(!focusout) $(elem).focus();

            updateUpDownValue(elem, dist);
            updateNumberValue(elem, 0, $(elem).hasClass("hours") ? 23 : 59);
        }

        function settingKeyUpEvent(e) {
            var dist = 0;

            if(e.which == 38) dist = 1;
            else if(e.which == 40) dist = -1;

            if(dist != 0) {
                updateBtnValue(e.target, dist);
            }
        }

        function initInputElements(self) {
            var hours = self.options.hours,
                minutes = self.options.minutes;

            var $hours = $(self.root).children(".hours").attr("maxlength", 2),
                $minutes = $(self.root).children(".minutes").attr("maxlength", 2);

            $hours.on("keypress", validNumberType);
            $hours.on("keyup", settingKeyUpEvent);
            $hours.on("focusout", function(e) {
                updateBtnValue(this, 0, true);
            });
            $hours.on("focus", function(e) {
                $focus = $hours;
                $focus.select();
            });

            $minutes.on("keypress", validNumberType);
            $minutes.on("keyup", settingKeyUpEvent);
            $minutes.on("focusout", function(e) {
                updateBtnValue(this, 0, true);
            });
            $minutes.on("focus", function(e) {
                $focus = $minutes;
                $focus.select();
            });

            $hours.val(hours < 10 ? "0" + hours : hours);
            $minutes.val(minutes < 10 ? "0" + minutes : minutes);

            $focus = $hours;
        }

        function initBtnElements(self) {
            var $icon = $(self.root).children("i"),
                $up = $("<div></div>"),
                $down = $("<div></div>"),
                $hours = $(self.root).children(".hours"),
                $minutes = $(self.root).children(".minutes");

            var width = $icon.outerWidth(),
                height = $(self.root).outerHeight(),
                styles = {
                    position: "absolute",
                    width: width,
                    height: height/2,
                    cursor: "pointer",
                    right: $icon.css("right")
                };

            $up.css($.extend({ top: "0px" }, styles));
            $down.css($.extend({ top: height/2 + "px" }, styles));

            $up.on("click", function(e) {
                updateBtnValue($focus[0], 1);
            });
            $down.on("click", function(e) {
                updateBtnValue($focus[0], -1);
            });

            $(self.root).append($up);
            $(self.root).append($down);
        }

        this.init = function() {
            initInputElements(this);
            initBtnElements(this);

            return this;
        }

        this.setHours = function(hours) {
            var $hours = $(this.root).children(".hours").val(hours);
            updateBtnValue($hours[0], 0);
        }

        this.getHours = function() {
            return parseInt($(this.root).children(".hours").val());
        }

        this.setMinutes = function(minutes) {
            var $minutes = $(this.root).children(".minutes").val(minutes);
            updateBtnValue($minutes[0], 0);
        }

        this.getMinutes = function() {
            return parseInt($(this.root).children(".minutes").val());
        }
    }

    UI.setup = function() {
        var now = new Date();

        return {
            hours: now.getHours(),
            minutes: now.getMinutes()
        };
    }

    return UI;
});