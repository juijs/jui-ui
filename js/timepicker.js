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
            setTimeout(function() {
                var val = parseInt($(elem).val());

                if(!isNaN(val)) {
                    if(val > max) $(elem).val(max);
                    if(val < 0) $(elem).val(min);
                }
            }, 100);
        }

        function updateUpDownValue(elem, e) {
            if(e.which == 8 || e.which == 16 || e.which == 37 || e.which == 39) return;

            var val = parseInt($(elem).val()),
                dist = 0;

            if(e.which == 38) dist = 1;
            else if(e.which == 40) dist = -1;

            var res = val + dist;
            if(res < 0) res = 0;

            setTimeout(function() {
                $(elem).val(res < 10 ? "0" + res : res);
            }, 100);
        }

        function updateBtnValue(elem, e) {
            $(elem).focus();

            updateUpDownValue(elem, e);
            updateNumberValue(elem, 0, $(elem).hasClass("hours") ? 23 : 59);
        }

        function initInputElements(self) {
            var hours = self.options.hours,
                minutes = self.options.minutes;

            var $hours = $(self.root).children(".hours").attr("maxlength", 2),
                $minutes = $(self.root).children(".minutes").attr("maxlength", 2);

            $hours.on("keypress", validNumberType);
            $hours.on("keyup", function(e) {
                updateUpDownValue(this, e);
                updateNumberValue(this, 0, 23);
                self.emit("change", [ self.getHours(), self.getMinutes() ]);
            });
            $hours.on("focus", function(e) {
                $focus = $hours;
            });

            $minutes.on("keypress", validNumberType);
            $minutes.on("keyup", function(e) {
                updateUpDownValue(this, e);
                updateNumberValue(this, 0, 59);
                self.emit("change", [ self.getHours(), self.getMinutes() ]);
            });
            $minutes.on("focus", function(e) {
                $focus = $minutes;
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
                e.which = 38;
                updateBtnValue($focus[0], e);
                self.emit("change", [ self.getHours(), self.getMinutes() ]);
            });
            $down.on("click", function(e) {
                e.which = 40;
                updateBtnValue($focus[0], e);
                self.emit("change", [ self.getHours(), self.getMinutes() ]);
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
            updateBtnValue($hours[0], {});
        }

        this.getHours = function() {
            return parseInt($(this.root).children(".hours").val());
        }

        this.setMinutes = function(minutes) {
            var $minutes = $(this.root).children(".minutes").val(minutes);
            updateBtnValue($minutes[0], {});
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