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

        function updateNumberValue(elem, max) {
            var val = parseInt($(elem).val());

            if(val > max) $(elem).val(max);
        }

        function initElements(self) {
            var hours = self.options.hours,
                minutes = self.options.minutes;

            var $hours = $(self.root).children(".hours").attr("maxlength", 2),
                $minutes = $(self.root).children(".minutes").attr("maxlength", 2);

            $hours.on("keypress", validNumberType);
            $hours.on("keyup", function(e) {
                updateNumberValue(this, 23);
            });

            $minutes.on("keypress", validNumberType);
            $minutes.on("keyup", function(e) {
                updateNumberValue(this, 59);
            });

            $hours.val(hours < 10 ? "0" + hours : hours);
            $minutes.val(minutes < 10 ? "0" + minutes : minutes);
        }

        this.init = function() {
            initElements(this);

            return this;
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